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
    this._getShapeStartPos = __bind(this._getShapeStartPos, this);
    this.addShapes = __bind(this.addShapes, this);
    this.show = __bind(this.show, this);
    this.draw = __bind(this.draw, this);
    this.init = __bind(this.init, this);
    this.addFilters = __bind(this.addFilters, this);
    this.addStats = __bind(this.addStats, this);
    this.addGui = __bind(this.addGui, this);
    InteractiveBg.__super__.constructor.apply(this, arguments);
    return null;
  }

  InteractiveBg.prototype.addGui = function() {
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

  InteractiveBg.prototype.addFilters = function() {
    this.filters.blur = new PIXI.BlurFilter;
    this.filters.RGB = new PIXI.RGBSplitFilter;
    this.filters.pixel = new PIXI.PixelateFilter;
    this.filters.blur.blur = InteractiveBgConfig.filterDefaults.blur.amount;
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
    this.addFilters();
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
    var i, pos, shape, _i;
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      pos = this._getShapeStartPos();
      shape = new AbstractShape(this);
      shape.s.position.x = pos.x;
      shape.s.position.y = pos.y;
      this.stage.addChild(shape.s);
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

  InteractiveBg.prototype.removeShape = function(shape) {
    var index;
    index = this.shapes.indexOf(shape);
    this.shapes[index] = null;
    this.stage.removeChild(shape.s);
    if (this.stage.children.length < InteractiveBgConfig.general.MAX_SHAPE_COUNT) {
      this.addShapes(1);
    }
    return null;
  };

  InteractiveBg.prototype.update = function() {
    var enabled, filter, filtersToApply, _ref;
    this.stats.begin();
    this.counter++;
    if ((this.counter % 4 === 0) && (this.stage.children.length < InteractiveBgConfig.general.MAX_SHAPE_COUNT)) {
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

  InteractiveBgConfig.filters = {
    blur: false,
    RGB: false,
    pixel: false
  };

  InteractiveBgConfig.filterDefaults = {
    blur: {
      amount: 10
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

  return InteractiveBgConfig;

})();

window.InteractiveBgConfig = InteractiveBgConfig;

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

  AbstractShape.prototype._shapes = ['Circle', 'Square', 'Triangle'];

  function AbstractShape(interactiveBg) {
    var shapeToDraw;
    this.interactiveBg = interactiveBg;
    this.NC = __bind(this.NC, this);
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
    shapeToDraw = this._shapes[_.random(0, this._shapes.length - 1)];
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

  AbstractShape.prototype.NC = function() {
    return window.NC;
  };

  return AbstractShape;

})();

module.exports = AbstractShape;



},{"../../../utils/NumberUtils":7,"../InteractiveBgConfig":10}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL051bWJlclV0aWxzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZy5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2ludGVyYWN0aXZlL0ludGVyYWN0aXZlQmdDb25maWcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9pbnRlcmFjdGl2ZS9zaGFwZXMvQWJzdHJhY3RTaGFwZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhCQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBS0E7QUFBQTs7O0dBTEE7O0FBQUEsT0FXQSxHQUFhLEtBWGIsQ0FBQTs7QUFBQSxVQVlBLEdBQWEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFwQyxDQVpiLENBQUE7O0FBQUEsSUFlQSxHQUFVLE9BQUgsR0FBZ0IsRUFBaEIsR0FBeUIsTUFBQSxJQUFVLFFBZjFDLENBQUE7O0FBaUJBLElBQUcsVUFBSDtBQUNDLEVBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUF6QixJQUFzQyxhQUF0QyxDQUREO0NBQUEsTUFBQTtBQUlDLEVBQUEsSUFBSSxDQUFDLEVBQUwsR0FBYyxJQUFBLEdBQUEsQ0FBSSxPQUFKLENBQWQsQ0FBQTtBQUFBLEVBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFSLENBQUEsQ0FEQSxDQUpEO0NBakJBOzs7OztBQ0FBLElBQUEsbUNBQUE7RUFBQSxrRkFBQTs7QUFBQSxPQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FBZixDQUFBOztBQUFBLE9BQ0EsR0FBZSxPQUFBLENBQVEsV0FBUixDQURmLENBQUE7O0FBQUEsWUFFQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUZmLENBQUE7O0FBQUE7QUFNSSxnQkFBQSxJQUFBLEdBQWtCLElBQWxCLENBQUE7O0FBQUEsZ0JBQ0EsU0FBQSxHQUFrQixN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QUFaLElBQWlCLElBQUMsQ0FBQSxTQUFELEdBQVcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFlBTnhELENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxDQUFDLENBQUMsUUFBSCxJQUFlLElBQUMsQ0FBQSxXQUFELEdBQWEsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFlBUHhELENBQUE7QUFZQSxJQUFBLElBQUcsQ0FBQyxJQUFDLENBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFaLEdBQWdCLENBQUMsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFSLENBQWhCLEdBQTZCLENBQTlCLENBQUEsSUFBb0MsQ0FBQyxJQUFDLENBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFaLEdBQWdCLENBQUMsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFSLENBQWhCLEdBQTZCLElBQUMsQ0FBQSxFQUFELENBQUEsQ0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBakQsQ0FBdkM7QUFBZ0csTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBaEc7S0FaQTtXQWNBLEtBaEJhO0VBQUEsQ0E3RmQsQ0FBQTs7QUFBQSwwQkErR0EsSUFBQSxHQUFPLFNBQUEsR0FBQTtBQUVOLElBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7V0FFQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBdUIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBdEMsRUFBd0QsSUFBeEQsRUFKTTtFQUFBLENBL0dQLENBQUE7O0FBQUEsMEJBcUhBLEVBQUEsR0FBSyxTQUFBLEdBQUE7QUFFSixXQUFPLE1BQU0sQ0FBQyxFQUFkLENBRkk7RUFBQSxDQXJITCxDQUFBOzt1QkFBQTs7SUFMRCxDQUFBOztBQUFBLE1BOEhNLENBQUMsT0FBUCxHQUFpQixhQTlIakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcblxuIyBQUk9EVUNUSU9OIEVOVklST05NRU5UIC0gbWF5IHdhbnQgdG8gdXNlIHNlcnZlci1zZXQgdmFyaWFibGVzIGhlcmVcbiMgSVNfTElWRSA9IGRvIC0+IHJldHVybiBpZiB3aW5kb3cubG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA+IC0xIG9yIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggaXMgJz9kJyB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXG4jIyNcblxuV0lQIC0gdGhpcyB3aWxsIGlkZWFsbHkgY2hhbmdlIHRvIG9sZCBmb3JtYXQgKGFib3ZlKSB3aGVuIGNhbiBmaWd1cmUgaXQgb3V0XG5cbiMjI1xuXG5JU19MSVZFICAgID0gZmFsc2VcbklTX1BSRVZJRVcgPSAvcHJldmlldz10cnVlLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG5cbiMgT05MWSBFWFBPU0UgQVBQIEdMT0JBTExZIElGIExPQ0FMIE9SIERFVidJTkdcbnZpZXcgPSBpZiBJU19MSVZFIHRoZW4ge30gZWxzZSAod2luZG93IG9yIGRvY3VtZW50KVxuXG5pZiBJU19QUkVWSUVXXG5cdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBJU19QUkVWSUVXJ1xuZWxzZVxuXHQjIERFQ0xBUkUgTUFJTiBBUFBMSUNBVElPTlxuXHR2aWV3Lk5DID0gbmV3IEFwcCBJU19MSVZFXG5cdHZpZXcuTkMuaW5pdCgpXG4iLCJBcHBEYXRhICAgICAgPSByZXF1aXJlICcuL0FwcERhdGEnXG5BcHBWaWV3ICAgICAgPSByZXF1aXJlICcuL0FwcFZpZXcnXG5NZWRpYVF1ZXJpZXMgPSByZXF1aXJlICcuL3V0aWxzL01lZGlhUXVlcmllcydcblxuY2xhc3MgQXBwXG5cbiAgICBMSVZFICAgICAgICAgICAgOiBudWxsXG4gICAgQkFTRV9QQVRIICAgICAgIDogd2luZG93LmNvbmZpZy5iYXNlX3BhdGhcbiAgICBCQVNFX1VSTCAgICAgICAgOiB3aW5kb3cuY29uZmlnLmJhc2VfdXJsXG4gICAgQkFTRV9VUkxfQVNTRVRTIDogd2luZG93LmNvbmZpZy5iYXNlX3VybF9hc3NldHNcbiAgICBvYmpSZWFkeSAgICAgICAgOiAwXG5cbiAgICBfdG9DbGVhbiAgIDogWydvYmpSZWFkeScsICdzZXRGbGFncycsICdvYmplY3RDb21wbGV0ZScsICdpbml0JywgJ2luaXRPYmplY3RzJywgJ2luaXRTREtzJywgJ2luaXRBcHAnLCAnZ28nLCAnY2xlYW51cCcsICdfdG9DbGVhbiddXG5cbiAgICBjb25zdHJ1Y3RvciA6IChATElWRSkgLT5cblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgc2V0RmxhZ3MgOiA9PlxuXG4gICAgICAgIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5zZXR1cCgpO1xuXG4gICAgICAgICMgQElTX0FORFJPSUQgICAgPSB1YS5pbmRleE9mKCdhbmRyb2lkJykgPiAtMVxuICAgICAgICAjIEBJU19GSVJFRk9YICAgID0gdWEuaW5kZXhPZignZmlyZWZveCcpID4gLTFcbiAgICAgICAgIyBASVNfQ0hST01FX0lPUyA9IGlmIHVhLm1hdGNoKCdjcmlvcycpIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM4MDgwNTNcblxuICAgICAgICBudWxsXG5cbiAgICBvYmplY3RDb21wbGV0ZSA6ID0+XG5cbiAgICAgICAgQG9ialJlYWR5KytcbiAgICAgICAgQGluaXRBcHAoKSBpZiBAb2JqUmVhZHkgPj0gMVxuXG4gICAgICAgIG51bGxcblxuICAgIGluaXQgOiA9PlxuXG4gICAgICAgICMgY3VycmVudGx5IG5vIG9iamVjdHMgdG8gbG9hZCBoZXJlLCBzbyBqdXN0IHN0YXJ0IGFwcFxuICAgICAgICAjIEBpbml0T2JqZWN0cygpXG5cbiAgICAgICAgQGluaXRBcHAoKVxuXG4gICAgICAgIG51bGxcblxuICAgICMgaW5pdE9iamVjdHMgOiA9PlxuXG4gICAgIyAgICAgQHRlbXBsYXRlcyA9IG5ldyBUZW1wbGF0ZXMgXCIje0BCQVNFX1VSTF9BU1NFVFN9L2RhdGEvdGVtcGxhdGVzI3soaWYgQExJVkUgdGhlbiAnLm1pbicgZWxzZSAnJyl9LnhtbFwiLCBAb2JqZWN0Q29tcGxldGVcblxuICAgICMgICAgICMgaWYgbmV3IG9iamVjdHMgYXJlIGFkZGVkIGRvbid0IGZvcmdldCB0byBjaGFuZ2UgdGhlIGBAb2JqZWN0Q29tcGxldGVgIGZ1bmN0aW9uXG5cbiAgICAjICAgICBudWxsXG5cbiAgICBpbml0QXBwIDogPT5cblxuICAgICAgICBAc2V0RmxhZ3MoKVxuXG4gICAgICAgICMjIyBTdGFydHMgYXBwbGljYXRpb24gIyMjXG4gICAgICAgIEBhcHBEYXRhID0gbmV3IEFwcERhdGFcbiAgICAgICAgQGFwcFZpZXcgPSBuZXcgQXBwVmlld1xuXG4gICAgICAgIEBnbygpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgZ28gOiA9PlxuXG4gICAgICAgICMjIyBBZnRlciBldmVyeXRoaW5nIGlzIGxvYWRlZCwga2lja3Mgb2ZmIHdlYnNpdGUgIyMjXG4gICAgICAgIEBhcHBWaWV3LnJlbmRlcigpXG5cbiAgICAgICAgIyMjIHJlbW92ZSByZWR1bmRhbnQgaW5pdGlhbGlzYXRpb24gbWV0aG9kcyAvIHByb3BlcnRpZXMgIyMjXG4gICAgICAgIEBjbGVhbnVwKClcblxuICAgICAgICBudWxsXG5cbiAgICBjbGVhbnVwIDogPT5cblxuICAgICAgICBmb3IgZm4gaW4gQF90b0NsZWFuXG4gICAgICAgICAgICBAW2ZuXSA9IG51bGxcbiAgICAgICAgICAgIGRlbGV0ZSBAW2ZuXVxuXG4gICAgICAgIG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBcbiIsIkFic3RyYWN0RGF0YSA9IHJlcXVpcmUgJy4vZGF0YS9BYnN0cmFjdERhdGEnXG5cbmNsYXNzIEFwcERhdGEgZXh0ZW5kcyBBYnN0cmFjdERhdGFcblxuICAgIGNvbnN0cnVjdG9yIDogLT5cblxuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBEYXRhXG4iLCJBYnN0cmFjdFZpZXcgID0gcmVxdWlyZSAnLi92aWV3L0Fic3RyYWN0Vmlldydcbk1lZGlhUXVlcmllcyAgPSByZXF1aXJlICcuL3V0aWxzL01lZGlhUXVlcmllcydcbkludGVyYWN0aXZlQmcgPSByZXF1aXJlICcuL3ZpZXcvaW50ZXJhY3RpdmUvSW50ZXJhY3RpdmVCZydcblxuY2xhc3MgQXBwVmlldyBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG4gICAgdGVtcGxhdGUgOiAnbWFpbidcblxuICAgICR3aW5kb3cgIDogbnVsbFxuICAgICRib2R5ICAgIDogbnVsbFxuXG4gICAgd3JhcHBlciAgOiBudWxsXG5cbiAgICBkaW1zIDpcbiAgICAgICAgdyA6IG51bGxcbiAgICAgICAgaCA6IG51bGxcbiAgICAgICAgbyA6IG51bGxcbiAgICAgICAgYyA6IG51bGxcbiAgICAgICAgciA6IG51bGxcblxuICAgIHJ3ZFNpemVzIDpcbiAgICAgICAgTEFSR0UgIDogJ0xSRydcbiAgICAgICAgTUVESVVNIDogJ01FRCdcbiAgICAgICAgU01BTEwgIDogJ1NNTCdcblxuICAgIGxhc3RTY3JvbGxZIDogMFxuICAgIHRpY2tpbmcgICAgIDogZmFsc2VcblxuICAgIEVWRU5UX1VQREFURV9ESU1FTlNJT05TIDogJ0VWRU5UX1VQREFURV9ESU1FTlNJT05TJ1xuICAgIEVWRU5UX09OX1NDUk9MTCAgICAgICAgIDogJ0VWRU5UX09OX1NDUk9MTCdcblxuICAgIE1PQklMRV9XSURUSCA6IDcwMFxuICAgIE1PQklMRSAgICAgICA6ICdtb2JpbGUnXG4gICAgTk9OX01PQklMRSAgIDogJ25vbl9tb2JpbGUnXG5cbiAgICBjb25zdHJ1Y3RvciA6IC0+XG5cbiAgICAgICAgQCR3aW5kb3cgPSAkKHdpbmRvdylcbiAgICAgICAgQCRib2R5ICAgPSAkKCdib2R5JykuZXEoMClcblxuICAgICAgICAjIHRoZXNlLCByYXRoZXIgdGhhbiBjYWxsaW5nIHN1cGVyXG4gICAgICAgIEBzZXRFbGVtZW50IEAkYm9keS5maW5kKFwiW2RhdGEtdGVtcGxhdGU9XFxcIiN7QHRlbXBsYXRlfVxcXCJdXCIpXG4gICAgICAgIEBjaGlsZHJlbiA9IFtdXG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIGRpc2FibGVUb3VjaDogPT5cblxuICAgICAgICBAJHdpbmRvdy5vbiAndG91Y2htb3ZlJywgQG9uVG91Y2hNb3ZlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBlbmFibGVUb3VjaDogPT5cblxuICAgICAgICBAJHdpbmRvdy5vZmYgJ3RvdWNobW92ZScsIEBvblRvdWNoTW92ZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25Ub3VjaE1vdmU6ICggZSApIC0+XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICByZW5kZXIgOiA9PlxuXG4gICAgICAgIEBiaW5kRXZlbnRzKClcblxuICAgICAgICBAaW50ZXJhY3RpdmVCZyA9IG5ldyBJbnRlcmFjdGl2ZUJnXG5cbiAgICAgICAgQGFkZENoaWxkIEBpbnRlcmFjdGl2ZUJnXG5cbiAgICAgICAgQG9uQWxsUmVuZGVyZWQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgYmluZEV2ZW50cyA6ID0+XG5cbiAgICAgICAgQG9uICdhbGxSZW5kZXJlZCcsIEBvbkFsbFJlbmRlcmVkXG5cbiAgICAgICAgQG9uUmVzaXplKClcblxuICAgICAgICBAb25SZXNpemUgPSBfLmRlYm91bmNlIEBvblJlc2l6ZSwgMzAwXG4gICAgICAgIEAkd2luZG93Lm9uICdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBAb25SZXNpemVcbiAgICAgICAgQCR3aW5kb3cub24gXCJzY3JvbGxcIiwgQG9uU2Nyb2xsXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblNjcm9sbCA6ID0+XG5cbiAgICAgICAgQGxhc3RTY3JvbGxZID0gd2luZG93LnNjcm9sbFlcbiAgICAgICAgQHJlcXVlc3RUaWNrKClcblxuICAgICAgICBudWxsXG5cbiAgICByZXF1ZXN0VGljayA6ID0+XG5cbiAgICAgICAgaWYgIUB0aWNraW5nXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQHNjcm9sbFVwZGF0ZVxuICAgICAgICAgICAgQHRpY2tpbmcgPSB0cnVlXG5cbiAgICAgICAgbnVsbFxuXG4gICAgc2Nyb2xsVXBkYXRlIDogPT5cblxuICAgICAgICBAdGlja2luZyA9IGZhbHNlXG5cbiAgICAgICAgQCRib2R5LmFkZENsYXNzKCdkaXNhYmxlLWhvdmVyJylcblxuICAgICAgICBjbGVhclRpbWVvdXQgQHRpbWVyU2Nyb2xsXG5cbiAgICAgICAgQHRpbWVyU2Nyb2xsID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgQCRib2R5LnJlbW92ZUNsYXNzKCdkaXNhYmxlLWhvdmVyJylcbiAgICAgICAgLCA1MFxuXG4gICAgICAgIEB0cmlnZ2VyIEFwcFZpZXcuRVZFTlRfT05fU0NST0xMXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb25BbGxSZW5kZXJlZCA6ID0+XG5cbiAgICAgICAgIyBjb25zb2xlLmxvZyBcIm9uQWxsUmVuZGVyZWQgOiA9PlwiXG4gICAgICAgIEBiZWdpbigpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgYmVnaW4gOiA9PlxuXG4gICAgICAgIEB0cmlnZ2VyICdzdGFydCdcblxuICAgICAgICBAb25TY3JvbGwoKVxuICAgICAgICBAaW50ZXJhY3RpdmVCZy5zaG93KClcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uUmVzaXplIDogPT5cblxuICAgICAgICBAZ2V0RGltcygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXREaW1zIDogPT5cblxuICAgICAgICB3ID0gd2luZG93LmlubmVyV2lkdGggb3IgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIG9yIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGhcbiAgICAgICAgaCA9IHdpbmRvdy5pbm5lckhlaWdodCBvciBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IG9yIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XG5cbiAgICAgICAgQGRpbXMgPVxuICAgICAgICAgICAgdyA6IHdcbiAgICAgICAgICAgIGggOiBoXG4gICAgICAgICAgICBvIDogaWYgaCA+IHcgdGhlbiAncG9ydHJhaXQnIGVsc2UgJ2xhbmRzY2FwZSdcbiAgICAgICAgICAgIGMgOiBpZiB3IDw9IEBNT0JJTEVfV0lEVEggdGhlbiBATU9CSUxFIGVsc2UgQE5PTl9NT0JJTEVcbiAgICAgICAgICAgIHIgOiBAZ2V0UndkU2l6ZSB3LCBoLCAod2luZG93LmRldmljZVBpeGVsUmF0aW8gb3IgMSlcblxuICAgICAgICBAdHJpZ2dlciBARVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBkaW1zXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRSd2RTaXplIDogKHcsIGgsIGRwcikgPT5cblxuICAgICAgICBwdyA9IHcqZHByXG5cbiAgICAgICAgc2l6ZSA9IHN3aXRjaCB0cnVlXG4gICAgICAgICAgICB3aGVuIHB3ID4gMTQ0MCB0aGVuIEByd2RTaXplcy5MQVJHRVxuICAgICAgICAgICAgd2hlbiBwdyA8IDY1MCB0aGVuIEByd2RTaXplcy5TTUFMTFxuICAgICAgICAgICAgZWxzZSBAcndkU2l6ZXMuTUVESVVNXG5cbiAgICAgICAgc2l6ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFZpZXdcbiIsImNsYXNzIEFic3RyYWN0RGF0YVxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdF8uZXh0ZW5kIEAsIEJhY2tib25lLkV2ZW50c1xuXG5cdFx0cmV0dXJuIG51bGxcblxuXHROQyA6ID0+XG5cblx0XHRyZXR1cm4gd2luZG93Lk5DXG5cbm1vZHVsZS5leHBvcnRzID0gQWJzdHJhY3REYXRhXG4iLCIjICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgTWVkaWEgUXVlcmllcyBNYW5hZ2VyIFxuIyAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIFxuIyAgIEBhdXRob3IgOiBGw6FiaW8gQXpldmVkbyA8ZmFiaW8uYXpldmVkb0B1bml0OS5jb20+IFVOSVQ5XG4jICAgQGRhdGUgICA6IFNlcHRlbWJlciAxNFxuIyAgIFxuIyAgIEluc3RydWN0aW9ucyBhcmUgb24gL3Byb2plY3Qvc2Fzcy91dGlscy9fcmVzcG9uc2l2ZS5zY3NzLlxuXG5jbGFzcyBNZWRpYVF1ZXJpZXNcblxuICAgICMgQnJlYWtwb2ludHNcbiAgICBAU01BTExFU1QgICAgOiBcInNtYWxsZXN0XCJcbiAgICBAU01BTEwgICAgICAgOiBcInNtYWxsXCJcbiAgICBASVBBRCAgICAgICAgOiBcImlwYWRcIlxuICAgIEBNRURJVU0gICAgICA6IFwibWVkaXVtXCJcbiAgICBATEFSR0UgICAgICAgOiBcImxhcmdlXCJcbiAgICBARVhUUkFfTEFSR0UgOiBcImV4dHJhLWxhcmdlXCJcblxuICAgIEBzZXR1cCA6ID0+XG5cbiAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMRVNUX0JSRUFLUE9JTlQgPSB7bmFtZTogXCJTbWFsbGVzdFwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5TTUFMTEVTVF19XG4gICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTF9CUkVBS1BPSU5UICAgID0ge25hbWU6IFwiU21hbGxcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuU01BTExFU1QsIE1lZGlhUXVlcmllcy5TTUFMTF19XG4gICAgICAgIE1lZGlhUXVlcmllcy5NRURJVU1fQlJFQUtQT0lOVCAgID0ge25hbWU6IFwiTWVkaXVtXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLk1FRElVTV19XG4gICAgICAgIE1lZGlhUXVlcmllcy5MQVJHRV9CUkVBS1BPSU5UICAgID0ge25hbWU6IFwiTGFyZ2VcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuSVBBRCwgTWVkaWFRdWVyaWVzLkxBUkdFLCBNZWRpYVF1ZXJpZXMuRVhUUkFfTEFSR0VdfVxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UUyA9IFtcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTEVTVF9CUkVBS1BPSU5UXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExfQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLk1FRElVTV9CUkVBS1BPSU5UXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuTEFSR0VfQlJFQUtQT0lOVFxuICAgICAgICBdXG4gICAgICAgIHJldHVyblxuXG4gICAgQGdldERldmljZVN0YXRlIDogPT5cblxuICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSwgXCJhZnRlclwiKS5nZXRQcm9wZXJ0eVZhbHVlKFwiY29udGVudFwiKTtcblxuICAgIEBnZXRCcmVha3BvaW50IDogPT5cblxuICAgICAgICBzdGF0ZSA9IE1lZGlhUXVlcmllcy5nZXREZXZpY2VTdGF0ZSgpXG5cbiAgICAgICAgZm9yIGkgaW4gWzAuLi5NZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFMubGVuZ3RoXVxuICAgICAgICAgICAgaWYgTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTW2ldLmJyZWFrcG9pbnRzLmluZGV4T2Yoc3RhdGUpID4gLTFcbiAgICAgICAgICAgICAgICByZXR1cm4gTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTW2ldLm5hbWVcblxuICAgICAgICByZXR1cm4gXCJcIlxuXG4gICAgQGlzQnJlYWtwb2ludCA6IChicmVha3BvaW50KSA9PlxuXG4gICAgICAgIGZvciBpIGluIFswLi4uYnJlYWtwb2ludC5icmVha3BvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGJyZWFrcG9pbnQuYnJlYWtwb2ludHNbaV0gPT0gTWVkaWFRdWVyaWVzLmdldERldmljZVN0YXRlKClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lZGlhUXVlcmllc1xuIiwiY2xhc3MgTnVtYmVyVXRpbHNcblxuICAgIEBNQVRIX0NPUzogTWF0aC5jb3MgXG4gICAgQE1BVEhfU0lOOiBNYXRoLnNpbiBcbiAgICBATUFUSF9SQU5ET006IE1hdGgucmFuZG9tIFxuICAgIEBNQVRIX0FCUzogTWF0aC5hYnNcbiAgICBATUFUSF9BVEFOMjogTWF0aC5hdGFuMlxuXG4gICAgQGxpbWl0OihudW1iZXIsIG1pbiwgbWF4KS0+XG4gICAgICAgIHJldHVybiBNYXRoLm1pbiggTWF0aC5tYXgobWluLG51bWJlciksIG1heCApXG5cbiAgICBAbWFwIDogKG51bSwgbWluMSwgbWF4MSwgbWluMiwgbWF4Miwgcm91bmQgPSBmYWxzZSwgY29uc3RyYWluTWluID0gdHJ1ZSwgY29uc3RyYWluTWF4ID0gdHJ1ZSkgLT5cbiAgICAgICAgICAgIGlmIGNvbnN0cmFpbk1pbiBhbmQgbnVtIDwgbWluMSB0aGVuIHJldHVybiBtaW4yXG4gICAgICAgICAgICBpZiBjb25zdHJhaW5NYXggYW5kIG51bSA+IG1heDEgdGhlbiByZXR1cm4gbWF4MlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBudW0xID0gKG51bSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKVxuICAgICAgICAgICAgbnVtMiA9IChudW0xICogKG1heDIgLSBtaW4yKSkgKyBtaW4yXG4gICAgICAgICAgICBpZiByb3VuZFxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG51bTIpXG4gICAgICAgICAgICByZXR1cm4gbnVtMlxuXG4gICAgQGdldFJhbmRvbUNvbG9yOiAtPlxuXG4gICAgICAgIGxldHRlcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRicuc3BsaXQoJycpXG4gICAgICAgIGNvbG9yID0gJyMnXG4gICAgICAgIGZvciBpIGluIFswLi4uNl1cbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTUpXVxuICAgICAgICBjb2xvclxuXG4gICAgQGdldFJhbmRvbUZsb2F0IDogKG1pbiwgbWF4KSAtPlxuXG4gICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxuXG4gICAgQGdldFRpbWVTdGFtcERpZmYgOiAoZGF0ZTEsIGRhdGUyKSAtPlxuXG4gICAgICAgICMgR2V0IDEgZGF5IGluIG1pbGxpc2Vjb25kc1xuICAgICAgICBvbmVfZGF5ID0gMTAwMCo2MCo2MCoyNFxuICAgICAgICB0aW1lICAgID0ge31cblxuICAgICAgICAjIENvbnZlcnQgYm90aCBkYXRlcyB0byBtaWxsaXNlY29uZHNcbiAgICAgICAgZGF0ZTFfbXMgPSBkYXRlMS5nZXRUaW1lKClcbiAgICAgICAgZGF0ZTJfbXMgPSBkYXRlMi5nZXRUaW1lKClcblxuICAgICAgICAjIENhbGN1bGF0ZSB0aGUgZGlmZmVyZW5jZSBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgZGlmZmVyZW5jZV9tcyA9IGRhdGUyX21zIC0gZGF0ZTFfbXNcblxuICAgICAgICAjIHRha2Ugb3V0IG1pbGxpc2Vjb25kc1xuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGlmZmVyZW5jZV9tcy8xMDAwXG4gICAgICAgIHRpbWUuc2Vjb25kcyAgPSBNYXRoLmZsb29yKGRpZmZlcmVuY2VfbXMgJSA2MClcblxuICAgICAgICBkaWZmZXJlbmNlX21zID0gZGlmZmVyZW5jZV9tcy82MCBcbiAgICAgICAgdGltZS5taW51dGVzICA9IE1hdGguZmxvb3IoZGlmZmVyZW5jZV9tcyAlIDYwKVxuXG4gICAgICAgIGRpZmZlcmVuY2VfbXMgPSBkaWZmZXJlbmNlX21zLzYwIFxuICAgICAgICB0aW1lLmhvdXJzICAgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zICUgMjQpICBcblxuICAgICAgICB0aW1lLmRheXMgICAgID0gTWF0aC5mbG9vcihkaWZmZXJlbmNlX21zLzI0KVxuXG4gICAgICAgIHRpbWVcblxuICAgIEBtYXA6ICggbnVtLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCByb3VuZCA9IGZhbHNlLCBjb25zdHJhaW5NaW4gPSB0cnVlLCBjb25zdHJhaW5NYXggPSB0cnVlICkgLT5cbiAgICAgICAgaWYgY29uc3RyYWluTWluIGFuZCBudW0gPCBtaW4xIHRoZW4gcmV0dXJuIG1pbjJcbiAgICAgICAgaWYgY29uc3RyYWluTWF4IGFuZCBudW0gPiBtYXgxIHRoZW4gcmV0dXJuIG1heDJcbiAgICAgICAgXG4gICAgICAgIG51bTEgPSAobnVtIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpXG4gICAgICAgIG51bTIgPSAobnVtMSAqIChtYXgyIC0gbWluMikpICsgbWluMlxuICAgICAgICBpZiByb3VuZCB0aGVuIHJldHVybiBNYXRoLnJvdW5kKG51bTIpXG5cbiAgICAgICAgcmV0dXJuIG51bTJcblxuICAgIEB0b1JhZGlhbnM6ICggZGVncmVlICkgLT5cbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqICggTWF0aC5QSSAvIDE4MCApXG5cbiAgICBAdG9EZWdyZWU6ICggcmFkaWFucyApIC0+XG4gICAgICAgIHJldHVybiByYWRpYW5zICogKCAxODAgLyBNYXRoLlBJIClcblxuICAgIEBpc0luUmFuZ2U6ICggbnVtLCBtaW4sIG1heCwgY2FuQmVFcXVhbCApIC0+XG4gICAgICAgIGlmIGNhbkJlRXF1YWwgdGhlbiByZXR1cm4gbnVtID49IG1pbiAmJiBudW0gPD0gbWF4XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heFxuXG4gICAgIyBjb252ZXJ0IG1ldHJlcyBpbiB0byBtIC8gS01cbiAgICBAZ2V0TmljZURpc3RhbmNlOiAobWV0cmVzKSA9PlxuXG4gICAgICAgIGlmIG1ldHJlcyA8IDEwMDBcblxuICAgICAgICAgICAgcmV0dXJuIFwiI3tNYXRoLnJvdW5kKG1ldHJlcyl9TVwiXG5cbiAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICBrbSA9IChtZXRyZXMvMTAwMCkudG9GaXhlZCgyKVxuICAgICAgICAgICAgcmV0dXJuIFwiI3trbX1LTVwiXG5cbiAgICBAc2h1ZmZsZSA6IChvKSA9PlxuICAgICAgICBgZm9yKHZhciBqLCB4LCBpID0gby5sZW5ndGg7IGk7IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKSwgeCA9IG9bLS1pXSwgb1tpXSA9IG9bal0sIG9bal0gPSB4KTtgXG4gICAgICAgIHJldHVybiBvXG5cbiAgICBAcmFuZG9tUmFuZ2UgOiAobWluLG1heCkgPT5cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbisxKSttaW4pXG5cbm1vZHVsZS5leHBvcnRzID0gTnVtYmVyVXRpbHNcbiIsImNsYXNzIEFic3RyYWN0VmlldyBleHRlbmRzIEJhY2tib25lLlZpZXdcblxuXHRlbCAgICAgICAgICAgOiBudWxsXG5cdGlkICAgICAgICAgICA6IG51bGxcblx0Y2hpbGRyZW4gICAgIDogbnVsbFxuXHR0ZW1wbGF0ZSAgICAgOiBudWxsXG5cdHRlbXBsYXRlVmFycyA6IG51bGxcblxuXHQjIGNveiBvbiBwYWdlIGxvYWQgd2UgYWxyZWFkeSBoYXZlIHRoZSBET00gZm9yIGEgcGFnZSwgaXQgd2lsbCBnZXQgaW5pdGlhbGlzZWQgdHdpY2UgLSBvbmNlIG9uIGNvbnN0cnVjdGlvbiwgYW5kIG9uY2Ugd2hlbiBwYWdlIGhhcyBcImxvYWRlZFwiXG5cdGluaXRpYWxpemVkIDogZmFsc2Vcblx0XG5cdGluaXRpYWxpemUgOiAoZm9yY2UpIC0+XG5cblx0XHRyZXR1cm4gdW5sZXNzICFAaW5pdGlhbGl6ZWQgb3IgZm9yY2Vcblx0XHRcblx0XHRAY2hpbGRyZW4gPSBbXVxuXG5cdFx0aWYgQHRlbXBsYXRlXG5cdFx0XHQkdG1wbCA9IEBOQygpLmFwcFZpZXcuJGVsLmZpbmQoXCJbZGF0YS10ZW1wbGF0ZT1cXFwiI3tAdGVtcGxhdGV9XFxcIl1cIilcblx0XHRcdEBzZXRFbGVtZW50ICR0bXBsXG5cdFx0XHRyZXR1cm4gdW5sZXNzICR0bXBsLmxlbmd0aFxuXG5cdFx0QCRlbC5hdHRyICdpZCcsIEBpZCBpZiBAaWRcblx0XHRAJGVsLmFkZENsYXNzIEBjbGFzc05hbWUgaWYgQGNsYXNzTmFtZVxuXHRcdFxuXHRcdEBpbml0aWFsaXplZCA9IHRydWVcblx0XHRAaW5pdCgpXG5cblx0XHRAcGF1c2VkID0gZmFsc2VcblxuXHRcdG51bGxcblxuXHRpbml0IDogPT5cblxuXHRcdG51bGxcblxuXHR1cGRhdGUgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdHJlbmRlciA6ID0+XG5cblx0XHRudWxsXG5cblx0YWRkQ2hpbGQgOiAoY2hpbGQsIHByZXBlbmQgPSBmYWxzZSkgPT5cblxuXHRcdEBjaGlsZHJlbi5wdXNoIGNoaWxkIGlmIGNoaWxkLmVsXG5cblx0XHRAXG5cblx0cmVwbGFjZSA6IChkb20sIGNoaWxkKSA9PlxuXG5cdFx0QGNoaWxkcmVuLnB1c2ggY2hpbGQgaWYgY2hpbGQuZWxcblx0XHRjID0gaWYgY2hpbGQuZWwgdGhlbiBjaGlsZC4kZWwgZWxzZSBjaGlsZFxuXHRcdEAkZWwuY2hpbGRyZW4oZG9tKS5yZXBsYWNlV2l0aChjKVxuXG5cdFx0bnVsbFxuXG5cdHJlbW92ZSA6IChjaGlsZCkgPT5cblxuXHRcdHVubGVzcyBjaGlsZD9cblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdGMgPSBpZiBjaGlsZC5lbCB0aGVuIGNoaWxkLiRlbCBlbHNlICQoY2hpbGQpXG5cdFx0Y2hpbGQuZGlzcG9zZSgpIGlmIGMgYW5kIGNoaWxkLmRpc3Bvc2VcblxuXHRcdGlmIGMgJiYgQGNoaWxkcmVuLmluZGV4T2YoY2hpbGQpICE9IC0xXG5cdFx0XHRAY2hpbGRyZW4uc3BsaWNlKCBAY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEgKVxuXG5cdFx0Yy5yZW1vdmUoKVxuXG5cdFx0bnVsbFxuXG5cdG9uUmVzaXplIDogKGV2ZW50KSA9PlxuXG5cdFx0KGlmIGNoaWxkLm9uUmVzaXplIHRoZW4gY2hpbGQub25SZXNpemUoKSkgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdG1vdXNlRW5hYmxlZCA6ICggZW5hYmxlZCApID0+XG5cblx0XHRAJGVsLmNzc1xuXHRcdFx0XCJwb2ludGVyLWV2ZW50c1wiOiBpZiBlbmFibGVkIHRoZW4gXCJhdXRvXCIgZWxzZSBcIm5vbmVcIlxuXG5cdFx0bnVsbFxuXG5cdENTU1RyYW5zbGF0ZSA6ICh4LCB5LCB2YWx1ZT0nJScsIHNjYWxlKSA9PlxuXG5cdFx0aWYgTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMzZFxuXHRcdFx0c3RyID0gXCJ0cmFuc2xhdGUzZCgje3grdmFsdWV9LCAje3krdmFsdWV9LCAwKVwiXG5cdFx0ZWxzZVxuXHRcdFx0c3RyID0gXCJ0cmFuc2xhdGUoI3t4K3ZhbHVlfSwgI3t5K3ZhbHVlfSlcIlxuXG5cdFx0aWYgc2NhbGUgdGhlbiBzdHIgPSBcIiN7c3RyfSBzY2FsZSgje3NjYWxlfSlcIlxuXG5cdFx0c3RyXG5cblx0dW5NdXRlQWxsIDogPT5cblxuXHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQudW5NdXRlPygpXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdGNoaWxkLnVuTXV0ZUFsbCgpXG5cblx0XHRudWxsXG5cblx0bXV0ZUFsbCA6ID0+XG5cblx0XHRmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLm11dGU/KClcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0Y2hpbGQubXV0ZUFsbCgpXG5cblx0XHRudWxsXG5cblx0cmVtb3ZlQWxsQ2hpbGRyZW46ID0+XG5cblx0XHRAcmVtb3ZlIGNoaWxkIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHR0cmlnZ2VyQ2hpbGRyZW4gOiAobXNnLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQudHJpZ2dlciBtc2dcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QHRyaWdnZXJDaGlsZHJlbiBtc2csIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0Y2FsbENoaWxkcmVuIDogKG1ldGhvZCwgcGFyYW1zLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGRbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEBjYWxsQ2hpbGRyZW4gbWV0aG9kLCBwYXJhbXMsIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0Y2FsbENoaWxkcmVuQW5kU2VsZiA6IChtZXRob2QsIHBhcmFtcywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0QFttZXRob2RdPyBwYXJhbXNcblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZFttZXRob2RdPyBwYXJhbXNcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QGNhbGxDaGlsZHJlbiBtZXRob2QsIHBhcmFtcywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRzdXBwbGFudFN0cmluZyA6IChzdHIsIHZhbHMpIC0+XG5cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UgL3t7IChbXnt9XSopIH19L2csIChhLCBiKSAtPlxuXHRcdFx0ciA9IHZhbHNbYl1cblx0XHRcdChpZiB0eXBlb2YgciBpcyBcInN0cmluZ1wiIG9yIHR5cGVvZiByIGlzIFwibnVtYmVyXCIgdGhlbiByIGVsc2UgYSlcblxuXHRkaXNwb3NlIDogPT5cblxuXHRcdEBzdG9wTGlzdGVuaW5nKClcblxuXHRcdG51bGxcblxuXHROQyA6ID0+XG5cblx0XHRyZXR1cm4gd2luZG93Lk5DXG5cbm1vZHVsZS5leHBvcnRzID0gQWJzdHJhY3RWaWV3XG4iLCJBYnN0cmFjdFZpZXcgICAgICAgID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuQWJzdHJhY3RTaGFwZSAgICAgICA9IHJlcXVpcmUgJy4vc2hhcGVzL0Fic3RyYWN0U2hhcGUnXG5OdW1iZXJVdGlscyAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vdXRpbHMvTnVtYmVyVXRpbHMnXG5JbnRlcmFjdGl2ZUJnQ29uZmlnID0gcmVxdWlyZSAnLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuXG5jbGFzcyBJbnRlcmFjdGl2ZUJnIGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cblx0dGVtcGxhdGUgOiAnaW50ZXJhY3RpdmUtYmFja2dyb3VuZCdcblx0c3RhZ2UgICAgOiBudWxsXG5cdHJlbmRlcmVyIDogbnVsbFxuXHRcblx0dyA6IDBcblx0aCA6IDBcblxuXHRjb3VudGVyIDogbnVsbFxuXG5cdEVWRU5UX0tJTExfU0hBUEUgOiAnRVZFTlRfS0lMTF9TSEFQRSdcblxuXHRmaWx0ZXJzIDpcblx0XHRibHVyICA6IG51bGxcblx0XHRSR0IgICA6IG51bGxcblx0XHRwaXhlbCA6IG51bGxcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRhZGRHdWkgOiA9PlxuXG5cdFx0QGd1aSAgICAgICAgPSBuZXcgZGF0LkdVSVxuXHRcdEBndWlGb2xkZXJzID0ge31cblxuXHRcdCMgQGd1aSA9IG5ldyBkYXQuR1VJIGF1dG9QbGFjZSA6IGZhbHNlXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG5cdFx0IyBAZ3VpLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0XHQjIEBndWkuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzEwcHgnXG5cdFx0IyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIEBndWkuZG9tRWxlbWVudFxuXG5cdFx0QGd1aUZvbGRlcnMuZ2VuZXJhbEZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdHZW5lcmFsJylcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfU1BFRUQnLCAwLjUsIDUpLm5hbWUoXCJnbG9iYWwgc3BlZWRcIilcblx0XHRAZ3VpRm9sZGVycy5nZW5lcmFsRm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdHTE9CQUxfQUxQSEEnLCAwLCAxKS5uYW1lKFwiZ2xvYmFsIGFscGhhXCIpXG5cblx0XHRAZ3VpRm9sZGVycy5zaXplRm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ1NpemUnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUlOX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtaW4gd2lkdGgnKVxuXHRcdEBndWlGb2xkZXJzLnNpemVGb2xkZXIuYWRkKEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLCAnTUFYX1dJRFRIJywgNSwgMjAwKS5uYW1lKCdtYXggd2lkdGgnKVxuXG5cdFx0QGd1aUZvbGRlcnMuY291bnRGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQ291bnQnKVxuXHRcdEBndWlGb2xkZXJzLmNvdW50Rm9sZGVyLmFkZChJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwsICdNQVhfU0hBUEVfQ09VTlQnLCA1LCAxMDAwKS5uYW1lKCdtYXggc2hhcGVzJylcblxuXHRcdEBndWlGb2xkZXJzLmJsdXJGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignQmx1cicpXG5cdFx0QGd1aUZvbGRlcnMuYmx1ckZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnYmx1cicpLm5hbWUoXCJlbmFibGVcIilcblx0XHRAZ3VpRm9sZGVycy5ibHVyRm9sZGVyLmFkZChAZmlsdGVycy5ibHVyLCAnYmx1cicsIDAsIDMyKS5uYW1lKFwiYmx1ciBhbW91bnRcIilcblxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdSR0IgU3BsaXQnKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAnUkdCJykubmFtZShcImVuYWJsZVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLnJlZC52YWx1ZSwgJ3gnLCAtMjAsIDIwKS5uYW1lKFwicmVkIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5yZWQudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcInJlZCB5XCIpXG5cdFx0QGd1aUZvbGRlcnMuUkdCRm9sZGVyLmFkZChAZmlsdGVycy5SR0IudW5pZm9ybXMuZ3JlZW4udmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImdyZWVuIHhcIilcblx0XHRAZ3VpRm9sZGVycy5SR0JGb2xkZXIuYWRkKEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSwgJ3knLCAtMjAsIDIwKS5uYW1lKFwiZ3JlZW4geVwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd4JywgLTIwLCAyMCkubmFtZShcImJsdWUgeFwiKVxuXHRcdEBndWlGb2xkZXJzLlJHQkZvbGRlci5hZGQoQGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUsICd5JywgLTIwLCAyMCkubmFtZShcImJsdWUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignUGl4ZWxsYXRlJylcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzLCAncGl4ZWwnKS5uYW1lKFwiZW5hYmxlXCIpXG5cdFx0QGd1aUZvbGRlcnMucGl4ZWxhdGVGb2xkZXIuYWRkKEBmaWx0ZXJzLnBpeGVsLnNpemUsICd4JywgMSwgMzIpLm5hbWUoXCJwaXhlbCBzaXplIHhcIilcblx0XHRAZ3VpRm9sZGVycy5waXhlbGF0ZUZvbGRlci5hZGQoQGZpbHRlcnMucGl4ZWwuc2l6ZSwgJ3knLCAxLCAzMikubmFtZShcInBpeGVsIHNpemUgeVwiKVxuXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdDb2xvdXIgcGFsZXR0ZScpXG5cdFx0QGd1aUZvbGRlcnMucGFsZXR0ZUZvbGRlci5hZGQoSW50ZXJhY3RpdmVCZ0NvbmZpZywgJ2FjdGl2ZVBhbGV0dGUnLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnBhbGV0dGVzKS5uYW1lKFwicGFsZXR0ZVwiKVxuXG5cdFx0bnVsbFxuXG5cdGFkZFN0YXRzIDogPT5cblxuXHRcdEBzdGF0cyA9IG5ldyBTdGF0c1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuXHRcdEBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBAc3RhdHMuZG9tRWxlbWVudFxuXG5cdFx0bnVsbFxuXG5cdGFkZEZpbHRlcnMgOiA9PlxuXG5cdFx0QGZpbHRlcnMuYmx1ciAgPSBuZXcgUElYSS5CbHVyRmlsdGVyXG5cdFx0QGZpbHRlcnMuUkdCICAgPSBuZXcgUElYSS5SR0JTcGxpdEZpbHRlclxuXHRcdEBmaWx0ZXJzLnBpeGVsID0gbmV3IFBJWEkuUGl4ZWxhdGVGaWx0ZXJcblxuXHRcdEBmaWx0ZXJzLmJsdXIuYmx1ciA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuYmx1ci5hbW91bnRcblxuXHRcdEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5yZWQudmFsdWUgICA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuUkdCLnJlZFxuXHRcdEBmaWx0ZXJzLlJHQi51bmlmb3Jtcy5ncmVlbi52YWx1ZSA9IEludGVyYWN0aXZlQmdDb25maWcuZmlsdGVyRGVmYXVsdHMuUkdCLmdyZWVuXG5cdFx0QGZpbHRlcnMuUkdCLnVuaWZvcm1zLmJsdWUudmFsdWUgID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5SR0IuYmx1ZVxuXG5cdFx0QGZpbHRlcnMucGl4ZWwudW5pZm9ybXMucGl4ZWxTaXplLnZhbHVlID0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJEZWZhdWx0cy5waXhlbC5hbW91bnRcblxuXHRcdG51bGxcblxuXHRpbml0OiA9PlxuXG5cdFx0UElYSS5kb250U2F5SGVsbG8gPSB0cnVlXG5cblx0XHRAc2V0RGltcygpXG5cblx0XHRAc2hhcGVzICAgPSBbXVxuXHRcdEBzdGFnZSAgICA9IG5ldyBQSVhJLlN0YWdlIDB4MUExQTFBXG5cdFx0QHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIgQHcsIEBoLCBhbnRpYWxpYXMgOiB0cnVlXG5cblx0XHRAYWRkRmlsdGVycygpXG5cdFx0QGFkZEd1aSgpXG5cdFx0QGFkZFN0YXRzKClcblxuXHRcdEAkZWwuYXBwZW5kIEByZW5kZXJlci52aWV3XG5cblx0XHRAZHJhdygpXG5cblx0XHRudWxsXG5cblx0ZHJhdyA6ID0+XG5cblx0XHRAY291bnRlciA9IDBcblxuXHRcdEBiaW5kRXZlbnRzKClcblx0XHRAc2V0RGltcygpXG5cblx0XHRudWxsXG5cblx0c2hvdyA6ID0+XG5cblx0XHRAYWRkU2hhcGVzIEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5JTklUSUFMX1NIQVBFX0NPVU5UXG5cdFx0QHVwZGF0ZSgpXG5cblx0XHRudWxsXG5cblx0YWRkU2hhcGVzIDogKGNvdW50KSA9PlxuXG5cdFx0Zm9yIGkgaW4gWzAuLi5jb3VudF1cblxuXHRcdFx0cG9zID0gQF9nZXRTaGFwZVN0YXJ0UG9zKClcblxuXHRcdFx0c2hhcGUgPSBuZXcgQWJzdHJhY3RTaGFwZSBAXG5cdFx0XHRzaGFwZS5zLnBvc2l0aW9uLnggPSBwb3MueFxuXHRcdFx0c2hhcGUucy5wb3NpdGlvbi55ID0gcG9zLnlcblxuXHRcdFx0QHN0YWdlLmFkZENoaWxkIHNoYXBlLnNcblxuXHRcdFx0QHNoYXBlcy5wdXNoIHNoYXBlXG5cblx0XHRudWxsXG5cblx0X2dldFNoYXBlU3RhcnRQb3MgOiA9PlxuXG5cdFx0eCA9IChOdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBAdzQsIEB3KSArIChAdzQqMylcblx0XHR5ID0gKE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IDAsIChAaDQqMykpIC0gQGg0KjNcblxuXHRcdHJldHVybiB7eCwgeX1cblxuXHRyZW1vdmVTaGFwZSA6IChzaGFwZSkgPT5cblxuXHRcdGluZGV4ID0gQHNoYXBlcy5pbmRleE9mIHNoYXBlXG5cdFx0IyBAc2hhcGVzLnNwbGljZSBpbmRleCwgMVxuXHRcdEBzaGFwZXNbaW5kZXhdID0gbnVsbFxuXG5cdFx0QHN0YWdlLnJlbW92ZUNoaWxkIHNoYXBlLnNcblxuXHRcdGlmIEBzdGFnZS5jaGlsZHJlbi5sZW5ndGggPCBJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuTUFYX1NIQVBFX0NPVU5UIHRoZW4gQGFkZFNoYXBlcyAxXG5cblx0XHRudWxsXG5cblx0dXBkYXRlIDogPT5cblxuXHRcdEBzdGF0cy5iZWdpbigpXG5cblx0XHRAY291bnRlcisrXG5cblx0XHRpZiAoQGNvdW50ZXIgJSA0IGlzIDApIGFuZCAoQHN0YWdlLmNoaWxkcmVuLmxlbmd0aCA8IEludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5NQVhfU0hBUEVfQ09VTlQpIHRoZW4gQGFkZFNoYXBlcyAxXG5cblx0XHRAdXBkYXRlU2hhcGVzKClcblx0XHRAcmVuZGVyKClcblxuXHRcdGZpbHRlcnNUb0FwcGx5ID0gW11cblx0XHQoZmlsdGVyc1RvQXBwbHkucHVzaCBAZmlsdGVyc1tmaWx0ZXJdIGlmIGVuYWJsZWQpIGZvciBmaWx0ZXIsIGVuYWJsZWQgb2YgSW50ZXJhY3RpdmVCZ0NvbmZpZy5maWx0ZXJzXG5cblx0XHRAc3RhZ2UuZmlsdGVycyA9IGlmIGZpbHRlcnNUb0FwcGx5Lmxlbmd0aCB0aGVuIGZpbHRlcnNUb0FwcGx5IGVsc2UgbnVsbFxuXG5cdFx0cmVxdWVzdEFuaW1GcmFtZSBAdXBkYXRlXG5cblx0XHRAc3RhdHMuZW5kKClcblxuXHRcdG51bGxcblxuXHR1cGRhdGVTaGFwZXMgOiA9PlxuXG5cdFx0KHNoYXBlPy5jYWxsQW5pbWF0ZSgpKSBmb3Igc2hhcGUgaW4gQHNoYXBlc1xuXG5cdFx0bnVsbFxuXG5cdHJlbmRlciA6ID0+XG5cblx0XHRAcmVuZGVyZXIucmVuZGVyIEBzdGFnZSBcblxuXHRcdG51bGxcblxuXHRiaW5kRXZlbnRzIDogPT5cblxuXHRcdEBOQygpLmFwcFZpZXcub24gQE5DKCkuYXBwVmlldy5FVkVOVF9VUERBVEVfRElNRU5TSU9OUywgQHNldERpbXNcblx0XHRAb24gQEVWRU5UX0tJTExfU0hBUEUsIEByZW1vdmVTaGFwZVxuXG5cdFx0bnVsbFxuXG5cdHNldERpbXMgOiA9PlxuXG5cdFx0QHcgPSBATkMoKS5hcHBWaWV3LmRpbXMud1xuXHRcdEBoID0gQE5DKCkuYXBwVmlldy5kaW1zLmhcblxuXHRcdEB3MiA9IEB3LzJcblx0XHRAaDIgPSBAaC8yXG5cblx0XHRAdzIgPSBAdy8yXG5cdFx0QGgyID0gQGgvMlxuXG5cdFx0QHc0ID0gQHcvNFxuXHRcdEBoNCA9IEBoLzRcblxuXHRcdEByZW5kZXJlcj8ucmVzaXplIEB3LCBAaFxuXG5cdFx0bnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aXZlQmdcbiIsImNsYXNzIEludGVyYWN0aXZlQmdDb25maWdcblxuXHRAY29sb3JzIDpcblx0XHQjIGh0dHA6Ly9mbGF0dWljb2xvcnMuY29tL1xuXHRcdEZMQVQgOiBbXG5cdFx0XHQnMTlCNjk4Jyxcblx0XHRcdCcyQ0MzNkInLFxuXHRcdFx0JzJFOEVDRScsXG5cdFx0XHQnOUI1MEJBJyxcblx0XHRcdCdFOThCMzknLFxuXHRcdFx0J0VBNjE1MycsXG5cdFx0XHQnRjJDQTI3J1xuXHRcdF1cblx0XHRCVyA6IFtcblx0XHRcdCdFOEU4RTgnLFxuXHRcdFx0J0QxRDFEMScsXG5cdFx0XHQnQjlCOUI5Jyxcblx0XHRcdCdBM0EzQTMnLFxuXHRcdFx0JzhDOEM4QycsXG5cdFx0XHQnNzY3Njc2Jyxcblx0XHRcdCc1RTVFNUUnXG5cdFx0XVxuXHRcdFJFRCA6IFtcblx0XHRcdCdBQTM5MzknLFxuXHRcdFx0J0Q0NkE2QScsXG5cdFx0XHQnRkZBQUFBJyxcblx0XHRcdCc4MDE1MTUnLFxuXHRcdFx0JzU1MDAwMCdcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTN2MHUwa250UytjNlhVaWtWdHN2UHpEUkthXG5cdFx0QkxVRSA6IFtcblx0XHRcdCc5RkQ0RjYnLFxuXHRcdFx0JzZFQkNFRicsXG5cdFx0XHQnNDhBOUU4Jyxcblx0XHRcdCcyNDk1REUnLFxuXHRcdFx0JzA5ODFDRidcblx0XHRdXG5cdFx0IyBodHRwOi8vcGFsZXR0b24uY29tLyN1aWQ9MTJZMHUwa2xTTE9iNVZWaDNRWXFvRzd4Uy1ZXG5cdFx0R1JFRU4gOiBbXG5cdFx0XHQnOUZGNEMxJyxcblx0XHRcdCc2REU5OUYnLFxuXHRcdFx0JzQ2REQ4MycsXG5cdFx0XHQnMjVEMDZBJyxcblx0XHRcdCcwMEMyNEYnXG5cdFx0XVxuXHRcdCMgaHR0cDovL3BhbGV0dG9uLmNvbS8jdWlkPTExdzB1MGtuUncwZTRMRWpyQ0V0VHV0dVhuOVxuXHRcdFlFTExPVyA6IFtcblx0XHRcdCdGRkVGOEYnLFxuXHRcdFx0J0ZGRTk2NCcsXG5cdFx0XHQnRkZFNDQxJyxcblx0XHRcdCdGM0QzMTAnLFxuXHRcdFx0J0I4QTAwNidcblx0XHRdXG5cblx0QHBhbGV0dGVzICAgICAgOiAnZmxhdCcgOiAnRkxBVCcsICdiJncnIDogJ0JXJywgJ3JlZCcgOiAnUkVEJywgJ2JsdWUnIDogJ0JMVUUnLCAnZ3JlZW4nIDogJ0dSRUVOJywgJ3llbGxvdycgOiAnWUVMTE9XJ1xuXHRAYWN0aXZlUGFsZXR0ZSA6ICdGTEFUJ1xuXG5cdEBzaGFwZXMgOlxuXHRcdE1JTl9XSURUSCA6IDMwXG5cdFx0TUFYX1dJRFRIIDogNzBcblxuXHRcdE1JTl9TUEVFRF9NT1ZFIDogMlxuXHRcdE1BWF9TUEVFRF9NT1ZFIDogMy41XG5cblx0XHRNSU5fU1BFRURfUk9UQVRFIDogLTAuMDFcblx0XHRNQVhfU1BFRURfUk9UQVRFIDogMC4wMVxuXG5cdFx0TUlOX0FMUEhBIDogMVxuXHRcdE1BWF9BTFBIQSA6IDFcblxuXHRcdE1JTl9CTFVSIDogMFxuXHRcdE1BWF9CTFVSIDogMTBcblxuXHRAZ2VuZXJhbCA6IFxuXHRcdEdMT0JBTF9TUEVFRCAgICAgICAgOiAxXG5cdFx0R0xPQkFMX0FMUEhBICAgICAgICA6IDFcblx0XHRNQVhfU0hBUEVfQ09VTlQgICAgIDogODBcblx0XHRJTklUSUFMX1NIQVBFX0NPVU5UIDogMTBcblxuXHRAZmlsdGVycyA6XG5cdFx0Ymx1ciAgOiBmYWxzZVxuXHRcdFJHQiAgIDogZmFsc2Vcblx0XHRwaXhlbCA6IGZhbHNlXG5cblx0QGZpbHRlckRlZmF1bHRzIDpcblx0XHRibHVyIDpcblx0XHRcdGFtb3VudCA6IDEwXG5cdFx0UkdCIDpcblx0XHRcdHJlZCAgIDogeCA6IDIsIHkgOiAyXG5cdFx0XHRncmVlbiA6IHggOiAtMiwgeSA6IDJcblx0XHRcdGJsdWUgIDogeCA6IDIsIHkgOiAtMlxuXHRcdHBpeGVsIDpcblx0XHRcdGFtb3VudCA6IHggOiA0LCB5IDogNFxuXG5cdEBnZXRSYW5kb21Db2xvciA6IC0+XG5cblx0XHRyZXR1cm4gQGNvbG9yc1tAYWN0aXZlUGFsZXR0ZV1bXy5yYW5kb20oMCwgQGNvbG9yc1tAYWN0aXZlUGFsZXR0ZV0ubGVuZ3RoLTEpXVxuXG53aW5kb3cuSW50ZXJhY3RpdmVCZ0NvbmZpZz1JbnRlcmFjdGl2ZUJnQ29uZmlnXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyYWN0aXZlQmdDb25maWdcbiIsIkludGVyYWN0aXZlQmdDb25maWcgPSByZXF1aXJlICcuLi9JbnRlcmFjdGl2ZUJnQ29uZmlnJ1xuTnVtYmVyVXRpbHMgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL051bWJlclV0aWxzJ1xuXG5jbGFzcyBBYnN0cmFjdFNoYXBlXG5cblx0ZyA6IG51bGxcblx0cyA6IG51bGxcblxuXHR3aWR0aCAgICAgICA6IG51bGxcblx0c3BlZWRNb3ZlICAgOiBudWxsXG5cdHNwZWVkUm90YXRlIDogbnVsbFxuXHRibHVyVmFsdWUgICA6IG51bGxcblx0YWxwaGFWYWx1ZSAgOiBudWxsXG5cblx0ZGVhZCA6IGZhbHNlXG5cblx0X3NoYXBlcyA6IFsnQ2lyY2xlJywgJ1NxdWFyZScsICdUcmlhbmdsZSddXG5cblx0Y29uc3RydWN0b3IgOiAoQGludGVyYWN0aXZlQmcpIC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdEB3aWR0aCAgICAgICA9IEBfZ2V0V2lkdGgoKVxuXHRcdEBzcGVlZE1vdmUgICA9IEBfZ2V0U3BlZWRNb3ZlKClcblx0XHRAc3BlZWRSb3RhdGUgPSBAX2dldFNwZWVkUm90YXRlKClcblx0XHRAYmx1clZhbHVlICAgPSBAX2dldEJsdXJWYWx1ZSgpXG5cdFx0QGFscGhhVmFsdWUgID0gQF9nZXRBbHBoYVZhbHVlKClcblxuXHRcdEBnID0gbmV3IFBJWEkuR3JhcGhpY3NcblxuXHRcdEBnLmJlZ2luRmlsbCAnMHgnK0ludGVyYWN0aXZlQmdDb25maWcuZ2V0UmFuZG9tQ29sb3IoKVxuXG5cdFx0c2hhcGVUb0RyYXcgPSBAX3NoYXBlc1tfLnJhbmRvbSgwLCBAX3NoYXBlcy5sZW5ndGgtMSldXG5cdFx0QFtcIl9kcmF3I3tzaGFwZVRvRHJhd31cIl0oKVxuXG5cdFx0QGcuZW5kRmlsbCgpXG5cblx0XHRAZy5ib3VuZHNQYWRkaW5nID0gQHdpZHRoKjEuMlxuXG5cdFx0QHMgPSBuZXcgUElYSS5TcHJpdGUgQGcuZ2VuZXJhdGVUZXh0dXJlKClcblxuXHRcdCMgQGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5CbHVyRmlsdGVyXG5cdFx0IyBAYmx1ckZpbHRlci5ibHVyID0gQGJsdXJWYWx1ZVxuXG5cdFx0IyBAcy5maWx0ZXJzICAgPSBbQGJsdXJGaWx0ZXJdXG5cdFx0QHMuYmxlbmRNb2RlID0gd2luZG93LmJsZW5kIG9yIFBJWEkuYmxlbmRNb2Rlcy5BRERcblx0XHRAcy5hbHBoYSAgICAgPSBAYWxwaGFWYWx1ZVxuXG5cdFx0QHMuYW5jaG9yLnggPSBAcy5hbmNob3IueSA9IDAuNVxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRfZHJhd1RyaWFuZ2xlIDogPT5cblxuXHRcdEBnLm1vdmVUbyAwLCAwXG5cdFx0QGcubGluZVRvIC1Ad2lkdGgvMiwgQHdpZHRoXG5cdFx0QGcubGluZVRvIEB3aWR0aC8yLCBAd2lkdGhcblxuXHRcdG51bGxcblxuXHRfZHJhd0NpcmNsZSA6ID0+XG5cblx0XHRAZy5kcmF3Q2lyY2xlIDAsIDAsIEB3aWR0aC8yXG5cblx0XHRudWxsXG5cblx0X2RyYXdTcXVhcmUgOiA9PlxuXG5cdFx0QGcuZHJhd1JlY3QgMCwgMCwgQHdpZHRoLCBAd2lkdGhcblxuXHRcdG51bGxcblxuXHRfZ2V0V2lkdGggOiA9PlxuXG5cdFx0TnVtYmVyVXRpbHMuZ2V0UmFuZG9tRmxvYXQgSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX1dJRFRILCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfV0lEVEhcblxuXHRfZ2V0U3BlZWRNb3ZlIDogPT5cblxuXHRcdE51bWJlclV0aWxzLmdldFJhbmRvbUZsb2F0IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9TUEVFRF9NT1ZFLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfU1BFRURfTU9WRVxuXG5cdF9nZXRTcGVlZFJvdGF0ZSA6ID0+XG5cblx0XHROdW1iZXJVdGlscy5nZXRSYW5kb21GbG9hdCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fU1BFRURfUk9UQVRFLCBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfU1BFRURfUk9UQVRFXG5cblx0X2dldEJsdXJWYWx1ZSA6ID0+XG5cblx0XHRyYW5nZSA9IEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1BWF9CTFVSIC0gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUlOX0JMVVJcblx0XHRibHVyICA9ICgoQHdpZHRoIC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIKSAqIHJhbmdlKSArIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9CTFVSXG5cblx0XHRibHVyXG5cblx0X2dldEFscGhhVmFsdWUgOiA9PlxuXG5cdFx0cmFuZ2UgPSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NQVhfQUxQSEEgLSBJbnRlcmFjdGl2ZUJnQ29uZmlnLnNoYXBlcy5NSU5fQUxQSEFcblx0XHRhbHBoYSA9ICgoQHdpZHRoIC8gSW50ZXJhY3RpdmVCZ0NvbmZpZy5zaGFwZXMuTUFYX1dJRFRIKSAqIHJhbmdlKSArIEludGVyYWN0aXZlQmdDb25maWcuc2hhcGVzLk1JTl9BTFBIQVxuXG5cdFx0YWxwaGFcblxuXHRjYWxsQW5pbWF0ZSA6ID0+XG5cblx0XHRyZXR1cm4gdW5sZXNzICFAZGVhZFxuXG5cdFx0IyBAcy5ibGVuZE1vZGUgPSBpZiBJbnRlcmFjdGl2ZUJnQ29uZmlnLmZpbHRlcnMuUkdCIHRoZW4gUElYSS5ibGVuZE1vZGVzLk5PUk1BTCBlbHNlIFBJWEkuYmxlbmRNb2Rlcy5BRERcblx0XHRAcy5hbHBoYSA9IEBhbHBoYVZhbHVlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfQUxQSEFcblxuXHRcdEBzLnBvc2l0aW9uLnggLT0gQHNwZWVkTW92ZSpJbnRlcmFjdGl2ZUJnQ29uZmlnLmdlbmVyYWwuR0xPQkFMX1NQRUVEXG5cdFx0QHMucG9zaXRpb24ueSArPSBAc3BlZWRNb3ZlKkludGVyYWN0aXZlQmdDb25maWcuZ2VuZXJhbC5HTE9CQUxfU1BFRURcblx0XHRAcy5yb3RhdGlvbiArPSBAc3BlZWRSb3RhdGUqSW50ZXJhY3RpdmVCZ0NvbmZpZy5nZW5lcmFsLkdMT0JBTF9TUEVFRFxuXG5cdFx0IyBpZiAoQHMucG9zaXRpb24ueCArIChAd2lkdGgvMikgPCAwKSB0aGVuIEBzLnBvc2l0aW9uLnggKz0gQE5DKCkuYXBwVmlldy5kaW1zLndcblx0XHQjIGlmIChAcy5wb3NpdGlvbi55IC0gKEB3aWR0aC8yKSA+IEBOQygpLmFwcFZpZXcuZGltcy5oKSB0aGVuIEBzLnBvc2l0aW9uLnkgLT0gQE5DKCkuYXBwVmlldy5kaW1zLmhcblxuXHRcdGlmIChAcy5wb3NpdGlvbi54ICsgKEB3aWR0aC8yKSA8IDApIG9yIChAcy5wb3NpdGlvbi55IC0gKEB3aWR0aC8yKSA+IEBOQygpLmFwcFZpZXcuZGltcy5oKSB0aGVuIEBraWxsKClcblxuXHRcdG51bGxcblxuXHRraWxsIDogPT5cblxuXHRcdEBkZWFkID0gdHJ1ZVxuXG5cdFx0QGludGVyYWN0aXZlQmcudHJpZ2dlciBAaW50ZXJhY3RpdmVCZy5FVkVOVF9LSUxMX1NIQVBFLCBAXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0U2hhcGVcbiJdfQ==
