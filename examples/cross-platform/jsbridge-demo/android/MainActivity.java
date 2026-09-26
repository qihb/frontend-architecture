package com.example.jsbridgedemo;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;

/**
 * Android 侧 WebView 容器：完整的 JSBridge 原生实现。
 *
 * 通道约定（与 h5/jsbridge.js 对齐）：
 *   - H5 -> Native：window.nativeBridge.post(jsonString)
 *   - Native -> H5：evaluateJavascript("window._handleMessageFromNative(json)")
 */
public class MainActivity extends Activity {

    private static final int REQ_CAMERA_PERMISSION = 1001;
    private static final int REQ_LOCATION_PERMISSION = 1002;
    private static final int REQ_IMAGE_CAPTURE = 1003;

    private WebView webView;

    // 挂起的回调 id：权限申请是异步的，需要记住是谁发起的这次调用
    private String pendingCameraId;
    private String pendingLocationId;
    private Uri cameraImageUri;

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface", "MissingPermission"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        // 注入对象：H5 里 window.nativeBridge.post(json)
        webView.addJavascriptInterface(new NativeBridge(), "nativeBridge");

        // 本地资源加载（demo 用）；生产环境一般换成远程 https 地址
        webView.loadUrl("file:///android_asset/index.html");

        // 注入完成后通知 H5 触发 ready
        webView.post(() -> evaluateJs("window._onBridgeReady && window._onBridgeReady()"));
    }

    // ================= H5 -> Native =================

    private class NativeBridge {
        @JavascriptInterface
        public void post(String json) {
            dispatch(json);
        }
    }

    private void dispatch(String json) {
        try {
            JSONObject msg = new JSONObject(json);
            if (!"request".equals(msg.optString("type"))) return;
            String id = msg.optString("id");
            String method = msg.optString("method");
            JSONObject params = msg.optJSONObject("params");
            if (params == null) params = new JSONObject();
            handleMethod(method, params, id);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleMethod(String method, JSONObject params, String id) {
        switch (method) {
            case "device.getInfo":
                getDeviceInfo(id);
                break;
            case "location.getCurrentPosition":
                getLocation(id);
                break;
            case "camera.takePhoto":
                takePhoto(id);
                break;
            case "network.getType":
                getNetworkType(id);
                break;
            case "ui.toast":
                toast(params, id);
                break;
            // 扫码等更多能力，在这里加 case 即可；建议用 CameraX + ZXing
            default:
                respondError(id, "unknown method: " + method);
        }
    }

    // ================= Native -> H5 =================

    private void evaluateJs(String js) {
        runOnUiThread(() -> webView.evaluateJavascript(js, null));
    }

    private void respond(String id, JSONObject result) {
        try {
            JSONObject resp = new JSONObject();
            resp.put("type", "response");
            resp.put("id", id);
            resp.put("result", result);
            evaluateJs("window._handleMessageFromNative(" + resp + ")");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void respondError(String id, String message) {
        try {
            JSONObject resp = new JSONObject();
            resp.put("type", "response");
            resp.put("id", id);
            resp.put("error", message);
            evaluateJs("window._handleMessageFromNative(" + resp + ")");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unused")
    private void emit(String event, JSONObject payload) {
        try {
            JSONObject resp = new JSONObject();
            resp.put("type", "event");
            resp.put("event", event);
            resp.put("payload", payload);
            evaluateJs("window._handleMessageFromNative(" + resp + ")");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    // ================= 能力实现 =================

    private void getDeviceInfo(String id) {
        try {
            JSONObject result = new JSONObject();
            result.put("platform", "android");
            result.put("os", "Android " + Build.VERSION.RELEASE);
            result.put("model", Build.MODEL);
            result.put("brand", Build.BRAND);
            respond(id, result);
        } catch (JSONException e) {
            respondError(id, e.getMessage());
        }
    }

    private void getNetworkType(String id) {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            NetworkInfo info = cm.getActiveNetworkInfo();
            String type = "none";
            if (info != null && info.isConnected()) {
                switch (info.getType()) {
                    case ConnectivityManager.TYPE_WIFI: type = "wifi"; break;
                    case ConnectivityManager.TYPE_MOBILE: type = "mobile"; break;
                    default: type = "unknown";
                }
            }
            JSONObject result = new JSONObject();
            result.put("type", type);
            respond(id, result);
        } catch (JSONException e) {
            respondError(id, e.getMessage());
        }
    }

    private void toast(JSONObject params, String id) {
        runOnUiThread(() ->
            Toast.makeText(this, params.optString("text", ""), Toast.LENGTH_SHORT).show());
        try {
            respond(id, new JSONObject().put("success", true));
        } catch (JSONException e) {
            respondError(id, e.getMessage());
        }
    }

    // ---------- 定位 ----------
    private void getLocation(String id) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            pendingLocationId = id;
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQ_LOCATION_PERMISSION);
            return;
        }
        queryLocation(id);
    }

    @SuppressLint("MissingPermission")
    private void queryLocation(String id) {
        LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        // 先拿缓存，没有则请求一次实时定位
        Location loc = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        if (loc == null) {
            loc = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        }
        if (loc != null) {
            respondLocation(id, loc);
            return;
        }
        LocationListener listener = new LocationListener() {
            @Override
            public void onLocationChanged(@NonNull Location location) {
                lm.removeUpdates(this);
                respondLocation(id, location);
            }
            @Override public void onStatusChanged(String provider, int status, Bundle extras) {}
            @Override public void onProviderEnabled(@NonNull String provider) {}
            @Override public void onProviderDisabled(@NonNull String provider) {}
        };
        lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, listener);
    }

    private void respondLocation(String id, Location loc) {
        try {
            JSONObject result = new JSONObject();
            result.put("lat", loc.getLatitude());
            result.put("lng", loc.getLongitude());
            result.put("accuracy", loc.getAccuracy());
            respond(id, result);
        } catch (JSONException e) {
            respondError(id, e.getMessage());
        }
    }

    // ---------- 相机 ----------
    private void takePhoto(String id) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            pendingCameraId = id;
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.CAMERA}, REQ_CAMERA_PERMISSION);
            return;
        }
        launchCamera(id);
    }

    private void launchCamera(String id) {
        pendingCameraId = id;
        try {
            File file = new File(getCacheDir(), "photo_" + System.currentTimeMillis() + ".jpg");
            cameraImageUri = FileProvider.getUriForFile(this,
                    getPackageName() + ".fileprovider", file);

            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri);
            startActivityForResult(intent, REQ_IMAGE_CAPTURE);
        } catch (Exception e) {
            respondError(id, "camera launch failed: " + e.getMessage());
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (requestCode == REQ_CAMERA_PERMISSION) {
            if (granted) launchCamera(pendingCameraId);
            else respondError(pendingCameraId, "camera permission denied");
        } else if (requestCode == REQ_LOCATION_PERMISSION) {
            if (granted) queryLocation(pendingLocationId);
            else respondError(pendingLocationId, "location permission denied");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            try {
                InputStream is = getContentResolver().openInputStream(cameraImageUri);
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                Bitmap scaled = scaleBitmap(bitmap, 1080);
                String base64 = bitmapToBase64(scaled, 80);

                JSONObject result = new JSONObject();
                result.put("base64", "data:image/jpeg;base64," + base64);
                result.put("width", scaled.getWidth());
                result.put("height", scaled.getHeight());
                respond(pendingCameraId, result);
            } catch (Exception e) {
                respondError(pendingCameraId, e.getMessage());
            }
        }
    }

    // ---------- 工具：缩放与 base64 ----------
    private Bitmap scaleBitmap(Bitmap src, int maxEdge) {
        int w = src.getWidth();
        int h = src.getHeight();
        if (Math.max(w, h) <= maxEdge) return src;
        float ratio = (float) maxEdge / Math.max(w, h);
        return Bitmap.createScaledBitmap(src,
                Math.round(w * ratio), Math.round(h * ratio), true);
    }

    private String bitmapToBase64(Bitmap bitmap, int quality) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, baos);
        return Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
    }
}
