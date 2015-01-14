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
var AbstractShape, AbstractView, InteractiveBg, InteractiveBgConfig, NumberUtils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

AbstractShape = require('./shapes/AbstractShape');

NumberUtils = require('../../utils/NumberUtils');

InteractiveBgConfig = require('./InteractiveBgConfig');

InteractiveBg = (function(_super) {
  __extends(InteractiveBg, _super);

  InteractiveBg.prototype.template = 'interactive-background';

  InteractiveBg.prototype.stage = null;

  InteractiveBg.prototype.layers = {};

  InteractiveBg.prototype.renderer = null;

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
    this.addStats = __bind(this.addStats, this);
    this.addGui = __bind(this.addGui, this);
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
    this.createLayers();
    this.createStageFilters();
    this.addGui();
    this.addStats();
    this.$el.append(this.renderer.view);
    this.draw();
    return null;
  };

  InteractiveBg.prototype.draw = function() {
    this.counter = 0;
    this.bindEvents();
    this.setDims();
    return null;
  };

  InteractiveBg.prototype.show = function() {
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
    this.stats.begin();
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
    this.stats.end();
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



},{"../../utils/NumberUtils":7,"../AbstractView":8,"./InteractiveBgConfig":10,"./shapes/AbstractShape":11}],10:[function(require,module,exports){
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
    GLOBAL_SPEED: 1,
    GLOBAL_ALPHA: 1,
    MAX_SHAPE_COUNT: 80,
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
var AbstractShape, InteractiveBgConfig, NumberUtils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

InteractiveBgConfig = require('../InteractiveBgConfig');

NumberUtils = require('../../../utils/NumberUtils');

AbstractShape = (function() {
  AbstractShape.prototype.g = null;

  AbstractShape.prototype.s = null;

  AbstractShape.prototype.width = null;

  AbstractShape.prototype.speedMove = null;

  AbstractShape.prototype.speedRotate = null;

  AbstractShape.prototype.blurValue = null;

  AbstractShape.prototype.alphaValue = null;

  AbstractShape.prototype.dead = false;

  function AbstractShape(interactiveBg) {
    var shapeToDraw;
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
    this._getWidth = __bind(this._getWidth, this);
    this._drawSquare = __bind(this._drawSquare, this);
    this._drawCircle = __bind(this._drawCircle, this);
    this._drawTriangle = __bind(this._drawTriangle, this);
    _.extend(this, Backbone.Events);
    this.width = this._getWidth();
    this.speedMove = this._getSpeedMove();
    this.speedRotate = this._getSpeedRotate();
    this.blurValue = this._getBlurValue();
    this.alphaValue = this._getAlphaValue();
    this.g = new PIXI.Graphics;
    this.g.beginFill('0x' + InteractiveBgConfig.getRandomColor());
    shapeToDraw = InteractiveBgConfig.getRandomShape();
    this["_draw" + shapeToDraw]();
    this.g.endFill();
    this.g.boundsPadding = this.width * 1.2;
    this.s = new PIXI.Sprite(this.g.generateTexture());
    this.s.blendMode = window.blend || PIXI.blendModes.ADD;
    this.s.alpha = this.alphaValue;
    this.s.anchor.x = this.s.anchor.y = 0.5;
    return null;
  }

  AbstractShape.prototype._drawTriangle = function() {
    this.g.moveTo(0, 0);
    this.g.lineTo(-this.width / 2, this.width);
    this.g.lineTo(this.width / 2, this.width);
    return null;
  };

  AbstractShape.prototype._drawCircle = function() {
    this.g.drawCircle(0, 0, this.width / 2);
    return null;
  };

  AbstractShape.prototype._drawSquare = function() {
    this.g.drawRect(0, 0, this.width, this.width);
    return null;
  };

  AbstractShape.prototype._getWidth = function() {
    return NumberUtils.getRandomFloat(InteractiveBgConfig.shapes.MIN_WIDTH, InteractiveBgConfig.shapes.MAX_WIDTH);
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



},{"../../../utils/NumberUtils":7,"../InteractiveBgConfig":10}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL051bWJlclV0aWxzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZy5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmdDb25maWcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9zaGFwZXMvQWJzdHJhY3RTaGFwZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhCQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBS0E7QUFBQTs7O0dBTEE7O0FBQUEsT0FXQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxVQVlBLEdBQWEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFwQyxDQVpiLENBQUE7O0FBQUEsSUFlQSxHQUFVLE9BQUgsR0FBZ0IsRUFBaEIsR0FBeUIsTUFBQSxJQUFVLFFBZjFDLENBQUE7O0FBaUJBLElBQUcsVUFBSDtBQUNDLEVBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUF6QixJQUFzQyxhQUF0QyxDQUREO0NBQUEsTUFBQTtBQUlDLEVBQUEsSUFBSSxDQUFDLEVBQUwsR0FBYyxJQUFBLEdBQUEsQ0FBSSxPQUFKLENBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFSLENBQUEsQ0FEQSxDQUpEO0NBakJBOzs7OztBQ0FBLElBQUEsbUNBQUE7RUFBQSxrRkFBQTs7QUFBQSxPQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FBZixDQUFBOztBQUFBLE9BQ0EsR0FBZSxPQUFBLENBQVEsV0FBUixDQURmLENBQUE7O0FBQUEsWUFFQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUZmLENBQUE7O0FBQUE7QUFNSSxnQkFBQSxJQUFBLEdBQWtCLElBQWxCLENBQUE7O0FBQUEsZ0JBQ0EsU0FBQSxHQUFrQixN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QUFDLE1BQU0sQ0FBQyxTQUZwRDtpQkFFbUUsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBRjlGO0FBQUE7aUJBR0YsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFdBSHpCO0FBQUE7aUJBRlIsQ0FBQTtXQU9BLE1BVFU7RUFBQSxDQXZIWCxDQUFBOztBQUFBLDBCQWtJQSxFQUFBLEdBQUssU0FBQSxHQUFBO0FBRUosV0FBTyxNQUFNLENBQUMsRUFBZCxDQUZJO0VBQUEsQ0FsSUwsQ0FBQTs7dUJBQUE7O0lBTEQsQ0FBQTs7QUFBQSxNQTJJTSxDQUFDLE9BQVAsR0FBaUIsYUEzSWpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbiMgUFJPRFVDVElPTiBFTlZJUk9OTUVOVCAtIG1heSB3YW50IHRvIHVzZSBzZXJ2ZXItc2V0IHZhcmlhYmxlcyBoZXJlXG4jIElTX0xJVkUgPSBkbyAtPiByZXR1cm4gaWYgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignbG9jYWxob3N0JykgPiAtMSBvciB3aW5kb3cubG9jYXRpb24uc2VhcmNoIGlzICc/ZCcgdGhlbiBmYWxzZSBlbHNlIHRydWVcblxuIyMjXG5cbldJUCAtIHRoaXMgd2lsbCBpZGVhbGx5IGNoYW5nZSB0byBvbGQgZm9ybWF0IChhYm92ZSkgd2hlbiBjYW4gZmlndXJlIGl0IG91dFxuXG4jIyNcblxuSVNfTElWRSAgICA9IGZhbHNlXG5JU19QUkVWSUVXID0gL3ByZXZpZXc9dHJ1ZS8udGVzdCh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuXG4jIE9OTFkgRVhQT1NFIEFQUCBHTE9CQUxMWSBJRiBMT0NBTCBPUiBERVYnSU5HXG52aWV3ID0gaWYgSVNfTElWRSB0aGVuIHt9IGVsc2UgKHdpbmRvdyBvciBkb2N1bWVudClcblxuaWYgSVNfUFJFVklFV1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgSVNfUFJFVklFVydcbmVsc2Vcblx0IyBERUNMQVJFIE1BSU4gQVBQTElDQVRJT05cblx0dmlldy5OQyA9IG5ldyBBcHAgSVNfTElWRVxuXHR2aWV3Lk5DLmluaXQoKVxuIiwiQXBwRGF0YSAgICAgID0gcmVxdWlyZSAnLi9BcHBEYXRhJ1xuQXBwVmlldyAgICAgID0gcmVxdWlyZSAnLi9BcHBWaWV3J1xuTWVkaWFRdWVyaWVzID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5cbmNsYXNzIEFwcFxuXG4gICAgTElWRSAgICAgICAgICAgIDogbnVsbFxuICAgIEJBU0VfUEFUSCAgICAgICA6IHdpbmRvdy5jb25maWcuYmFzZV9wYXRoXG4gICAgQkFTRV9VUkwgICAgICAgIDogd2luZG93LmNvbmZpZy5iYXNlX3VybFxuICAgIEJBU0VfVVJMX0FTU0VUUyA6IHdpbmRvdy5jb25maWcuYmFzZV91cmxfYXNzZXRzXG4gICAgb2JqUmVhZHkgICAgICAgIDogMFxuXG4gICAgX3RvQ2xlYW4gICA6IFsnb2JqUmVhZHknLCAnc2V0RmxhZ3MnLCAnb2JqZWN0Q29tcGxldGUnLCAnaW5pdCcsICdpbml0T2JqZWN0cycsICdpbml0U0RLcycsICdpbml0QXBwJywgJ2dvJywgJ2NsZWFudXAnLCAnX3RvQ2xlYW4nXVxuXG4gICAgY29uc3RydWN0b3IgOiAoQExJVkUpIC0+XG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIHNldEZsYWdzIDogPT5cblxuICAgICAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKClcblxuICAgICAgICBNZWRpYVF1ZXJpZXMuc2V0dXAoKTtcblxuICAgICAgICAjIEBJU19BTkRST0lEICAgID0gdWEuaW5kZXhPZignYW5kcm9pZCcpID4gLTFcbiAgICAgICAgIyBASVNfRklSRUZPWCAgICA9IHVhLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xXG4gICAgICAgICMgQElTX0NIUk9NRV9JT1MgPSBpZiB1YS5tYXRjaCgnY3Jpb3MnKSB0aGVuIHRydWUgZWxzZSBmYWxzZSAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzODA4MDUzXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb2JqZWN0Q29tcGxldGUgOiA9PlxuXG4gICAgICAgIEBvYmpSZWFkeSsrXG4gICAgICAgIEBpbml0QXBwKCkgaWYgQG9ialJlYWR5ID49IDFcblxuICAgICAgICBudWxsXG5cbiAgICBpbml0IDogPT5cblxuICAgICAgICAjIGN1cnJlbnRseSBubyBvYmplY3RzIHRvIGxvYWQgaGVyZSwgc28ganVzdCBzdGFydCBhcHBcbiAgICAgICAgIyBAaW5pdE9iamVjdHMoKVxuXG4gICAgICAgIEBpbml0QXBwKClcblxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRPYmplY3RzIDogPT5cblxuICAgICMgICAgIEB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVzIFwiI3tAQkFTRV9VUkxfQVNTRVRTfS9kYXRhL3RlbXBsYXRlcyN7KGlmIEBMSVZFIHRoZW4gJy5taW4nIGVsc2UgJycpfS54bWxcIiwgQG9iamVjdENvbXBsZXRlXG5cbiAgICAjICAgICAjIGlmIG5ldyBvYmplY3RzIGFyZSBhZGRlZCBkb24ndCBmb3JnZXQgdG8gY2hhbmdlIHRoZSBgQG9iamVjdENvbXBsZXRlYCBmdW5jdGlvblxuXG4gICAgIyAgICAgbnVsbFxuXG4gICAgaW5pdEFwcCA6ID0+XG5cbiAgICAgICAgQHNldEZsYWdzKClcblxuICAgICAgICAjIyMgU3RhcnRzIGFwcGxpY2F0aW9uICMjI1xuICAgICAgICBAYXBwRGF0YSA9IG5ldyBBcHBEYXRhXG4gICAgICAgIEBhcHBWaWV3ID0gbmV3IEFwcFZpZXdcblxuICAgICAgICBAZ28oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGdvIDogPT5cblxuICAgICAgICAjIyMgQWZ0ZXIgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGtpY2tzIG9mZiB3ZWJzaXRlICMjI1xuICAgICAgICBAYXBwVmlldy5yZW5kZXIoKVxuXG4gICAgICAgICMjIyByZW1vdmUgcmVkdW5kYW50IGluaXRpYWxpc2F0aW9uIG1ldGhvZHMgLyBwcm9wZXJ0aWVzICMjI1xuICAgICAgICBAY2xlYW51cCgpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgY2xlYW51cCA6ID0+XG5cbiAgICAgICAgZm9yIGZuIGluIEBfdG9DbGVhblxuICAgICAgICAgICAgQFtmbl0gPSBudWxsXG4gICAgICAgICAgICBkZWxldGUgQFtmbl1cblxuICAgICAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwXG4iLCJBYnN0cmFjdERhdGEgPSByZXF1aXJlICcuL2RhdGEvQWJzdHJhY3REYXRhJ1xuXG5jbGFzcyBBcHBEYXRhIGV4dGVuZHMgQWJzdHJhY3REYXRhXG5cbiAgICBjb25zdHJ1Y3RvciA6IC0+XG5cbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwRGF0YVxuIiwiQWJzdHJhY3RWaWV3ICA9IHJlcXVpcmUgJy4vdmlldy9BYnN0cmFjdFZpZXcnXG5NZWRpYVF1ZXJpZXMgID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5JbnRlcmFjdGl2ZUJnID0gcmVxdWlyZSAnLi92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmcnXG5cbmNsYXNzIEFwcFZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuICAgIHRlbXBsYXRlIDogJ21haW4nXG5cbiAgICAkd2luZG93ICA6IG51bGxcbiAgICAkYm9keSAgICA6IG51bGxcblxuICAgIHdyYXBwZXIgIDogbnVsbFxuXG4gICAgZGltcyA6XG4gICAgICAgIHcgOiBudWxsXG4gICAgICAgIGggOiBudWxsXG4gICAgICAgIG8gOiBudWxsXG4gICAgICAgIGMgOiBudWxsXG4gICAgICAgIHIgOiBudWxsXG5cbiAgICByd2RTaXplcyA6XG4gICAgICAgIExBUkdFICA6ICdMUkcnXG4gICAgICAgIE1FRElVTSA6ICdNRUQnXG4gICAgICAgIFNNQUxMICA6ICdTTUwnXG5cbiAgICBsYXN0U2Nyb2xsWSA6IDBcbiAgICB0aWNraW5nICAgICA6IGZhbHNlXG5cbiAgICBFVkVOVF9VUERBVEVfRElNRU5TSU9OUyA6ICdFVkVOVF9VUERBVEVfRElNRU5TSU9OUydcbiAgICBFVkVOVF9PTl9TQ1JPTEwgICAgICAgICA6ICdFVkVOVF9PTl9TQ1JPTEwnXG5cbiAgICBNT0JJTEVfV0lEVEggOiA3MDBcbiAgICBNT0JJTEUgICAgICAgOiAnbW9iaWxlJ1xuICAgIE5PTl9NT0JJTEUgICA6ICdub25fbW9iaWxlJ1xuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIEAkd2luZG93ID0gJCh3aW5kb3cpXG4gICAgICAgIEAkYm9keSAgID0gJCgnYm9keScpLmVxKDApXG5cbiAgICAgICAgIyB0aGVzZSwgcmF0aGVyIHRoYW4gY2FsbGluZyBzdXBlclxuICAgICAgICBAc2V0RWxlbWVudCBAJGJvZHkuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuICAgICAgICBAY2hpbGRyZW4gPSBbXVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICBkaXNhYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub24gJ3RvdWNobW92ZScsIEBvblRvdWNoTW92ZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZW5hYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub2ZmICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uVG91Y2hNb3ZlOiAoIGUgKSAtPlxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVuZGVyIDogPT5cblxuICAgICAgICBAYmluZEV2ZW50cygpXG5cbiAgICAgICAgQGludGVyYWN0aXZlQmcgPSBuZXcgSW50ZXJhY3RpdmVCZ1xuXG4gICAgICAgIEBhZGRDaGlsZCBAaW50ZXJhY3RpdmVCZ1xuXG4gICAgICAgIEBvbkFsbFJlbmRlcmVkKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGJpbmRFdmVudHMgOiA9PlxuXG4gICAgICAgIEBvbiAnYWxsUmVuZGVyZWQnLCBAb25BbGxSZW5kZXJlZFxuXG4gICAgICAgIEBvblJlc2l6ZSgpXG5cbiAgICAgICAgQG9uUmVzaXplID0gXy5kZWJvdW5jZSBAb25SZXNpemUsIDMwMFxuICAgICAgICBAJHdpbmRvdy5vbiAncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgQG9uUmVzaXplXG4gICAgICAgIEAkd2luZG93Lm9uIFwic2Nyb2xsXCIsIEBvblNjcm9sbFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25TY3JvbGwgOiA9PlxuXG4gICAgICAgIEBsYXN0U2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZXG4gICAgICAgIEByZXF1ZXN0VGljaygpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgcmVxdWVzdFRpY2sgOiA9PlxuXG4gICAgICAgIGlmICFAdGlja2luZ1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBzY3JvbGxVcGRhdGVcbiAgICAgICAgICAgIEB0aWNraW5nID0gdHJ1ZVxuXG4gICAgICAgIG51bGxcblxuICAgIHNjcm9sbFVwZGF0ZSA6ID0+XG5cbiAgICAgICAgQHRpY2tpbmcgPSBmYWxzZVxuXG4gICAgICAgIEAkYm9keS5hZGRDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0IEB0aW1lclNjcm9sbFxuXG4gICAgICAgIEB0aW1lclNjcm9sbCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEAkYm9keS5yZW1vdmVDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG4gICAgICAgICwgNTBcblxuICAgICAgICBAdHJpZ2dlciBBcHBWaWV3LkVWRU5UX09OX1NDUk9MTFxuXG4gICAgICAgIG51bGxcblxuICAgIG9uQWxsUmVuZGVyZWQgOiA9PlxuXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJvbkFsbFJlbmRlcmVkIDogPT5cIlxuICAgICAgICBAYmVnaW4oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGJlZ2luIDogPT5cblxuICAgICAgICBAdHJpZ2dlciAnc3RhcnQnXG5cbiAgICAgICAgQG9uU2Nyb2xsKClcbiAgICAgICAgQGludGVyYWN0aXZlQmcuc2hvdygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblJlc2l6ZSA6ID0+XG5cbiAgICAgICAgQGdldERpbXMoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0RGltcyA6ID0+XG5cbiAgICAgICAgdyA9IHdpbmRvdy5pbm5lcldpZHRoIG9yIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCBvciBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXG4gICAgICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgb3IgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCBvciBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxuXG4gICAgICAgIEBkaW1zID1cbiAgICAgICAgICAgIHcgOiB3XG4gICAgICAgICAgICBoIDogaFxuICAgICAgICAgICAgbyA6IGlmIGggPiB3IHRoZW4gJ3BvcnRyYWl0JyBlbHNlICdsYW5kc2NhcGUnXG4gICAgICAgICAgICBjIDogaWYgdyA8PSBATU9CSUxFX1dJRFRIIHRoZW4gQE1PQklMRSBlbHNlIEBOT05fTU9CSUxFXG4gICAgICAgICAgICByIDogQGdldFJ3ZFNpemUgdywgaCwgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIG9yIDEpXG5cbiAgICAgICAgQHRyaWdnZXIgQEVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAZGltc1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0UndkU2l6ZSA6ICh3LCBoLCBkcHIpID0+XG5cbiAgICAgICAgcHcgPSB3KmRwclxuXG4gICAgICAgIHNpemUgPSBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgICAgd2hlbiBwdyA+IDE0NDAgdGhlbiBAcndkU2l6ZXMuTEFSR0VcbiAgICAgICAgICAgIHdoZW4gcHcgPCA2NTAgdGhlbiBAcndkU2l6ZXMuU01BTExcbiAgICAgICAgICAgIGVsc2UgQHJ3ZFNpemVzLk1FRElVTVxuXG4gICAgICAgIHNpemVcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3XG4iLCJjbGFzcyBBYnN0cmFjdERhdGFcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdHJldHVybiBudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0RGF0YVxuIiwiIyAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIE1lZGlhIFF1ZXJpZXMgTWFuYWdlciBcbiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBcbiMgICBAYXV0aG9yIDogRsOhYmlvIEF6ZXZlZG8gPGZhYmlvLmF6ZXZlZG9AdW5pdDkuY29tPiBVTklUOVxuIyAgIEBkYXRlICAgOiBTZXB0ZW1iZXIgMTRcbiMgICBcbiMgICBJbnN0cnVjdGlvbnMgYXJlIG9uIC9wcm9qZWN0L3Nhc3MvdXRpbHMvX3Jlc3BvbnNpdmUuc2Nzcy5cblxuY2xhc3MgTWVkaWFRdWVyaWVzXG5cbiAgICAjIEJyZWFrcG9pbnRzXG4gICAgQFNNQUxMRVNUICAgIDogXCJzbWFsbGVzdFwiXG4gICAgQFNNQUxMICAgICAgIDogXCJzbWFsbFwiXG4gICAgQElQQUQgICAgICAgIDogXCJpcGFkXCJcbiAgICBATUVESVVNICAgICAgOiBcIm1lZGl1bVwiXG4gICAgQExBUkdFICAgICAgIDogXCJsYXJnZVwiXG4gICAgQEVYVFJBX0xBUkdFIDogXCJleHRyYS1sYXJnZVwiXG5cbiAgICBAc2V0dXAgOiA9PlxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTEVTVF9CUkVBS1BPSU5UID0ge25hbWU6IFwiU21hbGxlc3RcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuU01BTExFU1RdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIlNtYWxsXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNULCBNZWRpYVF1ZXJpZXMuU01BTExdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlQgICA9IHtuYW1lOiBcIk1lZGl1bVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5NRURJVU1dfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTEFSR0VfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIkxhcmdlXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLklQQUQsIE1lZGlhUXVlcmllcy5MQVJHRSwgTWVkaWFRdWVyaWVzLkVYVFJBX0xBUkdFXX1cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFMgPSBbXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5NRURJVU1fQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm5cblxuICAgIEBnZXREZXZpY2VTdGF0ZSA6ID0+XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIFwiYWZ0ZXJcIikuZ2V0UHJvcGVydHlWYWx1ZShcImNvbnRlbnRcIik7XG5cbiAgICBAZ2V0QnJlYWtwb2ludCA6ID0+XG5cbiAgICAgICAgc3RhdGUgPSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuXG4gICAgICAgIGZvciBpIGluIFswLi4uTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTLmxlbmd0aF1cbiAgICAgICAgICAgIGlmIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5icmVha3BvaW50cy5pbmRleE9mKHN0YXRlKSA+IC0xXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5uYW1lXG5cbiAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgIEBpc0JyZWFrcG9pbnQgOiAoYnJlYWtwb2ludCkgPT5cblxuICAgICAgICBmb3IgaSBpbiBbMC4uLmJyZWFrcG9pbnQuYnJlYWtwb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBicmVha3BvaW50LmJyZWFrcG9pbnRzW2ldID09IE1lZGlhUXVlcmllcy5nZXREZXZpY2VTdGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYVF1ZXJpZXNcbiIsImNsYXNzIE51bWJlclV0aWxzXG5cbiAgICBATUFUSF9DT1M6IE1hdGguY29zIFxuICAgIEBNQVRIX1NJTjogTWF0aC5zaW4gXG4gICAgQE1BVEhfUkFORE9NOiBNYXRoLnJhbmRvbSBcbiAgICBATUFUSF9BQlM6IE1hdGguYWJzXG4gICAgQE1BVEhfQVRBTjI6IE1hdGguYXRhbjJcblxuICAgIEBsaW1pdDoobnVtYmVyLCBtaW4sIG1heCktPlxuICAgICAgICByZXR1cm4gTWF0aC5taW4oIE1hdGgubWF4KG1pbixudW1iZXIpLCBtYXggKVxuXG4gICAgQG1hcCA6IChudW0sIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIHJvdW5kID0gZmFsc2UsIGNvbnN0cmFpbk1pbiA9IHRydWUsIGNvbnN0cmFpbk1heCA9IHRydWUpIC0+XG4gICAgICAgICAgICBpZiBjb25zdHJhaW5NaW4gYW5kIG51bSA8IG1pbjEgdGhlbiByZXR1cm4gbWluMlxuICAgICAgICAgICAgaWYgY29uc3RyYWluTWF4IGFuZCBudW0gPiBtYXgxIHRoZW4gcmV0dXJuIG1heDJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbnVtMSA9IChudW0gLSBtaW4xKSAvIChtYXgxIC0gbWluMSlcbiAgICAgICAgICAgIG51bTIgPSAobnVtMSAqIChtYXgyIC0gbWluMikpICsgbWluMlxuICAgICAgICAgICAgaWYgcm91bmRcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW0yKVxuICAgICAgICAgICAgcmV0dXJuIG51bTJcblxuICAgIEBnZXRSYW5kb21Db2xvcjogLT5cblxuICAgICAgICBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKVxuICAgICAgICBjb2xvciA9ICcjJ1xuICAgICAgICBmb3IgaSBpbiBbMC4uLjZdXG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KV1cbiAgICAgICAgY29sb3JcblxuICAgIEBnZXRSYW5kb21GbG9hdCA6IChtaW4sIG1heCkgLT5cblxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcblxuICAgIEBnZXRUaW1lU3RhbXBEaWZmIDogKGRhdGUxLCBkYXRlMikgLT5cblxuICAgICAgICAjIEdldCAxIGRheSBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgb25lX2RheSA9IDEwMDAqNjAqNjAqMjRcbiAgICAgICAgdGltZSAgICA9IHt9XG5cbiAgICAgICAgIyBDb252ZXJ0IGJvdGggZGF0ZXMgdG8gbWlsbGlzZWNvbmRzXG4gICAgICAgIGRhdGUxX21zID0gZGF0ZTEuZ2V0VGltZSgpXG4gICAgICAgIGRhdGUyX21zID0gZGF0ZTIuZ2V0VGltZSgpXG5cbiAgICAgICAgIyBDYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2UgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkYXRlMl9tcyAtIGRhdGUxX21zXG5cbiAgICAgICAgIyB0YWtlIG91dCBtaWxsaXNlY29uZHNcbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvMTAwMFxuICAgICAgICB0aW1lLnNlY29uZHMgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zICUgNjApXG5cbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvNjAgXG4gICAgICAgIHRpbWUubWludXRlcyAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMgJSA2MClcblxuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGlmZmVyZW5jZV9tcy82MCBcbiAgICAgICAgdGltZS5ob3VycyAgICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcyAlIDI0KSAgXG5cbiAgICAgICAgdGltZS5kYXlzICAgICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcy8yNClcblxuICAgICAgICB0aW1lXG5cbiAgICBAbWFwOiAoIG51bSwgbWluMSwgbWF4MSwgbWluMiwgbWF4Miwgcm91bmQgPSBmYWxzZSwgY29uc3RyYWluTWluID0gdHJ1ZSwgY29uc3RyYWluTWF4ID0gdHJ1ZSApIC0+XG4gICAgICAgIGlmIGNvbnN0cmFpbk1pbiBhbmQgbnVtIDwgbWluMSB0aGVuIHJldHVybiBtaW4yXG4gICAgICAgIGlmIGNvbnN0cmFpbk1heCBhbmQgbnVtID4gbWF4MSB0aGVuIHJldHVybiBtYXgyXG4gICAgICAgIFxuICAgICAgICBudW0xID0gKG51bSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKVxuICAgICAgICBudW0yID0gKG51bTEgKiAobWF4MiAtIG1pbjIpKSArIG1pbjJcbiAgICAgICAgaWYgcm91bmQgdGhlbiByZXR1cm4gTWF0aC5yb3VuZChudW0yKVxuXG4gICAgICAgIHJldHVybiBudW0yXG5cbiAgICBAdG9SYWRpYW5zOiAoIGRlZ3JlZSApIC0+XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoIE1hdGguUEkgLyAxODAgKVxuXG4gICAgQHRvRGVncmVlOiAoIHJhZGlhbnMgKSAtPlxuICAgICAgICByZXR1cm4gcmFkaWFucyAqICggMTgwIC8gTWF0aC5QSSApXG5cbiAgICBAaXNJblJhbmdlOiAoIG51bSwgbWluLCBtYXgsIGNhbkJlRXF1YWwgKSAtPlxuICAgICAgICBpZiBjYW5CZUVxdWFsIHRoZW4gcmV0dXJuIG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heFxuICAgICAgICBlbHNlIHJldHVybiBudW0gPj0gbWluICYmIG51bSA8PSBtYXhcblxuICAgICMgY29udmVydCBtZXRyZXMgaW4gdG8gbSAvIEtNXG4gICAgQGdldE5pY2VEaXN0YW5jZTogKG1ldHJlcykgPT5cblxuICAgICAgICBpZiBtZXRyZXMgPCAxMDAwXG5cbiAgICAgICAgICAgIHJldHVybiBcIiN7TWF0aC5yb3VuZChtZXRyZXMpfU1cIlxuXG4gICAgICAgIGVsc2VcblxuICAgICAgICAgICAga20gPSAobWV0cmVzLzEwMDApLnRvRml4ZWQoMilcbiAgICAgICAgICAgIHJldHVybiBcIiN7a219S01cIlxuXG4gICAgQHNodWZmbGUgOiAobykgPT5cbiAgICAgICAgYGZvcih2YXIgaiwgeCwgaSA9IG8ubGVuZ3RoOyBpOyBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSksIHggPSBvWy0taV0sIG9baV0gPSBvW2pdLCBvW2pdID0geCk7YFxuICAgICAgICByZXR1cm4gb1xuXG4gICAgQHJhbmRvbVJhbmdlIDogKG1pbixtYXgpID0+XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE51bWJlclV0aWxzXG4iLCJjbGFzcyBBYnN0cmFjdFZpZXcgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3XG5cblx0ZWwgICAgICAgICAgIDogbnVsbFxuXHRpZCAgICAgICAgICAgOiBudWxsXG5cdGNoaWxkcmVuICAgICA6IG51bGxcblx0dGVtcGxhdGUgICAgIDogbnVsbFxuXHR0ZW1wbGF0ZVZhcnMgOiBudWxsXG5cblx0IyBjb3ogb24gcGFnZSBsb2FkIHdlIGFscmVhZHkgaGF2ZSB0aGUgRE9NIGZvciBhIHBhZ2UsIGl0IHdpbGwgZ2V0IGluaXRpYWxpc2VkIHR3aWNlIC0gb25jZSBvbiBjb25zdHJ1Y3Rpb24sIGFuZCBvbmNlIHdoZW4gcGFnZSBoYXMgXCJsb2FkZWRcIlxuXHRpbml0aWFsaXplZCA6IGZhbHNlXG5cdFxuXHRpbml0aWFsaXplIDogKGZvcmNlKSAtPlxuXG5cdFx0cmV0dXJuIHVubGVzcyAhQGluaXRpYWxpemVkIG9yIGZvcmNlXG5cdFx0XG5cdFx0QGNoaWxkcmVuID0gW11cblxuXHRcdGlmIEB0ZW1wbGF0ZVxuXHRcdFx0JHRtcGwgPSBATkMoKS5hcHBWaWV3LiRlbC5maW5kKFwiW2RhdGEtdGVtcGxhdGU9XFxcIiN7QHRlbXBsYXRlfVxcXCJdXCIpXG5cdFx0XHRAc2V0RWxlbWVudCAkdG1wbFxuXHRcdFx0cmV0dXJuIHVubGVzcyAkdG1wbC5sZW5ndGhcblxuXHRcdEAkZWwuYXR0ciAnaWQnLCBAaWQgaWYgQGlkXG5cdFx0QCRlbC5hZGRDbGFzcyBAY2xhc3NOYW1lIGlmIEBjbGFzc05hbWVcblx0XHRcblx0XHRAaW5pdGlhbGl6ZWQgPSB0cnVlXG5cdFx0QGluaXQoKVxuXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cblx0XHRudWxsXG5cblx0aW5pdCA6ID0+XG5cblx0XHRudWxsXG5cblx0dXBkYXRlIDogPT5cblxuXHRcdG51bGxcblxuXHRyZW5kZXIgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdGFkZENoaWxkIDogKGNoaWxkLCBwcmVwZW5kID0gZmFsc2UpID0+XG5cblx0XHRAY2hpbGRyZW4ucHVzaCBjaGlsZCBpZiBjaGlsZC5lbFxuXG5cdFx0QFxuXG5cdHJlcGxhY2UgOiAoZG9tLCBjaGlsZCkgPT5cblxuXHRcdEBjaGlsZHJlbi5wdXNoIGNoaWxkIGlmIGNoaWxkLmVsXG5cdFx0YyA9IGlmIGNoaWxkLmVsIHRoZW4gY2hpbGQuJGVsIGVsc2UgY2hpbGRcblx0XHRAJGVsLmNoaWxkcmVuKGRvbSkucmVwbGFjZVdpdGgoYylcblxuXHRcdG51bGxcblxuXHRyZW1vdmUgOiAoY2hpbGQpID0+XG5cblx0XHR1bmxlc3MgY2hpbGQ/XG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHRjID0gaWYgY2hpbGQuZWwgdGhlbiBjaGlsZC4kZWwgZWxzZSAkKGNoaWxkKVxuXHRcdGNoaWxkLmRpc3Bvc2UoKSBpZiBjIGFuZCBjaGlsZC5kaXNwb3NlXG5cblx0XHRpZiBjICYmIEBjaGlsZHJlbi5pbmRleE9mKGNoaWxkKSAhPSAtMVxuXHRcdFx0QGNoaWxkcmVuLnNwbGljZSggQGNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxIClcblxuXHRcdGMucmVtb3ZlKClcblxuXHRcdG51bGxcblxuXHRvblJlc2l6ZSA6IChldmVudCkgPT5cblxuXHRcdChpZiBjaGlsZC5vblJlc2l6ZSB0aGVuIGNoaWxkLm9uUmVzaXplKCkpIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRtb3VzZUVuYWJsZWQgOiAoIGVuYWJsZWQgKSA9PlxuXG5cdFx0QCRlbC5jc3Ncblx0XHRcdFwicG9pbnRlci1ldmVudHNcIjogaWYgZW5hYmxlZCB0aGVuIFwiYXV0b1wiIGVsc2UgXCJub25lXCJcblxuXHRcdG51bGxcblxuXHRDU1NUcmFuc2xhdGUgOiAoeCwgeSwgdmFsdWU9JyUnLCBzY2FsZSkgPT5cblxuXHRcdGlmIE1vZGVybml6ci5jc3N0cmFuc2Zvcm1zM2Rcblx0XHRcdHN0ciA9IFwidHJhbnNsYXRlM2QoI3t4K3ZhbHVlfSwgI3t5K3ZhbHVlfSwgMClcIlxuXHRcdGVsc2Vcblx0XHRcdHN0ciA9IFwidHJhbnNsYXRlKCN7eCt2YWx1ZX0sICN7eSt2YWx1ZX0pXCJcblxuXHRcdGlmIHNjYWxlIHRoZW4gc3RyID0gXCIje3N0cn0gc2NhbGUoI3tzY2FsZX0pXCJcblxuXHRcdHN0clxuXG5cdHVuTXV0ZUFsbCA6ID0+XG5cblx0XHRmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLnVuTXV0ZT8oKVxuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRjaGlsZC51bk11dGVBbGwoKVxuXG5cdFx0bnVsbFxuXG5cdG11dGVBbGwgOiA9PlxuXG5cdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC5tdXRlPygpXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdGNoaWxkLm11dGVBbGwoKVxuXG5cdFx0bnVsbFxuXG5cdHJlbW92ZUFsbENoaWxkcmVuOiA9PlxuXG5cdFx0QHJlbW92ZSBjaGlsZCBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0dHJpZ2dlckNoaWxkcmVuIDogKG1zZywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLnRyaWdnZXIgbXNnXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEB0cmlnZ2VyQ2hpbGRyZW4gbXNnLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdGNhbGxDaGlsZHJlbiA6IChtZXRob2QsIHBhcmFtcywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAY2FsbENoaWxkcmVuIG1ldGhvZCwgcGFyYW1zLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdGNhbGxDaGlsZHJlbkFuZFNlbGYgOiAobWV0aG9kLCBwYXJhbXMsIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdEBbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGRbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEBjYWxsQ2hpbGRyZW4gbWV0aG9kLCBwYXJhbXMsIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0c3VwcGxhbnRTdHJpbmcgOiAoc3RyLCB2YWxzKSAtPlxuXG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlIC97eyAoW157fV0qKSB9fS9nLCAoYSwgYikgLT5cblx0XHRcdHIgPSB2YWxzW2JdXG5cdFx0XHQoaWYgdHlwZW9mIHIgaXMgXCJzdHJpbmdcIiBvciB0eXBlb2YgciBpcyBcIm51bWJlclwiIHRoZW4gciBlbHNlIGEpXG5cblx0ZGlzcG9zZSA6ID0+XG5cblx0XHRAc3RvcExpc3RlbmluZygpXG5cblx0XHRudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0Vmlld1xuIiwiQWJzdHJhY3RWaWV3ICAgICAgICA9IHJlcXVpcmUgJy4uL0Fic3RyYWN0VmlldydcbkFic3RyYWN0U2hhcGUgICAgICAgPSByZXF1aXJlICcuL3NoYXBlcy9BYnN0cmFjdFNoYXBlJ1xuTnVtYmVyVXRpbHMgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uL3V0aWxzL051bWJlclV0aWxzJ1xuSW50ZXJhY3RpdmVCZ0NvbmZpZyA9IHJlcXVpcmUgJy4vSW50ZXJhY3RpdmVCZ0NvbmZpZydcblxuY2xhc3MgSW50ZXJhY3RpdmVCZyBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG5cdHRlbXBsYXRlIDogJ2ludGVyYWN0aXZlLWJhY2tncm91bmQnXG5cblx0c3RhZ2UgIDogbnVsbFxuXHRsYXllcnMgOiB7fVxuXG5cdHJlbmRlcmVyIDogbnVsbFxuXHRcblx0dyA6IDBcblx0aCA6IDBcblxuXHRjb3VudGVyIDogbnVsbFxuXG5cdEVWRU5UX0tJTExfU0hBUEUgOiAnRVZFTlRfS0lMTF9TSEFQRSdcblxuXHRmaWx0ZXJzIDpcblx0XHRibHVyICA6IG51bGxcblx0XHRSR0IgICA6IG51bGxcblx0XHRwaXhlbCA6IG51bGxcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRhZGRHdWkgOiA9PlxuXG5cdFx0QGd1aSAgICAgICAgPSBuZXcgZGF0LkdVSVxuXHRcdEBndWlGb2xkZXJzID0ge31cblxuXHRcdCMgQGd1aSA9IG5ldyBkYXQuR1VJIGF1dG9QbGFjZSA6IGZhbHNlXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0XHQjIEBndWkuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzEwcHgnXG5cdFx0IyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBndWkuZG9tRWxlbWVudFxuXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdHZW5lcmFsJylcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfU1BFRUQnLCAwLjUsIDUpLm5hbWUoXCJnbG9iYWwgc3BlZWRcIilcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfQUxQSEEnLCAwLCAxKS5uYW1lKFwiZ2xvYmFsIGFscGhhXCIpXG5cblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ1NpemUnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUlOX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtaW4gd2lkdGgnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUFYX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtYXggd2lkdGgnKVxuXG5cdFx0QGd1aUZvbGRlcnMuY291bnRGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQ291bnQnKVxuXHRcdEBndWlGb2xkZXJzLmNvdW50Rm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdNQVhfU0hBUEVfQ09VTlQnLCA1LCAxMDAwKS5uYW1lKCdtYXggc2hhcGVzJylcblxuXHRcdEBndWlGb2xkZXJzLnNoYXBlc0ZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdTaGFwZXMnKVxuXHRcdGZvciBzaGFwZSwgaSBpbiBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlVHlwZXNcblx0XHRcdEBndWlGb2xkZXJzLnNoYXBlc0ZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZVR5cGVzW2ldLCAnYWN0aXZlJykubmFtZShzaGFwZS50eXBlKVxuXG5cdFx0QGd1aUZvbGRlcnMuYmx1ckZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdCbHVyJylcblx0XHRAZ3VpRm9sZGVycy5ibHVyRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdibHVyJykubmFtZShcImVuYWJsZVwiKVxuXHRcdEBndWlGb2xkZXJzLmJsdXJGb2xkZXIuYWRkKEBmaWx0ZXJzLmJsdXIsICdibHVyJywgMCwgMzIpLm5hbWUoXCJibHVyIGFtb3VudFwiKVxuXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ1JHQiBTcGxpdCcpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdSR0InKS5uYW1lKFwiZW5hYmxlXCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMucmVkLnZhbHVlLCAneCcsIC0yMCwgMjApLm5hbWUoXCJyZWQgeFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwicmVkIHlcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwiZ3JlZW4geFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmdyZWVuLnZhbHVlLCAneScsIC0yMCwgMjApLm5hbWUoXCJncmVlbiB5XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwiYmx1ZSB4XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwiYmx1ZSB5XCIpXG5cblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdQaXhlbGxhdGUnKVxuXHRcdEBndWlGb2xkZXJzLnBpeGVsYXRlRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMsICdwaXhlbCcpLm5hbWUoXCJlbmFibGVcIilcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoQGZpbHRlcnMucGl4ZWwuc2l6ZSwgJ3gnLCAxLCAzMikubmFtZShcInBpeGVsIHNpemUgeFwiKVxuXHRcdEBndWlGb2xkZXJzLnBpeGVsYXRlRm9sZGVyLmFkZChAZmlsdGVycy5waXhlbC5zaXplLCAneScsIDEsIDMyKS5uYW1lKFwicGl4ZWwgc2l6ZSB5XCIpXG5cblx0XHRAZ3VpRm9sZGVycy5wYWxldHRlRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ0NvbG91ciBwYWxldHRlJylcblx0XHRAZ3VpRm9sZGVycy5wYWxldHRlRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLCAnYWN0aXZlUGFsZXR0ZScsIEludGVyYWN0aXZlQmdDb25maWcucGFsZXR0ZXMpLm5hbWUoXCJwYWxldHRlXCIpXG5cblx0XHRudWxsXG5cblx0YWRkU3RhdHMgOiA9PlxuXG5cdFx0QHN0YXRzID0gbmV3IFN0YXRzXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG5cdFx0QHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBzdGF0cy5kb21FbGVtZW50XG5cblx0XHRudWxsXG5cblx0Y3JlYXRlTGF5ZXJzIDogPT5cblxuXHRcdGZvciBsYXllciwgbmFtZSBvZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVyc1xuXHRcdFx0QGxheWVyc1tuYW1lXSA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXJcblx0XHRcdEBzdGFnZS5hZGRDaGlsZCBAbGF5ZXJzW25hbWVdXG5cblx0XHRudWxsXG5cblx0Y3JlYXRlU3RhZ2VGaWx0ZXJzIDogPT5cblxuXHRcdEBmaWx0ZXJzLmJsdXIgID0gbmV3IFBJWEkuQmx1ckZpbHRlclxuXHRcdEBmaWx0ZXJzLlJHQiAgID0gbmV3IFBJWEkuUkdCU3BsaXRGaWx0ZXJcblx0XHRAZmlsdGVycy5waXhlbCA9IG5ldyBQSVhJLlBpeGVsYXRlRmlsdGVyXG5cblx0XHRAZmlsdGVycy5ibHVyLmJsdXIgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLmJsdXIuZ2VuZXJhbFxuXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSAgID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IucmVkXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLmdyZWVuLnZhbHVlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IuZ3JlZW5cblx0XHRAZmlsdGVycy5SR0IudW5pZm9ybXMuYmx1ZS52YWx1ZSAgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLlJHQi5ibHVlXG5cblx0XHRAZmlsdGVycy5waXhlbC51bmlmb3Jtcy5waXhlbFNpemUudmFsdWUgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlckRlZmF1bHRzLnBpeGVsLmFtb3VudFxuXG5cdFx0bnVsbFxuXG5cdGluaXQ6ID0+XG5cblx0XHRQSVhJLmRvbnRTYXlIZWxsbyA9IHRydWVcblxuXHRcdEBzZXREaW1zKClcblxuXHRcdEBzaGFwZXMgICA9IFtdXG5cdFx0QHN0YWdlICAgID0gbmV3IFBJWEkuU3RhZ2UgMHgxQTFBMUFcblx0XHRAcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlciBAdywgQGgsIGFudGlhbGlhcyA6IHRydWVcblxuXHRcdEBjcmVhdGVMYXllcnMoKVxuXHRcdEBjcmVhdGVTdGFnZUZpbHRlcnMoKVxuXG5cdFx0QGFkZEd1aSgpXG5cdFx0QGFkZFN0YXRzKClcblxuXHRcdEAkZWwuYXBwZW5kIEByZW5kZXJlci52aWV3XG5cblx0XHRAZHJhdygpXG5cblx0XHRudWxsXG5cblx0ZHJhdyA6ID0+XG5cblx0XHRAY291bnRlciA9IDBcblxuXHRcdEBiaW5kRXZlbnRzKClcblx0XHRAc2V0RGltcygpXG5cblx0XHRudWxsXG5cblx0c2hvdyA6ID0+XG5cblx0XHRAYWRkU2hhcGVzIEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5JTklUSUFMX1NIQVBFX0NPVU5UXG5cdFx0QHVwZGF0ZSgpXG5cblx0XHRudWxsXG5cblx0YWRkU2hhcGVzIDogKGNvdW50KSA9PlxuXG5cdFx0Zm9yIGkgaW4gWzAuLi5jb3VudF1cblxuXHRcdFx0cG9zID0gQF9nZXRTaGFwZVN0YXJ0UG9zKClcblxuXHRcdFx0c2hhcGUgID0gbmV3IEFic3RyYWN0U2hhcGUgQFxuXHRcdFx0c3ByaXRlID0gc2hhcGUuZ2V0U3ByaXRlKClcblx0XHRcdGxheWVyICA9IHNoYXBlLmdldExheWVyKClcblxuXHRcdFx0c3ByaXRlLnBvc2l0aW9uLnggPSBwb3MueFxuXHRcdFx0c3ByaXRlLnBvc2l0aW9uLnkgPSBwb3MueVxuXG5cdFx0XHRAbGF5ZXJzW2xheWVyXS5hZGRDaGlsZCBzcHJpdGVcblxuXHRcdFx0QHNoYXBlcy5wdXNoIHNoYXBlXG5cblx0XHRudWxsXG5cblx0X2dldFNoYXBlU3RhcnRQb3MgOiA9PlxuXG5cdFx0eCA9IChOdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBAdzQsIEB3KSArIChAdzQqMylcblx0XHR5ID0gKE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IDAsIChAaDQqMykpIC0gQGg0KjNcblxuXHRcdHJldHVybiB7eCwgeX1cblxuXHRfZ2V0U2hhcGVDb3VudCA6ID0+XG5cblx0XHRjb3VudCA9IDBcblx0XHQoY291bnQrPWRpc3BsYXlDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoKSBmb3IgbGF5ZXIsIGRpc3BsYXlDb250YWluZXIgb2YgQGxheWVyc1xuXG5cdFx0Y291bnRcblxuXHRyZW1vdmVTaGFwZSA6IChzaGFwZSkgPT5cblxuXHRcdGluZGV4ID0gQHNoYXBlcy5pbmRleE9mIHNoYXBlXG5cdFx0IyBAc2hhcGVzLnNwbGljZSBpbmRleCwgMVxuXHRcdEBzaGFwZXNbaW5kZXhdID0gbnVsbFxuXG5cdFx0bGF5ZXJQYXJlbnQgPSBAbGF5ZXJzW3NoYXBlLmdldExheWVyKCldXG5cdFx0bGF5ZXJQYXJlbnQucmVtb3ZlQ2hpbGQgc2hhcGUuc1xuXG5cdFx0aWYgQF9nZXRTaGFwZUNvdW50KCkgPCBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuTUFYX1NIQVBFX0NPVU5UIHRoZW4gQGFkZFNoYXBlcyAxXG5cblx0XHRudWxsXG5cblx0dXBkYXRlIDogPT5cblxuXHRcdEBzdGF0cy5iZWdpbigpXG5cblx0XHRAY291bnRlcisrXG5cblx0XHRpZiAoQGNvdW50ZXIgJSA0IGlzIDApIGFuZCAoQF9nZXRTaGFwZUNvdW50KCkgPCBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuTUFYX1NIQVBFX0NPVU5UKSB0aGVuIEBhZGRTaGFwZXMgMVxuXG5cdFx0QHVwZGF0ZVNoYXBlcygpXG5cdFx0QHJlbmRlcigpXG5cblx0XHRmaWx0ZXJzVG9BcHBseSA9IFtdXG5cdFx0KGZpbHRlcnNUb0FwcGx5LnB1c2ggQGZpbHRlcnNbZmlsdGVyXSBpZiBlbmFibGVkKSBmb3IgZmlsdGVyLCBlbmFibGVkIG9mIEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyc1xuXG5cdFx0QHN0YWdlLmZpbHRlcnMgPSBpZiBmaWx0ZXJzVG9BcHBseS5sZW5ndGggdGhlbiBmaWx0ZXJzVG9BcHBseSBlbHNlIG51bGxcblxuXHRcdHJlcXVlc3RBbmltRnJhbWUgQHVwZGF0ZVxuXG5cdFx0QHN0YXRzLmVuZCgpXG5cblx0XHRudWxsXG5cblx0dXBkYXRlU2hhcGVzIDogPT5cblxuXHRcdChzaGFwZT8uY2FsbEFuaW1hdGUoKSkgZm9yIHNoYXBlIGluIEBzaGFwZXNcblxuXHRcdG51bGxcblxuXHRyZW5kZXIgOiA9PlxuXG5cdFx0QHJlbmRlcmVyLnJlbmRlciBAc3RhZ2UgXG5cblx0XHRudWxsXG5cblx0YmluZEV2ZW50cyA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uIEBOQygpLmFwcFZpZXcuRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBzZXREaW1zXG5cdFx0QG9uIEBFVkVOVF9LSUxMX1NIQVBFLCBAcmVtb3ZlU2hhcGVcblxuXHRcdG51bGxcblxuXHRzZXREaW1zIDogPT5cblxuXHRcdEB3ID0gQE5DKCkuYXBwVmlldy5kaW1zLndcblx0XHRAaCA9IEBOQygpLmFwcFZpZXcuZGltcy5oXG5cblx0XHRAdzIgPSBAdy8yXG5cdFx0QGgyID0gQGgvMlxuXG5cdFx0QHcyID0gQHcvMlxuXHRcdEBoMiA9IEBoLzJcblxuXHRcdEB3NCA9IEB3LzRcblx0XHRAaDQgPSBAaC80XG5cblx0XHRAcmVuZGVyZXI/LnJlc2l6ZSBAdywgQGhcblxuXHRcdG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGl2ZUJnXG4iLCJjbGFzcyBJbnRlcmFjdGl2ZUJnQ29uZmlnXG5cblx0QGNvbG9ycyA6XG5cdFx0IyBodHRwOi8vZmxhdHVpY29sb3JzLmNvbS9cblx0XHRGTEFUIDogW1xuXHRcdFx0JzE5QjY5OCcsXG5cdFx0XHQnMkNDMzZCJyxcblx0XHRcdCcyRThFQ0UnLFxuXHRcdFx0JzlCNTBCQScsXG5cdFx0XHQnRTk4QjM5Jyxcblx0XHRcdCdFQTYxNTMnLFxuXHRcdFx0J0YyQ0EyNydcblx0XHRdXG5cdFx0QlcgOiBbXG5cdFx0XHQnRThFOEU4Jyxcblx0XHRcdCdEMUQxRDEnLFxuXHRcdFx0J0I5QjlCOScsXG5cdFx0XHQnQTNBM0EzJyxcblx0XHRcdCc4QzhDOEMnLFxuXHRcdFx0Jzc2NzY3NicsXG5cdFx0XHQnNUU1RTVFJ1xuXHRcdF1cblx0XHRSRUQgOiBbXG5cdFx0XHQnQUEzOTM5Jyxcblx0XHRcdCdENDZBNkEnLFxuXHRcdFx0J0ZGQUFBQScsXG5cdFx0XHQnODAxNTE1Jyxcblx0XHRcdCc1NTAwMDAnXG5cdFx0XVxuXHRcdCMgaHR0cDovL3BhbGV0dG9uLmNvbS8jdWlkPTEzdjB1MGtudFMrYzZYVWlrVnRzdlB6RFJLYVxuXHRcdEJMVUUgOiBbXG5cdFx0XHQnOUZENEY2Jyxcblx0XHRcdCc2RUJDRUYnLFxuXHRcdFx0JzQ4QTlFOCcsXG5cdFx0XHQnMjQ5NURFJyxcblx0XHRcdCcwOTgxQ0YnXG5cdFx0XVxuXHRcdCMgaHR0cDovL3BhbGV0dG9uLmNvbS8jdWlkPTEyWTB1MGtsU0xPYjVWVmgzUVlxb0c3eFMtWVxuXHRcdEdSRUVOIDogW1xuXHRcdFx0JzlGRjRDMScsXG5cdFx0XHQnNkRFOTlGJyxcblx0XHRcdCc0NkREODMnLFxuXHRcdFx0JzI1RDA2QScsXG5cdFx0XHQnMDBDMjRGJ1xuXHRcdF1cblx0XHQjIGh0dHA6Ly9wYWxldHRvbi5jb20vI3VpZD0xMXcwdTBrblJ3MGU0TEVqckNFdFR1dHVYbjlcblx0XHRZRUxMT1cgOiBbXG5cdFx0XHQnRkZFRjhGJyxcblx0XHRcdCdGRkU5NjQnLFxuXHRcdFx0J0ZGRTQ0MScsXG5cdFx0XHQnRjNEMzEwJyxcblx0XHRcdCdCOEEwMDYnXG5cdFx0XVxuXG5cdEBwYWxldHRlcyAgICAgIDogJ2ZsYXQnIDogJ0ZMQVQnLCAnYiZ3JyA6ICdCVycsICdyZWQnIDogJ1JFRCcsICdibHVlJyA6ICdCTFVFJywgJ2dyZWVuJyA6ICdHUkVFTicsICd5ZWxsb3cnIDogJ1lFTExPVydcblx0QGFjdGl2ZVBhbGV0dGUgOiAnRkxBVCdcblxuXHRAc2hhcGVUeXBlczogW1xuXHRcdHtcblx0XHRcdHR5cGUgICA6ICdDaXJjbGUnXG5cdFx0XHRhY3RpdmUgOiB0cnVlXG5cdFx0fVxuXHRcdHtcblx0XHRcdHR5cGUgICA6ICdTcXVhcmUnXG5cdFx0XHRhY3RpdmUgOiB0cnVlXG5cdFx0fVxuXHRcdHtcblx0XHRcdHR5cGUgICA6ICdUcmlhbmdsZSdcblx0XHRcdGFjdGl2ZSA6IHRydWVcblx0XHR9XG5cdF1cblxuXHRAc2hhcGVzIDpcblx0XHRNSU5fV0lEVEggOiAzMFxuXHRcdE1BWF9XSURUSCA6IDcwXG5cblx0XHRNSU5fU1BFRURfTU9WRSA6IDJcblx0XHRNQVhfU1BFRURfTU9WRSA6IDMuNVxuXG5cdFx0TUlOX1NQRUVEX1JPVEFURSA6IC0wLjAxXG5cdFx0TUFYX1NQRUVEX1JPVEFURSA6IDAuMDFcblxuXHRcdE1JTl9BTFBIQSA6IDFcblx0XHRNQVhfQUxQSEEgOiAxXG5cblx0XHRNSU5fQkxVUiA6IDBcblx0XHRNQVhfQkxVUiA6IDEwXG5cblx0QGdlbmVyYWwgOiBcblx0XHRHTE9CQUxfU1BFRUQgICAgICAgIDogMVxuXHRcdEdMT0JBTF9BTFBIQSAgICAgICAgOiAxXG5cdFx0TUFYX1NIQVBFX0NPVU5UICAgICA6IDgwXG5cdFx0SU5JVElBTF9TSEFQRV9DT1VOVCA6IDEwXG5cblx0QGxheWVycyA6XG5cdFx0QkFDS0dST1VORCA6ICdCQUNLR1JPVU5EJ1xuXHRcdE1JREdST1VORCAgOiAnTUlER1JPVU5EJ1xuXHRcdEZPUkVHUk9VTkQgOiAnRk9SRUdST1VORCdcblxuXHRAZmlsdGVycyA6XG5cdFx0Ymx1ciAgOiBmYWxzZVxuXHRcdFJHQiAgIDogZmFsc2Vcblx0XHRwaXhlbCA6IGZhbHNlXG5cblx0QGZpbHRlckRlZmF1bHRzIDpcblx0XHRibHVyIDpcblx0XHRcdGdlbmVyYWwgICAgOiAxMFxuXHRcdFx0Zm9yZWdyb3VuZCA6IDBcblx0XHRcdG1pZGdyb3VuZCAgOiAwXG5cdFx0XHRiYWNrZ3JvdW5kIDogMFxuXHRcdFJHQiA6XG5cdFx0XHRyZWQgICA6IHggOiAyLCB5IDogMlxuXHRcdFx0Z3JlZW4gOiB4IDogLTIsIHkgOiAyXG5cdFx0XHRibHVlICA6IHggOiAyLCB5IDogLTJcblx0XHRwaXhlbCA6XG5cdFx0XHRhbW91bnQgOiB4IDogNCwgeSA6IDRcblxuXHRAZ2V0UmFuZG9tQ29sb3IgOiAtPlxuXG5cdFx0cmV0dXJuIEBjb2xvcnNbQGFjdGl2ZVBhbGV0dGVdW18ucmFuZG9tKDAsIEBjb2xvcnNbQGFjdGl2ZVBhbGV0dGVdLmxlbmd0aC0xKV1cblxuXHRAZ2V0UmFuZG9tU2hhcGUgOiAtPlxuXG5cdFx0YWN0aXZlU2hhcGVzID0gXy5maWx0ZXIgQHNoYXBlVHlwZXMsIChzKSAtPiBzLmFjdGl2ZVxuXG5cdFx0cmV0dXJuIGFjdGl2ZVNoYXBlc1tfLnJhbmRvbSgwLCBhY3RpdmVTaGFwZXMubGVuZ3RoLTEpXS50eXBlXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJhY3RpdmVCZ0NvbmZpZ1xuIiwiSW50ZXJhY3RpdmVCZ0NvbmZpZyA9IHJlcXVpcmUgJy4uL0ludGVyYWN0aXZlQmdDb25maWcnXG5OdW1iZXJVdGlscyAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vdXRpbHMvTnVtYmVyVXRpbHMnXG5cbmNsYXNzIEFic3RyYWN0U2hhcGVcblxuXHRnIDogbnVsbFxuXHRzIDogbnVsbFxuXG5cdHdpZHRoICAgICAgIDogbnVsbFxuXHRzcGVlZE1vdmUgICA6IG51bGxcblx0c3BlZWRSb3RhdGUgOiBudWxsXG5cdGJsdXJWYWx1ZSAgIDogbnVsbFxuXHRhbHBoYVZhbHVlICA6IG51bGxcblxuXHRkZWFkIDogZmFsc2VcblxuXHRjb25zdHJ1Y3RvciA6IChAaW50ZXJhY3RpdmVCZykgLT5cblxuXHRcdF8uZXh0ZW5kIEAsIEJhY2tib25lLkV2ZW50c1xuXG5cdFx0QHdpZHRoICAgICAgID0gQF9nZXRXaWR0aCgpXG5cdFx0QHNwZWVkTW92ZSAgID0gQF9nZXRTcGVlZE1vdmUoKVxuXHRcdEBzcGVlZFJvdGF0ZSA9IEBfZ2V0U3BlZWRSb3RhdGUoKVxuXHRcdEBibHVyVmFsdWUgICA9IEBfZ2V0Qmx1clZhbHVlKClcblx0XHRAYWxwaGFWYWx1ZSAgPSBAX2dldEFscGhhVmFsdWUoKVxuXG5cdFx0QGcgPSBuZXcgUElYSS5HcmFwaGljc1xuXG5cdFx0QGcuYmVnaW5GaWxsICcweCcrSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZXRSYW5kb21Db2xvcigpXG5cblx0XHRzaGFwZVRvRHJhdyA9IEludGVyYWN0aXZlQmdDb25maWcuZ2V0UmFuZG9tU2hhcGUoKVxuXHRcdEBbXCJfZHJhdyN7c2hhcGVUb0RyYXd9XCJdKClcblxuXHRcdEBnLmVuZEZpbGwoKVxuXG5cdFx0QGcuYm91bmRzUGFkZGluZyA9IEB3aWR0aCoxLjJcblxuXHRcdEBzID0gbmV3IFBJWEkuU3ByaXRlIEBnLmdlbmVyYXRlVGV4dHVyZSgpXG5cblx0XHQjIEBibHVyRmlsdGVyID0gbmV3IFBJWEkuQmx1ckZpbHRlclxuXHRcdCMgQGJsdXJGaWx0ZXIuYmx1ciA9IEBibHVyVmFsdWVcblxuXHRcdCMgQHMuZmlsdGVycyAgID0gW0BibHVyRmlsdGVyXVxuXHRcdEBzLmJsZW5kTW9kZSA9IHdpbmRvdy5ibGVuZCBvciBQSVhJLmJsZW5kTW9kZXMuQUREXG5cdFx0QHMuYWxwaGEgICAgID0gQGFscGhhVmFsdWVcblxuXHRcdEBzLmFuY2hvci54ID0gQHMuYW5jaG9yLnkgPSAwLjVcblxuXHRcdHJldHVybiBudWxsXG5cblx0X2RyYXdUcmlhbmdsZSA6ID0+XG5cblx0XHRAZy5tb3ZlVG8gMCwgMFxuXHRcdEBnLmxpbmVUbyAtQHdpZHRoLzIsIEB3aWR0aFxuXHRcdEBnLmxpbmVUbyBAd2lkdGgvMiwgQHdpZHRoXG5cblx0XHRudWxsXG5cblx0X2RyYXdDaXJjbGUgOiA9PlxuXG5cdFx0QGcuZHJhd0NpcmNsZSAwLCAwLCBAd2lkdGgvMlxuXG5cdFx0bnVsbFxuXG5cdF9kcmF3U3F1YXJlIDogPT5cblxuXHRcdEBnLmRyYXdSZWN0IDAsIDAsIEB3aWR0aCwgQHdpZHRoXG5cblx0XHRudWxsXG5cblx0X2dldFdpZHRoIDogPT5cblxuXHRcdE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIXG5cblx0X2dldFNwZWVkTW92ZSA6ID0+XG5cblx0XHROdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fU1BFRURfTU9WRSwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1NQRUVEX01PVkVcblxuXHRfZ2V0U3BlZWRSb3RhdGUgOiA9PlxuXG5cdFx0TnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1NQRUVEX1JPVEFURSwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1NQRUVEX1JPVEFURVxuXG5cdF9nZXRCbHVyVmFsdWUgOiA9PlxuXG5cdFx0cmFuZ2UgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfQkxVUiAtIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9CTFVSXG5cdFx0Ymx1ciAgPSAoKEB3aWR0aCAvIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCkgKiByYW5nZSkgKyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQkxVUlxuXG5cdFx0Ymx1clxuXG5cdF9nZXRBbHBoYVZhbHVlIDogPT5cblxuXHRcdHJhbmdlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX0FMUEhBIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX0FMUEhBXG5cdFx0YWxwaGEgPSAoKEB3aWR0aCAvIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCkgKiByYW5nZSkgKyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQUxQSEFcblxuXHRcdGFscGhhXG5cblx0Y2FsbEFuaW1hdGUgOiA9PlxuXG5cdFx0cmV0dXJuIHVubGVzcyAhQGRlYWRcblxuXHRcdCMgQHMuYmxlbmRNb2RlID0gaWYgSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLlJHQiB0aGVuIFBJWEkuYmxlbmRNb2Rlcy5OT1JNQUwgZWxzZSBQSVhJLmJsZW5kTW9kZXMuQUREXG5cdFx0QHMuYWxwaGEgPSBAYWxwaGFWYWx1ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX0FMUEhBXG5cblx0XHRAcy5wb3NpdGlvbi54IC09IEBzcGVlZE1vdmUqSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXHRcdEBzLnBvc2l0aW9uLnkgKz0gQHNwZWVkTW92ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEXG5cdFx0QHMucm90YXRpb24gKz0gQHNwZWVkUm90YXRlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblxuXHRcdCMgaWYgKEBzLnBvc2l0aW9uLnggKyAoQHdpZHRoLzIpIDwgMCkgdGhlbiBAcy5wb3NpdGlvbi54ICs9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0IyBpZiAoQHMucG9zaXRpb24ueSAtIChAd2lkdGgvMikgPiBATkMoKS5hcHBWaWV3LmRpbXMuaCkgdGhlbiBAcy5wb3NpdGlvbi55IC09IEBOQygpLmFwcFZpZXcuZGltcy5oXG5cblx0XHRpZiAoQHMucG9zaXRpb24ueCArIChAd2lkdGgvMikgPCAwKSBvciAoQHMucG9zaXRpb24ueSAtIChAd2lkdGgvMikgPiBATkMoKS5hcHBWaWV3LmRpbXMuaCkgdGhlbiBAa2lsbCgpXG5cblx0XHRudWxsXG5cblx0a2lsbCA6ID0+XG5cblx0XHRAZGVhZCA9IHRydWVcblxuXHRcdEBpbnRlcmFjdGl2ZUJnLnRyaWdnZXIgQGludGVyYWN0aXZlQmcuRVZFTlRfS0lMTF9TSEFQRSwgQFxuXG5cdGdldFNwcml0ZSA6ID0+XG5cblx0XHRyZXR1cm4gQHNcblxuXHRnZXRMYXllciA6ID0+XG5cblx0XHRyYW5nZSA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCAtIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSFxuXG5cdFx0bGF5ZXIgPSBzd2l0Y2ggdHJ1ZVxuXHRcdFx0d2hlbiBAd2lkdGggPCAocmFuZ2UgLyAzKStJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fV0lEVEggdGhlbiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVycy5CQUNLR1JPVU5EXG5cdFx0XHR3aGVuIEB3aWR0aCA8ICgocmFuZ2UgLyAzKSAqIDIpK0ludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCB0aGVuIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLk1JREdST1VORFxuXHRcdFx0ZWxzZSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVycy5GT1JFR1JPVU5EXG5cblx0XHRsYXllclxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFNoYXBlXG4iXX0=
