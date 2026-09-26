/**
 * jsbridge.js —— H5 侧桥接库
 *
 * 统一协议（H5 与 Native 双方约定）：
 *   - request  { type:'request',  id, method, params }   H5 -> Native
 *   - response { type:'response', id, result | error }   Native -> H5
 *   - event    { type:'event',    event, payload }       Native -> H5
 *
 * H5 侧用法：
 *   await JSBridge.call('camera.takePhoto', { source: 'camera' })
 *   JSBridge.on('networkChange', (payload) => { ... })
 *   JSBridge.ready(() => { ... })
 */
(function (global) {
  'use strict';

  const NATIVE_NAME = 'nativeBridge'; // 与原生约定的注入对象名 / messageHandler 名
  const SCHEME = 'myapp';             // 自定义协议（仅兜底方案使用）

  let callbackId = 0;
  const callbacks = {};    // callbackId -> { resolve, reject, timer }
  const eventHandlers = {}; // event -> Set<handler>
  let readyQueue = [];
  let isReady = false;

  const DEFAULT_TIMEOUT = 15000; // 默认超时 15s

  const genId = () => 'cb_' + (++callbackId) + '_' + Date.now();

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // ---------- H5 -> Native ----------
  function sendToNative(payload) {
    if (
      isIOS() &&
      global.webkit &&
      global.webkit.messageHandlers &&
      global.webkit.messageHandlers[NATIVE_NAME]
    ) {
      // iOS：postMessage 直接传对象，原生在 didReceive 里取 message.body
      global.webkit.messageHandlers[NATIVE_NAME].postMessage(payload);
    } else if (global[NATIVE_NAME] && typeof global[NATIVE_NAME].post === 'function') {
      // Android：addJavascriptInterface 注入的对象，统一提供 post(jsonString)
      global[NATIVE_NAME].post(JSON.stringify(payload));
    } else {
      // 兜底：隐藏 iframe 触发 scheme（仅单向通知，拿不到回包）
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = SCHEME + '://' + encodeURIComponent(JSON.stringify(payload));
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 0);
    }
  }

  // ---------- 核心：带回调的调用 ----------
  function call(method, params = {}, options = {}) {
    return new Promise((resolve, reject) => {
      const id = genId();

      const timer = setTimeout(() => {
        delete callbacks[id];
        reject(new Error('JSBridge call timeout: ' + method));
      }, options.timeout || DEFAULT_TIMEOUT);

      callbacks[id] = { resolve, reject, timer };
      sendToNative({ type: 'request', id, method, params });
    });
  }

  // ---------- Native -> H5 统一入口 ----------
  global._handleMessageFromNative = function (raw) {
    let msg = raw;
    if (typeof raw === 'string') {
      try {
        msg = JSON.parse(raw);
      } catch (e) {
        return;
      }
    }

    if (!msg || typeof msg !== 'object') return;

    if (msg.type === 'response') {
      const cb = callbacks[msg.id];
      if (!cb) return;
      clearTimeout(cb.timer);
      delete callbacks[msg.id];
      if (msg.error) cb.reject(new Error(msg.error));
      else cb.resolve(msg.result);
    } else if (msg.type === 'event') {
      const set = eventHandlers[msg.event];
      if (set) set.forEach((fn) => fn(msg.payload));
    }
  };

  // ---------- 事件订阅 ----------
  function on(event, handler) {
    (eventHandlers[event] || (eventHandlers[event] = new Set())).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    const set = eventHandlers[event];
    if (set) set.delete(handler);
  }

  // ---------- ready：等原生注入完成 ----------
  function ready(cb) {
    isReady ? cb() : readyQueue.push(cb);
  }

  global._onBridgeReady = function () {
    isReady = true;
    readyQueue.splice(0).forEach((fn) => fn());
  };

  global.JSBridge = { call, on, off, ready };
})(window);
