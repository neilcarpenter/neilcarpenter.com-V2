(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, IS_LIVE, IS_PREVIEW, view;

App = require('./App');


/*

WIP - this will ideally change to old format (above) when can figure it out
 */

IS_LIVE = false;

IS_PREVIEW = /preview=true/.test(window.location.search);

view = IS_LIVE ? {} : window || document;

if (IS_PREVIEW) {
  document.documentElement.className += ' IS_PREVIEW';
} else {
  view.NC = new App(IS_LIVE);
  view.NC.init();
}



},{"./App":2}],2:[function(require,module,exports){
var App, AppData, AppView, MediaQueries,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AppData = require('./AppData');

AppView = require('./AppView');

MediaQueries = require('./utils/MediaQueries');

App = (function() {
  App.prototype.LIVE = null;

  App.prototype.BASE_PATH = window.config.base_path;

  App.prototype.BASE_URL = window.config.base_url;

  App.prototype.BASE_URL_ASSETS = window.config.base_url_assets;

  App.prototype.objReady = 0;

  App.prototype._toClean = ['objReady', 'setFlags', 'objectComplete', 'init', 'initObjects', 'initSDKs', 'initApp', 'go', 'cleanup', '_toClean'];

  function App(LIVE) {
    this.LIVE = LIVE;
    this.cleanup = __bind(this.cleanup, this);
    this.go = __bind(this.go, this);
    this.initApp = __bind(this.initApp, this);
    this.init = __bind(this.init, this);
    this.objectComplete = __bind(this.objectComplete, this);
    this.setFlags = __bind(this.setFlags, this);
    return null;
  }

  App.prototype.setFlags = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    MediaQueries.setup();
    return null;
  };

  App.prototype.objectComplete = function() {
    this.objReady++;
    if (this.objReady >= 1) {
      this.initApp();
    }
    return null;
  };

  App.prototype.init = function() {
    this.initApp();
    return null;
  };

  App.prototype.initApp = function() {
    this.setFlags();

    /* Starts application */
    this.appData = new AppData;
    this.appView = new AppView;
    this.go();
    return null;
  };

  App.prototype.go = function() {

    /* After everything is loaded, kicks off website */
    this.appView.render();

    /* remove redundant initialisation methods / properties */
    this.cleanup();
    return null;
  };

  App.prototype.cleanup = function() {
    var fn, _i, _len, _ref;
    _ref = this._toClean;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      this[fn] = null;
      delete this[fn];
    }
    return null;
  };

  return App;

})();

module.exports = App;



},{"./AppData":3,"./AppView":4,"./utils/MediaQueries":6}],3:[function(require,module,exports){
var AbstractData, AppData,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('./data/AbstractData');

AppData = (function(_super) {
  __extends(AppData, _super);

  function AppData() {
    AppData.__super__.constructor.call(this);
    return null;
  }

  return AppData;

})(AbstractData);

module.exports = AppData;



},{"./data/AbstractData":5}],4:[function(require,module,exports){
var AbstractView, AppView, InteractiveBg, MediaQueries,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./view/AbstractView');

MediaQueries = require('./utils/MediaQueries');

InteractiveBg = require('./view/interactive/InteractiveBg');

AppView = (function(_super) {
  __extends(AppView, _super);

  AppView.prototype.template = 'main';

  AppView.prototype.$window = null;

  AppView.prototype.$body = null;

  AppView.prototype.wrapper = null;

  AppView.prototype.dims = {
    w: null,
    h: null,
    o: null,
    c: null,
    r: null
  };

  AppView.prototype.rwdSizes = {
    LARGE: 'LRG',
    MEDIUM: 'MED',
    SMALL: 'SML'
  };

  AppView.prototype.lastScrollY = 0;

  AppView.prototype.ticking = false;

  AppView.prototype.EVENT_UPDATE_DIMENSIONS = 'EVENT_UPDATE_DIMENSIONS';

  AppView.prototype.EVENT_ON_SCROLL = 'EVENT_ON_SCROLL';

  AppView.prototype.MOBILE_WIDTH = 700;

  AppView.prototype.MOBILE = 'mobile';

  AppView.prototype.NON_MOBILE = 'non_mobile';

  function AppView() {
    this.getRwdSize = __bind(this.getRwdSize, this);
    this.getDims = __bind(this.getDims, this);
    this.onResize = __bind(this.onResize, this);
    this.begin = __bind(this.begin, this);
    this.onAllRendered = __bind(this.onAllRendered, this);
    this.scrollUpdate = __bind(this.scrollUpdate, this);
    this.requestTick = __bind(this.requestTick, this);
    this.onScroll = __bind(this.onScroll, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.render = __bind(this.render, this);
    this.enableTouch = __bind(this.enableTouch, this);
    this.disableTouch = __bind(this.disableTouch, this);
    this.$window = $(window);
    this.$body = $('body').eq(0);
    this.setElement(this.$body.find("[data-template=\"" + this.template + "\"]"));
    this.children = [];
    return null;
  }

  AppView.prototype.disableTouch = function() {
    this.$window.on('touchmove', this.onTouchMove);
  };

  AppView.prototype.enableTouch = function() {
    this.$window.off('touchmove', this.onTouchMove);
  };

  AppView.prototype.onTouchMove = function(e) {
    e.preventDefault();
  };

  AppView.prototype.render = function() {
    this.bindEvents();
    this.interactiveBg = new InteractiveBg;
    this.addChild(this.interactiveBg);
    this.onAllRendered();
  };

  AppView.prototype.bindEvents = function() {
    this.on('allRendered', this.onAllRendered);
    this.onResize();
    this.onResize = _.debounce(this.onResize, 300);
    this.$window.on('resize orientationchange', this.onResize);
    this.$window.on("scroll", this.onScroll);
  };

  AppView.prototype.onScroll = function() {
    this.lastScrollY = window.scrollY;
    this.requestTick();
    return null;
  };

  AppView.prototype.requestTick = function() {
    if (!this.ticking) {
      requestAnimationFrame(this.scrollUpdate);
      this.ticking = true;
    }
    return null;
  };

  AppView.prototype.scrollUpdate = function() {
    this.ticking = false;
    this.$body.addClass('disable-hover');
    clearTimeout(this.timerScroll);
    this.timerScroll = setTimeout((function(_this) {
      return function() {
        return _this.$body.removeClass('disable-hover');
      };
    })(this), 50);
    this.trigger(AppView.EVENT_ON_SCROLL);
    return null;
  };

  AppView.prototype.onAllRendered = function() {
    this.begin();
    return null;
  };

  AppView.prototype.begin = function() {
    this.trigger('start');
    this.onScroll();
    this.interactiveBg.show();
  };

  AppView.prototype.onResize = function() {
    this.getDims();
  };

  AppView.prototype.getDims = function() {
    var h, w;
    w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.dims = {
      w: w,
      h: h,
      o: h > w ? 'portrait' : 'landscape',
      c: w <= this.MOBILE_WIDTH ? this.MOBILE : this.NON_MOBILE,
      r: this.getRwdSize(w, h, window.devicePixelRatio || 1)
    };
    this.trigger(this.EVENT_UPDATE_DIMENSIONS, this.dims);
  };

  AppView.prototype.getRwdSize = function(w, h, dpr) {
    var pw, size;
    pw = w * dpr;
    size = (function() {
      switch (true) {
        case pw > 1440:
          return this.rwdSizes.LARGE;
        case pw < 650:
          return this.rwdSizes.SMALL;
        default:
          return this.rwdSizes.MEDIUM;
      }
    }).call(this);
    return size;
  };

  return AppView;

})(AbstractView);

module.exports = AppView;



},{"./utils/MediaQueries":6,"./view/AbstractView":8,"./view/interactive/InteractiveBg":9}],5:[function(require,module,exports){
var AbstractData,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AbstractData = (function() {
  function AbstractData() {
    this.NC = __bind(this.NC, this);
    _.extend(this, Backbone.Events);
    return null;
  }

  AbstractData.prototype.NC = function() {
    return window.NC;
  };

  return AbstractData;

})();

module.exports = AbstractData;



},{}],6:[function(require,module,exports){
var MediaQueries;

MediaQueries = (function() {
  function MediaQueries() {}

  MediaQueries.SMALLEST = "smallest";

  MediaQueries.SMALL = "small";

  MediaQueries.IPAD = "ipad";

  MediaQueries.MEDIUM = "medium";

  MediaQueries.LARGE = "large";

  MediaQueries.EXTRA_LARGE = "extra-large";

  MediaQueries.setup = function() {
    MediaQueries.SMALLEST_BREAKPOINT = {
      name: "Smallest",
      breakpoints: [MediaQueries.SMALLEST]
    };
    MediaQueries.SMALL_BREAKPOINT = {
      name: "Small",
      breakpoints: [MediaQueries.SMALLEST, MediaQueries.SMALL]
    };
    MediaQueries.MEDIUM_BREAKPOINT = {
      name: "Medium",
      breakpoints: [MediaQueries.MEDIUM]
    };
    MediaQueries.LARGE_BREAKPOINT = {
      name: "Large",
      breakpoints: [MediaQueries.IPAD, MediaQueries.LARGE, MediaQueries.EXTRA_LARGE]
    };
    MediaQueries.BREAKPOINTS = [MediaQueries.SMALLEST_BREAKPOINT, MediaQueries.SMALL_BREAKPOINT, MediaQueries.MEDIUM_BREAKPOINT, MediaQueries.LARGE_BREAKPOINT];
  };

  MediaQueries.getDeviceState = function() {
    return window.getComputedStyle(document.body, "after").getPropertyValue("content");
  };

  MediaQueries.getBreakpoint = function() {
    var i, state, _i, _ref;
    state = MediaQueries.getDeviceState();
    for (i = _i = 0, _ref = MediaQueries.BREAKPOINTS.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (MediaQueries.BREAKPOINTS[i].breakpoints.indexOf(state) > -1) {
        return MediaQueries.BREAKPOINTS[i].name;
      }
    }
    return "";
  };

  MediaQueries.isBreakpoint = function(breakpoint) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = breakpoint.breakpoints.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (breakpoint.breakpoints[i] === MediaQueries.getDeviceState()) {
        return true;
      }
    }
    return false;
  };

  return MediaQueries;

})();

module.exports = MediaQueries;



},{}],7:[function(require,module,exports){
var NumberUtils;

NumberUtils = (function() {
  function NumberUtils() {}

  NumberUtils.MATH_COS = Math.cos;

  NumberUtils.MATH_SIN = Math.sin;

  NumberUtils.MATH_RANDOM = Math.random;

  NumberUtils.MATH_ABS = Math.abs;

  NumberUtils.MATH_ATAN2 = Math.atan2;

  NumberUtils.limit = function(number, min, max) {
    return Math.min(Math.max(min, number), max);
  };

  NumberUtils.map = function(num, min1, max1, min2, max2, round, constrainMin, constrainMax) {
    var num1, num2;
    if (round == null) {
      round = false;
    }
    if (constrainMin == null) {
      constrainMin = true;
    }
    if (constrainMax == null) {
      constrainMax = true;
    }
    if (constrainMin && num < min1) {
      return min2;
    }
    if (constrainMax && num > max1) {
      return max2;
    }
    num1 = (num - min1) / (max1 - min1);
    num2 = (num1 * (max2 - min2)) + min2;
    if (round) {
      return Math.round(num2);
    }
    return num2;
  };

  NumberUtils.getRandomColor = function() {
    var color, i, letters, _i;
    letters = '0123456789ABCDEF'.split('');
    color = '#';
    for (i = _i = 0; _i < 6; i = ++_i) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  };

  NumberUtils.getRandomFloat = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  NumberUtils.getTimeStampDiff = function(date1, date2) {
    var date1_ms, date2_ms, difference_ms, one_day, time;
    one_day = 1000 * 60 * 60 * 24;
    time = {};
    date1_ms = date1.getTime();
    date2_ms = date2.getTime();
    difference_ms = date2_ms - date1_ms;
    difference_ms = difference_ms / 1000;
    time.seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    time.minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    time.hours = Math.floor(difference_ms % 24);
    time.days = Math.floor(difference_ms / 24);
    return time;
  };

  NumberUtils.map = function(num, min1, max1, min2, max2, round, constrainMin, constrainMax) {
    var num1, num2;
    if (round == null) {
      round = false;
    }
    if (constrainMin == null) {
      constrainMin = true;
    }
    if (constrainMax == null) {
      constrainMax = true;
    }
    if (constrainMin && num < min1) {
      return min2;
    }
    if (constrainMax && num > max1) {
      return max2;
    }
    num1 = (num - min1) / (max1 - min1);
    num2 = (num1 * (max2 - min2)) + min2;
    if (round) {
      return Math.round(num2);
    }
    return num2;
  };

  NumberUtils.toRadians = function(degree) {
    return degree * (Math.PI / 180);
  };

  NumberUtils.toDegree = function(radians) {
    return radians * (180 / Math.PI);
  };

  NumberUtils.isInRange = function(num, min, max, canBeEqual) {
    if (canBeEqual) {
      return num >= min && num <= max;
    } else {
      return num >= min && num <= max;
    }
  };

  NumberUtils.getNiceDistance = function(metres) {
    var km;
    if (metres < 1000) {
      return "" + (Math.round(metres)) + "M";
    } else {
      km = (metres / 1000).toFixed(2);
      return "" + km + "KM";
    }
  };

  NumberUtils.shuffle = function(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);;
    return o;
  };

  NumberUtils.randomRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return NumberUtils;

})();

module.exports = NumberUtils;



},{}],8:[function(require,module,exports){
var AbstractView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = (function(_super) {
  __extends(AbstractView, _super);

  function AbstractView() {
    this.NC = __bind(this.NC, this);
    this.dispose = __bind(this.dispose, this);
    this.callChildrenAndSelf = __bind(this.callChildrenAndSelf, this);
    this.callChildren = __bind(this.callChildren, this);
    this.triggerChildren = __bind(this.triggerChildren, this);
    this.removeAllChildren = __bind(this.removeAllChildren, this);
    this.muteAll = __bind(this.muteAll, this);
    this.unMuteAll = __bind(this.unMuteAll, this);
    this.CSSTranslate = __bind(this.CSSTranslate, this);
    this.mouseEnabled = __bind(this.mouseEnabled, this);
    this.onResize = __bind(this.onResize, this);
    this.remove = __bind(this.remove, this);
    this.replace = __bind(this.replace, this);
    this.addChild = __bind(this.addChild, this);
    this.render = __bind(this.render, this);
    this.update = __bind(this.update, this);
    this.init = __bind(this.init, this);
    return AbstractView.__super__.constructor.apply(this, arguments);
  }

  AbstractView.prototype.el = null;

  AbstractView.prototype.id = null;

  AbstractView.prototype.children = null;

  AbstractView.prototype.template = null;

  AbstractView.prototype.templateVars = null;

  AbstractView.prototype.initialized = false;

  AbstractView.prototype.initialize = function(force) {
    var $tmpl;
    if (!(!this.initialized || force)) {
      return;
    }
    this.children = [];
    if (this.template) {
      $tmpl = this.NC().appView.$el.find("[data-template=\"" + this.template + "\"]");
      this.setElement($tmpl);
      if (!$tmpl.length) {
        return;
      }
    }
    if (this.id) {
      this.$el.attr('id', this.id);
    }
    if (this.className) {
      this.$el.addClass(this.className);
    }
    this.initialized = true;
    this.init();
    this.paused = false;
    return null;
  };

  AbstractView.prototype.init = function() {
    return null;
  };

  AbstractView.prototype.update = function() {
    return null;
  };

  AbstractView.prototype.render = function() {
    return null;
  };

  AbstractView.prototype.addChild = function(child, prepend) {
    if (prepend == null) {
      prepend = false;
    }
    if (child.el) {
      this.children.push(child);
    }
    return this;
  };

  AbstractView.prototype.replace = function(dom, child) {
    var c;
    if (child.el) {
      this.children.push(child);
    }
    c = child.el ? child.$el : child;
    this.$el.children(dom).replaceWith(c);
    return null;
  };

  AbstractView.prototype.remove = function(child) {
    var c;
    if (child == null) {
      return;
    }
    c = child.el ? child.$el : $(child);
    if (c && child.dispose) {
      child.dispose();
    }
    if (c && this.children.indexOf(child) !== -1) {
      this.children.splice(this.children.indexOf(child), 1);
    }
    c.remove();
    return null;
  };

  AbstractView.prototype.onResize = function(event) {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.onResize) {
        child.onResize();
      }
    }
    return null;
  };

  AbstractView.prototype.mouseEnabled = function(enabled) {
    this.$el.css({
      "pointer-events": enabled ? "auto" : "none"
    });
    return null;
  };

  AbstractView.prototype.CSSTranslate = function(x, y, value, scale) {
    var str;
    if (value == null) {
      value = '%';
    }
    if (Modernizr.csstransforms3d) {
      str = "translate3d(" + (x + value) + ", " + (y + value) + ", 0)";
    } else {
      str = "translate(" + (x + value) + ", " + (y + value) + ")";
    }
    if (scale) {
      str = "" + str + " scale(" + scale + ")";
    }
    return str;
  };

  AbstractView.prototype.unMuteAll = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (typeof child.unMute === "function") {
        child.unMute();
      }
      if (child.children.length) {
        child.unMuteAll();
      }
    }
    return null;
  };

  AbstractView.prototype.muteAll = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (typeof child.mute === "function") {
        child.mute();
      }
      if (child.children.length) {
        child.muteAll();
      }
    }
    return null;
  };

  AbstractView.prototype.removeAllChildren = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      this.remove(child);
    }
    return null;
  };

  AbstractView.prototype.triggerChildren = function(msg, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      child.trigger(msg);
      if (child.children.length) {
        this.triggerChildren(msg, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.callChildren = function(method, params, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      if (typeof child[method] === "function") {
        child[method](params);
      }
      if (child.children.length) {
        this.callChildren(method, params, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.callChildrenAndSelf = function(method, params, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    if (typeof this[method] === "function") {
      this[method](params);
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      if (typeof child[method] === "function") {
        child[method](params);
      }
      if (child.children.length) {
        this.callChildren(method, params, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.supplantString = function(str, vals) {
    return str.replace(/{{ ([^{}]*) }}/g, function(a, b) {
      var r;
      r = vals[b];
      if (typeof r === "string" || typeof r === "number") {
        return r;
      } else {
        return a;
      }
    });
  };

  AbstractView.prototype.dispose = function() {
    this.stopListening();
    return null;
  };

  AbstractView.prototype.NC = function() {
    return window.NC;
  };

  return AbstractView;

})(Backbone.View);

module.exports = AbstractView;



},{}],9:[function(require,module,exports){
var AbstractShape, AbstractView, InteractiveBg, InteractiveBgConfig, InteractiveShapeCache, NumberUtils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

AbstractShape = require('./shapes/AbstractShape');

NumberUtils = require('../../utils/NumberUtils');

InteractiveBgConfig = require('./InteractiveBgConfig');

InteractiveShapeCache = require('./InteractiveShapeCache');

InteractiveBg = (function(_super) {
  __extends(InteractiveBg, _super);

  InteractiveBg.prototype.template = 'interactive-background';

  InteractiveBg.prototype.stage = null;

  InteractiveBg.prototype.renderer = null;

  InteractiveBg.prototype.layers = {};

  InteractiveBg.prototype.w = 0;

  InteractiveBg.prototype.h = 0;

  InteractiveBg.prototype.counter = null;

  InteractiveBg.prototype.mouse = {
    enabled: false,
    pos: null
  };

  InteractiveBg.prototype.EVENT_KILL_SHAPE = 'EVENT_KILL_SHAPE';

  InteractiveBg.prototype.filters = {
    blur: null,
    RGB: null,
    pixel: null
  };

  function InteractiveBg() {
    this.setStreamDirection = __bind(this.setStreamDirection, this);
    this.setDims = __bind(this.setDims, this);
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.render = __bind(this.render, this);
    this.updateShapes = __bind(this.updateShapes, this);
    this.update = __bind(this.update, this);
    this.removeShape = __bind(this.removeShape, this);
    this._getShapeCount = __bind(this._getShapeCount, this);
    this._getShapeStartPos = __bind(this._getShapeStartPos, this);
    this.addShapes = __bind(this.addShapes, this);
    this.show = __bind(this.show, this);
    this.draw = __bind(this.draw, this);
    this.init = __bind(this.init, this);
    this.createStageFilters = __bind(this.createStageFilters, this);
    this.createLayers = __bind(this.createLayers, this);
    this.updateShapeCounter = __bind(this.updateShapeCounter, this);
    this.addShapeCounter = __bind(this.addShapeCounter, this);
    this.addStats = __bind(this.addStats, this);
    this.addGui = __bind(this.addGui, this);
    this.DEBUG = true;
    InteractiveBg.__super__.constructor.apply(this, arguments);
    return null;
  }

  InteractiveBg.prototype.addGui = function() {
    var i, shape, _i, _len, _ref;
    this.gui = new dat.GUI;
    this.guiFolders = {};
    this.guiFolders.generalFolder = this.gui.addFolder('General');
    this.guiFolders.generalFolder.add(InteractiveBgConfig.general, 'GLOBAL_SPEED', 0.5, 5).name("global speed");
    this.guiFolders.generalFolder.add(InteractiveBgConfig.general, 'GLOBAL_ALPHA', 0, 1).name("global alpha");
    this.guiFolders.sizeFolder = this.gui.addFolder('Size');
    this.guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MIN_WIDTH', 5, 200).name('min width');
    this.guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MAX_WIDTH', 5, 200).name('max width');
    this.guiFolders.countFolder = this.gui.addFolder('Count');
    this.guiFolders.countFolder.add(InteractiveBgConfig.general, 'MAX_SHAPE_COUNT', 5, 1000).name('max shapes');
    this.guiFolders.shapesFolder = this.gui.addFolder('Shapes');
    _ref = InteractiveBgConfig.shapeTypes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      shape = _ref[i];
      this.guiFolders.shapesFolder.add(InteractiveBgConfig.shapeTypes[i], 'active').name(shape.type);
    }
    this.guiFolders.blurFolder = this.gui.addFolder('Blur');
    this.guiFolders.blurFolder.add(InteractiveBgConfig.filters, 'blur').name("enable");
    this.guiFolders.blurFolder.add(this.filters.blur, 'blur', 0, 32).name("blur amount");
    this.guiFolders.RGBFolder = this.gui.addFolder('RGB Split');
    this.guiFolders.RGBFolder.add(InteractiveBgConfig.filters, 'RGB').name("enable");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.red.value, 'x', -20, 20).name("red x");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.red.value, 'y', -20, 20).name("red y");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.green.value, 'x', -20, 20).name("green x");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.green.value, 'y', -20, 20).name("green y");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.blue.value, 'x', -20, 20).name("blue x");
    this.guiFolders.RGBFolder.add(this.filters.RGB.uniforms.blue.value, 'y', -20, 20).name("blue y");
    this.guiFolders.pixelateFolder = this.gui.addFolder('Pixellate');
    this.guiFolders.pixelateFolder.add(InteractiveBgConfig.filters, 'pixel').name("enable");
    this.guiFolders.pixelateFolder.add(this.filters.pixel.size, 'x', 1, 32).name("pixel size x");
    this.guiFolders.pixelateFolder.add(this.filters.pixel.size, 'y', 1, 32).name("pixel size y");
    this.guiFolders.paletteFolder = this.gui.addFolder('Colour palette');
    this.guiFolders.paletteFolder.add(InteractiveBgConfig, 'activePalette', InteractiveBgConfig.palettes).name("palette");
    return null;
  };

  InteractiveBg.prototype.addStats = function() {
    this.stats = new Stats;
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
    return null;
  };

  InteractiveBg.prototype.addShapeCounter = function() {
    this.shapeCounter = document.createElement('div');
    this.shapeCounter.style.position = 'absolute';
    this.shapeCounter.style.left = '100px';
    this.shapeCounter.style.top = '15px';
    this.shapeCounter.style.color = '#fff';
    this.shapeCounter.style.textTransform = 'uppercase';
    this.shapeCounter.innerHTML = "0 shapes";
    document.body.appendChild(this.shapeCounter);
    return null;
  };

  InteractiveBg.prototype.updateShapeCounter = function() {
    this.shapeCounter.innerHTML = "" + (this._getShapeCount()) + " shapes";
    return null;
  };

  InteractiveBg.prototype.createLayers = function() {
    var layer, name, _ref;
    _ref = InteractiveBgConfig.layers;
    for (layer in _ref) {
      name = _ref[layer];
      this.layers[name] = new PIXI.DisplayObjectContainer;
      this.stage.addChild(this.layers[name]);
    }
    return null;
  };

  InteractiveBg.prototype.createStageFilters = function() {
    this.filters.blur = new PIXI.BlurFilter;
    this.filters.RGB = new PIXI.RGBSplitFilter;
    this.filters.pixel = new PIXI.PixelateFilter;
    this.filters.blur.blur = InteractiveBgConfig.filterDefaults.blur.general;
    this.filters.RGB.uniforms.red.value = InteractiveBgConfig.filterDefaults.RGB.red;
    this.filters.RGB.uniforms.green.value = InteractiveBgConfig.filterDefaults.RGB.green;
    this.filters.RGB.uniforms.blue.value = InteractiveBgConfig.filterDefaults.RGB.blue;
    this.filters.pixel.uniforms.pixelSize.value = InteractiveBgConfig.filterDefaults.pixel.amount;
    return null;
  };

  InteractiveBg.prototype.init = function() {
    PIXI.dontSayHello = true;
    this.setDims();
    this.setStreamDirection();
    this.shapes = [];
    this.stage = new PIXI.Stage(0x1A1A1A);
    this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {
      antialias: true
    });
    this.render();
    InteractiveShapeCache.createCache();
    this.createLayers();
    this.createStageFilters();
    if (this.DEBUG) {
      this.addGui();
      this.addStats();
      this.addShapeCounter();
    }
    this.$el.append(this.renderer.view);
    this.draw();
    return null;
  };

  InteractiveBg.prototype.draw = function() {
    this.counter = 0;
    this.setDims();
    return null;
  };

  InteractiveBg.prototype.show = function() {
    this.bindEvents();
    this.addShapes(InteractiveBgConfig.general.INITIAL_SHAPE_COUNT);
    this.update();
    return null;
  };

  InteractiveBg.prototype.addShapes = function(count) {
    var i, layer, pos, shape, sprite, _i;
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      pos = this._getShapeStartPos();
      shape = new AbstractShape(this);
      sprite = shape.getSprite();
      layer = shape.getLayer();
      sprite.position.x = sprite._position.x = pos.x;
      sprite.position.y = sprite._position.y = pos.y;
      this.layers[layer].addChild(sprite);
      this.shapes.push(shape);
    }
    return null;
  };

  InteractiveBg.prototype._getShapeStartPos = function() {
    var x, y;
    x = (NumberUtils.getRandomFloat(this.w3, this.w)) + (this.w3 * 2);
    y = (NumberUtils.getRandomFloat(0, this.h3 * 2)) - this.h3 * 2;
    return {
      x: x,
      y: y
    };
  };

  InteractiveBg.prototype._getShapeCount = function() {
    var count, displayContainer, layer, _ref;
    count = 0;
    _ref = this.layers;
    for (layer in _ref) {
      displayContainer = _ref[layer];
      count += displayContainer.children.length;
    }
    return count;
  };

  InteractiveBg.prototype.removeShape = function(shape) {
    var index, layerParent;
    index = this.shapes.indexOf(shape);
    this.shapes[index] = null;
    layerParent = this.layers[shape.getLayer()];
    layerParent.removeChild(shape.s);
    if (this._getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT) {
      this.addShapes(1);
    }
    return null;
  };

  InteractiveBg.prototype.update = function() {
    var enabled, filter, filtersToApply, _ref;
    if (window.STOP) {
      return requestAnimFrame(this.update);
    }
    if (this.DEBUG) {
      this.stats.begin();
    }
    this.counter++;
    if ((this.counter % 4 === 0) && (this._getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT)) {
      this.addShapes(1);
    }
    this.updateShapes();
    this.render();
    filtersToApply = [];
    _ref = InteractiveBgConfig.filters;
    for (filter in _ref) {
      enabled = _ref[filter];
      if (enabled) {
        filtersToApply.push(this.filters[filter]);
      }
    }
    this.stage.filters = filtersToApply.length ? filtersToApply : null;
    requestAnimFrame(this.update);
    if (this.DEBUG) {
      this.updateShapeCounter();
      this.stats.end();
    }
    return null;
  };

  InteractiveBg.prototype.updateShapes = function() {
    var shape, _i, _len, _ref;
    _ref = this.shapes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      shape = _ref[_i];
      if (shape != null) {
        shape.callAnimate();
      }
    }
    return null;
  };

  InteractiveBg.prototype.render = function() {
    this.renderer.render(this.stage);
    return null;
  };

  InteractiveBg.prototype.bindEvents = function() {
    this.NC().appView.$window.on('mousemove', this.onMouseMove);
    this.NC().appView.on(this.NC().appView.EVENT_UPDATE_DIMENSIONS, this.setDims);
    this.on(this.EVENT_KILL_SHAPE, this.removeShape);
    return null;
  };

  InteractiveBg.prototype.onMouseMove = function(e) {
    this.mouse.multiplier = 1;
    this.mouse.pos = {
      x: e.pageX,
      y: e.pageY
    };
    this.mouse.enabled = true;
    return null;
  };

  InteractiveBg.prototype.setDims = function() {
    var _ref;
    this.w = this.NC().appView.dims.w;
    this.h = this.NC().appView.dims.h;
    this.w3 = this.w / 3;
    this.h3 = this.h / 3;
    this.setStreamDirection();
    if ((_ref = this.renderer) != null) {
      _ref.resize(this.w, this.h);
    }
    return null;
  };

  InteractiveBg.prototype.setStreamDirection = function() {
    var x, y;
    if (this.w > this.h) {
      x = 1;
      y = this.h / this.w;
    } else {
      y = 1;
      x = this.w / this.h;
    }
    InteractiveBgConfig.general.DIRECTION_RATIO = {
      x: x,
      y: y
    };
    return null;
  };

  return InteractiveBg;

})(AbstractView);

module.exports = InteractiveBg;



},{"../../utils/NumberUtils":7,"../AbstractView":8,"./InteractiveBgConfig":10,"./InteractiveShapeCache":11,"./shapes/AbstractShape":12}],10:[function(require,module,exports){
var InteractiveBgConfig;

InteractiveBgConfig = (function() {
  function InteractiveBgConfig() {}

  InteractiveBgConfig.colors = {
    FLAT: ['19B698', '2CC36B', '2E8ECE', '9B50BA', 'E98B39', 'EA6153', 'F2CA27'],
    BW: ['E8E8E8', 'D1D1D1', 'B9B9B9', 'A3A3A3', '8C8C8C', '767676', '5E5E5E'],
    RED: ['AA3939', 'D46A6A', 'FFAAAA', '801515', '550000'],
    BLUE: ['9FD4F6', '6EBCEF', '48A9E8', '2495DE', '0981CF'],
    GREEN: ['9FF4C1', '6DE99F', '46DD83', '25D06A', '00C24F'],
    YELLOW: ['FFEF8F', 'FFE964', 'FFE441', 'F3D310', 'B8A006']
  };

  InteractiveBgConfig.palettes = {
    'flat': 'FLAT',
    'b&w': 'BW',
    'red': 'RED',
    'blue': 'BLUE',
    'green': 'GREEN',
    'yellow': 'YELLOW'
  };

  InteractiveBgConfig.activePalette = 'FLAT';

  InteractiveBgConfig.shapeTypes = [
    {
      type: 'Circle',
      active: true
    }, {
      type: 'Square',
      active: true
    }, {
      type: 'Triangle',
      active: true
    }
  ];

  InteractiveBgConfig.shapes = {
    MIN_WIDTH_PERC: 3,
    MAX_WIDTH_PERC: 7,
    MIN_WIDTH: 30,
    MAX_WIDTH: 70,
    MIN_SPEED_MOVE: 2,
    MAX_SPEED_MOVE: 3.5,
    MIN_SPEED_ROTATE: -0.01,
    MAX_SPEED_ROTATE: 0.01,
    MIN_ALPHA: 1,
    MAX_ALPHA: 1,
    MIN_BLUR: 0,
    MAX_BLUR: 10
  };

  InteractiveBgConfig.general = {
    GLOBAL_SPEED: 1,
    GLOBAL_ALPHA: 0.7,
    MAX_SHAPE_COUNT: 200,
    INITIAL_SHAPE_COUNT: 10,
    DIRECTION_RATIO: {
      x: 1,
      y: 1
    }
  };

  InteractiveBgConfig.layers = {
    BACKGROUND: 'BACKGROUND',
    MIDGROUND: 'MIDGROUND',
    FOREGROUND: 'FOREGROUND'
  };

  InteractiveBgConfig.filters = {
    blur: false,
    RGB: false,
    pixel: false
  };

  InteractiveBgConfig.filterDefaults = {
    blur: {
      general: 10,
      foreground: 0,
      midground: 0,
      background: 0
    },
    RGB: {
      red: {
        x: 2,
        y: 2
      },
      green: {
        x: -2,
        y: 2
      },
      blue: {
        x: 2,
        y: -2
      }
    },
    pixel: {
      amount: {
        x: 4,
        y: 4
      }
    }
  };

  InteractiveBgConfig.interaction = {
    MOUSE_RADIUS: 800,
    DISPLACEMENT_MAX_INC: 0.2,
    DISPLACEMENT_DECAY: 0.01
  };

  InteractiveBgConfig.getRandomColor = function() {
    return this.colors[this.activePalette][_.random(0, this.colors[this.activePalette].length - 1)];
  };

  InteractiveBgConfig.getRandomShape = function() {
    var activeShapes;
    activeShapes = _.filter(this.shapeTypes, function(s) {
      return s.active;
    });
    return activeShapes[_.random(0, activeShapes.length - 1)].type;
  };

  return InteractiveBgConfig;

})();

window.InteractiveBgConfig = InteractiveBgConfig;

module.exports = InteractiveBgConfig;



},{}],11:[function(require,module,exports){
var AbstractShape, InteractiveBgConfig, InteractiveShapeCache;

InteractiveBgConfig = require('./InteractiveBgConfig');

AbstractShape = require('./shapes/AbstractShape');

InteractiveShapeCache = (function() {
  function InteractiveShapeCache() {}

  InteractiveShapeCache.shapes = {};

  InteractiveShapeCache.triangleRatio = Math.cos(Math.PI / 6);

  InteractiveShapeCache.createCache = function() {
    var color, colors, palette, paletteColors, shape, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = InteractiveBgConfig.shapeTypes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      shape = _ref[_i];
      this.shapes[shape.type] = {};
    }
    _ref1 = InteractiveBgConfig.colors;
    for (palette in _ref1) {
      paletteColors = _ref1[palette];
      for (_j = 0, _len1 = paletteColors.length; _j < _len1; _j++) {
        color = paletteColors[_j];
        _ref2 = this.shapes;
        for (shape in _ref2) {
          colors = _ref2[shape];
          this.shapes[shape][color] = this._createShape(shape, color);
        }
      }
    }
    return null;
  };

  InteractiveShapeCache._createShape = function(shape, color) {
    var c, ctx, height;
    height = this._getHeight(shape, InteractiveBgConfig.shapes.MAX_WIDTH);
    c = document.createElement('canvas');
    c.width = InteractiveBgConfig.shapes.MAX_WIDTH;
    c.height = height;
    ctx = c.getContext('2d');
    ctx.fillStyle = '#' + color;
    ctx.beginPath();
    this["_draw" + shape](ctx, height);
    ctx.closePath();
    ctx.fill();
    return c.toDataURL();
  };

  InteractiveShapeCache._drawSquare = function(ctx, height) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, height);
    ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, 0);
    ctx.lineTo(0, 0);
    return null;
  };

  InteractiveShapeCache._drawTriangle = function(ctx, height) {
    ctx.moveTo(InteractiveBgConfig.shapes.MAX_WIDTH / 2, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, height);
    ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH / 2, 0);
    return null;
  };

  InteractiveShapeCache._drawCircle = function(ctx) {
    var halfWidth;
    halfWidth = InteractiveBgConfig.shapes.MAX_WIDTH / 2;
    ctx.arc(halfWidth, halfWidth, halfWidth, 0, 2 * Math.PI);
    return null;
  };

  InteractiveShapeCache._getHeight = function(shape, width) {
    var height;
    height = (function() {
      switch (true) {
        case shape === 'Triangle':
          return width * this.triangleRatio;
        default:
          return width;
      }
    }).call(InteractiveShapeCache);
    return height;
  };

  return InteractiveShapeCache;

})();

module.exports = InteractiveShapeCache;



},{"./InteractiveBgConfig":10,"./shapes/AbstractShape":12}],12:[function(require,module,exports){
var AbstractShape, InteractiveBgConfig, InteractiveShapeCache, NumberUtils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

InteractiveBgConfig = require('../InteractiveBgConfig');

InteractiveShapeCache = require('../InteractiveShapeCache');

NumberUtils = require('../../../utils/NumberUtils');

AbstractShape = (function() {
  AbstractShape.prototype.s = null;

  AbstractShape.prototype._shape = null;

  AbstractShape.prototype._color = null;

  AbstractShape.prototype.width = null;

  AbstractShape.prototype.speedMove = null;

  AbstractShape.prototype.speedRotate = null;

  AbstractShape.prototype.alphaValue = null;

  AbstractShape.prototype.dead = false;

  AbstractShape.prototype.displacement = 0;

  AbstractShape.triangleRatio = Math.cos(Math.PI / 6);

  function AbstractShape(interactiveBg) {
    this.interactiveBg = interactiveBg;
    this.NC = __bind(this.NC, this);
    this.getLayer = __bind(this.getLayer, this);
    this.getSprite = __bind(this.getSprite, this);
    this.kill = __bind(this.kill, this);
    this.callAnimate = __bind(this.callAnimate, this);
    this._getDisplacement = __bind(this._getDisplacement, this);
    this._getAlphaValue = __bind(this._getAlphaValue, this);
    this._getSpeedRotate = __bind(this._getSpeedRotate, this);
    this._getSpeedMove = __bind(this._getSpeedMove, this);
    this._getHeight = __bind(this._getHeight, this);
    this._getWidth = __bind(this._getWidth, this);
    _.extend(this, Backbone.Events);
    this._shape = InteractiveBgConfig.getRandomShape();
    this._color = InteractiveBgConfig.getRandomColor();
    this.width = this._getWidth();
    this.height = this._getHeight(this._shape, this.width);
    this.speedMove = this._getSpeedMove();
    this.speedRotate = this._getSpeedRotate();
    this.alphaValue = this._getAlphaValue();
    this.s = new PIXI.Sprite.fromImage(InteractiveShapeCache.shapes[this._shape][this._color]);
    this.s.width = this.width;
    this.s.height = this.height;
    this.s.blendMode = PIXI.blendModes.ADD;
    this.s.alpha = this.alphaValue;
    this.s.anchor.x = this.s.anchor.y = 0.5;
    this.s._position = {
      x: 0,
      y: 0
    };
    return null;
  }

  AbstractShape.prototype._getWidth = function() {
    return NumberUtils.getRandomFloat(InteractiveBgConfig.shapes.MIN_WIDTH, InteractiveBgConfig.shapes.MAX_WIDTH);
  };

  AbstractShape.prototype._getHeight = function(shape, width) {
    var height;
    height = (function() {
      switch (true) {
        case shape === 'Triangle':
          return width * AbstractShape.triangleRatio;
        default:
          return width;
      }
    })();
    return height;
  };

  AbstractShape.prototype._getSpeedMove = function() {
    return NumberUtils.getRandomFloat(InteractiveBgConfig.shapes.MIN_SPEED_MOVE, InteractiveBgConfig.shapes.MAX_SPEED_MOVE);
  };

  AbstractShape.prototype._getSpeedRotate = function() {
    return NumberUtils.getRandomFloat(InteractiveBgConfig.shapes.MIN_SPEED_ROTATE, InteractiveBgConfig.shapes.MAX_SPEED_ROTATE);
  };

  AbstractShape.prototype._getAlphaValue = function() {
    var alpha, range;
    range = InteractiveBgConfig.shapes.MAX_ALPHA - InteractiveBgConfig.shapes.MIN_ALPHA;
    alpha = ((this.width / InteractiveBgConfig.shapes.MAX_WIDTH) * range) + InteractiveBgConfig.shapes.MIN_ALPHA;
    return alpha;
  };

  AbstractShape.prototype._getDisplacement = function(axis) {
    var dist, strength, value;
    if (!this.interactiveBg.mouse.enabled) {
      return 0;
    }
    dist = this.interactiveBg.mouse.pos[axis] - this.s.position[axis];
    dist = dist < 0 ? -dist : dist;
    if (dist < InteractiveBgConfig.interaction.MOUSE_RADIUS) {
      strength = (InteractiveBgConfig.interaction.MOUSE_RADIUS - dist) / InteractiveBgConfig.interaction.MOUSE_RADIUS;
      value = InteractiveBgConfig.interaction.DISPLACEMENT_MAX_INC * InteractiveBgConfig.general.GLOBAL_SPEED * strength;
      this.displacement = this.s.position[axis] > this.interactiveBg.mouse.pos[axis] ? this.displacement - value : this.displacement + value;
    }
    if (this.displacement !== 0) {
      if (this.displacement > 0) {
        this.displacement -= InteractiveBgConfig.interaction.DISPLACEMENT_DECAY;
        this.displacement = this.displacement < 0 ? 0 : this.displacement;
      } else {
        this.displacement += InteractiveBgConfig.interaction.DISPLACEMENT_DECAY;
        this.displacement = this.displacement > 0 ? 0 : this.displacement;
      }
    }
    return this.displacement;
  };

  AbstractShape.prototype.callAnimate = function() {
    if (!!this.dead) {
      return;
    }
    this.s.alpha = this.alphaValue * InteractiveBgConfig.general.GLOBAL_ALPHA;
    this.s._position.x -= (this.speedMove * InteractiveBgConfig.general.GLOBAL_SPEED) * InteractiveBgConfig.general.DIRECTION_RATIO.x;
    this.s._position.y += (this.speedMove * InteractiveBgConfig.general.GLOBAL_SPEED) * InteractiveBgConfig.general.DIRECTION_RATIO.y;
    this.s.position.x = this.s._position.x + this._getDisplacement('x');
    this.s.position.y = this.s._position.y + this._getDisplacement('y');
    this.s.rotation += this.speedRotate * InteractiveBgConfig.general.GLOBAL_SPEED;
    if ((this.s.position.x + (this.width / 2) < 0) || (this.s.position.y - (this.width / 2) > this.NC().appView.dims.h)) {
      this.kill();
    }
    return null;
  };

  AbstractShape.prototype.kill = function() {
    this.dead = true;
    return this.interactiveBg.trigger(this.interactiveBg.EVENT_KILL_SHAPE, this);
  };

  AbstractShape.prototype.getSprite = function() {
    return this.s;
  };

  AbstractShape.prototype.getLayer = function() {
    var layer, range;
    range = InteractiveBgConfig.shapes.MAX_WIDTH - InteractiveBgConfig.shapes.MIN_WIDTH;
    layer = (function() {
      switch (true) {
        case this.width < (range / 3) + InteractiveBgConfig.shapes.MIN_WIDTH:
          return InteractiveBgConfig.layers.BACKGROUND;
        case this.width < ((range / 3) * 2) + InteractiveBgConfig.shapes.MIN_WIDTH:
          return InteractiveBgConfig.layers.MIDGROUND;
        default:
          return InteractiveBgConfig.layers.FOREGROUND;
      }
    }).call(this);
    return layer;
  };

  AbstractShape.prototype.NC = function() {
    return window.NC;
  };

  return AbstractShape;

})();

module.exports = AbstractShape;



},{"../../../utils/NumberUtils":7,"../InteractiveBgConfig":10,"../InteractiveShapeCache":11}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL051bWJlclV0aWxzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZy5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmdDb25maWcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9JbnRlcmFjdGl2ZVNoYXBlQ2FjaGUuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9zaGFwZXMvQWJzdHJhY3RTaGFwZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhCQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBS0E7QUFBQTs7O0dBTEE7O0FBQUEsT0FXQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxVQVlBLEdBQWEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFwQyxDQVpiLENBQUE7O0FBQUEsSUFlQSxHQUFVLE9BQUgsR0FBZ0IsRUFBaEIsR0FBeUIsTUFBQSxJQUFVLFFBZjFDLENBQUE7O0FBaUJBLElBQUcsVUFBSDtBQUNDLEVBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUF6QixJQUFzQyxhQUF0QyxDQUREO0NBQUEsTUFBQTtBQUlDLEVBQUEsSUFBSSxDQUFDLEVBQUwsR0FBYyxJQUFBLEdBQUEsQ0FBSSxPQUFKLENBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFSLENBQUEsQ0FEQSxDQUpEO0NBakJBOzs7OztBQ0FBLElBQUEsbUNBQUE7RUFBQSxrRkFBQTs7QUFBQSxPQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FBZixDQUFBOztBQUFBLE9BQ0EsR0FBZSxPQUFBLENBQVEsV0FBUixD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O2lCQUZSLENBQUE7V0FPQSxNQVRVO0VBQUEsQ0E3SVgsQ0FBQTs7QUFBQSwwQkF3SkEsRUFBQSxHQUFLLFNBQUEsR0FBQTtBQUVKLFdBQU8sTUFBTSxDQUFDLEVBQWQsQ0FGSTtFQUFBLENBeEpMLENBQUE7O3VCQUFBOztJQU5ELENBQUE7O0FBQUEsTUFrS00sQ0FBQyxPQUFQLEdBQWlCLGFBbEtqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xuXG4jIFBST0RVQ1RJT04gRU5WSVJPTk1FTlQgLSBtYXkgd2FudCB0byB1c2Ugc2VydmVyLXNldCB2YXJpYWJsZXMgaGVyZVxuIyBJU19MSVZFID0gZG8gLT4gcmV0dXJuIGlmIHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID4gLTEgb3Igd2luZG93LmxvY2F0aW9uLnNlYXJjaCBpcyAnP2QnIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cbiMjI1xuXG5XSVAgLSB0aGlzIHdpbGwgaWRlYWxseSBjaGFuZ2UgdG8gb2xkIGZvcm1hdCAoYWJvdmUpIHdoZW4gY2FuIGZpZ3VyZSBpdCBvdXRcblxuIyMjXG5cbklTX0xJVkUgICAgPSBmYWxzZVxuSVNfUFJFVklFVyA9IC9wcmV2aWV3PXRydWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLnNlYXJjaClcblxuIyBPTkxZIEVYUE9TRSBBUFAgR0xPQkFMTFkgSUYgTE9DQUwgT1IgREVWJ0lOR1xudmlldyA9IGlmIElTX0xJVkUgdGhlbiB7fSBlbHNlICh3aW5kb3cgb3IgZG9jdW1lbnQpXG5cbmlmIElTX1BSRVZJRVdcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIElTX1BSRVZJRVcnXG5lbHNlXG5cdCMgREVDTEFSRSBNQUlOIEFQUExJQ0FUSU9OXG5cdHZpZXcuTkMgPSBuZXcgQXBwIElTX0xJVkVcblx0dmlldy5OQy5pbml0KClcbiIsIkFwcERhdGEgICAgICA9IHJlcXVpcmUgJy4vQXBwRGF0YSdcbkFwcFZpZXcgICAgICA9IHJlcXVpcmUgJy4vQXBwVmlldydcbk1lZGlhUXVlcmllcyA9IHJlcXVpcmUgJy4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuXG5jbGFzcyBBcHBcblxuICAgIExJVkUgICAgICAgICAgICA6IG51bGxcbiAgICBCQVNFX1BBVEggICAgICAgOiB3aW5kb3cuY29uZmlnLmJhc2VfcGF0aFxuICAgIEJBU0VfVVJMICAgICAgICA6IHdpbmRvdy5jb25maWcuYmFzZV91cmxcbiAgICBCQVNFX1VSTF9BU1NFVFMgOiB3aW5kb3cuY29uZmlnLmJhc2VfdXJsX2Fzc2V0c1xuICAgIG9ialJlYWR5ICAgICAgICA6IDBcblxuICAgIF90b0NsZWFuICAgOiBbJ29ialJlYWR5JywgJ3NldEZsYWdzJywgJ29iamVjdENvbXBsZXRlJywgJ2luaXQnLCAnaW5pdE9iamVjdHMnLCAnaW5pdFNES3MnLCAnaW5pdEFwcCcsICdnbycsICdjbGVhbnVwJywgJ190b0NsZWFuJ11cblxuICAgIGNvbnN0cnVjdG9yIDogKEBMSVZFKSAtPlxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICBzZXRGbGFncyA6ID0+XG5cbiAgICAgICAgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgTWVkaWFRdWVyaWVzLnNldHVwKCk7XG5cbiAgICAgICAgIyBASVNfQU5EUk9JRCAgICA9IHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA+IC0xXG4gICAgICAgICMgQElTX0ZJUkVGT1ggICAgPSB1YS5pbmRleE9mKCdmaXJlZm94JykgPiAtMVxuICAgICAgICAjIEBJU19DSFJPTUVfSU9TID0gaWYgdWEubWF0Y2goJ2NyaW9zJykgdGhlbiB0cnVlIGVsc2UgZmFsc2UgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzgwODA1M1xuXG4gICAgICAgIG51bGxcblxuICAgIG9iamVjdENvbXBsZXRlIDogPT5cblxuICAgICAgICBAb2JqUmVhZHkrK1xuICAgICAgICBAaW5pdEFwcCgpIGlmIEBvYmpSZWFkeSA+PSAxXG5cbiAgICAgICAgbnVsbFxuXG4gICAgaW5pdCA6ID0+XG5cbiAgICAgICAgIyBjdXJyZW50bHkgbm8gb2JqZWN0cyB0byBsb2FkIGhlcmUsIHNvIGp1c3Qgc3RhcnQgYXBwXG4gICAgICAgICMgQGluaXRPYmplY3RzKClcblxuICAgICAgICBAaW5pdEFwcCgpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0T2JqZWN0cyA6ID0+XG5cbiAgICAjICAgICBAdGVtcGxhdGVzID0gbmV3IFRlbXBsYXRlcyBcIiN7QEJBU0VfVVJMX0FTU0VUU30vZGF0YS90ZW1wbGF0ZXMjeyhpZiBATElWRSB0aGVuICcubWluJyBlbHNlICcnKX0ueG1sXCIsIEBvYmplY3RDb21wbGV0ZVxuXG4gICAgIyAgICAgIyBpZiBuZXcgb2JqZWN0cyBhcmUgYWRkZWQgZG9uJ3QgZm9yZ2V0IHRvIGNoYW5nZSB0aGUgYEBvYmplY3RDb21wbGV0ZWAgZnVuY3Rpb25cblxuICAgICMgICAgIG51bGxcblxuICAgIGluaXRBcHAgOiA9PlxuXG4gICAgICAgIEBzZXRGbGFncygpXG5cbiAgICAgICAgIyMjIFN0YXJ0cyBhcHBsaWNhdGlvbiAjIyNcbiAgICAgICAgQGFwcERhdGEgPSBuZXcgQXBwRGF0YVxuICAgICAgICBAYXBwVmlldyA9IG5ldyBBcHBWaWV3XG5cbiAgICAgICAgQGdvKClcblxuICAgICAgICBudWxsXG5cbiAgICBnbyA6ID0+XG5cbiAgICAgICAgIyMjIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBraWNrcyBvZmYgd2Vic2l0ZSAjIyNcbiAgICAgICAgQGFwcFZpZXcucmVuZGVyKClcblxuICAgICAgICAjIyMgcmVtb3ZlIHJlZHVuZGFudCBpbml0aWFsaXNhdGlvbiBtZXRob2RzIC8gcHJvcGVydGllcyAjIyNcbiAgICAgICAgQGNsZWFudXAoKVxuXG4gICAgICAgIG51bGxcblxuICAgIGNsZWFudXAgOiA9PlxuXG4gICAgICAgIGZvciBmbiBpbiBAX3RvQ2xlYW5cbiAgICAgICAgICAgIEBbZm5dID0gbnVsbFxuICAgICAgICAgICAgZGVsZXRlIEBbZm5dXG5cbiAgICAgICAgbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiQWJzdHJhY3REYXRhID0gcmVxdWlyZSAnLi9kYXRhL0Fic3RyYWN0RGF0YSdcblxuY2xhc3MgQXBwRGF0YSBleHRlbmRzIEFic3RyYWN0RGF0YVxuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcERhdGFcbiIsIkFic3RyYWN0VmlldyAgPSByZXF1aXJlICcuL3ZpZXcvQWJzdHJhY3RWaWV3J1xuTWVkaWFRdWVyaWVzICA9IHJlcXVpcmUgJy4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuSW50ZXJhY3RpdmVCZyA9IHJlcXVpcmUgJy4vdmlldy9pbnRlcmFjdGl2ZS9JbnRlcmFjdGl2ZUJnJ1xuXG5jbGFzcyBBcHBWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cbiAgICB0ZW1wbGF0ZSA6ICdtYWluJ1xuXG4gICAgJHdpbmRvdyAgOiBudWxsXG4gICAgJGJvZHkgICAgOiBudWxsXG5cbiAgICB3cmFwcGVyICA6IG51bGxcblxuICAgIGRpbXMgOlxuICAgICAgICB3IDogbnVsbFxuICAgICAgICBoIDogbnVsbFxuICAgICAgICBvIDogbnVsbFxuICAgICAgICBjIDogbnVsbFxuICAgICAgICByIDogbnVsbFxuXG4gICAgcndkU2l6ZXMgOlxuICAgICAgICBMQVJHRSAgOiAnTFJHJ1xuICAgICAgICBNRURJVU0gOiAnTUVEJ1xuICAgICAgICBTTUFMTCAgOiAnU01MJ1xuXG4gICAgbGFzdFNjcm9sbFkgOiAwXG4gICAgdGlja2luZyAgICAgOiBmYWxzZVxuXG4gICAgRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMgOiAnRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMnXG4gICAgRVZFTlRfT05fU0NST0xMICAgICAgICAgOiAnRVZFTlRfT05fU0NST0xMJ1xuXG4gICAgTU9CSUxFX1dJRFRIIDogNzAwXG4gICAgTU9CSUxFICAgICAgIDogJ21vYmlsZSdcbiAgICBOT05fTU9CSUxFICAgOiAnbm9uX21vYmlsZSdcblxuICAgIGNvbnN0cnVjdG9yIDogLT5cblxuICAgICAgICBAJHdpbmRvdyA9ICQod2luZG93KVxuICAgICAgICBAJGJvZHkgICA9ICQoJ2JvZHknKS5lcSgwKVxuXG4gICAgICAgICMgdGhlc2UsIHJhdGhlciB0aGFuIGNhbGxpbmcgc3VwZXJcbiAgICAgICAgQHNldEVsZW1lbnQgQCRib2R5LmZpbmQoXCJbZGF0YS10ZW1wbGF0ZT1cXFwiI3tAdGVtcGxhdGV9XFxcIl1cIilcbiAgICAgICAgQGNoaWxkcmVuID0gW11cblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgZGlzYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9uICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIGVuYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9mZiAndG91Y2htb3ZlJywgQG9uVG91Y2hNb3ZlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblRvdWNoTW92ZTogKCBlICkgLT5cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlbmRlciA6ID0+XG5cbiAgICAgICAgQGJpbmRFdmVudHMoKVxuXG4gICAgICAgIEBpbnRlcmFjdGl2ZUJnID0gbmV3IEludGVyYWN0aXZlQmdcblxuICAgICAgICBAYWRkQ2hpbGQgQGludGVyYWN0aXZlQmdcblxuICAgICAgICBAb25BbGxSZW5kZXJlZCgpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBiaW5kRXZlbnRzIDogPT5cblxuICAgICAgICBAb24gJ2FsbFJlbmRlcmVkJywgQG9uQWxsUmVuZGVyZWRcblxuICAgICAgICBAb25SZXNpemUoKVxuXG4gICAgICAgIEBvblJlc2l6ZSA9IF8uZGVib3VuY2UgQG9uUmVzaXplLCAzMDBcbiAgICAgICAgQCR3aW5kb3cub24gJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIEBvblJlc2l6ZVxuICAgICAgICBAJHdpbmRvdy5vbiBcInNjcm9sbFwiLCBAb25TY3JvbGxcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uU2Nyb2xsIDogPT5cblxuICAgICAgICBAbGFzdFNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWVxuICAgICAgICBAcmVxdWVzdFRpY2soKVxuXG4gICAgICAgIG51bGxcblxuICAgIHJlcXVlc3RUaWNrIDogPT5cblxuICAgICAgICBpZiAhQHRpY2tpbmdcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSBAc2Nyb2xsVXBkYXRlXG4gICAgICAgICAgICBAdGlja2luZyA9IHRydWVcblxuICAgICAgICBudWxsXG5cbiAgICBzY3JvbGxVcGRhdGUgOiA9PlxuXG4gICAgICAgIEB0aWNraW5nID0gZmFsc2VcblxuICAgICAgICBAJGJvZHkuYWRkQ2xhc3MoJ2Rpc2FibGUtaG92ZXInKVxuXG4gICAgICAgIGNsZWFyVGltZW91dCBAdGltZXJTY3JvbGxcblxuICAgICAgICBAdGltZXJTY3JvbGwgPSBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICBAJGJvZHkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGUtaG92ZXInKVxuICAgICAgICAsIDUwXG5cbiAgICAgICAgQHRyaWdnZXIgQXBwVmlldy5FVkVOVF9PTl9TQ1JPTExcblxuICAgICAgICBudWxsXG5cbiAgICBvbkFsbFJlbmRlcmVkIDogPT5cblxuICAgICAgICAjIGNvbnNvbGUubG9nIFwib25BbGxSZW5kZXJlZCA6ID0+XCJcbiAgICAgICAgQGJlZ2luKClcblxuICAgICAgICBudWxsXG5cbiAgICBiZWdpbiA6ID0+XG5cbiAgICAgICAgQHRyaWdnZXIgJ3N0YXJ0J1xuXG4gICAgICAgIEBvblNjcm9sbCgpXG4gICAgICAgIEBpbnRlcmFjdGl2ZUJnLnNob3coKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25SZXNpemUgOiA9PlxuXG4gICAgICAgIEBnZXREaW1zKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGdldERpbXMgOiA9PlxuXG4gICAgICAgIHcgPSB3aW5kb3cuaW5uZXJXaWR0aCBvciBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggb3IgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxuICAgICAgICBoID0gd2luZG93LmlubmVySGVpZ2h0IG9yIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgb3IgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHRcblxuICAgICAgICBAZGltcyA9XG4gICAgICAgICAgICB3IDogd1xuICAgICAgICAgICAgaCA6IGhcbiAgICAgICAgICAgIG8gOiBpZiBoID4gdyB0aGVuICdwb3J0cmFpdCcgZWxzZSAnbGFuZHNjYXBlJ1xuICAgICAgICAgICAgYyA6IGlmIHcgPD0gQE1PQklMRV9XSURUSCB0aGVuIEBNT0JJTEUgZWxzZSBATk9OX01PQklMRVxuICAgICAgICAgICAgciA6IEBnZXRSd2RTaXplIHcsIGgsICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyBvciAxKVxuXG4gICAgICAgIEB0cmlnZ2VyIEBFVkVOVF9VUERBVEVfRElNRU5TSU9OUywgQGRpbXNcblxuICAgICAgICByZXR1cm5cblxuICAgIGdldFJ3ZFNpemUgOiAodywgaCwgZHByKSA9PlxuXG4gICAgICAgIHB3ID0gdypkcHJcblxuICAgICAgICBzaXplID0gc3dpdGNoIHRydWVcbiAgICAgICAgICAgIHdoZW4gcHcgPiAxNDQwIHRoZW4gQHJ3ZFNpemVzLkxBUkdFXG4gICAgICAgICAgICB3aGVuIHB3IDwgNjUwIHRoZW4gQHJ3ZFNpemVzLlNNQUxMXG4gICAgICAgICAgICBlbHNlIEByd2RTaXplcy5NRURJVU1cblxuICAgICAgICBzaXplXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwVmlld1xuIiwiY2xhc3MgQWJzdHJhY3REYXRhXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0Xy5leHRlbmQgQCwgQmFja2JvbmUuRXZlbnRzXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdERhdGFcbiIsIiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBNZWRpYSBRdWVyaWVzIE1hbmFnZXIgXG4jICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgXG4jICAgQGF1dGhvciA6IEbDoWJpbyBBemV2ZWRvIDxmYWJpby5hemV2ZWRvQHVuaXQ5LmNvbT4gVU5JVDlcbiMgICBAZGF0ZSAgIDogU2VwdGVtYmVyIDE0XG4jICAgXG4jICAgSW5zdHJ1Y3Rpb25zIGFyZSBvbiAvcHJvamVjdC9zYXNzL3V0aWxzL19yZXNwb25zaXZlLnNjc3MuXG5cbmNsYXNzIE1lZGlhUXVlcmllc1xuXG4gICAgIyBCcmVha3BvaW50c1xuICAgIEBTTUFMTEVTVCAgICA6IFwic21hbGxlc3RcIlxuICAgIEBTTUFMTCAgICAgICA6IFwic21hbGxcIlxuICAgIEBJUEFEICAgICAgICA6IFwiaXBhZFwiXG4gICAgQE1FRElVTSAgICAgIDogXCJtZWRpdW1cIlxuICAgIEBMQVJHRSAgICAgICA6IFwibGFyZ2VcIlxuICAgIEBFWFRSQV9MQVJHRSA6IFwiZXh0cmEtbGFyZ2VcIlxuXG4gICAgQHNldHVwIDogPT5cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVCA9IHtuYW1lOiBcIlNtYWxsZXN0XCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNUXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlQgICAgPSB7bmFtZTogXCJTbWFsbFwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5TTUFMTEVTVCwgTWVkaWFRdWVyaWVzLlNNQUxMXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLk1FRElVTV9CUkVBS1BPSU5UICAgPSB7bmFtZTogXCJNZWRpdW1cIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuTUVESVVNXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlQgICAgPSB7bmFtZTogXCJMYXJnZVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5JUEFELCBNZWRpYVF1ZXJpZXMuTEFSR0UsIE1lZGlhUXVlcmllcy5FWFRSQV9MQVJHRV19XG5cbiAgICAgICAgTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTID0gW1xuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMRVNUX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTF9CUkVBS1BPSU5UXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5MQVJHRV9CUkVBS1BPSU5UXG4gICAgICAgIF1cbiAgICAgICAgcmV0dXJuXG5cbiAgICBAZ2V0RGV2aWNlU3RhdGUgOiA9PlxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5LCBcImFmdGVyXCIpLmdldFByb3BlcnR5VmFsdWUoXCJjb250ZW50XCIpO1xuXG4gICAgQGdldEJyZWFrcG9pbnQgOiA9PlxuXG4gICAgICAgIHN0YXRlID0gTWVkaWFRdWVyaWVzLmdldERldmljZVN0YXRlKClcblxuICAgICAgICBmb3IgaSBpbiBbMC4uLk1lZGlhUXVlcmllcy5CUkVBS1BPSU5UUy5sZW5ndGhdXG4gICAgICAgICAgICBpZiBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFNbaV0uYnJlYWtwb2ludHMuaW5kZXhPZihzdGF0ZSkgPiAtMVxuICAgICAgICAgICAgICAgIHJldHVybiBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFNbaV0ubmFtZVxuXG4gICAgICAgIHJldHVybiBcIlwiXG5cbiAgICBAaXNCcmVha3BvaW50IDogKGJyZWFrcG9pbnQpID0+XG5cbiAgICAgICAgZm9yIGkgaW4gWzAuLi5icmVha3BvaW50LmJyZWFrcG9pbnRzLmxlbmd0aF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgYnJlYWtwb2ludC5icmVha3BvaW50c1tpXSA9PSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gTWVkaWFRdWVyaWVzXG4iLCJjbGFzcyBOdW1iZXJVdGlsc1xuXG4gICAgQE1BVEhfQ09TOiBNYXRoLmNvcyBcbiAgICBATUFUSF9TSU46IE1hdGguc2luIFxuICAgIEBNQVRIX1JBTkRPTTogTWF0aC5yYW5kb20gXG4gICAgQE1BVEhfQUJTOiBNYXRoLmFic1xuICAgIEBNQVRIX0FUQU4yOiBNYXRoLmF0YW4yXG5cbiAgICBAbGltaXQ6KG51bWJlciwgbWluLCBtYXgpLT5cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKCBNYXRoLm1heChtaW4sbnVtYmVyKSwgbWF4IClcblxuICAgIEBtYXAgOiAobnVtLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCByb3VuZCA9IGZhbHNlLCBjb25zdHJhaW5NaW4gPSB0cnVlLCBjb25zdHJhaW5NYXggPSB0cnVlKSAtPlxuICAgICAgICAgICAgaWYgY29uc3RyYWluTWluIGFuZCBudW0gPCBtaW4xIHRoZW4gcmV0dXJuIG1pbjJcbiAgICAgICAgICAgIGlmIGNvbnN0cmFpbk1heCBhbmQgbnVtID4gbWF4MSB0aGVuIHJldHVybiBtYXgyXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG51bTEgPSAobnVtIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpXG4gICAgICAgICAgICBudW0yID0gKG51bTEgKiAobWF4MiAtIG1pbjIpKSArIG1pbjJcbiAgICAgICAgICAgIGlmIHJvdW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtMilcbiAgICAgICAgICAgIHJldHVybiBudW0yXG5cbiAgICBAZ2V0UmFuZG9tQ29sb3I6IC0+XG5cbiAgICAgICAgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJylcbiAgICAgICAgY29sb3IgPSAnIydcbiAgICAgICAgZm9yIGkgaW4gWzAuLi42XVxuICAgICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxNSldXG4gICAgICAgIGNvbG9yXG5cbiAgICBAZ2V0UmFuZG9tRmxvYXQgOiAobWluLCBtYXgpIC0+XG5cbiAgICAgICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXG5cbiAgICBAZ2V0VGltZVN0YW1wRGlmZiA6IChkYXRlMSwgZGF0ZTIpIC0+XG5cbiAgICAgICAgIyBHZXQgMSBkYXkgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgIG9uZV9kYXkgPSAxMDAwKjYwKjYwKjI0XG4gICAgICAgIHRpbWUgICAgPSB7fVxuXG4gICAgICAgICMgQ29udmVydCBib3RoIGRhdGVzIHRvIG1pbGxpc2Vjb25kc1xuICAgICAgICBkYXRlMV9tcyA9IGRhdGUxLmdldFRpbWUoKVxuICAgICAgICBkYXRlMl9tcyA9IGRhdGUyLmdldFRpbWUoKVxuXG4gICAgICAgICMgQ2FsY3VsYXRlIHRoZSBkaWZmZXJlbmNlIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGF0ZTJfbXMgLSBkYXRlMV9tc1xuXG4gICAgICAgICMgdGFrZSBvdXQgbWlsbGlzZWNvbmRzXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkaWZmZXJlbmNlX21zLzEwMDBcbiAgICAgICAgdGltZS5zZWNvbmRzICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcyAlIDYwKVxuXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkaWZmZXJlbmNlX21zLzYwIFxuICAgICAgICB0aW1lLm1pbnV0ZXMgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zICUgNjApXG5cbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvNjAgXG4gICAgICAgIHRpbWUuaG91cnMgICAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMgJSAyNCkgIFxuXG4gICAgICAgIHRpbWUuZGF5cyAgICAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMvMjQpXG5cbiAgICAgICAgdGltZVxuXG4gICAgQG1hcDogKCBudW0sIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIHJvdW5kID0gZmFsc2UsIGNvbnN0cmFpbk1pbiA9IHRydWUsIGNvbnN0cmFpbk1heCA9IHRydWUgKSAtPlxuICAgICAgICBpZiBjb25zdHJhaW5NaW4gYW5kIG51bSA8IG1pbjEgdGhlbiByZXR1cm4gbWluMlxuICAgICAgICBpZiBjb25zdHJhaW5NYXggYW5kIG51bSA+IG1heDEgdGhlbiByZXR1cm4gbWF4MlxuICAgICAgICBcbiAgICAgICAgbnVtMSA9IChudW0gLSBtaW4xKSAvIChtYXgxIC0gbWluMSlcbiAgICAgICAgbnVtMiA9IChudW0xICogKG1heDIgLSBtaW4yKSkgKyBtaW4yXG4gICAgICAgIGlmIHJvdW5kIHRoZW4gcmV0dXJuIE1hdGgucm91bmQobnVtMilcblxuICAgICAgICByZXR1cm4gbnVtMlxuXG4gICAgQHRvUmFkaWFuczogKCBkZWdyZWUgKSAtPlxuICAgICAgICByZXR1cm4gZGVncmVlICogKCBNYXRoLlBJIC8gMTgwIClcblxuICAgIEB0b0RlZ3JlZTogKCByYWRpYW5zICkgLT5cbiAgICAgICAgcmV0dXJuIHJhZGlhbnMgKiAoIDE4MCAvIE1hdGguUEkgKVxuXG4gICAgQGlzSW5SYW5nZTogKCBudW0sIG1pbiwgbWF4LCBjYW5CZUVxdWFsICkgLT5cbiAgICAgICAgaWYgY2FuQmVFcXVhbCB0aGVuIHJldHVybiBudW0gPj0gbWluICYmIG51bSA8PSBtYXhcbiAgICAgICAgZWxzZSByZXR1cm4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4XG5cbiAgICAjIGNvbnZlcnQgbWV0cmVzIGluIHRvIG0gLyBLTVxuICAgIEBnZXROaWNlRGlzdGFuY2U6IChtZXRyZXMpID0+XG5cbiAgICAgICAgaWYgbWV0cmVzIDwgMTAwMFxuXG4gICAgICAgICAgICByZXR1cm4gXCIje01hdGgucm91bmQobWV0cmVzKX1NXCJcblxuICAgICAgICBlbHNlXG5cbiAgICAgICAgICAgIGttID0gKG1ldHJlcy8xMDAwKS50b0ZpeGVkKDIpXG4gICAgICAgICAgICByZXR1cm4gXCIje2ttfUtNXCJcblxuICAgIEBzaHVmZmxlIDogKG8pID0+XG4gICAgICAgIGBmb3IodmFyIGosIHgsIGkgPSBvLmxlbmd0aDsgaTsgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpLCB4ID0gb1stLWldLCBvW2ldID0gb1tqXSwgb1tqXSA9IHgpO2BcbiAgICAgICAgcmV0dXJuIG9cblxuICAgIEByYW5kb21SYW5nZSA6IChtaW4sbWF4KSA9PlxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihtYXgtbWluKzEpK21pbilcblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXJVdGlsc1xuIiwiY2xhc3MgQWJzdHJhY3RWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlld1xuXG5cdGVsICAgICAgICAgICA6IG51bGxcblx0aWQgICAgICAgICAgIDogbnVsbFxuXHRjaGlsZHJlbiAgICAgOiBudWxsXG5cdHRlbXBsYXRlICAgICA6IG51bGxcblx0dGVtcGxhdGVWYXJzIDogbnVsbFxuXG5cdCMgY296IG9uIHBhZ2UgbG9hZCB3ZSBhbHJlYWR5IGhhdmUgdGhlIERPTSBmb3IgYSBwYWdlLCBpdCB3aWxsIGdldCBpbml0aWFsaXNlZCB0d2ljZSAtIG9uY2Ugb24gY29uc3RydWN0aW9uLCBhbmQgb25jZSB3aGVuIHBhZ2UgaGFzIFwibG9hZGVkXCJcblx0aW5pdGlhbGl6ZWQgOiBmYWxzZVxuXHRcblx0aW5pdGlhbGl6ZSA6IChmb3JjZSkgLT5cblxuXHRcdHJldHVybiB1bmxlc3MgIUBpbml0aWFsaXplZCBvciBmb3JjZVxuXHRcdFxuXHRcdEBjaGlsZHJlbiA9IFtdXG5cblx0XHRpZiBAdGVtcGxhdGVcblx0XHRcdCR0bXBsID0gQE5DKCkuYXBwVmlldy4kZWwuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuXHRcdFx0QHNldEVsZW1lbnQgJHRtcGxcblx0XHRcdHJldHVybiB1bmxlc3MgJHRtcGwubGVuZ3RoXG5cblx0XHRAJGVsLmF0dHIgJ2lkJywgQGlkIGlmIEBpZFxuXHRcdEAkZWwuYWRkQ2xhc3MgQGNsYXNzTmFtZSBpZiBAY2xhc3NOYW1lXG5cdFx0XG5cdFx0QGluaXRpYWxpemVkID0gdHJ1ZVxuXHRcdEBpbml0KClcblxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXG5cdFx0bnVsbFxuXG5cdGluaXQgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZSA6ID0+XG5cblx0XHRudWxsXG5cblx0cmVuZGVyIDogPT5cblxuXHRcdG51bGxcblxuXHRhZGRDaGlsZCA6IChjaGlsZCwgcHJlcGVuZCA9IGZhbHNlKSA9PlxuXG5cdFx0QGNoaWxkcmVuLnB1c2ggY2hpbGQgaWYgY2hpbGQuZWxcblxuXHRcdEBcblxuXHRyZXBsYWNlIDogKGRvbSwgY2hpbGQpID0+XG5cblx0XHRAY2hpbGRyZW4ucHVzaCBjaGlsZCBpZiBjaGlsZC5lbFxuXHRcdGMgPSBpZiBjaGlsZC5lbCB0aGVuIGNoaWxkLiRlbCBlbHNlIGNoaWxkXG5cdFx0QCRlbC5jaGlsZHJlbihkb20pLnJlcGxhY2VXaXRoKGMpXG5cblx0XHRudWxsXG5cblx0cmVtb3ZlIDogKGNoaWxkKSA9PlxuXG5cdFx0dW5sZXNzIGNoaWxkP1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0YyA9IGlmIGNoaWxkLmVsIHRoZW4gY2hpbGQuJGVsIGVsc2UgJChjaGlsZClcblx0XHRjaGlsZC5kaXNwb3NlKCkgaWYgYyBhbmQgY2hpbGQuZGlzcG9zZVxuXG5cdFx0aWYgYyAmJiBAY2hpbGRyZW4uaW5kZXhPZihjaGlsZCkgIT0gLTFcblx0XHRcdEBjaGlsZHJlbi5zcGxpY2UoIEBjaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSApXG5cblx0XHRjLnJlbW92ZSgpXG5cblx0XHRudWxsXG5cblx0b25SZXNpemUgOiAoZXZlbnQpID0+XG5cblx0XHQoaWYgY2hpbGQub25SZXNpemUgdGhlbiBjaGlsZC5vblJlc2l6ZSgpKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0bW91c2VFbmFibGVkIDogKCBlbmFibGVkICkgPT5cblxuXHRcdEAkZWwuY3NzXG5cdFx0XHRcInBvaW50ZXItZXZlbnRzXCI6IGlmIGVuYWJsZWQgdGhlbiBcImF1dG9cIiBlbHNlIFwibm9uZVwiXG5cblx0XHRudWxsXG5cblx0Q1NTVHJhbnNsYXRlIDogKHgsIHksIHZhbHVlPSclJywgc2NhbGUpID0+XG5cblx0XHRpZiBNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZTNkKCN7eCt2YWx1ZX0sICN7eSt2YWx1ZX0sIDApXCJcblx0XHRlbHNlXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZSgje3grdmFsdWV9LCAje3krdmFsdWV9KVwiXG5cblx0XHRpZiBzY2FsZSB0aGVuIHN0ciA9IFwiI3tzdHJ9IHNjYWxlKCN7c2NhbGV9KVwiXG5cblx0XHRzdHJcblxuXHR1bk11dGVBbGwgOiA9PlxuXG5cdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC51bk11dGU/KClcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0Y2hpbGQudW5NdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRtdXRlQWxsIDogPT5cblxuXHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQubXV0ZT8oKVxuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRjaGlsZC5tdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRyZW1vdmVBbGxDaGlsZHJlbjogPT5cblxuXHRcdEByZW1vdmUgY2hpbGQgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHRyaWdnZXJDaGlsZHJlbiA6IChtc2csIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC50cmlnZ2VyIG1zZ1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAdHJpZ2dlckNoaWxkcmVuIG1zZywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW4gOiAobWV0aG9kLCBwYXJhbXMsIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZFttZXRob2RdPyBwYXJhbXNcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QGNhbGxDaGlsZHJlbiBtZXRob2QsIHBhcmFtcywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW5BbmRTZWxmIDogKG1ldGhvZCwgcGFyYW1zLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRAW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAY2FsbENoaWxkcmVuIG1ldGhvZCwgcGFyYW1zLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHN1cHBsYW50U3RyaW5nIDogKHN0ciwgdmFscykgLT5cblxuXHRcdHJldHVybiBzdHIucmVwbGFjZSAve3sgKFtee31dKikgfX0vZywgKGEsIGIpIC0+XG5cdFx0XHRyID0gdmFsc1tiXVxuXHRcdFx0KGlmIHR5cGVvZiByIGlzIFwic3RyaW5nXCIgb3IgdHlwZW9mIHIgaXMgXCJudW1iZXJcIiB0aGVuIHIgZWxzZSBhKVxuXG5cdGRpc3Bvc2UgOiA9PlxuXG5cdFx0QHN0b3BMaXN0ZW5pbmcoKVxuXG5cdFx0bnVsbFxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFZpZXdcbiIsIkFic3RyYWN0VmlldyAgICAgICAgICA9IHJlcXVpcmUgJy4uL0Fic3RyYWN0VmlldydcbkFic3RyYWN0U2hhcGUgICAgICAgICA9IHJlcXVpcmUgJy4vc2hhcGVzL0Fic3RyYWN0U2hhcGUnXG5OdW1iZXJVdGlscyAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi91dGlscy9OdW1iZXJVdGlscydcbkludGVyYWN0aXZlQmdDb25maWcgICA9IHJlcXVpcmUgJy4vSW50ZXJhY3RpdmVCZ0NvbmZpZydcbkludGVyYWN0aXZlU2hhcGVDYWNoZSA9IHJlcXVpcmUgJy4vSW50ZXJhY3RpdmVTaGFwZUNhY2hlJ1xuXG5jbGFzcyBJbnRlcmFjdGl2ZUJnIGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cblx0dGVtcGxhdGUgOiAnaW50ZXJhY3RpdmUtYmFja2dyb3VuZCdcblxuXHRzdGFnZSAgICA6IG51bGxcblx0cmVuZGVyZXIgOiBudWxsXG5cdGxheWVycyAgIDoge31cblx0XG5cdHcgOiAwXG5cdGggOiAwXG5cblx0Y291bnRlciA6IG51bGxcblxuXHRtb3VzZSA6XG5cdFx0ZW5hYmxlZCA6IGZhbHNlXG5cdFx0cG9zICAgICA6IG51bGxcblxuXHRFVkVOVF9LSUxMX1NIQVBFIDogJ0VWRU5UX0tJTExfU0hBUEUnXG5cblx0ZmlsdGVycyA6XG5cdFx0Ymx1ciAgOiBudWxsXG5cdFx0UkdCICAgOiBudWxsXG5cdFx0cGl4ZWwgOiBudWxsXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0QERFQlVHID0gdHJ1ZVxuXG5cdFx0c3VwZXJcblxuXHRcdHJldHVybiBudWxsXG5cblx0YWRkR3VpIDogPT5cblxuXHRcdEBndWkgICAgICAgID0gbmV3IGRhdC5HVUlcblx0XHRAZ3VpRm9sZGVycyA9IHt9XG5cblx0XHQjIEBndWkgPSBuZXcgZGF0LkdVSSBhdXRvUGxhY2UgOiBmYWxzZVxuXHRcdCMgQGd1aS5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuXHRcdCMgQGd1aS5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcxMHB4J1xuXHRcdCMgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAZ3VpLmRvbUVsZW1lbnRcblxuXHRcdEBndWlGb2xkZXJzLmdlbmVyYWxGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignR2VuZXJhbCcpXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnR0xPQkFMX1NQRUVEJywgMC41LCA1KS5uYW1lKFwiZ2xvYmFsIHNwZWVkXCIpXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnR0xPQkFMX0FMUEhBJywgMCwgMSkubmFtZShcImdsb2JhbCBhbHBoYVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMuc2l6ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdTaXplJylcblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcywgJ01JTl9XSURUSCcsIDUsIDIwMCkubmFtZSgnbWluIHdpZHRoJylcblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcywgJ01BWF9XSURUSCcsIDUsIDIwMCkubmFtZSgnbWF4IHdpZHRoJylcblxuXHRcdEBndWlGb2xkZXJzLmNvdW50Rm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ0NvdW50Jylcblx0XHRAZ3VpRm9sZGVycy5jb3VudEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnTUFYX1NIQVBFX0NPVU5UJywgNSwgMTAwMCkubmFtZSgnbWF4IHNoYXBlcycpXG5cblx0XHRAZ3VpRm9sZGVycy5zaGFwZXNGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignU2hhcGVzJylcblx0XHRmb3Igc2hhcGUsIGkgaW4gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZVR5cGVzXG5cdFx0XHRAZ3VpRm9sZGVycy5zaGFwZXNGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVUeXBlc1tpXSwgJ2FjdGl2ZScpLm5hbWUoc2hhcGUudHlwZSlcblxuXHRcdEBndWlGb2xkZXJzLmJsdXJGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQmx1cicpXG5cdFx0QGd1aUZvbGRlcnMuYmx1ckZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnYmx1cicpLm5hbWUoXCJlbmFibGVcIilcblx0XHRAZ3VpRm9sZGVycy5ibHVyRm9sZGVyLmFkZChAZmlsdGVycy5ibHVyLCAnYmx1cicsIDAsIDMyKS5uYW1lKFwiYmx1ciBhbW91bnRcIilcblxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdSR0IgU3BsaXQnKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnUkdCJykubmFtZShcImVuYWJsZVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwicmVkIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5yZWQudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcInJlZCB5XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuZ3JlZW4udmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImdyZWVuIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwiZ3JlZW4geVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImJsdWUgeFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcImJsdWUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignUGl4ZWxsYXRlJylcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAncGl4ZWwnKS5uYW1lKFwiZW5hYmxlXCIpXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIuYWRkKEBmaWx0ZXJzLnBpeGVsLnNpemUsICd4JywgMSwgMzIpLm5hbWUoXCJwaXhlbCBzaXplIHhcIilcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoQGZpbHRlcnMucGl4ZWwuc2l6ZSwgJ3knLCAxLCAzMikubmFtZShcInBpeGVsIHNpemUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdDb2xvdXIgcGFsZXR0ZScpXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZywgJ2FjdGl2ZVBhbGV0dGUnLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnBhbGV0dGVzKS5uYW1lKFwicGFsZXR0ZVwiKVxuXG5cdFx0bnVsbFxuXG5cdGFkZFN0YXRzIDogPT5cblxuXHRcdEBzdGF0cyA9IG5ldyBTdGF0c1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAc3RhdHMuZG9tRWxlbWVudFxuXG5cdFx0bnVsbFxuXG5cdGFkZFNoYXBlQ291bnRlciA6ID0+XG5cblx0XHRAc2hhcGVDb3VudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuXHRcdEBzaGFwZUNvdW50ZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cdFx0QHNoYXBlQ291bnRlci5zdHlsZS5sZWZ0ID0gJzEwMHB4J1xuXHRcdEBzaGFwZUNvdW50ZXIuc3R5bGUudG9wID0gJzE1cHgnXG5cdFx0QHNoYXBlQ291bnRlci5zdHlsZS5jb2xvciA9ICcjZmZmJ1xuXHRcdEBzaGFwZUNvdW50ZXIuc3R5bGUudGV4dFRyYW5zZm9ybSA9ICd1cHBlcmNhc2UnXG5cdFx0QHNoYXBlQ291bnRlci5pbm5lckhUTUwgPSBcIjAgc2hhcGVzXCJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBzaGFwZUNvdW50ZXJcblxuXHRcdG51bGxcblxuXHR1cGRhdGVTaGFwZUNvdW50ZXIgOiA9PlxuXG5cdFx0QHNoYXBlQ291bnRlci5pbm5lckhUTUwgPSBcIiN7QF9nZXRTaGFwZUNvdW50KCl9IHNoYXBlc1wiXG5cblx0XHRudWxsXG5cblx0Y3JlYXRlTGF5ZXJzIDogPT5cblxuXHRcdGZvciBsYXllciwgbmFtZSBvZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVyc1xuXHRcdFx0QGxheWVyc1tuYW1lXSA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXJcblx0XHRcdEBzdGFnZS5hZGRDaGlsZCBAbGF5ZXJzW25hbWVdXG5cblx0XHRudWxsXG5cblx0Y3JlYXRlU3RhZ2VGaWx0ZXJzIDogPT5cblxuXHRcdEBmaWx0ZXJzLmJsdXIgID0gbmV3IFBJWEkuQmx1ckZpbHRlclxuXHRcdEBmaWx0ZXJzLlJHQiAgID0gbmV3IFBJWEkuUkdCU3BsaXRGaWx0ZXJcblx0XHRAZmlsdGVycy5waXhlbCA9IG5ldyBQSVhJLlBpeGVsYXRlRmlsdGVyXG5cblx0XHRAZmlsdGVycy5ibHVyLmJsdXIgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLmJsdXIuZ2VuZXJhbFxuXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSAgID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IucmVkXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLmdyZWVuLnZhbHVlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IuZ3JlZW5cblx0XHRAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSAgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLlJHQi5ibHVlXG5cblx0XHRAZmlsdGVycy5waXhlbC51bmlmb3Jtcy5waXhlbFNpemUudmFsdWUgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLnBpeGVsLmFtb3VudFxuXG5cdFx0bnVsbFxuXG5cdGluaXQ6ID0+XG5cblx0XHRQSVhJLmRvbnRTYXlIZWxsbyA9IHRydWVcblxuXHRcdEBzZXREaW1zKClcblx0XHRAc2V0U3RyZWFtRGlyZWN0aW9uKClcblxuXHRcdEBzaGFwZXMgICA9IFtdXG5cdFx0QHN0YWdlICAgID0gbmV3IFBJWEkuU3RhZ2UgMHgxQTFBMUFcblx0XHRAcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlciBAdywgQGgsIGFudGlhbGlhcyA6IHRydWVcblx0XHRAcmVuZGVyKClcblxuXHRcdEludGVyYWN0aXZlU2hhcGVDYWNoZS5jcmVhdGVDYWNoZSgpXG5cblx0XHRAY3JlYXRlTGF5ZXJzKClcblx0XHRAY3JlYXRlU3RhZ2VGaWx0ZXJzKClcblxuXHRcdGlmIEBERUJVR1xuXHRcdFx0QGFkZEd1aSgpXG5cdFx0XHRAYWRkU3RhdHMoKVxuXHRcdFx0QGFkZFNoYXBlQ291bnRlcigpXG5cblx0XHRAJGVsLmFwcGVuZCBAcmVuZGVyZXIudmlld1xuXG5cdFx0QGRyYXcoKVxuXG5cdFx0bnVsbFxuXG5cdGRyYXcgOiA9PlxuXG5cdFx0QGNvdW50ZXIgPSAwXG5cblx0XHRAc2V0RGltcygpXG5cblx0XHRudWxsXG5cblx0c2hvdyA6ID0+XG5cblx0XHRAYmluZEV2ZW50cygpXG5cblx0XHRAYWRkU2hhcGVzIEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5JTklUSUFMX1NIQVBFX0NPVU5UXG5cdFx0QHVwZGF0ZSgpXG5cblx0XHRudWxsXG5cblx0YWRkU2hhcGVzIDogKGNvdW50KSA9PlxuXG5cdFx0Zm9yIGkgaW4gWzAuLi5jb3VudF1cblxuXHRcdFx0cG9zID0gQF9nZXRTaGFwZVN0YXJ0UG9zKClcblxuXHRcdFx0c2hhcGUgID0gbmV3IEFic3RyYWN0U2hhcGUgQFxuXHRcdFx0c3ByaXRlID0gc2hhcGUuZ2V0U3ByaXRlKClcblx0XHRcdGxheWVyICA9IHNoYXBlLmdldExheWVyKClcblxuXHRcdFx0c3ByaXRlLnBvc2l0aW9uLnggPSBzcHJpdGUuX3Bvc2l0aW9uLnggPSBwb3MueFxuXHRcdFx0c3ByaXRlLnBvc2l0aW9uLnkgPSBzcHJpdGUuX3Bvc2l0aW9uLnkgPSBwb3MueVxuXG5cdFx0XHRAbGF5ZXJzW2xheWVyXS5hZGRDaGlsZCBzcHJpdGVcblxuXHRcdFx0QHNoYXBlcy5wdXNoIHNoYXBlXG5cblx0XHRudWxsXG5cblx0X2dldFNoYXBlU3RhcnRQb3MgOiA9PlxuXG5cdFx0eCA9IChOdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBAdzMsIEB3KSArIChAdzMqMilcblx0XHR5ID0gKE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IDAsIChAaDMqMikpIC0gQGgzKjJcblxuXHRcdHJldHVybiB7eCwgeX1cblxuXHRfZ2V0U2hhcGVDb3VudCA6ID0+XG5cblx0XHRjb3VudCA9IDBcblx0XHQoY291bnQrPWRpc3BsYXlDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoKSBmb3IgbGF5ZXIsIGRpc3BsYXlDb250YWluZXIgb2YgQGxheWVyc1xuXG5cdFx0Y291bnRcblxuXHRyZW1vdmVTaGFwZSA6IChzaGFwZSkgPT5cblxuXHRcdGluZGV4ID0gQHNoYXBlcy5pbmRleE9mIHNoYXBlXG5cdFx0IyBAc2hhcGVzLnNwbGljZSBpbmRleCwgMVxuXHRcdEBzaGFwZXNbaW5kZXhdID0gbnVsbFxuXG5cdFx0bGF5ZXJQYXJlbnQgPSBAbGF5ZXJzW3NoYXBlLmdldExheWVyKCldXG5cdFx0bGF5ZXJQYXJlbnQucmVtb3ZlQ2hpbGQgc2hhcGUuc1xuXG5cdFx0aWYgQF9nZXRTaGFwZUNvdW50KCkgPCBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuTUFYX1NIQVBFX0NPVU5UIHRoZW4gQGFkZFNoYXBlcyAxXG5cblx0XHRudWxsXG5cblx0dXBkYXRlIDogPT5cblxuXHRcdGlmIHdpbmRvdy5TVE9QIHRoZW4gcmV0dXJuIHJlcXVlc3RBbmltRnJhbWUgQHVwZGF0ZVxuXG5cdFx0aWYgQERFQlVHIHRoZW4gQHN0YXRzLmJlZ2luKClcblxuXHRcdEBjb3VudGVyKytcblxuXHRcdGlmIChAY291bnRlciAlIDQgaXMgMCkgYW5kIChAX2dldFNoYXBlQ291bnQoKSA8IEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5NQVhfU0hBUEVfQ09VTlQpIHRoZW4gQGFkZFNoYXBlcyAxXG5cblx0XHRAdXBkYXRlU2hhcGVzKClcblx0XHRAcmVuZGVyKClcblxuXHRcdGZpbHRlcnNUb0FwcGx5ID0gW11cblx0XHQoZmlsdGVyc1RvQXBwbHkucHVzaCBAZmlsdGVyc1tmaWx0ZXJdIGlmIGVuYWJsZWQpIGZvciBmaWx0ZXIsIGVuYWJsZWQgb2YgSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzXG5cblx0XHRAc3RhZ2UuZmlsdGVycyA9IGlmIGZpbHRlcnNUb0FwcGx5Lmxlbmd0aCB0aGVuIGZpbHRlcnNUb0FwcGx5IGVsc2UgbnVsbFxuXG5cdFx0cmVxdWVzdEFuaW1GcmFtZSBAdXBkYXRlXG5cblx0XHRpZiBAREVCVUdcblx0XHRcdEB1cGRhdGVTaGFwZUNvdW50ZXIoKVxuXHRcdFx0QHN0YXRzLmVuZCgpXG5cblx0XHRudWxsXG5cblx0dXBkYXRlU2hhcGVzIDogPT5cblxuXHRcdChzaGFwZT8uY2FsbEFuaW1hdGUoKSkgZm9yIHNoYXBlIGluIEBzaGFwZXNcblxuXHRcdG51bGxcblxuXHRyZW5kZXIgOiA9PlxuXG5cdFx0QHJlbmRlcmVyLnJlbmRlciBAc3RhZ2UgXG5cblx0XHRudWxsXG5cblx0YmluZEV2ZW50cyA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3LiR3aW5kb3cub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuXG5cdFx0QE5DKCkuYXBwVmlldy5vbiBATkMoKS5hcHBWaWV3LkVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAc2V0RGltc1xuXHRcdEBvbiBARVZFTlRfS0lMTF9TSEFQRSwgQHJlbW92ZVNoYXBlXG5cblx0XHRudWxsXG5cblx0b25Nb3VzZU1vdmUgOiAoZSkgPT5cblxuXHRcdEBtb3VzZS5tdWx0aXBsaWVyID0gMVxuXHRcdEBtb3VzZS5wb3MgICAgICAgID0geCA6IGUucGFnZVgsIHkgOiBlLnBhZ2VZXG5cdFx0QG1vdXNlLmVuYWJsZWQgICAgPSB0cnVlXG5cblx0XHRudWxsXG5cblx0c2V0RGltcyA6ID0+XG5cblx0XHRAdyA9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0QGggPSBATkMoKS5hcHBWaWV3LmRpbXMuaFxuXG5cdFx0QHczID0gQHcvM1xuXHRcdEBoMyA9IEBoLzNcblxuXHRcdCMganVzdCB1c2Ugbm9uLXJlbGF0aXZlIHNpemVzIGZvciBub3dcblx0XHQjIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCA9IChJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fV0lEVEhfUEVSQy8xMDApKkBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0IyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEggPSAoSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIX1BFUkMvMTAwKSpATkMoKS5hcHBWaWV3LmRpbXMud1xuXG5cdFx0QHNldFN0cmVhbURpcmVjdGlvbigpXG5cblx0XHRAcmVuZGVyZXI/LnJlc2l6ZSBAdywgQGhcblxuXHRcdG51bGxcblxuXHRzZXRTdHJlYW1EaXJlY3Rpb24gOiA9PlxuXG5cdFx0aWYgQHcgPiBAaFxuXHRcdFx0eCA9IDFcblx0XHRcdHkgPSBAaCAvIEB3XG5cdFx0ZWxzZVxuXHRcdFx0eSA9IDFcblx0XHRcdHggPSBAdyAvIEBoXG5cblx0XHRJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuRElSRUNUSU9OX1JBVElPID0ge3gsIHl9XG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJhY3RpdmVCZ1xuIiwiY2xhc3MgSW50ZXJhY3RpdmVCZ0NvbmZpZ1xuXG5cdEBjb2xvcnMgOlxuXHRcdCMgaHR0cDovL2ZsYXR1aWNvbG9ycy5jb20vXG5cdFx0RkxBVCA6IFtcblx0XHRcdCcxOUI2OTgnLFxuXHRcdFx0JzJDQzM2QicsXG5cdFx0XHQnMkU4RUNFJyxcblx0XHRcdCc5QjUwQkEnLFxuXHRcdFx0J0U5OEIzOScsXG5cdFx0XHQnRUE2MTUzJyxcblx0XHRcdCdGMkNBMjcnXG5cdFx0XVxuXHRcdEJXIDogW1xuXHRcdFx0J0U4RThFOCcsXG5cdFx0XHQnRDFEMUQxJyxcblx0XHRcdCdCOUI5QjknLFxuXHRcdFx0J0EzQTNBMycsXG5cdFx0XHQnOEM4QzhDJyxcblx0XHRcdCc3Njc2NzYnLFxuXHRcdFx0JzVFNUU1RSdcblx0XHRdXG5cdFx0UkVEIDogW1xuXHRcdFx0J0FBMzkzOScsXG5cdFx0XHQnRDQ2QTZBJyxcblx0XHRcdCdGRkFBQUEnLFxuXHRcdFx0JzgwMTUxNScsXG5cdFx0XHQnNTUwMDAwJ1xuXHRcdF1cblx0XHQjIGh0dHA6Ly9wYWxldHRvbi5jb20vI3VpZD0xM3YwdTBrbnRTK2M2WFVpa1Z0c3ZQekRSS2Fcblx0XHRCTFVFIDogW1xuXHRcdFx0JzlGRDRGNicsXG5cdFx0XHQnNkVCQ0VGJyxcblx0XHRcdCc0OEE5RTgnLFxuXHRcdFx0JzI0OTVERScsXG5cdFx0XHQnMDk4MUNGJ1xuXHRcdF1cblx0XHQjIGh0dHA6Ly9wYWxldHRvbi5jb20vI3VpZD0xMlkwdTBrbFNMT2I1VlZoM1FZcW9HN3hTLVlcblx0XHRHUkVFTiA6IFtcblx0XHRcdCc5RkY0QzEnLFxuXHRcdFx0JzZERTk5RicsXG5cdFx0XHQnNDZERDgzJyxcblx0XHRcdCcyNUQwNkEnLFxuXHRcdFx0JzAwQzI0Ridcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTF3MHUwa25SdzBlNExFanJDRXRUdXR1WG45XG5cdFx0WUVMTE9XIDogW1xuXHRcdFx0J0ZGRUY4RicsXG5cdFx0XHQnRkZFOTY0Jyxcblx0XHRcdCdGRkU0NDEnLFxuXHRcdFx0J0YzRDMxMCcsXG5cdFx0XHQnQjhBMDA2J1xuXHRcdF1cblxuXHRAcGFsZXR0ZXMgICAgICA6ICdmbGF0JyA6ICdGTEFUJywgJ2ImdycgOiAnQlcnLCAncmVkJyA6ICdSRUQnLCAnYmx1ZScgOiAnQkxVRScsICdncmVlbicgOiAnR1JFRU4nLCAneWVsbG93JyA6ICdZRUxMT1cnXG5cdEBhY3RpdmVQYWxldHRlIDogJ0ZMQVQnXG5cblx0QHNoYXBlVHlwZXM6IFtcblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnQ2lyY2xlJ1xuXHRcdFx0YWN0aXZlIDogdHJ1ZVxuXHRcdH1cblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnU3F1YXJlJ1xuXHRcdFx0YWN0aXZlIDogdHJ1ZVxuXHRcdH1cblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnVHJpYW5nbGUnXG5cdFx0XHRhY3RpdmUgOiB0cnVlXG5cdFx0fVxuXHRdXG5cblx0QHNoYXBlcyA6XG5cdFx0TUlOX1dJRFRIX1BFUkMgOiAzXG5cdFx0TUFYX1dJRFRIX1BFUkMgOiA3XG5cblx0XHQjIHNldCB0aGlzIGRlcGVuZGluZyBvbiB2aWV3cG9ydCBzaXplXG5cdFx0TUlOX1dJRFRIIDogMzBcblx0XHRNQVhfV0lEVEggOiA3MFxuXG5cdFx0TUlOX1NQRUVEX01PVkUgOiAyXG5cdFx0TUFYX1NQRUVEX01PVkUgOiAzLjVcblxuXHRcdE1JTl9TUEVFRF9ST1RBVEUgOiAtMC4wMVxuXHRcdE1BWF9TUEVFRF9ST1RBVEUgOiAwLjAxXG5cblx0XHRNSU5fQUxQSEEgOiAxXG5cdFx0TUFYX0FMUEhBIDogMVxuXG5cdFx0TUlOX0JMVVIgOiAwXG5cdFx0TUFYX0JMVVIgOiAxMFxuXG5cdEBnZW5lcmFsIDogXG5cdFx0R0xPQkFMX1NQRUVEICAgICAgICA6IDFcblx0XHRHTE9CQUxfQUxQSEEgICAgICAgIDogMC43XG5cdFx0TUFYX1NIQVBFX0NPVU5UICAgICA6IDIwMFxuXHRcdElOSVRJQUxfU0hBUEVfQ09VTlQgOiAxMFxuXHRcdERJUkVDVElPTl9SQVRJTyAgICAgOiB4IDogMSwgeSA6IDFcblxuXHRAbGF5ZXJzIDpcblx0XHRCQUNLR1JPVU5EIDogJ0JBQ0tHUk9VTkQnXG5cdFx0TUlER1JPVU5EICA6ICdNSURHUk9VTkQnXG5cdFx0Rk9SRUdST1VORCA6ICdGT1JFR1JPVU5EJ1xuXG5cdEBmaWx0ZXJzIDpcblx0XHRibHVyICA6IGZhbHNlXG5cdFx0UkdCICAgOiBmYWxzZVxuXHRcdHBpeGVsIDogZmFsc2VcblxuXHRAZmlsdGVyRGVmYXVsdHMgOlxuXHRcdGJsdXIgOlxuXHRcdFx0Z2VuZXJhbCAgICA6IDEwXG5cdFx0XHRmb3JlZ3JvdW5kIDogMFxuXHRcdFx0bWlkZ3JvdW5kICA6IDBcblx0XHRcdGJhY2tncm91bmQgOiAwXG5cdFx0UkdCIDpcblx0XHRcdHJlZCAgIDogeCA6IDIsIHkgOiAyXG5cdFx0XHRncmVlbiA6IHggOiAtMiwgeSA6IDJcblx0XHRcdGJsdWUgIDogeCA6IDIsIHkgOiAtMlxuXHRcdHBpeGVsIDpcblx0XHRcdGFtb3VudCA6IHggOiA0LCB5IDogNFxuXG5cdEBpbnRlcmFjdGlvbiA6XG5cdFx0TU9VU0VfUkFESVVTICAgICAgICAgOiA4MDBcblx0XHRESVNQTEFDRU1FTlRfTUFYX0lOQyA6IDAuMlxuXHRcdERJU1BMQUNFTUVOVF9ERUNBWSAgIDogMC4wMVxuXG5cdEBnZXRSYW5kb21Db2xvciA6IC0+XG5cblx0XHRyZXR1cm4gQGNvbG9yc1tAYWN0aXZlUGFsZXR0ZV1bXy5yYW5kb20oMCwgQGNvbG9yc1tAYWN0aXZlUGFsZXR0ZV0ubGVuZ3RoLTEpXVxuXG5cdEBnZXRSYW5kb21TaGFwZSA6IC0+XG5cblx0XHRhY3RpdmVTaGFwZXMgPSBfLmZpbHRlciBAc2hhcGVUeXBlcywgKHMpIC0+IHMuYWN0aXZlXG5cblx0XHRyZXR1cm4gYWN0aXZlU2hhcGVzW18ucmFuZG9tKDAsIGFjdGl2ZVNoYXBlcy5sZW5ndGgtMSldLnR5cGVcblxud2luZG93LkludGVyYWN0aXZlQmdDb25maWc9SW50ZXJhY3RpdmVCZ0NvbmZpZ1xubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnXG4iLCJJbnRlcmFjdGl2ZUJnQ29uZmlnID0gcmVxdWlyZSAnLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuQWJzdHJhY3RTaGFwZSAgICAgICA9IHJlcXVpcmUgJy4vc2hhcGVzL0Fic3RyYWN0U2hhcGUnXG5cbmNsYXNzIEludGVyYWN0aXZlU2hhcGVDYWNoZVxuXG5cdEBzaGFwZXMgOiB7fVxuXG5cdEB0cmlhbmdsZVJhdGlvIDogTWF0aC5jb3MoTWF0aC5QSS82KVxuXG5cdEBjcmVhdGVDYWNoZSA6IC0+XG5cblx0XHQjIGNvdW50ZXIgPSAwXG5cdFx0IyBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG5cblx0XHQoQHNoYXBlc1tzaGFwZS50eXBlXSA9IHt9KSBmb3Igc2hhcGUgaW4gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZVR5cGVzXG5cblx0XHRmb3IgcGFsZXR0ZSwgcGFsZXR0ZUNvbG9ycyBvZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmNvbG9yc1xuXHRcdFx0Zm9yIGNvbG9yIGluIHBhbGV0dGVDb2xvcnNcblx0XHRcdFx0Zm9yIHNoYXBlLCBjb2xvcnMgb2YgQHNoYXBlc1xuXHRcdFx0XHRcdCMgY291bnRlcisrXG5cdFx0XHRcdFx0QHNoYXBlc1tzaGFwZV1bY29sb3JdID0gQF9jcmVhdGVTaGFwZSBzaGFwZSwgY29sb3JcblxuXG5cdFx0IyB0aW1lVGFrZW4gPSBEYXRlLm5vdygpLXN0YXJ0VGltZVxuXHRcdCMgY29uc29sZS5sb2cgXCIje2NvdW50ZXJ9IHNoYXBlIGNhY2hlcyBjcmVhdGVkIGluICN7dGltZVRha2VufW1zXCJcblxuXHRcdG51bGxcblxuXHRAX2NyZWF0ZVNoYXBlIDogKHNoYXBlLCBjb2xvcikgLT5cblxuXHRcdGhlaWdodCA9IEBfZ2V0SGVpZ2h0IHNoYXBlLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEhcblxuXHRcdGMgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRjLndpZHRoICA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSFxuXHRcdGMuaGVpZ2h0ID0gaGVpZ2h0XG5cblx0XHRjdHggPSBjLmdldENvbnRleHQoJzJkJylcblx0XHRjdHguZmlsbFN0eWxlID0gJyMnK2NvbG9yXG5cdFx0Y3R4LmJlZ2luUGF0aCgpXG5cblx0XHRAW1wiX2RyYXcje3NoYXBlfVwiXSBjdHgsIGhlaWdodFxuXG5cdFx0Y3R4LmNsb3NlUGF0aCgpXG5cdFx0Y3R4LmZpbGwoKVxuXG5cdFx0cmV0dXJuIGMudG9EYXRhVVJMKClcblxuXHRAX2RyYXdTcXVhcmUgOiAoY3R4LCBoZWlnaHQpIC0+XG5cblx0XHRjdHgubW92ZVRvKDAsIDApXG5cdFx0Y3R4LmxpbmVUbygwLCBoZWlnaHQpXG5cdFx0Y3R4LmxpbmVUbyhJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEgsIGhlaWdodClcblx0XHRjdHgubGluZVRvKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCwgMClcblx0XHRjdHgubGluZVRvKDAsIDApXG5cblx0XHRudWxsXG5cblx0QF9kcmF3VHJpYW5nbGUgOiAoY3R4LCBoZWlnaHQpIC0+XG5cblx0XHRjdHgubW92ZVRvKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSC8yLCAwKVxuXHRcdGN0eC5saW5lVG8oMCxoZWlnaHQpXG5cdFx0Y3R4LmxpbmVUbyhJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEgsIGhlaWdodClcblx0XHRjdHgubGluZVRvKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSC8yLCAwKVxuXG5cdFx0bnVsbFxuXG5cdEBfZHJhd0NpcmNsZSA6IChjdHgpIC0+XG5cblx0XHRoYWxmV2lkdGggPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEgvMlxuXG5cdFx0Y3R4LmFyYyhoYWxmV2lkdGgsIGhhbGZXaWR0aCwgaGFsZldpZHRoLCAwLCAyKk1hdGguUEkpXG5cblx0XHRudWxsXG5cblx0QF9nZXRIZWlnaHQgOiAoc2hhcGUsIHdpZHRoKSA9PlxuXG5cdFx0aGVpZ2h0ID0gc3dpdGNoIHRydWVcblx0XHRcdHdoZW4gc2hhcGUgaXMgJ1RyaWFuZ2xlJyB0aGVuICh3aWR0aCAqIEB0cmlhbmdsZVJhdGlvKVxuXHRcdFx0ZWxzZSB3aWR0aFxuXG5cdFx0aGVpZ2h0XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJhY3RpdmVTaGFwZUNhY2hlXG4iLCJJbnRlcmFjdGl2ZUJnQ29uZmlnICAgPSByZXF1aXJlICcuLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuSW50ZXJhY3RpdmVTaGFwZUNhY2hlID0gcmVxdWlyZSAnLi4vSW50ZXJhY3RpdmVTaGFwZUNhY2hlJ1xuTnVtYmVyVXRpbHMgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vdXRpbHMvTnVtYmVyVXRpbHMnXG5cbmNsYXNzIEFic3RyYWN0U2hhcGVcblxuXHRzIDogbnVsbFxuXG5cdF9zaGFwZSA6IG51bGxcblx0X2NvbG9yIDogbnVsbFxuXG5cdHdpZHRoICAgICAgIDogbnVsbFxuXHRzcGVlZE1vdmUgICA6IG51bGxcblx0c3BlZWRSb3RhdGUgOiBudWxsXG5cdGFscGhhVmFsdWUgIDogbnVsbFxuXG5cdCMgX3Bvc2l0aW9uVmFyaWFuY2VYIDogbnVsbFxuXHQjIF9wb3NpdGlvblZhcmlhbmNlWSA6IG51bGxcblxuXHRkZWFkIDogZmFsc2VcblxuXHRkaXNwbGFjZW1lbnQgOiAwXG5cblx0QHRyaWFuZ2xlUmF0aW8gOiBNYXRoLmNvcyhNYXRoLlBJLzYpXG5cblx0Y29uc3RydWN0b3IgOiAoQGludGVyYWN0aXZlQmcpIC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdEBfc2hhcGUgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdldFJhbmRvbVNoYXBlKClcblx0XHRAX2NvbG9yID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZXRSYW5kb21Db2xvcigpXG5cblx0XHRAd2lkdGggICAgICAgPSBAX2dldFdpZHRoKClcblx0XHRAaGVpZ2h0ICAgICAgPSBAX2dldEhlaWdodCBAX3NoYXBlLCBAd2lkdGhcblx0XHRAc3BlZWRNb3ZlICAgPSBAX2dldFNwZWVkTW92ZSgpXG5cdFx0QHNwZWVkUm90YXRlID0gQF9nZXRTcGVlZFJvdGF0ZSgpXG5cdFx0QGFscGhhVmFsdWUgID0gQF9nZXRBbHBoYVZhbHVlKClcblxuXHRcdCMgQF9wb3NpdGlvblZhcmlhbmNlWCA9IEBbXCJfcG9zaXRpb25WYXJpYW5jZV9cIitfLnJhbmRvbSgxLDQpXVxuXHRcdCMgQF9wb3NpdGlvblZhcmlhbmNlWSA9IEBbXCJfcG9zaXRpb25WYXJpYW5jZV9cIitfLnJhbmRvbSgxLDQpXVxuXG5cdFx0QHMgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlIEludGVyYWN0aXZlU2hhcGVDYWNoZS5zaGFwZXNbQF9zaGFwZV1bQF9jb2xvcl1cblxuXHRcdEBzLndpZHRoICAgICA9IEB3aWR0aFxuXHRcdEBzLmhlaWdodCAgICA9IEBoZWlnaHRcblx0XHRAcy5ibGVuZE1vZGUgPSBQSVhJLmJsZW5kTW9kZXMuQUREXG5cdFx0QHMuYWxwaGEgICAgID0gQGFscGhhVmFsdWVcblx0XHRAcy5hbmNob3IueCAgPSBAcy5hbmNob3IueSA9IDAuNVxuXG5cdFx0IyB0cmFjayBuYXR1cmFsLCBub24tZGlzcGxhY2VkIHBvc2l0aW9uaW5nXG5cdFx0QHMuX3Bvc2l0aW9uID0geCA6IDAsIHkgOiAwXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdF9nZXRXaWR0aCA6ID0+XG5cblx0XHROdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fV0lEVEgsIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSFxuXG5cdF9nZXRIZWlnaHQgOiAoc2hhcGUsIHdpZHRoKSA9PlxuXG5cdFx0aGVpZ2h0ID0gc3dpdGNoIHRydWVcblx0XHRcdHdoZW4gc2hhcGUgaXMgJ1RyaWFuZ2xlJyB0aGVuICh3aWR0aCAqIEFic3RyYWN0U2hhcGUudHJpYW5nbGVSYXRpbylcblx0XHRcdGVsc2Ugd2lkdGhcblxuXHRcdGhlaWdodFxuXG5cdF9nZXRTcGVlZE1vdmUgOiA9PlxuXG5cdFx0TnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1NQRUVEX01PVkUsIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9TUEVFRF9NT1ZFXG5cblx0X2dldFNwZWVkUm90YXRlIDogPT5cblxuXHRcdE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9TUEVFRF9ST1RBVEUsIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9TUEVFRF9ST1RBVEVcblxuXHRfZ2V0QWxwaGFWYWx1ZSA6ID0+XG5cblx0XHRyYW5nZSA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9BTFBIQSAtIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9BTFBIQVxuXHRcdGFscGhhID0gKChAd2lkdGggLyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEgpICogcmFuZ2UpICsgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX0FMUEhBXG5cblx0XHRhbHBoYVxuXG5cdF9nZXREaXNwbGFjZW1lbnQgOiAoYXhpcykgPT5cblxuXHRcdHJldHVybiAwIHVubGVzcyBAaW50ZXJhY3RpdmVCZy5tb3VzZS5lbmFibGVkXG5cblx0XHRkaXN0ID0gQGludGVyYWN0aXZlQmcubW91c2UucG9zW2F4aXNdLUBzLnBvc2l0aW9uW2F4aXNdXG5cdFx0ZGlzdCA9IGlmIGRpc3QgPCAwIHRoZW4gLWRpc3QgZWxzZSBkaXN0XG5cblx0XHRpZiBkaXN0IDwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5pbnRlcmFjdGlvbi5NT1VTRV9SQURJVVNcblx0XHRcdHN0cmVuZ3RoID0gKEludGVyYWN0aXZlQmdDb25maWcuaW50ZXJhY3Rpb24uTU9VU0VfUkFESVVTIC0gZGlzdCkgLyBJbnRlcmFjdGl2ZUJnQ29uZmlnLmludGVyYWN0aW9uLk1PVVNFX1JBRElVU1xuXHRcdFx0dmFsdWUgICAgPSAoSW50ZXJhY3RpdmVCZ0NvbmZpZy5pbnRlcmFjdGlvbi5ESVNQTEFDRU1FTlRfTUFYX0lOQypJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEKnN0cmVuZ3RoKVxuXHRcdFx0QGRpc3BsYWNlbWVudCA9IGlmIEBzLnBvc2l0aW9uW2F4aXNdID4gQGludGVyYWN0aXZlQmcubW91c2UucG9zW2F4aXNdIHRoZW4gQGRpc3BsYWNlbWVudC12YWx1ZSBlbHNlIEBkaXNwbGFjZW1lbnQrdmFsdWVcblx0XHRcblx0XHRpZiBAZGlzcGxhY2VtZW50IGlzbnQgMFxuXHRcdFx0aWYgQGRpc3BsYWNlbWVudCA+IDBcblx0XHRcdFx0QGRpc3BsYWNlbWVudC09SW50ZXJhY3RpdmVCZ0NvbmZpZy5pbnRlcmFjdGlvbi5ESVNQTEFDRU1FTlRfREVDQVlcblx0XHRcdFx0QGRpc3BsYWNlbWVudCA9IGlmIEBkaXNwbGFjZW1lbnQgPCAwIHRoZW4gMCBlbHNlIEBkaXNwbGFjZW1lbnRcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGRpc3BsYWNlbWVudCs9SW50ZXJhY3RpdmVCZ0NvbmZpZy5pbnRlcmFjdGlvbi5ESVNQTEFDRU1FTlRfREVDQVlcblx0XHRcdFx0QGRpc3BsYWNlbWVudCA9IGlmIEBkaXNwbGFjZW1lbnQgPiAwIHRoZW4gMCBlbHNlIEBkaXNwbGFjZW1lbnRcblxuXHRcdEBkaXNwbGFjZW1lbnRcblxuXHQjIF9wb3NpdGlvblZhcmlhbmNlXzEgOiAodCkgPT5cblxuXHQjIFx0TWF0aC5jb3MgdCAqIDAuMDAxIC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXG5cdCMgX3Bvc2l0aW9uVmFyaWFuY2VfMiA6ICh0KSA9PlxuXG5cdCMgXHRNYXRoLnNpbiB0ICogMC4wMDEgLyBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEXG5cblx0IyBfcG9zaXRpb25WYXJpYW5jZV8zIDogKHQpID0+XG5cblx0IyBcdE1hdGguY29zIHQgKiAwLjAwNSAvIEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblxuXHQjIF9wb3NpdGlvblZhcmlhbmNlXzQgOiAodCkgPT5cblxuXHQjIFx0TWF0aC5zaW4gdCAqIDAuMDA1IC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXG5cdGNhbGxBbmltYXRlIDogPT5cblxuXHRcdHJldHVybiB1bmxlc3MgIUBkZWFkXG5cblx0XHRAcy5hbHBoYSA9IEBhbHBoYVZhbHVlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfQUxQSEFcblxuXHRcdEBzLl9wb3NpdGlvbi54IC09IChAc3BlZWRNb3ZlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRUQpKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5ESVJFQ1RJT05fUkFUSU8ueFxuXHRcdEBzLl9wb3NpdGlvbi55ICs9IChAc3BlZWRNb3ZlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRUQpKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5ESVJFQ1RJT05fUkFUSU8ueVxuXG5cdFx0QHMucG9zaXRpb24ueCA9IEBzLl9wb3NpdGlvbi54K0BfZ2V0RGlzcGxhY2VtZW50KCd4Jylcblx0XHRAcy5wb3NpdGlvbi55ID0gQHMuX3Bvc2l0aW9uLnkrQF9nZXREaXNwbGFjZW1lbnQoJ3knKVxuXG5cdFx0QHMucm90YXRpb24gKz0gQHNwZWVkUm90YXRlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblxuXHRcdGlmIChAcy5wb3NpdGlvbi54ICsgKEB3aWR0aC8yKSA8IDApIG9yIChAcy5wb3NpdGlvbi55IC0gKEB3aWR0aC8yKSA+IEBOQygpLmFwcFZpZXcuZGltcy5oKSB0aGVuIEBraWxsKClcblxuXHRcdG51bGxcblxuXHRraWxsIDogPT5cblxuXHRcdEBkZWFkID0gdHJ1ZVxuXG5cdFx0QGludGVyYWN0aXZlQmcudHJpZ2dlciBAaW50ZXJhY3RpdmVCZy5FVkVOVF9LSUxMX1NIQVBFLCBAXG5cblx0Z2V0U3ByaXRlIDogPT5cblxuXHRcdHJldHVybiBAc1xuXG5cdGdldExheWVyIDogPT5cblxuXHRcdHJhbmdlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRIXG5cblx0XHRsYXllciA9IHN3aXRjaCB0cnVlXG5cdFx0XHR3aGVuIEB3aWR0aCA8IChyYW5nZSAvIDMpK0ludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCB0aGVuIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLkJBQ0tHUk9VTkRcblx0XHRcdHdoZW4gQHdpZHRoIDwgKChyYW5nZSAvIDMpICogMikrSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRIIHRoZW4gSW50ZXJhY3RpdmVCZ0NvbmZpZy5sYXllcnMuTUlER1JPVU5EXG5cdFx0XHRlbHNlIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLkZPUkVHUk9VTkRcblxuXHRcdGxheWVyXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0U2hhcGVcbiJdfQ==
