/*
 * Viewporter v2.0
 * http://github.com/zynga/viewporter
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/viewporter/master/MIT-LICENSE.txt
 */
var viewporter;
(function() {

	var _viewporter;


	// 初始化viewporter对象
	viewporter = {

		// 选项
		forceDetection: false,

		disableLegacyAndroid: true,

		// 常量
		ACTIVE: (function() {

			// 最好不要对运行Android2.x的非常弱的设备进行任何操作
			if (viewporter.disableLegacyAndroid && (/android 2/i).test(navigator.userAgent)) {
				//return false;
			}

			// iPad不允许您滚动浏览器的UI
			if ((/ipad/i).test(navigator.userAgent)) {
				return false;
			}

			// WebOS没有触摸事件，但绝对需要视口规范化
			if ((/webos/i).test(navigator.userAgent)) {
				return true;
			}

			// 支持触摸的设备
			if ('ontouchstart' in window) {
				return true;
			}

			return false;

		}),

		READY: false,

		// methods
		isLandscape: function() {
			return window.orientation === 90 || window.orientation === -90;
		},

		ready: function(callback) {
			window.addEventListener('viewportready', callback, false);
		},

		change: function(callback) {
			window.addEventListener('viewportchange', callback, false);
		},

		refresh: function() {
			if (_viewporter) {
				_viewporter.prepareVisualViewport();
			}
		},

		preventPageScroll: function() {

			// 如果“preventPageScroll”选项设置为“true”，则阻止页面滚动`
			document.body.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);

			// 重置页面滚动，如果“preventPageScroll”选项设置为“true”，则在iOS上显示地址栏后使用
			document.body.addEventListener("touchstart", function() {
				_viewporter.prepareVisualViewport();
			}, false);

		}

	};

	// 执行ACTIVE标志
	viewporter.ACTIVE = viewporter.ACTIVE();

	// 如果我们在桌面上，则无需继续
	if (!viewporter.ACTIVE) {
		return;
	}

	// create private constructor with prototype..just looks cooler
	var _Viewporter = function() {

		var that = this;

		// Scroll away the header, but not in Chrome
		this.IS_ANDROID = /Android/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

		var _onReady = function() {

			// scroll the shit away and fix the viewport!
			that.prepareVisualViewport();

			// listen for orientation change
			var cachedOrientation = window.orientation;
			window.addEventListener('orientationchange', function() {
				if (window.orientation !== cachedOrientation) {
					that.prepareVisualViewport();
					cachedOrientation = window.orientation;
				}
			}, false);

		};


		// 如果尚未加载文档，请侦听文档就绪，然后尝试准备可视视口并开始触发自定义事件
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() {
				_onReady();
			}, false);
		} else {
			_onReady();
		}


	};

	_Viewporter.prototype = {

		getProfile: function() {

			if (viewporter.forceDetection) {
				return null;
			}

			for (var searchTerm in viewporter.profiles) {
				if (new RegExp(searchTerm).test(navigator.userAgent)) {
					return viewporter.profiles[searchTerm];
				}
			}
			return null;
		},

		postProcess: function() {

			// let everyone know we're finally ready
			viewporter.READY = true;

			this.triggerWindowEvent(!this._firstUpdateExecuted ? 'viewportready' : 'viewportchange');
			this._firstUpdateExecuted = true;

		},

		prepareVisualViewport: function() {

			var that = this;

			// if we're running in webapp mode (iOS), there's nothing to scroll away
			if (navigator.standalone) {
				return this.postProcess();
			}

			// maximize the document element's height to be able to scroll away the url bar
			document.documentElement.style.minHeight = '5000px';

			var startHeight = window.innerHeight;
			var deviceProfile = this.getProfile();
			var orientation = viewporter.isLandscape() ? 'landscape' : 'portrait';

			// try scrolling immediately
			window.scrollTo(0, that.IS_ANDROID ? 1 : 0); // Android needs to scroll by at least 1px

			// start the checker loop
			var iterations = 40;
			var check = window.setInterval(function() {

				// retry scrolling
				window.scrollTo(0, that.IS_ANDROID ? 1 : 0); // Android needs to scroll by at least 1px

				function androidProfileCheck() {
					return deviceProfile ? window.innerHeight === deviceProfile[orientation] : false;
				}

				function iosInnerHeightCheck() {
					return window.innerHeight > startHeight;
				}

				iterations--;

				// 首先检查迭代，以确保我们不会陷入困境
				if ((that.IS_ANDROID ? androidProfileCheck() : iosInnerHeightCheck()) || iterations < 0) {

					// 将内容的最小高度设置为新窗口高度
					document.documentElement.style.minHeight = window.innerHeight + 'px';

					// 设置主体包装的正确高度，以允许元素位于底部
					document.getElementById('viewporter').style.position = 'relative';
					document.getElementById('viewporter').style.height = window.innerHeight + 'px';

					clearInterval(check);

					// fire events, get ready
					that.postProcess();

				}

			}, 10);

		},

		triggerWindowEvent: function(name) {
			var event = document.createEvent("Event");
			event.initEvent(name, false, false);
			window.dispatchEvent(event);
		}

	};

	// initialize
	_viewporter = new _Viewporter();

})();

viewporter.profiles = {

	// Motorola Xoom
	'MZ601': {
		portrait: 696,
		landscape: 1176
	},

	// Samsung Galaxy S, S2 and Nexus S
	'GT-I9000|GT-I9100|Nexus S': {
		portrait: 508,
		landscape: 295
	},

	// Samsung Galaxy Pad
	'GT-P1000': {
		portrait: 657,
		landscape: 400
	},

	// HTC Desire & HTC Desire HD
	'Desire_A8181|DesireHD_A9191': {
		portrait: 533,
		landscape: 320
	}

};
