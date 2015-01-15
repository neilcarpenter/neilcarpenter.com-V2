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

  InteractiveBg.prototype.EVENT_KILL_SHAPE = 'EVENT_KILL_SHAPE';

  InteractiveBg.prototype.filters = {
    blur: null,
    RGB: null,
    pixel: null
  };

  function InteractiveBg() {
    this.setDims = __bind(this.setDims, this);
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
      sprite.position.x = pos.x;
      sprite.position.y = pos.y;
      this.layers[layer].addChild(sprite);
      this.shapes.push(shape);
    }
    return null;
  };

  InteractiveBg.prototype._getShapeStartPos = function() {
    var x, y;
    x = (NumberUtils.getRandomFloat(this.w4, this.w)) + (this.w4 * 3);
    y = (NumberUtils.getRandomFloat(0, this.h4 * 3)) - this.h4 * 3;
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
    this.NC().appView.on(this.NC().appView.EVENT_UPDATE_DIMENSIONS, this.setDims);
    this.on(this.EVENT_KILL_SHAPE, this.removeShape);
    return null;
  };

  InteractiveBg.prototype.setDims = function() {
    var _ref;
    this.w = this.NC().appView.dims.w;
    this.h = this.NC().appView.dims.h;
    this.w2 = this.w / 2;
    this.h2 = this.h / 2;
    this.w2 = this.w / 2;
    this.h2 = this.h / 2;
    this.w4 = this.w / 4;
    this.h4 = this.h / 4;
    if ((_ref = this.renderer) != null) {
      _ref.resize(this.w, this.h);
    }
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
    GLOBAL_SPEED: 1.8,
    GLOBAL_ALPHA: 0.7,
    MAX_SHAPE_COUNT: 200,
    INITIAL_SHAPE_COUNT: 10
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

  AbstractShape.prototype.blurValue = null;

  AbstractShape.prototype.alphaValue = null;

  AbstractShape.prototype.dead = false;

  AbstractShape.triangleRatio = Math.cos(Math.PI / 6);

  function AbstractShape(interactiveBg) {
    this.interactiveBg = interactiveBg;
    this.NC = __bind(this.NC, this);
    this.getLayer = __bind(this.getLayer, this);
    this.getSprite = __bind(this.getSprite, this);
    this.kill = __bind(this.kill, this);
    this.callAnimate = __bind(this.callAnimate, this);
    this._getAlphaValue = __bind(this._getAlphaValue, this);
    this._getBlurValue = __bind(this._getBlurValue, this);
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
    this.blurValue = this._getBlurValue();
    this.alphaValue = this._getAlphaValue();
    this.s = new PIXI.Sprite.fromImage(InteractiveShapeCache.shapes[this._shape][this._color]);
    this.s.width = this.width;
    this.s.height = this.height;
    this.s.blendMode = PIXI.blendModes.ADD;
    this.s.alpha = this.alphaValue;
    this.s.anchor.x = this.s.anchor.y = 0.5;
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

  AbstractShape.prototype._getBlurValue = function() {
    var blur, range;
    range = InteractiveBgConfig.shapes.MAX_BLUR - InteractiveBgConfig.shapes.MIN_BLUR;
    blur = ((this.width / InteractiveBgConfig.shapes.MAX_WIDTH) * range) + InteractiveBgConfig.shapes.MIN_BLUR;
    return blur;
  };

  AbstractShape.prototype._getAlphaValue = function() {
    var alpha, range;
    range = InteractiveBgConfig.shapes.MAX_ALPHA - InteractiveBgConfig.shapes.MIN_ALPHA;
    alpha = ((this.width / InteractiveBgConfig.shapes.MAX_WIDTH) * range) + InteractiveBgConfig.shapes.MIN_ALPHA;
    return alpha;
  };

  AbstractShape.prototype.callAnimate = function() {
    if (!!this.dead) {
      return;
    }
    this.s.alpha = this.alphaValue * InteractiveBgConfig.general.GLOBAL_ALPHA;
    this.s.position.x -= this.speedMove * InteractiveBgConfig.general.GLOBAL_SPEED;
    this.s.position.y += this.speedMove * InteractiveBgConfig.general.GLOBAL_SPEED;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL051bWJlclV0aWxzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZy5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmdDb25maWcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9JbnRlcmFjdGl2ZVNoYXBlQ2FjaGUuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9zaGFwZXMvQWJzdHJhY3RTaGFwZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhCQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBS0E7QUFBQTs7O0dBTEE7O0FBQUEsT0FXQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxVQVlBLEdBQWEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFwQyxDQVpiLENBQUE7O0FBQUEsSUFlQSxHQUFVLE9BQUgsR0FBZ0IsRUFBaEIsR0FBeUIsTUFBQSxJQUFVLFFBZjFDLENBQUE7O0FBaUJBLElBQUcsVUFBSDtBQUNDLEVBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUF6QixJQUFzQyxhQUF0QyxDQUREO0NBQUEsTUFBQTtBQUlDLEVBQUEsSUFBSSxDQUFDLEVBQUwsR0FBYyxJQUFBLEdBQUEsQ0FBSSxPQUFKLENBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFSLENBQUEsQ0FEQSxDQUpEO0NBakJBOzs7OztBQ0FBLElBQUEsbUNBQUE7RUFBQSxrRkFBQTs7QUFBQSxPQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FBZixDQUFBOztBQUFBLE9BQ0EsR0FBZSxPQUFBLENBQVEsV0FBUixD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QUFDLENBQUEsS0FBRCxHQUFTLENBQUMsQ0FBQyxLQUFBLEdBQVEsQ0FBVCxDQUFBLEdBQWMsQ0FBZixDQUFBLEdBQWtCLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUZwRDtpQkFFbUUsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBRjlGO0FBQUE7aUJBR0YsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFdBSHpCO0FBQUE7aUJBRlIsQ0FBQTtXQU9BLE1BVFU7RUFBQSxDQWpHWCxDQUFBOztBQUFBLDBCQTRHQSxFQUFBLEdBQUssU0FBQSxHQUFBO0FBRUosV0FBTyxNQUFNLENBQUMsRUFBZCxDQUZJO0VBQUEsQ0E1R0wsQ0FBQTs7dUJBQUE7O0lBTkQsQ0FBQTs7QUFBQSxNQXNITSxDQUFDLE9BQVAsR0FBaUIsYUF0SGpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbiMgUFJPRFVDVElPTiBFTlZJUk9OTUVOVCAtIG1heSB3YW50IHRvIHVzZSBzZXJ2ZXItc2V0IHZhcmlhYmxlcyBoZXJlXG4jIElTX0xJVkUgPSBkbyAtPiByZXR1cm4gaWYgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignbG9jYWxob3N0JykgPiAtMSBvciB3aW5kb3cubG9jYXRpb24uc2VhcmNoIGlzICc/ZCcgdGhlbiBmYWxzZSBlbHNlIHRydWVcblxuIyMjXG5cbldJUCAtIHRoaXMgd2lsbCBpZGVhbGx5IGNoYW5nZSB0byBvbGQgZm9ybWF0IChhYm92ZSkgd2hlbiBjYW4gZmlndXJlIGl0IG91dFxuXG4jIyNcblxuSVNfTElWRSAgICA9IGZhbHNlXG5JU19QUkVWSUVXID0gL3ByZXZpZXc9dHJ1ZS8udGVzdCh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuXG4jIE9OTFkgRVhQT1NFIEFQUCBHTE9CQUxMWSBJRiBMT0NBTCBPUiBERVYnSU5HXG52aWV3ID0gaWYgSVNfTElWRSB0aGVuIHt9IGVsc2UgKHdpbmRvdyBvciBkb2N1bWVudClcblxuaWYgSVNfUFJFVklFV1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgSVNfUFJFVklFVydcbmVsc2Vcblx0IyBERUNMQVJFIE1BSU4gQVBQTElDQVRJT05cblx0dmlldy5OQyA9IG5ldyBBcHAgSVNfTElWRVxuXHR2aWV3Lk5DLmluaXQoKVxuIiwiQXBwRGF0YSAgICAgID0gcmVxdWlyZSAnLi9BcHBEYXRhJ1xuQXBwVmlldyAgICAgID0gcmVxdWlyZSAnLi9BcHBWaWV3J1xuTWVkaWFRdWVyaWVzID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5cbmNsYXNzIEFwcFxuXG4gICAgTElWRSAgICAgICAgICAgIDogbnVsbFxuICAgIEJBU0VfUEFUSCAgICAgICA6IHdpbmRvdy5jb25maWcuYmFzZV9wYXRoXG4gICAgQkFTRV9VUkwgICAgICAgIDogd2luZG93LmNvbmZpZy5iYXNlX3VybFxuICAgIEJBU0VfVVJMX0FTU0VUUyA6IHdpbmRvdy5jb25maWcuYmFzZV91cmxfYXNzZXRzXG4gICAgb2JqUmVhZHkgICAgICAgIDogMFxuXG4gICAgX3RvQ2xlYW4gICA6IFsnb2JqUmVhZHknLCAnc2V0RmxhZ3MnLCAnb2JqZWN0Q29tcGxldGUnLCAnaW5pdCcsICdpbml0T2JqZWN0cycsICdpbml0U0RLcycsICdpbml0QXBwJywgJ2dvJywgJ2NsZWFudXAnLCAnX3RvQ2xlYW4nXVxuXG4gICAgY29uc3RydWN0b3IgOiAoQExJVkUpIC0+XG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIHNldEZsYWdzIDogPT5cblxuICAgICAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKClcblxuICAgICAgICBNZWRpYVF1ZXJpZXMuc2V0dXAoKTtcblxuICAgICAgICAjIEBJU19BTkRST0lEICAgID0gdWEuaW5kZXhPZignYW5kcm9pZCcpID4gLTFcbiAgICAgICAgIyBASVNfRklSRUZPWCAgICA9IHVhLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xXG4gICAgICAgICMgQElTX0NIUk9NRV9JT1MgPSBpZiB1YS5tYXRjaCgnY3Jpb3MnKSB0aGVuIHRydWUgZWxzZSBmYWxzZSAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzODA4MDUzXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb2JqZWN0Q29tcGxldGUgOiA9PlxuXG4gICAgICAgIEBvYmpSZWFkeSsrXG4gICAgICAgIEBpbml0QXBwKCkgaWYgQG9ialJlYWR5ID49IDFcblxuICAgICAgICBudWxsXG5cbiAgICBpbml0IDogPT5cblxuICAgICAgICAjIGN1cnJlbnRseSBubyBvYmplY3RzIHRvIGxvYWQgaGVyZSwgc28ganVzdCBzdGFydCBhcHBcbiAgICAgICAgIyBAaW5pdE9iamVjdHMoKVxuXG4gICAgICAgIEBpbml0QXBwKClcblxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRPYmplY3RzIDogPT5cblxuICAgICMgICAgIEB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVzIFwiI3tAQkFTRV9VUkxfQVNTRVRTfS9kYXRhL3RlbXBsYXRlcyN7KGlmIEBMSVZFIHRoZW4gJy5taW4nIGVsc2UgJycpfS54bWxcIiwgQG9iamVjdENvbXBsZXRlXG5cbiAgICAjICAgICAjIGlmIG5ldyBvYmplY3RzIGFyZSBhZGRlZCBkb24ndCBmb3JnZXQgdG8gY2hhbmdlIHRoZSBgQG9iamVjdENvbXBsZXRlYCBmdW5jdGlvblxuXG4gICAgIyAgICAgbnVsbFxuXG4gICAgaW5pdEFwcCA6ID0+XG5cbiAgICAgICAgQHNldEZsYWdzKClcblxuICAgICAgICAjIyMgU3RhcnRzIGFwcGxpY2F0aW9uICMjI1xuICAgICAgICBAYXBwRGF0YSA9IG5ldyBBcHBEYXRhXG4gICAgICAgIEBhcHBWaWV3ID0gbmV3IEFwcFZpZXdcblxuICAgICAgICBAZ28oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGdvIDogPT5cblxuICAgICAgICAjIyMgQWZ0ZXIgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGtpY2tzIG9mZiB3ZWJzaXRlICMjI1xuICAgICAgICBAYXBwVmlldy5yZW5kZXIoKVxuXG4gICAgICAgICMjIyByZW1vdmUgcmVkdW5kYW50IGluaXRpYWxpc2F0aW9uIG1ldGhvZHMgLyBwcm9wZXJ0aWVzICMjI1xuICAgICAgICBAY2xlYW51cCgpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgY2xlYW51cCA6ID0+XG5cbiAgICAgICAgZm9yIGZuIGluIEBfdG9DbGVhblxuICAgICAgICAgICAgQFtmbl0gPSBudWxsXG4gICAgICAgICAgICBkZWxldGUgQFtmbl1cblxuICAgICAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwXG4iLCJBYnN0cmFjdERhdGEgPSByZXF1aXJlICcuL2RhdGEvQWJzdHJhY3REYXRhJ1xuXG5jbGFzcyBBcHBEYXRhIGV4dGVuZHMgQWJzdHJhY3REYXRhXG5cbiAgICBjb25zdHJ1Y3RvciA6IC0+XG5cbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwRGF0YVxuIiwiQWJzdHJhY3RWaWV3ICA9IHJlcXVpcmUgJy4vdmlldy9BYnN0cmFjdFZpZXcnXG5NZWRpYVF1ZXJpZXMgID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5JbnRlcmFjdGl2ZUJnID0gcmVxdWlyZSAnLi92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmcnXG5cbmNsYXNzIEFwcFZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuICAgIHRlbXBsYXRlIDogJ21haW4nXG5cbiAgICAkd2luZG93ICA6IG51bGxcbiAgICAkYm9keSAgICA6IG51bGxcblxuICAgIHdyYXBwZXIgIDogbnVsbFxuXG4gICAgZGltcyA6XG4gICAgICAgIHcgOiBudWxsXG4gICAgICAgIGggOiBudWxsXG4gICAgICAgIG8gOiBudWxsXG4gICAgICAgIGMgOiBudWxsXG4gICAgICAgIHIgOiBudWxsXG5cbiAgICByd2RTaXplcyA6XG4gICAgICAgIExBUkdFICA6ICdMUkcnXG4gICAgICAgIE1FRElVTSA6ICdNRUQnXG4gICAgICAgIFNNQUxMICA6ICdTTUwnXG5cbiAgICBsYXN0U2Nyb2xsWSA6IDBcbiAgICB0aWNraW5nICAgICA6IGZhbHNlXG5cbiAgICBFVkVOVF9VUERBVEVfRElNRU5TSU9OUyA6ICdFVkVOVF9VUERBVEVfRElNRU5TSU9OUydcbiAgICBFVkVOVF9PTl9TQ1JPTEwgICAgICAgICA6ICdFVkVOVF9PTl9TQ1JPTEwnXG5cbiAgICBNT0JJTEVfV0lEVEggOiA3MDBcbiAgICBNT0JJTEUgICAgICAgOiAnbW9iaWxlJ1xuICAgIE5PTl9NT0JJTEUgICA6ICdub25fbW9iaWxlJ1xuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIEAkd2luZG93ID0gJCh3aW5kb3cpXG4gICAgICAgIEAkYm9keSAgID0gJCgnYm9keScpLmVxKDApXG5cbiAgICAgICAgIyB0aGVzZSwgcmF0aGVyIHRoYW4gY2FsbGluZyBzdXBlclxuICAgICAgICBAc2V0RWxlbWVudCBAJGJvZHkuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuICAgICAgICBAY2hpbGRyZW4gPSBbXVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICBkaXNhYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub24gJ3RvdWNobW92ZScsIEBvblRvdWNoTW92ZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZW5hYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub2ZmICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uVG91Y2hNb3ZlOiAoIGUgKSAtPlxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVuZGVyIDogPT5cblxuICAgICAgICBAYmluZEV2ZW50cygpXG5cbiAgICAgICAgQGludGVyYWN0aXZlQmcgPSBuZXcgSW50ZXJhY3RpdmVCZ1xuXG4gICAgICAgIEBhZGRDaGlsZCBAaW50ZXJhY3RpdmVCZ1xuXG4gICAgICAgIEBvbkFsbFJlbmRlcmVkKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGJpbmRFdmVudHMgOiA9PlxuXG4gICAgICAgIEBvbiAnYWxsUmVuZGVyZWQnLCBAb25BbGxSZW5kZXJlZFxuXG4gICAgICAgIEBvblJlc2l6ZSgpXG5cbiAgICAgICAgQG9uUmVzaXplID0gXy5kZWJvdW5jZSBAb25SZXNpemUsIDMwMFxuICAgICAgICBAJHdpbmRvdy5vbiAncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgQG9uUmVzaXplXG4gICAgICAgIEAkd2luZG93Lm9uIFwic2Nyb2xsXCIsIEBvblNjcm9sbFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25TY3JvbGwgOiA9PlxuXG4gICAgICAgIEBsYXN0U2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZXG4gICAgICAgIEByZXF1ZXN0VGljaygpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgcmVxdWVzdFRpY2sgOiA9PlxuXG4gICAgICAgIGlmICFAdGlja2luZ1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBzY3JvbGxVcGRhdGVcbiAgICAgICAgICAgIEB0aWNraW5nID0gdHJ1ZVxuXG4gICAgICAgIG51bGxcblxuICAgIHNjcm9sbFVwZGF0ZSA6ID0+XG5cbiAgICAgICAgQHRpY2tpbmcgPSBmYWxzZVxuXG4gICAgICAgIEAkYm9keS5hZGRDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0IEB0aW1lclNjcm9sbFxuXG4gICAgICAgIEB0aW1lclNjcm9sbCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEAkYm9keS5yZW1vdmVDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG4gICAgICAgICwgNTBcblxuICAgICAgICBAdHJpZ2dlciBBcHBWaWV3LkVWRU5UX09OX1NDUk9MTFxuXG4gICAgICAgIG51bGxcblxuICAgIG9uQWxsUmVuZGVyZWQgOiA9PlxuXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJvbkFsbFJlbmRlcmVkIDogPT5cIlxuICAgICAgICBAYmVnaW4oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGJlZ2luIDogPT5cblxuICAgICAgICBAdHJpZ2dlciAnc3RhcnQnXG5cbiAgICAgICAgQG9uU2Nyb2xsKClcbiAgICAgICAgQGludGVyYWN0aXZlQmcuc2hvdygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblJlc2l6ZSA6ID0+XG5cbiAgICAgICAgQGdldERpbXMoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0RGltcyA6ID0+XG5cbiAgICAgICAgdyA9IHdpbmRvdy5pbm5lcldpZHRoIG9yIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCBvciBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXG4gICAgICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgb3IgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCBvciBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxuXG4gICAgICAgIEBkaW1zID1cbiAgICAgICAgICAgIHcgOiB3XG4gICAgICAgICAgICBoIDogaFxuICAgICAgICAgICAgbyA6IGlmIGggPiB3IHRoZW4gJ3BvcnRyYWl0JyBlbHNlICdsYW5kc2NhcGUnXG4gICAgICAgICAgICBjIDogaWYgdyA8PSBATU9CSUxFX1dJRFRIIHRoZW4gQE1PQklMRSBlbHNlIEBOT05fTU9CSUxFXG4gICAgICAgICAgICByIDogQGdldFJ3ZFNpemUgdywgaCwgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIG9yIDEpXG5cbiAgICAgICAgQHRyaWdnZXIgQEVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAZGltc1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0UndkU2l6ZSA6ICh3LCBoLCBkcHIpID0+XG5cbiAgICAgICAgcHcgPSB3KmRwclxuXG4gICAgICAgIHNpemUgPSBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgICAgd2hlbiBwdyA+IDE0NDAgdGhlbiBAcndkU2l6ZXMuTEFSR0VcbiAgICAgICAgICAgIHdoZW4gcHcgPCA2NTAgdGhlbiBAcndkU2l6ZXMuU01BTExcbiAgICAgICAgICAgIGVsc2UgQHJ3ZFNpemVzLk1FRElVTVxuXG4gICAgICAgIHNpemVcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3XG4iLCJjbGFzcyBBYnN0cmFjdERhdGFcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdHJldHVybiBudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0RGF0YVxuIiwiIyAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIE1lZGlhIFF1ZXJpZXMgTWFuYWdlciBcbiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBcbiMgICBAYXV0aG9yIDogRsOhYmlvIEF6ZXZlZG8gPGZhYmlvLmF6ZXZlZG9AdW5pdDkuY29tPiBVTklUOVxuIyAgIEBkYXRlICAgOiBTZXB0ZW1iZXIgMTRcbiMgICBcbiMgICBJbnN0cnVjdGlvbnMgYXJlIG9uIC9wcm9qZWN0L3Nhc3MvdXRpbHMvX3Jlc3BvbnNpdmUuc2Nzcy5cblxuY2xhc3MgTWVkaWFRdWVyaWVzXG5cbiAgICAjIEJyZWFrcG9pbnRzXG4gICAgQFNNQUxMRVNUICAgIDogXCJzbWFsbGVzdFwiXG4gICAgQFNNQUxMICAgICAgIDogXCJzbWFsbFwiXG4gICAgQElQQUQgICAgICAgIDogXCJpcGFkXCJcbiAgICBATUVESVVNICAgICAgOiBcIm1lZGl1bVwiXG4gICAgQExBUkdFICAgICAgIDogXCJsYXJnZVwiXG4gICAgQEVYVFJBX0xBUkdFIDogXCJleHRyYS1sYXJnZVwiXG5cbiAgICBAc2V0dXAgOiA9PlxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTEVTVF9CUkVBS1BPSU5UID0ge25hbWU6IFwiU21hbGxlc3RcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuU01BTExFU1RdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIlNtYWxsXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNULCBNZWRpYVF1ZXJpZXMuU01BTExdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlQgICA9IHtuYW1lOiBcIk1lZGl1bVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5NRURJVU1dfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTEFSR0VfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIkxhcmdlXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLklQQUQsIE1lZGlhUXVlcmllcy5MQVJHRSwgTWVkaWFRdWVyaWVzLkVYVFJBX0xBUkdFXX1cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFMgPSBbXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5NRURJVU1fQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm5cblxuICAgIEBnZXREZXZpY2VTdGF0ZSA6ID0+XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIFwiYWZ0ZXJcIikuZ2V0UHJvcGVydHlWYWx1ZShcImNvbnRlbnRcIik7XG5cbiAgICBAZ2V0QnJlYWtwb2ludCA6ID0+XG5cbiAgICAgICAgc3RhdGUgPSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuXG4gICAgICAgIGZvciBpIGluIFswLi4uTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTLmxlbmd0aF1cbiAgICAgICAgICAgIGlmIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5icmVha3BvaW50cy5pbmRleE9mKHN0YXRlKSA+IC0xXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5uYW1lXG5cbiAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgIEBpc0JyZWFrcG9pbnQgOiAoYnJlYWtwb2ludCkgPT5cblxuICAgICAgICBmb3IgaSBpbiBbMC4uLmJyZWFrcG9pbnQuYnJlYWtwb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBicmVha3BvaW50LmJyZWFrcG9pbnRzW2ldID09IE1lZGlhUXVlcmllcy5nZXREZXZpY2VTdGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYVF1ZXJpZXNcbiIsImNsYXNzIE51bWJlclV0aWxzXG5cbiAgICBATUFUSF9DT1M6IE1hdGguY29zIFxuICAgIEBNQVRIX1NJTjogTWF0aC5zaW4gXG4gICAgQE1BVEhfUkFORE9NOiBNYXRoLnJhbmRvbSBcbiAgICBATUFUSF9BQlM6IE1hdGguYWJzXG4gICAgQE1BVEhfQVRBTjI6IE1hdGguYXRhbjJcblxuICAgIEBsaW1pdDoobnVtYmVyLCBtaW4sIG1heCktPlxuICAgICAgICByZXR1cm4gTWF0aC5taW4oIE1hdGgubWF4KG1pbixudW1iZXIpLCBtYXggKVxuXG4gICAgQG1hcCA6IChudW0sIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIHJvdW5kID0gZmFsc2UsIGNvbnN0cmFpbk1pbiA9IHRydWUsIGNvbnN0cmFpbk1heCA9IHRydWUpIC0+XG4gICAgICAgICAgICBpZiBjb25zdHJhaW5NaW4gYW5kIG51bSA8IG1pbjEgdGhlbiByZXR1cm4gbWluMlxuICAgICAgICAgICAgaWYgY29uc3RyYWluTWF4IGFuZCBudW0gPiBtYXgxIHRoZW4gcmV0dXJuIG1heDJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbnVtMSA9IChudW0gLSBtaW4xKSAvIChtYXgxIC0gbWluMSlcbiAgICAgICAgICAgIG51bTIgPSAobnVtMSAqIChtYXgyIC0gbWluMikpICsgbWluMlxuICAgICAgICAgICAgaWYgcm91bmRcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW0yKVxuICAgICAgICAgICAgcmV0dXJuIG51bTJcblxuICAgIEBnZXRSYW5kb21Db2xvcjogLT5cblxuICAgICAgICBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKVxuICAgICAgICBjb2xvciA9ICcjJ1xuICAgICAgICBmb3IgaSBpbiBbMC4uLjZdXG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KV1cbiAgICAgICAgY29sb3JcblxuICAgIEBnZXRSYW5kb21GbG9hdCA6IChtaW4sIG1heCkgLT5cblxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcblxuICAgIEBnZXRUaW1lU3RhbXBEaWZmIDogKGRhdGUxLCBkYXRlMikgLT5cblxuICAgICAgICAjIEdldCAxIGRheSBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgb25lX2RheSA9IDEwMDAqNjAqNjAqMjRcbiAgICAgICAgdGltZSAgICA9IHt9XG5cbiAgICAgICAgIyBDb252ZXJ0IGJvdGggZGF0ZXMgdG8gbWlsbGlzZWNvbmRzXG4gICAgICAgIGRhdGUxX21zID0gZGF0ZTEuZ2V0VGltZSgpXG4gICAgICAgIGRhdGUyX21zID0gZGF0ZTIuZ2V0VGltZSgpXG5cbiAgICAgICAgIyBDYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2UgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkYXRlMl9tcyAtIGRhdGUxX21zXG5cbiAgICAgICAgIyB0YWtlIG91dCBtaWxsaXNlY29uZHNcbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvMTAwMFxuICAgICAgICB0aW1lLnNlY29uZHMgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zICUgNjApXG5cbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvNjAgXG4gICAgICAgIHRpbWUubWludXRlcyAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMgJSA2MClcblxuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGlmZmVyZW5jZV9tcy82MCBcbiAgICAgICAgdGltZS5ob3VycyAgICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcyAlIDI0KSAgXG5cbiAgICAgICAgdGltZS5kYXlzICAgICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcy8yNClcblxuICAgICAgICB0aW1lXG5cbiAgICBAbWFwOiAoIG51bSwgbWluMSwgbWF4MSwgbWluMiwgbWF4Miwgcm91bmQgPSBmYWxzZSwgY29uc3RyYWluTWluID0gdHJ1ZSwgY29uc3RyYWluTWF4ID0gdHJ1ZSApIC0+XG4gICAgICAgIGlmIGNvbnN0cmFpbk1pbiBhbmQgbnVtIDwgbWluMSB0aGVuIHJldHVybiBtaW4yXG4gICAgICAgIGlmIGNvbnN0cmFpbk1heCBhbmQgbnVtID4gbWF4MSB0aGVuIHJldHVybiBtYXgyXG4gICAgICAgIFxuICAgICAgICBudW0xID0gKG51bSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKVxuICAgICAgICBudW0yID0gKG51bTEgKiAobWF4MiAtIG1pbjIpKSArIG1pbjJcbiAgICAgICAgaWYgcm91bmQgdGhlbiByZXR1cm4gTWF0aC5yb3VuZChudW0yKVxuXG4gICAgICAgIHJldHVybiBudW0yXG5cbiAgICBAdG9SYWRpYW5zOiAoIGRlZ3JlZSApIC0+XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoIE1hdGguUEkgLyAxODAgKVxuXG4gICAgQHRvRGVncmVlOiAoIHJhZGlhbnMgKSAtPlxuICAgICAgICByZXR1cm4gcmFkaWFucyAqICggMTgwIC8gTWF0aC5QSSApXG5cbiAgICBAaXNJblJhbmdlOiAoIG51bSwgbWluLCBtYXgsIGNhbkJlRXF1YWwgKSAtPlxuICAgICAgICBpZiBjYW5CZUVxdWFsIHRoZW4gcmV0dXJuIG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heFxuICAgICAgICBlbHNlIHJldHVybiBudW0gPj0gbWluICYmIG51bSA8PSBtYXhcblxuICAgICMgY29udmVydCBtZXRyZXMgaW4gdG8gbSAvIEtNXG4gICAgQGdldE5pY2VEaXN0YW5jZTogKG1ldHJlcykgPT5cblxuICAgICAgICBpZiBtZXRyZXMgPCAxMDAwXG5cbiAgICAgICAgICAgIHJldHVybiBcIiN7TWF0aC5yb3VuZChtZXRyZXMpfU1cIlxuXG4gICAgICAgIGVsc2VcblxuICAgICAgICAgICAga20gPSAobWV0cmVzLzEwMDApLnRvRml4ZWQoMilcbiAgICAgICAgICAgIHJldHVybiBcIiN7a219S01cIlxuXG4gICAgQHNodWZmbGUgOiAobykgPT5cbiAgICAgICAgYGZvcih2YXIgaiwgeCwgaSA9IG8ubGVuZ3RoOyBpOyBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSksIHggPSBvWy0taV0sIG9baV0gPSBvW2pdLCBvW2pdID0geCk7YFxuICAgICAgICByZXR1cm4gb1xuXG4gICAgQHJhbmRvbVJhbmdlIDogKG1pbixtYXgpID0+XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE51bWJlclV0aWxzXG4iLCJjbGFzcyBBYnN0cmFjdFZpZXcgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3XG5cblx0ZWwgICAgICAgICAgIDogbnVsbFxuXHRpZCAgICAgICAgICAgOiBudWxsXG5cdGNoaWxkcmVuICAgICA6IG51bGxcblx0dGVtcGxhdGUgICAgIDogbnVsbFxuXHR0ZW1wbGF0ZVZhcnMgOiBudWxsXG5cblx0IyBjb3ogb24gcGFnZSBsb2FkIHdlIGFscmVhZHkgaGF2ZSB0aGUgRE9NIGZvciBhIHBhZ2UsIGl0IHdpbGwgZ2V0IGluaXRpYWxpc2VkIHR3aWNlIC0gb25jZSBvbiBjb25zdHJ1Y3Rpb24sIGFuZCBvbmNlIHdoZW4gcGFnZSBoYXMgXCJsb2FkZWRcIlxuXHRpbml0aWFsaXplZCA6IGZhbHNlXG5cdFxuXHRpbml0aWFsaXplIDogKGZvcmNlKSAtPlxuXG5cdFx0cmV0dXJuIHVubGVzcyAhQGluaXRpYWxpemVkIG9yIGZvcmNlXG5cdFx0XG5cdFx0QGNoaWxkcmVuID0gW11cblxuXHRcdGlmIEB0ZW1wbGF0ZVxuXHRcdFx0JHRtcGwgPSBATkMoKS5hcHBWaWV3LiRlbC5maW5kKFwiW2RhdGEtdGVtcGxhdGU9XFxcIiN7QHRlbXBsYXRlfVxcXCJdXCIpXG5cdFx0XHRAc2V0RWxlbWVudCAkdG1wbFxuXHRcdFx0cmV0dXJuIHVubGVzcyAkdG1wbC5sZW5ndGhcblxuXHRcdEAkZWwuYXR0ciAnaWQnLCBAaWQgaWYgQGlkXG5cdFx0QCRlbC5hZGRDbGFzcyBAY2xhc3NOYW1lIGlmIEBjbGFzc05hbWVcblx0XHRcblx0XHRAaW5pdGlhbGl6ZWQgPSB0cnVlXG5cdFx0QGluaXQoKVxuXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cblx0XHRudWxsXG5cblx0aW5pdCA6ID0+XG5cblx0XHRudWxsXG5cblx0dXBkYXRlIDogPT5cblxuXHRcdG51bGxcblxuXHRyZW5kZXIgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdGFkZENoaWxkIDogKGNoaWxkLCBwcmVwZW5kID0gZmFsc2UpID0+XG5cblx0XHRAY2hpbGRyZW4ucHVzaCBjaGlsZCBpZiBjaGlsZC5lbFxuXG5cdFx0QFxuXG5cdHJlcGxhY2UgOiAoZG9tLCBjaGlsZCkgPT5cblxuXHRcdEBjaGlsZHJlbi5wdXNoIGNoaWxkIGlmIGNoaWxkLmVsXG5cdFx0YyA9IGlmIGNoaWxkLmVsIHRoZW4gY2hpbGQuJGVsIGVsc2UgY2hpbGRcblx0XHRAJGVsLmNoaWxkcmVuKGRvbSkucmVwbGFjZVdpdGgoYylcblxuXHRcdG51bGxcblxuXHRyZW1vdmUgOiAoY2hpbGQpID0+XG5cblx0XHR1bmxlc3MgY2hpbGQ/XG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHRjID0gaWYgY2hpbGQuZWwgdGhlbiBjaGlsZC4kZWwgZWxzZSAkKGNoaWxkKVxuXHRcdGNoaWxkLmRpc3Bvc2UoKSBpZiBjIGFuZCBjaGlsZC5kaXNwb3NlXG5cblx0XHRpZiBjICYmIEBjaGlsZHJlbi5pbmRleE9mKGNoaWxkKSAhPSAtMVxuXHRcdFx0QGNoaWxkcmVuLnNwbGljZSggQGNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxIClcblxuXHRcdGMucmVtb3ZlKClcblxuXHRcdG51bGxcblxuXHRvblJlc2l6ZSA6IChldmVudCkgPT5cblxuXHRcdChpZiBjaGlsZC5vblJlc2l6ZSB0aGVuIGNoaWxkLm9uUmVzaXplKCkpIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRtb3VzZUVuYWJsZWQgOiAoIGVuYWJsZWQgKSA9PlxuXG5cdFx0QCRlbC5jc3Ncblx0XHRcdFwicG9pbnRlci1ldmVudHNcIjogaWYgZW5hYmxlZCB0aGVuIFwiYXV0b1wiIGVsc2UgXCJub25lXCJcblxuXHRcdG51bGxcblxuXHRDU1NUcmFuc2xhdGUgOiAoeCwgeSwgdmFsdWU9JyUnLCBzY2FsZSkgPT5cblxuXHRcdGlmIE1vZGVybml6ci5jc3N0cmFuc2Zvcm1zM2Rcblx0XHRcdHN0ciA9IFwidHJhbnNsYXRlM2QoI3t4K3ZhbHVlfSwgI3t5K3ZhbHVlfSwgMClcIlxuXHRcdGVsc2Vcblx0XHRcdHN0ciA9IFwidHJhbnNsYXRlKCN7eCt2YWx1ZX0sICN7eSt2YWx1ZX0pXCJcblxuXHRcdGlmIHNjYWxlIHRoZW4gc3RyID0gXCIje3N0cn0gc2NhbGUoI3tzY2FsZX0pXCJcblxuXHRcdHN0clxuXG5cdHVuTXV0ZUFsbCA6ID0+XG5cblx0XHRmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLnVuTXV0ZT8oKVxuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRjaGlsZC51bk11dGVBbGwoKVxuXG5cdFx0bnVsbFxuXG5cdG11dGVBbGwgOiA9PlxuXG5cdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC5tdXRlPygpXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdGNoaWxkLm11dGVBbGwoKVxuXG5cdFx0bnVsbFxuXG5cdHJlbW92ZUFsbENoaWxkcmVuOiA9PlxuXG5cdFx0QHJlbW92ZSBjaGlsZCBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0dHJpZ2dlckNoaWxkcmVuIDogKG1zZywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLnRyaWdnZXIgbXNnXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEB0cmlnZ2VyQ2hpbGRyZW4gbXNnLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdGNhbGxDaGlsZHJlbiA6IChtZXRob2QsIHBhcmFtcywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAY2FsbENoaWxkcmVuIG1ldGhvZCwgcGFyYW1zLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdGNhbGxDaGlsZHJlbkFuZFNlbGYgOiAobWV0aG9kLCBwYXJhbXMsIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdEBbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGRbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEBjYWxsQ2hpbGRyZW4gbWV0aG9kLCBwYXJhbXMsIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0c3VwcGxhbnRTdHJpbmcgOiAoc3RyLCB2YWxzKSAtPlxuXG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlIC97eyAoW157fV0qKSB9fS9nLCAoYSwgYikgLT5cblx0XHRcdHIgPSB2YWxzW2JdXG5cdFx0XHQoaWYgdHlwZW9mIHIgaXMgXCJzdHJpbmdcIiBvciB0eXBlb2YgciBpcyBcIm51bWJlclwiIHRoZW4gciBlbHNlIGEpXG5cblx0ZGlzcG9zZSA6ID0+XG5cblx0XHRAc3RvcExpc3RlbmluZygpXG5cblx0XHRudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0Vmlld1xuIiwiQWJzdHJhY3RWaWV3ICAgICAgICAgID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuQWJzdHJhY3RTaGFwZSAgICAgICAgID0gcmVxdWlyZSAnLi9zaGFwZXMvQWJzdHJhY3RTaGFwZSdcbk51bWJlclV0aWxzICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uL3V0aWxzL051bWJlclV0aWxzJ1xuSW50ZXJhY3RpdmVCZ0NvbmZpZyAgID0gcmVxdWlyZSAnLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuSW50ZXJhY3RpdmVTaGFwZUNhY2hlID0gcmVxdWlyZSAnLi9JbnRlcmFjdGl2ZVNoYXBlQ2FjaGUnXG5cbmNsYXNzIEludGVyYWN0aXZlQmcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuXHR0ZW1wbGF0ZSA6ICdpbnRlcmFjdGl2ZS1iYWNrZ3JvdW5kJ1xuXG5cdHN0YWdlICAgIDogbnVsbFxuXHRyZW5kZXJlciA6IG51bGxcblx0bGF5ZXJzICAgOiB7fVxuXHRcblx0dyA6IDBcblx0aCA6IDBcblxuXHRjb3VudGVyIDogbnVsbFxuXG5cdEVWRU5UX0tJTExfU0hBUEUgOiAnRVZFTlRfS0lMTF9TSEFQRSdcblxuXHRmaWx0ZXJzIDpcblx0XHRibHVyICA6IG51bGxcblx0XHRSR0IgICA6IG51bGxcblx0XHRwaXhlbCA6IG51bGxcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRAREVCVUcgPSB0cnVlXG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRhZGRHdWkgOiA9PlxuXG5cdFx0QGd1aSAgICAgICAgPSBuZXcgZGF0LkdVSVxuXHRcdEBndWlGb2xkZXJzID0ge31cblxuXHRcdCMgQGd1aSA9IG5ldyBkYXQuR1VJIGF1dG9QbGFjZSA6IGZhbHNlXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0XHQjIEBndWkuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzEwcHgnXG5cdFx0IyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBndWkuZG9tRWxlbWVudFxuXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdHZW5lcmFsJylcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfU1BFRUQnLCAwLjUsIDUpLm5hbWUoXCJnbG9iYWwgc3BlZWRcIilcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfQUxQSEEnLCAwLCAxKS5uYW1lKFwiZ2xvYmFsIGFscGhhXCIpXG5cblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ1NpemUnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUlOX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtaW4gd2lkdGgnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUFYX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtYXggd2lkdGgnKVxuXG5cdFx0QGd1aUZvbGRlcnMuY291bnRGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQ291bnQnKVxuXHRcdEBndWlGb2xkZXJzLmNvdW50Rm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdNQVhfU0hBUEVfQ09VTlQnLCA1LCAxMDAwKS5uYW1lKCdtYXggc2hhcGVzJylcblxuXHRcdEBndWlGb2xkZXJzLnNoYXBlc0ZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdTaGFwZXMnKVxuXHRcdGZvciBzaGFwZSwgaSBpbiBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlVHlwZXNcblx0XHRcdEBndWlGb2xkZXJzLnNoYXBlc0ZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZVR5cGVzW2ldLCAnYWN0aXZlJykubmFtZShzaGFwZS50eXBlKVxuXG5cdFx0QGd1aUZvbGRlcnMuYmx1ckZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdCbHVyJylcblx0XHRAZ3VpRm9sZGVycy5ibHVyRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdibHVyJykubmFtZShcImVuYWJsZVwiKVxuXHRcdEBndWlGb2xkZXJzLmJsdXJGb2xkZXIuYWRkKEBmaWx0ZXJzLmJsdXIsICdibHVyJywgMCwgMzIpLm5hbWUoXCJibHVyIGFtb3VudFwiKVxuXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ1JHQiBTcGxpdCcpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdSR0InKS5uYW1lKFwiZW5hYmxlXCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMucmVkLnZhbHVlLCAneCcsIC0yMCwgMjApLm5hbWUoXCJyZWQgeFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwicmVkIHlcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwiZ3JlZW4geFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmdyZWVuLnZhbHVlLCAneScsIC0yMCwgMjApLm5hbWUoXCJncmVlbiB5XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwiYmx1ZSB4XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwiYmx1ZSB5XCIpXG5cblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdQaXhlbGxhdGUnKVxuXHRcdEBndWlGb2xkZXJzLnBpeGVsYXRlRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdwaXhlbCcpLm5hbWUoXCJlbmFibGVcIilcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoQGZpbHRlcnMucGl4ZWwuc2l6ZSwgJ3gnLCAxLCAzMikubmFtZShcInBpeGVsIHNpemUgeFwiKVxuXHRcdEBndWlGb2xkZXJzLnBpeGVsYXRlRm9sZGVyLmFkZChAZmlsdGVycy5waXhlbC5zaXplLCAneScsIDEsIDMyKS5uYW1lKFwicGl4ZWwgc2l6ZSB5XCIpXG5cblx0XHRAZ3VpRm9sZGVycy5wYWxldHRlRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ0NvbG91ciBwYWxldHRlJylcblx0XHRAZ3VpRm9sZGVycy5wYWxldHRlRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLCAnYWN0aXZlUGFsZXR0ZScsIEludGVyYWN0aXZlQmdDb25maWcucGFsZXR0ZXMpLm5hbWUoXCJwYWxldHRlXCIpXG5cblx0XHRudWxsXG5cblx0YWRkU3RhdHMgOiA9PlxuXG5cdFx0QHN0YXRzID0gbmV3IFN0YXRzXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBzdGF0cy5kb21FbGVtZW50XG5cblx0XHRudWxsXG5cblx0YWRkU2hhcGVDb3VudGVyIDogPT5cblxuXHRcdEBzaGFwZUNvdW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG5cdFx0QHNoYXBlQ291bnRlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcblx0XHRAc2hhcGVDb3VudGVyLnN0eWxlLmxlZnQgPSAnMTAwcHgnXG5cdFx0QHNoYXBlQ291bnRlci5zdHlsZS50b3AgPSAnMTVweCdcblx0XHRAc2hhcGVDb3VudGVyLnN0eWxlLmNvbG9yID0gJyNmZmYnXG5cdFx0QHNoYXBlQ291bnRlci5zdHlsZS50ZXh0VHJhbnNmb3JtID0gJ3VwcGVyY2FzZSdcblx0XHRAc2hhcGVDb3VudGVyLmlubmVySFRNTCA9IFwiMCBzaGFwZXNcIlxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgQHNoYXBlQ291bnRlclxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZVNoYXBlQ291bnRlciA6ID0+XG5cblx0XHRAc2hhcGVDb3VudGVyLmlubmVySFRNTCA9IFwiI3tAX2dldFNoYXBlQ291bnQoKX0gc2hhcGVzXCJcblxuXHRcdG51bGxcblxuXHRjcmVhdGVMYXllcnMgOiA9PlxuXG5cdFx0Zm9yIGxheWVyLCBuYW1lIG9mIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzXG5cdFx0XHRAbGF5ZXJzW25hbWVdID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lclxuXHRcdFx0QHN0YWdlLmFkZENoaWxkIEBsYXllcnNbbmFtZV1cblxuXHRcdG51bGxcblxuXHRjcmVhdGVTdGFnZUZpbHRlcnMgOiA9PlxuXG5cdFx0QGZpbHRlcnMuYmx1ciAgPSBuZXcgUElYSS5CbHVyRmlsdGVyXG5cdFx0QGZpbHRlcnMuUkdCICAgPSBuZXcgUElYSS5SR0JTcGxpdEZpbHRlclxuXHRcdEBmaWx0ZXJzLnBpeGVsID0gbmV3IFBJWEkuUGl4ZWxhdGVGaWx0ZXJcblxuXHRcdEBmaWx0ZXJzLmJsdXIuYmx1ciA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuYmx1ci5nZW5lcmFsXG5cblx0XHRAZmlsdGVycy5SR0IudW5pZm9ybXMucmVkLnZhbHVlICAgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLlJHQi5yZWRcblx0XHRAZmlsdGVycy5SR0IudW5pZm9ybXMuZ3JlZW4udmFsdWUgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLlJHQi5ncmVlblxuXHRcdEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ibHVlLnZhbHVlICA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuUkdCLmJsdWVcblxuXHRcdEBmaWx0ZXJzLnBpeGVsLnVuaWZvcm1zLnBpeGVsU2l6ZS52YWx1ZSA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMucGl4ZWwuYW1vdW50XG5cblx0XHRudWxsXG5cblx0aW5pdDogPT5cblxuXHRcdFBJWEkuZG9udFNheUhlbGxvID0gdHJ1ZVxuXG5cdFx0QHNldERpbXMoKVxuXG5cdFx0QHNoYXBlcyAgID0gW11cblx0XHRAc3RhZ2UgICAgPSBuZXcgUElYSS5TdGFnZSAweDFBMUExQVxuXHRcdEByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyIEB3LCBAaCwgYW50aWFsaWFzIDogdHJ1ZVxuXHRcdEByZW5kZXIoKVxuXG5cdFx0SW50ZXJhY3RpdmVTaGFwZUNhY2hlLmNyZWF0ZUNhY2hlKClcblxuXHRcdEBjcmVhdGVMYXllcnMoKVxuXHRcdEBjcmVhdGVTdGFnZUZpbHRlcnMoKVxuXG5cdFx0aWYgQERFQlVHXG5cdFx0XHRAYWRkR3VpKClcblx0XHRcdEBhZGRTdGF0cygpXG5cdFx0XHRAYWRkU2hhcGVDb3VudGVyKClcblxuXHRcdEAkZWwuYXBwZW5kIEByZW5kZXJlci52aWV3XG5cblx0XHRAZHJhdygpXG5cblx0XHRudWxsXG5cblx0ZHJhdyA6ID0+XG5cblx0XHRAY291bnRlciA9IDBcblxuXHRcdEBzZXREaW1zKClcblxuXHRcdG51bGxcblxuXHRzaG93IDogPT5cblxuXHRcdEBiaW5kRXZlbnRzKClcblxuXHRcdEBhZGRTaGFwZXMgSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLklOSVRJQUxfU0hBUEVfQ09VTlRcblx0XHRAdXBkYXRlKClcblxuXHRcdG51bGxcblxuXHRhZGRTaGFwZXMgOiAoY291bnQpID0+XG5cblx0XHRmb3IgaSBpbiBbMC4uLmNvdW50XVxuXG5cdFx0XHRwb3MgPSBAX2dldFNoYXBlU3RhcnRQb3MoKVxuXG5cdFx0XHRzaGFwZSAgPSBuZXcgQWJzdHJhY3RTaGFwZSBAXG5cdFx0XHRzcHJpdGUgPSBzaGFwZS5nZXRTcHJpdGUoKVxuXHRcdFx0bGF5ZXIgID0gc2hhcGUuZ2V0TGF5ZXIoKVxuXG5cdFx0XHRzcHJpdGUucG9zaXRpb24ueCA9IHBvcy54XG5cdFx0XHRzcHJpdGUucG9zaXRpb24ueSA9IHBvcy55XG5cblx0XHRcdEBsYXllcnNbbGF5ZXJdLmFkZENoaWxkIHNwcml0ZVxuXG5cdFx0XHRAc2hhcGVzLnB1c2ggc2hhcGVcblxuXHRcdG51bGxcblxuXHRfZ2V0U2hhcGVTdGFydFBvcyA6ID0+XG5cblx0XHR4ID0gKE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEB3NCwgQHcpICsgKEB3NCozKVxuXHRcdHkgPSAoTnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgMCwgKEBoNCozKSkgLSBAaDQqM1xuXG5cdFx0cmV0dXJuIHt4LCB5fVxuXG5cdF9nZXRTaGFwZUNvdW50IDogPT5cblxuXHRcdGNvdW50ID0gMFxuXHRcdChjb3VudCs9ZGlzcGxheUNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGgpIGZvciBsYXllciwgZGlzcGxheUNvbnRhaW5lciBvZiBAbGF5ZXJzXG5cblx0XHRjb3VudFxuXG5cdHJlbW92ZVNoYXBlIDogKHNoYXBlKSA9PlxuXG5cdFx0aW5kZXggPSBAc2hhcGVzLmluZGV4T2Ygc2hhcGVcblx0XHQjIEBzaGFwZXMuc3BsaWNlIGluZGV4LCAxXG5cdFx0QHNoYXBlc1tpbmRleF0gPSBudWxsXG5cblx0XHRsYXllclBhcmVudCA9IEBsYXllcnNbc2hhcGUuZ2V0TGF5ZXIoKV1cblx0XHRsYXllclBhcmVudC5yZW1vdmVDaGlsZCBzaGFwZS5zXG5cblx0XHRpZiBAX2dldFNoYXBlQ291bnQoKSA8IEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5NQVhfU0hBUEVfQ09VTlQgdGhlbiBAYWRkU2hhcGVzIDFcblxuXHRcdG51bGxcblxuXHR1cGRhdGUgOiA9PlxuXG5cdFx0aWYgd2luZG93LlNUT1AgdGhlbiByZXR1cm4gcmVxdWVzdEFuaW1GcmFtZSBAdXBkYXRlXG5cblx0XHRpZiBAREVCVUcgdGhlbiBAc3RhdHMuYmVnaW4oKVxuXG5cdFx0QGNvdW50ZXIrK1xuXG5cdFx0aWYgKEBjb3VudGVyICUgNCBpcyAwKSBhbmQgKEBfZ2V0U2hhcGVDb3VudCgpIDwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLk1BWF9TSEFQRV9DT1VOVCkgdGhlbiBAYWRkU2hhcGVzIDFcblxuXHRcdEB1cGRhdGVTaGFwZXMoKVxuXHRcdEByZW5kZXIoKVxuXG5cdFx0ZmlsdGVyc1RvQXBwbHkgPSBbXVxuXHRcdChmaWx0ZXJzVG9BcHBseS5wdXNoIEBmaWx0ZXJzW2ZpbHRlcl0gaWYgZW5hYmxlZCkgZm9yIGZpbHRlciwgZW5hYmxlZCBvZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnNcblxuXHRcdEBzdGFnZS5maWx0ZXJzID0gaWYgZmlsdGVyc1RvQXBwbHkubGVuZ3RoIHRoZW4gZmlsdGVyc1RvQXBwbHkgZWxzZSBudWxsXG5cblx0XHRyZXF1ZXN0QW5pbUZyYW1lIEB1cGRhdGVcblxuXHRcdGlmIEBERUJVR1xuXHRcdFx0QHVwZGF0ZVNoYXBlQ291bnRlcigpXG5cdFx0XHRAc3RhdHMuZW5kKClcblxuXHRcdG51bGxcblxuXHR1cGRhdGVTaGFwZXMgOiA9PlxuXG5cdFx0KHNoYXBlPy5jYWxsQW5pbWF0ZSgpKSBmb3Igc2hhcGUgaW4gQHNoYXBlc1xuXG5cdFx0bnVsbFxuXG5cdHJlbmRlciA6ID0+XG5cblx0XHRAcmVuZGVyZXIucmVuZGVyIEBzdGFnZSBcblxuXHRcdG51bGxcblxuXHRiaW5kRXZlbnRzIDogPT5cblxuXHRcdEBOQygpLmFwcFZpZXcub24gQE5DKCkuYXBwVmlldy5FVkVOVF9VUERBVEVfRElNRU5TSU9OUywgQHNldERpbXNcblx0XHRAb24gQEVWRU5UX0tJTExfU0hBUEUsIEByZW1vdmVTaGFwZVxuXG5cdFx0bnVsbFxuXG5cdHNldERpbXMgOiA9PlxuXG5cdFx0QHcgPSBATkMoKS5hcHBWaWV3LmRpbXMud1xuXHRcdEBoID0gQE5DKCkuYXBwVmlldy5kaW1zLmhcblxuXHRcdEB3MiA9IEB3LzJcblx0XHRAaDIgPSBAaC8yXG5cblx0XHRAdzIgPSBAdy8yXG5cdFx0QGgyID0gQGgvMlxuXG5cdFx0QHc0ID0gQHcvNFxuXHRcdEBoNCA9IEBoLzRcblxuXHRcdEByZW5kZXJlcj8ucmVzaXplIEB3LCBAaFxuXG5cdFx0bnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aXZlQmdcbiIsImNsYXNzIEludGVyYWN0aXZlQmdDb25maWdcblxuXHRAY29sb3JzIDpcblx0XHQjIGh0dHA6Ly9mbGF0dWljb2xvcnMuY29tL1xuXHRcdEZMQVQgOiBbXG5cdFx0XHQnMTlCNjk4Jyxcblx0XHRcdCcyQ0MzNkInLFxuXHRcdFx0JzJFOEVDRScsXG5cdFx0XHQnOUI1MEJBJyxcblx0XHRcdCdFOThCMzknLFxuXHRcdFx0J0VBNjE1MycsXG5cdFx0XHQnRjJDQTI3J1xuXHRcdF1cblx0XHRCVyA6IFtcblx0XHRcdCdFOEU4RTgnLFxuXHRcdFx0J0QxRDFEMScsXG5cdFx0XHQnQjlCOUI5Jyxcblx0XHRcdCdBM0EzQTMnLFxuXHRcdFx0JzhDOEM4QycsXG5cdFx0XHQnNzY3Njc2Jyxcblx0XHRcdCc1RTVFNUUnXG5cdFx0XVxuXHRcdFJFRCA6IFtcblx0XHRcdCdBQTM5MzknLFxuXHRcdFx0J0Q0NkE2QScsXG5cdFx0XHQnRkZBQUFBJyxcblx0XHRcdCc4MDE1MTUnLFxuXHRcdFx0JzU1MDAwMCdcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTN2MHUwa250UytjNlhVaWtWdHN2UHpEUkthXG5cdFx0QkxVRSA6IFtcblx0XHRcdCc5RkQ0RjYnLFxuXHRcdFx0JzZFQkNFRicsXG5cdFx0XHQnNDhBOUU4Jyxcblx0XHRcdCcyNDk1REUnLFxuXHRcdFx0JzA5ODFDRidcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTJZMHUwa2xTTE9iNVZWaDNRWXFvRzd4Uy1ZXG5cdFx0R1JFRU4gOiBbXG5cdFx0XHQnOUZGNEMxJyxcblx0XHRcdCc2REU5OUYnLFxuXHRcdFx0JzQ2REQ4MycsXG5cdFx0XHQnMjVEMDZBJyxcblx0XHRcdCcwMEMyNEYnXG5cdFx0XVxuXHRcdCMgaHR0cDovL3BhbGV0dG9uLmNvbS8jdWlkPTExdzB1MGtuUncwZTRMRWpyQ0V0VHV0dVhuOVxuXHRcdFlFTExPVyA6IFtcblx0XHRcdCdGRkVGOEYnLFxuXHRcdFx0J0ZGRTk2NCcsXG5cdFx0XHQnRkZFNDQxJyxcblx0XHRcdCdGM0QzMTAnLFxuXHRcdFx0J0I4QTAwNidcblx0XHRdXG5cblx0QHBhbGV0dGVzICAgICAgOiAnZmxhdCcgOiAnRkxBVCcsICdiJncnIDogJ0JXJywgJ3JlZCcgOiAnUkVEJywgJ2JsdWUnIDogJ0JMVUUnLCAnZ3JlZW4nIDogJ0dSRUVOJywgJ3llbGxvdycgOiAnWUVMTE9XJ1xuXHRAYWN0aXZlUGFsZXR0ZSA6ICdGTEFUJ1xuXG5cdEBzaGFwZVR5cGVzOiBbXG5cdFx0e1xuXHRcdFx0dHlwZSAgIDogJ0NpcmNsZSdcblx0XHRcdGFjdGl2ZSA6IHRydWVcblx0XHR9XG5cdFx0e1xuXHRcdFx0dHlwZSAgIDogJ1NxdWFyZSdcblx0XHRcdGFjdGl2ZSA6IHRydWVcblx0XHR9XG5cdFx0e1xuXHRcdFx0dHlwZSAgIDogJ1RyaWFuZ2xlJ1xuXHRcdFx0YWN0aXZlIDogdHJ1ZVxuXHRcdH1cblx0XVxuXG5cdEBzaGFwZXMgOlxuXHRcdE1JTl9XSURUSCA6IDMwXG5cdFx0TUFYX1dJRFRIIDogNzBcblxuXHRcdE1JTl9TUEVFRF9NT1ZFIDogMlxuXHRcdE1BWF9TUEVFRF9NT1ZFIDogMy41XG5cblx0XHRNSU5fU1BFRURfUk9UQVRFIDogLTAuMDFcblx0XHRNQVhfU1BFRURfUk9UQVRFIDogMC4wMVxuXG5cdFx0TUlOX0FMUEhBIDogMVxuXHRcdE1BWF9BTFBIQSA6IDFcblxuXHRcdE1JTl9CTFVSIDogMFxuXHRcdE1BWF9CTFVSIDogMTBcblxuXHRAZ2VuZXJhbCA6IFxuXHRcdEdMT0JBTF9TUEVFRCAgICAgICAgOiAxLjhcblx0XHRHTE9CQUxfQUxQSEEgICAgICAgIDogMC43XG5cdFx0TUFYX1NIQVBFX0NPVU5UICAgICA6IDIwMFxuXHRcdElOSVRJQUxfU0hBUEVfQ09VTlQgOiAxMFxuXG5cdEBsYXllcnMgOlxuXHRcdEJBQ0tHUk9VTkQgOiAnQkFDS0dST1VORCdcblx0XHRNSURHUk9VTkQgIDogJ01JREdST1VORCdcblx0XHRGT1JFR1JPVU5EIDogJ0ZPUkVHUk9VTkQnXG5cblx0QGZpbHRlcnMgOlxuXHRcdGJsdXIgIDogZmFsc2Vcblx0XHRSR0IgICA6IGZhbHNlXG5cdFx0cGl4ZWwgOiBmYWxzZVxuXG5cdEBmaWx0ZXJEZWZhdWx0cyA6XG5cdFx0Ymx1ciA6XG5cdFx0XHRnZW5lcmFsICAgIDogMTBcblx0XHRcdGZvcmVncm91bmQgOiAwXG5cdFx0XHRtaWRncm91bmQgIDogMFxuXHRcdFx0YmFja2dyb3VuZCA6IDBcblx0XHRSR0IgOlxuXHRcdFx0cmVkICAgOiB4IDogMiwgeSA6IDJcblx0XHRcdGdyZWVuIDogeCA6IC0yLCB5IDogMlxuXHRcdFx0Ymx1ZSAgOiB4IDogMiwgeSA6IC0yXG5cdFx0cGl4ZWwgOlxuXHRcdFx0YW1vdW50IDogeCA6IDQsIHkgOiA0XG5cblx0QGdldFJhbmRvbUNvbG9yIDogLT5cblxuXHRcdHJldHVybiBAY29sb3JzW0BhY3RpdmVQYWxldHRlXVtfLnJhbmRvbSgwLCBAY29sb3JzW0BhY3RpdmVQYWxldHRlXS5sZW5ndGgtMSldXG5cblx0QGdldFJhbmRvbVNoYXBlIDogLT5cblxuXHRcdGFjdGl2ZVNoYXBlcyA9IF8uZmlsdGVyIEBzaGFwZVR5cGVzLCAocykgLT4gcy5hY3RpdmVcblxuXHRcdHJldHVybiBhY3RpdmVTaGFwZXNbXy5yYW5kb20oMCwgYWN0aXZlU2hhcGVzLmxlbmd0aC0xKV0udHlwZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aXZlQmdDb25maWdcbiIsIkludGVyYWN0aXZlQmdDb25maWcgPSByZXF1aXJlICcuL0ludGVyYWN0aXZlQmdDb25maWcnXG5BYnN0cmFjdFNoYXBlICAgICAgID0gcmVxdWlyZSAnLi9zaGFwZXMvQWJzdHJhY3RTaGFwZSdcblxuY2xhc3MgSW50ZXJhY3RpdmVTaGFwZUNhY2hlXG5cblx0QHNoYXBlcyA6IHt9XG5cblx0QHRyaWFuZ2xlUmF0aW8gOiBNYXRoLmNvcyhNYXRoLlBJLzYpXG5cblx0QGNyZWF0ZUNhY2hlIDogLT5cblxuXHRcdCMgY291bnRlciA9IDBcblx0XHQjIHN0YXJ0VGltZSA9IERhdGUubm93KClcblxuXHRcdChAc2hhcGVzW3NoYXBlLnR5cGVdID0ge30pIGZvciBzaGFwZSBpbiBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlVHlwZXNcblxuXHRcdGZvciBwYWxldHRlLCBwYWxldHRlQ29sb3JzIG9mIEludGVyYWN0aXZlQmdDb25maWcuY29sb3JzXG5cdFx0XHRmb3IgY29sb3IgaW4gcGFsZXR0ZUNvbG9yc1xuXHRcdFx0XHRmb3Igc2hhcGUsIGNvbG9ycyBvZiBAc2hhcGVzXG5cdFx0XHRcdFx0IyBjb3VudGVyKytcblx0XHRcdFx0XHRAc2hhcGVzW3NoYXBlXVtjb2xvcl0gPSBAX2NyZWF0ZVNoYXBlIHNoYXBlLCBjb2xvclxuXG5cblx0XHQjIHRpbWVUYWtlbiA9IERhdGUubm93KCktc3RhcnRUaW1lXG5cdFx0IyBjb25zb2xlLmxvZyBcIiN7Y291bnRlcn0gc2hhcGUgY2FjaGVzIGNyZWF0ZWQgaW4gI3t0aW1lVGFrZW59bXNcIlxuXG5cdFx0bnVsbFxuXG5cdEBfY3JlYXRlU2hhcGUgOiAoc2hhcGUsIGNvbG9yKSAtPlxuXG5cdFx0aGVpZ2h0ID0gQF9nZXRIZWlnaHQgc2hhcGUsIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSFxuXG5cdFx0YyAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuXHRcdGMud2lkdGggID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIXG5cdFx0Yy5oZWlnaHQgPSBoZWlnaHRcblxuXHRcdGN0eCA9IGMuZ2V0Q29udGV4dCgnMmQnKVxuXHRcdGN0eC5maWxsU3R5bGUgPSAnIycrY29sb3Jcblx0XHRjdHguYmVnaW5QYXRoKClcblxuXHRcdEBbXCJfZHJhdyN7c2hhcGV9XCJdIGN0eCwgaGVpZ2h0XG5cblx0XHRjdHguY2xvc2VQYXRoKClcblx0XHRjdHguZmlsbCgpXG5cblx0XHRyZXR1cm4gYy50b0RhdGFVUkwoKVxuXG5cdEBfZHJhd1NxdWFyZSA6IChjdHgsIGhlaWdodCkgLT5cblxuXHRcdGN0eC5tb3ZlVG8oMCwgMClcblx0XHRjdHgubGluZVRvKDAsIGhlaWdodClcblx0XHRjdHgubGluZVRvKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCwgaGVpZ2h0KVxuXHRcdGN0eC5saW5lVG8oSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRILCAwKVxuXHRcdGN0eC5saW5lVG8oMCwgMClcblxuXHRcdG51bGxcblxuXHRAX2RyYXdUcmlhbmdsZSA6IChjdHgsIGhlaWdodCkgLT5cblxuXHRcdGN0eC5tb3ZlVG8oSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRILzIsIDApXG5cdFx0Y3R4LmxpbmVUbygwLGhlaWdodClcblx0XHRjdHgubGluZVRvKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCwgaGVpZ2h0KVxuXHRcdGN0eC5saW5lVG8oSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRILzIsIDApXG5cblx0XHRudWxsXG5cblx0QF9kcmF3Q2lyY2xlIDogKGN0eCkgLT5cblxuXHRcdGhhbGZXaWR0aCA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSC8yXG5cblx0XHRjdHguYXJjKGhhbGZXaWR0aCwgaGFsZldpZHRoLCBoYWxmV2lkdGgsIDAsIDIqTWF0aC5QSSlcblxuXHRcdG51bGxcblxuXHRAX2dldEhlaWdodCA6IChzaGFwZSwgd2lkdGgpID0+XG5cblx0XHRoZWlnaHQgPSBzd2l0Y2ggdHJ1ZVxuXHRcdFx0d2hlbiBzaGFwZSBpcyAnVHJpYW5nbGUnIHRoZW4gKHdpZHRoICogQHRyaWFuZ2xlUmF0aW8pXG5cdFx0XHRlbHNlIHdpZHRoXG5cblx0XHRoZWlnaHRcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGl2ZVNoYXBlQ2FjaGVcbiIsIkludGVyYWN0aXZlQmdDb25maWcgICA9IHJlcXVpcmUgJy4uL0ludGVyYWN0aXZlQmdDb25maWcnXG5JbnRlcmFjdGl2ZVNoYXBlQ2FjaGUgPSByZXF1aXJlICcuLi9JbnRlcmFjdGl2ZVNoYXBlQ2FjaGUnXG5OdW1iZXJVdGlscyAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi91dGlscy9OdW1iZXJVdGlscydcblxuY2xhc3MgQWJzdHJhY3RTaGFwZVxuXG5cdHMgOiBudWxsXG5cblx0X3NoYXBlIDogbnVsbFxuXHRfY29sb3IgOiBudWxsXG5cblx0d2lkdGggICAgICAgOiBudWxsXG5cdHNwZWVkTW92ZSAgIDogbnVsbFxuXHRzcGVlZFJvdGF0ZSA6IG51bGxcblx0Ymx1clZhbHVlICAgOiBudWxsXG5cdGFscGhhVmFsdWUgIDogbnVsbFxuXG5cdGRlYWQgOiBmYWxzZVxuXG5cdEB0cmlhbmdsZVJhdGlvIDogTWF0aC5jb3MoTWF0aC5QSS82KVxuXG5cdGNvbnN0cnVjdG9yIDogKEBpbnRlcmFjdGl2ZUJnKSAtPlxuXG5cdFx0Xy5leHRlbmQgQCwgQmFja2JvbmUuRXZlbnRzXG5cblx0XHRAX3NoYXBlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZXRSYW5kb21TaGFwZSgpXG5cdFx0QF9jb2xvciA9IEludGVyYWN0aXZlQmdDb25maWcuZ2V0UmFuZG9tQ29sb3IoKVxuXG5cdFx0QHdpZHRoICAgICAgID0gQF9nZXRXaWR0aCgpXG5cdFx0QGhlaWdodCAgICAgID0gQF9nZXRIZWlnaHQgQF9zaGFwZSwgQHdpZHRoXG5cdFx0QHNwZWVkTW92ZSAgID0gQF9nZXRTcGVlZE1vdmUoKVxuXHRcdEBzcGVlZFJvdGF0ZSA9IEBfZ2V0U3BlZWRSb3RhdGUoKVxuXHRcdEBibHVyVmFsdWUgICA9IEBfZ2V0Qmx1clZhbHVlKClcblx0XHRAYWxwaGFWYWx1ZSAgPSBAX2dldEFscGhhVmFsdWUoKVxuXG5cdFx0QHMgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlIEludGVyYWN0aXZlU2hhcGVDYWNoZS5zaGFwZXNbQF9zaGFwZV1bQF9jb2xvcl1cblxuXHRcdEBzLndpZHRoICAgICA9IEB3aWR0aFxuXHRcdEBzLmhlaWdodCAgICA9IEBoZWlnaHRcblx0XHRAcy5ibGVuZE1vZGUgPSBQSVhJLmJsZW5kTW9kZXMuQUREXG5cdFx0QHMuYWxwaGEgICAgID0gQGFscGhhVmFsdWVcblx0XHRAcy5hbmNob3IueCAgPSBAcy5hbmNob3IueSA9IDAuNVxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRfZ2V0V2lkdGggOiA9PlxuXG5cdFx0TnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRILCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEhcblxuXHRfZ2V0SGVpZ2h0IDogKHNoYXBlLCB3aWR0aCkgPT5cblxuXHRcdGhlaWdodCA9IHN3aXRjaCB0cnVlXG5cdFx0XHR3aGVuIHNoYXBlIGlzICdUcmlhbmdsZScgdGhlbiAod2lkdGggKiBBYnN0cmFjdFNoYXBlLnRyaWFuZ2xlUmF0aW8pXG5cdFx0XHRlbHNlIHdpZHRoXG5cblx0XHRoZWlnaHRcblxuXHRfZ2V0U3BlZWRNb3ZlIDogPT5cblxuXHRcdE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9TUEVFRF9NT1ZFLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfU1BFRURfTU9WRVxuXG5cdF9nZXRTcGVlZFJvdGF0ZSA6ID0+XG5cblx0XHROdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fU1BFRURfUk9UQVRFLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfU1BFRURfUk9UQVRFXG5cblx0X2dldEJsdXJWYWx1ZSA6ID0+XG5cblx0XHRyYW5nZSA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9CTFVSIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX0JMVVJcblx0XHRibHVyICA9ICgoQHdpZHRoIC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIKSAqIHJhbmdlKSArIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9CTFVSXG5cblx0XHRibHVyXG5cblx0X2dldEFscGhhVmFsdWUgOiA9PlxuXG5cdFx0cmFuZ2UgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfQUxQSEEgLSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQUxQSEFcblx0XHRhbHBoYSA9ICgoQHdpZHRoIC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIKSAqIHJhbmdlKSArIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9BTFBIQVxuXG5cdFx0YWxwaGFcblxuXHRjYWxsQW5pbWF0ZSA6ID0+XG5cblx0XHRyZXR1cm4gdW5sZXNzICFAZGVhZFxuXG5cdFx0QHMuYWxwaGEgPSBAYWxwaGFWYWx1ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX0FMUEhBXG5cblx0XHRAcy5wb3NpdGlvbi54IC09IEBzcGVlZE1vdmUqSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXHRcdEBzLnBvc2l0aW9uLnkgKz0gQHNwZWVkTW92ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEXG5cdFx0QHMucm90YXRpb24gKz0gQHNwZWVkUm90YXRlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblxuXHRcdGlmIChAcy5wb3NpdGlvbi54ICsgKEB3aWR0aC8yKSA8IDApIG9yIChAcy5wb3NpdGlvbi55IC0gKEB3aWR0aC8yKSA+IEBOQygpLmFwcFZpZXcuZGltcy5oKSB0aGVuIEBraWxsKClcblxuXHRcdG51bGxcblxuXHRraWxsIDogPT5cblxuXHRcdEBkZWFkID0gdHJ1ZVxuXG5cdFx0QGludGVyYWN0aXZlQmcudHJpZ2dlciBAaW50ZXJhY3RpdmVCZy5FVkVOVF9LSUxMX1NIQVBFLCBAXG5cblx0Z2V0U3ByaXRlIDogPT5cblxuXHRcdHJldHVybiBAc1xuXG5cdGdldExheWVyIDogPT5cblxuXHRcdHJhbmdlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRIXG5cblx0XHRsYXllciA9IHN3aXRjaCB0cnVlXG5cdFx0XHR3aGVuIEB3aWR0aCA8IChyYW5nZSAvIDMpK0ludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCB0aGVuIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLkJBQ0tHUk9VTkRcblx0XHRcdHdoZW4gQHdpZHRoIDwgKChyYW5nZSAvIDMpICogMikrSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRIIHRoZW4gSW50ZXJhY3RpdmVCZ0NvbmZpZy5sYXllcnMuTUlER1JPVU5EXG5cdFx0XHRlbHNlIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLkZPUkVHUk9VTkRcblxuXHRcdGxheWVyXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0U2hhcGVcbiJdfQ==
