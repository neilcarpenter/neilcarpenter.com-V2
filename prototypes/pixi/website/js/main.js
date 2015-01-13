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
var AbstractView, AppView, InteractiveBackground, MediaQueries,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./view/AbstractView');

MediaQueries = require('./utils/MediaQueries');

InteractiveBackground = require('./view/background/InteractiveBackground');

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
    this.interactiveBg = new InteractiveBackground;
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



},{"./utils/MediaQueries":6,"./view/AbstractView":7,"./view/background/InteractiveBackground":8}],5:[function(require,module,exports){
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



},{}],8:[function(require,module,exports){
var AbstractShape, AbstractView, InteractiveBackground,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

AbstractShape = require('./shapes/AbstractShape');

InteractiveBackground = (function(_super) {
  __extends(InteractiveBackground, _super);

  InteractiveBackground.prototype.template = 'interactive-background';

  InteractiveBackground.prototype.stage = null;

  InteractiveBackground.prototype.renderer = null;

  InteractiveBackground.prototype.w = 0;

  InteractiveBackground.prototype.h = 0;

  function InteractiveBackground() {
    this.setDims = __bind(this.setDims, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.render = __bind(this.render, this);
    this.updateShapes = __bind(this.updateShapes, this);
    this.update = __bind(this.update, this);
    this.addShapes = __bind(this.addShapes, this);
    this.show = __bind(this.show, this);
    this.draw = __bind(this.draw, this);
    this.init = __bind(this.init, this);
    this.gui = new dat.GUI;
    InteractiveBackground.__super__.constructor.apply(this, arguments);
    return null;
  }

  InteractiveBackground.prototype.init = function() {
    PIXI.dontSayHello = true;
    this.w = this.NC().appView.dims.w;
    this.h = this.NC().appView.dims.h;
    this.stage = new PIXI.Stage(0x1A1A1A);
    this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {
      antialias: true
    });
    this.$el.append(this.renderer.view);
    this.draw();
    return null;
  };

  InteractiveBackground.prototype.draw = function() {
    this.bindEvents();
    this.setDims();
    return null;
  };

  InteractiveBackground.prototype.show = function() {
    this.addShapes();
    this.update();
    return null;
  };

  InteractiveBackground.prototype.addShapes = function() {
    var i, shape, _i, _ref;
    this.shapeCount = 1;
    this.shapes = [];
    for (i = _i = 0, _ref = this.shapeCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      shape = new AbstractShape;
      shape.g.position.x = Math.random() * this.w;
      shape.g.position.y = Math.random() * this.h;
      this.stage.addChild(shape.g);
      this.shapes.push(shape);
    }
    return null;
  };

  InteractiveBackground.prototype.update = function() {
    this.updateShapes();
    this.render();
    requestAnimFrame(this.update);
    return null;
  };

  InteractiveBackground.prototype.updateShapes = function() {
    var shape, _i, _len, _ref;
    _ref = this.shapes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      shape = _ref[_i];
      shape.callAnimate();
    }
    return null;
  };

  InteractiveBackground.prototype.render = function() {
    this.renderer.render(this.stage);
    return null;
  };

  InteractiveBackground.prototype.bindEvents = function() {
    this.NC().appView.on(this.NC().appView.EVENT_UPDATE_DIMENSIONS, this.setDims);
    return null;
  };

  InteractiveBackground.prototype.setDims = function() {
    this.w = this.NC().appView.dims.w;
    this.h = this.NC().appView.dims.h;
    this.renderer.resize(this.w, this.h);
    return null;
  };

  return InteractiveBackground;

})(AbstractView);

module.exports = InteractiveBackground;



},{"../AbstractView":7,"./shapes/AbstractShape":9}],9:[function(require,module,exports){
var AbstractShape,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AbstractShape = (function() {
  function AbstractShape() {
    this.callAnimate = __bind(this.callAnimate, this);
    var g;
    g = new PIXI.Graphics;
    g.beginFill('0x' + Math.floor(Math.random() * 16777215).toString(16));
    g.moveTo(0, 0);
    g.lineTo(-50, 100);
    g.lineTo(50, 100);
    g.endFill();
    this.g = new PIXI.Sprite(g.generateTexture());
    this.g.filters = [new PIXI.RGBSplitFilter];
    this.g.anchor.x = this.g.anchor.y = 0.5;
    return null;
  }

  AbstractShape.prototype.callAnimate = function() {
    return null;
  };

  return AbstractShape;

})();

module.exports = AbstractShape;



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvZGF0YS9BYnN0cmFjdERhdGEuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvQWJzdHJhY3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvYmFja2dyb3VuZC9JbnRlcmFjdGl2ZUJhY2tncm91bmQuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9iYWNrZ3JvdW5kL3NoYXBl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Q0FBVCxFQUFXLENBQVgsQ0FKQSxDQUFBO0FBQUEsSUFLQSxDQUFDLENBQUMsTUFBRixDQUFTLENBQUEsRUFBVCxFQUFjLEdBQWQsQ0FMQSxDQUFBO0FBQUEsSUFNQSxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxHQUFiLENBTkEsQ0FBQTtBQUFBLElBUUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQVJBLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxDQUFELEdBQVMsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FBWixDQVZULENBQUE7QUFBQSxJQVlBLElBQUMsQ0FBQSxDQUFDLENBQUMsT0FBSCxHQUFhLENBQUMsR0FBQSxDQUFBLElBQVEsQ0FBQyxjQUFWLENBWmIsQ0FBQTtBQUFBLElBY0EsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBVixHQUFjLElBQUMsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQVYsR0FBYyxHQWQ1QixDQUFBO0FBZ0JBLFdBQU8sSUFBUCxDQWxCYTtFQUFBLENBQWQ7O0FBQUEsMEJBb0JBLFdBQUEsR0FBYyxTQUFBLEdBQUE7V0FNYixLQU5hO0VBQUEsQ0FwQmQsQ0FBQTs7dUJBQUE7O0lBRkQsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsYUE5QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbiMgUFJPRFVDVElPTiBFTlZJUk9OTUVOVCAtIG1heSB3YW50IHRvIHVzZSBzZXJ2ZXItc2V0IHZhcmlhYmxlcyBoZXJlXG4jIElTX0xJVkUgPSBkbyAtPiByZXR1cm4gaWYgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignbG9jYWxob3N0JykgPiAtMSBvciB3aW5kb3cubG9jYXRpb24uc2VhcmNoIGlzICc/ZCcgdGhlbiBmYWxzZSBlbHNlIHRydWVcblxuIyMjXG5cbldJUCAtIHRoaXMgd2lsbCBpZGVhbGx5IGNoYW5nZSB0byBvbGQgZm9ybWF0IChhYm92ZSkgd2hlbiBjYW4gZmlndXJlIGl0IG91dFxuXG4jIyNcblxuSVNfTElWRSAgICA9IGZhbHNlXG5JU19QUkVWSUVXID0gL3ByZXZpZXc9dHJ1ZS8udGVzdCh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuXG4jIE9OTFkgRVhQT1NFIEFQUCBHTE9CQUxMWSBJRiBMT0NBTCBPUiBERVYnSU5HXG52aWV3ID0gaWYgSVNfTElWRSB0aGVuIHt9IGVsc2UgKHdpbmRvdyBvciBkb2N1bWVudClcblxuaWYgSVNfUFJFVklFV1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgSVNfUFJFVklFVydcbmVsc2Vcblx0IyBERUNMQVJFIE1BSU4gQVBQTElDQVRJT05cblx0dmlldy5OQyA9IG5ldyBBcHAgSVNfTElWRVxuXHR2aWV3Lk5DLmluaXQoKVxuIiwiQXBwRGF0YSAgICAgID0gcmVxdWlyZSAnLi9BcHBEYXRhJ1xuQXBwVmlldyAgICAgID0gcmVxdWlyZSAnLi9BcHBWaWV3J1xuTWVkaWFRdWVyaWVzID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5cbmNsYXNzIEFwcFxuXG4gICAgTElWRSAgICAgICAgICAgIDogbnVsbFxuICAgIEJBU0VfUEFUSCAgICAgICA6IHdpbmRvdy5jb25maWcuYmFzZV9wYXRoXG4gICAgQkFTRV9VUkwgICAgICAgIDogd2luZG93LmNvbmZpZy5iYXNlX3VybFxuICAgIEJBU0VfVVJMX0FTU0VUUyA6IHdpbmRvdy5jb25maWcuYmFzZV91cmxfYXNzZXRzXG4gICAgb2JqUmVhZHkgICAgICAgIDogMFxuXG4gICAgX3RvQ2xlYW4gICA6IFsnb2JqUmVhZHknLCAnc2V0RmxhZ3MnLCAnb2JqZWN0Q29tcGxldGUnLCAnaW5pdCcsICdpbml0T2JqZWN0cycsICdpbml0U0RLcycsICdpbml0QXBwJywgJ2dvJywgJ2NsZWFudXAnLCAnX3RvQ2xlYW4nXVxuXG4gICAgY29uc3RydWN0b3IgOiAoQExJVkUpIC0+XG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIHNldEZsYWdzIDogPT5cblxuICAgICAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKClcblxuICAgICAgICBNZWRpYVF1ZXJpZXMuc2V0dXAoKTtcblxuICAgICAgICAjIEBJU19BTkRST0lEICAgID0gdWEuaW5kZXhPZignYW5kcm9pZCcpID4gLTFcbiAgICAgICAgIyBASVNfRklSRUZPWCAgICA9IHVhLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xXG4gICAgICAgICMgQElTX0NIUk9NRV9JT1MgPSBpZiB1YS5tYXRjaCgnY3Jpb3MnKSB0aGVuIHRydWUgZWxzZSBmYWxzZSAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzODA4MDUzXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb2JqZWN0Q29tcGxldGUgOiA9PlxuXG4gICAgICAgIEBvYmpSZWFkeSsrXG4gICAgICAgIEBpbml0QXBwKCkgaWYgQG9ialJlYWR5ID49IDFcblxuICAgICAgICBudWxsXG5cbiAgICBpbml0IDogPT5cblxuICAgICAgICAjIGN1cnJlbnRseSBubyBvYmplY3RzIHRvIGxvYWQgaGVyZSwgc28ganVzdCBzdGFydCBhcHBcbiAgICAgICAgIyBAaW5pdE9iamVjdHMoKVxuXG4gICAgICAgIEBpbml0QXBwKClcblxuICAgICAgICBudWxsXG5cbiAgICAjIGluaXRPYmplY3RzIDogPT5cblxuICAgICMgICAgIEB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVzIFwiI3tAQkFTRV9VUkxfQVNTRVRTfS9kYXRhL3RlbXBsYXRlcyN7KGlmIEBMSVZFIHRoZW4gJy5taW4nIGVsc2UgJycpfS54bWxcIiwgQG9iamVjdENvbXBsZXRlXG5cbiAgICAjICAgICAjIGlmIG5ldyBvYmplY3RzIGFyZSBhZGRlZCBkb24ndCBmb3JnZXQgdG8gY2hhbmdlIHRoZSBgQG9iamVjdENvbXBsZXRlYCBmdW5jdGlvblxuXG4gICAgIyAgICAgbnVsbFxuXG4gICAgaW5pdEFwcCA6ID0+XG5cbiAgICAgICAgQHNldEZsYWdzKClcblxuICAgICAgICAjIyMgU3RhcnRzIGFwcGxpY2F0aW9uICMjI1xuICAgICAgICBAYXBwRGF0YSA9IG5ldyBBcHBEYXRhXG4gICAgICAgIEBhcHBWaWV3ID0gbmV3IEFwcFZpZXdcblxuICAgICAgICBAZ28oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGdvIDogPT5cblxuICAgICAgICAjIyMgQWZ0ZXIgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGtpY2tzIG9mZiB3ZWJzaXRlICMjI1xuICAgICAgICBAYXBwVmlldy5yZW5kZXIoKVxuXG4gICAgICAgICMjIyByZW1vdmUgcmVkdW5kYW50IGluaXRpYWxpc2F0aW9uIG1ldGhvZHMgLyBwcm9wZXJ0aWVzICMjI1xuICAgICAgICBAY2xlYW51cCgpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgY2xlYW51cCA6ID0+XG5cbiAgICAgICAgZm9yIGZuIGluIEBfdG9DbGVhblxuICAgICAgICAgICAgQFtmbl0gPSBudWxsXG4gICAgICAgICAgICBkZWxldGUgQFtmbl1cblxuICAgICAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwXG4iLCJBYnN0cmFjdERhdGEgPSByZXF1aXJlICcuL2RhdGEvQWJzdHJhY3REYXRhJ1xuXG5jbGFzcyBBcHBEYXRhIGV4dGVuZHMgQWJzdHJhY3REYXRhXG5cbiAgICBjb25zdHJ1Y3RvciA6IC0+XG5cbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwRGF0YVxuIiwiQWJzdHJhY3RWaWV3ICAgICAgICAgID0gcmVxdWlyZSAnLi92aWV3L0Fic3RyYWN0Vmlldydcbk1lZGlhUXVlcmllcyAgICAgICAgICA9IHJlcXVpcmUgJy4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuSW50ZXJhY3RpdmVCYWNrZ3JvdW5kID0gcmVxdWlyZSAnLi92aWV3L2JhY2tncm91bmQvSW50ZXJhY3RpdmVCYWNrZ3JvdW5kJ1xuXG5jbGFzcyBBcHBWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cbiAgICB0ZW1wbGF0ZSA6ICdtYWluJ1xuXG4gICAgJHdpbmRvdyAgOiBudWxsXG4gICAgJGJvZHkgICAgOiBudWxsXG5cbiAgICB3cmFwcGVyICA6IG51bGxcblxuICAgIGRpbXMgOlxuICAgICAgICB3IDogbnVsbFxuICAgICAgICBoIDogbnVsbFxuICAgICAgICBvIDogbnVsbFxuICAgICAgICBjIDogbnVsbFxuICAgICAgICByIDogbnVsbFxuXG4gICAgcndkU2l6ZXMgOlxuICAgICAgICBMQVJHRSAgOiAnTFJHJ1xuICAgICAgICBNRURJVU0gOiAnTUVEJ1xuICAgICAgICBTTUFMTCAgOiAnU01MJ1xuXG4gICAgbGFzdFNjcm9sbFkgOiAwXG4gICAgdGlja2luZyAgICAgOiBmYWxzZVxuXG4gICAgRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMgOiAnRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMnXG4gICAgRVZFTlRfT05fU0NST0xMICAgICAgICAgOiAnRVZFTlRfT05fU0NST0xMJ1xuXG4gICAgTU9CSUxFX1dJRFRIIDogNzAwXG4gICAgTU9CSUxFICAgICAgIDogJ21vYmlsZSdcbiAgICBOT05fTU9CSUxFICAgOiAnbm9uX21vYmlsZSdcblxuICAgIGNvbnN0cnVjdG9yIDogLT5cblxuICAgICAgICBAJHdpbmRvdyA9ICQod2luZG93KVxuICAgICAgICBAJGJvZHkgICA9ICQoJ2JvZHknKS5lcSgwKVxuXG4gICAgICAgICMgdGhlc2UsIHJhdGhlciB0aGFuIGNhbGxpbmcgc3VwZXJcbiAgICAgICAgQHNldEVsZW1lbnQgQCRib2R5LmZpbmQoXCJbZGF0YS10ZW1wbGF0ZT1cXFwiI3tAdGVtcGxhdGV9XFxcIl1cIilcbiAgICAgICAgQGNoaWxkcmVuID0gW11cblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgZGlzYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9uICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIGVuYWJsZVRvdWNoOiA9PlxuXG4gICAgICAgIEAkd2luZG93Lm9mZiAndG91Y2htb3ZlJywgQG9uVG91Y2hNb3ZlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblRvdWNoTW92ZTogKCBlICkgLT5cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlbmRlciA6ID0+XG5cbiAgICAgICAgQGJpbmRFdmVudHMoKVxuXG4gICAgICAgIEBpbnRlcmFjdGl2ZUJnID0gbmV3IEludGVyYWN0aXZlQmFja2dyb3VuZFxuXG4gICAgICAgIEBhZGRDaGlsZCBAaW50ZXJhY3RpdmVCZ1xuXG4gICAgICAgIEBvbkFsbFJlbmRlcmVkKClcblxuICAgICAgICByZXR1cm5cblxuICAgIGJpbmRFdmVudHMgOiA9PlxuXG4gICAgICAgIEBvbiAnYWxsUmVuZGVyZWQnLCBAb25BbGxSZW5kZXJlZFxuXG4gICAgICAgIEBvblJlc2l6ZSgpXG5cbiAgICAgICAgQG9uUmVzaXplID0gXy5kZWJvdW5jZSBAb25SZXNpemUsIDMwMFxuICAgICAgICBAJHdpbmRvdy5vbiAncmVzaXplIG9yaWVudGF0aW9uY2hhbmdlJywgQG9uUmVzaXplXG4gICAgICAgIEAkd2luZG93Lm9uIFwic2Nyb2xsXCIsIEBvblNjcm9sbFxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25TY3JvbGwgOiA9PlxuXG4gICAgICAgIEBsYXN0U2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZXG4gICAgICAgIEByZXF1ZXN0VGljaygpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgcmVxdWVzdFRpY2sgOiA9PlxuXG4gICAgICAgIGlmICFAdGlja2luZ1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBzY3JvbGxVcGRhdGVcbiAgICAgICAgICAgIEB0aWNraW5nID0gdHJ1ZVxuXG4gICAgICAgIG51bGxcblxuICAgIHNjcm9sbFVwZGF0ZSA6ID0+XG5cbiAgICAgICAgQHRpY2tpbmcgPSBmYWxzZVxuXG4gICAgICAgIEAkYm9keS5hZGRDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0IEB0aW1lclNjcm9sbFxuXG4gICAgICAgIEB0aW1lclNjcm9sbCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEAkYm9keS5yZW1vdmVDbGFzcygnZGlzYWJsZS1ob3ZlcicpXG4gICAgICAgICwgNTBcblxuICAgICAgICBAdHJpZ2dlciBBcHBWaWV3LkVWRU5UX09OX1NDUk9MTFxuXG4gICAgICAgIG51bGxcblxuICAgIG9uQWxsUmVuZGVyZWQgOiA9PlxuXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJvbkFsbFJlbmRlcmVkIDogPT5cIlxuICAgICAgICBAYmVnaW4oKVxuXG4gICAgICAgIG51bGxcblxuICAgIGJlZ2luIDogPT5cblxuICAgICAgICBAdHJpZ2dlciAnc3RhcnQnXG5cbiAgICAgICAgQG9uU2Nyb2xsKClcbiAgICAgICAgQGludGVyYWN0aXZlQmcuc2hvdygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblJlc2l6ZSA6ID0+XG5cbiAgICAgICAgQGdldERpbXMoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0RGltcyA6ID0+XG5cbiAgICAgICAgdyA9IHdpbmRvdy5pbm5lcldpZHRoIG9yIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCBvciBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXG4gICAgICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgb3IgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCBvciBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxuXG4gICAgICAgIEBkaW1zID1cbiAgICAgICAgICAgIHcgOiB3XG4gICAgICAgICAgICBoIDogaFxuICAgICAgICAgICAgbyA6IGlmIGggPiB3IHRoZW4gJ3BvcnRyYWl0JyBlbHNlICdsYW5kc2NhcGUnXG4gICAgICAgICAgICBjIDogaWYgdyA8PSBATU9CSUxFX1dJRFRIIHRoZW4gQE1PQklMRSBlbHNlIEBOT05fTU9CSUxFXG4gICAgICAgICAgICByIDogQGdldFJ3ZFNpemUgdywgaCwgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIG9yIDEpXG5cbiAgICAgICAgQHRyaWdnZXIgQEVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAZGltc1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0UndkU2l6ZSA6ICh3LCBoLCBkcHIpID0+XG5cbiAgICAgICAgcHcgPSB3KmRwclxuXG4gICAgICAgIHNpemUgPSBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgICAgd2hlbiBwdyA+IDE0NDAgdGhlbiBAcndkU2l6ZXMuTEFSR0VcbiAgICAgICAgICAgIHdoZW4gcHcgPCA2NTAgdGhlbiBAcndkU2l6ZXMuU01BTExcbiAgICAgICAgICAgIGVsc2UgQHJ3ZFNpemVzLk1FRElVTVxuXG4gICAgICAgIHNpemVcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3XG4iLCJjbGFzcyBBYnN0cmFjdERhdGFcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdHJldHVybiBudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0RGF0YVxuIiwiIyAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIE1lZGlhIFF1ZXJpZXMgTWFuYWdlciBcbiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBcbiMgICBAYXV0aG9yIDogRsOhYmlvIEF6ZXZlZG8gPGZhYmlvLmF6ZXZlZG9AdW5pdDkuY29tPiBVTklUOVxuIyAgIEBkYXRlICAgOiBTZXB0ZW1iZXIgMTRcbiMgICBcbiMgICBJbnN0cnVjdGlvbnMgYXJlIG9uIC9wcm9qZWN0L3Nhc3MvdXRpbHMvX3Jlc3BvbnNpdmUuc2Nzcy5cblxuY2xhc3MgTWVkaWFRdWVyaWVzXG5cbiAgICAjIEJyZWFrcG9pbnRzXG4gICAgQFNNQUxMRVNUICAgIDogXCJzbWFsbGVzdFwiXG4gICAgQFNNQUxMICAgICAgIDogXCJzbWFsbFwiXG4gICAgQElQQUQgICAgICAgIDogXCJpcGFkXCJcbiAgICBATUVESVVNICAgICAgOiBcIm1lZGl1bVwiXG4gICAgQExBUkdFICAgICAgIDogXCJsYXJnZVwiXG4gICAgQEVYVFJBX0xBUkdFIDogXCJleHRyYS1sYXJnZVwiXG5cbiAgICBAc2V0dXAgOiA9PlxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTEVTVF9CUkVBS1BPSU5UID0ge25hbWU6IFwiU21hbGxlc3RcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuU01BTExFU1RdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIlNtYWxsXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNULCBNZWRpYVF1ZXJpZXMuU01BTExdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlQgICA9IHtuYW1lOiBcIk1lZGl1bVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5NRURJVU1dfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTEFSR0VfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIkxhcmdlXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLklQQUQsIE1lZGlhUXVlcmllcy5MQVJHRSwgTWVkaWFRdWVyaWVzLkVYVFJBX0xBUkdFXX1cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFMgPSBbXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5NRURJVU1fQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm5cblxuICAgIEBnZXREZXZpY2VTdGF0ZSA6ID0+XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIFwiYWZ0ZXJcIikuZ2V0UHJvcGVydHlWYWx1ZShcImNvbnRlbnRcIik7XG5cbiAgICBAZ2V0QnJlYWtwb2ludCA6ID0+XG5cbiAgICAgICAgc3RhdGUgPSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuXG4gICAgICAgIGZvciBpIGluIFswLi4uTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTLmxlbmd0aF1cbiAgICAgICAgICAgIGlmIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5icmVha3BvaW50cy5pbmRleE9mKHN0YXRlKSA+IC0xXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5uYW1lXG5cbiAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgIEBpc0JyZWFrcG9pbnQgOiAoYnJlYWtwb2ludCkgPT5cblxuICAgICAgICBmb3IgaSBpbiBbMC4uLmJyZWFrcG9pbnQuYnJlYWtwb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBicmVha3BvaW50LmJyZWFrcG9pbnRzW2ldID09IE1lZGlhUXVlcmllcy5nZXREZXZpY2VTdGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYVF1ZXJpZXNcbiIsImNsYXNzIEFic3RyYWN0VmlldyBleHRlbmRzIEJhY2tib25lLlZpZXdcblxuXHRlbCAgICAgICAgICAgOiBudWxsXG5cdGlkICAgICAgICAgICA6IG51bGxcblx0Y2hpbGRyZW4gICAgIDogbnVsbFxuXHR0ZW1wbGF0ZSAgICAgOiBudWxsXG5cdHRlbXBsYXRlVmFycyA6IG51bGxcblxuXHQjIGNveiBvbiBwYWdlIGxvYWQgd2UgYWxyZWFkeSBoYXZlIHRoZSBET00gZm9yIGEgcGFnZSwgaXQgd2lsbCBnZXQgaW5pdGlhbGlzZWQgdHdpY2UgLSBvbmNlIG9uIGNvbnN0cnVjdGlvbiwgYW5kIG9uY2Ugd2hlbiBwYWdlIGhhcyBcImxvYWRlZFwiXG5cdGluaXRpYWxpemVkIDogZmFsc2Vcblx0XG5cdGluaXRpYWxpemUgOiAoZm9yY2UpIC0+XG5cblx0XHRyZXR1cm4gdW5sZXNzICFAaW5pdGlhbGl6ZWQgb3IgZm9yY2Vcblx0XHRcblx0XHRAY2hpbGRyZW4gPSBbXVxuXG5cdFx0aWYgQHRlbXBsYXRlXG5cdFx0XHQkdG1wbCA9IEBOQygpLmFwcFZpZXcuJGVsLmZpbmQoXCJbZGF0YS10ZW1wbGF0ZT1cXFwiI3tAdGVtcGxhdGV9XFxcIl1cIilcblx0XHRcdEBzZXRFbGVtZW50ICR0bXBsXG5cdFx0XHRyZXR1cm4gdW5sZXNzICR0bXBsLmxlbmd0aFxuXG5cdFx0QCRlbC5hdHRyICdpZCcsIEBpZCBpZiBAaWRcblx0XHRAJGVsLmFkZENsYXNzIEBjbGFzc05hbWUgaWYgQGNsYXNzTmFtZVxuXHRcdFxuXHRcdEBpbml0aWFsaXplZCA9IHRydWVcblx0XHRAaW5pdCgpXG5cblx0XHRAcGF1c2VkID0gZmFsc2VcblxuXHRcdG51bGxcblxuXHRpbml0IDogPT5cblxuXHRcdG51bGxcblxuXHR1cGRhdGUgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdHJlbmRlciA6ID0+XG5cblx0XHRudWxsXG5cblx0YWRkQ2hpbGQgOiAoY2hpbGQsIHByZXBlbmQgPSBmYWxzZSkgPT5cblxuXHRcdEBjaGlsZHJlbi5wdXNoIGNoaWxkIGlmIGNoaWxkLmVsXG5cblx0XHRAXG5cblx0cmVwbGFjZSA6IChkb20sIGNoaWxkKSA9PlxuXG5cdFx0QGNoaWxkcmVuLnB1c2ggY2hpbGQgaWYgY2hpbGQuZWxcblx0XHRjID0gaWYgY2hpbGQuZWwgdGhlbiBjaGlsZC4kZWwgZWxzZSBjaGlsZFxuXHRcdEAkZWwuY2hpbGRyZW4oZG9tKS5yZXBsYWNlV2l0aChjKVxuXG5cdFx0bnVsbFxuXG5cdHJlbW92ZSA6IChjaGlsZCkgPT5cblxuXHRcdHVubGVzcyBjaGlsZD9cblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdGMgPSBpZiBjaGlsZC5lbCB0aGVuIGNoaWxkLiRlbCBlbHNlICQoY2hpbGQpXG5cdFx0Y2hpbGQuZGlzcG9zZSgpIGlmIGMgYW5kIGNoaWxkLmRpc3Bvc2VcblxuXHRcdGlmIGMgJiYgQGNoaWxkcmVuLmluZGV4T2YoY2hpbGQpICE9IC0xXG5cdFx0XHRAY2hpbGRyZW4uc3BsaWNlKCBAY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEgKVxuXG5cdFx0Yy5yZW1vdmUoKVxuXG5cdFx0bnVsbFxuXG5cdG9uUmVzaXplIDogKGV2ZW50KSA9PlxuXG5cdFx0KGlmIGNoaWxkLm9uUmVzaXplIHRoZW4gY2hpbGQub25SZXNpemUoKSkgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdG1vdXNlRW5hYmxlZCA6ICggZW5hYmxlZCApID0+XG5cblx0XHRAJGVsLmNzc1xuXHRcdFx0XCJwb2ludGVyLWV2ZW50c1wiOiBpZiBlbmFibGVkIHRoZW4gXCJhdXRvXCIgZWxzZSBcIm5vbmVcIlxuXG5cdFx0bnVsbFxuXG5cdENTU1RyYW5zbGF0ZSA6ICh4LCB5LCB2YWx1ZT0nJScsIHNjYWxlKSA9PlxuXG5cdFx0aWYgTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMzZFxuXHRcdFx0c3RyID0gXCJ0cmFuc2xhdGUzZCgje3grdmFsdWV9LCAje3krdmFsdWV9LCAwKVwiXG5cdFx0ZWxzZVxuXHRcdFx0c3RyID0gXCJ0cmFuc2xhdGUoI3t4K3ZhbHVlfSwgI3t5K3ZhbHVlfSlcIlxuXG5cdFx0aWYgc2NhbGUgdGhlbiBzdHIgPSBcIiN7c3RyfSBzY2FsZSgje3NjYWxlfSlcIlxuXG5cdFx0c3RyXG5cblx0dW5NdXRlQWxsIDogPT5cblxuXHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQudW5NdXRlPygpXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdGNoaWxkLnVuTXV0ZUFsbCgpXG5cblx0XHRudWxsXG5cblx0bXV0ZUFsbCA6ID0+XG5cblx0XHRmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkLm11dGU/KClcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0Y2hpbGQubXV0ZUFsbCgpXG5cblx0XHRudWxsXG5cblx0cmVtb3ZlQWxsQ2hpbGRyZW46ID0+XG5cblx0XHRAcmVtb3ZlIGNoaWxkIGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHR0cmlnZ2VyQ2hpbGRyZW4gOiAobXNnLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQudHJpZ2dlciBtc2dcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QHRyaWdnZXJDaGlsZHJlbiBtc2csIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0Y2FsbENoaWxkcmVuIDogKG1ldGhvZCwgcGFyYW1zLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRmb3IgY2hpbGQsIGkgaW4gY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGRbbWV0aG9kXT8gcGFyYW1zXG5cblx0XHRcdGlmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aFxuXG5cdFx0XHRcdEBjYWxsQ2hpbGRyZW4gbWV0aG9kLCBwYXJhbXMsIGNoaWxkLmNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0Y2FsbENoaWxkcmVuQW5kU2VsZiA6IChtZXRob2QsIHBhcmFtcywgY2hpbGRyZW49QGNoaWxkcmVuKSA9PlxuXG5cdFx0QFttZXRob2RdPyBwYXJhbXNcblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZFttZXRob2RdPyBwYXJhbXNcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QGNhbGxDaGlsZHJlbiBtZXRob2QsIHBhcmFtcywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRzdXBwbGFudFN0cmluZyA6IChzdHIsIHZhbHMpIC0+XG5cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UgL3t7IChbXnt9XSopIH19L2csIChhLCBiKSAtPlxuXHRcdFx0ciA9IHZhbHNbYl1cblx0XHRcdChpZiB0eXBlb2YgciBpcyBcInN0cmluZ1wiIG9yIHR5cGVvZiByIGlzIFwibnVtYmVyXCIgdGhlbiByIGVsc2UgYSlcblxuXHRkaXNwb3NlIDogPT5cblxuXHRcdEBzdG9wTGlzdGVuaW5nKClcblxuXHRcdG51bGxcblxuXHROQyA6ID0+XG5cblx0XHRyZXR1cm4gd2luZG93Lk5DXG5cbm1vZHVsZS5leHBvcnRzID0gQWJzdHJhY3RWaWV3XG4iLCJBYnN0cmFjdFZpZXcgID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuQWJzdHJhY3RTaGFwZSA9IHJlcXVpcmUgJy4vc2hhcGVzL0Fic3RyYWN0U2hhcGUnXG5cbmNsYXNzIEludGVyYWN0aXZlQmFja2dyb3VuZCBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG5cdHRlbXBsYXRlIDogJ2ludGVyYWN0aXZlLWJhY2tncm91bmQnXG5cdHN0YWdlICAgIDogbnVsbFxuXHRyZW5kZXJlciA6IG51bGxcblx0XG5cdHcgOiAwXG5cdGggOiAwXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0QGd1aSA9IG5ldyBkYXQuR1VJXG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRpbml0OiA9PlxuXG5cdFx0UElYSS5kb250U2F5SGVsbG8gPSB0cnVlXG5cblx0XHRAdyA9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0QGggPSBATkMoKS5hcHBWaWV3LmRpbXMuaFxuXG5cdFx0QHN0YWdlICAgID0gbmV3IFBJWEkuU3RhZ2UgMHgxQTFBMUFcblx0XHRAcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlciBAdywgQGgsIGFudGlhbGlhcyA6IHRydWVcblxuXHRcdEAkZWwuYXBwZW5kIEByZW5kZXJlci52aWV3XG5cblx0XHRAZHJhdygpXG5cblx0XHRudWxsXG5cblx0ZHJhdyA6ID0+XG5cblx0XHRAYmluZEV2ZW50cygpXG5cdFx0QHNldERpbXMoKVxuXG5cdFx0bnVsbFxuXG5cdHNob3cgOiA9PlxuXG5cdFx0QGFkZFNoYXBlcygpXG5cdFx0QHVwZGF0ZSgpXG5cblx0XHRudWxsXG5cblx0YWRkU2hhcGVzIDogPT5cblxuXHRcdEBzaGFwZUNvdW50ID0gMVxuXG5cdFx0QHNoYXBlcyA9IFtdXG5cblx0XHRmb3IgaSBpbiBbMC4uLkBzaGFwZUNvdW50XVxuXG5cdFx0XHRzaGFwZSA9IG5ldyBBYnN0cmFjdFNoYXBlXG5cdFx0XHRzaGFwZS5nLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpKkB3XG5cdFx0XHRzaGFwZS5nLnBvc2l0aW9uLnkgPSBNYXRoLnJhbmRvbSgpKkBoXG5cblx0XHRcdEBzdGFnZS5hZGRDaGlsZCBzaGFwZS5nXG5cblx0XHRcdEBzaGFwZXMucHVzaCBzaGFwZVxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZSA6ID0+XG5cblx0XHRAdXBkYXRlU2hhcGVzKClcblx0XHRAcmVuZGVyKClcblxuXHRcdHJlcXVlc3RBbmltRnJhbWUgQHVwZGF0ZVxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZVNoYXBlcyA6ID0+XG5cblx0XHQoc2hhcGUuY2FsbEFuaW1hdGUoKSkgZm9yIHNoYXBlIGluIEBzaGFwZXNcblxuXHRcdG51bGxcblxuXHRyZW5kZXIgOiA9PlxuXG5cdFx0QHJlbmRlcmVyLnJlbmRlciBAc3RhZ2UgXG5cblx0XHRudWxsXG5cblx0YmluZEV2ZW50cyA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uIEBOQygpLmFwcFZpZXcuRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBzZXREaW1zXG5cblx0XHRudWxsXG5cblx0c2V0RGltcyA6ID0+XG5cblx0XHRAdyA9IEBOQygpLmFwcFZpZXcuZGltcy53XG5cdFx0QGggPSBATkMoKS5hcHBWaWV3LmRpbXMuaFxuXG5cdFx0QHJlbmRlcmVyLnJlc2l6ZSBAdywgQGhcblxuXHRcdG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGl2ZUJhY2tncm91bmRcbiIsImNsYXNzIEFic3RyYWN0U2hhcGVcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRnID0gbmV3IFBJWEkuR3JhcGhpY3NcblxuXHRcdGcuYmVnaW5GaWxsICcweCcrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE2Nzc3MjE1KS50b1N0cmluZygxNilcblxuXHRcdGcubW92ZVRvKDAsMClcblx0XHRnLmxpbmVUbygtNTAsIDEwMClcblx0XHRnLmxpbmVUbyg1MCwgMTAwKVxuXG5cdFx0Zy5lbmRGaWxsKClcblxuXHRcdEBnID0gbmV3IFBJWEkuU3ByaXRlIGcuZ2VuZXJhdGVUZXh0dXJlKClcblxuXHRcdEBnLmZpbHRlcnMgPSBbbmV3IFBJWEkuUkdCU3BsaXRGaWx0ZXJdXG5cblx0XHRAZy5hbmNob3IueCA9IEBnLmFuY2hvci55ID0gMC41XG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdGNhbGxBbmltYXRlIDogPT5cblxuXHRcdCMgQGcucG9zaXRpb24ueCArPSAwLjFcblx0XHQjIEBnLnBvc2l0aW9uLnkgKz0gMC4xXG5cdFx0IyBAZy5yb3RhdGlvbiArPSAxXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gQWJzdHJhY3RTaGFwZVxuIl19
