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

  AbstractShape.triangleRatio = Math.cos(Math.PI / 6);

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
    var height;
    height = this.width * AbstractShape.triangleRatio;
    this.g.moveTo(0, 0);
    this.g.lineTo(-this.width / 2, height);
    this.g.lineTo(this.width / 2, height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL051bWJlclV0aWxzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZy5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmdDb25maWcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9zaGFwZXMvQWJzdHJhY3RTaGFwZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhCQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBS0E7QUFBQTs7O0dBTEE7O0FBQUEsT0FXQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxVQVlBLEdBQWEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFwQyxDQVpiLENBQUE7O0FBQUEsSUFlQSxHQUFVLE9BQUgsR0FBZ0IsRUFBaEIsR0FBeUIsTUFBQSxJQUFVLFFBZjFDLENBQUE7O0FBaUJBLElBQUcsVUFBSDtBQUNDLEVBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUF6QixJQUFzQyxhQUF0QyxDQUREO0NBQUEsTUFBQTtBQUlDLEVBQUEsSUFBSSxDQUFDLEVBQUwsR0FBYyxJQUFBLEdBQUEsQ0FBSSxPQUFKLENBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFSLENBQUEsQ0FEQSxDQUpEO0NBakJBOzs7OztBQ0FBLElBQUEsbUNBQUE7RUFBQSxrRkFBQTs7QUFBQSxPQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FBZixDQUFBOztBQUFBLE9BQ0EsR0FBZSxPQUFBLENBQVEsV0FBUixDQURmLENBQUE7O0FBQUEsWUFFQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUZmLENBQUE7O0FBQUE7QUFNSSxnQkFBQSxJQUFBLEdBQWtCLElBQWxCLENBQUE7O0FBQUEsZ0JBQ0EsU0FBQSxHQUFrQixN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Q0FBQyxNQUFNLENBQUMsU0FEOUM7aUJBQzZELG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxXQUR4RjtBQUFBLGFBRUYsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLENBQUMsS0FBQSxHQUFRLENBQVQsQ0FBQSxHQUFjLENBQWYsQ0FBQSxHQUFrQixtQkFBbUIsQ0FBQyxNQUFNLENBQUMsU0FGcEQ7aUJBRW1FLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUY5RjtBQUFBO2lCQUdGLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxXQUh6QjtBQUFBO2lCQUZSLENBQUE7V0FPQSxNQVRVO0VBQUEsQ0EzSFgsQ0FBQTs7QUFBQSwwQkFzSUEsRUFBQSxHQUFLLFNBQUEsR0FBQTtBQUVKLFdBQU8sTUFBTSxDQUFDLEVBQWQsQ0FGSTtFQUFBLENBdElMLENBQUE7O3VCQUFBOztJQUxELENBQUE7O0FBQUEsTUErSU0sQ0FBQyxPQUFQLEdBQWlCLGFBL0lqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xuXG4jIFBST0RVQ1RJT04gRU5WSVJPTk1FTlQgLSBtYXkgd2FudCB0byB1c2Ugc2VydmVyLXNldCB2YXJpYWJsZXMgaGVyZVxuIyBJU19MSVZFID0gZG8gLT4gcmV0dXJuIGlmIHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID4gLTEgb3Igd2luZG93LmxvY2F0aW9uLnNlYXJjaCBpcyAnP2QnIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cbiMjI1xuXG5XSVAgLSB0aGlzIHdpbGwgaWRlYWxseSBjaGFuZ2UgdG8gb2xkIGZvcm1hdCAoYWJvdmUpIHdoZW4gY2FuIGZpZ3VyZSBpdCBvdXRcblxuIyMjXG5cbklTX0xJVkUgICAgPSBmYWxzZVxuSVNfUFJFVklFVyA9IC9wcmV2aWV3PXRydWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLnNlYXJjaClcblxuIyBPTkxZIEVYUE9TRSBBUFAgR0xPQkFMTFkgSUYgTE9DQUwgT1IgREVWJ0lOR1xudmlldyA9IGlmIElTX0xJVkUgdGhlbiB7fSBlbHNlICh3aW5kb3cgb3IgZG9jdW1lbnQpXG5cbmlmIElTX1BSRVZJRVdcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIElTX1BSRVZJRVcnXG5lbHNlXG5cdCMgREVDTEFSRSBNQUlOIEFQUExJQ0FUSU9OXG5cdHZpZXcuTkMgPSBuZXcgQXBwIElTX0xJVkVcblx0dmlldy5OQy5pbml0KClcbiIsIkFwcERhdGEgICAgICA9IHJlcXVpcmUgJy4vQXBwRGF0YSdcbkFwcFZpZXcgICAgICA9IHJlcXVpcmUgJy4vQXBwVmlldydcbk1lZGlhUXVlcmllcyA9IHJlcXVpcmUgJy4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuXG5jbGFzcyBBcHBcblxuICAgIExJVkUgICAgICAgICAgICA6IG51bGxcbiAgICBCQVNFX1BBVEggICAgICAgOiB3aW5kb3cuY29uZmlnLmJhc2VfcGF0aFxuICAgIEJBU0VfVVJMICAgICAgICA6IHdpbmRvdy5jb25maWcuYmFzZV91cmxcbiAgICBCQVNFX1VSTF9BU1NFVFMgOiB3aW5kb3cuY29uZmlnLmJhc2VfdXJsX2Fzc2V0c1xuICAgIG9ialJlYWR5ICAgICAgICA6IDBcblxuICAgIF90b0NsZWFuICAgOiBbJ29ialJlYWR5JywgJ3NldEZsYWdzJywgJ29iamVjdENvbXBsZXRlJywgJ2luaXQnLCAnaW5pdE9iamVjdHMnLCAnaW5pdFNES3MnLCAnaW5pdEFwcCcsICdnbycsICdjbGVhbnVwJywgJ190b0NsZWFuJ11cblxuICAgIGNvbnN0cnVjdG9yIDogKEBMSVZFKSAtPlxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICBzZXRGbGFncyA6ID0+XG5cbiAgICAgICAgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgTWVkaWFRdWVyaWVzLnNldHVwKCk7XG5cbiAgICAgICAgIyBASVNfQU5EUk9JRCAgICA9IHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA+IC0xXG4gICAgICAgICMgQElTX0ZJUkVGT1ggICAgPSB1YS5pbmRleE9mKCdmaXJlZm94JykgPiAtMVxuICAgICAgICAjIEBJU19DSFJPTUVfSU9TID0gaWYgdWEubWF0Y2goJ2NyaW9zJykgdGhlbiB0cnVlIGVsc2UgZmFsc2UgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzgwODA1M1xuXG4gICAgICAgIG51bGxcblxuICAgIG9iamVjdENvbXBsZXRlIDogPT5cblxuICAgICAgICBAb2JqUmVhZHkrK1xuICAgICAgICBAaW5pdEFwcCgpIGlmIEBvYmpSZWFkeSA+PSAxXG5cbiAgICAgICAgbnVsbFxuXG4gICAgaW5pdCA6ID0+XG5cbiAgICAgICAgIyBjdXJyZW50bHkgbm8gb2JqZWN0cyB0byBsb2FkIGhlcmUsIHNvIGp1c3Qgc3RhcnQgYXBwXG4gICAgICAgICMgQGluaXRPYmplY3RzKClcblxuICAgICAgICBAaW5pdEFwcCgpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgIyBpbml0T2JqZWN0cyA6ID0+XG5cbiAgICAjICAgICBAdGVtcGxhdGVzID0gbmV3IFRlbXBsYXRlcyBcIiN7QEJBU0VfVVJMX0FTU0VUU30vZGF0YS90ZW1wbGF0ZXMjeyhpZiBATElWRSB0aGVuICcubWluJyBlbHNlICcnKX0ueG1sXCIsIEBvYmplY3RDb21wbGV0ZVxuXG4gICAgIyAgICAgIyBpZiBuZXcgb2JqZWN0cyBhcmUgYWRkZWQgZG9uJ3QgZm9yZ2V0IHRvIGNoYW5nZSB0aGUgYEBvYmplY3RDb21wbGV0ZWAgZnVuY3Rpb25cblxuICAgICMgICAgIG51bGxcblxuICAgIGluaXRBcHAgOiA9PlxuXG4gICAgICAgIEBzZXRGbGFncygpXG5cbiAgICAgICAgIyMjIFN0YXJ0cyBhcHBsaWNhdGlvbiAjIyNcbiAgICAgICAgQGFwcERhdGEgPSBuZXcgQXBwRGF0YVxuICAgICAgICBAYXBwVmlldyA9IG5ldyBBcHBWaWV3XG5cbiAgICAgICAgQGdvKClcblxuICAgICAgICBudWxsXG5cbiAgICBnbyA6ID0+XG5cbiAgICAgICAgIyMjIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBraWNrcyBvZmYgd2Vic2l0ZSAjIyNcbiAgICAgICAgQGFwcFZpZXcucmVuZGVyKClcblxuICAgICAgICAjIyMgcmVtb3ZlIHJlZHVuZGFudCBpbml0aWFsaXNhdGlvbiBtZXRob2RzIC8gcHJvcGVydGllcyAjIyNcbiAgICAgICAgQGNsZWFudXAoKVxuXG4gICAgICAgIG51bGxcblxuICAgIGNsZWFudXAgOiA9PlxuXG4gICAgICAgIGZvciBmbiBpbiBAX3RvQ2xlYW5cbiAgICAgICAgICAgIEBbZm5dID0gbnVsbFxuICAgICAgICAgICAgZGVsZXRlIEBbZm5dXG5cbiAgICAgICAgbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiQWJzdHJhY3REYXRhID0gcmVxdWlyZSAnLi9kYXRhL0Fic3RyYWN0RGF0YSdcblxuY2xhc3MgQXBwRGF0YSBleHRlbmRzIEFic3RyYWN0RGF0YVxuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcERhdGFcbiIsIkFic3RyYWN0VmlldyAgPSByZXF1aXJlICcuL3ZpZXcvQWJzdHJhY3RWaWV3J1xuTWVkaWFRdWVyaWVzICA9IHJlcXVpcmUgJy4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuSW50ZXJhY3RpdmVCZyA9IHJlcXVpcmUgJy4vdmlldy9pbnRlcmFjdGl2ZS9JbnRlcmFjdGl2ZUJnJ1xuXG5jbGFzcyBBcHBWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cbiAgICB0ZW1wbGF0ZSA6ICdtYWluJ1xuXG4gICAgJHdpbmRvdyAgOiBudWxsXG4gICAgJGJvZHkgICAgOiBudWxsXG5cbiAgICB3cmFwcGVyICA6IG51bGxcblxuICAgIGRpbXMgOlxuICAgICAgICB3IDogbnVsbFxuICAgICAgICBoIDogbnVsbFxuICAgICAgICBvIDogbnVsbFxuICAgICAgICBjIDogbnVsbFxuICAgICAgICByIDogbnVsbFxuXG4gICAgcndkU2l6ZXMgOlxuICAgICAgICBMQVJHRSAgOiAnTFJHJ1xuICAgICAgICBNRURJVU0gOiAnTUVEJ1xuICAgICAgICBTTUFMTCAgOiAnU01MJ1xuXG4gICAgbGFzdFNjcm9sbFkgOiAwXG4gICAgdGlja2luZyAgICAgOiBmYWxzZVxuXG4gICAgRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMgOiAnRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMnXG4gICAgRVZFTlRfT05fU0NST0xMICAgICAgICAgOiAnRVZFTlRfT05fU0NST0xMJ1xuXG4gICAgTU9CSUxFX1dJRFRIIDogNzAwXG4gICAgTU9CSUxFICAgICAgIDogJ21vYmlsZSdcbiAgICBOT05fTU9CSUxFICAgOiAnbm9uX21vYmlsZSdcblxuICAgIGNvbnN0cnVjdG9yIDogLT5cblxuICAgICAgICBAJHdpbmRvdyA9ICQod2luZG93KVxuICAgICAgICBAJGJvZHkgICA9ICQoJ2JvZHknKS5lcSgwKVxuXG4gICAgICAgICMgdGhlc2UsIHJhdGhlciB0aGFuIGNhbGxpbmcgc3VwZXJcbiAgICAgICAgQHNldEVsZW1lbnQgQCRib2R5LmZpbmQoXCJbZGF0YS10ZW1wbGF0ZT1cXFwiI3tAdGVtcGxhdGV9XFxcIl1cIilcbiAgICAgICAgQGNoaWxkcmVuID0gW11cblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgZGlzYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9uICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIGVuYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9mZiAndG91Y2htb3ZlJywgQG9uVG91Y2hNb3ZlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblRvdWNoTW92ZTogKCBlICkgLT5cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlbmRlciA6ID0+XG5cbiAgICAgICAgQGJpbmRFdmVudHMoKVxuXG4gICAgICAgIEBpbnRlcmFjdGl2ZUJnID0gbmV3IEludGVyYWN0aXZlQmdcblxuICAgICAgICBAYWRkQ2hpbGQgQGludGVyYWN0aXZlQmdcblxuICAgICAgICBAb25BbGxSZW5kZXJlZCgpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBiaW5kRXZlbnRzIDogPT5cblxuICAgICAgICBAb24gJ2FsbFJlbmRlcmVkJywgQG9uQWxsUmVuZGVyZWRcblxuICAgICAgICBAb25SZXNpemUoKVxuXG4gICAgICAgIEBvblJlc2l6ZSA9IF8uZGVib3VuY2UgQG9uUmVzaXplLCAzMDBcbiAgICAgICAgQCR3aW5kb3cub24gJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZScsIEBvblJlc2l6ZVxuICAgICAgICBAJHdpbmRvdy5vbiBcInNjcm9sbFwiLCBAb25TY3JvbGxcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uU2Nyb2xsIDogPT5cblxuICAgICAgICBAbGFzdFNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWVxuICAgICAgICBAcmVxdWVzdFRpY2soKVxuXG4gICAgICAgIG51bGxcblxuICAgIHJlcXVlc3RUaWNrIDogPT5cblxuICAgICAgICBpZiAhQHRpY2tpbmdcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSBAc2Nyb2xsVXBkYXRlXG4gICAgICAgICAgICBAdGlja2luZyA9IHRydWVcblxuICAgICAgICBudWxsXG5cbiAgICBzY3JvbGxVcGRhdGUgOiA9PlxuXG4gICAgICAgIEB0aWNraW5nID0gZmFsc2VcblxuICAgICAgICBAJGJvZHkuYWRkQ2xhc3MoJ2Rpc2FibGUtaG92ZXInKVxuXG4gICAgICAgIGNsZWFyVGltZW91dCBAdGltZXJTY3JvbGxcblxuICAgICAgICBAdGltZXJTY3JvbGwgPSBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICBAJGJvZHkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGUtaG92ZXInKVxuICAgICAgICAsIDUwXG5cbiAgICAgICAgQHRyaWdnZXIgQXBwVmlldy5FVkVOVF9PTl9TQ1JPTExcblxuICAgICAgICBudWxsXG5cbiAgICBvbkFsbFJlbmRlcmVkIDogPT5cblxuICAgICAgICAjIGNvbnNvbGUubG9nIFwib25BbGxSZW5kZXJlZCA6ID0+XCJcbiAgICAgICAgQGJlZ2luKClcblxuICAgICAgICBudWxsXG5cbiAgICBiZWdpbiA6ID0+XG5cbiAgICAgICAgQHRyaWdnZXIgJ3N0YXJ0J1xuXG4gICAgICAgIEBvblNjcm9sbCgpXG4gICAgICAgIEBpbnRlcmFjdGl2ZUJnLnNob3coKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25SZXNpemUgOiA9PlxuXG4gICAgICAgIEBnZXREaW1zKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGdldERpbXMgOiA9PlxuXG4gICAgICAgIHcgPSB3aW5kb3cuaW5uZXJXaWR0aCBvciBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggb3IgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxuICAgICAgICBoID0gd2luZG93LmlubmVySGVpZ2h0IG9yIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgb3IgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHRcblxuICAgICAgICBAZGltcyA9XG4gICAgICAgICAgICB3IDogd1xuICAgICAgICAgICAgaCA6IGhcbiAgICAgICAgICAgIG8gOiBpZiBoID4gdyB0aGVuICdwb3J0cmFpdCcgZWxzZSAnbGFuZHNjYXBlJ1xuICAgICAgICAgICAgYyA6IGlmIHcgPD0gQE1PQklMRV9XSURUSCB0aGVuIEBNT0JJTEUgZWxzZSBATk9OX01PQklMRVxuICAgICAgICAgICAgciA6IEBnZXRSd2RTaXplIHcsIGgsICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyBvciAxKVxuXG4gICAgICAgIEB0cmlnZ2VyIEBFVkVOVF9VUERBVEVfRElNRU5TSU9OUywgQGRpbXNcblxuICAgICAgICByZXR1cm5cblxuICAgIGdldFJ3ZFNpemUgOiAodywgaCwgZHByKSA9PlxuXG4gICAgICAgIHB3ID0gdypkcHJcblxuICAgICAgICBzaXplID0gc3dpdGNoIHRydWVcbiAgICAgICAgICAgIHdoZW4gcHcgPiAxNDQwIHRoZW4gQHJ3ZFNpemVzLkxBUkdFXG4gICAgICAgICAgICB3aGVuIHB3IDwgNjUwIHRoZW4gQHJ3ZFNpemVzLlNNQUxMXG4gICAgICAgICAgICBlbHNlIEByd2RTaXplcy5NRURJVU1cblxuICAgICAgICBzaXplXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwVmlld1xuIiwiY2xhc3MgQWJzdHJhY3REYXRhXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0Xy5leHRlbmQgQCwgQmFja2JvbmUuRXZlbnRzXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdERhdGFcbiIsIiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBNZWRpYSBRdWVyaWVzIE1hbmFnZXIgXG4jICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgXG4jICAgQGF1dGhvciA6IEbDoWJpbyBBemV2ZWRvIDxmYWJpby5hemV2ZWRvQHVuaXQ5LmNvbT4gVU5JVDlcbiMgICBAZGF0ZSAgIDogU2VwdGVtYmVyIDE0XG4jICAgXG4jICAgSW5zdHJ1Y3Rpb25zIGFyZSBvbiAvcHJvamVjdC9zYXNzL3V0aWxzL19yZXNwb25zaXZlLnNjc3MuXG5cbmNsYXNzIE1lZGlhUXVlcmllc1xuXG4gICAgIyBCcmVha3BvaW50c1xuICAgIEBTTUFMTEVTVCAgICA6IFwic21hbGxlc3RcIlxuICAgIEBTTUFMTCAgICAgICA6IFwic21hbGxcIlxuICAgIEBJUEFEICAgICAgICA6IFwiaXBhZFwiXG4gICAgQE1FRElVTSAgICAgIDogXCJtZWRpdW1cIlxuICAgIEBMQVJHRSAgICAgICA6IFwibGFyZ2VcIlxuICAgIEBFWFRSQV9MQVJHRSA6IFwiZXh0cmEtbGFyZ2VcIlxuXG4gICAgQHNldHVwIDogPT5cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVCA9IHtuYW1lOiBcIlNtYWxsZXN0XCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNUXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlQgICAgPSB7bmFtZTogXCJTbWFsbFwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5TTUFMTEVTVCwgTWVkaWFRdWVyaWVzLlNNQUxMXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLk1FRElVTV9CUkVBS1BPSU5UICAgPSB7bmFtZTogXCJNZWRpdW1cIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuTUVESVVNXX1cbiAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlQgICAgPSB7bmFtZTogXCJMYXJnZVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5JUEFELCBNZWRpYVF1ZXJpZXMuTEFSR0UsIE1lZGlhUXVlcmllcy5FWFRSQV9MQVJHRV19XG5cbiAgICAgICAgTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTID0gW1xuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMRVNUX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTF9CUkVBS1BPSU5UXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5MQVJHRV9CUkVBS1BPSU5UXG4gICAgICAgIF1cbiAgICAgICAgcmV0dXJuXG5cbiAgICBAZ2V0RGV2aWNlU3RhdGUgOiA9PlxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5LCBcImFmdGVyXCIpLmdldFByb3BlcnR5VmFsdWUoXCJjb250ZW50XCIpO1xuXG4gICAgQGdldEJyZWFrcG9pbnQgOiA9PlxuXG4gICAgICAgIHN0YXRlID0gTWVkaWFRdWVyaWVzLmdldERldmljZVN0YXRlKClcblxuICAgICAgICBmb3IgaSBpbiBbMC4uLk1lZGlhUXVlcmllcy5CUkVBS1BPSU5UUy5sZW5ndGhdXG4gICAgICAgICAgICBpZiBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFNbaV0uYnJlYWtwb2ludHMuaW5kZXhPZihzdGF0ZSkgPiAtMVxuICAgICAgICAgICAgICAgIHJldHVybiBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFNbaV0ubmFtZVxuXG4gICAgICAgIHJldHVybiBcIlwiXG5cbiAgICBAaXNCcmVha3BvaW50IDogKGJyZWFrcG9pbnQpID0+XG5cbiAgICAgICAgZm9yIGkgaW4gWzAuLi5icmVha3BvaW50LmJyZWFrcG9pbnRzLmxlbmd0aF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgYnJlYWtwb2ludC5icmVha3BvaW50c1tpXSA9PSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gTWVkaWFRdWVyaWVzXG4iLCJjbGFzcyBOdW1iZXJVdGlsc1xuXG4gICAgQE1BVEhfQ09TOiBNYXRoLmNvcyBcbiAgICBATUFUSF9TSU46IE1hdGguc2luIFxuICAgIEBNQVRIX1JBTkRPTTogTWF0aC5yYW5kb20gXG4gICAgQE1BVEhfQUJTOiBNYXRoLmFic1xuICAgIEBNQVRIX0FUQU4yOiBNYXRoLmF0YW4yXG5cbiAgICBAbGltaXQ6KG51bWJlciwgbWluLCBtYXgpLT5cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKCBNYXRoLm1heChtaW4sbnVtYmVyKSwgbWF4IClcblxuICAgIEBtYXAgOiAobnVtLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCByb3VuZCA9IGZhbHNlLCBjb25zdHJhaW5NaW4gPSB0cnVlLCBjb25zdHJhaW5NYXggPSB0cnVlKSAtPlxuICAgICAgICAgICAgaWYgY29uc3RyYWluTWluIGFuZCBudW0gPCBtaW4xIHRoZW4gcmV0dXJuIG1pbjJcbiAgICAgICAgICAgIGlmIGNvbnN0cmFpbk1heCBhbmQgbnVtID4gbWF4MSB0aGVuIHJldHVybiBtYXgyXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG51bTEgPSAobnVtIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpXG4gICAgICAgICAgICBudW0yID0gKG51bTEgKiAobWF4MiAtIG1pbjIpKSArIG1pbjJcbiAgICAgICAgICAgIGlmIHJvdW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtMilcbiAgICAgICAgICAgIHJldHVybiBudW0yXG5cbiAgICBAZ2V0UmFuZG9tQ29sb3I6IC0+XG5cbiAgICAgICAgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJylcbiAgICAgICAgY29sb3IgPSAnIydcbiAgICAgICAgZm9yIGkgaW4gWzAuLi42XVxuICAgICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxNSldXG4gICAgICAgIGNvbG9yXG5cbiAgICBAZ2V0UmFuZG9tRmxvYXQgOiAobWluLCBtYXgpIC0+XG5cbiAgICAgICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXG5cbiAgICBAZ2V0VGltZVN0YW1wRGlmZiA6IChkYXRlMSwgZGF0ZTIpIC0+XG5cbiAgICAgICAgIyBHZXQgMSBkYXkgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgIG9uZV9kYXkgPSAxMDAwKjYwKjYwKjI0XG4gICAgICAgIHRpbWUgICAgPSB7fVxuXG4gICAgICAgICMgQ29udmVydCBib3RoIGRhdGVzIHRvIG1pbGxpc2Vjb25kc1xuICAgICAgICBkYXRlMV9tcyA9IGRhdGUxLmdldFRpbWUoKVxuICAgICAgICBkYXRlMl9tcyA9IGRhdGUyLmdldFRpbWUoKVxuXG4gICAgICAgICMgQ2FsY3VsYXRlIHRoZSBkaWZmZXJlbmNlIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGF0ZTJfbXMgLSBkYXRlMV9tc1xuXG4gICAgICAgICMgdGFrZSBvdXQgbWlsbGlzZWNvbmRzXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkaWZmZXJlbmNlX21zLzEwMDBcbiAgICAgICAgdGltZS5zZWNvbmRzICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcyAlIDYwKVxuXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkaWZmZXJlbmNlX21zLzYwIFxuICAgICAgICB0aW1lLm1pbnV0ZXMgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zICUgNjApXG5cbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRpZmZlcmVuY2VfbXMvNjAgXG4gICAgICAgIHRpbWUuaG91cnMgICAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMgJSAyNCkgIFxuXG4gICAgICAgIHRpbWUuZGF5cyAgICAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMvMjQpXG5cbiAgICAgICAgdGltZVxuXG4gICAgQG1hcDogKCBudW0sIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIHJvdW5kID0gZmFsc2UsIGNvbnN0cmFpbk1pbiA9IHRydWUsIGNvbnN0cmFpbk1heCA9IHRydWUgKSAtPlxuICAgICAgICBpZiBjb25zdHJhaW5NaW4gYW5kIG51bSA8IG1pbjEgdGhlbiByZXR1cm4gbWluMlxuICAgICAgICBpZiBjb25zdHJhaW5NYXggYW5kIG51bSA+IG1heDEgdGhlbiByZXR1cm4gbWF4MlxuICAgICAgICBcbiAgICAgICAgbnVtMSA9IChudW0gLSBtaW4xKSAvIChtYXgxIC0gbWluMSlcbiAgICAgICAgbnVtMiA9IChudW0xICogKG1heDIgLSBtaW4yKSkgKyBtaW4yXG4gICAgICAgIGlmIHJvdW5kIHRoZW4gcmV0dXJuIE1hdGgucm91bmQobnVtMilcblxuICAgICAgICByZXR1cm4gbnVtMlxuXG4gICAgQHRvUmFkaWFuczogKCBkZWdyZWUgKSAtPlxuICAgICAgICByZXR1cm4gZGVncmVlICogKCBNYXRoLlBJIC8gMTgwIClcblxuICAgIEB0b0RlZ3JlZTogKCByYWRpYW5zICkgLT5cbiAgICAgICAgcmV0dXJuIHJhZGlhbnMgKiAoIDE4MCAvIE1hdGguUEkgKVxuXG4gICAgQGlzSW5SYW5nZTogKCBudW0sIG1pbiwgbWF4LCBjYW5CZUVxdWFsICkgLT5cbiAgICAgICAgaWYgY2FuQmVFcXVhbCB0aGVuIHJldHVybiBudW0gPj0gbWluICYmIG51bSA8PSBtYXhcbiAgICAgICAgZWxzZSByZXR1cm4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4XG5cbiAgICAjIGNvbnZlcnQgbWV0cmVzIGluIHRvIG0gLyBLTVxuICAgIEBnZXROaWNlRGlzdGFuY2U6IChtZXRyZXMpID0+XG5cbiAgICAgICAgaWYgbWV0cmVzIDwgMTAwMFxuXG4gICAgICAgICAgICByZXR1cm4gXCIje01hdGgucm91bmQobWV0cmVzKX1NXCJcblxuICAgICAgICBlbHNlXG5cbiAgICAgICAgICAgIGttID0gKG1ldHJlcy8xMDAwKS50b0ZpeGVkKDIpXG4gICAgICAgICAgICByZXR1cm4gXCIje2ttfUtNXCJcblxuICAgIEBzaHVmZmxlIDogKG8pID0+XG4gICAgICAgIGBmb3IodmFyIGosIHgsIGkgPSBvLmxlbmd0aDsgaTsgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpLCB4ID0gb1stLWldLCBvW2ldID0gb1tqXSwgb1tqXSA9IHgpO2BcbiAgICAgICAgcmV0dXJuIG9cblxuICAgIEByYW5kb21SYW5nZSA6IChtaW4sbWF4KSA9PlxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihtYXgtbWluKzEpK21pbilcblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXJVdGlsc1xuIiwiY2xhc3MgQWJzdHJhY3RWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlld1xuXG5cdGVsICAgICAgICAgICA6IG51bGxcblx0aWQgICAgICAgICAgIDogbnVsbFxuXHRjaGlsZHJlbiAgICAgOiBudWxsXG5cdHRlbXBsYXRlICAgICA6IG51bGxcblx0dGVtcGxhdGVWYXJzIDogbnVsbFxuXG5cdCMgY296IG9uIHBhZ2UgbG9hZCB3ZSBhbHJlYWR5IGhhdmUgdGhlIERPTSBmb3IgYSBwYWdlLCBpdCB3aWxsIGdldCBpbml0aWFsaXNlZCB0d2ljZSAtIG9uY2Ugb24gY29uc3RydWN0aW9uLCBhbmQgb25jZSB3aGVuIHBhZ2UgaGFzIFwibG9hZGVkXCJcblx0aW5pdGlhbGl6ZWQgOiBmYWxzZVxuXHRcblx0aW5pdGlhbGl6ZSA6IChmb3JjZSkgLT5cblxuXHRcdHJldHVybiB1bmxlc3MgIUBpbml0aWFsaXplZCBvciBmb3JjZVxuXHRcdFxuXHRcdEBjaGlsZHJlbiA9IFtdXG5cblx0XHRpZiBAdGVtcGxhdGVcblx0XHRcdCR0bXBsID0gQE5DKCkuYXBwVmlldy4kZWwuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuXHRcdFx0QHNldEVsZW1lbnQgJHRtcGxcblx0XHRcdHJldHVybiB1bmxlc3MgJHRtcGwubGVuZ3RoXG5cblx0XHRAJGVsLmF0dHIgJ2lkJywgQGlkIGlmIEBpZFxuXHRcdEAkZWwuYWRkQ2xhc3MgQGNsYXNzTmFtZSBpZiBAY2xhc3NOYW1lXG5cdFx0XG5cdFx0QGluaXRpYWxpemVkID0gdHJ1ZVxuXHRcdEBpbml0KClcblxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXG5cdFx0bnVsbFxuXG5cdGluaXQgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZSA6ID0+XG5cblx0XHRudWxsXG5cblx0cmVuZGVyIDogPT5cblxuXHRcdG51bGxcblxuXHRhZGRDaGlsZCA6IChjaGlsZCwgcHJlcGVuZCA9IGZhbHNlKSA9PlxuXG5cdFx0QGNoaWxkcmVuLnB1c2ggY2hpbGQgaWYgY2hpbGQuZWxcblxuXHRcdEBcblxuXHRyZXBsYWNlIDogKGRvbSwgY2hpbGQpID0+XG5cblx0XHRAY2hpbGRyZW4ucHVzaCBjaGlsZCBpZiBjaGlsZC5lbFxuXHRcdGMgPSBpZiBjaGlsZC5lbCB0aGVuIGNoaWxkLiRlbCBlbHNlIGNoaWxkXG5cdFx0QCRlbC5jaGlsZHJlbihkb20pLnJlcGxhY2VXaXRoKGMpXG5cblx0XHRudWxsXG5cblx0cmVtb3ZlIDogKGNoaWxkKSA9PlxuXG5cdFx0dW5sZXNzIGNoaWxkP1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0YyA9IGlmIGNoaWxkLmVsIHRoZW4gY2hpbGQuJGVsIGVsc2UgJChjaGlsZClcblx0XHRjaGlsZC5kaXNwb3NlKCkgaWYgYyBhbmQgY2hpbGQuZGlzcG9zZVxuXG5cdFx0aWYgYyAmJiBAY2hpbGRyZW4uaW5kZXhPZihjaGlsZCkgIT0gLTFcblx0XHRcdEBjaGlsZHJlbi5zcGxpY2UoIEBjaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSApXG5cblx0XHRjLnJlbW92ZSgpXG5cblx0XHRudWxsXG5cblx0b25SZXNpemUgOiAoZXZlbnQpID0+XG5cblx0XHQoaWYgY2hpbGQub25SZXNpemUgdGhlbiBjaGlsZC5vblJlc2l6ZSgpKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0bW91c2VFbmFibGVkIDogKCBlbmFibGVkICkgPT5cblxuXHRcdEAkZWwuY3NzXG5cdFx0XHRcInBvaW50ZXItZXZlbnRzXCI6IGlmIGVuYWJsZWQgdGhlbiBcImF1dG9cIiBlbHNlIFwibm9uZVwiXG5cblx0XHRudWxsXG5cblx0Q1NTVHJhbnNsYXRlIDogKHgsIHksIHZhbHVlPSclJywgc2NhbGUpID0+XG5cblx0XHRpZiBNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZTNkKCN7eCt2YWx1ZX0sICN7eSt2YWx1ZX0sIDApXCJcblx0XHRlbHNlXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZSgje3grdmFsdWV9LCAje3krdmFsdWV9KVwiXG5cblx0XHRpZiBzY2FsZSB0aGVuIHN0ciA9IFwiI3tzdHJ9IHNjYWxlKCN7c2NhbGV9KVwiXG5cblx0XHRzdHJcblxuXHR1bk11dGVBbGwgOiA9PlxuXG5cdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC51bk11dGU/KClcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0Y2hpbGQudW5NdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRtdXRlQWxsIDogPT5cblxuXHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQubXV0ZT8oKVxuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRjaGlsZC5tdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRyZW1vdmVBbGxDaGlsZHJlbjogPT5cblxuXHRcdEByZW1vdmUgY2hpbGQgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHRyaWdnZXJDaGlsZHJlbiA6IChtc2csIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC50cmlnZ2VyIG1zZ1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAdHJpZ2dlckNoaWxkcmVuIG1zZywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW4gOiAobWV0aG9kLCBwYXJhbXMsIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZFttZXRob2RdPyBwYXJhbXNcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QGNhbGxDaGlsZHJlbiBtZXRob2QsIHBhcmFtcywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW5BbmRTZWxmIDogKG1ldGhvZCwgcGFyYW1zLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRAW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAY2FsbENoaWxkcmVuIG1ldGhvZCwgcGFyYW1zLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHN1cHBsYW50U3RyaW5nIDogKHN0ciwgdmFscykgLT5cblxuXHRcdHJldHVybiBzdHIucmVwbGFjZSAve3sgKFtee31dKikgfX0vZywgKGEsIGIpIC0+XG5cdFx0XHRyID0gdmFsc1tiXVxuXHRcdFx0KGlmIHR5cGVvZiByIGlzIFwic3RyaW5nXCIgb3IgdHlwZW9mIHIgaXMgXCJudW1iZXJcIiB0aGVuIHIgZWxzZSBhKVxuXG5cdGRpc3Bvc2UgOiA9PlxuXG5cdFx0QHN0b3BMaXN0ZW5pbmcoKVxuXG5cdFx0bnVsbFxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFZpZXdcbiIsIkFic3RyYWN0VmlldyAgICAgICAgPSByZXF1aXJlICcuLi9BYnN0cmFjdFZpZXcnXG5BYnN0cmFjdFNoYXBlICAgICAgID0gcmVxdWlyZSAnLi9zaGFwZXMvQWJzdHJhY3RTaGFwZSdcbk51bWJlclV0aWxzICAgICAgICAgPSByZXF1aXJlICcuLi8uLi91dGlscy9OdW1iZXJVdGlscydcbkludGVyYWN0aXZlQmdDb25maWcgPSByZXF1aXJlICcuL0ludGVyYWN0aXZlQmdDb25maWcnXG5cbmNsYXNzIEludGVyYWN0aXZlQmcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuXHR0ZW1wbGF0ZSA6ICdpbnRlcmFjdGl2ZS1iYWNrZ3JvdW5kJ1xuXG5cdHN0YWdlICA6IG51bGxcblx0bGF5ZXJzIDoge31cblxuXHRyZW5kZXJlciA6IG51bGxcblx0XG5cdHcgOiAwXG5cdGggOiAwXG5cblx0Y291bnRlciA6IG51bGxcblxuXHRFVkVOVF9LSUxMX1NIQVBFIDogJ0VWRU5UX0tJTExfU0hBUEUnXG5cblx0ZmlsdGVycyA6XG5cdFx0Ymx1ciAgOiBudWxsXG5cdFx0UkdCICAgOiBudWxsXG5cdFx0cGl4ZWwgOiBudWxsXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0c3VwZXJcblxuXHRcdHJldHVybiBudWxsXG5cblx0YWRkR3VpIDogPT5cblxuXHRcdEBndWkgICAgICAgID0gbmV3IGRhdC5HVUlcblx0XHRAZ3VpRm9sZGVycyA9IHt9XG5cblx0XHQjIEBndWkgPSBuZXcgZGF0LkdVSSBhdXRvUGxhY2UgOiBmYWxzZVxuXHRcdCMgQGd1aS5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuXHRcdCMgQGd1aS5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcxMHB4J1xuXHRcdCMgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAZ3VpLmRvbUVsZW1lbnRcblxuXHRcdEBndWlGb2xkZXJzLmdlbmVyYWxGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignR2VuZXJhbCcpXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnR0xPQkFMX1NQRUVEJywgMC41LCA1KS5uYW1lKFwiZ2xvYmFsIHNwZWVkXCIpXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnR0xPQkFMX0FMUEhBJywgMCwgMSkubmFtZShcImdsb2JhbCBhbHBoYVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMuc2l6ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdTaXplJylcblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcywgJ01JTl9XSURUSCcsIDUsIDIwMCkubmFtZSgnbWluIHdpZHRoJylcblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcywgJ01BWF9XSURUSCcsIDUsIDIwMCkubmFtZSgnbWF4IHdpZHRoJylcblxuXHRcdEBndWlGb2xkZXJzLmNvdW50Rm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ0NvdW50Jylcblx0XHRAZ3VpRm9sZGVycy5jb3VudEZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLCAnTUFYX1NIQVBFX0NPVU5UJywgNSwgMTAwMCkubmFtZSgnbWF4IHNoYXBlcycpXG5cblx0XHRAZ3VpRm9sZGVycy5zaGFwZXNGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignU2hhcGVzJylcblx0XHRmb3Igc2hhcGUsIGkgaW4gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZVR5cGVzXG5cdFx0XHRAZ3VpRm9sZGVycy5zaGFwZXNGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVUeXBlc1tpXSwgJ2FjdGl2ZScpLm5hbWUoc2hhcGUudHlwZSlcblxuXHRcdEBndWlGb2xkZXJzLmJsdXJGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQmx1cicpXG5cdFx0QGd1aUZvbGRlcnMuYmx1ckZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnYmx1cicpLm5hbWUoXCJlbmFibGVcIilcblx0XHRAZ3VpRm9sZGVycy5ibHVyRm9sZGVyLmFkZChAZmlsdGVycy5ibHVyLCAnYmx1cicsIDAsIDMyKS5uYW1lKFwiYmx1ciBhbW91bnRcIilcblxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdSR0IgU3BsaXQnKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnUkdCJykubmFtZShcImVuYWJsZVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwicmVkIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5yZWQudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcInJlZCB5XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuZ3JlZW4udmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImdyZWVuIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwiZ3JlZW4geVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImJsdWUgeFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcImJsdWUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignUGl4ZWxsYXRlJylcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAncGl4ZWwnKS5uYW1lKFwiZW5hYmxlXCIpXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIuYWRkKEBmaWx0ZXJzLnBpeGVsLnNpemUsICd4JywgMSwgMzIpLm5hbWUoXCJwaXhlbCBzaXplIHhcIilcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoQGZpbHRlcnMucGl4ZWwuc2l6ZSwgJ3knLCAxLCAzMikubmFtZShcInBpeGVsIHNpemUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdDb2xvdXIgcGFsZXR0ZScpXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZywgJ2FjdGl2ZVBhbGV0dGUnLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnBhbGV0dGVzKS5uYW1lKFwicGFsZXR0ZVwiKVxuXG5cdFx0bnVsbFxuXG5cdGFkZFN0YXRzIDogPT5cblxuXHRcdEBzdGF0cyA9IG5ldyBTdGF0c1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAc3RhdHMuZG9tRWxlbWVudFxuXG5cdFx0bnVsbFxuXG5cdGNyZWF0ZUxheWVycyA6ID0+XG5cblx0XHRmb3IgbGF5ZXIsIG5hbWUgb2YgSW50ZXJhY3RpdmVCZ0NvbmZpZy5sYXllcnNcblx0XHRcdEBsYXllcnNbbmFtZV0gPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyXG5cdFx0XHRAc3RhZ2UuYWRkQ2hpbGQgQGxheWVyc1tuYW1lXVxuXG5cdFx0bnVsbFxuXG5cdGNyZWF0ZVN0YWdlRmlsdGVycyA6ID0+XG5cblx0XHRAZmlsdGVycy5ibHVyICA9IG5ldyBQSVhJLkJsdXJGaWx0ZXJcblx0XHRAZmlsdGVycy5SR0IgICA9IG5ldyBQSVhJLlJHQlNwbGl0RmlsdGVyXG5cdFx0QGZpbHRlcnMucGl4ZWwgPSBuZXcgUElYSS5QaXhlbGF0ZUZpbHRlclxuXG5cdFx0QGZpbHRlcnMuYmx1ci5ibHVyID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5ibHVyLmdlbmVyYWxcblxuXHRcdEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5yZWQudmFsdWUgICA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuUkdCLnJlZFxuXHRcdEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuUkdCLmdyZWVuXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUgID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IuYmx1ZVxuXG5cdFx0QGZpbHRlcnMucGl4ZWwudW5pZm9ybXMucGl4ZWxTaXplLnZhbHVlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5waXhlbC5hbW91bnRcblxuXHRcdG51bGxcblxuXHRpbml0OiA9PlxuXG5cdFx0UElYSS5kb250U2F5SGVsbG8gPSB0cnVlXG5cblx0XHRAc2V0RGltcygpXG5cblx0XHRAc2hhcGVzICAgPSBbXVxuXHRcdEBzdGFnZSAgICA9IG5ldyBQSVhJLlN0YWdlIDB4MUExQTFBXG5cdFx0QHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIgQHcsIEBoLCBhbnRpYWxpYXMgOiB0cnVlXG5cblx0XHRAY3JlYXRlTGF5ZXJzKClcblx0XHRAY3JlYXRlU3RhZ2VGaWx0ZXJzKClcblxuXHRcdEBhZGRHdWkoKVxuXHRcdEBhZGRTdGF0cygpXG5cblx0XHRAJGVsLmFwcGVuZCBAcmVuZGVyZXIudmlld1xuXG5cdFx0QGRyYXcoKVxuXG5cdFx0bnVsbFxuXG5cdGRyYXcgOiA9PlxuXG5cdFx0QGNvdW50ZXIgPSAwXG5cblx0XHRAYmluZEV2ZW50cygpXG5cdFx0QHNldERpbXMoKVxuXG5cdFx0bnVsbFxuXG5cdHNob3cgOiA9PlxuXG5cdFx0QGFkZFNoYXBlcyBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuSU5JVElBTF9TSEFQRV9DT1VOVFxuXHRcdEB1cGRhdGUoKVxuXG5cdFx0bnVsbFxuXG5cdGFkZFNoYXBlcyA6IChjb3VudCkgPT5cblxuXHRcdGZvciBpIGluIFswLi4uY291bnRdXG5cblx0XHRcdHBvcyA9IEBfZ2V0U2hhcGVTdGFydFBvcygpXG5cblx0XHRcdHNoYXBlICA9IG5ldyBBYnN0cmFjdFNoYXBlIEBcblx0XHRcdHNwcml0ZSA9IHNoYXBlLmdldFNwcml0ZSgpXG5cdFx0XHRsYXllciAgPSBzaGFwZS5nZXRMYXllcigpXG5cblx0XHRcdHNwcml0ZS5wb3NpdGlvbi54ID0gcG9zLnhcblx0XHRcdHNwcml0ZS5wb3NpdGlvbi55ID0gcG9zLnlcblxuXHRcdFx0QGxheWVyc1tsYXllcl0uYWRkQ2hpbGQgc3ByaXRlXG5cblx0XHRcdEBzaGFwZXMucHVzaCBzaGFwZVxuXG5cdFx0bnVsbFxuXG5cdF9nZXRTaGFwZVN0YXJ0UG9zIDogPT5cblxuXHRcdHggPSAoTnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgQHc0LCBAdykgKyAoQHc0KjMpXG5cdFx0eSA9IChOdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCAwLCAoQGg0KjMpKSAtIEBoNCozXG5cblx0XHRyZXR1cm4ge3gsIHl9XG5cblx0X2dldFNoYXBlQ291bnQgOiA9PlxuXG5cdFx0Y291bnQgPSAwXG5cdFx0KGNvdW50Kz1kaXNwbGF5Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCkgZm9yIGxheWVyLCBkaXNwbGF5Q29udGFpbmVyIG9mIEBsYXllcnNcblxuXHRcdGNvdW50XG5cblx0cmVtb3ZlU2hhcGUgOiAoc2hhcGUpID0+XG5cblx0XHRpbmRleCA9IEBzaGFwZXMuaW5kZXhPZiBzaGFwZVxuXHRcdCMgQHNoYXBlcy5zcGxpY2UgaW5kZXgsIDFcblx0XHRAc2hhcGVzW2luZGV4XSA9IG51bGxcblxuXHRcdGxheWVyUGFyZW50ID0gQGxheWVyc1tzaGFwZS5nZXRMYXllcigpXVxuXHRcdGxheWVyUGFyZW50LnJlbW92ZUNoaWxkIHNoYXBlLnNcblxuXHRcdGlmIEBfZ2V0U2hhcGVDb3VudCgpIDwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLk1BWF9TSEFQRV9DT1VOVCB0aGVuIEBhZGRTaGFwZXMgMVxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZSA6ID0+XG5cblx0XHRAc3RhdHMuYmVnaW4oKVxuXG5cdFx0QGNvdW50ZXIrK1xuXG5cdFx0aWYgKEBjb3VudGVyICUgNCBpcyAwKSBhbmQgKEBfZ2V0U2hhcGVDb3VudCgpIDwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLk1BWF9TSEFQRV9DT1VOVCkgdGhlbiBAYWRkU2hhcGVzIDFcblxuXHRcdEB1cGRhdGVTaGFwZXMoKVxuXHRcdEByZW5kZXIoKVxuXG5cdFx0ZmlsdGVyc1RvQXBwbHkgPSBbXVxuXHRcdChmaWx0ZXJzVG9BcHBseS5wdXNoIEBmaWx0ZXJzW2ZpbHRlcl0gaWYgZW5hYmxlZCkgZm9yIGZpbHRlciwgZW5hYmxlZCBvZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnNcblxuXHRcdEBzdGFnZS5maWx0ZXJzID0gaWYgZmlsdGVyc1RvQXBwbHkubGVuZ3RoIHRoZW4gZmlsdGVyc1RvQXBwbHkgZWxzZSBudWxsXG5cblx0XHRyZXF1ZXN0QW5pbUZyYW1lIEB1cGRhdGVcblxuXHRcdEBzdGF0cy5lbmQoKVxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZVNoYXBlcyA6ID0+XG5cblx0XHQoc2hhcGU/LmNhbGxBbmltYXRlKCkpIGZvciBzaGFwZSBpbiBAc2hhcGVzXG5cblx0XHRudWxsXG5cblx0cmVuZGVyIDogPT5cblxuXHRcdEByZW5kZXJlci5yZW5kZXIgQHN0YWdlIFxuXG5cdFx0bnVsbFxuXG5cdGJpbmRFdmVudHMgOiA9PlxuXG5cdFx0QE5DKCkuYXBwVmlldy5vbiBATkMoKS5hcHBWaWV3LkVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAc2V0RGltc1xuXHRcdEBvbiBARVZFTlRfS0lMTF9TSEFQRSwgQHJlbW92ZVNoYXBlXG5cblx0XHRudWxsXG5cblx0c2V0RGltcyA6ID0+XG5cblx0XHRAdyA9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0QGggPSBATkMoKS5hcHBWaWV3LmRpbXMuaFxuXG5cdFx0QHcyID0gQHcvMlxuXHRcdEBoMiA9IEBoLzJcblxuXHRcdEB3MiA9IEB3LzJcblx0XHRAaDIgPSBAaC8yXG5cblx0XHRAdzQgPSBAdy80XG5cdFx0QGg0ID0gQGgvNFxuXG5cdFx0QHJlbmRlcmVyPy5yZXNpemUgQHcsIEBoXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJhY3RpdmVCZ1xuIiwiY2xhc3MgSW50ZXJhY3RpdmVCZ0NvbmZpZ1xuXG5cdEBjb2xvcnMgOlxuXHRcdCMgaHR0cDovL2ZsYXR1aWNvbG9ycy5jb20vXG5cdFx0RkxBVCA6IFtcblx0XHRcdCcxOUI2OTgnLFxuXHRcdFx0JzJDQzM2QicsXG5cdFx0XHQnMkU4RUNFJyxcblx0XHRcdCc5QjUwQkEnLFxuXHRcdFx0J0U5OEIzOScsXG5cdFx0XHQnRUE2MTUzJyxcblx0XHRcdCdGMkNBMjcnXG5cdFx0XVxuXHRcdEJXIDogW1xuXHRcdFx0J0U4RThFOCcsXG5cdFx0XHQnRDFEMUQxJyxcblx0XHRcdCdCOUI5QjknLFxuXHRcdFx0J0EzQTNBMycsXG5cdFx0XHQnOEM4QzhDJyxcblx0XHRcdCc3Njc2NzYnLFxuXHRcdFx0JzVFNUU1RSdcblx0XHRdXG5cdFx0UkVEIDogW1xuXHRcdFx0J0FBMzkzOScsXG5cdFx0XHQnRDQ2QTZBJyxcblx0XHRcdCdGRkFBQUEnLFxuXHRcdFx0JzgwMTUxNScsXG5cdFx0XHQnNTUwMDAwJ1xuXHRcdF1cblx0XHQjIGh0dHA6Ly9wYWxldHRvbi5jb20vI3VpZD0xM3YwdTBrbnRTK2M2WFVpa1Z0c3ZQekRSS2Fcblx0XHRCTFVFIDogW1xuXHRcdFx0JzlGRDRGNicsXG5cdFx0XHQnNkVCQ0VGJyxcblx0XHRcdCc0OEE5RTgnLFxuXHRcdFx0JzI0OTVERScsXG5cdFx0XHQnMDk4MUNGJ1xuXHRcdF1cblx0XHQjIGh0dHA6Ly9wYWxldHRvbi5jb20vI3VpZD0xMlkwdTBrbFNMT2I1VlZoM1FZcW9HN3hTLVlcblx0XHRHUkVFTiA6IFtcblx0XHRcdCc5RkY0QzEnLFxuXHRcdFx0JzZERTk5RicsXG5cdFx0XHQnNDZERDgzJyxcblx0XHRcdCcyNUQwNkEnLFxuXHRcdFx0JzAwQzI0Ridcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTF3MHUwa25SdzBlNExFanJDRXRUdXR1WG45XG5cdFx0WUVMTE9XIDogW1xuXHRcdFx0J0ZGRUY4RicsXG5cdFx0XHQnRkZFOTY0Jyxcblx0XHRcdCdGRkU0NDEnLFxuXHRcdFx0J0YzRDMxMCcsXG5cdFx0XHQnQjhBMDA2J1xuXHRcdF1cblxuXHRAcGFsZXR0ZXMgICAgICA6ICdmbGF0JyA6ICdGTEFUJywgJ2ImdycgOiAnQlcnLCAncmVkJyA6ICdSRUQnLCAnYmx1ZScgOiAnQkxVRScsICdncmVlbicgOiAnR1JFRU4nLCAneWVsbG93JyA6ICdZRUxMT1cnXG5cdEBhY3RpdmVQYWxldHRlIDogJ0ZMQVQnXG5cblx0QHNoYXBlVHlwZXM6IFtcblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnQ2lyY2xlJ1xuXHRcdFx0YWN0aXZlIDogdHJ1ZVxuXHRcdH1cblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnU3F1YXJlJ1xuXHRcdFx0YWN0aXZlIDogdHJ1ZVxuXHRcdH1cblx0XHR7XG5cdFx0XHR0eXBlICAgOiAnVHJpYW5nbGUnXG5cdFx0XHRhY3RpdmUgOiB0cnVlXG5cdFx0fVxuXHRdXG5cblx0QHNoYXBlcyA6XG5cdFx0TUlOX1dJRFRIIDogMzBcblx0XHRNQVhfV0lEVEggOiA3MFxuXG5cdFx0TUlOX1NQRUVEX01PVkUgOiAyXG5cdFx0TUFYX1NQRUVEX01PVkUgOiAzLjVcblxuXHRcdE1JTl9TUEVFRF9ST1RBVEUgOiAtMC4wMVxuXHRcdE1BWF9TUEVFRF9ST1RBVEUgOiAwLjAxXG5cblx0XHRNSU5fQUxQSEEgOiAxXG5cdFx0TUFYX0FMUEhBIDogMVxuXG5cdFx0TUlOX0JMVVIgOiAwXG5cdFx0TUFYX0JMVVIgOiAxMFxuXG5cdEBnZW5lcmFsIDogXG5cdFx0R0xPQkFMX1NQRUVEICAgICAgICA6IDFcblx0XHRHTE9CQUxfQUxQSEEgICAgICAgIDogMVxuXHRcdE1BWF9TSEFQRV9DT1VOVCAgICAgOiA4MFxuXHRcdElOSVRJQUxfU0hBUEVfQ09VTlQgOiAxMFxuXG5cdEBsYXllcnMgOlxuXHRcdEJBQ0tHUk9VTkQgOiAnQkFDS0dST1VORCdcblx0XHRNSURHUk9VTkQgIDogJ01JREdST1VORCdcblx0XHRGT1JFR1JPVU5EIDogJ0ZPUkVHUk9VTkQnXG5cblx0QGZpbHRlcnMgOlxuXHRcdGJsdXIgIDogZmFsc2Vcblx0XHRSR0IgICA6IGZhbHNlXG5cdFx0cGl4ZWwgOiBmYWxzZVxuXG5cdEBmaWx0ZXJEZWZhdWx0cyA6XG5cdFx0Ymx1ciA6XG5cdFx0XHRnZW5lcmFsICAgIDogMTBcblx0XHRcdGZvcmVncm91bmQgOiAwXG5cdFx0XHRtaWRncm91bmQgIDogMFxuXHRcdFx0YmFja2dyb3VuZCA6IDBcblx0XHRSR0IgOlxuXHRcdFx0cmVkICAgOiB4IDogMiwgeSA6IDJcblx0XHRcdGdyZWVuIDogeCA6IC0yLCB5IDogMlxuXHRcdFx0Ymx1ZSAgOiB4IDogMiwgeSA6IC0yXG5cdFx0cGl4ZWwgOlxuXHRcdFx0YW1vdW50IDogeCA6IDQsIHkgOiA0XG5cblx0QGdldFJhbmRvbUNvbG9yIDogLT5cblxuXHRcdHJldHVybiBAY29sb3JzW0BhY3RpdmVQYWxldHRlXVtfLnJhbmRvbSgwLCBAY29sb3JzW0BhY3RpdmVQYWxldHRlXS5sZW5ndGgtMSldXG5cblx0QGdldFJhbmRvbVNoYXBlIDogLT5cblxuXHRcdGFjdGl2ZVNoYXBlcyA9IF8uZmlsdGVyIEBzaGFwZVR5cGVzLCAocykgLT4gcy5hY3RpdmVcblxuXHRcdHJldHVybiBhY3RpdmVTaGFwZXNbXy5yYW5kb20oMCwgYWN0aXZlU2hhcGVzLmxlbmd0aC0xKV0udHlwZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aXZlQmdDb25maWdcbiIsIkludGVyYWN0aXZlQmdDb25maWcgPSByZXF1aXJlICcuLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuTnVtYmVyVXRpbHMgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL051bWJlclV0aWxzJ1xuXG5jbGFzcyBBYnN0cmFjdFNoYXBlXG5cblx0ZyA6IG51bGxcblx0cyA6IG51bGxcblxuXHR3aWR0aCAgICAgICA6IG51bGxcblx0c3BlZWRNb3ZlICAgOiBudWxsXG5cdHNwZWVkUm90YXRlIDogbnVsbFxuXHRibHVyVmFsdWUgICA6IG51bGxcblx0YWxwaGFWYWx1ZSAgOiBudWxsXG5cblx0ZGVhZCA6IGZhbHNlXG5cblx0QHRyaWFuZ2xlUmF0aW8gPSBNYXRoLmNvcyhNYXRoLlBJLzYpXG5cblx0Y29uc3RydWN0b3IgOiAoQGludGVyYWN0aXZlQmcpIC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdEB3aWR0aCAgICAgICA9IEBfZ2V0V2lkdGgoKVxuXHRcdEBzcGVlZE1vdmUgICA9IEBfZ2V0U3BlZWRNb3ZlKClcblx0XHRAc3BlZWRSb3RhdGUgPSBAX2dldFNwZWVkUm90YXRlKClcblx0XHRAYmx1clZhbHVlICAgPSBAX2dldEJsdXJWYWx1ZSgpXG5cdFx0QGFscGhhVmFsdWUgID0gQF9nZXRBbHBoYVZhbHVlKClcblxuXHRcdEBnID0gbmV3IFBJWEkuR3JhcGhpY3NcblxuXHRcdEBnLmJlZ2luRmlsbCAnMHgnK0ludGVyYWN0aXZlQmdDb25maWcuZ2V0UmFuZG9tQ29sb3IoKVxuXG5cdFx0c2hhcGVUb0RyYXcgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdldFJhbmRvbVNoYXBlKClcblx0XHRAW1wiX2RyYXcje3NoYXBlVG9EcmF3fVwiXSgpXG5cblx0XHRAZy5lbmRGaWxsKClcblxuXHRcdEBnLmJvdW5kc1BhZGRpbmcgPSBAd2lkdGgqMS4yXG5cblx0XHRAcyA9IG5ldyBQSVhJLlNwcml0ZSBAZy5nZW5lcmF0ZVRleHR1cmUoKVxuXG5cdFx0IyBAYmx1ckZpbHRlciA9IG5ldyBQSVhJLkJsdXJGaWx0ZXJcblx0XHQjIEBibHVyRmlsdGVyLmJsdXIgPSBAYmx1clZhbHVlXG5cblx0XHQjIEBzLmZpbHRlcnMgICA9IFtAYmx1ckZpbHRlcl1cblx0XHRAcy5ibGVuZE1vZGUgPSB3aW5kb3cuYmxlbmQgb3IgUElYSS5ibGVuZE1vZGVzLkFERFxuXHRcdEBzLmFscGhhICAgICA9IEBhbHBoYVZhbHVlXG5cblx0XHRAcy5hbmNob3IueCA9IEBzLmFuY2hvci55ID0gMC41XG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdF9kcmF3VHJpYW5nbGUgOiA9PlxuXG5cdFx0aGVpZ2h0ID0gQHdpZHRoICogQWJzdHJhY3RTaGFwZS50cmlhbmdsZVJhdGlvXG5cblx0XHRAZy5tb3ZlVG8gMCwgMFxuXHRcdEBnLmxpbmVUbyAtQHdpZHRoLzIsIGhlaWdodFxuXHRcdEBnLmxpbmVUbyBAd2lkdGgvMiwgaGVpZ2h0XG5cblx0XHRudWxsXG5cblx0X2RyYXdDaXJjbGUgOiA9PlxuXG5cdFx0QGcuZHJhd0NpcmNsZSAwLCAwLCBAd2lkdGgvMlxuXG5cdFx0bnVsbFxuXG5cdF9kcmF3U3F1YXJlIDogPT5cblxuXHRcdEBnLmRyYXdSZWN0IDAsIDAsIEB3aWR0aCwgQHdpZHRoXG5cblx0XHRudWxsXG5cblx0X2dldFdpZHRoIDogPT5cblxuXHRcdE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIXG5cblx0X2dldFNwZWVkTW92ZSA6ID0+XG5cblx0XHROdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fU1BFRURfTU9WRSwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1NQRUVEX01PVkVcblxuXHRfZ2V0U3BlZWRSb3RhdGUgOiA9PlxuXG5cdFx0TnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1NQRUVEX1JPVEFURSwgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1NQRUVEX1JPVEFURVxuXG5cdF9nZXRCbHVyVmFsdWUgOiA9PlxuXG5cdFx0cmFuZ2UgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfQkxVUiAtIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9CTFVSXG5cdFx0Ymx1ciAgPSAoKEB3aWR0aCAvIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCkgKiByYW5nZSkgKyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQkxVUlxuXG5cdFx0Ymx1clxuXG5cdF9nZXRBbHBoYVZhbHVlIDogPT5cblxuXHRcdHJhbmdlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX0FMUEhBIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX0FMUEhBXG5cdFx0YWxwaGEgPSAoKEB3aWR0aCAvIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCkgKiByYW5nZSkgKyBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQUxQSEFcblxuXHRcdGFscGhhXG5cblx0Y2FsbEFuaW1hdGUgOiA9PlxuXG5cdFx0cmV0dXJuIHVubGVzcyAhQGRlYWRcblxuXHRcdCMgQHMuYmxlbmRNb2RlID0gaWYgSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLlJHQiB0aGVuIFBJWEkuYmxlbmRNb2Rlcy5OT1JNQUwgZWxzZSBQSVhJLmJsZW5kTW9kZXMuQUREXG5cdFx0QHMuYWxwaGEgPSBAYWxwaGFWYWx1ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX0FMUEhBXG5cblx0XHRAcy5wb3NpdGlvbi54IC09IEBzcGVlZE1vdmUqSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXHRcdEBzLnBvc2l0aW9uLnkgKz0gQHNwZWVkTW92ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEXG5cdFx0QHMucm90YXRpb24gKz0gQHNwZWVkUm90YXRlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblxuXHRcdCMgaWYgKEBzLnBvc2l0aW9uLnggKyAoQHdpZHRoLzIpIDwgMCkgdGhlbiBAcy5wb3NpdGlvbi54ICs9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0IyBpZiAoQHMucG9zaXRpb24ueSAtIChAd2lkdGgvMikgPiBATkMoKS5hcHBWaWV3LmRpbXMuaCkgdGhlbiBAcy5wb3NpdGlvbi55IC09IEBOQygpLmFwcFZpZXcuZGltcy5oXG5cblx0XHRpZiAoQHMucG9zaXRpb24ueCArIChAd2lkdGgvMikgPCAwKSBvciAoQHMucG9zaXRpb24ueSAtIChAd2lkdGgvMikgPiBATkMoKS5hcHBWaWV3LmRpbXMuaCkgdGhlbiBAa2lsbCgpXG5cblx0XHRudWxsXG5cblx0a2lsbCA6ID0+XG5cblx0XHRAZGVhZCA9IHRydWVcblxuXHRcdEBpbnRlcmFjdGl2ZUJnLnRyaWdnZXIgQGludGVyYWN0aXZlQmcuRVZFTlRfS0lMTF9TSEFQRSwgQFxuXG5cdGdldFNwcml0ZSA6ID0+XG5cblx0XHRyZXR1cm4gQHNcblxuXHRnZXRMYXllciA6ID0+XG5cblx0XHRyYW5nZSA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9XSURUSCAtIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSFxuXG5cdFx0bGF5ZXIgPSBzd2l0Y2ggdHJ1ZVxuXHRcdFx0d2hlbiBAd2lkdGggPCAocmFuZ2UgLyAzKStJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fV0lEVEggdGhlbiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVycy5CQUNLR1JPVU5EXG5cdFx0XHR3aGVuIEB3aWR0aCA8ICgocmFuZ2UgLyAzKSAqIDIpK0ludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9XSURUSCB0aGVuIEludGVyYWN0aXZlQmdDb25maWcubGF5ZXJzLk1JREdST1VORFxuXHRcdFx0ZWxzZSBJbnRlcmFjdGl2ZUJnQ29uZmlnLmxheWVycy5GT1JFR1JPVU5EXG5cblx0XHRsYXllclxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFNoYXBlXG4iXX0=
