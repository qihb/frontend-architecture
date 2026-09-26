# JSBridge Demo —— 把相机、定位等原生能力交给 H5

配套《番外篇一：手写一个 JSBridge——把相机、定位等原生能力交给 H5》。这个案例演示「原生 + 内嵌 Web」混合开发里最核心的一环：H5 通过 JSBridge 调起相机、定位、扫码等原生能力，并把结果拿回来。

## 架构一览

```text
┌──────────────────────────────────────────────┐
│  H5（h5/jsbridge.js）                         │
│  JSBridge.call('camera.takePhoto') → Promise  │
├──────────────────────────────────────────────┤
│  通信通道                                     │
│  H5 → Native：注入对象 postMessage            │
│  Native → H5：evaluateJavascript              │
├──────────────────────────────────────────────┤
│  Native 壳                                    │
│  android/MainActivity.java（Android）         │
│  ios/WebViewController.swift（iOS）           │
└──────────────────────────────────────────────┘
```

统一消息协议（三类，用 `type` 区分）：

| 类型 | 方向 | 字段 |
| --- | --- | --- |
| `request` | H5 → Native | `id`、`method`、`params` |
| `response` | Native → H5 | `id`、`result` / `error` |
| `event` | Native → H5 | `event`、`payload` |

## 目录结构

```text
jsbridge-demo/
├── README.md             # 本文件
├── h5/                   # H5 侧（可直接在浏览器打开演示）
│   ├── jsbridge.js       #   桥接库：call / on / off / ready
│   ├── mock-native.js    #   浏览器本地 mock，模拟原生回包
│   └── index.html        #   演示页
├── android/
│   └── MainActivity.java #   Android WebView 容器完整实现
└── ios/
    └── WebViewController.swift  # iOS WKWebView 容器完整实现
```

## 运行方式一：纯浏览器快速体验（无需原生环境）

直接用浏览器打开 `h5/index.html` 即可。页面加载后会自动引入 `mock-native.js`，用一段 JS 扮演原生壳：注入 `window.nativeBridge`、处理请求、回包，并每 5 秒推送一次 `networkChange` 事件。

此时你能看到完整链路：

1. 点击「拍照 / 选图」，H5 调用 `JSBridge.call('camera.takePhoto')`；
2. 桥把它变成 `{type:'request', id:'cb_x', method:'camera.takePhoto', params:{...}}` 发给 mock；
3. mock 模拟原生异步回包 `{type:'response', id:'cb_x', result:{base64:...}}`；
4. H5 按 `id` 找到对应 Promise 并 resolve，页面渲染出预览图。

> 注意：`mock-native.js` 模拟的是 Android 的「对象注入」通道，且只用于浏览器演示，真实 App 里应删除它，改由原生容器接管。

## 运行方式二：真机接入

### Android

1. 新建 Android 工程，把 [MainActivity.java](android/MainActivity.java) 放进 `app/src/main/java/com/example/jsbridgedemo/`。
2. 把 `h5/jsbridge.js` 和 `h5/index.html` 放进 `app/src/main/assets/`（**不要**放 `mock-native.js`）。
3. 在 `AndroidManifest.xml` 声明权限与 FileProvider：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<application>
  <activity android:name=".MainActivity" android:exported="true">
    <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
  </activity>

  <provider
      android:name="androidx.core.content.FileProvider"
      android:authorities="${applicationId}.fileprovider"
      android:exported="false"
      android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
  </provider>
</application>
```

4. 新建 `app/src/main/res/xml/file_paths.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
  <cache-path name="cache" path="." />
</paths>
```

5. 依赖里加入 `androidx.core:core`（提供 `FileProvider`、`ActivityCompat`）。

### iOS

1. 新建 iOS 工程，把 [WebViewController.swift](ios/WebViewController.swift) 加进 target。
2. 把 `h5/jsbridge.js` 和 `h5/index.html` 加进 Bundle（**不要**加 `mock-native.js`）。
3. 在 `Info.plist` 声明权限用途文案（缺失会直接崩溃）：

```xml
<key>NSCameraUsageDescription</key>
<string>用于拍摄照片</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>用于获取当前位置</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>用于从相册选择图片</string>
```

## 如何新增一个能力

桥层不用改。以「扫码」为例，三步：

1. **H5 侧**加一个封装函数：`const scan = () => JSBridge.call('scan.scanCode')`；
2. **原生侧**在 `handleMethod` / `switch` 里加一个 `case "scan.scanCode"`，实现扫码并 `respond(id, {code})`；
3. 两边对齐 `method` 字符串与入参、返回字段即可。

## 关键设计点

- **`callbackId` 配对**：并发调用不会串台，靠全局唯一 id 把请求和响应一一对应。
- **`ready` 机制**：原生注入完成后主动执行 `window._onBridgeReady()`，H5 首次调用放在 `JSBridge.ready` 里，避免时序竞态。
- **线程切换**：原生回包必须切回主线程（Android `runOnUiThread`、iOS `DispatchQueue.main.async`）。
- **图片压缩**：回传前先缩放、压缩再 base64，避免大图拖垮性能。
