/*! game-api - v0.17.1 - 2015-05-04 */
(function(e) {
	"use strict";

	function t() {}
	function n(e) {
		if (e = e || {}, this.IS_MASTER = e.isMaster || !1, !this.IS_MASTER) throw Error("The DataStore can only be instantiated by the Master");
		this.dataStore = {}
	}
	function i(e, t) {
		if (this.IS_MASTER = e && e.isMaster ? e.isMaster : !1, this.IS_SLAVE = !this.IS_MASTER, this.messenger = null, this.subscribers = {}, this.moduleReady = t ? t : !1, this.data = e.data || null, this.gameState = "resume", !e || !e.messenger) throw Error("No messenger passed to the Game module instance");
		this.messenger = e.messenger, window.addEventListener ? window.addEventListener("message", this._performAction.bind(this), !1) : window.attachEvent && window.attachEvent("onmessage", this._performAction.bind(this)), this.IS_MASTER && this.messenger.subscribe("gameapi.game.adjustHeight", this.adjustHeight, this)
	}
	function a(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_STANDALONE = e.isStandalone, this.messenger = e.messenger, this.eventTracking = e.eventTracking, this.moduleReady = t ? t : !1, this.isAvailable = !1, this.locale = ""
	}
	function r(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_STANDALONE = e.isStandalone, this.messenger = e.messenger, this.eventTracking = e.eventTracking, this.moduleReady = t ? t : !1, this.isAvailable = !1
	}
	function s(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.moduleReady = t ? t : !1, this.messenger = e.messenger, this.data = e.data || null, this.eventTracking = e.eventTracking, this.initialHeight = e.initialHeight, this._setupMasterEvent()
	}
	function o(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.moduleReady = t ? t : !1, this.messenger = e.messenger, this.data = e.data || null, this.eventTracking = e.eventTracking, this.initialHeight = e.initialHeight, this._setupMasterEvent()
	}
	function l(e, t) {
		e = e || {}, this.isMaster = e.isMaster, this.isStandalone = e.isStandalone, this.messenger = e.messenger, this.moduleReady = t ? t : !1, this.timeoutAfter = 500, this.timeout = !1, this._callbacks = {
			pause: !1,
			resume: !1
		}
	}
	function u(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.isStandalone = e.isStandalone, this.messenger = e.messenger, this.eventTracking = e.eventTracking, this.moduleReady = t ? t : !1, this.events = {
			GAME_START: "GAME_START",
			GAME_END: "GAME_END",
			GAME_PAUSE: "GAME_PAUSE",
			GAME_CONTINUE: "GAME_CONTINUE",
			GAME_MUTE: "GAME_MUTE",
			LEVEL_FAIL: "LEVEL_FAIL",
			LEVEL_COMPLETE: "LEVEL_COMPLETE"
		}, this._setupEvents()
	}
	function c(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = e.isStandalone, this.data = e.data, this.messenger = e.messenger, this.moduleReady = t ? t : !1, this.gamePlayTracking = {
			started: !1,
			appid: null,
			host: null,
			timestamp: null
		}, this.timeInGameTracking = {
			started: !1,
			appid: null,
			timestamp: null
		}
	}
	function d(e, t) {
		e = e || {}, this.IS_MASTER = e.isMaster, this.IS_SLAVE = !this.IS_MASTER, this.IS_STANDALONE = e.isStandalone, this.moduleReady = t ? t : !1, this.messenger = e.messenger, this.components = e.components, this.data = e.data || null
	}
	function p(e) {
		var t = "string" == typeof e ? h(e) : e;
		t && (this.type = t.type, this.callbackId = t.callbackId, this.data = t.data)
	}
	function h(e) {
		var t, n, i, a = !1,
			r = [];
		if ("string" == typeof e && (r = e.split("|"), "gameapi" === r[0])) {
			r.shift(), t = r.shift(), i = parseInt(r.shift(), 10), n = r.join("|");
			try {
				a = {
					type: t,
					callbackId: i,
					data: "" !== n ? JSON.parse(n) : ""
				}
			} catch (s) {}
		}
		return a
	}
	function g(e) {
		e = e || {}, this.IS_MASTER = "boolean" == typeof e.isMaster ? e.isMaster : !1, this.IS_SLAVE = !this.IS_MASTER, this.api = e.api ? e.api : {}, this._target = e.target ? e.target : {}, this._callbacks = [], this._channels = [], this.IS_MASTER && e.dataStore && (this.dataStore = e.dataStore), this._setupEventListener()
	}
	function f(e, n, l, c, d) {
		window.outerHeight - window.innerHeight, this.version = "0.17.1", this.isReady = !1, this._setRole(), this.__ = {}, this.__.dataStore = this.IS_MASTER ? new e({
			isMaster: !0
		}) : null, this.__.messenger = new n({
			isMaster: this.IS_MASTER,
			api: this,
			target: this._getTarget(),
			dataStore: this.__.dataStore
		}), this.__.components = new t, this.Branding = new l({
			isMaster: this.IS_MASTER,
			isStandalone: this.IS_STANDALONE,
			messenger: this.__.messenger,
			components: this.__.components
		}, !1), this.__.EventTracking = new c({
			isMaster: this.IS_MASTER,
			isStandalone: this.IS_STANDALONE,
			data: null,
			messenger: this.__.messenger
		}, !1), this.GameBreak = new d({
			isMaster: this.IS_MASTER,
			isStandalone: this.IS_STANDALONE,
			messenger: this.__.messenger
		}, !1), this.Game = new i({
			isMaster: this.IS_MASTER,
			messenger: this.__.messenger
		}, !1), this.Score = new s({
			isMaster: this.IS_MASTER,
			isStandalone: this.IS_STANDALONE,
			messenger: this.__.messenger,
			eventTracking: this.__.EventTracking,
			initialHeight: window.outerHeight - window.innerHeight
		}, !1), this.Award = new o({
			isMaster: this.IS_MASTER,
			isStandalone: this.IS_STANDALONE,
			messenger: this.__.messenger,
			eventTracking: this.__.EventTracking,
			initialHeight: window.outerHeight - window.innerHeight
		}, !1), this.User = new a({
			isMaster: this.IS_MASTER,
			messenger: this.__.messenger,
			eventTracking: this.__.EventTracking
		}, !1), this.Friends = new r({
			isMaster: this.IS_MASTER,
			messenger: this.__.messenger,
			eventTracking: this.__.EventTracking
		}, !1), this.GameEvent = new u({
			isMaster: this.IS_MASTER,
			messenger: this.__.messenger,
			eventTracking: this.__.EventTracking
		}, !1)
	}
	var m;
	(function(e) {
		if ("function" == typeof bootstrap) bootstrap("promise", e);
		else if ("object" == typeof exports) module.exports = e();
		else if ("function" == typeof define && define.amd) define(e);
		else if ("undefined" != typeof ses) {
			if (!ses.ok()) return;
			ses.makeQ = e
		} else m = e()
	})(function() {
		function e(e) {
			return function() {
				return X.apply(e, arguments)
			}
		}
		function t(e) {
			return e === Object(e)
		}
		function n(e) {
			return "[object StopIteration]" === tt(e) || e instanceof q
		}
		function i(e, t) {
			if (H && t.stack && "object" == typeof e && null !== e && e.stack && -1 === e.stack.indexOf(nt)) {
				for (var n = [], i = t; i; i = i.source) i.stack && n.unshift(i.stack);
				n.unshift(e.stack);
				var r = n.join("\n" + nt + "\n");
				e.stack = a(r)
			}
		}
		function a(e) {
			for (var t = e.split("\n"), n = [], i = 0; t.length > i; ++i) {
				var a = t[i];
				o(a) || r(a) || !a || n.push(a)
			}
			return n.join("\n")
		}
		function r(e) {
			return -1 !== e.indexOf("(module.js:") || -1 !== e.indexOf("(node.js:")
		}
		function s(e) {
			var t = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(e);
			if (t) return [t[1], Number(t[2])];
			var n = /at ([^ ]+):(\d+):(?:\d+)$/.exec(e);
			if (n) return [n[1], Number(n[2])];
			var i = /.*@(.+):(\d+)$/.exec(e);
			return i ? [i[1], Number(i[2])] : void 0
		}
		function o(e) {
			var t = s(e);
			if (!t) return !1;
			var n = t[0],
				i = t[1];
			return n === F && i >= J && st >= i
		}
		function l() {
			if (H) try {
				throw Error()
			} catch (e) {
				var t = e.stack.split("\n"),
					n = t[0].indexOf("@") > 0 ? t[1] : t[2],
					i = s(n);
				if (!i) return;
				return F = i[0], i[1]
			}
		}
		function u(e, t, n) {
			return function() {
				return "undefined" != typeof console && "function" == typeof console.warn && console.warn(t + " is deprecated, use " + n + " instead.", Error("").stack), e.apply(e, arguments)
			}
		}
		function c(e) {
			return y(e) ? e : v(e) ? k(e) : T(e)
		}
		function d() {
			function e(e) {
				t = e, r.source = e, Q(n, function(t, n) {
					W(function() {
						e.promiseDispatch.apply(e, n)
					})
				}, void 0), n = void 0, i = void 0
			}
			var t, n = [],
				i = [],
				a = z(d.prototype),
				r = z(g.prototype);
			if (r.promiseDispatch = function(e, a, r) {
				var s = K(arguments);
				n ? (n.push(s), "when" === a && r[1] && i.push(r[1])) : W(function() {
					t.promiseDispatch.apply(t, s)
				})
			}, r.valueOf = function() {
				if (n) return r;
				var e = m(t);
				return y(e) && (t = e), e
			}, r.inspect = function() {
				return t ? t.inspect() : {
					state: "pending"
				}
			}, c.longStackSupport && H) try {
				throw Error()
			} catch (s) {
				r.stack = s.stack.substring(s.stack.indexOf("\n") + 1)
			}
			return a.promise = r, a.resolve = function(n) {
				t || e(c(n))
			}, a.fulfill = function(n) {
				t || e(T(n))
			}, a.reject = function(n) {
				t || e(I(n))
			}, a.notify = function(e) {
				t || Q(i, function(t, n) {
					W(function() {
						n(e)
					})
				}, void 0)
			}, a
		}
		function p(e) {
			if ("function" != typeof e) throw new TypeError("resolver must be a function.");
			var t = d();
			try {
				e(t.resolve, t.reject, t.notify)
			} catch (n) {
				t.reject(n)
			}
			return t.promise
		}
		function h(e) {
			return p(function(t, n) {
				for (var i = 0, a = e.length; a > i; i++) c(e[i]).then(t, n)
			})
		}
		function g(e, t, n) {
			void 0 === t && (t = function(e) {
				return I(Error("Promise does not support operation: " + e))
			}), void 0 === n && (n = function() {
				return {
					state: "unknown"
				}
			});
			var i = z(g.prototype);
			if (i.promiseDispatch = function(n, a, r) {
				var s;
				try {
					s = e[a] ? e[a].apply(i, r) : t.call(i, a, r)
				} catch (o) {
					s = I(o)
				}
				n && n(s)
			}, i.inspect = n, n) {
				var a = n();
				"rejected" === a.state && (i.exception = a.reason), i.valueOf = function() {
					var e = n();
					return "pending" === e.state || "rejected" === e.state ? i : e.value
				}
			}
			return i
		}
		function f(e, t, n, i) {
			return c(e).then(t, n, i)
		}
		function m(e) {
			if (y(e)) {
				var t = e.inspect();
				if ("fulfilled" === t.state) return t.value
			}
			return e
		}
		function y(e) {
			return t(e) && "function" == typeof e.promiseDispatch && "function" == typeof e.inspect
		}
		function v(e) {
			return t(e) && "function" == typeof e.then
		}
		function S(e) {
			return y(e) && "pending" === e.inspect().state
		}
		function _(e) {
			return !y(e) || "fulfilled" === e.inspect().state
		}
		function w(e) {
			return y(e) && "rejected" === e.inspect().state
		}
		function b() {
			it.length = 0, at.length = 0, rt || (rt = !0)
		}
		function A(e, t) {
			rt && (at.push(e), t && t.stack !== void 0 ? it.push(t.stack) : it.push("(no stack) " + t))
		}
		function E(e) {
			if (rt) {
				var t = Y(at, e); - 1 !== t && (at.splice(t, 1), it.splice(t, 1))
			}
		}
		function I(e) {
			var t = g({
				when: function(t) {
					return t && E(this), t ? t(e) : this
				}
			}, function() {
				return this
			}, function() {
				return {
					state: "rejected",
					reason: e
				}
			});
			return A(t, e), t
		}
		function T(e) {
			return g({
				when: function() {
					return e
				},
				get: function(t) {
					return e[t]
				},
				set: function(t, n) {
					e[t] = n
				},
				"delete": function(t) {
					delete e[t]
				},
				post: function(t, n) {
					return null === t || void 0 === t ? e.apply(void 0, n) : e[t].apply(e, n)
				},
				apply: function(t, n) {
					return e.apply(t, n)
				},
				keys: function() {
					return et(e)
				}
			}, void 0, function() {
				return {
					state: "fulfilled",
					value: e
				}
			})
		}
		function k(e) {
			var t = d();
			return W(function() {
				try {
					e.then(t.resolve, t.reject, t.notify)
				} catch (n) {
					t.reject(n)
				}
			}), t.promise
		}
		function R(e) {
			return g({
				isDef: function() {}
			}, function(t, n) {
				return O(e, t, n)
			}, function() {
				return c(e).inspect()
			})
		}
		function M(e, t, n) {
			return c(e).spread(t, n)
		}
		function L(e) {
			return function() {
				function t(e, t) {
					var s;
					if ("undefined" == typeof StopIteration) {
						try {
							s = i[e](t)
						} catch (o) {
							return I(o)
						}
						return s.done ? s.value : f(s.value, a, r)
					}
					try {
						s = i[e](t)
					} catch (o) {
						return n(o) ? o.value : I(o)
					}
					return f(s, a, r)
				}
				var i = e.apply(this, arguments),
					a = t.bind(t, "next"),
					r = t.bind(t, "throw");
				return a()
			}
		}
		function N(e) {
			c.done(c.async(e)())
		}
		function P(e) {
			throw new q(e)
		}
		function G(e) {
			return function() {
				return M([this, C(arguments)], function(t, n) {
					return e.apply(t, n)
				})
			}
		}
		function O(e, t, n) {
			return c(e).dispatch(t, n)
		}
		function C(e) {
			return f(e, function(e) {
				var t = 0,
					n = d();
				return Q(e, function(i, a, r) {
					var s;
					y(a) && "fulfilled" === (s = a.inspect()).state ? e[r] = s.value : (++t, f(a, function(i) {
						e[r] = i, 0 === --t && n.resolve(e)
					}, n.reject, function(e) {
						n.notify({
							index: r,
							value: e
						})
					}))
				}, void 0), 0 === t && n.resolve(e), n.promise
			})
		}
		function x(e) {
			return f(e, function(e) {
				return e = $(e, c), f(C($(e, function(e) {
					return f(e, V, V)
				})), function() {
					return e
				})
			})
		}
		function U(e) {
			return c(e).allSettled()
		}
		function j(e, t) {
			return c(e).then(void 0, void 0, t)
		}
		function D(e, t) {
			return c(e).nodeify(t)
		}
		var H = !1;
		try {
			throw Error()
		} catch (B) {
			H = !! B.stack
		}
		var F, q, J = l(),
			V = function() {},
			W = function() {
				function e() {
					for (; t.next;) {
						t = t.next;
						var n = t.task;
						t.task = void 0;
						var a = t.domain;
						a && (t.domain = void 0, a.enter());
						try {
							n()
						} catch (s) {
							if (r) throw a && a.exit(), setTimeout(e, 0), a && a.enter(), s;
							setTimeout(function() {
								throw s
							}, 0)
						}
						a && a.exit()
					}
					i = !1
				}
				var t = {
					task: void 0,
					next: null
				},
					n = t,
					i = !1,
					a = void 0,
					r = !1;
				if (W = function(e) {
					n = n.next = {
						task: e,
						domain: r && process.domain,
						next: null
					}, i || (i = !0, a())
				}, "undefined" != typeof process && process.nextTick) r = !0, a = function() {
					process.nextTick(e)
				};
				else if ("function" == typeof setImmediate) a = "undefined" != typeof window ? setImmediate.bind(window, e) : function() {
					setImmediate(e)
				};
				else if ("undefined" != typeof MessageChannel) {
					var s = new MessageChannel;
					s.port1.onmessage = function() {
						a = o, s.port1.onmessage = e, e()
					};
					var o = function() {
							s.port2.postMessage(0)
						};
					a = function() {
						setTimeout(e, 0), o()
					}
				} else a = function() {
					setTimeout(e, 0)
				};
				return W
			}(),
			X = Function.call,
			K = e(Array.prototype.slice),
			Q = e(Array.prototype.reduce ||
			function(e, t) {
				var n = 0,
					i = this.length;
				if (1 === arguments.length) for (;;) {
					if (n in this) {
						t = this[n++];
						break
					}
					if (++n >= i) throw new TypeError
				}
				for (; i > n; n++) n in this && (t = e(t, this[n], n));
				return t
			}),
			Y = e(Array.prototype.indexOf ||
			function(e) {
				for (var t = 0; this.length > t; t++) if (this[t] === e) return t;
				return -1
			}),
			$ = e(Array.prototype.map ||
			function(e, t) {
				var n = this,
					i = [];
				return Q(n, function(a, r, s) {
					i.push(e.call(t, r, s, n))
				}, void 0), i
			}),
			z = Object.create ||
		function(e) {
			function t() {}
			return t.prototype = e, new t
		}, Z = e(Object.prototype.hasOwnProperty), et = Object.keys ||
		function(e) {
			var t = [];
			for (var n in e) Z(e, n) && t.push(n);
			return t
		}, tt = e(Object.prototype.toString);
		q = "undefined" != typeof ReturnValue ? ReturnValue : function(e) {
			this.value = e
		};
		var nt = "From previous event:";
		c.resolve = c, c.nextTick = W, c.longStackSupport = !1, c.defer = d, d.prototype.makeNodeResolver = function() {
			var e = this;
			return function(t, n) {
				t ? e.reject(t) : arguments.length > 2 ? e.resolve(K(arguments, 1)) : e.resolve(n)
			}
		}, c.Promise = p, c.promise = p, p.race = h, p.all = C, p.reject = I, p.resolve = c, c.passByCopy = function(e) {
			return e
		}, g.prototype.passByCopy = function() {
			return this
		}, c.join = function(e, t) {
			return c(e).join(t)
		}, g.prototype.join = function(e) {
			return c([this, e]).spread(function(e, t) {
				if (e === t) return e;
				throw Error("Can't join: not the same: " + e + " " + t)
			})
		}, c.race = h, g.prototype.race = function() {
			return this.then(c.race)
		}, c.makePromise = g, g.prototype.toString = function() {
			return "[object Promise]"
		}, g.prototype.then = function(e, t, n) {
			function a(t) {
				try {
					return "function" == typeof e ? e(t) : t
				} catch (n) {
					return I(n)
				}
			}
			function r(e) {
				if ("function" == typeof t) {
					i(e, o);
					try {
						return t(e)
					} catch (n) {
						return I(n)
					}
				}
				return I(e)
			}
			function s(e) {
				return "function" == typeof n ? n(e) : e
			}
			var o = this,
				l = d(),
				u = !1;
			return W(function() {
				o.promiseDispatch(function(e) {
					u || (u = !0, l.resolve(a(e)))
				}, "when", [function(e) {
					u || (u = !0, l.resolve(r(e)))
				}])
			}), o.promiseDispatch(void 0, "when", [void 0, function(e) {
				var t, n = !1;
				try {
					t = s(e)
				} catch (i) {
					if (n = !0, !c.onerror) throw i;
					c.onerror(i)
				}
				n || l.notify(t)
			}]), l.promise
		}, c.when = f, g.prototype.thenResolve = function(e) {
			return this.then(function() {
				return e
			})
		}, c.thenResolve = function(e, t) {
			return c(e).thenResolve(t)
		}, g.prototype.thenReject = function(e) {
			return this.then(function() {
				throw e
			})
		}, c.thenReject = function(e, t) {
			return c(e).thenReject(t)
		}, c.nearer = m, c.isPromise = y, c.isPromiseAlike = v, c.isPending = S, g.prototype.isPending = function() {
			return "pending" === this.inspect().state
		}, c.isFulfilled = _, g.prototype.isFulfilled = function() {
			return "fulfilled" === this.inspect().state
		}, c.isRejected = w, g.prototype.isRejected = function() {
			return "rejected" === this.inspect().state
		};
		var it = [],
			at = [],
			rt = !0;
		c.resetUnhandledRejections = b, c.getUnhandledReasons = function() {
			return it.slice()
		}, c.stopUnhandledRejectionTracking = function() {
			b(), rt = !1
		}, b(), c.reject = I, c.fulfill = T, c.master = R, c.spread = M, g.prototype.spread = function(e, t) {
			return this.all().then(function(t) {
				return e.apply(void 0, t)
			}, t)
		}, c.async = L, c.spawn = N, c["return"] = P, c.promised = G, c.dispatch = O, g.prototype.dispatch = function(e, t) {
			var n = this,
				i = d();
			return W(function() {
				n.promiseDispatch(i.resolve, e, t)
			}), i.promise
		}, c.get = function(e, t) {
			return c(e).dispatch("get", [t])
		}, g.prototype.get = function(e) {
			return this.dispatch("get", [e])
		}, c.set = function(e, t, n) {
			return c(e).dispatch("set", [t, n])
		}, g.prototype.set = function(e, t) {
			return this.dispatch("set", [e, t])
		}, c.del = c["delete"] = function(e, t) {
			return c(e).dispatch("delete", [t])
		}, g.prototype.del = g.prototype["delete"] = function(e) {
			return this.dispatch("delete", [e])
		}, c.mapply = c.post = function(e, t, n) {
			return c(e).dispatch("post", [t, n])
		}, g.prototype.mapply = g.prototype.post = function(e, t) {
			return this.dispatch("post", [e, t])
		}, c.send = c.mcall = c.invoke = function(e, t) {
			return c(e).dispatch("post", [t, K(arguments, 2)])
		}, g.prototype.send = g.prototype.mcall = g.prototype.invoke = function(e) {
			return this.dispatch("post", [e, K(arguments, 1)])
		}, c.fapply = function(e, t) {
			return c(e).dispatch("apply", [void 0, t])
		}, g.prototype.fapply = function(e) {
			return this.dispatch("apply", [void 0, e])
		}, c["try"] = c.fcall = function(e) {
			return c(e).dispatch("apply", [void 0, K(arguments, 1)])
		}, g.prototype.fcall = function() {
			return this.dispatch("apply", [void 0, K(arguments)])
		}, c.fbind = function(e) {
			var t = c(e),
				n = K(arguments, 1);
			return function() {
				return t.dispatch("apply", [this, n.concat(K(arguments))])
			}
		}, g.prototype.fbind = function() {
			var e = this,
				t = K(arguments);
			return function() {
				return e.dispatch("apply", [this, t.concat(K(arguments))])
			}
		}, c.keys = function(e) {
			return c(e).dispatch("keys", [])
		}, g.prototype.keys = function() {
			return this.dispatch("keys", [])
		}, c.all = C, g.prototype.all = function() {
			return C(this)
		}, c.allResolved = u(x, "allResolved", "allSettled"), g.prototype.allResolved = function() {
			return x(this)
		}, c.allSettled = U, g.prototype.allSettled = function() {
			return this.then(function(e) {
				return C($(e, function(e) {
					function t() {
						return e.inspect()
					}
					return e = c(e), e.then(t, t)
				}))
			})
		}, c.fail = c["catch"] = function(e, t) {
			return c(e).then(void 0, t)
		}, g.prototype.fail = g.prototype["catch"] = function(e) {
			return this.then(void 0, e)
		}, c.progress = j, g.prototype.progress = function(e) {
			return this.then(void 0, void 0, e)
		}, c.fin = c["finally"] = function(e, t) {
			return c(e)["finally"](t)
		}, g.prototype.fin = g.prototype["finally"] = function(e) {
			return e = c(e), this.then(function(t) {
				return e.fcall().then(function() {
					return t
				})
			}, function(t) {
				return e.fcall().then(function() {
					throw t
				})
			})
		}, c.done = function(e, t, n, i) {
			return c(e).done(t, n, i)
		}, g.prototype.done = function(e, t, n) {
			var a = function(e) {
					W(function() {
						if (i(e, r), !c.onerror) throw e;
						c.onerror(e)
					})
				},
				r = e || t || n ? this.then(e, t, n) : this;
			"object" == typeof process && process && process.domain && (a = process.domain.bind(a)), r.then(void 0, a)
		}, c.timeout = function(e, t, n) {
			return c(e).timeout(t, n)
		}, g.prototype.timeout = function(e, t) {
			var n = d(),
				i = setTimeout(function() {
					n.reject(Error(t || "Timed out after " + e + " ms"))
				}, e);
			return this.then(function(e) {
				clearTimeout(i), n.resolve(e)
			}, function(e) {
				clearTimeout(i), n.reject(e)
			}, n.notify), n.promise
		}, c.delay = function(e, t) {
			return void 0 === t && (t = e, e = void 0), c(e).delay(t)
		}, g.prototype.delay = function(e) {
			return this.then(function(t) {
				var n = d();
				return setTimeout(function() {
					n.resolve(t)
				}, e), n.promise
			})
		}, c.nfapply = function(e, t) {
			return c(e).nfapply(t)
		}, g.prototype.nfapply = function(e) {
			var t = d(),
				n = K(e);
			return n.push(t.makeNodeResolver()), this.fapply(n).fail(t.reject), t.promise
		}, c.nfcall = function(e) {
			var t = K(arguments, 1);
			return c(e).nfapply(t)
		}, g.prototype.nfcall = function() {
			var e = K(arguments),
				t = d();
			return e.push(t.makeNodeResolver()), this.fapply(e).fail(t.reject), t.promise
		}, c.nfbind = c.denodeify = function(e) {
			var t = K(arguments, 1);
			return function() {
				var n = t.concat(K(arguments)),
					i = d();
				return n.push(i.makeNodeResolver()), c(e).fapply(n).fail(i.reject), i.promise
			}
		}, g.prototype.nfbind = g.prototype.denodeify = function() {
			var e = K(arguments);
			return e.unshift(this), c.denodeify.apply(void 0, e)
		}, c.nbind = function(e, t) {
			var n = K(arguments, 2);
			return function() {
				function i() {
					return e.apply(t, arguments)
				}
				var a = n.concat(K(arguments)),
					r = d();
				return a.push(r.makeNodeResolver()), c(i).fapply(a).fail(r.reject), r.promise
			}
		}, g.prototype.nbind = function() {
			var e = K(arguments, 0);
			return e.unshift(this), c.nbind.apply(void 0, e)
		}, c.nmapply = c.npost = function(e, t, n) {
			return c(e).npost(t, n)
		}, g.prototype.nmapply = g.prototype.npost = function(e, t) {
			var n = K(t || []),
				i = d();
			return n.push(i.makeNodeResolver()), this.dispatch("post", [e, n]).fail(i.reject), i.promise
		}, c.nsend = c.nmcall = c.ninvoke = function(e, t) {
			var n = K(arguments, 2),
				i = d();
			return n.push(i.makeNodeResolver()), c(e).dispatch("post", [t, n]).fail(i.reject), i.promise
		}, g.prototype.nsend = g.prototype.nmcall = g.prototype.ninvoke = function(e) {
			var t = K(arguments, 1),
				n = d();
			return t.push(n.makeNodeResolver()), this.dispatch("post", [e, t]).fail(n.reject), n.promise
		}, c.nodeify = D, g.prototype.nodeify = function(e) {
			return e ? (this.then(function(t) {
				W(function() {
					e(null, t)
				})
			}, function(t) {
				W(function() {
					e(t)
				})
			}), void 0) : this
		};
		var st = l();
		return c
	}), function(e) {
		var t = "Promise" in e && "cast" in e.Promise && "resolve" in e.Promise && "reject" in e.Promise && "all" in e.Promise && "race" in e.Promise && "spread" in e.Promise;
		t || (e.Promise = m.promise, e.Promise.all = m.all, e.Promise.timeout = m.timeout, m.stopUnhandledRejectionTracking())
	}(e !== void 0 ? e : this);
	var y = {
		timeout: 3e3
	};
	y.getGameConfig = function() {
		var e = m.defer();
		return SpilGames(["JSLib"], function(t) {
			var n = t.get("current.game.integration.info");
			n ? e.resolve(n) : e.reject(Error("No data retrieved from JSLib"))
		}), e.promise.timeout(this.timeout)
	}, y.getBrandingConfig = function(e) {
		var t = m.defer(),
			n = "http://api.configar.org/cf/pb/1/configs",
			i = e.portal.siteId,
			a = e.portal.channelId,
			r = e.portal.applicationId;
		return SpilGames(["Net", "JSLib"], function(e, s) {
			e.send({
				url: [n, a, i, r].join("/"),
				type: "GET",
				dataType: "JSON"
			}, function(e) {
				if (e && e.configar) window.postMessage(new p({
					type: "success",
					callbackId: null,
					data: "log.configar.getBranding.success"
				}), "*"), t.resolve(e.configar);
				else {
					var n = {};
					try {
						n = s.get("configar.data.cached") || n
					} catch (i) {}
					t.reject(n)
				}
			})
		}), t.promise.timeout(this.timeout)
	};
	var v = {};
	v.argsToArray = function(e) {
		return e ? Array.prototype.slice.apply(e) : []
	}, v.isA10 = function() {
		return /a10.com/.test(window.location.host)
	}, v.disableKeys = function(e) {
		var t = e.keyCode;
		(8 === t || 9 === t || t >= 32 && 40 >= t || 46 === t) && e.preventDefault()
	}, v.trackGA = function() {
		try {
			if ("www8.agame.com" === window.location.host) {
				var e = function(e, t, n, i, a, r, s) {
						e.GoogleAnalyticsObject = a, e[a] = e[a] ||
						function() {
							(e[a].q = e[a].q || []).push(arguments)
						}, e[a].l = 1 * new Date, r = t.createElement(n), s = t.getElementsByTagName(n)[0], r.async = 1, r.src = i, s.parentNode.insertBefore(r, s)
					};
				e(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), ga("create", "UA-8223336-3", "auto"), ga("send", "pageview")
			}
		} catch (t) {}
	}, v.getRole = function() {
		var e = "function" == typeof window.SpilGames,
			t = window.self !== window.top,
			n = null;
		if (v.isA10()) return window.onkeydown = this.disableKeys, {
			IS_MASTER: !0,
			IS_SLAVE: !0,
			IS_STANDALONE: !0
		};
		if (e) {
			var i = document.getElementById("#iframegame");
			switch (i) {
			case "null":
				n = {
					IS_MASTER: !0,
					IS_SLAVE: !0,
					IS_STANDALONE: !1
				};
				break;
			default:
				n = {
					IS_MASTER: !0,
					IS_SLAVE: !1,
					IS_STANDALONE: !1
				}
			}
		} else t ? (window.onkeydown = this.disableKeys, this.trackGA(), n = {
			IS_MASTER: !1,
			IS_SLAVE: !0,
			IS_STANDALONE: !1
		}) : (window.onkeydown = this.disableKeys, this.trackGA(), n = {
			IS_MASTER: !0,
			IS_SLAVE: !0,
			IS_STANDALONE: !0
		});
		return n
	}, v.callConfigar = function(e, t) {
		var n, i, a = e.site || 500,
			r = e.channel || 100,
			s = e.id || null;
		window.XDomainRequest ? (n = new XDomainRequest, n.onload = function() {
			t(200, n.responseText)
		}, n.onerror = function() {
			t(404, null)
		}, n.onprogress = function() {}) : window.XMLHttpRequest ? (n = new XMLHttpRequest, n.onreadystatechange = function() {
			4 === n.readyState && t(n.status, n.responseText)
		}) : window.ActiveXObject && (n = new ActiveXObject("Microsoft.XMLHTTP"), n.onreadystatechange = function() {
			4 === n.readyState && t(n.status, n.responseText)
		}), s && (i = "yx8.js", n.open("GET", i, !0), n.timeout = 3e3, n.ontimeout = function() {
			t(404, null)
		}, n.send())
	}, v.submitData = function(e, t, n) {
		var i, a = e || "",
			r = t || {},
			s = n ||
		function() {};
		window.XDomainRequest ? (i = new XDomainRequest, i.onload = function() {
			s(200, i.responseText)
		}, i.onerror = function() {
			s(404, null)
		}, i.onprogress = function() {}, i.open("POST", a, !0)) : window.XMLHttpRequest ? (navigator.userAgent.match(/Trident\/7.0;.* rv:11/) ? i = this.getJSONP() : (i = new XMLHttpRequest, i.onreadystatechange = function() {
			4 === i.readyState && s(i.status, i.responseText)
		}), i.open("POST", a, !0), i.setRequestHeader("Content-type", "application/x-www-form-urlencoded")) : window.ActiveXObject && (i = new ActiveXObject("Microsoft.XMLHTTP"), i.onreadystatechange = function() {
			4 === i.readyState && s(i.status, i.responseText)
		}, i.open("POST", a, !0)), i.timeout = 3e3, i.ontimeout = function() {
			s(404, null)
		}, i.send(JSON.stringify(r))
	}, v.getJSONP = function() {
		var e = "",
			t = "jsonpspilgames" + +new Date,
			n = {
				open: function(t, n) {
					t = null, e = n
				},
				onreadystatechange: function() {},
				setRequestHeader: function() {},
				set: function(e, t) {
					n.set[e] = t
				},
				send: function(i) {
					var a = n.set.callback || 0,
						r = n.set.data || 0;
					(i || a || r) && (e += /\?/.test(e) ? "&" : "?", i && (e += r ? r + "=" + encodeURIComponent(i) : i, a && (e += "&")), a && (e += a + "=" + t));
					var s = document.createElement("script");
					s.src = e, document.getElementsByTagName("head")[0].appendChild(s)
				}
			};
		return window[t] = function() {
			n.onreadystatechange.apply(this, arguments)
		}, n
	}, v.isWrapped = function() {
		return void 0 !== (window.PhoneGap || window.cordova || window.Cordova)
	}, v.isArray = Array.isArray ||
	function(e) {
		return "[object Array]" === Object.prototype.toString.call(e)
	}, v._getQueryString = function() {
		return window.location.search
	}, v._getPortalHost = function() {
		return window && window.location && window.location.hostname ? window.location.hostname : "unknown"
	}, v.validateSchema = function(e, t) {
		for (var n in t) if (t.hasOwnProperty(n)) {
			if (!e.hasOwnProperty(n)) return {
				error: "Wrong argument passed: " + n
			};
			if (e.hasOwnProperty(n)) {
				var i = "object" == typeof e[n] ? e[n].type : e[n];
				if (t[n].constructor.name !== i) return {
					error: "Wrong value type for " + n + ": expected " + e[n] + ", got " + t[n].constructor.name
				};
				var a = e[n] && e[n].values || [];
				if (-1 === a.indexOf(t[n])) return {
					error: "Wrong value for " + n + ": expected " + a.join(" or ") + ", got " + t[n]
				}
			}
		}
		return {
			error: !1
		}
	};
	var S = {};
	S.getGameConfig = function() {
		return y.getGameConfig().
		catch (function() {
			return S.getLocalConfig()
		})
	}, S.getBrandingConfig = function(e) {
		return new Promise(function(t) {
			return y.getBrandingConfig(e).then(t, function(e) {
				t(e), window.postMessage(new p({
					type: "warning",
					callbackId: null,
					data: "log.configar.getBranding.failure"
				}), "*")
			})
		})
	}, S.getLocalConfig = function(e) {
		e = e && Object.keys(e).length ? e : {
			portal: {},
			game: {},
			branding: {}
		};
		var t = {
			isLocal: e.isLocal || !1,
			game: {
				applicationId: e.portal.applicationId || "0",
				contentarId: e.portal.contentarId || "0",
				info: e.game.info || {},
				settings: e.game.objectSettings || {},
				features: {
					achievements: e.game.achievements || !1,
					gameSidePanel: e.game.gameSidePanel || !1,
					highscores: e.game.highscores || !1,
					recommendedGames: e.game.recommendedGames || !1
				}
			},
			user: {
				authenticated: e.portal.authenticated || !1,
				username: e.portal.username || ""
			},
			portal: {
				host: v._getPortalHost(),
				siteId: e.portal.siteId || 0,
				channelId: e.portal.channelId || 0,
				applicationId: e.portal.applicationId || "0"
			},
			branding: e.branding || {}
		};
		return t.branding.logo = t.branding.logo || {}, t.branding.logo.url = t.branding.logo.url || !1, t.branding.logo.image = t.branding.logo.image || !1, t
	}, S.setupStandaloneMode = function(e, t) {
		var n = {},
			i = {
				configar: {
					branding: {
						main: {
							label: "main",
							image: "http://www8.agame.com/mirror/img/logo_A10_202x50.png",
							url: "http://www.a10.com",
							style: "",
							width: "202",
							height: "50",
							mime: "image/png",
							type: "png",
							handler: "newTab",
							blacklisted: !0
						},
						logo: {
							label: "logo",
							image: "http://www8.agame.com/mirror/img/logo_A10_202x50.png",
							url: "http://www.a10.com",
							style: "",
							width: "202",
							height: "50",
							mime: "image/png",
							type: "png",
							handler: "newTab",
							blacklisted: !1
						},
						more_games: {
							label: "more_games",
							image: null,
							url: "http://www.a10.com",
							style: "",
							width: null,
							height: null,
							mime: null,
							type: null,
							handler: "newTab",
							blacklisted: !1
						},
						splash_screen: {
							label: "splash_screen",
							image: "place_holder_string",
							url: "http://www.a10.com",
							style: "",
							width: "0",
							height: "0",
							mime: "image/png",
							type: "png",
							handler: "newTab",
							blacklisted: !1
						}
					}
				}
			};
		n.JSLib = {
			memory: {},
			_channels: {},
			get: function(e) {
				return this.memory[e] ? this.memory[e] : !1
			},
			set: function(e, t) {
				return this.memory[e] = t, t
			},
			publish: function(e, t) {
				this._channels[e] && this._channels[e].forEach(function(e) {
					try {
						e.fn.call(this, t)
					} catch (n) {}
				})
			},
			subscribe: function(e, t) {
				if ("function" != typeof t) throw Error("Callback has to be a function");
				if ("string" != typeof e) throw Error("Channel name has to be a string");
				this._channels[e] || (this._channels[e] = []), this._channels[e].push({
					fn: t
				})
			}
		}, n.Net = {
			send: function(e, t) {
				t.call(this, {})
			}
		}, window.SpilGamesBootstrap = [], window.SpilGames = function() {
			var e = arguments;
			if (e[0] && "string" == typeof e[0]) n.JSLib.publish(e[0], e[1] || null);
			else if (e[0] && e[0] instanceof Array) {
				var t, i, a = [];
				for (t = 0, i = e[0].length; i > t; t++) a.push(n[e[0][t]]);
				e[1].apply(this, a)
			}
		}, e && e.id ? v.callConfigar(e, function(n, a) {
			if (200 === n && "string" == typeof a && JSON.parse(a)) {
				var r = JSON.parse(a);
				t.call(this, {
					branding: r.configar && r.configar.branding ? r.configar.branding : i.configar.branding,
					portal: {
						applicationId: e.id,
						siteId: e.site ? e.site : 500,
						channelId: e.channel ? e.channel : 100
					}
				})
			} else t.call(this, {
				isLocal: !0,
				branding: i.configar.branding
			})
		}) : t.call(this, {
			isLocal: !0,
			branding: i.configar.branding
		})
	}, S.getCachedConfig = function() {}, t.prototype.newTab = function(e) {
		var t = window.navigator.userAgent.toLowerCase().match(/android.*applewebkit\/([\d.]+)/),
			n = t && 537 > t[1],
			i = n ? "_self" : "_blank",
			a = e.url,
			r = window.open(a, i);
		return r && r.focus(), r
	}, t.prototype.moreGames = function(e) {
		var t = e.brandName || "a10";
		e.isStandalone ? this.newTab(e) : e.messenger && e.messenger.post && e.messenger.post("game.moregames", {
			branding: t
		})
	}, t.prototype.displayOnTop = function(e) {
		if (e === void 0 || e.url === void 0 || "string" != typeof e.url || e.action === void 0 || "function" != typeof e.action) return e.callback !== void 0 || "function" == typeof e.callback ? (e.callback(), void 0) : void 0;
		var t = document.createElement("div"),
			n = e.url,
			i = e.action,
			a = e.callback;
		t.setAttribute("id", "spilgames-splash-screen-sample"), document.body.appendChild(t);
		var r = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			s = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return t.style.left = "0", t.style.top = "0", t.style.width = r + "px", t.style.height = s + "px", t.style.position = "absolute", t.style.zIndex = "10000", t.onclick = i, n && (t.style.background = "url('" + n + "') center center no-repeat #FFF"), window.setTimeout(function() {
			var e = document.getElementById("spilgames-splash-screen-sample");
			e.parentNode.removeChild(e), a && a()
		}, 2e3), t
	}, n.prototype.get = function(e) {
		for (var t = this.dataStore, n = e.split("."), i = n.length, a = 0; i - 1 > a; a++) {
			if (!t[n[a]]) return null;
			t = t[n[a]]
		}
		return t[n[i - 1]] || null
	}, n.prototype.put = function(e, t) {
		for (var n = this.dataStore, i = e.split("."), a = i.length, r = 0; a - 1 > r; r++) {
			var s = i[r];
			n[s] || (n[s] = {}), n = n[s]
		}
		n[i[a - 1]] = t
	}, n.prototype.set = function(e, t) {
		this.put(e, t);
		var n = Date.parse(new Date);
		return this.notify({
			type: "new",
			key: e,
			current: t,
			previous: null,
			timestamp: n
		}), t
	}, n.prototype.update = function(e, t) {
		var n, i, a = null;
		return this.get(e) ? (n = "update", a = this.get(e)) : n = "new", this.put(e, t), i = Date.parse(new Date), this.notify({
			type: n,
			key: e,
			current: t,
			previous: a,
			timestamp: i
		}), t
	}, n.prototype.remove = function(e) {
		if (this.get(e)) {
			var t, n = this.get(e);
			return this.put(e, null), t = Date.parse(new Date), this.notify({
				type: "remove",
				key: e,
				current: null,
				previous: n,
				timestamp: t
			}), !0
		}
		return !1
	}, n.prototype._setCache = function(e) {
		this.dataStore = e
	}, n.prototype._getCache = function() {
		return this.dataStore
	}, n.prototype.notify = function(e) {
		if (this.IS_MASTER) {
			var t = new p({
				type: "datachange",
				callbackId: null,
				data: e
			}).encode();
			return window.postMessage(t, "*"), t
		}
	}, i.prototype.init = function(e) {
		this.data = e.data || null
	}, i.prototype._performAction = function(e) {
		var t = new p(e.data || {}),
			n = this.messenger,
			i = this.subscribers || {};
		if (t && t.type && t.data) switch (t.type) {
		case "gameEvent":
			t.data[0] && i[t.data[0]] && i[t.data[0]].length > 0 ? i[t.data[0]].forEach(function(e) {
				e.call(this), n._postMessage([t.data[0],
				{
					origin: "slave"
				},
				null], null, "gameState")
			}) : t.data[0] && t.data[1] && "slave" === t.data[1].origin && "function" == typeof SWFtoJS && SWFtoJS({
				call: t.data[0],
				params: {}
			});
			break;
		case "gameState":
			t.data[0] && t.data[1] && "slave" === t.data[1].origin && (this.gameState = t.data[0])
		}
	}, i.prototype.on = function(e, t) {
		this.IS_SLAVE && (this.subscribers[e] || (this.subscribers[e] = []), this.subscribers[e].push(t))
	}, i.prototype.emit = function(e) {
		if (!this.IS_MASTER) throw Error("Only the master environment can emit game events");
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		if (e === this.gameState) throw Error("The game is already in state: `" + e + "`");
		this.messenger._postMessage([e,
		{
			origin: "master"
		},
		null], null, "gameEvent")
	}, i.prototype.isSiteLock = function() {
		var e = !0;
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		return this.data && this.data.portal && this.data.portal.siteId && 500 > this.data.portal.siteId && (e = !1), e
	}, i.prototype.adjustHeight = function(e) {
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this.IS_MASTER ? "function" == typeof SpilGames && SpilGames.Events !== void 0 && "function" == typeof SpilGames.Events.publish && SpilGames.Events.publish("portal.adjustheight", {
			height: e,
			onsuccess: function() {}
		}) : (this.messenger._postMessage(e, void 0, "gameapi.game.adjustHeight"), this.messenger._postMessage(["log.gameapi.game.adjustHeight",
		{
			origin: "slave",
			height: e
		},
		null], null, "log"))
	}, a.prototype.init = function(e) {
		this._setLocale(e), this._setupEvents(), e && e.data && e.data.portal && e.data.portal.siteId && 500 > e.data.portal.siteId && "0" !== e.data.portal.siteId && (this.isAvailable = !0)
	}, a.prototype._setupEvents = function() {
		this.IS_MASTER ? (this.messenger.subscribe("gameapi.user.forceAuthentication", this.forceAuthentication, this), this.messenger.subscribe("gameapi.user.getUser", this.getUser, this)) : this.messenger.subscribe("gameapi.user.getUserResponse", this._getUserResponse, this)
	}, a.prototype.forceAuthentication = function() {
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this.IS_MASTER ? "function" == typeof SpilGames && SpilGames.Portal !== void 0 && "function" == typeof SpilGames.Portal.forceAuthentication && SpilGames.Portal.forceAuthentication({
			onsuccess: function() {}
		}) : (this.messenger._postMessage({}, void 0, "gameapi.user.forceAuthentication"), this.messenger._postMessage(["log.gameapi.user.forceAuthentication",
		{
			origin: "slave"
		},
		null], null, "log"))
	}, a.prototype.getUser = function(e) {
		var t = this.messenger;
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		if (this.IS_MASTER)"function" == typeof SpilGames ? SpilGames(["JSLib"], function(e) {
			e && "function" == typeof e ? e("api.user.getExtended", function(e) {
				t._postMessage(e, void 0, "gameapi.user.getUserResponse")
			}) : t._postMessage({
				userInfoExtended: {}
			}, void 0, "gameapi.user.getUserResponse")
		}) : t._postMessage({
			userInfoExtended: {}
		}, void 0, "gameapi.user.getUserResponse");
		else {
			if ("function" != typeof e) throw Error("The argument passed to the GameAPI.User.getUser method should be a function");
			this.usercallback = e, t._postMessage({}, void 0, "gameapi.user.getUser"), t._postMessage(["log.gameapi.user.getUser",
			{
				origin: "slave",
				argumentType: typeof e
			},
			null], null, "log")
		}
	}, a.prototype._getUserResponse = function(e) {
		var t = e.userInfoExtended || {},
			n = this._validateData(t),
			i = !1;
		"" === t.guid && (i = !0), this.eventTracking.trackGameAPIEvent("userGet", {
			guid: n.guid || "",
			fail: i
		}), this.usercallback(n)
	}, a.prototype._validateData = function(e) {
		var t = {
			uid: e.uid || "",
			guid: e.guid || "",
			displayName: e.name || "",
			pic_square: e.avatarUrl || "",
			pic_square_large: e.avatarLargeUrl || "",
			gender: e.gender || "",
			age: e.age || "",
			birthday: e.birthdate || "",
			level: e.level || "",
			locale: this.locale || ""
		};
		return t
	}, a.prototype._setLocale = function(e) {
		e && e.data && e.data.portal && e.data.portal.siteId && (this.locale = this._getLang(e.data.portal.siteId))
	}, a.prototype._getLang = function(e) {
		for (var t = [{
			siteid: 1,
			lang: "nl-NL"
		}, {
			siteid: 2,
			lang: "en-US"
		}, {
			siteid: 5,
			lang: "de-DE"
		}, {
			siteid: 11,
			lang: "fr-FR"
		}, {
			siteid: 12,
			lang: "fr-FR"
		}, {
			siteid: 15,
			lang: "it-IT"
		}, {
			siteid: 16,
			lang: "pl-PL"
		}, {
			siteid: 24,
			lang: "en-US"
		}, {
			siteid: 25,
			lang: "nl-NL"
		}, {
			siteid: 26,
			lang: "de-DE"
		}, {
			siteid: 44,
			lang: "sv-SE"
		}, {
			siteid: 50,
			lang: "pt-BR"
		}, {
			siteid: 55,
			lang: "en-ID"
		}, {
			siteid: 79,
			lang: "en-US"
		}, {
			siteid: 86,
			lang: "es-ES"
		}, {
			siteid: 87,
			lang: "pt-BR"
		}, {
			siteid: 88,
			lang: "en-US"
		}, {
			siteid: 90,
			lang: "en-US"
		}, {
			siteid: 91,
			lang: "pt-BR"
		}, {
			siteid: 92,
			lang: "en-GB"
		}, {
			siteid: 93,
			lang: "nl-NL"
		}, {
			siteid: 94,
			lang: "de-DE"
		}, {
			siteid: 95,
			lang: "fr-FR"
		}, {
			siteid: 96,
			lang: "es-ES"
		}, {
			siteid: 97,
			lang: "es-ES"
		}, {
			siteid: 98,
			lang: "pl-PL"
		}, {
			siteid: 99,
			lang: "it-IT"
		}, {
			siteid: 100,
			lang: "sv-SE"
		}, {
			siteid: 101,
			lang: "pt-BR"
		}, {
			siteid: 102,
			lang: "en-GB"
		}, {
			siteid: 103,
			lang: "ru-RU"
		}, {
			siteid: 104,
			lang: "ru-RU"
		}, {
			siteid: 105,
			lang: "ru-RU"
		}, {
			siteid: 106,
			lang: "it-IT"
		}, {
			siteid: 107,
			lang: "en-GB"
		}, {
			siteid: 108,
			lang: "sv-SE"
		}, {
			siteid: 109,
			lang: "pl-PL"
		}, {
			siteid: 115,
			lang: "en-GB"
		}, {
			siteid: 116,
			lang: "tr-TR"
		}, {
			siteid: 118,
			lang: "ms-MY"
		}, {
			siteid: 119,
			lang: "en-GB"
		}, {
			siteid: 120,
			lang: "jp-JP"
		}, {
			siteid: 121,
			lang: "en-US"
		}, {
			siteid: 122,
			lang: "es-ES"
		}, {
			siteid: 123,
			lang: "en-US"
		}, {
			siteid: 124,
			lang: "en-US"
		}, {
			siteid: 125,
			lang: "AR"
		}, {
			siteid: 126,
			lang: "en-US"
		}, {
			siteid: 127,
			lang: "en-US"
		}, {
			siteid: 128,
			lang: "nl-NL"
		}, {
			siteid: 129,
			lang: "es-AR"
		}, {
			siteid: 130,
			lang: "es-MX"
		}, {
			siteid: 131,
			lang: "de-DE"
		}, {
			siteid: 132,
			lang: "en-EN"
		}, {
			siteid: 133,
			lang: "en-EN"
		}, {
			siteid: 134,
			lang: "en-ID"
		}, {
			siteid: 135,
			lang: "de-DE"
		}, {
			siteid: 136,
			lang: "pl-PL"
		}, {
			siteid: 137,
			lang: "en-EN"
		}, {
			siteid: 138,
			lang: "it-IT"
		}, {
			siteid: 139,
			lang: "uk-UA"
		}, {
			siteid: 140,
			lang: "en-ID"
		}, {
			siteid: 141,
			lang: "uk-UA"
		}, {
			siteid: 142,
			lang: "ja-JP"
		}, {
			siteid: 143,
			lang: "nl-NL"
		}, {
			siteid: 144,
			lang: "en-US"
		}, {
			siteid: 145,
			lang: "en-US"
		}, {
			siteid: 146,
			lang: "en-US"
		}, {
			siteid: 147,
			lang: "en-US"
		}, {
			siteid: 148,
			lang: "en-US"
		}, {
			siteid: 149,
			lang: "en-IN"
		}, {
			siteid: 150,
			lang: "tr-TR"
		}, {
			siteid: 151,
			lang: "de-DE"
		}, {
			siteid: 152,
			lang: "ru-RU"
		}, {
			siteid: 153,
			lang: "ru-RU"
		}, {
			siteid: 154,
			lang: "ru-RU"
		}, {
			siteid: 155,
			lang: "en-US"
		}, {
			siteid: 156,
			lang: "tr-TR"
		}, {
			siteid: 157,
			lang: "tr-TR"
		}, {
			siteid: 158,
			lang: "tr-TR"
		}, {
			siteid: 159,
			lang: "en-US"
		}, {
			siteid: 160,
			lang: "en-US"
		}, {
			siteid: 161,
			lang: "en-US"
		}, {
			siteid: 162,
			lang: "en-US"
		}, {
			siteid: 163,
			lang: "en-US"
		}, {
			siteid: 164,
			lang: "en-US"
		}, {
			siteid: 165,
			lang: "en-US"
		}, {
			siteid: 166,
			lang: "en-US"
		}, {
			siteid: 167,
			lang: "en-US"
		}, {
			siteid: 168,
			lang: "en-US"
		}, {
			siteid: 169,
			lang: "en-US"
		}, {
			siteid: 170,
			lang: "en-US"
		}, {
			siteid: 171,
			lang: "en-US"
		}, {
			siteid: 172,
			lang: "en-US"
		}, {
			siteid: 173,
			lang: "en-US"
		}, {
			siteid: 174,
			lang: "en-US"
		}, {
			siteid: 175,
			lang: "en-US"
		}, {
			siteid: 176,
			lang: "en-US"
		}, {
			siteid: 177,
			lang: "en-US"
		}, {
			siteid: 178,
			lang: "en-US"
		}, {
			siteid: 179,
			lang: "en-US"
		}, {
			siteid: 180,
			lang: "en-UK"
		}, {
			siteid: 181,
			lang: "nl-NL"
		}, {
			siteid: 182,
			lang: "fr-FR"
		}, {
			siteid: 183,
			lang: "de-DE"
		}, {
			siteid: 184,
			lang: "en-US"
		}, {
			siteid: 185,
			lang: "en-US"
		}, {
			siteid: 186,
			lang: "en-EN"
		}, {
			siteid: 187,
			lang: "en-EN"
		}, {
			siteid: 188,
			lang: "en-EN"
		}, {
			siteid: 189,
			lang: "en-EN"
		}, {
			siteid: 190,
			lang: "en-EN"
		}, {
			siteid: 191,
			lang: "en-US"
		}, {
			siteid: 192,
			lang: "pt-BR"
		}, {
			siteid: 193,
			lang: "en-US"
		}, {
			siteid: 450,
			lang: "en-US"
		}, {
			siteid: 451,
			lang: "nl-NL"
		}, {
			siteid: 452,
			lang: "de-DE"
		}, {
			siteid: 453,
			lang: "fr-FR"
		}, {
			siteid: 454,
			lang: "es-ES"
		}, {
			siteid: 455,
			lang: "it-IT"
		}, {
			siteid: 456,
			lang: "en-GB"
		}, {
			siteid: 457,
			lang: "en-ID"
		}, {
			siteid: 458,
			lang: "es-AR"
		}, {
			siteid: 459,
			lang: "es-LA"
		}, {
			siteid: 460,
			lang: "es-MX"
		}, {
			siteid: 461,
			lang: "jp-JP"
		}, {
			siteid: 462,
			lang: "ms-MY"
		}, {
			siteid: 463,
			lang: "pl-PL"
		}, {
			siteid: 464,
			lang: "pt-BR"
		}, {
			siteid: 465,
			lang: "pt-PT"
		}, {
			siteid: 466,
			lang: "ru-RU"
		}, {
			siteid: 467,
			lang: "sv-SE"
		}, {
			siteid: 468,
			lang: "tr-TR"
		}], n = 0; t.length > n; n++) if (t[n].siteid === e) return t[n].lang;
		return ""
	}, r.prototype.init = function(e) {
		this._setupEvents(), e && e.data && e.data.portal && e.data.portal.siteId && 500 > e.data.portal.siteId && "0" !== e.data.portal.siteId && (this.isAvailable = !0)
	}, r.prototype._setupEvents = function() {
		this.IS_MASTER ? (this.messenger.subscribe("gameapi.friends.showInvite", this.showInvite, this), this.messenger.subscribe("gameapi.friends.getFriends", this.getFriends, this)) : this.messenger.subscribe("gameapi.friends.getFriendsResponse", this._getFriendsResponse, this)
	}, r.prototype.showInvite = function() {
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this.IS_MASTER ? "function" == typeof SpilGames && SpilGames.Events !== void 0 && "function" == typeof SpilGames.Events.publish && SpilGames.Events.publish("invitefriends.request") : (this.messenger._postMessage({}, void 0, "gameapi.friends.showInvite"), this.messenger._postMessage(["log.gameapi.friends.showInvite",
		{
			origin: "slave"
		},
		null], null, "log"), this.eventTracking.trackGameAPIEvent("friendsInvite", {
			guid: this.guid || ""
		}))
	}, r.prototype.getFriends = function(e) {
		var t = this.messenger;
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this.IS_MASTER ? "function" == typeof SpilGames ? SpilGames(["JSLib"], function(e) {
			e && "function" == typeof e ? e("api.friend.list", function(e) {
				t._postMessage(e, void 0, "gameapi.friends.getFriendsResponse")
			}) : t._postMessage({
				friendList: {}
			}, void 0, "gameapi.friends.getFriendsResponse")
		}) : t._postMessage({
			friendList: {}
		}, void 0, "gameapi.friends.getFriendsResponse") : ("function" == typeof e && (this.friendscallback = e), t._postMessage({}, void 0, "gameapi.friends.getFriends"), t._postMessage(["log.gameapi.friends.getFriends",
		{
			origin: "slave"
		},
		null], null, "log"))
	}, r.prototype._getFriendsResponse = function(e) {
		var t = this._validateData(e.friendList),
			n = !1;
		0 === t.length && (n = !0), this.eventTracking.trackGameAPIEvent("friendsGet", {
			guid: this.guid || "",
			fail: n
		}), this.friendscallback(t)
	}, r.prototype._validateData = function(e) {
		for (var t = [], n = 0; e.length > n; n++) {
			var i = {
				uid: e[n].uid || "",
				guid: e[n].guid || "",
				displayName: e[n].name || "",
				pic_square: e[n].avatarUrl || "",
				pic_square_large: e[n].avatarLargeUrl || "",
				gender: e[n].gender || "",
				age: e[n].age || ""
			};
			t.push(i)
		}
		return t
	}, s.prototype._setupMasterEvent = function() {
		this.IS_MASTER && this.messenger.subscribe("gameapi.score", this.submit, this)
	}, s.prototype.submit = function(e) {
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		if (this.IS_MASTER) {
			var t = !1,
				n = window.outerHeight - window.innerHeight;
			n === this.initialHeight && (t = !0), this.eventTracking.trackGameAPIEvent("scoreSubmit", {
				score: e,
				initialheight: this.initialHeight,
				submitheight: n,
				equals: t
			}), "function" == typeof SWFtoJS && SWFtoJS({
				call: "UPDATE_HIGHSCORE",
				params: {
					score: e
				}
			})
		} else this.messenger._postMessage(e, void 0, "gameapi.score"), this.messenger._postMessage(["log.gameapi.score.submit",
		{
			origin: "slave",
			score: e
		},
		null], null, "log");
		return {
			success: !0,
			value: e
		}
	}, o.prototype._setupMasterEvent = function() {
		this.IS_MASTER && this.messenger.subscribe("gameapi.award", this.submit, this)
	}, o.prototype.submit = function(e) {
		var t = e.award || "";
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		if (this.IS_MASTER) {
			var n = !1;
			window.outerHeight - window.innerHeight === this.initialHeight && (n = !0), this.eventTracking.trackGameAPIEvent("awardSubmit", {
				award: t,
				initialheight: this.initialHeight,
				submitheight: window.outerHeight - window.innerHeight,
				equals: n
			})
		} else this.messenger._postMessage(e, void 0, "gameapi.award"), this.messenger._postMessage(["log.gameapi.award.submit",
		{
			origin: "slave",
			award: t
		},
		null], null, "log");
		return {
			success: !0,
			value: e.award
		}
	}, l.prototype.init = function() {
		this._setupEvents()
	}, l.prototype._setupEvents = function() {
		var e = this.messenger;
		this.isMaster ? (SpilGames(["JSLib"], function(t) {
			t.subscribe("ad.request.accepted", function(t) {
				!0 === t && (SpilGames("game.ad.accepted", !0), e._postMessage(!0, void 0, "ad.request.accepted"))
			}), t.subscribe("ad.complete", function() {
				e._postMessage("", "", "ad.complete")
			})
		}), this.messenger.subscribe("game.ad.request", this._triggerAd, this)) : (this.messenger.subscribe("ad.request.accepted", this._onAdAccepted, this), this.messenger.subscribe("ad.complete", this._onAdCompleted, this))
	}, l.prototype._triggerAd = function() {
		SpilGames("game.ad.request")
	}, l.prototype._runCallback = function(e) {
		this._callbacks[e] && (this._callbacks[e](), this._callbacks[e] = !1)
	}, l.prototype.request = function(e, t) {
		var n = this;
		if ("function" != typeof e) throw Error("pauseGame argument should be a function");
		if ("function" != typeof t) throw Error("resumeGame argument should be a function");
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this._callbacks.pause = e, this._callbacks.resume = t, this.messenger._postMessage(void 0, void 0, "game.ad.request"), this.isMaster || this.messenger._postMessage(["log.gameapi.ad.requested",
		{
			origin: "slave"
		},
		null], null, "log"), this.timeout = setTimeout(function() {
			n._requestTimeout()
		}, this.timeoutAfter)
	}, l.prototype._onAdAccepted = function(e) {
		var t = this.messenger;
		this.timeout && clearTimeout(this.timeout), !this.isMaster && e && (t._postMessage(["log.gameapi.ad.start",
		{
			origin: "slave"
		},
		null], null, "log"), this._runCallback("pause"))
	}, l.prototype._onAdCompleted = function() {
		var e = this.messenger;
		this.isMaster || e._postMessage(["log.gameapi.ad.complete",
		{
			origin: "slave"
		},
		null], null, "log"), this._runCallback("resume")
	}, l.prototype._requestTimeout = function() {
		this._onAdCompleted()
	}, u.prototype._setupEvents = function() {
		this.IS_MASTER && this.messenger.subscribe("gameapi.gameevent", this.emit, this)
	}, u.prototype._validateEvent = function(e) {
		var t = !1;
		return this.events[e] && this.events[e] !== void 0 && (t = !0), t
	}, u.prototype.emit = function(e, t) {
		if (!this.moduleReady) throw Error("This method cannot be called before the API is loaded");
		this._validateEvent(e) ? this.IS_MASTER ? "function" == typeof SWFtoJS && SWFtoJS({
			call: e
		}) : (this.messenger._postMessage(e, void 0, "gameapi.gameevent"), this.messenger._postMessage(["log.gameapi.gameevent.emit",
		{
			origin: "slave",
			evt: e
		},
		null], null, "log")) : this.IS_MASTER || this.messenger._postMessage(["log.gameapi.gameevent.emit",
		{
			origin: "slave"
		},
		null], null, "log")
	}, c.prototype.init = function(e) {
		e = e || {}, this.data = e.data || this.data;
		var t = this.data && this.data.game && this.data.game.applicationId ? this.data.game.applicationId : null,
			n = new Date,
			i = window.location.hostname;
		this.data && this.data.portal ? (this.siteId = this.data.portal.siteId ? this.data.portal.siteId : null, this.channelId = this.data.portal.channelId ? this.data.portal.channelId : null) : (this.siteId = null, this.channelId = null), (this.IS_SLAVE || this.IS_STANDALONE || v.isWrapped()) && this.startInternalTracking(t, n, i)
	}, c.prototype._createEventObject = function(e, t, n) {
		return {
			eventCategory: e,
			eventAction: t,
			properties: n
		}
	}, c.prototype._sendSETEvent = function(e, t, n) {
		return this.IS_STANDALONE ? v.submitData("http://logs.spilgames.com/lg/pb/1/ut/", t, n) : this.messenger && (this.IS_SLAVE || v.isWrapped()) && this.messenger.post("tracker.event." + e, t, n), t
	}, c.prototype.trackGamePlay = function(e) {
		if (!this.gamePlayTracking.started) return !1;
		var t = this.gamePlayTracking.gid,
			n = this.gamePlayTracking.timestamp,
			i = this.gamePlayTracking.host,
			a = this._createEventObject("game", "gameplay", {
				applicationId: t,
				start: n,
				host: i
			}),
			r = this.data.isLocal,
			s = !0,
			o = 0,
			l = 0;
		this.siteId && (o = parseInt(this.siteId, 10)), this.channelId && (l = parseInt(this.channelId, 10)), this.data && this.data.branding && this.data.branding.logo && this.data.branding.logo.image && (s = !1);
		var u = this._createEventObject("gameapi", "load", {
			siteid: o,
			appid: t,
			channelid: l,
			domainname: i,
			isstandalone: this.IS_STANDALONE,
			isfallbackconfig: r,
			iswhitelisted: s
		});
		return this._sendSETEvent("express", a, e), this._sendSETEvent("express", u, function() {}), a
	}, c.prototype.trackTimeInGame = function(e) {
		if (!this.timeInGameTracking.started) return !1;
		var t = this.timeInGameTracking.gid,
			n = this.timeInGameTracking.timestamp,
			i = this._createEventObject("game", "heartbeat", {
				applicationId: t,
				start: n
			});
		return this._sendSETEvent("express", i, e), i
	}, c.prototype.trackGameAPIEvent = function(e, t) {
		t.appid = this.gamePlayTracking.gid, t.domainname = this.gamePlayTracking.host, t.siteid = parseInt(this.siteId, 10), t.channelid = parseInt(this.channelId, 10);
		var n = this._createEventObject("gameapi", e, t);
		this._sendSETEvent("express", n, function() {})
	}, c.prototype.startInternalTracking = function(e, t, n) {
		var i = this,
			a = 6e4,
			r = function(e) {
				if (!e) throw "Could not save the time in game"
			};
		return this.moduleReady ? e ? (this.gamePlayTracking.gid = e, this.gamePlayTracking.timestamp = Date.parse(t), this.gamePlayTracking.host = n, this.gamePlayTracking.started = !0, this.timeInGameTracking.gid = e, this.timeInGameTracking.timestamp = Date.parse(t), this.timeInGameTracking.started = !0, this.trackGamePlay(function(e) {
			if (!e) throw "Could not save the game play"
		}), this.trackTimeInGame(r), setInterval(function() {
			i.trackTimeInGame(r)
		}, a), this.gamePlayTracking.started && this.timeInGameTracking.started) : {
			error: "No application ID defined for this game"
		} : {
			error: "This method cannot be called before the API is loaded"
		}
	}, d.prototype.init = function(e) {
		var t;
		e = e || {}, this.data = e.data || this.data, this.data && this.data.portal && this.data.portal.siteId && (t = this.data.portal.siteId, (t > 499 || 12 === t || 25 === t || 26 === t || 55 === t || 79 === t || 97 === t || 105 === t || 108 === t || 138 === t || 157 === t || 121 === t || 1 === t || 5 === t || 11 === t || 15 === t || 16 === t || 44 === t || 50 === t || 87 === t || 86 === t || 88 === t || 92 === t || 103 === t || 140 === t || 90 === t || 93 === t || 95 === t || 94 === t || 96 === t || 98 === t || 99 === t || 100 === t || 101 === t || 102 === t || 104 === t || 134 === t) && this.data.branding && this.data.branding.more_games && this.data.branding.more_games.handler && "moreGames" !== this.data.branding.more_games.handler && (this.data.branding.more_games.handler = "moreGames"))
	}, d.prototype.getLogo = function(e) {
		if (!this.moduleReady) return {
			error: "This method cannot be called before the API is loaded"
		};
		var t = this.IS_MASTER ? "master" : "slave";
		this.messenger._postMessage(["log.branding.getlogo",
		{
			origin: t
		},
		null], null, "log");
		var n, i, a = {
			type: {
				type: "String",
				values: ["png"]
			},
			width: "Number",
			height: "Number"
		};
		return n = this._getLink("logo"), e && "object" == typeof e && (i = v.validateSchema(a, e), i.error && (n.error = i.error)), n
	}, d.prototype.getLink = function(e) {
		if (!e) return {
			error: "No link identifier provided"
		};
		var t = this.listLinks();
		if (-1 !== t.indexOf(e)) {
			var n = this.IS_MASTER ? "master" : "slave";
			return this.messenger._postMessage(["log.branding.getlink",
			{
				origin: n,
				linkName: e
			},
			null], null, "log"), this._getLink(e)
		}
		return {
			error: "Invalid option: '" + e + "'",
			action: function() {}
		}
	}, d.prototype._getLink = function(e) {
		if (!e) return {
			error: "No link identifier provided"
		};
		var t = this.data && this.data.branding ? this.data.branding : {};
		return t && t[e] ? {
			linkName: e,
			image: t[e].image || !1,
			action: this._executeHandler.bind(this, e)
		} : {
			error: "Invalid option: '" + e + "'",
			action: function() {}
		}
	}, d.prototype._getGMLink = function(e) {
		var t = null;
		if (!e) return {
			error: "No link identifier provided"
		};
		var n = this.data && this.data.branding ? this.data.branding : {};
		return n && n[e] ? (t = this._tagUrl(n[e].url, e), {
			linkName: e,
			url: t
		}) : {
			error: "Invalid option: '" + e + "'",
			url: null
		}
	}, d.prototype.getLinks = function() {
		var e = {},
			t = this.listLinks();
		if (0 === t.length) e = {
			more_games: {
				action: function() {}
			}
		};
		else for (var n = 0; t.length > n; n++) {
			var i = t[n];
			e[i] = this._getLink(i)
		}
		return e
	}, d.prototype._executeHandler = function(e) {
		var t = this.data && this.data.branding ? this.data.branding : {},
			n = t[e],
			i = n.handler,
			a = this._tagUrl(n.url, e),
			r = this._getBrandName(t);
		if (n.url && n.url.length > 0 && i && this.components[i]) {
			var s = this.IS_MASTER ? "master" : "slave";
			return this.messenger._postMessage(["log.branding.linkAction",
			{
				origin: s,
				linkName: e
			},
			null], null, "log"), this.components[i]({
				url: a,
				messenger: this.messenger,
				isStandalone: this.IS_STANDALONE,
				brandName: r
			})
		}
		return function() {}
	}, d.prototype._getBrandName = function(e) {
		var t = "a10";
		if (e && e.more_games && e.more_games.url) {
			var n = e.more_games.url;
			t = n.replace(/(.*)www./, "").replace(/\..*/, "")
		}
		return t
	}, d.prototype.listLinks = function() {
		var e = [],
			t = this.data && this.data.branding ? this.data.branding : {},
			n = Object.keys(t);
		return e = n.filter(function(e) {
			return !t[e].blacklisted
		})
	}, d.prototype.getSplashScreen = function() {
		var e, t = this.IS_MASTER ? "master" : "slave";
		if (this.data && this.data.branding && this.data.branding.splash_screen) {
			var n = !0;
			this.data.branding.splash_screen.image || this.data.branding.splash_screen.url || (n = !1), e = {
				show: n,
				action: this._getLink("splash_screen").action ||
				function() {}
			}
		} else e = {
			show: !0,
			action: function() {}
		};
		return this.messenger._postMessage(["log.branding.splashScreen",
		{
			origin: t
		},
		null], null, "log"), e
	}, d.prototype.displaySplashScreen = function(e) {
		if ("function" != typeof e) throw Error("argument  passed to displaySplashScreen method should be a function");
		var t = this.IS_MASTER ? "master" : "slave",
			n = this._getLink("logo").image;
		n && this.getSplashScreen().show ? ("master" !== t && this.messenger._postMessage(["log.branding.displaySplashScreen",
		{
			origin: t
		},
		null], null, "log"), this.components.displayOnTop({
			url: n,
			action: this.getSplashScreen().action,
			callback: e
		})) : e()
	}, d.prototype._tagUrl = function(e, t) {
		var n, i, a, r = this.data && this.data.portal ? this.data.portal : {},
			s = this.data && this.data.game ? this.data.game : {},
			o = parseInt(r.siteId, 10);
		if ("string" != typeof e) throw Error("No url specified");
		return n = "string" == typeof t ? t : "logo", i = "brandedgames_" + (o > 0 && 500 > o ? "internal" : "external"), a = ["utm_medium=" + i, "utm_campaign=" + s.applicationId, "utm_source=" + r.host, "utm_content=" + n].join("&"), e += e.indexOf("?") > -1 ? "&" : "?", e + a
	}, p.prototype.encode = function() {
		var e = ["gameapi", this.type, this.callbackId, this.data ? JSON.stringify(this.data) : ""].join("|");
		return e
	}, g.prototype._postMessage = function(e, t, n) {
		var i, a;
		i = v.isArray(e) && "function" == typeof e[e.length - 1] ? this._callbacks.push(e.pop()) - 1 : t, a = new p({
			type: n || "jslib",
			callbackId: i,
			data: e
		}).encode(), this._target.postMessage(a, "*")
	}, g.prototype._callJSLib = function() {
		SpilGames.apply(SpilGames, v.argsToArray(arguments))
	}, g.prototype._setupEventListener = function() {
		window.addEventListener ? window.addEventListener("message", this._handleMessage.bind(this), !1) : window.attachEvent && window.attachEvent("onmessage", this._handleMessage.bind(this))
	}, g.prototype._handleMessage = function(e) {
		var t, n, i, a, r = this,
			s = new p(e.data);
		if (s) if (t = s.type, n = s.callbackId, i = s.data, a = this._callbacks[n] || !1, this.IS_MASTER) switch (t) {
		case "jslib":
			"Array" === i.constructor.name && i.push(function(e) {
				r._postMessage(e, n)
			}), this._callJSLib.apply(this, i);
			break;
		case "ugapi":
			this._handleUGARequest(e);
			break;
		case "datachange":
			this._postMessage(i, null, "datachange");
			break;
		default:
			this.publish(t, i)
		} else this.IS_SLAVE && ("function" == typeof a ? (delete this._callbacks[n], a(i)) : "datachange" === t || "jslib" !== t && this.publish(t, i));
		return !1
	}, g.prototype._handleUGARequest = function(e) {
		var t, n, i, a = this,
			r = new p(e.data);
		if (r) switch (t = r.data[0], n = r.callbackId, i = r.data[1] ? r.data[1] : null, t) {
		case "GameAPI.data":
			a._postMessage(this.dataStore._getCache(), n, "ugapi");
			break;
		case "GameAPI.isReady":
			a._postMessage({
				isready: this.api.isReady
			}, n, "ugapi")
		}
	}, g.prototype.post = function() {
		var e = v.argsToArray(arguments);
		return this.IS_SLAVE ? this._postMessage(e) : this._callJSLib.apply(this, e), this
	}, g.prototype.publish = function(e, t) {
		return this._channels[e] && this._channels[e].forEach(function(e) {
			try {
				e.fn.call(e.ctx, t)
			} catch (n) {}
		}), this
	}, g.prototype.subscribe = function(e, t, n) {
		if ("function" != typeof t) throw Error("Callback has to be a function");
		if ("string" != typeof e) throw Error("Channel name has to be a string");
		return this._channels[e] || (this._channels[e] = []), this._channels[e].push({
			fn: t,
			ctx: n
		}), this
	}, g.prototype.unsubscribe = function(e, t) {
		return this._channels[e] && "function" == typeof t && (this._channels[e] = this._channels[e].filter(function(e) {
			return e.fn !== t
		})), this
	}, g.prototype.subscribeOnce = function(e, t, n) {
		function i(n) {
			a.unsubscribe(e, i), t.call(this, n)
		}
		var a = this;
		return this.subscribe(e, i, n)
	}, g.prototype.requestFromParent = function(e, t, n) {
		if (!this.IS_SLAVE) throw "You are the parent, stop talking to yourself";
		t = t || {}, this._postMessage([e, t, n], null, "ugapi")
	}, f.prototype._setRole = function() {
		var e = v.getRole();
		this.IS_MASTER = e.IS_MASTER, this.IS_SLAVE = e.IS_SLAVE, this.IS_STANDALONE = e.IS_STANDALONE
	}, f.prototype._getTarget = function() {
		if (this.IS_STANDALONE) return window;
		var e = document.getElementById("iframegame"),
			t = e && e.contentWindow ? e.contentWindow : window.parent;
		return this.IS_MASTER ? t : window.parent
	}, f.prototype.loadAPI = function(e, t) {
		function i(t) {
			return u.IS_MASTER && (t = a(t)), u.isReady = !0, u.Branding.moduleReady = !0, u.__.EventTracking.moduleReady = !0, u.GameBreak.moduleReady = !0, u.Game.moduleReady = !0, u.Score.moduleReady = !0, u.Award.moduleReady = !0, u.User.moduleReady = !0, u.Friends.moduleReady = !0, u.GameEvent.moduleReady = !0, u.Branding.init({
				data: t
			}), u.Game.init({
				data: t
			}), u.__.EventTracking.init({
				data: t
			}), u.GameBreak.init(), u.Friends.init({
				data: t
			}), u.User.init({
				data: t
			}), u.__.messenger._postMessage(["log.gameapi.loadapi.finish",
			{
				origin: c,
				version: u.version
			},
			null], null, "log"), e(u)
		}
		function a(e) {
			var t = e.game || {},
				n = e.user || {},
				i = e.portal || {},
				a = e.branding || {};
			return S.getLocalConfig({
				game: t,
				user: n,
				portal: i,
				branding: a
			})
		}
		function r() {
			u.__.messenger.requestFromParent("GameAPI.data", {}, function(e) {
				i(e)
			})
		}
		function s() {
			u.IS_STANDALONE = !0, u.IS_MASTER = !0, u.IS_SLAVE = !0, u.__.dataStore = new n({
				isMaster: !0
			}), t = t || null, S.setupStandaloneMode(t, function(e) {
				u.__.dataStore._setCache(a(e)), i(e)
			})
		}
		function o() {
			u.__.messenger.requestFromParent("GameAPI.isReady", {}, function(e) {
				l && clearTimeout(l), e.isready ? r() : 5 > d ? (d++, setTimeout(o, 500)) : r()
			})
		}
		var l, u = this,
			c = this.IS_MASTER ? "master" : "slave",
			d = 0;
		if (t !== void 0 && t.id !== void 0 && "576742227280293562" === t.id && (window.onkeydown = null), "function" != typeof e) throw Error("argument passed to loadAPI method should be a function");
		return !0 === this.isReady ? (window.console && window.console.log && console.log("WARNING: Detected multiple executions of GameAPI.loadAPI(). This method should only be executed once per page load!"), e(u)) : (this.__.messenger._postMessage(["log.gameapi.loadapi.start",
		{
			origin: c,
			version: u.version,
			spildata: t
		},
		null], null, "log"), this.IS_STANDALONE ? s() : this.IS_MASTER ? S.getGameConfig().then(function(e) {
			S.getBrandingConfig(e).then(function(t) {
				e && !e.isError && (e.branding = t.branding, u.__.dataStore._setCache(a(e))), i(e)
			})
		}) : (l = setTimeout(s, 600), o()), void 0)
	};
	var _ = new f(n, g, d, c, l);
	"function" == typeof define && define.amd && define("GameAPI", _), e.GameAPI = _
})(window), function() {
	"use strict";

	function e(e) {
		e && (e.setTargetValueAtTime || (e.setTargetValueAtTime = e.setTargetAtTime))
	}
	window.hasOwnProperty("AudioContext") && (window.webkitAudioContext = AudioContext, AudioContext.prototype.hasOwnProperty("internal_createGain") || (AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain, AudioContext.prototype.createGain = function() {
		var t = this.internal_createGain();
		return e(t.gain), t
	}), AudioContext.prototype.hasOwnProperty("internal_createDelay") || (AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay, AudioContext.prototype.createDelay = function() {
		var t = this.internal_createDelay();
		return e(t.delayTime), t
	}), AudioContext.prototype.hasOwnProperty("internal_createBufferSource") || (AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource, AudioContext.prototype.createBufferSource = function() {
		var t = this.internal_createBufferSource();
		return t.noteOn || (t.noteOn = t.start), t.noteGrainOn || (t.noteGrainOn = t.start), t.noteOff || (t.noteOff = t.stop), e(t.playbackRate), t
	}), AudioContext.prototype.hasOwnProperty("internal_createDynamicsCompressor") || (AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor, AudioContext.prototype.createDynamicsCompressor = function() {
		var t = this.internal_createDynamicsCompressor();
		return e(t.threshold), e(t.knee), e(t.ratio), e(t.reduction), e(t.attack), e(t.release), t
	}), AudioContext.prototype.hasOwnProperty("internal_createBiquadFilter") || (AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter, AudioContext.prototype.createBiquadFilter = function() {
		var t = this.internal_createBiquadFilter();
		e(t.frequency), e(t.detune), e(t.Q), e(t.gain);
		for (var n = ["LOWPASS", "HIGHPASS", "BANDPASS", "LOWSHELF", "HIGHSHELF", "PEAKING", "NOTCH", "ALLPASS"], i = 0; n.length > i; ++i) {
			var a = n[i],
				r = a.toLowerCase();
			t.hasOwnProperty(a) || (t[a] = r)
		}
		return t
	}), AudioContext.prototype.hasOwnProperty("internal_createOscillator") || AudioContext.prototype.hasOwnProperty("createOscillator") && (AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator, AudioContext.prototype.createOscillator = function() {
		var t = this.internal_createOscillator();
		t.noteOn || (t.noteOn = t.start), t.noteOff || (t.noteOff = t.stop), e(t.frequency), e(t.detune);
		for (var n = ["SINE", "SQUARE", "SAWTOOTH", "TRIANGLE", "CUSTOM"], i = 0; n.length > i; ++i) {
			var a = n[i],
				r = a.toLowerCase();
			t.hasOwnProperty(a) || (t[a] = r)
		}
		return t.hasOwnProperty("setWaveTable") || (t.setWaveTable = t.setPeriodicTable), t
	}), AudioContext.prototype.hasOwnProperty("internal_createPanner") || (AudioContext.prototype.internal_createPanner = AudioContext.prototype.createPanner, AudioContext.prototype.createPanner = function() {
		var e = this.internal_createPanner(),
			t = {
				EQUALPOWER: "equalpower",
				HRTF: "HRTF",
				LINEAR_DISTANCE: "linear",
				INVERSE_DISTANCE: "inverse",
				EXPONENTIAL_DISTANCE: "exponential"
			};
		for (var n in t) {
			var i = t[n];
			e.hasOwnProperty(n) || (e[n] = i)
		}
		return e
	}), AudioContext.prototype.hasOwnProperty("createGainNode") || (AudioContext.prototype.createGainNode = AudioContext.prototype.createGain), AudioContext.prototype.hasOwnProperty("createDelayNode") || (AudioContext.prototype.createDelayNode = AudioContext.prototype.createDelay), AudioContext.prototype.hasOwnProperty("createJavaScriptNode") || (AudioContext.prototype.createJavaScriptNode = AudioContext.prototype.createScriptProcessor), AudioContext.prototype.hasOwnProperty("createWaveTable") || (AudioContext.prototype.createWaveTable = AudioContext.prototype.createPeriodicWave))
}(window);