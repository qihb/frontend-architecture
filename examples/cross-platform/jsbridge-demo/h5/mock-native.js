/**
 * mock-native.js —— 浏览器本地 mock，模拟原生壳
 *
 * 在纯浏览器环境（无 Android/iOS 容器）下打开 index.html 时，
 * 本文件负责扮演「原生侧」：注入 window.nativeBridge，处理 H5 请求并回包。
 *
 * 注意：它模拟的是 Android 的「对象注入」通道。真实 App 里这段逻辑在
 * MainActivity.java（Android）或 WebViewController.swift（iOS）中。
 */
(function (global) {
  'use strict';

  // 模拟原生注入对象，对应 Android 的 addJavascriptInterface
  global.nativeBridge = {
    post: function (json) {
      dispatch(json);
    }
  };

  function dispatch(json) {
    let msg;
    try {
      msg = JSON.parse(json);
    } catch (e) {
      return;
    }
    if (msg.type !== 'request') return;

    // 模拟异步：真实原生里「权限申请 / 调起相机」都是异步的
    setTimeout(() => handleMethod(msg), 300 + Math.random() * 400);
  }

  function handleMethod(msg) {
    const { id, method, params = {} } = msg;
    switch (method) {
      case 'device.getInfo':
        return respond(id, {
          platform: 'mock',
          os: 'Browser',
          model: navigator.userAgent.slice(0, 40),
          screen: window.screen.width + 'x' + window.screen.height
        });

      case 'location.getCurrentPosition':
        // 返回一个固定坐标（杭州），并附上精度
        return respond(id, {
          lat: 30.2741,
          lng: 120.1551,
          accuracy: 15,
          mock: true
        });

      case 'camera.takePhoto':
        // 用一张 1x1 占位图模拟拍照结果，避免真机才有 base64
        return respond(id, {
          base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
          width: 1080,
          height: 1440,
          mock: true
        });

      case 'scan.scanCode':
        return respond(id, {
          code: 'https://example.com/product/12345',
          type: 'QR_CODE',
          mock: true
        });

      case 'network.getType':
        return respond(id, { type: navigator.onLine ? 'wifi' : 'none', mock: true });

      case 'ui.toast':
        window.alert('[Native Toast] ' + (params.text || ''));
        return respond(id, { success: true });

      default:
        return respondError(id, 'unknown method: ' + method);
    }
  }

  function respond(id, result) {
    global._handleMessageFromNative({ type: 'response', id, result });
  }

  function respondError(id, message) {
    global._handleMessageFromNative({ type: 'response', id, error: message });
  }

  // 模拟原生注入完成后触发 ready
  setTimeout(() => {
    if (global._onBridgeReady) global._onBridgeReady();
  }, 0);

  // 每 5 秒推一个模拟的网络状态事件，演示 Native -> H5 的 event 通道
  let online = true;
  setInterval(() => {
    online = !online;
    global._handleMessageFromNative({
      type: 'event',
      event: 'networkChange',
      payload: { type: online ? 'wifi' : 'none', online }
    });
  }, 5000);
})(window);
