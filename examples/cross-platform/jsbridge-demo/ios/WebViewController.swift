import UIKit
import WebKit
import AVFoundation
import CoreLocation

/**
 iOS 侧 WKWebView 容器：完整的 JSBridge 原生实现。

 通道约定（与 h5/jsbridge.js 对齐）：
   - H5 -> Native：window.webkit.messageHandlers.nativeBridge.postMessage(obj)
   - Native -> H5：evaluateJavaScript("window._handleMessageFromNative(json)")
 */
class WebViewController: UIViewController, WKScriptMessageHandler, UIImagePickerControllerDelegate, UINavigationControllerDelegate, CLLocationManagerDelegate {

    private let handlerName = "nativeBridge"
    private var webView: WKWebView!

    // 挂起的回调 id：权限申请 / 相机调起 / 定位都是异步的
    private var pendingCameraId: String?
    private let locationManager = CLLocationManager()
    private var pendingLocationId: String?

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: handlerName)

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(webView)

        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }

        // 注入完成后通知 H5 触发 ready
        evaluateJs("window._onBridgeReady && window._onBridgeReady()")
    }

    // ================= H5 -> Native =================

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard message.name == handlerName,
              let body = message.body as? [String: Any],
              body["type"] as? String == "request",
              let id = body["id"] as? String,
              let method = body["method"] as? String else { return }
        let params = body["params"] as? [String: Any] ?? [:]
        handleMethod(method, params: params, id: id)
    }

    private func handleMethod(_ method: String, params: [String: Any], id: String) {
        switch method {
        case "device.getInfo":
            respond(id: id, result: [
                "platform": "ios",
                "os": UIDevice.current.systemName + " " + UIDevice.current.systemVersion,
                "model": UIDevice.current.model,
                "name": UIDevice.current.name
            ])
        case "location.getCurrentPosition":
            getLocation(id: id)
        case "camera.takePhoto":
            takePhoto(id: id)
        case "network.getType":
            respond(id: id, result: ["type": detectNetworkType()])
        case "ui.toast":
            toast(params["text"] as? String ?? "")
            respond(id: id, result: ["success": true])
        // 扫码等更多能力，在这里加 case 即可；建议用 AVCaptureMetadataOutput
        default:
            respondError(id: id, message: "unknown method: " + method)
        }
    }

    // ================= Native -> H5 =================

    private func evaluateJs(_ js: String) {
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    private func respond(id: String, result: [String: Any]) {
        guard let data = try? JSONSerialization.data(withJSONObject: [
            "type": "response", "id": id, "result": result
        ]),
        let json = String(data: data, encoding: .utf8) else { return }
        evaluateJs("window._handleMessageFromNative(\(json))")
    }

    private func respondError(id: String, message: String) {
        guard let data = try? JSONSerialization.data(withJSONObject: [
            "type": "response", "id": id, "error": message
        ]),
        let json = String(data: data, encoding: .utf8) else { return }
        evaluateJs("window._handleMessageFromNative(\(json))")
    }

    @discardableResult
    private func emit(_ event: String, payload: [String: Any]) -> Bool {
        guard let data = try? JSONSerialization.data(withJSONObject: [
            "type": "event", "event": event, "payload": payload
        ]),
        let json = String(data: data, encoding: .utf8) else { return false }
        evaluateJs("window._handleMessageFromNative(\(json))")
        return true
    }

    // ================= 能力实现 =================

    // ---------- 定位 ----------
    private func getLocation(id: String) {
        let status = CLLocationManager.authorizationStatus()
        switch status {
        case .notDetermined:
            pendingLocationId = id
            locationManager.delegate = self
            locationManager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            pendingLocationId = id
            locationManager.delegate = self
            locationManager.requestLocation()
        default:
            respondError(id: id, message: "location permission denied")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let id = pendingLocationId, let loc = locations.first else { return }
        pendingLocationId = nil
        respond(id: id, result: [
            "lat": loc.coordinate.latitude,
            "lng": loc.coordinate.longitude,
            "accuracy": loc.horizontalAccuracy
        ])
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if let id = pendingLocationId {
            pendingLocationId = nil
            respondError(id: id, message: error.localizedDescription)
        }
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = CLLocationManager.authorizationStatus()
        guard let id = pendingLocationId else { return }
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            manager.requestLocation()
        } else {
            pendingLocationId = nil
            respondError(id: id, message: "location permission denied")
        }
    }

    // ---------- 相机 ----------
    private func takePhoto(id: String) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .notDetermined:
            pendingCameraId = id
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    granted ? self?.launchCamera() : self?.respondError(id: id, message: "camera permission denied")
                }
            }
        case .authorized:
            pendingCameraId = id
            launchCamera()
        default:
            respondError(id: id, message: "camera permission denied")
        }
    }

    private func launchCamera() {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            respondError(id: pendingCameraId ?? "", message: "camera not available")
            return
        }
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = self
        present(picker, animated: true)
    }

    func imagePickerController(_ picker: UIImagePickerController,
                               didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true)
        guard let id = pendingCameraId,
              let image = info[.originalImage] as? UIImage,
              let data = image.jpegData(compressionQuality: 0.8) else { return }
        pendingCameraId = nil
        let base64 = data.base64EncodedString()
        respond(id: id, result: [
            "base64": "data:image/jpeg;base64," + base64,
            "width": Int(image.size.width),
            "height": Int(image.size.height)
        ])
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
        if let id = pendingCameraId {
            pendingCameraId = nil
            respondError(id: id, message: "user cancelled")
        }
    }

    // ---------- 工具 ----------
    private func detectNetworkType() -> String {
        // 简版：真实项目可用 NWPathMonitor 监听；这里用 Reachability 思路简化
        return "unknown"
    }

    private func toast(_ text: String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: nil, message: text, preferredStyle: .alert)
            self.present(alert, animated: true)
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                alert.dismiss(animated: true)
            }
        }
    }
}
