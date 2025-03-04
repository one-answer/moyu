function CTweenController() {
	this.tweenValue = function(a, b, c) {
		return a + c * (b - a)
	};
	this.easeLinear = function(a, b, c, d) {
		return c * a / d + b
	};
	this.easeInCubic = function(a, b, c, d) {
		d = (a /= d) * a * a;
		return b + c * d
	};
	this.easeBackInQuart = function(a, b, c, d) {
		d = (a /= d) * a;
		return b + c * (2 * d * d + 2 * d * a + -3 * d)
	};
	this.easeInBack = function(a, b, c, d) {
		return c * (a /= d) * a * (2.70158 * a - 1.70158) + b
	};
	this.easeOutCubic = function(a, b, c, d) {
		return c * ((a = a / d - 1) * a * a + 1) + b
	};
	this.getTrajectoryPoint = function(a, b) {
		var c = new createjs.Point,
			d = (1 - a) * (1 - a),
			f = a * a;
		c.x = d *
			b.start.x + 2 * (1 - a) * a * b.traj.x + f * b.end.x;
		c.y = d * b.start.y + 2 * (1 - a) * a * b.traj.y + f * b.end.y;
		return c
	}
}

function CSpriteLibrary() {
	var a, b, c, d, f, h;
	this.init = function(k, g, e) {
		c = b = 0;
		d = k;
		f = g;
		h = e;
		a = {}
	};
	this.addSprite = function(c, g) {
		a.hasOwnProperty(c) || (a[c] = {
			szPath: g,
			oSprite: new Image
		}, b++)
	};
	this.getSprite = function(b) {
		return a.hasOwnProperty(b) ? a[b].oSprite : null
	};
	this._onSpritesLoaded = function() {
		f.call(h)
	};
	this._onSpriteLoaded = function() {
		d.call(h);
		++c === b && this._onSpritesLoaded()
	};
	this.loadSprites = function() {
		for (var b in a) a[b].oSprite.oSpriteLibrary = this, a[b].oSprite.onload = function() {
				this.oSpriteLibrary._onSpriteLoaded()
			},
			a[b].oSprite.src = a[b].szPath
	};
	this.getNumSprites = function() {
		return b
	}
}
var CANVAS_WIDTH = 960,
	CANVAS_HEIGHT = 576,
	EDGEBOARD_X = 0,
	EDGEBOARD_Y = 100,
	FPS = 30,
	FPS_TIME = 1E3 / FPS,
	DISABLE_SOUND_MOBILE = !1,
	PRIMARY_FONT = "dirtyego",
	SCORE_ITEM_NAME = "deadcity score",
	FIRST_TIME_ITEM_NAME = "deadcity firstTime",
	STATE_LOADING = 0,
	STATE_MENU = 1,
	STATE_HELP = 1,
	STATE_GAME = 3,
	STARTING_AMMO = 6,
	ON_MOUSE_DOWN = 0,
	ON_MOUSE_UP = 1,
	ON_MOUSE_OVER = 2,
	ON_MOUSE_OUT = 3,
	ON_DRAG_START = 4,
	ON_DRAG_END = 5,
	MAX_ZOMBIE_ON_SCREEN, ANIM_Z = [{
		anim: {
			walk: {
				start: 0,
				end: 29
			},
			hit: {
				start: 30,
				end: 43,
				todeath: 4
			},
			death: {
				start: 60,
				end: 85
			}
		}
	}, {
		anim: {
			walk: {
				start: 0,
				end: 28
			},
			hit: {
				start: 29,
				end: 42,
				todeath: 3
			},
			death: {
				start: 57,
				end: 85
			}
		}
	}, {
		anim: {
			walk: {
				start: 0,
				end: 9
			},
			hit: {
				start: 10,
				end: 32,
				todeath: 22
			},
			death: {
				start: 10,
				end: 32
			}
		}
	}, {
		anim: {
			walk: {
				start: 0,
				end: 17
			},
			hit: {
				start: 18,
				end: 36,
				todeath: 8
			},
			death: {
				start: 37,
				end: 85
			}
		}
	}],
	WAVE_TARGET = [8, 18, 28, 39, 50, 62, 73, 84, 95, 95, 95, 95, 95, 95],
	SPAWN_INTERVAL = 1,
	SPAWN_OCCURENCES, ZOMBIE_HEALTHS = [1, 2, 1, 1],
	PLAYER_HEALTH = 1,
	WAITING_TIME = 1,
	ENABLE_FULLSCREEN, ENABLE_CHECK_ORIENTATION, TEXT_SCORE = "SCORE",
	TEXT_CREDITS_DEVELOPED = "DEVELOPED BY",
	TEXT_ERR_LS =
	"YOUR WEB BROWSER DOES NOT SUPPORT STORING SETTING LOCALLY. IN SAFARI, THE MOST COMMON CAUSE OF THIS IS USING 'PRIVATE BROWSING MODE'. SOME INFO MAY NOT SAVE OR SOME FEATURE MAY NOT WORK PROPERLY.",
	TEXT_SHARE_IMAGE = "200x200.jpg",
	TEXT_SHARE_TITLE = "Congratulations!",
	TEXT_SHARE_MSG1 = "You collected <strong>",
	TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!",
	TEXT_SHARE_SHARE1 = "My score is ",
	TEXT_SHARE_SHARE2 = " points! Can you do better",
	TEXT_HELP = "👈点击此处射击",
	TEXT_HELP2 = "👈点击此处换弹",
	TEXT_WAVE = "波: ",
	TEXT_YOUR_SCORE = "你击杀了: ",
	TEXT_YOUR_SCORE2 = " 个僵尸!",
	TEXT_YOUR_SCORE3 = "你生存了: ",
	TEXT_YOUR_SCORE4 = " 波!",
	TEXT_YOUR_SCORE5 = "你的最终分数是: ",
	TEXT_YOUR_SCORE6 = "你的最好成绩是: ";

function CPreloader() {
	var a, b, c, d, f, h, k, g, e;
	this._init = function() {
		s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
		s_oSpriteLibrary.addSprite("bg_preloader", "./sprites/bg_preloader.jpg");
		s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
		s_oSpriteLibrary.loadSprites();
		k = new createjs.Container;
		s_oStage.addChild(k)
	};
	this.unload = function() {
		k.removeAllChildren()
	};
	this.hide = function() {
		var a = this;
		setTimeout(function() {
			createjs.Tween.get(h).to({
				alpha: 1
			}, 500).call(function() {
				a.unload();
				s_oMain.gotoMenu()
			})
		}, 1E3)
	};
	this._onImagesLoaded = function() {};
	this._onAllImagesLoaded = function() {
		this.attachSprites();
		s_oMain.preloaderReady()
	};
	this.attachSprites = function() {
		var l = createBitmap(s_oSpriteLibrary.getSprite("bg_preloader"));
		l.x = -40;
		l.y = -40;
		k.addChild(l);
		g = s_oSpriteLibrary.getSprite("progress_bar");
		d = createBitmap(g);
		d.x = CANVAS_WIDTH / 2 - g.width / 2;
		d.y = CANVAS_HEIGHT - 90;
		k.addChild(d);
		e = g.width / 2;
		a = g.width;
		b = g.height;
		f = new createjs.Shape;
		f.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(d.x,
			d.y, 1, b);
		k.addChild(f);
		d.mask = f;
		c = new createjs.Text("", "30px " + PRIMARY_FONT, "#fff");
		c.x = CANVAS_WIDTH / 2;
		c.y = CANVAS_HEIGHT - 100;
		c.shadow = new createjs.Shadow("#000", 2, 2, 2);
		c.textBaseline = "alphabetic";
		c.textAlign = "center";
		k.addChild(c);
		h = new createjs.Shape;
		h.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		h.alpha = 0;
		k.addChild(h);
		this.refreshGUIPos(s_iOffsetX, s_iOffsetY)
	};
	this.refreshLoader = function(g) {
		c.text = g + "%";
		f.graphics.clear();
		g = Math.floor(g * a / 100);
		f.graphics.beginFill("rgba(255,255,255,0)").drawRect(d.x,
			CANVAS_HEIGHT - 100, g, b)
	};
	this.refreshGUIPos = function(a, b) {
		c.x = CANVAS_WIDTH / 2 + a;
		c.y = CANVAS_HEIGHT - 100 - b;
		d.x = CANVAS_WIDTH / 2 - e + a;
		d.y = CANVAS_HEIGHT - 100 - b;
		f.x = a;
		f.y = -b
	};
	this._init()
}
var s_iScaleFactor = 1,
	s_oCanvasLeft, s_oCanvasTop, s_bIsIphone = !1;
(function(a) {
	(jQuery.browser = jQuery.browser || {}).mobile =
		/android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i
		.test(a) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i
		.test(a.substr(0,
			4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
	sizeHandler()
});

function compare(a, b) {
	return a.lerp < b.lerp ? -1 : a.lerp > b.lerp ? 1 : 0
}

function trace(a) {
	console.log(a)
}

function isIOS() {
	for (var a = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";"); a.length;)
		if (navigator.platform === a.pop()) return !0;
	return !1
}

function contains(a, b) {
	for (var c = 0; c < a.length; c++)
		if (a[c] == b) return !0;
	return !1
}

function getSize(a) {
	var b = a.toLowerCase(),
		c = window.document,
		d = c.documentElement;
	if (void 0 === window["inner" + a]) a = d["client" + a];
	else if (window["inner" + a] != d["client" + a]) {
		var f = c.createElement("body");
		f.id = "vpw-test-b";
		f.style.cssText = "overflow:scroll";
		var h = c.createElement("div");
		h.id = "vpw-test-d";
		h.style.cssText = "position:absolute;top:-1000px";
		h.innerHTML = "<style>@media(" + b + ":" + d["client" + a] + "px){body#vpw-test-b div#vpw-test-d{" + b +
			":7px!important}}</style>";
		f.appendChild(h);
		d.insertBefore(f, c.head);
		a = 7 == h["offset" + a] ? d["client" + a] : window["inner" + a];
		d.removeChild(f)
	} else a = window["inner" + a];
	return a
}
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
	sizeHandler()
}

function getIOSWindowHeight() {
	return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}

function getHeightOfIOSToolbars() {
	var a = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
	return 1 < a ? a : 0
}

function sizeHandler() {
	window.scrollTo(0, 1);
	if ($("#canvas")) {
		var a;
		a = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? getIOSWindowHeight() : getSize("Height");
		var b = getSize("Width");
		_checkOrientation(b, a);
		var c = Math.min(a / CANVAS_HEIGHT, b / CANVAS_WIDTH),
			d = CANVAS_WIDTH * c,
			c = CANVAS_HEIGHT * c,
			f;
		c < a ? (f = a - c, c += f, d += CANVAS_WIDTH / CANVAS_HEIGHT * f) : d < b && (f = b - d, d += f, c += CANVAS_HEIGHT /
			CANVAS_WIDTH * f);
		f = a / 2 - c / 2;
		var h = b / 2 - d / 2,
			k = CANVAS_WIDTH / d;
		if (h * k < -EDGEBOARD_X || f * k < -EDGEBOARD_Y) c = Math.min(a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y),
				b / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), d = CANVAS_WIDTH * c, c *= CANVAS_HEIGHT, f = (a - c) / 2, h = (b - d) / 2,
			k = CANVAS_WIDTH / d;
		s_iOffsetX = -1 * h * k;
		s_iOffsetY = -1 * f * k;
		0 <= f && (s_iOffsetY = 0);
		0 <= h && (s_iOffsetX = 0);
		null !== s_oInterface && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
		null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
		s_bIsIphone ? (canvas = document.getElementById("canvas"), s_oStage.canvas.width = 2 * d, s_oStage.canvas.height = 2 *
				c, canvas.style.width = d + "px", canvas.style.height = c + "px", a = Math.min(d / CANVAS_WIDTH,
					c / CANVAS_HEIGHT), s_iScaleFactor = 2 * a, s_oStage.scaleX = s_oStage.scaleY = 2 * a) : s_bMobile && !1 === isIOS() ?
			($("#canvas").css("width", d + "px"), $("#canvas").css("height", c + "px")) : (s_oStage.canvas.width = d, s_oStage.canvas
				.height = c, s_iScaleFactor = Math.min(d / CANVAS_WIDTH, c / CANVAS_HEIGHT), s_oStage.scaleX = s_oStage.scaleY =
				s_iScaleFactor);
		0 > f ? $("#canvas").css("top", f + "px") : $("#canvas").css("top", "0px");
		$("#canvas").css("left", h + "px")
	}
}

function _checkOrientation(a, b) {
	s_bMobile && ENABLE_CHECK_ORIENTATION && (a > b ? "landscape" === $(".orientation-msg-container").attr(
		"data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(
		".orientation-msg-container").css("display", "block"), s_oMain.stopUpdate()) : "portrait" === $(
		".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"),
		s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
		s_oMain.stopUpdate()))
}

function inIframe() {
	try {
		return window.self !== window.top
	} catch (a) {
		return !0
	}
}

function createBitmap(a, b, c) {
	var d = new createjs.Bitmap(a),
		f = new createjs.Shape;
	b && c ? f.graphics.beginFill("#000").drawRect(0, 0, b, c) : f.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
	d.hitArea = f;
	return d
}

function createSprite(a, b, c, d, f, h) {
	a = null !== b ? new createjs.Sprite(a, b) : new createjs.Sprite(a);
	b = new createjs.Shape;
	b.graphics.beginFill("#000000").drawRect(-c, -d, f, h);
	a.hitArea = b;
	return a
}

function randomFloatBetween(a, b, c) {
	"undefined" === typeof c && (c = 2);
	return parseFloat(Math.min(a + Math.random() * (b - a), b).toFixed(c))
}

function formatTime(a) {
	a /= 1E3;
	var b = Math.floor(a / 60);
	a = Math.floor(a - 60 * b);
	var c = "",
		c = 10 > b ? c + ("0" + b + ":") : c + (b + ":");
	return 10 > a ? c + ("0" + a) : c + a
}

function NoClickDelay(a) {
	this.element = a;
	window.Touch && this.element.addEventListener("touchstart", this, !1)
}

function shuffle(a) {
	for (var b = a.length, c, d; 0 < b;) d = Math.floor(Math.random() * b), b--, c = a[b], a[b] = a[d], a[d] = c;
	return a
}
NoClickDelay.prototype = {
	handleEvent: function(a) {
		switch (a.type) {
			case "touchstart":
				this.onTouchStart(a);
				break;
			case "touchmove":
				this.onTouchMove(a);
				break;
			case "touchend":
				this.onTouchEnd(a)
		}
	},
	onTouchStart: function(a) {
		a.preventDefault();
		this.moved = !1;
		this.element.addEventListener("touchmove", this, !1);
		this.element.addEventListener("touchend", this, !1)
	},
	onTouchMove: function(a) {
		this.moved = !0
	},
	onTouchEnd: function(a) {
		this.element.removeEventListener("touchmove", this, !1);
		this.element.removeEventListener("touchend",
			this, !1);
		if (!this.moved) {
			a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
			3 == a.nodeType && (a = a.parentNode);
			var b = document.createEvent("MouseEvents");
			b.initEvent("click", !0, !0);
			a.dispatchEvent(b)
		}
	}
};

function ctlArcadeResume() {
	null !== s_oMain && s_oMain.startUpdate()
}

function ctlArcadePause() {
	null !== s_oMain && s_oMain.stopUpdate()
}

function getParamValue(a) {
	for (var b = window.location.search.substring(1).split("&"), c = 0; c < b.length; c++) {
		var d = b[c].split("=");
		if (d[0] == a) return d[1]
	}
}

function stopSound(a) {
	!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.stop()
}

function playSound(a, b, c) {
	return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? createjs.Sound.play(a, {
		loop: c,
		volume: b
	}) : null
}

function setVolume(a, b) {
	if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) a.volume = b
}

function setMute(a, b) {
	!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.setMute(b)
}

function easeLinear(a, b, c, d) {
	return c * a / d + b
}

function collisionWithCircle(a, b, c) {
	var d = a.getX() - b.getX(),
		f = a.getY() - b.getY();
	return Math.sqrt(d * d + f * f) < a.getCollision() * c + b.getCollision() * c ? !0 : !1
}
(function() {
	function a(a) {
		var d = {
			focus: "visible",
			focusin: "visible",
			pageshow: "visible",
			blur: "hidden",
			focusout: "hidden",
			pagehide: "hidden"
		};
		a = a || window.event;
		a.type in d ? document.body.className = d[a.type] : (document.body.className = this[b] ? "hidden" : "visible",
			"hidden" === document.body.className ? s_oMain.stopUpdate() : s_oMain.startUpdate())
	}
	var b = "hidden";
	b in document ? document.addEventListener("visibilitychange", a) : (b = "mozHidden") in document ? document.addEventListener(
			"mozvisibilitychange", a) : (b = "webkitHidden") in
		document ? document.addEventListener("webkitvisibilitychange", a) : (b = "msHidden") in document ? document.addEventListener(
			"msvisibilitychange", a) : "onfocusin" in document ? document.onfocusin = document.onfocusout = a : window.onpageshow =
		window.onpagehide = window.onfocus = window.onblur = a
})();

function saveItem(a, b) {
	s_bStorageAvailable && localStorage.setItem(a, b)
}

function getItem(a) {
	return s_bStorageAvailable ? localStorage.getItem(a) : null
}

function CZombie(a, b, c, d) {
	var f, h, k, g, e, l, n, p, q, u, m = !1,
		w = !1,
		x = 0,
		G, r, y, B, z, t, I, A, D, E, C, L, v, J, F, M, K, H, N;
	this.init = function(a, b, d, c) {
		h = [];
		k = [];
		g = [];
		e = new createjs.Container;
		G = c;
		f = ZOMBIE_HEALTHS[a];
		x = 0
	};
	this.setVariables = function(a, b, c, d) {
		h = [];
		k = [];
		g = [];
		e = new createjs.Container;
		n = a;
		w = !1;
		var l = {
				images: [s_oSpriteLibrary.getSprite("blood")],
				frames: {
					width: 320,
					height: 351,
					regX: 160,
					regY: 175
				},
				animations: {
					idle: [0, 11],
					stop: 0
				}
			},
			l = new createjs.SpriteSheet(l);
		t = new createjs.Sprite(l, "stop");
		t.visible = !1;
		t.scaleX =
			.5;
		t.scaleY = .5;
		v = ANIM_Z[a].anim.walk.start;
		J = ANIM_Z[a].anim.walk.end;
		F = ANIM_Z[a].anim.hit.start;
		M = ANIM_Z[a].anim.hit.end;
		K = ANIM_Z[a].anim.hit.todeath;
		H = ANIM_Z[a].anim.death.start;
		N = ANIM_Z[a].anim.death.end;
		for (l = v; l <= J; l++) {
			var m = createBitmap(s_oSpriteLibrary.getSprite("zombie" + a + "_" + l));
			h.push(m);
			m.visible = !1;
			e.addChild(m)
		}
		for (l = F; l <= M; l++) m = createBitmap(s_oSpriteLibrary.getSprite("zombie" + a + "_" + l)), k.push(m), m.visible = !
			1, e.addChild(m);
		for (l = H; l <= N; l++) m = createBitmap(s_oSpriteLibrary.getSprite("zombie" +
			a + "_" + l)), g.push(m), 3 !== n && (m.x -= 50, m.y += 20), m.visible = !1, e.addChild(m);
		B = y = 0;
		z = 2 !== n && 3 !== n ? 240 : 80;
		u = 0;
		p = Math.floor(randomFloatBetween(0, J));
		q = 0;
		h[0].visible = !0;
		f = ZOMBIE_HEALTHS[a];
		e.x = b;
		e.y = I = c;
		r = new createjs.Shape;
		r.graphics.beginFill("rgba(255,0,0,0.6)").drawRect(0, 0, 10, e.getBounds().height);
		r.x = h[0].x - 40;
		r.y = h[0].y;
		r.visible = !1;
		e.addChild(r);
		s_oStage.addChild(t);
		x = d;
		e.regX = e.getBounds().width / 2;
		e.regY = e.getBounds().height;
		e.scaleX = A = .12;
		e.scaleY = D = .12;
		e.alpha = 0;
		G.addChild(e);
		2 !== n && 3 !== n ? createjs.Tween.get(e).to({
				alpha: 1
			},
			3E3, createjs.Ease.cubicIn) : createjs.Tween.get(e).to({
			alpha: 1
		}, 1E3, createjs.Ease.cubicIn);
		e.on("mousedown", this.onClick)
	};
	this.onClick = function(a) {
		l && !m && (2 === n && (e.mouseEnabled = !1), t.scaleX = e.scaleX, t.scaleY = e.scaleY, t.x = a.stageX /
			s_iScaleFactor, t.y = a.stageY / s_iScaleFactor, t.visible = !0, t.gotoAndPlay("idle"), r.visible = !0, x = 2, u =
			0, s_oGame.Shoot(a), f--, 0 < f ? iHealthMod = f / ZOMBIE_HEALTHS[n] : (iHealthMod = 0, s_oGame.increaseScore(
				ZOMBIE_HEALTHS[n])), (new createjs.Tween.get(r)).to({
				scaleY: iHealthMod
			}, 200).call(function() {
				(new createjs.Tween.get(r)).to({
						visible: !1
					},
					100)
			}))
	};
	this.setOnTop = function() {};
	this.getType = function() {
		return n
	};
	this.getContainer = function() {
		return e
	};
	this._animRun = function() {
		for (var a = 0; a < k.length; a++) k[a].visible = !1;
		0 === p ? (h[h.length - 1].visible = !1, h[0].visible = !0) : (h[p - 1].visible = !1, h[p].visible = !0);
		p++;
		p > h.length - 1 && (p = 0)
	};
	this.getY = function() {
		y > z && trace("ERRORE");
		return 100 * y / z
	};
	this._animDeath = function() {
		if (2 !== n) {
			for (var a = 0; a < k.length; a++) k[a].visible = !1;
			0 === q ? (g[g.length - 1].visible = !1, g[0].visible = !0) : (g[q - 1].visible = !1, g[q].visible = !0);
			q++;
			q > g.length - 1 && this.reset()
		} else this.reset()
	};
	this.getState = function() {
		return x
	};
	this._animHit = function() {
		for (var a = 0; a < h.length; a++) h[a].visible = !1;
		if (!1 === w)
			for (a = 0; a < k.length; a++) k[a].visible = !1;
		0 === u ? (playSound("hit_zombie" + n), k[k.length - 1].visible = !1, k[0].visible = !0) : (k[u - 1].visible = !1, k[
			u].visible = !0);
		u++;
		u > K && 0 >= f && (C = e.scaleX, L = e.scaleY, E = e.y, x = 3);
		u >= k.length && 0 < f && (w = !0, x = 1)
	};
	this.reset = function() {
		x = 0;
		e.off("mousedown", this.onClick);
		createjs.Tween.removeTweens(e);
		createjs.Tween.get(e).to({
				alpha: 0
			},
			500).call(function() {
			G.removeChild(e);
			for (var a = 0; a < h.length; a++) h[a].visible = !1;
			for (a = 0; a < k.length; a++) k[a].visible = !1;
			for (a = 0; a < g.length; a++) g[a].visible = !1;
			k = [];
			h = [];
			g = []
		})
	};
	this.update = function(a) {
		11 === t.currentFrame && (t.visible = !1);
		m = a;
		switch (x) {
			case 0:
				e.mouseEnabled = !0;
				l = !1;
				break;
			case 1:
				e.mouseEnabled = !0;
				y++;
				y > z && (y = z);
				a = s_oTweenController.easeInCubic(y, 0, 1, z);
				a = s_oTweenController.tweenValue(I, CANVAS_HEIGHT + 300, a);
				e.y = a;
				a = 2;
				var b = s_oTweenController.easeInCubic(y, 0, 1, z),
					b = s_oTweenController.tweenValue(A *
						a, 1 * a, b);
				e.scaleX = b;
				b = s_oTweenController.easeInCubic(y, 0, 1, z);
				a = s_oTweenController.tweenValue(D * a, 1 * a, b);
				e.scaleY = a;
				this._animRun();
				l = !0;
				e.y >= CANVAS_HEIGHT + 250 && (2 === n && playSound("dog_attack"), s_oGame.damagePlayer(), createjs.Tween.get(e).to({
					alpha: 0
				}, 200).call(function() {
					t.visible = !1
				}), x = 0);
				break;
			case 2:
				this._animHit();
				e.mouseEnabled = 2 !== n ? !0 : !1;
				l = !0;
				break;
			case 3:
				t.visible = !1, B++, 80 <= B && (B = 80), a = s_oTweenController.easeInCubic(B, 0, 1, 80), a = s_oTweenController.tweenValue(
						E, E + 90, a), e.y = a, a = 1, b = s_oTweenController.easeInCubic(B,
						0, 1, 80), b = s_oTweenController.tweenValue(C * a, (C + 1) * a, b), e.scaleX = b, b = s_oTweenController.easeInCubic(
						B, 0, 1, 80), a = s_oTweenController.tweenValue(L * a, (L + 1) * a, b), e.scaleY = a, e.mouseEnabled = !1, this._animDeath(),
					l = e.mouseEnabled = !1
		}
	};
	this.init(a, b, c, d)
}

function CPlayer(a) {
	var b, c, d, f, h, k, g, e, l, n, p, q;
	this._init = function() {
		b = STARTING_AMMO;
		c = PLAYER_HEALTH;
		l = new createjs.Container;
		l.setBounds(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		var a = {
				images: [s_oSpriteLibrary.getSprite("player_right")],
				frames: {
					width: 423.5,
					height: 323,
					regX: 423.5,
					regY: 323
				},
				animations: {
					idle: 0,
					fire: 1
				}
			},
			m = {
				images: [s_oSpriteLibrary.getSprite("player_left")],
				frames: {
					width: 395.5,
					height: 328.5,
					regX: 0,
					regY: 328.5
				},
				animations: {
					idle: 0,
					fire: 1
				}
			},
			a = new createjs.SpriteSheet(a),
			m = new createjs.SpriteSheet(m);
		d = new createjs.Sprite(a);
		f = new createjs.Sprite(m);
		f.visible = !1;
		d.visible = !0;
		e = [];
		e.push(d, f);
		n = {
			x: -80,
			y: CANVAS_HEIGHT + 60
		};
		f.x = -80;
		f.y = CANVAS_HEIGHT + 60;
		p = {
			x: CANVAS_WIDTH + 100,
			y: CANVAS_HEIGHT + 60
		};
		d.x = CANVAS_WIDTH + 100;
		d.y = CANVAS_HEIGHT + 60;
		q = [];
		q.push(p, n);
		l.addChild(d);
		l.addChild(f);
		s_oStage.addChild(l);
		h = createBitmap(s_oSpriteLibrary.getSprite("damage"));
		s_oStage.addChild(h);
		h.alpha = 0;
		k = !1;
		g = 0
	};
	this.handleMovement = function(a) {
		a.stageX / s_iScaleFactor > .5 * CANVAS_WIDTH ? (f.visible = !0, d.visible = !1) : (d.visible = !0, f.visible = !1)
	};
	this.getAmmo = function() {
		return b
	};
	this.getHealth = function() {
		return c
	};
	this.damage = function() {
		h.alpha = 1;
		var a = 0 < c - 1 ? Math.round(randomFloatBetween(1, 2.1)) : 0;
		playSound("player_hit_" + a);
		(new createjs.Tween.get(h)).to({
			alpha: 0
		}, 700);
		c--
	};
	this.Shoot = function(a) {
		if (0 < b) {
			this.handleMovement(a);
			b--;
			playSound("shoot");
			s_oGame.toggleShoot(!1);
			for (a = 0; a < e.length; a++) {
				var g = -15;
				0 === a && (g = 15);
				(new createjs.Tween.get(e[a])).to({
					y: q[a].y + 30,
					x: q[a].x + g
				}, 100).to({
					y: q[a].y,
					x: q[a].x
				}, 150).call(function() {
					s_oGame.toggleShoot(!0)
				});
				e[a].gotoAndStop("fire")
			}
			k = !0
		}
		playSound("dry")
	};
	this.setVisible = function(a) {
		if (a)
			for (a = 0; a < e.length; a++) e[a].visible = 1 !== a ? !1 : !0;
		else
			for (a = 0; a < e.length; a++) e[a].visible = !1
	};
	this.reload = function() {
		b = STARTING_AMMO;
		playSound("reload")
	};
	this.update = function() {
		if (k && (g += s_iTimeElaps, 150 <= g)) {
			k = !1;
			for (var a = 0; a < e.length; a++) e[a].gotoAndStop("idle");
			g = 0
		}
	};
	this._init(a);
	s_oPlayer = this
}
var s_oPlayer;

function CMain(a) {
	var b, c = 0,
		d = 0,
		f = STATE_LOADING,
		h, k;
	this.initContainer = function() {
		s_oCanvas = document.getElementById("canvas");
		s_oStage = new createjs.Stage(s_oCanvas);
		s_oStage.preventSelection = !1;
		createjs.Touch.enable(s_oStage);
		s_bMobile = jQuery.browser.mobile;
		!1 === s_bMobile && (s_oStage.enableMouseOver(20), $("body").on("contextmenu", "#canvas", function(a) {
			return !1
		}));
		s_iPrevTime = (new Date).getTime();
		createjs.Ticker.addEventListener("tick", this._update);
		createjs.Ticker.setFPS(FPS);
		navigator.userAgent.match(/Windows Phone/i) &&
			(DISABLE_SOUND_MOBILE = !0);
		s_oSpriteLibrary = new CSpriteLibrary;
		s_oPreloader = new CPreloader
	};
	this.preloaderReady = function() {
		!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
		this._loadImages();
		b = !0
	};
	this.soundLoaded = function() {
		c++;
		s_oPreloader.refreshLoader(Math.floor(c / d * 100));
		c === d && this._onRemovePreloader()
	};
	this._initSounds = function() {
		createjs.Sound.initializeDefaultPlugins() && (0 < navigator.userAgent.indexOf("Opera") || 0 < navigator.userAgent.indexOf(
				"OPR") ? (createjs.Sound.alternateExtensions = ["mp3"], createjs.Sound.addEventListener("fileload", createjs.proxy(
					this.soundLoaded, this)), createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack"), createjs.Sound.registerSound(
					"./sounds/zombie_crowd.ogg", "zombies"), createjs.Sound.registerSound("./sounds/click.ogg", "click"), createjs.Sound
				.registerSound("./sounds/shoot.ogg", "shoot"), createjs.Sound.registerSound("./sounds/dry_gun.ogg", "shoot"),
				createjs.Sound.registerSound("./sounds/dog_horde.ogg", "dogs"), createjs.Sound.registerSound(
					"./sounds/revolver_reload.ogg",
					"reload"), createjs.Sound.registerSound("./sounds/survivor_scream.ogg", "player_hit_0"), createjs.Sound.registerSound(
					"./sounds/hit_player_0.ogg", "player_hit_1"), createjs.Sound.registerSound("./sounds/hit_player_1.ogg",
					"player_hit_2"), createjs.Sound.registerSound("./sounds/hit_zombie.ogg", "hit_zombie0"), createjs.Sound.registerSound(
					"./sounds/hit_zombie.ogg", "hit_zombie1"), createjs.Sound.registerSound("./sounds/hit_genetic.ogg",
					"hit_zombie3"), createjs.Sound.registerSound("./sounds/dog_hit.ogg", "hit_zombie2")) :
			(createjs.Sound.alternateExtensions = ["ogg"], createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded,
					this)), createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack"), createjs.Sound.registerSound(
					"./sounds/zombie_crowd.mp3", "zombies"), createjs.Sound.registerSound("./sounds/click.mp3", "click"), createjs.Sound
				.registerSound("./sounds/shoot.mp3", "shoot"), createjs.Sound.registerSound("./sounds/dry_gun.mp3", "dry"),
				createjs.Sound.registerSound("./sounds/dog_horde.mp3", "dogs"),
				createjs.Sound.registerSound("./sounds/revolver_reload.mp3", "reload"), createjs.Sound.registerSound(
					"./sounds/survivor_scream.mp3", "player_hit_0"), createjs.Sound.registerSound("./sounds/hit_player_0.mp3",
					"player_hit_1"), createjs.Sound.registerSound("./sounds/hit_player_1.mp3", "player_hit_2"), createjs.Sound.registerSound(
					"./sounds/hit_zombie.mp3", "hit_zombie0"), createjs.Sound.registerSound("./sounds/hit_zombie.mp3", "hit_zombie1"),
				createjs.Sound.registerSound("./sounds/hit_genetic.mp3", "hit_zombie3"),
				createjs.Sound.registerSound("./sounds/dog_hit.mp3", "hit_zombie2")), d += 14)
	};
	this._loadImages = function() {
		s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
		s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
		s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
		s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
		s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
		s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
		s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
		s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
		s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
		s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
		s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
		s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
		s_oSpriteLibrary.addSprite("avatar", "./sprites/avatar_energy.png");
		s_oSpriteLibrary.addSprite("but_reload",
			"./sprites/but_reload.png");
		for (var a = 0; 86 > a; a++) s_oSpriteLibrary.addSprite("zombie0_" + a, "./sprites/zombie_0/zombie0_" + a + ".png");
		for (a = 0; 86 > a; a++) s_oSpriteLibrary.addSprite("zombie1_" + a, "./sprites/zombie_1/zombie1_" + a + ".png");
		for (a = 0; 33 > a; a++) s_oSpriteLibrary.addSprite("zombie2_" + a, "./sprites/zombie_2/zombie2_" + a + ".png");
		for (a = 0; 86 > a; a++) s_oSpriteLibrary.addSprite("zombie3_" + a, "./sprites/zombie_3/zombie3_" + a + ".png");
		for (a = 0; 57 > a; a++) s_oSpriteLibrary.addSprite("bg" + a, "./sprites/bg_game/bg_game_" + a +
			".jpg");
		s_oSpriteLibrary.addSprite("blood", "./sprites/blood.png");
		s_oSpriteLibrary.addSprite("damage", "./sprites/blood_camera.png");
		s_oSpriteLibrary.addSprite("bullet", "./sprites/bullet.png");
		s_oSpriteLibrary.addSprite("bullet_bar", "./sprites/bullet_bar.png");
		s_oSpriteLibrary.addSprite("health_bar", "./sprites/energy_bar.png");
		s_oSpriteLibrary.addSprite("health_fill", "./sprites/energy_fill.png");
		s_oSpriteLibrary.addSprite("player_right", "./sprites/gun_right.png");
		s_oSpriteLibrary.addSprite("player_left",
			"./sprites/gun_left.png");
		d += s_oSpriteLibrary.getNumSprites();
		s_oSpriteLibrary.loadSprites()
	};
	this._onImagesLoaded = function() {
		c++;
		s_oPreloader.refreshLoader(Math.floor(c / d * 100));
		c === d && this._onRemovePreloader()
	};
	this._onAllImagesLoaded = function() {};
	this.onAllPreloaderImagesLoaded = function() {
		this._loadImages()
	};
	this._onRemovePreloader = function() {
		try {
			saveItem("ls_available", "ok")
		} catch (g) {
			s_bStorageAvailable = !1
		}
		s_oPreloader.unload();
		isIOS() || !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || (s_oSoundTrack =
			createjs.Sound.play("soundtrack", {
				loop: -1
			}));
		this.gotoMenu()
	};
	this.gotoMenu = function() {
		new CMenu;
		f = STATE_MENU
	};
	this.gotoGame = function(a) {
		k = new CGame(h, a);
		f = STATE_GAME;
		$(s_oMain).trigger("start_session")
	};
	this.stopUpdate = function() {
		b = !1;
		createjs.Ticker.paused = !0;
		$("#block_game").css("display", "block");
		createjs.Sound.setMute(!0)
	};
	this.startUpdate = function() {
		s_iPrevTime = (new Date).getTime();
		b = !0;
		createjs.Ticker.paused = !1;
		$("#block_game").css("display", "none");
		s_bAudioActive && createjs.Sound.setMute(!1)
	};
	this._update = function(a) {
		if (!1 !== b) {
			var c = (new Date).getTime();
			s_iTimeElaps = c - s_iPrevTime;
			s_iCntTime += s_iTimeElaps;
			s_iCntFps++;
			s_iPrevTime = c;
			1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
			f === STATE_GAME && k.update();
			s_oStage.update(a)
		}
	};
	s_oMain = this;
	h = a;
	ENABLE_FULLSCREEN = a.fullscreen;
	ENABLE_CHECK_ORIENTATION = a.check_orientation;
	this.initContainer()
}
var s_bMobile, s_bAudioActive = !0,
	s_bFullscreen = !1,
	s_iCntTime = 0,
	s_iTimeElaps = 0,
	s_iPrevTime = 0,
	s_iCntFps = 0,
	s_iCurFps = 0,
	s_oPreloader, s_iLevelReached = 1,
	s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundTrack = null,
	s_oCanvas, s_iBestScore = 0,
	s_bStorageAvailable = !0;

function CTextButton(a, b, c, d, f, h, k) {
	var g, e, l, n, p;
	this._init = function(a, b, c, d, f, h, k) {
		g = [];
		e = [];
		f = createBitmap(c);
		var m = Math.ceil(k / 20);
		p = new createjs.Text(d, "bold " + k + "px " + PRIMARY_FONT, "#000000");
		p.textAlign = "center";
		p.textBaseline = "alphabetic";
		var q = p.getBounds();
		p.x = c.width / 2 + m;
		p.y = Math.floor(c.height / 2) + q.height / 3 + m;
		n = new createjs.Text(d, "bold " + k + "px " + PRIMARY_FONT, h);
		n.textAlign = "center";
		n.textBaseline = "alphabetic";
		q = n.getBounds();
		n.x = c.width / 2;
		n.y = Math.floor(c.height / 2) + q.height / 3;
		l = new createjs.Container;
		l.x = a;
		l.y = b;
		l.regX = c.width / 2;
		l.regY = c.height / 2;
		l.addChild(f, p, n);
		s_oStage.addChild(l);
		s_bMobile || (l.cursor = "pointer");
		this._initListener()
	};
	this.unload = function() {
		l.off("mousedown");
		l.off("pressup");
		s_oStage.removeChild(l)
	};
	this.setVisible = function(a) {
		l.visible = a
	};
	this._initListener = function() {
		oParent = this;
		l.on("mousedown", this.buttonDown);
		l.on("pressup", this.buttonRelease)
	};
	this.addEventListener = function(a, b, c) {
		g[a] = b;
		e[a] = c
	};
	this.buttonRelease = function() {
		l.scaleX = 1;
		l.scaleY = 1;
		playSound("click",
			1, 0);
		g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(e[ON_MOUSE_UP])
	};
	this.buttonDown = function() {
		l.scaleX = .9;
		l.scaleY = .9;
		g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(e[ON_MOUSE_DOWN])
	};
	this.setTextPosition = function(a) {
		n.y = a;
		p.y = a + 2
	};
	this.setPosition = function(a, b) {
		l.x = a;
		l.y = b
	};
	this.setX = function(a) {
		l.x = a
	};
	this.setY = function(a) {
		l.y = a
	};
	this.getButtonImage = function() {
		return l
	};
	this.getX = function() {
		return l.x
	};
	this.getY = function() {
		return l.y
	};
	this._init(a, b, c, d, f, h, k);
	return this
}

function CToggle(a, b, c, d, f) {
	var h, k, g, e, l;
	this._init = function(a, b, c, d, f) {
		l = void 0 !== f ? f : s_oStage;
		k = [];
		g = [];
		f = new createjs.SpriteSheet({
			images: [c],
			frames: {
				width: c.width / 2,
				height: c.height,
				regX: c.width / 2 / 2,
				regY: c.height / 2
			},
			animations: {
				state_true: [0],
				state_false: [1]
			}
		});
		h = d;
		e = createSprite(f, "state_" + h, c.width / 2 / 2, c.height / 2, c.width / 2, c.height);
		e.x = a;
		e.y = b;
		e.stop();
		s_bMobile || (e.cursor = "pointer");
		l.addChild(e);
		this._initListener()
	};
	this.unload = function() {
		e.off("mousedown", this.buttonDown);
		e.off("pressup",
			this.buttonRelease);
		l.removeChild(e)
	};
	this._initListener = function() {
		e.on("mousedown", this.buttonDown);
		e.on("pressup", this.buttonRelease)
	};
	this.addEventListener = function(a, b, c) {
		k[a] = b;
		g[a] = c
	};
	this.setCursorType = function(a) {
		e.cursor = a
	};
	this.setActive = function(a) {
		h = a;
		e.gotoAndStop("state_" + h)
	};
	this.buttonRelease = function() {
		e.scaleX = 1;
		e.scaleY = 1;
		playSound("click", 1, 0);
		h = !h;
		e.gotoAndStop("state_" + h);
		k[ON_MOUSE_UP] && k[ON_MOUSE_UP].call(g[ON_MOUSE_UP], h)
	};
	this.buttonDown = function() {
		e.scaleX = .9;
		e.scaleY =
			.9;
		k[ON_MOUSE_DOWN] && k[ON_MOUSE_DOWN].call(g[ON_MOUSE_DOWN])
	};
	this.setPosition = function(a, b) {
		e.x = a;
		e.y = b
	};
	this._init(a, b, c, d, f)
}

function CGfxButton(a, b, c, d) {
	var f, h, k, g, e, l, n, p, q, u, m, w;
	this._init = function(a, b, c) {
		f = !1;
		h = [];
		k = [];
		e = [];
		g = createBitmap(c);
		g.x = a;
		g.y = b;
		m = !1;
		n = l = 1;
		g.regX = c.width / 2;
		g.regY = c.height / 2;
		s_bMobile || (g.cursor = "pointer");
		w.addChild(g);
		this._initListener()
	};
	this.unload = function() {
		g.off("mousedown", q);
		g.off("pressup", u);
		w.removeChild(g)
	};
	this.setVisible = function(a) {
		g.visible = a
	};
	this.setCursorType = function(a) {
		g.cursor = a
	};
	this._initListener = function() {
		q = g.on("mousedown", this.buttonDown);
		u = g.on("pressup", this.buttonRelease)
	};
	this.addEventListener = function(a, b, c) {
		h[a] = b;
		k[a] = c
	};
	this.needReload = function() {
		trace(m);
		!1 === m ? (createjs.Tween.removeTweens(g), (new createjs.Tween.get(g)).to({
			scaleX: 1.5,
			scaleY: 1.5
		}, 500).call(function() {
			m = !0
		})) : (createjs.Tween.removeTweens(g), (new createjs.Tween.get(g)).to({
			scaleX: 1,
			scaleY: 1
		}, 500).call(function() {
			m = !1
		}))
	};
	this.addEventListenerWithParams = function(a, b, c, d) {
		h[a] = b;
		k[a] = c;
		e[a] = d
	};
	this.enable = function() {
		f = !1
	};
	this.disable = function() {
		f = !0
	};
	this.buttonRelease = function() {
		f || (g.scaleX = 0 <
			l ? 1 : -1, g.scaleY = 1, playSound("click", 1, 0), h[ON_MOUSE_UP] && h[ON_MOUSE_UP].call(k[ON_MOUSE_UP], e[
				ON_MOUSE_UP]))
	};
	this.buttonDown = function() {
		f || (g.scaleX = 0 < l ? .9 : -.9, g.scaleY = .9, h[ON_MOUSE_DOWN] && h[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN], e[
			ON_MOUSE_DOWN]))
	};
	this.rotation = function(a) {
		g.rotation = a
	};
	this.getButton = function() {
		return g
	};
	this.setPosition = function(a, b) {
		g.x = a;
		g.y = b
	};
	this.setX = function(a) {
		g.x = a
	};
	this.setY = function(a) {
		g.y = a
	};
	this.getButtonImage = function() {
		return g
	};
	this.setScaleX = function(a) {
		l = g.scaleX =
			a
	};
	this.getX = function() {
		return g.x
	};
	this.getY = function() {
		return g.y
	};
	this.pulseAnimation = function() {
		createjs.Tween.get(g).to({
			scaleX: 1.5 * l,
			scaleY: 1.5 * n
		}, 850).to({
			scaleX: l,
			scaleY: n
		}, 650).call(function() {
			p.pulseAnimation()
		})
	};
	this.trebleAnimation = function() {
		createjs.Tween.get(g).to({
			rotation: 5
		}, 75, createjs.Ease.quadOut).to({
			rotation: -5
		}, 140, createjs.Ease.quadIn).to({
			rotation: 0
		}, 75, createjs.Ease.quadIn).wait(750).call(function() {
			p.trebleAnimation()
		})
	};
	this.removeAllTweens = function() {
		createjs.Tween.removeTweens(g)
	};
	w = void 0 !== d ? d : s_oStage;
	this._init(a, b, c);
	p = this;
	return this
}

function CMenu() {
	var a, b, c, d, f, h, k, g, e, l, n, p, q = null,
		u = null;
	this._init = function() {
		k = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
		k.x = -40;
		k.y = -40;
		s_oStage.addChild(k);
		var m = s_oSpriteLibrary.getSprite("but_play");
		g = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 400, m);
		g.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
		m = s_oSpriteLibrary.getSprite("but_credits");
		c = 10 + m.width / 2;
		d = m.height / 2 + 10;
		n = new CGfxButton(c, d, m);
		n.addEventListener(ON_MOUSE_UP, this._onCredits, this);
		if (!1 === DISABLE_SOUND_MOBILE ||
			!1 === s_bMobile) m = s_oSpriteLibrary.getSprite("audio_icon"), f = CANVAS_WIDTH - m.width / 4 - 10, h = m.height /
			2 + 10, l = new CToggle(f, h, m, s_bAudioActive, s_oStage), l.addEventListener(ON_MOUSE_UP, this._onAudioToggle,
				this);
		var m = window.document,
			w = m.documentElement;
		q = w.requestFullscreen || w.mozRequestFullScreen || w.webkitRequestFullScreen || w.msRequestFullscreen;
		u = m.exitFullscreen || m.mozCancelFullScreen || m.webkitExitFullscreen || m.msExitFullscreen;
		!1 === ENABLE_FULLSCREEN && (q = !1);
		q && !1 === inIframe() && (m = s_oSpriteLibrary.getSprite("but_fullscreen"),
			a = c + m.width / 2 + 10, b = d, p = new CToggle(a, b, m, s_bFullscreen, s_oStage), p.addEventListener(ON_MOUSE_UP,
				this._onFullscreenRelease, this));
		e = new createjs.Shape;
		e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		s_oStage.addChild(e);
		createjs.Tween.get(e).to({
			alpha: 0
		}, 1E3).call(function() {
			s_oStage.removeChild(e)
		});
		s_bStorageAvailable ? (m = getItem("best_score"), null !== m && (s_iBestScore = m)) : new CMsgBox(TEXT_ERR_LS,
			s_oStage);
		this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
	};
	this.unload = function() {
		g.unload();
		g = null;
		n.unload();
		s_oStage.removeChild(k);
		k = null;
		if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) l.unload(), l = null;
		q && !1 === inIframe() && p.unload();
		s_oMenu = null
	};
	this.refreshButtonPos = function(e, k) {
		!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || l.setPosition(f - e, h + k);
		q && !1 === inIframe() && p.setPosition(a + e, b + k);
		g.setPosition(CANVAS_WIDTH / 2 + e, CANVAS_HEIGHT / 2 + 100 + k);
		n.setPosition(c + e, d + k)
	};
	this.exitFromCredits = function() {};
	this._onAudioToggle = function() {
		createjs.Sound.setMute(s_bAudioActive);
		s_bAudioActive = !s_bAudioActive
	};
	this._onCredits = function() {
		new CCreditsPanel
	};
	this._onButPlayRelease = function() {
		this.unload();
		if (isIOS() && null === s_oSoundTrack) {
			if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) s_oSoundTrack = createjs.Sound.play("soundtrack", {
				loop: -1
			})
		} else playSound("click", 1, 0);
		s_oMain.gotoGame()
	};
	this._onFullscreenRelease = function() {
		s_bFullscreen ? (u.call(window.document), s_bFullscreen = !1) : (q.call(window.document.documentElement),
			s_bFullscreen = !0);
		sizeHandler()
	};
	s_oMenu = this;
	this._init()
}
var s_oMenu = null;

function CGame(a) {
	var b, c, d, f, h, k, g, e, l, n, p, q, u, m, w, x = !1,
		G, r, y, B, z, t, I, A, D, E, C, L, v, J, F, M, K;
	this._init = function() {
		s_oGame = this;
		PLAYER_HEALTH = a.iPlayerHealth;
		ZOMBIE_HEALTHS = a.aZombieHealth;
		SPAWN_INTERVAL = a.iSpawnInterval;
		WAITING_TIME = a.iWaveInterval;
		WAVE_TARGET = a.aAmountZombiesOnStage;
		MAX_ZOMBIE_ON_SCREEN = a.iZombieOnScreen;
		M = !0;
		z = new createjs.Shape;
		z.graphics.beginFill("#000").drawRect(0, 10, CANVAS_WIDTH + 20, CANVAS_HEIGHT + 20);
		E = !1;
		z.alpha = .01;
		I = !0;
		setVolume(s_oSoundTrack, .1);
		J = createjs.Sound.play("zombies", {
			loop: -1
		});
		F = createjs.Sound.play("dogs", {
			loop: -1
		});
		r = new createjs.Container;
		s_oStage.addChild(r);
		C = !1;
		r.x = -20;
		r.y = -20;
		t = [];
		B = new createjs.Container;
		for (var H = 0; 57 > H; H++) t[H] = createBitmap(s_oSpriteLibrary.getSprite("bg" + H)), t[H].visible = !1, B.addChild(
			t[H]);
		D = q = 0;
		y = new createjs.Container;
		r.addChild(z);
		r.addChild(B);
		r.addChild(y);
		B.on("mousedown", this.Shoot);
		p = l = G = d = 0;
		m = [];
		K = [];
		L = w = !0;
		K = a.aZombieOnStage;
		u = [];
		e = [];
		for (H = 0; H < WAVE_TARGET[WAVE_TARGET.length - 1]; H++) u.push(new CZombie(0, -1E3, -1E3, y));
		g = WAVE_TARGET;
		k = h = f = 0;
		n = !1;
		A = new CPlayer;
		b = new CInterface;
		c = new CHelpPanel;
		v = new CEndPanel(f);
		!1 !== getItem(FIRST_TIME_ITEM_NAME) && (saveItem(FIRST_TIME_ITEM_NAME, !0), c.show());
		s_bMobile || (document.onkeydown = function(a) {
			82 === a.keyCode && b.ammoReload();
			a.preventDefault();
			return !1
		})
	};
	this.unload = function() {
		b.unload();
		s_oStage.removeAllChildren();
		s_oGame = document.onkeydown = null
	};
	this.showHelp = function() {
		c.show()
	};
	this.toggleShoot = function(a) {
		M = a
	};
	this.togglePause = function() {
		A.setVisible(x);
		x = !x
	};
	this.onExit = function() {
		s_oSoundTrack.volume =
			1;
		stopSound(F);
		stopSound(J);
		r.x = -20;
		r.y = -20;
		createjs.Tween.removeAllTweens();
		s_oGame.unload();
		s_oMain.gotoMenu();
		$(s_oMain).trigger("end_session");
		$(s_oMain).trigger("show_interlevel_ad")
	};
	this.restart = function() {
		this.unload();
		this._init()
	};
	this.setOccurrences = function() {
		var a = d;
		a > K.length && (a = K.length - 1);
		m = [];
		for (var b = 0; b < K[a].length; b++)
			for (var c = 0; c < K[a][b]; c++) m.push(b);
		n = !0
	};
	this.getHealth = function() {
		return A.getHealth()
	};
	this.getAmmo = function() {
		return A.getAmmo()
	};
	this.ammoReload = function() {
		A.reload()
	};
	this.spawn = function(a) {
		var b = Math.floor(randomFloatBetween(0, u.length));
		a = u[a];
		e.push(a);
		a.setVariables(m[b], randomFloatBetween(400, 630), CANVAS_HEIGHT / 2 + 100, 1);
		p = 0;
		q++
	};
	this.damagePlayer = function() {
		A.damage();
		b.damage();
		q--
	};
	this.Shoot = function(a) {
		M && (A.Shoot(a), b.removeAmmoIcon())
	};
	this.increaseScore = function(a) {
		f += a;
		h++;
		q--
	};
	this.getScore = function() {
		return 0 !== h ? {
			zombie: h,
			wave: d + 1,
			score: 100 * (d + 1) + f
		} : {
			zombie: h,
			wave: d + 1,
			score: 0
		}
	};
	this.updateAnim = function() {
		if (I = !I) 0 === D ? (t[t.length - 1].visible = !1,
			t[0].visible = !0) : (t[D - 1].visible = !1, t[D].visible = !0), D++, D > t.length - 1 && (D = 0);
		L ? w && (w = !1, 0 > r.x ? (new createjs.Tween.get(r)).to({
			x: 5,
			y: -5
		}, 500, createjs.Ease.sineOut).call(function() {
			w = !0
		}) : (new createjs.Tween.get(r)).to({
			x: -5,
			y: 5
		}, 500, createjs.Ease.sineOut).call(function() {
			w = !0
		})) : w && (w = !1, 0 > r.x ? (new createjs.Tween.get(r)).to({
			x: 60,
			y: -50
		}, 500, createjs.Ease.sineOut).call(function() {
			w = !0
		}) : (new createjs.Tween.get(r)).to({
			x: -80,
			y: 50
		}, 500, createjs.Ease.sineOut).call(function() {
			w = !0
		}))
	};
	this.updateSounds =
		function() {
			var a = d;
			a > g.length && (a = g.length - 1);
			3 === a || 6 === a || 9 === a || 12 === a ? (J.volume = .4, F.volume = 1) : (F.volume = .4, J.volume = 1)
		};
	this.update = function() {
		if (!x) switch (this.updateSounds(), A.update(), b.refreshGUI(), 0 >= A.getHealth() && (k = 3), k) {
			case 0:
				this.updateAnim();
				l += s_iTimeElaps;
				l / 1E3 > WAITING_TIME && (!1 === n ? this.setOccurrences() : !0 === n && (G = p = l = 0, C = E = !1, k = 1));
				break;
			case 1:
				this.updateAnim();
				p += s_iTimeElaps;
				var a = d;
				a > g.length && (a = g.length - 1);
				G < g[a] && !C && p / 1E3 > SPAWN_INTERVAL && q < MAX_ZOMBIE_ON_SCREEN && (this.spawn(G),
					G++, !1 === E && (E = !0));
				E && G >= g[a] && (C = !0, 0 >= e.length && (d++, n = !1, k = 0));
				aSortedArray = [];
				for (a = prevY = 0; a < e.length; a++) e[a].update(0 >= A.getAmmo()), aSortedArray.push({
					zombie: e[a],
					lerp: e[a].getY()
				});
				aSortedArray.sort(compare);
				for (a = 0; a < aSortedArray.length; a++) y.setChildIndex(aSortedArray[a].zombie.getContainer(), a);
				for (a = 0; a < e.length; a++) 0 === e[a].getState() && e.splice(a, 1);
				break;
			case 2:
				createjs.Tween.get(z).to({
					alpha: 1
				}, 1E3), k = 3;
			case 3:
				for (a = 0; a < e.lenght; a++) e[a].reset();
				null !== getItem(SCORE_ITEM_NAME) ? getItem(SCORE_ITEM_NAME) <
					this.getScore().score && saveItem(SCORE_ITEM_NAME, this.getScore().score) : saveItem(SCORE_ITEM_NAME, this.getScore()
						.score);
				$(s_oMain).trigger("save_score", this.getScore().score);
				v.show()
		}
	};
	s_oTweenController = new CTweenController;
	this._init()
}
var s_oGame, s_oTweenController;

function CInterface(a) {
	var b, c, d, f, h, k, g, e, l, n, p, q, u, m, w, x, G, r, y, B, z = null,
		t = null,
		I, A, D, E, C;
	this._init = function() {
		r = [];
		var a = s_oSpriteLibrary.getSprite("but_exit");
		d = CANVAS_WIDTH - a.width / 2 - 10;
		f = a.height / 2 + 10;
		I = new CGfxButton(d, f, a, s_oStage);
		I.addEventListener(ON_MOUSE_UP, this._onExit, this);
		var v = s_oSpriteLibrary.getSprite("but_reload");
		g = v.width / 2 + 20;
		e = CANVAS_HEIGHT - 100;
		A = new CGfxButton(g, e, v, s_oStage);
		A.addEventListener(ON_MOUSE_DOWN, this.ammoReload, this);
		q = new createjs.Container;
		u = createBitmap(s_oSpriteLibrary.getSprite("health_bar"));
		C = new createjs.Shape;
		C.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(u.x, u.y, u.getBounds().width, u.getBounds().height);
		m = createBitmap(s_oSpriteLibrary.getSprite("health_fill"));
		m.x = 4;
		m.y = 4;
		m.mask = C;
		E = !0;
		v = createBitmap(s_oSpriteLibrary.getSprite("avatar"));
		v.x = -50;
		v.y = -20;
		q.addChild(u);
		q.addChild(v);
		q.addChild(m);
		q.addChild(C);
		w = .98 / PLAYER_HEALTH;
		x = new createjs.Container;
		G = createBitmap(s_oSpriteLibrary.getSprite("bullet_bar"));
		x.addChild(G);
		x.y = CANVAS_HEIGHT - 10;
		y = new createjs.Text(TEXT_WAVE +
			s_oGame.getScore().wave, "20px " + PRIMARY_FONT, "#990000");
		y.x = CANVAS_WIDTH - 90;
		y.y = CANVAS_HEIGHT - 50;
		for (var v = 19, J = 0; J <= STARTING_AMMO - 1; J++) {
			var F = createBitmap(s_oSpriteLibrary.getSprite("bullet"));
			r.push(F);
			x.addChild(F);
			F.x = v;
			F.y = -10;
			F.scaleX = 1;
			F.scaleY = 1;
			v += 20
		}
		s_oStage.addChild(x);
		s_oStage.addChild(y);
		s_oStage.addChild(q);
		q.x = 60;
		q.y = 30;
		!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (v = s_oSpriteLibrary.getSprite("audio_icon"), l = d - a.width / 2 -
			v.width / 4 - 10, n = f, p = new CToggle(l, n, v, s_bAudioActive, s_oStage), p.addEventListener(ON_MOUSE_UP,
				this._onAudioToggle, this), b = l - v.width / 2 - 10, c = n) : (b = d - a.width - 10, c = f);
		a = window.document;
		v = a.documentElement;
		z = v.requestFullscreen || v.mozRequestFullScreen || v.webkitRequestFullScreen || v.msRequestFullscreen;
		t = a.exitFullscreen || a.mozCancelFullScreen || a.webkitExitFullscreen || a.msExitFullscreen;
		!1 === ENABLE_FULLSCREEN && (z = !1);
		z && !1 === inIframe() && (v = s_oSpriteLibrary.getSprite("but_fullscreen"), B = new CToggle(b, c, v, s_bFullscreen,
			s_oStage), B.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
		a = s_oSpriteLibrary.getSprite("but_credits");
		h = b - a.width - 10;
		k = a.height / 2 + 10;
		D = new CGfxButton(h, f, a, s_oStage);
		D.addEventListener(ON_MOUSE_UP, this._showHelp, this);
		this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
	};
	this.refreshButtonPos = function(a, m) {
		!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || p.setPosition(l - a, n + m);
		z && !1 === inIframe() && B.setPosition(b - a, c + m);
		q.x = 60 + a;
		q.y = 30 + m;
		x.x = a;
		x.y = CANVAS_HEIGHT - x.getBounds().height / 2 - 20 - m;
		I.setPosition(d - a, f + m);
		A.setPosition(g + a, e - m);
		D.setPosition(h + a, k + m);
		y.x = CANVAS_WIDTH - 90 - a;
		y.y = CANVAS_HEIGHT - 50 - m
	};
	this.unload =
		function() {
			if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) p.unload(), p = null;
			z && !1 === inIframe() && B.unload();
			I.unload();
			s_oInterface = null
		};
	this._showHelp = function() {
		s_oGame.showHelp()
	};
	this._onExit = function() {
		s_oGame.onExit()
	};
	this._onAudioToggle = function() {
		createjs.Sound.setMute(s_bAudioActive);
		s_bAudioActive = !s_bAudioActive
	};
	this.removeAmmoIcon = function() {
		for (var a = !1, b = r.length - 1; 0 <= b; b--) !1 === a && !0 === r[b].visible && (r[b].visible = !1, a = !0)
	};
	this.ammoReload = function() {
		s_oGame.ammoReload();
		for (var a = 0; a <
			r.length; a++) r[a].visible = !0
	};
	this.damage = function() {
		C.scaleX -= w
	};
	this._onFullscreenRelease = function() {
		s_bFullscreen ? (t.call(window.document), s_bFullscreen = !1) : (z.call(window.document.documentElement),
			s_bFullscreen = !0);
		sizeHandler()
	};
	this.refreshGUI = function() {
		0 >= s_oPlayer.getAmmo() && E ? (E = !1, A.pulseAnimation()) : 0 < s_oPlayer.getAmmo() && (E = !0, A.removeAllTweens());
		y.text = TEXT_WAVE + s_oGame.getScore().wave
	};
	s_oInterface = this;
	this._init(a);
	return this
}
var s_oInterface = null;

function CCreditsPanel() {
	var a, b, c, d, f, h, k, g;
	this._init = function() {
		f = new createjs.Shape;
		f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		f.alpha = 0;
		s_oStage.addChild(f);
		(new createjs.Tween.get(f)).to({
			alpha: .7
		}, 500);
		var e = s_oSpriteLibrary.getSprite("msg_box");
		g = new createjs.Container;
		g.y = CANVAS_HEIGHT + e.height / 2;
		s_oStage.addChild(g);
		a = createBitmap(e);
		a.regX = e.width / 2;
		a.regY = e.height / 2;
		a.x = CANVAS_WIDTH / 2;
		a.y = CANVAS_HEIGHT / 2;
		g.addChild(a);
		h = new createjs.Shape;
		h.graphics.beginFill("#0f0f0f").drawRect(0,
			0, CANVAS_WIDTH, CANVAS_HEIGHT);
		h.alpha = .01;
		h.on("click", this._onLogoButRelease);
		g.addChild(h);
		e = s_oSpriteLibrary.getSprite("but_exit");
		c = new CGfxButton(715, 148, e, g);
		c.addEventListener(ON_MOUSE_UP, this.unload, this);
		d = new createjs.Text(TEXT_CREDITS_DEVELOPED, "44px " + PRIMARY_FONT, "#cc0000");
		d.textAlign = "center";
		d.textBaseline = "alphabetic";
		d.x = CANVAS_WIDTH / 2;
		d.y = CANVAS_HEIGHT / 2 - 60;
		g.addChild(d);
		e = s_oSpriteLibrary.getSprite("logo_ctl");
		b = createBitmap(e);
		b.regX = e.width / 2;
		b.regY = e.height / 2;
		b.x = CANVAS_WIDTH /
			2;
		b.y = CANVAS_HEIGHT / 2;
		g.addChild(b);
		k = new createjs.Text("www.haiyong.site", "38px " + PRIMARY_FONT, "#cc0000");
		k.textAlign = "center";
		k.textBaseline = "alphabetic";
		k.x = CANVAS_WIDTH / 2;
		k.y = CANVAS_HEIGHT / 2 + 80;
		g.addChild(k);
		(new createjs.Tween.get(g)).to({
			y: 0
		}, 1E3, createjs.Ease.quintOut)
	};
	this.unload = function() {
		h.off("click", this._onLogoButRelease);
		c.unload();
		c = null;
		s_oStage.removeChild(f);
		s_oStage.removeChild(g);
		s_oMenu.exitFromCredits()
	};
	this._onLogoButRelease = function() {
		console.log("http://www.codethislab.com/index.php?&l=en",
			"_blank")
	};
	this._init()
}

function CEndPanel(a) {
	var b, c, d, f, h, k, g, e, l, n, p;
	this._init = function() {
		n = new createjs.Container;
		p = new createjs.Container;
		s_oStage.addChild(p);
		s_oStage.addChild(n);
		c = new createjs.Shape;
		c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		c.alpha = 0;
		b = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
		p.addChild(c);
		n.addChild(b);
		h = new createjs.Text(TEXT_YOUR_SCORE + s_oGame.getScore().score + TEXT_YOUR_SCORE2, "20px " + PRIMARY_FONT,
			"#cc0000");
		k = new createjs.Text(TEXT_YOUR_SCORE3 + s_oGame.getScore().wave +
			TEXT_YOUR_SCORE4, "20px " + PRIMARY_FONT, "#cc0000");
		g = new createjs.Text(TEXT_YOUR_SCORE5 + s_oGame.getScore().score, "24px " + PRIMARY_FONT, "#cc0000");
		e = new createjs.Text(TEXT_YOUR_SCORE6 + getItem(SCORE_ITEM_NAME), "20px " + PRIMARY_FONT, "#d99b01");
		g.textAlign = "center";
		g.textBaseline = "alphabetic";
		g.x = n.getBounds().width / 2;
		g.y = 150;
		e.textAlign = "center";
		e.textBaseline = "alphabetic";
		e.x = n.getBounds().width / 2;
		e.y = 200;
		h.textAlign = "center";
		h.textBaseline = "alphabetic";
		h.x = n.getBounds().width / 2;
		h.y = 70;
		k.textAlign = "center";
		k.textBaseline = "alphabetic";
		k.x = n.getBounds().width / 2;
		k.y = 110;
		n.addChild(h);
		n.addChild(g);
		n.addChild(e);
		n.addChild(k);
		d = new CGfxButton(n.getBounds().width / 2 - 180, 300, s_oSpriteLibrary.getSprite("but_home"), n);
		d.addEventListener(ON_MOUSE_UP, this._onExit, this);
		f = new CGfxButton(n.getBounds().width / 2 + 180, 300, s_oSpriteLibrary.getSprite("but_restart"), n);
		f.addEventListener(ON_MOUSE_UP, this._onRestart, this);
		n.x = CANVAS_WIDTH / 2 - n.getBounds().width / 2;
		n.y = -n.getBounds().height;
		p.on("mousedown", function() {})
	};
	this.unload = function() {
		d.unload();
		d = null;
		f.unload();
		f = null;
		s_oStage.removeChild(n);
		s_oStage.removeChild(p)
	};
	this.show = function() {
		(new createjs.Tween.get(c)).to({
			alpha: .8
		}, 1E3);
		(new createjs.Tween.get(n)).to({
			y: CANVAS_HEIGHT / 2 - n.getBounds().height / 2
		}, 1E3, createjs.Ease.quintOut);
		h.text = TEXT_YOUR_SCORE + s_oGame.getScore().zombie + TEXT_YOUR_SCORE2;
		k.text = TEXT_YOUR_SCORE3 + s_oGame.getScore().wave + TEXT_YOUR_SCORE4;
		g.text = TEXT_YOUR_SCORE5 + s_oGame.getScore().score;
		null !== getItem(SCORE_ITEM_NAME) ? e.text = TEXT_YOUR_SCORE6 +
			getItem(SCORE_ITEM_NAME) : e.text = TEXT_YOUR_SCORE6 + 0
	};
	this._onExit = function() {
		l.unload();
		s_oGame.onExit()
	};
	this._onRestart = function() {
		l.unload();
		s_oGame.restart()
	};
	l = this;
	this._init(a)
}

function CHelpPanel() {
	var a, b, c, d, f;
	this._init = function() {
		f = new createjs.Container;
		s_oStage.addChild(f);
		d = new createjs.Shape;
		d.graphics.beginFill("white").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		d.alpha = .01;
		d.on("mousedown", function() {});
		f.addChild(d);
		a = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
		f.addChild(a);
		var h = createBitmap(s_oSpriteLibrary.getSprite("zombie0_0")),
			k = createBitmap(s_oSpriteLibrary.getSprite("but_reload"));
		h.scaleX = .6;
		h.scaleY = .6;
		h.y = 10;
		h.x = 20;
		b = new createjs.Text(TEXT_HELP,
			"36px " + PRIMARY_FONT, "#990000");
		c = new createjs.Text(TEXT_HELP2, "36px " + PRIMARY_FONT, "#990000");
		b.x = 120;
		b.y = 105;
		c.x = 120;
		c.y = 280;
		k.y = 280;
		k.x = 25;
		skipBut = new CGfxButton(530, 315, s_oSpriteLibrary.getSprite("but_continue"), f);
		skipBut.addEventListener(ON_MOUSE_DOWN, this.hide, this);
		f.addChild(h);
		f.addChild(b);
		f.addChild(c);
		f.addChild(k);
		f.x = CANVAS_WIDTH / 2 - f.getBounds().width / 2;
		f.y = -f.getBounds().height
	};
	this.hide = function() {
		(new createjs.Tween.get(f)).to({
			y: -f.getBounds().height
		}, 1E3, createjs.Ease.cubicOut);
		d.alpha = 0;
		s_oGame.togglePause()
	};
	this.unload = function() {};
	this.show = function() {
		d.alpha = .01;
		s_oGame.togglePause();
		(new createjs.Tween.get(f)).to({
			y: CANVAS_HEIGHT / 2 - 200
		}, 500, createjs.Ease.cubicOut)
	};
	this._init()
};
