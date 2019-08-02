var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// iOS
if (isiOS) {
  function setupWebViewJavascriptBridge(callback) {
    //第一次调用这个方法的时候，为false
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    //第一次调用的时候，为false
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    //把callback对象赋值给对象
    window.WVJBCallbacks = [callback];
    //加载WebViewJavascriptBridge_JS中的代码
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

// 安卓
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge)
    }, false
    )
  }
}


// 获取地址栏参数
function getPram(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return '';
}

// Ajax请求封装
var _url = window.location.protocol + '//' + window.location.host;
function ajax_request(rqheader, options) {
  $.ajax({
    type: options.type,
    url: _url + options.url,
    data: options.data,
    headers: rqheader || '',
    dataType: 'json',
    timeout: 15000,
    success: function (data) {
      // showError('请求成功')
      options.success && options.success(data)
    },
    error: function (xhr) {
      // showError('请求失败')
      options.error && options.error(xhr)
    }
  })
}

// 信息提示
var timer;
function showError(msg) {
  var wrap = document.querySelector('.ajax_tip');
  timer && clearTimeout(timer);
  wrap.innerHTML = msg;
  wrap.style.display = 'block';
  timer = setTimeout(function () {
    wrap.style.display = 'none';
  }, 1500);
}