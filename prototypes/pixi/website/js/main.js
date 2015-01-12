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
var App, AppData, AppView, MediaQueries, Nav, Router, Templates,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Templates = require('./data/Templates');

Router = require('./router/Router');

Nav = require('./router/Nav');

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
    this.router = new Router;
    this.nav = new Nav;
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



},{"./AppData":3,"./AppView":4,"./data/Templates":11,"./router/Nav":17,"./router/Router":18,"./utils/MediaQueries":20}],3:[function(require,module,exports){
var API, AbstractData, AppData, Requester,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('./data/AbstractData');

Requester = require('./utils/Requester');

API = require('./data/API');

AppData = (function(_super) {
  __extends(AppData, _super);

  function AppData() {
    AppData.__super__.constructor.call(this);
    return null;
  }

  return AppData;

})(AbstractData);

module.exports = AppData;



},{"./data/API":9,"./data/AbstractData":10,"./utils/Requester":21}],4:[function(require,module,exports){
var AbstractView, AppView, Header, LazyImageLoader, MediaQueries, ModalManager, Preloader, ScrollItemInView, Scroller, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./view/AbstractView');

Preloader = require('./view/base/Preloader');

Header = require('./view/base/Header');

Wrapper = require('./view/base/Wrapper');

ModalManager = require('./view/modals/_ModalManager');

MediaQueries = require('./utils/MediaQueries');

Scroller = require('./utils/Scroller');

ScrollItemInView = require('./utils/ScrollItemInView');

LazyImageLoader = require('./utils/LazyImageLoader');

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
    this.trackPageView = __bind(this.trackPageView, this);
    this.handleExternalLink = __bind(this.handleExternalLink, this);
    this.navigateToUrl = __bind(this.navigateToUrl, this);
    this.linkManager = __bind(this.linkManager, this);
    this.getRwdSize = __bind(this.getRwdSize, this);
    this.getDims = __bind(this.getDims, this);
    this.updateMediaQueriesLog = __bind(this.updateMediaQueriesLog, this);
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
    this.preloader = new Preloader('site', this.$body.find('#preloader'));
    this.modalManager = new ModalManager;
    this.scrollItemInView = new ScrollItemInView;
    this.lazyImageLoader = new LazyImageLoader;
    this.header = new Header;
    this.wrapper = new Wrapper;
    this.addChild(this.header).addChild(this.wrapper);
    this.onAllRendered();
  };

  AppView.prototype.bindEvents = function() {
    this.on('allRendered', this.onAllRendered);
    this.onResize();
    this.onResize = _.debounce(this.onResize, 300);
    this.$window.on('resize orientationchange', this.onResize);
    this.$window.on("scroll", this.onScroll);
    this.$body.on('click', 'a', this.linkManager);
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
    this.NC().router.start();
    this.updateMediaQueriesLog();
    this.preloader.firstHide((function(_this) {
      return function() {
        _this.header.animateIn();
        _this.lazyImageLoader.onViewUpdated();
        _this.scrollItemInView.getItems();
        return _this.onScroll();
      };
    })(this));
  };

  AppView.prototype.onResize = function() {
    this.getDims();
    this.updateMediaQueriesLog();
  };

  AppView.prototype.updateMediaQueriesLog = function() {
    if (this.header) {
      this.header.$el.find(".breakpoint").html("<div class='l'>CURRENT BREAKPOINT:</div><div class='b'>" + (MediaQueries.getBreakpoint()) + "</div>");
    }
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

  AppView.prototype.linkManager = function(e) {
    var href;
    href = $(e.currentTarget).attr('href');
    if (href) {
      this.navigateToUrl(href, e);
    }
    return null;
  };

  AppView.prototype.navigateToUrl = function(href, e) {
    var route, section;
    if (e == null) {
      e = null;
    }
    route = href.match(this.NC().BASE_URL) ? href.split(this.NC().BASE_URL)[1] : href;
    section = route.indexOf('/') === 0 ? route.split('/')[1] : route;
    console.log("route, section");
    console.log(route, section);
    if (this.NC().nav.getSection(section)) {
      if (e != null) {
        e.preventDefault();
      }
      this.NC().router.navigateTo(route);
    } else {
      this.handleExternalLink(href);
    }
  };

  AppView.prototype.handleExternalLink = function(data) {

    /*
    
    bind tracking events if necessary
     */
  };

  AppView.prototype.trackPageView = function() {
    if (!window.ga) {
      return;
    }
    ga('send', 'pageview', {
      'page': window.location.href.split(this.NC().BASE_URL)[1] || '/'
    });
    return null;
  };

  return AppView;

})(AbstractView);

module.exports = AppView;



},{"./utils/LazyImageLoader":19,"./utils/MediaQueries":20,"./utils/ScrollItemInView":22,"./utils/Scroller":23,"./view/AbstractView":25,"./view/base/Header":27,"./view/base/Preloader":28,"./view/base/Wrapper":29,"./view/modals/_ModalManager":32}],5:[function(require,module,exports){
var AbstractCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = (function(_super) {
  __extends(AbstractCollection, _super);

  function AbstractCollection() {
    this.NC = __bind(this.NC, this);
    return AbstractCollection.__super__.constructor.apply(this, arguments);
  }

  AbstractCollection.prototype.NC = function() {
    return window.NC;
  };

  return AbstractCollection;

})(Backbone.Collection);

module.exports = AbstractCollection;



},{}],6:[function(require,module,exports){
var TemplateModel, TemplatesCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateModel = require('../../models/core/TemplateModel');

TemplatesCollection = (function(_super) {
  __extends(TemplatesCollection, _super);

  function TemplatesCollection() {
    return TemplatesCollection.__super__.constructor.apply(this, arguments);
  }

  TemplatesCollection.prototype.model = TemplateModel;

  return TemplatesCollection;

})(Backbone.Collection);

module.exports = TemplatesCollection;



},{"../../models/core/TemplateModel":14}],7:[function(require,module,exports){
var AbstractCollection, LazyImageCollection, LazyImageModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = require('../AbstractCollection');

LazyImageModel = require('../../models/images/LazyImageModel');

LazyImageCollection = (function(_super) {
  __extends(LazyImageCollection, _super);

  function LazyImageCollection() {
    this.addImage = __bind(this.addImage, this);
    return LazyImageCollection.__super__.constructor.apply(this, arguments);
  }

  LazyImageCollection.prototype.model = LazyImageModel;

  LazyImageCollection.prototype.addImage = function(imgToAdd) {
    var existingRef;
    existingRef = this.findWhere({
      src: imgToAdd.src
    });
    if (existingRef) {
      existingRef.addEl(imgToAdd.$el);
    } else {
      this.add({
        src: imgToAdd.src,
        $els: [imgToAdd.$el]
      });
    }
    return null;
  };

  return LazyImageCollection;

})(AbstractCollection);

module.exports = LazyImageCollection;



},{"../../models/images/LazyImageModel":15,"../AbstractCollection":5}],8:[function(require,module,exports){
var AbstractCollection, HomeTaglineModel, HomeTaglinesCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = require('../AbstractCollection');

HomeTaglineModel = require('../../models/taglines/HomeTaglineModel');

HomeTaglinesCollection = (function(_super) {
  __extends(HomeTaglinesCollection, _super);

  function HomeTaglinesCollection() {
    this.getNext = __bind(this.getNext, this);
    return HomeTaglinesCollection.__super__.constructor.apply(this, arguments);
  }

  HomeTaglinesCollection.prototype.model = HomeTaglineModel;

  HomeTaglinesCollection.prototype.current = 0;

  HomeTaglinesCollection.prototype.getNext = function() {
    if (this.current === this.length - 1) {
      this.current = 0;
      return this.getNext();
    }
    this.current++;
    return this.at(this.current);
  };

  return HomeTaglinesCollection;

})(AbstractCollection);

module.exports = HomeTaglinesCollection;



},{"../../models/taglines/HomeTaglineModel":16,"../AbstractCollection":5}],9:[function(require,module,exports){
var API, APIRouteModel;

APIRouteModel = require('../models/core/APIRouteModel');

API = (function() {
  function API() {}

  API.model = new APIRouteModel;

  API.getContants = function() {
    return {

      /* add more if we wanna use in API strings */
      BASE_URL: API.R().BASE_URL
    };
  };

  API.get = function(name, vars) {
    vars = $.extend(true, vars, API.getContants());
    return API.supplantString(API.model.get(name), vars);
  };

  API.supplantString = function(str, vals) {
    return str.replace(/{{ ([^{}]*) }}/g, function(a, b) {
      var r;
      return r = vals[b] || (typeof vals[b] === 'number' ? vals[b].toString() : '');
    });
    if (typeof r === "string" || typeof r === "number") {
      return r;
    } else {
      return a;
    }
  };

  API.NC = function() {
    return window.NC;
  };

  return API;

})();

module.exports = API;



},{"../models/core/APIRouteModel":13}],10:[function(require,module,exports){
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



},{}],11:[function(require,module,exports){
var TemplateModel, Templates, TemplatesCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TemplateModel = require('../models/core/TemplateModel');

TemplatesCollection = require('../collections/core/TemplatesCollection');

Templates = (function() {
  Templates.prototype.templates = null;

  Templates.prototype.cb = null;

  function Templates(templates, callback) {
    this.get = __bind(this.get, this);
    this.parseXML = __bind(this.parseXML, this);
    this.cb = callback;
    $.ajax({
      url: templates,
      success: this.parseXML
    });
    null;
  }

  Templates.prototype.parseXML = function(data) {
    var temp;
    temp = [];
    $(data).find('template').each(function(key, value) {
      var $value;
      $value = $(value);
      return temp.push(new TemplateModel({
        id: $value.attr('id').toString(),
        text: $.trim($value.text())
      }));
    });
    this.templates = new TemplatesCollection(temp);
    if (typeof this.cb === "function") {
      this.cb();
    }
    return null;
  };

  Templates.prototype.get = function(id) {
    var t;
    t = this.templates.where({
      id: id
    });
    t = t[0].get('text');
    return $.trim(t);
  };

  return Templates;

})();

module.exports = Templates;



},{"../collections/core/TemplatesCollection":6,"../models/core/TemplateModel":14}],12:[function(require,module,exports){
var AbstractModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = (function(_super) {
  __extends(AbstractModel, _super);

  function AbstractModel(attrs, option) {
    this.NC = __bind(this.NC, this);
    this._filterAttrs = __bind(this._filterAttrs, this);
    attrs = this._filterAttrs(attrs);
    return Backbone.DeepModel.apply(this, arguments);
  }

  AbstractModel.prototype.set = function(attrs, options) {
    options || (options = {});
    attrs = this._filterAttrs(attrs);
    options.data = JSON.stringify(attrs);
    return Backbone.DeepModel.prototype.set.call(this, attrs, options);
  };

  AbstractModel.prototype._filterAttrs = function(attrs) {
    return attrs;
  };

  AbstractModel.prototype.NC = function() {
    return window.NC;
  };

  return AbstractModel;

})(Backbone.DeepModel);

module.exports = AbstractModel;



},{}],13:[function(require,module,exports){
var APIRouteModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

APIRouteModel = (function(_super) {
  __extends(APIRouteModel, _super);

  function APIRouteModel() {
    return APIRouteModel.__super__.constructor.apply(this, arguments);
  }

  APIRouteModel.prototype.defaults = {
    start: "",
    locale: "",
    user: {
      login: "{{ BASE_URL }}/api/user/login",
      register: "{{ BASE_URL }}/api/user/register",
      password: "{{ BASE_URL }}/api/user/password",
      update: "{{ BASE_URL }}/api/user/update",
      logout: "{{ BASE_URL }}/api/user/logout",
      remove: "{{ BASE_URL }}/api/user/remove"
    }
  };

  return APIRouteModel;

})(Backbone.DeepModel);

module.exports = APIRouteModel;



},{}],14:[function(require,module,exports){
var TemplateModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateModel = (function(_super) {
  __extends(TemplateModel, _super);

  function TemplateModel() {
    return TemplateModel.__super__.constructor.apply(this, arguments);
  }

  TemplateModel.prototype.defaults = {
    id: "",
    text: ""
  };

  return TemplateModel;

})(Backbone.Model);

module.exports = TemplateModel;



},{}],15:[function(require,module,exports){
var AbstractModel, LazyImageModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

LazyImageModel = (function(_super) {
  __extends(LazyImageModel, _super);

  LazyImageModel.states = {
    LOADED: 'LOADED',
    PROGRESS: 'PROGRESS'
  };

  LazyImageModel.prototype.classNames = {
    LOADED: 'loaded',
    BG_IMAGE: 'bg-image'
  };

  LazyImageModel.prototype.defaults = {
    src: "",
    $els: [],
    state: "",
    progress: 0,
    canShow: false
  };

  function LazyImageModel() {
    this.animIn = __bind(this.animIn, this);
    this.show = __bind(this.show, this);
    this.onLoadFail = __bind(this.onLoadFail, this);
    this.onLoadComplete = __bind(this.onLoadComplete, this);
    this.onLoadProgress = __bind(this.onLoadProgress, this);
    this._loadImageXHR = __bind(this._loadImageXHR, this);
    this._loadImageNoXHR = __bind(this._loadImageNoXHR, this);
    this.addEl = __bind(this.addEl, this);
    this.start = __bind(this.start, this);
    LazyImageModel.__super__.constructor.apply(this, arguments);
    this.start();
    return null;
  }

  LazyImageModel.prototype.start = function() {
    this._loadImageNoXHR();
    return null;
  };

  LazyImageModel.prototype.addEl = function($el) {
    var $els;
    $els = this.get('$els');
    $els.push($el);
    this.set('$els', $els);
    return null;
  };

  LazyImageModel.prototype._loadImageNoXHR = function() {
    var i;
    i = new Image;
    i.onload = i.onabort = i.onerror = this.onLoadComplete;
    i.src = this.get('src');
    return null;
  };

  LazyImageModel.prototype._loadImageXHR = function() {
    var r;
    console.log("LOADING ", this.get('src'));
    r = $.ajax({
      type: 'GET',
      url: this.get('src'),
      xhr: (function(_this) {
        return function() {
          var xhr;
          xhr = new window.XMLHttpRequest();
          xhr.addEventListener("progress", function(evt) {
            return _this.onLoadProgress(evt);
          }, false);
          return xhr;
        };
      })(this)
    });
    r.done(this.onLoadComplete);
    r.fail(this.onLoadFail);
    return null;
  };

  LazyImageModel.prototype.onLoadProgress = function(evt) {
    var percentComplete;
    this.set('state', LazyImageModel.states.PROGRESS);
    if (evt.lengthComputable) {
      percentComplete = (evt.loaded / evt.total) * 100;
    }
    return null;
  };

  LazyImageModel.prototype.onLoadComplete = function(res) {
    this.set('state', LazyImageModel.states.LOADED);
    if (this.get('canShow')) {
      this.animIn();
    }
    return null;
  };

  LazyImageModel.prototype.onLoadFail = function(res) {
    console.error("onLoadFail : =>", res);
    return null;
  };

  LazyImageModel.prototype.show = function() {
    this.set('canShow', true);
    if (this.get('state') === LazyImageModel.states.LOADED) {
      this.animIn();
    }
    return null;
  };

  LazyImageModel.prototype.animIn = function() {
    var $el, _i, _len, _ref;
    _ref = this.get('$els');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      $el = _ref[_i];
      $el.find("." + this.classNames.BG_IMAGE).css('background-image', "url(" + (this.get('src')) + ")").end().addClass(this.classNames.LOADED);
    }
    return null;
  };

  return LazyImageModel;

})(Backbone.Model);

module.exports = LazyImageModel;



},{"../AbstractModel":12}],16:[function(require,module,exports){
var AbstractModel, HomeTaglineModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

HomeTaglineModel = (function(_super) {
  __extends(HomeTaglineModel, _super);

  function HomeTaglineModel() {
    this._getTaglineHTML = __bind(this._getTaglineHTML, this);
    this._filterAttrs = __bind(this._filterAttrs, this);
    return HomeTaglineModel.__super__.constructor.apply(this, arguments);
  }

  HomeTaglineModel.prototype.defaults = {
    tagline: "",
    taglineHTML: ""
  };

  HomeTaglineModel.prototype._filterAttrs = function(attrs) {
    if (attrs && attrs.tagline) {
      attrs.taglineHTML = this._getTaglineHTML(attrs.tagline);
    }
    return attrs;
  };

  HomeTaglineModel.prototype._getTaglineHTML = function(text) {
    var parts, taglineHTML;
    parts = text.split('<br/>');
    taglineHTML = "<span class=\"wo\"><span class=\"wi\">" + parts[0] + "</span></span></br><span class=\"wo\"><span class=\"wi\">" + parts[1] + "</span></span>";
    return taglineHTML;
  };

  return HomeTaglineModel;

})(AbstractModel);

module.exports = HomeTaglineModel;



},{"../AbstractModel":12}],17:[function(require,module,exports){
var AbstractView, Nav, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../view/AbstractView');

Router = require('./Router');

Nav = (function(_super) {
  __extends(Nav, _super);

  Nav.EVENT_CHANGE_VIEW = 'EVENT_CHANGE_VIEW';

  Nav.EVENT_CHANGE_SUB_VIEW = 'EVENT_CHANGE_SUB_VIEW';

  Nav.prototype.sections = {
    HOME: '',
    ABOUT: 'about',
    WORK: 'work',
    CONTACT: 'contact'
  };

  Nav.prototype.current = {
    area: null,
    sub: null,
    query: null
  };

  Nav.prototype.previous = {
    area: null,
    sub: null,
    query: null
  };

  function Nav() {
    this.changeView = __bind(this.changeView, this);
    this.getSection = __bind(this.getSection, this);
    this.NC().router.on(Router.EVENT_HASH_CHANGED, this.changeView);
    return false;
  }

  Nav.prototype.getSection = function(section) {
    var sectionName, uri, _ref;
    if (section === '') {
      return true;
    }
    _ref = this.sections;
    for (sectionName in _ref) {
      uri = _ref[sectionName];
      if (uri === section) {
        return sectionName;
      }
    }
    return false;
  };

  Nav.prototype.changeView = function(area, sub, query, params) {
    this.previous = this.current;
    this.current = {
      area: area,
      sub: sub,
      query: query
    };
    this.trigger(Nav.EVENT_CHANGE_VIEW, area, sub, query);
    if (this.NC().appView.modalManager.isOpen()) {
      this.NC().appView.modalManager.hideOpenModal();
    }
    return null;
  };

  return Nav;

})(AbstractView);

module.exports = Nav;



},{"../view/AbstractView":25,"./Router":18}],18:[function(require,module,exports){
var Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    this.NC = __bind(this.NC, this);
    this.onHashFragmentChange = __bind(this.onHashFragmentChange, this);
    this.navigateTo = __bind(this.navigateTo, this);
    this.hashChanged = __bind(this.hashChanged, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.start = __bind(this.start, this);
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.EVENT_HASH_CHANGED = 'EVENT_HASH_CHANGED';

  Router.EVENT_HASHFRAGMENT_CHANGED = 'EVENT_HASHFRAGMENT_CHANGED';

  Router.prototype.FIRST_ROUTE = true;

  Router.prototype.routes = {
    '(/)(:area)(/:sub)(/)': 'hashChanged',
    '*actions': 'navigateTo'
  };

  Router.prototype.area = null;

  Router.prototype.sub = null;

  Router.prototype.query = null;

  Router.prototype.params = null;

  Router.prototype.start = function() {
    Backbone.history.start({
      pushState: true,
      root: this.NC().BASE_PATH
    });
    this.bindEvents();
    return null;
  };

  Router.prototype.bindEvents = function() {
    this.on(this.EVENT_HASHFRAGMENT_CHANGED, this.onHashFragmentChange);
    return null;
  };

  Router.prototype.hashChanged = function(area, sub, query) {
    this.area = area != null ? area : null;
    this.sub = sub != null ? sub : null;
    this.query = query != null ? query : null;
    if (!this.area) {
      this.area = this.NC().nav.sections.HOME;
    }
    this.trigger(Router.EVENT_HASH_CHANGED, this.area, this.sub, this.query, this.params);
    if (this.FIRST_ROUTE) {
      this.FIRST_ROUTE = false;
    } else {
      this.NC().appView.trackPageView();
    }
    return null;
  };

  Router.prototype.navigateTo = function(where, trigger, replace, params) {
    if (where == null) {
      where = '';
    }
    if (trigger == null) {
      trigger = true;
    }
    if (replace == null) {
      replace = false;
    }
    this.params = params;
    if (where.charAt(0) !== "/") {
      where = "/" + where;
    }
    if (where.charAt(where.length - 1) !== "/" && where.indexOf('?') < 0) {
      where = "" + where + "/";
    }
    if (!trigger) {
      this.trigger(Router.EVENT_HASH_CHANGED, where, null, this.query, this.params);
      return;
    }
    this.navigate(where, {
      trigger: true,
      replace: replace
    });
    return null;
  };

  Router.prototype.onHashFragmentChange = function() {
    this.NC().appView.trackPageView();
    return null;
  };

  Router.prototype.NC = function() {
    return window.NC;
  };

  return Router;

})(Backbone.Router);

module.exports = Router;



},{}],19:[function(require,module,exports){
var AbstractView, AppView, LazyImageCollection, LazyImageLoader, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('../AppView');

AbstractView = require('../view/AbstractView');

Wrapper = require('../view/base/Wrapper');

LazyImageCollection = require('../collections/images/LazyImageCollection');

LazyImageLoader = (function(_super) {
  __extends(LazyImageLoader, _super);

  LazyImageLoader.ATTR = 'data-lazyimage';

  function LazyImageLoader() {
    this._getVars = __bind(this._getVars, this);
    this._getImageFromEl = __bind(this._getImageFromEl, this);
    this.show = __bind(this.show, this);
    this.load = __bind(this.load, this);
    this.onViewUpdated = __bind(this.onViewUpdated, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.onStart = __bind(this.onStart, this);
    this.images = new LazyImageCollection;
    LazyImageLoader.__super__.constructor.apply(this, arguments);
    this.NC().appView.on('start', this.onStart);
    return null;
  }

  LazyImageLoader.prototype.onStart = function() {
    this.NC().appView.off('start', this.onStart);
    this.bindEvents();
    return null;
  };

  LazyImageLoader.prototype.bindEvents = function() {
    this.NC().appView.on(AppView.EVENT_UPDATE_DIMENSIONS, this.onViewUpdated);
    this.NC().appView.wrapper.on(Wrapper.VIEW_UPDATED, this.onViewUpdated);
    return null;
  };

  LazyImageLoader.prototype.onViewUpdated = function() {
    this.NC().appView.wrapper.currentView.$el.find("[" + LazyImageLoader.ATTR + "]").each((function(_this) {
      return function(i, el) {
        return _this.load($(el));
      };
    })(this));
    return null;
  };

  LazyImageLoader.prototype.load = function($el) {
    var img;
    img = this._getImageFromEl($el);
    if (!img.src) {
      return;
    }
    this.images.addImage(img);
    return null;
  };

  LazyImageLoader.prototype.show = function($el) {
    var img, imgRef;
    img = this._getImageFromEl($el);
    imgRef = this.images.findWhere({
      src: img.src
    });
    if (imgRef != null) {
      imgRef.show();
    }
    return null;
  };

  LazyImageLoader.prototype._getImageFromEl = function($el) {
    var img, _imgSrc;
    img = {};
    img.$el = $el.attr("" + LazyImageLoader.ATTR) ? $el : $el.find("[" + LazyImageLoader.ATTR + "]");
    _imgSrc = img.$el.attr("" + LazyImageLoader.ATTR);
    img.src = _imgSrc ? this.supplantString(_imgSrc, this._getVars()) : null;
    return img;
  };

  LazyImageLoader.prototype._getVars = function() {
    var vars;
    vars = {
      BASE_URL: this.NC().BASE_URL,
      RWD_SIZE: this.NC().appView.dims.r
    };
    return vars;
  };

  return LazyImageLoader;

})(AbstractView);

module.exports = LazyImageLoader;



},{"../AppView":4,"../collections/images/LazyImageCollection":7,"../view/AbstractView":25,"../view/base/Wrapper":29}],20:[function(require,module,exports){
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



},{}],21:[function(require,module,exports){

/*
 * Requester #

Wrapper for `$.ajax` calls
 */
var Requester;

Requester = (function() {
  function Requester() {}

  Requester.requests = [];

  Requester.request = function(data) {

    /*
    `data = {`<br>
    `  url         : String`<br>
    `  type        : "POST/GET/PUT"`<br>
    `  data        : Object`<br>
    `  dataType    : jQuery dataType`<br>
    `  contentType : String`<br>
    `}`
     */
    var r;
    r = $.ajax({
      url: data.url,
      type: data.type ? data.type : "POST",
      data: data.data ? data.data : null,
      dataType: data.dataType ? data.dataType : "json",
      contentType: data.contentType ? data.contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      processData: data.processData !== null && data.processData !== void 0 ? data.processData : true
    });
    r.done(data.done);
    r.fail(data.fail);
    return r;
  };

  Requester.addImage = function(data, done, fail) {

    /*
    ** Usage: <br>
    `data = canvass.toDataURL("image/jpeg").slice("data:image/jpeg;base64,".length)`<br>
    `Requester.addImage data, "zoetrope", @done, @fail`
     */
    Requester.request({
      url: '/api/images/',
      type: 'POST',
      data: {
        image_base64: encodeURI(data)
      },
      done: done,
      fail: fail
    });
    return null;
  };

  Requester.deleteImage = function(id, done, fail) {
    Requester.request({
      url: '/api/images/' + id,
      type: 'DELETE',
      done: done,
      fail: fail
    });
    return null;
  };

  return Requester;

})();

module.exports = Requester;



},{}],22:[function(require,module,exports){
var AbstractView, AppView, LazyImageLoader, ScrollItemInView, WordTransitioner, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('../AppView');

AbstractView = require('../view/AbstractView');

Wrapper = require('../view/base/Wrapper');

WordTransitioner = require('./WordTransitioner');

LazyImageLoader = require('./LazyImageLoader');

ScrollItemInView = (function(_super) {
  __extends(ScrollItemInView, _super);

  ScrollItemInView.prototype.classNames = {
    SHOW: 'show'
  };

  ScrollItemInView.prototype.defaults = {
    showThreshold: 0.8,
    itemDelay: 250
  };

  ScrollItemInView.prototype.items = [];

  function ScrollItemInView() {
    this.showItem = __bind(this.showItem, this);
    this.showItems = __bind(this.showItems, this);
    this.getItems = __bind(this.getItems, this);
    this.onScroll = __bind(this.onScroll, this);
    this.onViewUpdated = __bind(this.onViewUpdated, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.onStart = __bind(this.onStart, this);
    ScrollItemInView.__super__.constructor.apply(this, arguments);
    this.NC().appView.on('start', this.onStart);
    return null;
  }

  ScrollItemInView.prototype.onStart = function() {
    this.NC().appView.off('start', this.onStart);
    this.bindEvents();
    return null;
  };

  ScrollItemInView.prototype.bindEvents = function() {
    this.NC().appView.on(AppView.EVENT_ON_SCROLL, this.onScroll);
    this.NC().appView.wrapper.on(Wrapper.VIEW_UPDATED, this.onViewUpdated);
    return null;
  };

  ScrollItemInView.prototype.onViewUpdated = function() {
    this.getItems();
    this.onScroll();
    return null;
  };

  ScrollItemInView.prototype.onScroll = function() {
    var i, item, itemsToShow, threshold, _i, _len, _ref;
    if (!this.items.length) {
      return;
    }
    threshold = this.NC().appView.lastScrollY + (this.NC().appView.dims.h * this.defaults.showThreshold);
    itemsToShow = [];
    _ref = this.items;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      if (threshold > item.offset) {
        itemsToShow.push(item);
      }
    }
    if (itemsToShow.length) {
      this.showItems(itemsToShow);
      this.items = this.items.slice(itemsToShow.length, this.items.length);
    }
    return null;
  };

  ScrollItemInView.prototype.getItems = function() {
    this.NC().appView.wrapper.currentView.$el.find('[data-scroll-item]').each((function(_this) {
      return function(i, el) {
        var $el;
        $el = $(el);
        _this.items.push({
          $el: $el,
          offset: $el.offset().top
        });
        return _this.items = _.sortBy(_this.items, function(item) {
          return item.offset;
        });
      };
    })(this));
    return null;
  };

  ScrollItemInView.prototype.showItems = function(items) {
    var i, item, _fn, _i, _len;
    _fn = (function(_this) {
      return function(item, i) {
        var delay;
        delay = _this.defaults.itemDelay * i;
        return setTimeout(function() {
          return _this.showItem(item.$el);
        }, delay);
      };
    })(this);
    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
      item = items[i];
      _fn(item, i);
    }
    return null;
  };

  ScrollItemInView.prototype.showItem = function($el) {
    $el.addClass(this.classNames.SHOW);
    WordTransitioner["in"]($el);
    this.NC().appView.lazyImageLoader.show($el);
    return null;
  };

  return ScrollItemInView;

})(AbstractView);

module.exports = ScrollItemInView;



},{"../AppView":4,"../view/AbstractView":25,"../view/base/Wrapper":29,"./LazyImageLoader":19,"./WordTransitioner":24}],23:[function(require,module,exports){
var Scroller;

Scroller = (function() {
  function Scroller() {}

  Scroller.defaults = {
    offset: 0,
    minTime: 0.1,
    maxTime: 0.6
  };

  Scroller.maxDist = 500;

  Scroller.scrollTo = function(settings, cb) {
    var distToGo, maxTime, minTime, offset, target, time;
    offset = settings.offset || Scroller.defaults.offset;
    maxTime = settings.maxTime || Scroller.defaults.maxTime;
    minTime = settings.minTime || Scroller.defaults.minTime;
    target = (typeof settings.target === 'number' ? settings.target : settings.target.offset().top) + offset;
    distToGo = window.scrollY - target;
    distToGo = distToGo < 0 ? distToGo * -1 : distToGo;
    if (distToGo === 0) {
      time = 0;
    } else if (distToGo > Scroller.maxDist) {
      time = maxTime + minTime;
    } else {
      time = ((distToGo / Scroller.maxDist) * maxTime) + minTime;
    }
    console.log("+++Scroller, distance to go: " + distToGo + ", time to take it: " + time);
    TweenLite.to(window, time, {
      scrollTo: {
        x: 0,
        y: target
      },
      ease: Power3.easeInOut,
      onComplete: function() {
        return typeof cb === "function" ? cb() : void 0;
      }
    });
    return null;
  };

  return Scroller;

})();

module.exports = Scroller;



},{}],24:[function(require,module,exports){
var WordTransitioner;

WordTransitioner = (function() {
  function WordTransitioner() {}

  WordTransitioner.classNames = {
    WORD: 'wo',
    ANIM_IN: 'a',
    ANIM_OUT: 'ao'
  };

  WordTransitioner.ANIM_DELAY = 500;

  WordTransitioner.ANIM_DURATION = 1000;

  WordTransitioner["in"] = function($el, cb) {
    WordTransitioner.animate('in', $el, cb);
    return null;
  };

  WordTransitioner.out = function($el, cb) {
    WordTransitioner.animate('out', $el, cb);
    return null;
  };

  WordTransitioner.animate = function(direction, $el, cb) {
    var $words, className, len;
    className = WordTransitioner.classNames[(direction === 'in' ? 'ANIM_IN' : 'ANIM_OUT')];
    $words = $el.find('.' + WordTransitioner.classNames.WORD);
    len = $words.length;
    $words.each(function(i, el) {
      return (function(i, el, $words) {
        var delay;
        delay = i * WordTransitioner.ANIM_DELAY;
        return setTimeout(function() {
          $(el).addClass(className);
          if (i === len - 1) {
            return setTimeout(function() {
              if (typeof cb === "function") {
                cb();
              }
              if (direction === 'out') {
                return WordTransitioner.reset($words);
              }
            }, WordTransitioner.ANIM_DURATION);
          }
        }, delay);
      })(i, el, $words);
    });
    return null;
  };

  WordTransitioner.reset = function($el) {
    $el.removeClass(WordTransitioner.classNames.ANIM_IN + ' ' + WordTransitioner.classNames.ANIM_OUT);
    return null;
  };

  return WordTransitioner;

})();

module.exports = WordTransitioner;



},{}],25:[function(require,module,exports){
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



},{}],26:[function(require,module,exports){
var AbstractView, AbstractViewPage, MediaQueries,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./AbstractView');

MediaQueries = require('../utils/MediaQueries');

AbstractViewPage = (function(_super) {
  __extends(AbstractViewPage, _super);

  AbstractViewPage.prototype._shown = false;

  AbstractViewPage.prototype._listening = false;

  AbstractViewPage.prototype.area = null;

  AbstractViewPage.prototype.sub = null;

  AbstractViewPage.prototype.pageTitle = null;

  AbstractViewPage.prototype.animatedHeader = null;

  AbstractViewPage.prototype.$transitionEls = null;

  AbstractViewPage.prototype.transitionConfig = {
    elOffset: 15,
    elDelay: 0.15,
    elDuration: 0.2
  };

  AbstractViewPage.prototype.avPageSize = 12000;

  AbstractViewPage.prototype.pageSize = null;

  function AbstractViewPage(area, sub) {
    this.area = area;
    this.sub = sub;
    this.setListeners = __bind(this.setListeners, this);
    this.dispose = __bind(this.dispose, this);
    this._animateOutDone = __bind(this._animateOutDone, this);
    this._animateOut = __bind(this._animateOut, this);
    this.hide = __bind(this.hide, this);
    this._animateInDone = __bind(this._animateInDone, this);
    this._animateIn = __bind(this._animateIn, this);
    this.show = __bind(this.show, this);
    this._onLoadFail = __bind(this._onLoadFail, this);
    this._onLoadComplete = __bind(this._onLoadComplete, this);
    this._onLoadProgress = __bind(this._onLoadProgress, this);
    this.getViewContent = __bind(this.getViewContent, this);
    AbstractViewPage.__super__.constructor.apply(this, arguments);
    return null;
  }

  AbstractViewPage.prototype.getViewContent = function() {
    var r, url;
    url = this.sub ? "" + (this.NC().BASE_URL) + "/" + this.area + "/" + this.sub + "/" : "" + (this.NC().BASE_URL) + "/" + this.area + "/";
    r = $.ajax({
      type: 'GET',
      url: url,
      xhr: (function(_this) {
        return function() {
          var xhr;
          xhr = new window.XMLHttpRequest();
          xhr.addEventListener("progress", function(evt) {
            return _this._onLoadProgress(evt);
          }, false);
          return xhr;
        };
      })(this)
    });
    r.done(this._onLoadComplete);
    r.fail(this._onLoadFail);
    return r;
  };

  AbstractViewPage.prototype._onLoadProgress = function(evt) {
    var percentComplete;
    percentComplete = (evt.loaded / (this.pageSize || this.avPageSize)) * 100;
    this.NC().appView.preloader.goTo(percentComplete);
    return null;
  };

  AbstractViewPage.prototype._onLoadComplete = function(res) {
    var $res;
    $res = $(res);
    this.pageTitle = $res.filter('title').eq(0).text();
    this.$tmpl = $res.filter('#main').find("[data-template=\"" + this.template + "\"]");
    return null;
  };

  AbstractViewPage.prototype._onLoadFail = function() {
    console.error("_onLoadFail : =>");
    return null;
  };


  /*
  	`force` - if both views are artist view, we have to force re-intitialisation
   */

  AbstractViewPage.prototype.show = function(force, cb) {
    if (force == null) {
      force = false;
    }
    if (!!this._shown) {
      return;
    }
    this._shown = true;
    this.NC().appView.wrapper.$el.append(this.$tmpl);
    this.initialize(force);
    this.NC().appView.wrapper.addChild(this);
    this.callChildrenAndSelf('setListeners', 'on');
    this._animateIn(cb);
    return null;
  };

  AbstractViewPage.prototype._animateIn = function(cb) {
    this.$transitionEls = this.$el.find('[data-page-transition]');
    this.$el.css({
      'visibility': 'visible'
    });
    this.$transitionEls.each((function(_this) {
      return function(i, el) {
        return (function(i, el) {
          var delay, fromParams, toParams;
          delay = i * _this.transitionConfig.elDelay;
          fromParams = {
            opacity: 0,
            y: _this.transitionConfig.elOffset
          };
          toParams = {
            delay: delay,
            opacity: 1,
            y: 0,
            ease: Circ.easeOut
          };
          if (i === _this.$transitionEls.length - 1) {
            toParams.onComplete = _this._animateInDone;
            toParams.onCompleteParams = [cb];
          }
          return TweenLite.fromTo($(el), _this.transitionConfig.elDuration, fromParams, toParams);
        })(i, el);
      };
    })(this));
    return null;
  };

  AbstractViewPage.prototype._animateInDone = function(cb) {
    this.$transitionEls.attr("style", "");
    if (typeof cb === "function") {
      cb();
    }
    return null;
  };

  AbstractViewPage.prototype.hide = function(cb) {
    if (!this._shown) {
      return;
    }
    this._shown = false;
    this._animateOut(cb);
    return null;
  };

  AbstractViewPage.prototype._animateOut = function(cb) {
    var len;
    len = this.$transitionEls.length;
    this.$transitionEls.each((function(_this) {
      return function(i, el) {
        return (function(i, el) {
          var delay, fromParams, toParams;
          delay = (len - (i + 1)) * _this.transitionConfig.elDelay;
          fromParams = {
            opacity: 1,
            y: 0
          };
          toParams = {
            delay: delay,
            opacity: 0,
            y: _this.transitionConfig.elOffset,
            ease: Circ.easeOut
          };
          if (i === 0) {
            toParams.onComplete = _this._animateOutDone;
            toParams.onCompleteParams = [cb];
          }
          return TweenLite.fromTo($(el), _this.transitionConfig.elDuration, fromParams, toParams);
        })(i, el);
      };
    })(this));
    return null;
  };

  AbstractViewPage.prototype._animateOutDone = function(cb) {
    this.NC().appView.wrapper.remove(this);

    /* replace with some proper transition if we can */
    this.$el.css({
      'visibility': 'hidden'
    });
    if (typeof cb === "function") {
      cb();
    }
    return null;
  };

  AbstractViewPage.prototype.dispose = function() {
    this.callChildrenAndSelf('setListeners', 'off');
    AbstractViewPage.__super__.dispose.call(this);
    return null;
  };

  AbstractViewPage.prototype.setListeners = function(setting) {
    if (setting === this._listening) {
      return;
    }
    this._listening = setting;
    return null;
  };

  return AbstractViewPage;

})(AbstractView);

module.exports = AbstractViewPage;



},{"../utils/MediaQueries":20,"./AbstractView":25}],27:[function(require,module,exports){
var AbstractView, Header, MediaQueries, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

Router = require('../../router/Router');

MediaQueries = require('../../utils/MediaQueries');

Header = (function(_super) {
  __extends(Header, _super);

  Header.prototype.template = 'site-header';

  Header.prototype.classNames = {
    ANIM_IN: 'anim-in',
    MENU_OPEN: 'menu-open',
    MENU_CLOSING: 'menu-closing',
    NAV_ACTIVE: 'active'
  };

  Header.prototype.sizes = {
    DESKTOP: 76,
    MOBILE: 65
  };

  Header.prototype.MENU_TRANSITION_DURATION = 300;

  Header.prototype.menuOpen = false;

  function Header() {
    this._getLinkURL = __bind(this._getLinkURL, this);
    this.onHashChange = __bind(this.onHashChange, this);
    this.animateIn = __bind(this.animateIn, this);
    this.setDims = __bind(this.setDims, this);
    this.unSizeMobileMenu = __bind(this.unSizeMobileMenu, this);
    this.sizeMobileMenu = __bind(this.sizeMobileMenu, this);
    this.onMenuClosed = __bind(this.onMenuClosed, this);
    this.closeMenu = __bind(this.closeMenu, this);
    this.openMenu = __bind(this.openMenu, this);
    this.toggleMenu = __bind(this.toggleMenu, this);
    this.bindEvents = __bind(this.bindEvents, this);
    Header.__super__.constructor.call(this);
    this.$nav = this.$el.find('nav ');
    this.$navLinks = this.$nav.find('a');
    this.setDims();
    this.bindEvents();
    return null;
  }

  Header.prototype.bindEvents = function() {
    this.NC().appView.on(this.NC().appView.EVENT_UPDATE_DIMENSIONS, this.setDims);
    this.NC().router.on(Router.EVENT_HASH_CHANGED, this.onHashChange);
    this.$el.find('[data-mobile-menu]').on(window.touchEndInteraction, this.toggleMenu);
    return null;
  };

  Header.prototype.toggleMenu = function() {
    if (this.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
    return false;
  };

  Header.prototype.openMenu = function() {
    this.sizeMobileMenu();
    this.$el.addClass(this.classNames.MENU_OPEN);
    this.NC().appView.disableTouch();
    this.menuOpen = true;
    return null;
  };

  Header.prototype.closeMenu = function() {
    this.$el.addClass(this.classNames.MENU_CLOSING).removeClass(this.classNames.MENU_OPEN);
    this.NC().appView.enableTouch();
    setTimeout(this.onMenuClosed, this.MENU_TRANSITION_DURATION);
    this.menuOpen = false;
    return null;
  };

  Header.prototype.onMenuClosed = function() {
    this.$el.removeClass(this.classNames.MENU_CLOSING);
    return null;
  };

  Header.prototype.sizeMobileMenu = function() {
    this.$nav.css({
      "height": this.NC().appView.dims.h
    });
    return null;
  };

  Header.prototype.unSizeMobileMenu = function() {
    this.$nav.css({
      "height": "auto"
    });
    return null;
  };

  Header.prototype.setDims = function() {
    if (!this.menuOpen) {
      return;
    }
    if (MediaQueries.getBreakpoint() === 'Smallest') {
      this.sizeMobileMenu();
    } else {
      this.unSizeMobileMenu();
      this.closeMenu();
    }
    return null;
  };

  Header.prototype.animateIn = function() {
    this.$el.addClass(this.classNames.ANIM_IN);
    return null;
  };

  Header.prototype.onHashChange = function() {
    var area, url;
    if (this.menuOpen) {
      this.closeMenu();
    }
    area = this.NC().router.area;
    url = this._getLinkURL(area);
    this.$navLinks.not("[href=\"" + url + "\"]").removeClass(this.classNames.NAV_ACTIVE).end().filter("[href=\"" + url + "\"]").addClass(this.classNames.NAV_ACTIVE);
    return null;
  };

  Header.prototype._getLinkURL = function(area) {
    return this.NC().BASE_URL + '/' + area;
  };

  return Header;

})(AbstractView);

module.exports = Header;



},{"../../router/Router":18,"../../utils/MediaQueries":20,"../AbstractView":25}],28:[function(require,module,exports){
var AbstractView, Preloader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

Preloader = (function(_super) {
  __extends(Preloader, _super);

  Preloader.prototype.cb = null;

  Preloader.prototype.TRANSITION_DURATION = 600;

  Preloader.prototype.FIRST_HIDE_DELAY = 500;

  Preloader.prototype.classNames = {
    SHOW: 'show',
    SHOWN: 'shown',
    HIDING: 'hiding'
  };

  Preloader.prototype.templateName = 'preloader';

  function Preloader(type, $el, className) {
    this.type = type;
    this.className = className;
    this.goTo = __bind(this.goTo, this);
    this.onHideComplete = __bind(this.onHideComplete, this);
    this.firstHide = __bind(this.firstHide, this);
    this.hide = __bind(this.hide, this);
    this.onShowComplete = __bind(this.onShowComplete, this);
    this.show = __bind(this.show, this);
    this.reset = __bind(this.reset, this);
    this.init = __bind(this.init, this);
    if ($el !== null) {
      this.setElement($el);
    }
    Preloader.__super__.constructor.call(this);
    return null;
  }

  Preloader.prototype.init = function() {
    this.$maskOuter = this.$el.find('[data-preloader-mask="outer"]');
    this.$maskInner = this.$el.find('[data-preloader-mask="inner"]');
    return null;
  };

  Preloader.prototype.reset = function() {
    this.$maskOuter.css("width", "100%");
    this.$maskInner.css("width", "0%");
    return null;
  };

  Preloader.prototype.show = function(cb) {
    this.cb = cb;
    this.$el.addClass(this.classNames.SHOW);
    return null;
  };

  Preloader.prototype.onShowComplete = function() {
    if (typeof this.cb === "function") {
      this.cb();
    }
    return null;
  };

  Preloader.prototype.hide = function(cb) {
    this.cb = cb;
    if (this.type === 'site') {
      this.goTo(100);
    }
    this.$el.addClass(this.classNames.HIDING).removeClass(this.classNames.SHOW);
    setTimeout(this.onHideComplete, this.TRANSITION_DURATION);
    return null;
  };

  Preloader.prototype.firstHide = function(cb) {
    setTimeout((function(_this) {
      return function() {
        return _this.hide(cb);
      };
    })(this), this.FIRST_HIDE_DELAY);
    return null;
  };

  Preloader.prototype.onHideComplete = function() {
    if (typeof this.cb === "function") {
      this.cb();
    }
    this.reset();
    this.$el.removeClass(this.classNames.HIDING);
    if (this.type === 'site') {
      this.$el.addClass(this.classNames.SHOWN);
    }
    return null;
  };

  Preloader.prototype.goTo = function(value) {
    value = value > 100 ? 100 : value;
    this.$maskOuter.css("width", "" + (100 - value) + "%");
    this.$maskInner.css("width", "" + value + "%");
    return null;
  };

  return Preloader;

})(AbstractView);

module.exports = Preloader;



},{"../AbstractView":25}],29:[function(require,module,exports){
var AboutPageView, AbstractView, ContactPageView, HomePageView, Nav, ProjectPageView, Scroller, WorkPageView, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

HomePageView = require('../pages/homePage/HomePageView');

AboutPageView = require('../pages/aboutPage/AboutPageView');

WorkPageView = require('../pages/workPage/WorkPageView');

ProjectPageView = require('../pages/projectPage/ProjectPageView');

ContactPageView = require('../pages/contactPage/ContactPageView');

Nav = require('../../router/Nav');

Scroller = require('../../utils/Scroller');

Wrapper = (function(_super) {
  __extends(Wrapper, _super);

  Wrapper.VIEW_UPDATED = 'VIEW_UPDATED';

  Wrapper.prototype.template = 'wrapper';

  Wrapper.prototype.views = null;

  Wrapper.prototype.previousView = null;

  Wrapper.prototype.currentView = null;

  Wrapper.prototype.pageSwitchDfd = null;

  Wrapper.prototype.activeViewRequest = null;

  Wrapper.prototype.scrollToTopDfd = null;

  Wrapper.prototype.FIRST_VIEW = true;

  function Wrapper() {
    this.scrollToTop = __bind(this.scrollToTop, this);
    this.updatePageTitle = __bind(this.updatePageTitle, this);
    this.onViewUpdated = __bind(this.onViewUpdated, this);
    this.transitionViews = __bind(this.transitionViews, this);
    this.getNewViewContent = __bind(this.getNewViewContent, this);
    this.changeView = __bind(this.changeView, this);
    this.updateDims = __bind(this.updateDims, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.start = __bind(this.start, this);
    this.init = __bind(this.init, this);
    this.getViewByURL = __bind(this.getViewByURL, this);
    this.views = {
      home: {
        classRef: HomePageView,
        area: this.NC().nav.sections.HOME,
        sub: false
      },
      about: {
        classRef: AboutPageView,
        area: this.NC().nav.sections.ABOUT,
        sub: false
      },
      work: {
        classRef: WorkPageView,
        area: this.NC().nav.sections.WORK,
        sub: false
      },
      project: {
        classRef: ProjectPageView,
        area: this.NC().nav.sections.WORK,
        sub: true
      },
      contact: {
        classRef: ContactPageView,
        area: this.NC().nav.sections.CONTACT,
        sub: false
      }
    };
    Wrapper.__super__.constructor.call(this);
    return null;
  }

  Wrapper.prototype.getViewByURL = function(area, sub) {
    var data, name, _ref;
    _ref = this.views;
    for (name in _ref) {
      data = _ref[name];
      if ((area === this.views[name].area) && ((this.views[name].sub && sub) || (!this.views[name].sub && !sub))) {
        return this.views[name];
      }
    }
    return null;
  };

  Wrapper.prototype.init = function() {
    this.NC().appView.on('start', this.start);
    return null;
  };

  Wrapper.prototype.start = function() {
    this.NC().appView.off('start', this.start);
    this.updateDims();
    this.bindEvents();
    return null;
  };

  Wrapper.prototype.bindEvents = function() {
    this.NC().nav.on(Nav.EVENT_CHANGE_VIEW, this.changeView);
    this.NC().appView.on(this.NC().appView.EVENT_UPDATE_DIMENSIONS, this.updateDims);
    this.on(Wrapper.VIEW_UPDATED, this.onViewUpdated);
    return null;
  };

  Wrapper.prototype.updateDims = function() {
    this.$el.css('min-height', this.NC().appView.dims.h);
    return null;
  };

  Wrapper.prototype.changeView = function(area, sub, query) {
    var newView;
    if (this.pageSwitchDfd && this.pageSwitchDfd.state() !== 'resolved') {
      (function(_this) {
        return (function(area, sub) {
          return _this.pageSwitchDfd.done(function() {
            return _this.changeView(area, sub);
          });
        });
      })(this)(area, sub);
      return;
    }
    newView = this.getViewByURL(area, sub);
    this.NC().appView.preloader.show();
    this.previousView = this.currentView;
    this.currentView = new newView.classRef(area, sub, query);
    if (this.FIRST_VIEW) {
      this.transitionViews();
      this.FIRST_VIEW = false;
    } else {
      this.getNewViewContent();
    }
    return null;
  };

  Wrapper.prototype.getNewViewContent = function() {
    var dfds;
    this.pageSwitchDfd = $.Deferred();
    this.activeViewRequest = this.currentView.getViewContent();
    this.scrollToTopDfd = this.scrollToTop();
    dfds = [this.activeViewRequest, this.scrollToTopDfd];
    $.when.apply($, dfds).done((function(_this) {
      return function() {
        return _this.NC().appView.preloader.hide(function() {
          return _this.transitionViews(_this.previousView, _this.currentView, function() {
            return _this.trigger(Wrapper.VIEW_UPDATED);
          });
        });
      };
    })(this));
    return null;
  };

  Wrapper.prototype.transitionViews = function(from, to, cb) {
    var force;
    if (from == null) {
      from = this.previousView;
    }
    if (to == null) {
      to = this.currentView;
    }
    force = from && (from instanceof ProjectPageView && to instanceof ProjectPageView);
    if (!from) {
      to.show((function(_this) {
        return function() {
          return typeof cb === "function" ? cb() : void 0;
        };
      })(this));
    } else {
      from.hide((function(_this) {
        return function() {
          return to.show(force, function() {
            _this.pageSwitchDfd.resolve();
            return typeof cb === "function" ? cb() : void 0;
          });
        };
      })(this));
    }
    this.NC().appView.getDims();
    return null;
  };

  Wrapper.prototype.onViewUpdated = function() {
    this.updatePageTitle(this.currentView.pageTitle);
    return null;
  };

  Wrapper.prototype.updatePageTitle = function(title) {
    if (title && (window.document.title !== title)) {
      window.document.title = title;
    }
    return null;
  };

  Wrapper.prototype.scrollToTop = function() {
    var dfd;
    dfd = $.Deferred();
    Scroller.scrollTo({
      target: 0
    }, (function(_this) {
      return function() {
        return dfd.resolve();
      };
    })(this));
    return dfd;
  };

  return Wrapper;

})(AbstractView);

module.exports = Wrapper;



},{"../../router/Nav":17,"../../utils/Scroller":23,"../AbstractView":25,"../pages/aboutPage/AboutPageView":33,"../pages/contactPage/ContactPageView":34,"../pages/homePage/HomePageView":35,"../pages/projectPage/ProjectPageView":36,"../pages/workPage/WorkPageView":37}],30:[function(require,module,exports){
var AbstractModal, AbstractView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

AbstractModal = (function(_super) {
  __extends(AbstractModal, _super);

  AbstractModal.prototype.$window = null;


  /* override in individual classes */

  AbstractModal.prototype.name = null;

  AbstractModal.prototype.template = null;

  function AbstractModal() {
    this.closeClick = __bind(this.closeClick, this);
    this.animateOut = __bind(this.animateOut, this);
    this.animateIn = __bind(this.animateIn, this);
    this.onKeyUp = __bind(this.onKeyUp, this);
    this.setListeners = __bind(this.setListeners, this);
    this.dispose = __bind(this.dispose, this);
    this.hide = __bind(this.hide, this);
    this.$window = $(window);
    AbstractModal.__super__.constructor.call(this);
    this.NC().appView.addChild(this);
    this.setListeners('on');
    this.animateIn();
    return null;
  }

  AbstractModal.prototype.hide = function() {
    this.animateOut((function(_this) {
      return function() {
        return _this.NC().appView.remove(_this);
      };
    })(this));
    return null;
  };

  AbstractModal.prototype.dispose = function() {
    this.setListeners('off');
    this.NC().appView.modalManager.modals[this.name].view = null;
    AbstractModal.__super__.dispose.call(this);
    return null;
  };

  AbstractModal.prototype.setListeners = function(setting) {
    this.$window[setting]('keyup', this.onKeyUp);
    this.$('[data-close]')[setting]('click', this.closeClick);
    return null;
  };

  AbstractModal.prototype.onKeyUp = function(e) {
    if (e.keyCode === 27) {
      this.hide();
    }
    return null;
  };

  AbstractModal.prototype.animateIn = function() {
    TweenLite.to(this.$el, 0.3, {
      'visibility': 'visible',
      'opacity': 1,
      ease: Quad.easeOut
    });
    TweenLite.to(this.$el.find('.inner'), 0.3, {
      delay: 0.15,
      'transform': 'scale(1)',
      'visibility': 'visible',
      'opacity': 1,
      ease: Back.easeOut
    });
    return null;
  };

  AbstractModal.prototype.animateOut = function(callback) {
    TweenLite.to(this.$el, 0.3, {
      delay: 0.15,
      'opacity': 0,
      ease: Quad.easeOut,
      onComplete: callback
    });
    TweenLite.to(this.$el.find('.inner'), 0.3, {
      'transform': 'scale(0.8)',
      'opacity': 0,
      ease: Back.easeIn
    });
    return null;
  };

  AbstractModal.prototype.closeClick = function(e) {
    e.preventDefault();
    this.hide();
    return null;
  };

  return AbstractModal;

})(AbstractView);

module.exports = AbstractModal;



},{"../AbstractView":25}],31:[function(require,module,exports){
var AbstractModal, OrientationModal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModal = require('./AbstractModal');

OrientationModal = (function(_super) {
  __extends(OrientationModal, _super);

  OrientationModal.prototype.name = 'orientationModal';

  OrientationModal.prototype.template = 'orientation-modal';

  OrientationModal.prototype.cb = null;

  function OrientationModal(cb) {
    this.cb = cb;
    this.onUpdateDims = __bind(this.onUpdateDims, this);
    this.setListeners = __bind(this.setListeners, this);
    this.hide = __bind(this.hide, this);
    this.init = __bind(this.init, this);
    this.templateVars = {
      name: this.name
    };
    OrientationModal.__super__.constructor.call(this);
    return null;
  }

  OrientationModal.prototype.init = function() {
    return null;
  };

  OrientationModal.prototype.hide = function(stillLandscape) {
    if (stillLandscape == null) {
      stillLandscape = true;
    }
    this.animateOut((function(_this) {
      return function() {
        _this.NC().appView.remove(_this);
        if (!stillLandscape) {
          return typeof _this.cb === "function" ? _this.cb() : void 0;
        }
      };
    })(this));
    return null;
  };

  OrientationModal.prototype.setListeners = function(setting) {
    OrientationModal.__super__.setListeners.apply(this, arguments);
    this.NC().appView[setting]('updateDims', this.onUpdateDims);
    this.$el[setting]('touchend click', this.hide);
    return null;
  };

  OrientationModal.prototype.onUpdateDims = function(dims) {
    if (dims.o === 'portrait') {
      this.hide(false);
    }
    return null;
  };

  return OrientationModal;

})(AbstractModal);

module.exports = OrientationModal;



},{"./AbstractModal":30}],32:[function(require,module,exports){
var AbstractView, ModalManager, OrientationModal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

OrientationModal = require('./OrientationModal');

ModalManager = (function(_super) {
  __extends(ModalManager, _super);

  ModalManager.prototype.modals = {
    orientationModal: {
      classRef: OrientationModal,
      view: null
    }
  };

  function ModalManager() {
    this.showModal = __bind(this.showModal, this);
    this.hideOpenModal = __bind(this.hideOpenModal, this);
    this.isOpen = __bind(this.isOpen, this);
    this.init = __bind(this.init, this);
    ModalManager.__super__.constructor.call(this);
    return null;
  }

  ModalManager.prototype.init = function() {
    return null;
  };

  ModalManager.prototype.isOpen = function() {
    var modal, name, _ref;
    _ref = this.modals;
    for (name in _ref) {
      modal = _ref[name];
      if (this.modals[name].view) {
        return true;
      }
    }
    return false;
  };

  ModalManager.prototype.hideOpenModal = function() {
    var modal, name, openModal, _ref;
    _ref = this.modals;
    for (name in _ref) {
      modal = _ref[name];
      if (this.modals[name].view) {
        openModal = this.modals[name].view;
      }
    }
    if (openModal != null) {
      openModal.hide();
    }
    return null;
  };

  ModalManager.prototype.showModal = function(name, cb) {
    if (cb == null) {
      cb = null;
    }
    if (this.modals[name].view) {
      return;
    }
    this.modals[name].view = new this.modals[name].classRef(cb);
    return null;
  };

  return ModalManager;

})(AbstractView);

module.exports = ModalManager;



},{"../AbstractView":25,"./OrientationModal":31}],33:[function(require,module,exports){
var AboutPageView, AbstractViewPage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../../AbstractViewPage');

AboutPageView = (function(_super) {
  __extends(AboutPageView, _super);

  AboutPageView.prototype.template = 'page-about';

  AboutPageView.prototype.pageSize = 6000;

  function AboutPageView() {

    /*
    
    		instantiate classes here
    
    		@exampleClass = new ExampleClass
     */
    AboutPageView.__super__.constructor.apply(this, arguments);

    /*
    
    		add classes to app structure here
    
    		@
    			.addChild(@exampleClass)
     */
    return null;
  }

  return AboutPageView;

})(AbstractViewPage);

module.exports = AboutPageView;



},{"../../AbstractViewPage":26}],34:[function(require,module,exports){
var AbstractViewPage, ContactPageView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../../AbstractViewPage');

ContactPageView = (function(_super) {
  __extends(ContactPageView, _super);

  ContactPageView.prototype.template = 'page-contact';

  ContactPageView.prototype.pageSize = 6000;

  function ContactPageView() {

    /*
    
    		instantiate classes here
    
    		@exampleClass = new ExampleClass
     */
    ContactPageView.__super__.constructor.apply(this, arguments);

    /*
    
    		add classes to app structure here
    
    		@
    			.addChild(@exampleClass)
     */
    return null;
  }

  return ContactPageView;

})(AbstractViewPage);

module.exports = ContactPageView;



},{"../../AbstractViewPage":26}],35:[function(require,module,exports){
var AbstractViewPage, HomePageView, HomeTaglinesCollection, WordTransitioner,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../../AbstractViewPage');

HomeTaglinesCollection = require('../../../collections/taglines/HomeTaglinesCollection');

WordTransitioner = require('../../../utils/WordTransitioner');

HomePageView = (function(_super) {
  __extends(HomePageView, _super);

  HomePageView.prototype.template = 'page-home';

  HomePageView.prototype.startTaglineTime = null;

  HomePageView.prototype.taglineTimer = null;

  HomePageView.prototype.CHANGE_TAGLINE_INTERVAL = 5000;

  HomePageView.prototype.FIRST_SHOW_DELAY = 1000;

  HomePageView.prototype.pageSize = 5000;

  function HomePageView() {
    this.changeTagline = __bind(this.changeTagline, this);
    this.stopTaglineTimer = __bind(this.stopTaglineTimer, this);
    this.startTaglineTimer = __bind(this.startTaglineTimer, this);
    this.getTaglines = __bind(this.getTaglines, this);
    this.showFirstTagline = __bind(this.showFirstTagline, this);
    this.setListeners = __bind(this.setListeners, this);
    this.taglines = new HomeTaglinesCollection;
    HomePageView.__super__.constructor.apply(this, arguments);
    return null;
  }

  HomePageView.prototype.setListeners = function(setting) {
    if (setting === 'on') {
      this.$tagline = this.$el.find('[data-tagline]');
      this.startTaglineTime = setTimeout((function(_this) {
        return function() {
          _this.showFirstTagline();
          _this.getTaglines();
          return _this.startTaglineTimer();
        };
      })(this), (this.NC().appView.wrapper.FIRST_VIEW ? this.FIRST_SHOW_DELAY : 0));
    } else {
      clearTimeout(this.startTaglineTime);
      this.stopTaglineTimer();
    }
    return null;
  };

  HomePageView.prototype.showFirstTagline = function() {
    WordTransitioner["in"](this.$tagline);
    return null;
  };

  HomePageView.prototype.getTaglines = function() {
    this.taglines.add(window._TAGLINES.shift());
    this.taglines.add(_.shuffle(window._TAGLINES));
    return null;
  };

  HomePageView.prototype.startTaglineTimer = function() {
    console.log("startTaglineTimer : =>");
    this.taglineTimer = setInterval(this.changeTagline, this.CHANGE_TAGLINE_INTERVAL);
    return null;
  };

  HomePageView.prototype.stopTaglineTimer = function() {
    clearInterval(this.taglineTimer);
    return null;
  };

  HomePageView.prototype.changeTagline = function() {
    console.log("changeTagline : =>");
    WordTransitioner.out(this.$tagline, (function(_this) {
      return function() {
        _this.$tagline.html(_this.taglines.getNext().get('taglineHTML'));
        return setTimeout(function() {
          return WordTransitioner["in"](_this.$tagline);
        }, 300);
      };
    })(this));
    return null;
  };

  return HomePageView;

})(AbstractViewPage);

module.exports = HomePageView;



},{"../../../collections/taglines/HomeTaglinesCollection":8,"../../../utils/WordTransitioner":24,"../../AbstractViewPage":26}],36:[function(require,module,exports){
var AbstractViewPage, AppView, MediaQueries, ProjectPageView, Scroller, WordTransitioner,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppView = require('../../../AppView');

AbstractViewPage = require('../../AbstractViewPage');

WordTransitioner = require('../../../utils/WordTransitioner');

Scroller = require('../../../utils/Scroller');

MediaQueries = require('../../../utils/MediaQueries');

ProjectPageView = (function(_super) {
  __extends(ProjectPageView, _super);

  ProjectPageView.prototype.template = 'page-project';

  ProjectPageView.prototype.device = 'DESKTOP';

  ProjectPageView.prototype.sizes = {
    PADDING_DESKTOP: 20,
    PADDING_MOBILE: 12,
    HIDE_HEADING: 50
  };

  ProjectPageView.prototype.classNames = {};

  function ProjectPageView() {
    this.showTitle = __bind(this.showTitle, this);
    this.scrollToContent = __bind(this.scrollToContent, this);
    this.onScroll = __bind(this.onScroll, this);
    this.onResize = __bind(this.onResize, this);
    this.setListeners = __bind(this.setListeners, this);
    this.init = __bind(this.init, this);
    this.filterPrefix = document.body.style.webkitFilter !== void 0 ? '-webkit-' : '';
    ProjectPageView.__super__.constructor.apply(this, arguments);
    return null;
  }

  ProjectPageView.prototype.init = function() {
    this.$hero = this.$el.find('.proj-hero');
    this.$heading = this.$el.find('.proj-heading');
    this.$toFadeOut = this.$heading.add(this.$el.find('.scroll-to-content'));
    return null;
  };

  ProjectPageView.prototype.setListeners = function(setting) {
    this.NC().appView[setting](AppView.EVENT_UPDATE_DIMENSIONS, this.onResize);
    this.NC().appView[setting](AppView.EVENT_ON_SCROLL, this.onScroll);
    this.$el.find('[data-scroll-to-content]')[setting]('click', this.scrollToContent);
    if (setting === 'on') {
      this.onResize();
      this.showTitle();
    }
    return null;
  };

  ProjectPageView.prototype.onResize = function() {
    this.device = MediaQueries.getBreakpoint() === 'Small' ? 'MOBILE' : 'DESKTOP';
    this.sizes.HIDE_HEADING = this.NC().appView.dims.h - this.NC().appView.header.sizes[this.device];
    this.$hero.css('height', this.NC().appView.dims.h - this.NC().appView.header.sizes[this.device] - this.sizes["PADDING_" + this.device]);
    return null;
  };

  ProjectPageView.prototype.onScroll = function() {
    var brightness, grayscale, headingOpacity, headingTranslate, heroCSS, heroScale, maxHeadingTranslate, maxHeroScale, state;
    if (this.NC().appView.lastScrollY > 0 && this.NC().appView.lastScrollY < this.sizes.HIDE_HEADING) {
      maxHeadingTranslate = 150;
      maxHeroScale = (this.NC().appView.dims.w / (this.NC().appView.dims.w - (this.sizes["PADDING_" + this.device] * 2))) - 1;
      state = this.NC().appView.lastScrollY / this.sizes.HIDE_HEADING;
      headingTranslate = state * maxHeadingTranslate;
      headingOpacity = 1 - state;
      heroScale = 1 + (state * maxHeroScale);
      grayscale = state;
      brightness = 1 - (state * 0.5);
      heroCSS = {
        'transform': "scale(" + heroScale + ")"
      };
      heroCSS["" + this.filterPrefix + "filter"] = "grayscale(" + grayscale + ") brightness(" + brightness + ")";
      this.$toFadeOut.css({
        'transform': this.CSSTranslate(0, headingTranslate, 'px'),
        'opacity': headingOpacity
      });
      this.$hero.css(heroCSS);
    } else if (this.NC().appView.lastScrollY <= 0) {
      heroCSS = {
        'transform': 'none'
      };
      heroCSS["" + this.filterPrefix + "filter"] = "none";
      this.$toFadeOut.css({
        'transform': 'none',
        'opacity': 1
      });
      this.$hero.css(heroCSS);
    }
    return null;
  };

  ProjectPageView.prototype.scrollToContent = function() {
    var target;
    target = this.NC().appView.dims.h - this.NC().appView.header.sizes[this.device] - this.sizes["PADDING_" + this.device];
    Scroller.scrollTo({
      target: target
    }, (function(_this) {
      return function() {
        var items;
        items = [];
        _this.$el.find('[data-post-intro]').find('[data-scroll-item]').each(function(i, el) {
          return items.push({
            $el: $(el)
          });
        });
        if (items.length) {
          return _this.NC().appView.scrollItemInView.showItems(items);
        }
      };
    })(this));
    return null;
  };

  ProjectPageView.prototype.showTitle = function() {
    WordTransitioner["in"](this.$heading);
    return null;
  };

  return ProjectPageView;

})(AbstractViewPage);

module.exports = ProjectPageView;



},{"../../../AppView":4,"../../../utils/MediaQueries":20,"../../../utils/Scroller":23,"../../../utils/WordTransitioner":24,"../../AbstractViewPage":26}],37:[function(require,module,exports){
var AbstractViewPage, WordTransitioner, WorkPageView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../../AbstractViewPage');

WordTransitioner = require('../../../utils/WordTransitioner');

WorkPageView = (function(_super) {
  __extends(WorkPageView, _super);

  WorkPageView.prototype.template = 'page-work';

  WorkPageView.prototype.pageSize = 10000;

  function WorkPageView() {
    this.show = __bind(this.show, this);
    WorkPageView.__super__.constructor.apply(this, arguments);
    return null;
  }

  WorkPageView.prototype.show = function() {
    WorkPageView.__super__.show.apply(this, arguments);
    return null;
  };

  return WorkPageView;

})(AbstractViewPage);

module.exports = WorkPageView;



},{"../../../utils/WordTransitioner":24,"../../AbstractViewPage":26}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9NYWluLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9BcHBEYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL0FwcFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvY29sbGVjdGlvbnMvQWJzdHJhY3RDb2xsZWN0aW9uLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL2NvbGxlY3Rpb25zL2NvcmUvVGVtcGxhdGVzQ29sbGVjdGlvbi5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9jb2xsZWN0aW9ucy9pbWFnZXMvTGF6eUltYWdlQ29sbGVjdGlvbi5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9jb2xsZWN0aW9ucy90YWdsaW5lcy9Ib21lVGFnbGluZXNDb2xsZWN0aW9uLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL2RhdGEvQVBJLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL2RhdGEvQWJzdHJhY3REYXRhLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL2RhdGEvVGVtcGxhdGVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL21vZGVscy9BYnN0cmFjdE1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL21vZGVscy9jb3JlL0FQSVJvdXRlTW9kZWwuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvbW9kZWxzL2NvcmUvVGVtcGxhdGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS9tb2RlbHMvaW1hZ2VzL0xhenlJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL21vZGVscy90YWdsaW5lcy9Ib21lVGFnbGluZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3JvdXRlci9OYXYuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvcm91dGVyL1JvdXRlci5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS91dGlscy9MYXp5SW1hZ2VMb2FkZXIuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdXRpbHMvTWVkaWFRdWVyaWVzLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL1JlcXVlc3Rlci5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS91dGlscy9TY3JvbGxJdGVtSW5WaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL1Njcm9sbGVyLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3V0aWxzL1dvcmRUcmFuc2l0aW9uZXIuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9BYnN0cmFjdFZpZXcuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9BYnN0cmFjdFZpZXdQYWdlLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvYmFzZS9IZWFkZXIuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9iYXNlL1ByZWxvYWRlci5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L2Jhc2UvV3JhcHBlci5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L21vZGFscy9BYnN0cmFjdE1vZGFsLmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvbW9kYWxzL09yaWVudGF0aW9uTW9kYWwuY29mZmVlIiwiL1VzZXJzL25laWxjYXJwZW50ZXIvU2l0ZXMvbmVpbC12Mi9wcm90b3R5cGVzL3BpeGkvcHJvamVjdC9jb2ZmZWUvdmlldy9tb2RhbHMvX01vZGFsTWFuYWdlci5jb2ZmZWUiLCIvVXNlcnMvbmVpbGNhcnBlbnRlci9TaXRlcy9uZWlsLXYyL3Byb3RvdHlwZXMvcGl4aS9wcm9qZWN0L2NvZmZlZS92aWV3L3BhZ2VzL2Fib3V0UGFnZS9BYm91dFBhZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvcGFnZXMvY29udGFjdFBhZ2UvQ29udGFjdFBhZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvcGFnZXMvaG9tZVBhZ2UvSG9tZVBhZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvcGFnZXMvcHJvamVjdFBhZ2UvUHJvamVjdFBhZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9uZWlsY2FycGVudGVyL1NpdGVzL25laWwtdjIvcHJvdG90eXBlcy9waXhpL3Byb2plY3QvY29mZmVlL3ZpZXcvcGFnZXMvd29ya1BhZ2UvV29ya1BhZ2VWaWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsOEJBQUE7O0FBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFLQTtBQUFBOzs7R0FMQTs7QUFBQSxPQVdBLEdBQWEsS0FYYixDQUFBOztBQUFBLFVBWUEsR0FBYSxjQUFjLENBQUMsSUFBZixDQUFvQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQXBDLENBWmIsQ0FBQTs7QUFBQSxJQWVBLEdBQVUsT0FBSCxHQUFnQixFQUFoQixHQUF5QixNQUFBLElBQVUsUUFmMUMsQ0FBQTs7QUFpQkEsSUFBRyxVQUFIO0FBQ0MsRUFBQSxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQXpCLElBQXNDLGFBQXRDLENBREQ7Q0FBQSxNQUFBO0FBSUMsRUFBQSxJQUFJLENBQUMsRUFBTCxHQUFjLElBQUEsR0FBQSxDQUFJLE9BQUosQ0FBZCxDQUFBO0FBQUEsRUFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQVIsQ0FBQSxDQURBLENBSkQ7Q0FqQkE7Ozs7O0FDQUEsSUFBQSwyREFBQTtFQUFBLGtGQUFBOztBQUFBLFNBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZixDQUFBOztBQUFBLE1BQ0EsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEdBRUEsR0FBZSxPQUFBLENBQVEsY0FBUixDQUZmLENBQUE7O0FBQUEsT0FHQSxHQUFlLE9BQUEsQ0FBUSxXQUFSLENBSGYsQ0FBQTs7QUFBQSxPQUlBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FKZixDQUFBOztBQUFBLFlBS0EsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FMZixDQUFBOztBQUFBO0FBU0ksZ0JBQUEsSUFBQSxHQUFrQixJQUFsQixDQUFBOztB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QSxHQUFPLFNBQUEsR0FBQTtBQUVOLElBQUEsd0NBQUEsU0FBQSxDQUFBLENBQUE7V0FJQSxLQU5NO0VBQUEsQ0FWUCxDQUFBOztzQkFBQTs7R0FGMEIsaUJBSDNCLENBQUE7O0FBQUEsTUF1Qk0sQ0FBQyxPQUFQLEdBQWlCLFlBdkJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xuXG4jIFBST0RVQ1RJT04gRU5WSVJPTk1FTlQgLSBtYXkgd2FudCB0byB1c2Ugc2VydmVyLXNldCB2YXJpYWJsZXMgaGVyZVxuIyBJU19MSVZFID0gZG8gLT4gcmV0dXJuIGlmIHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID4gLTEgb3Igd2luZG93LmxvY2F0aW9uLnNlYXJjaCBpcyAnP2QnIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cbiMjI1xuXG5XSVAgLSB0aGlzIHdpbGwgaWRlYWxseSBjaGFuZ2UgdG8gb2xkIGZvcm1hdCAoYWJvdmUpIHdoZW4gY2FuIGZpZ3VyZSBpdCBvdXRcblxuIyMjXG5cbklTX0xJVkUgICAgPSBmYWxzZVxuSVNfUFJFVklFVyA9IC9wcmV2aWV3PXRydWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLnNlYXJjaClcblxuIyBPTkxZIEVYUE9TRSBBUFAgR0xPQkFMTFkgSUYgTE9DQUwgT1IgREVWJ0lOR1xudmlldyA9IGlmIElTX0xJVkUgdGhlbiB7fSBlbHNlICh3aW5kb3cgb3IgZG9jdW1lbnQpXG5cbmlmIElTX1BSRVZJRVdcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIElTX1BSRVZJRVcnXG5lbHNlXG5cdCMgREVDTEFSRSBNQUlOIEFQUExJQ0FUSU9OXG5cdHZpZXcuTkMgPSBuZXcgQXBwIElTX0xJVkVcblx0dmlldy5OQy5pbml0KClcbiIsIlRlbXBsYXRlcyAgICA9IHJlcXVpcmUgJy4vZGF0YS9UZW1wbGF0ZXMnXG5Sb3V0ZXIgICAgICAgPSByZXF1aXJlICcuL3JvdXRlci9Sb3V0ZXInXG5OYXYgICAgICAgICAgPSByZXF1aXJlICcuL3JvdXRlci9OYXYnXG5BcHBEYXRhICAgICAgPSByZXF1aXJlICcuL0FwcERhdGEnXG5BcHBWaWV3ICAgICAgPSByZXF1aXJlICcuL0FwcFZpZXcnXG5NZWRpYVF1ZXJpZXMgPSByZXF1aXJlICcuL3V0aWxzL01lZGlhUXVlcmllcydcblxuY2xhc3MgQXBwXG5cbiAgICBMSVZFICAgICAgICAgICAgOiBudWxsXG4gICAgQkFTRV9QQVRIICAgICAgIDogd2luZG93LmNvbmZpZy5iYXNlX3BhdGhcbiAgICBCQVNFX1VSTCAgICAgICAgOiB3aW5kb3cuY29uZmlnLmJhc2VfdXJsXG4gICAgQkFTRV9VUkxfQVNTRVRTIDogd2luZG93LmNvbmZpZy5iYXNlX3VybF9hc3NldHNcbiAgICBvYmpSZWFkeSAgICAgICAgOiAwXG5cbiAgICBfdG9DbGVhbiAgIDogWydvYmpSZWFkeScsICdzZXRGbGFncycsICdvYmplY3RDb21wbGV0ZScsICdpbml0JywgJ2luaXRPYmplY3RzJywgJ2luaXRTREtzJywgJ2luaXRBcHAnLCAnZ28nLCAnY2xlYW51cCcsICdfdG9DbGVhbiddXG5cbiAgICBjb25zdHJ1Y3RvciA6IChATElWRSkgLT5cblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgc2V0RmxhZ3MgOiA9PlxuXG4gICAgICAgIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5zZXR1cCgpO1xuXG4gICAgICAgICMgQElTX0FORFJPSUQgICAgPSB1YS5pbmRleE9mKCdhbmRyb2lkJykgPiAtMVxuICAgICAgICAjIEBJU19GSVJFRk9YICAgID0gdWEuaW5kZXhPZignZmlyZWZveCcpID4gLTFcbiAgICAgICAgIyBASVNfQ0hST01FX0lPUyA9IGlmIHVhLm1hdGNoKCdjcmlvcycpIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM4MDgwNTNcblxuICAgICAgICBudWxsXG5cbiAgICBvYmplY3RDb21wbGV0ZSA6ID0+XG5cbiAgICAgICAgQG9ialJlYWR5KytcbiAgICAgICAgQGluaXRBcHAoKSBpZiBAb2JqUmVhZHkgPj0gMVxuXG4gICAgICAgIG51bGxcblxuICAgIGluaXQgOiA9PlxuXG4gICAgICAgICMgY3VycmVudGx5IG5vIG9iamVjdHMgdG8gbG9hZCBoZXJlLCBzbyBqdXN0IHN0YXJ0IGFwcFxuICAgICAgICAjIEBpbml0T2JqZWN0cygpXG5cbiAgICAgICAgQGluaXRBcHAoKVxuXG4gICAgICAgIG51bGxcblxuICAgICMgaW5pdE9iamVjdHMgOiA9PlxuXG4gICAgIyAgICAgQHRlbXBsYXRlcyA9IG5ldyBUZW1wbGF0ZXMgXCIje0BCQVNFX1VSTF9BU1NFVFN9L2RhdGEvdGVtcGxhdGVzI3soaWYgQExJVkUgdGhlbiAnLm1pbicgZWxzZSAnJyl9LnhtbFwiLCBAb2JqZWN0Q29tcGxldGVcblxuICAgICMgICAgICMgaWYgbmV3IG9iamVjdHMgYXJlIGFkZGVkIGRvbid0IGZvcmdldCB0byBjaGFuZ2UgdGhlIGBAb2JqZWN0Q29tcGxldGVgIGZ1bmN0aW9uXG5cbiAgICAjICAgICBudWxsXG5cbiAgICBpbml0QXBwIDogPT5cblxuICAgICAgICBAc2V0RmxhZ3MoKVxuXG4gICAgICAgICMjIyBTdGFydHMgYXBwbGljYXRpb24gIyMjXG4gICAgICAgIEBhcHBEYXRhID0gbmV3IEFwcERhdGFcbiAgICAgICAgQGFwcFZpZXcgPSBuZXcgQXBwVmlld1xuICAgICAgICBAcm91dGVyICA9IG5ldyBSb3V0ZXJcbiAgICAgICAgQG5hdiAgICAgPSBuZXcgTmF2XG5cbiAgICAgICAgQGdvKClcblxuICAgICAgICBudWxsXG5cbiAgICBnbyA6ID0+XG5cbiAgICAgICAgIyMjIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBraWNrcyBvZmYgd2Vic2l0ZSAjIyNcbiAgICAgICAgQGFwcFZpZXcucmVuZGVyKClcblxuICAgICAgICAjIyMgcmVtb3ZlIHJlZHVuZGFudCBpbml0aWFsaXNhdGlvbiBtZXRob2RzIC8gcHJvcGVydGllcyAjIyNcbiAgICAgICAgQGNsZWFudXAoKVxuXG4gICAgICAgIG51bGxcblxuICAgIGNsZWFudXAgOiA9PlxuXG4gICAgICAgIGZvciBmbiBpbiBAX3RvQ2xlYW5cbiAgICAgICAgICAgIEBbZm5dID0gbnVsbFxuICAgICAgICAgICAgZGVsZXRlIEBbZm5dXG5cbiAgICAgICAgbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiQWJzdHJhY3REYXRhICAgICAgPSByZXF1aXJlICcuL2RhdGEvQWJzdHJhY3REYXRhJ1xuUmVxdWVzdGVyICAgICAgICAgPSByZXF1aXJlICcuL3V0aWxzL1JlcXVlc3RlcidcbkFQSSAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9kYXRhL0FQSSdcblxuY2xhc3MgQXBwRGF0YSBleHRlbmRzIEFic3RyYWN0RGF0YVxuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcERhdGFcbiIsIkFic3RyYWN0VmlldyAgICAgPSByZXF1aXJlICcuL3ZpZXcvQWJzdHJhY3RWaWV3J1xuUHJlbG9hZGVyICAgICAgICA9IHJlcXVpcmUgJy4vdmlldy9iYXNlL1ByZWxvYWRlcidcbkhlYWRlciAgICAgICAgICAgPSByZXF1aXJlICcuL3ZpZXcvYmFzZS9IZWFkZXInXG5XcmFwcGVyICAgICAgICAgID0gcmVxdWlyZSAnLi92aWV3L2Jhc2UvV3JhcHBlcidcbk1vZGFsTWFuYWdlciAgICAgPSByZXF1aXJlICcuL3ZpZXcvbW9kYWxzL19Nb2RhbE1hbmFnZXInXG5NZWRpYVF1ZXJpZXMgICAgID0gcmVxdWlyZSAnLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5TY3JvbGxlciAgICAgICAgID0gcmVxdWlyZSAnLi91dGlscy9TY3JvbGxlcidcblNjcm9sbEl0ZW1JblZpZXcgPSByZXF1aXJlICcuL3V0aWxzL1Njcm9sbEl0ZW1JblZpZXcnXG5MYXp5SW1hZ2VMb2FkZXIgID0gcmVxdWlyZSAnLi91dGlscy9MYXp5SW1hZ2VMb2FkZXInXG5cbmNsYXNzIEFwcFZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuICAgIHRlbXBsYXRlIDogJ21haW4nXG5cbiAgICAkd2luZG93ICA6IG51bGxcbiAgICAkYm9keSAgICA6IG51bGxcblxuICAgIHdyYXBwZXIgIDogbnVsbFxuXG4gICAgZGltcyA6XG4gICAgICAgIHcgOiBudWxsXG4gICAgICAgIGggOiBudWxsXG4gICAgICAgIG8gOiBudWxsXG4gICAgICAgIGMgOiBudWxsXG4gICAgICAgIHIgOiBudWxsXG5cbiAgICByd2RTaXplcyA6XG4gICAgICAgIExBUkdFICA6ICdMUkcnXG4gICAgICAgIE1FRElVTSA6ICdNRUQnXG4gICAgICAgIFNNQUxMICA6ICdTTUwnXG5cbiAgICBsYXN0U2Nyb2xsWSA6IDBcbiAgICB0aWNraW5nICAgICA6IGZhbHNlXG5cbiAgICBFVkVOVF9VUERBVEVfRElNRU5TSU9OUyA6ICdFVkVOVF9VUERBVEVfRElNRU5TSU9OUydcbiAgICBFVkVOVF9PTl9TQ1JPTEwgICAgICAgICA6ICdFVkVOVF9PTl9TQ1JPTEwnXG5cbiAgICBNT0JJTEVfV0lEVEggOiA3MDBcbiAgICBNT0JJTEUgICAgICAgOiAnbW9iaWxlJ1xuICAgIE5PTl9NT0JJTEUgICA6ICdub25fbW9iaWxlJ1xuXG4gICAgY29uc3RydWN0b3IgOiAtPlxuXG4gICAgICAgIEAkd2luZG93ID0gJCh3aW5kb3cpXG4gICAgICAgIEAkYm9keSAgID0gJCgnYm9keScpLmVxKDApXG5cbiAgICAgICAgIyB0aGVzZSwgcmF0aGVyIHRoYW4gY2FsbGluZyBzdXBlclxuICAgICAgICBAc2V0RWxlbWVudCBAJGJvZHkuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuICAgICAgICBAY2hpbGRyZW4gPSBbXVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICBkaXNhYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub24gJ3RvdWNobW92ZScsIEBvblRvdWNoTW92ZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZW5hYmxlVG91Y2g6ID0+XG5cbiAgICAgICAgQCR3aW5kb3cub2ZmICd0b3VjaG1vdmUnLCBAb25Ub3VjaE1vdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uVG91Y2hNb3ZlOiAoIGUgKSAtPlxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmVuZGVyIDogPT5cblxuICAgICAgICBAYmluZEV2ZW50cygpXG5cbiAgICAgICAgQHByZWxvYWRlciAgICAgICAgPSBuZXcgUHJlbG9hZGVyKCdzaXRlJywgQCRib2R5LmZpbmQoJyNwcmVsb2FkZXInKSlcbiAgICAgICAgQG1vZGFsTWFuYWdlciAgICAgPSBuZXcgTW9kYWxNYW5hZ2VyXG4gICAgICAgIEBzY3JvbGxJdGVtSW5WaWV3ID0gbmV3IFNjcm9sbEl0ZW1JblZpZXdcbiAgICAgICAgQGxhenlJbWFnZUxvYWRlciAgPSBuZXcgTGF6eUltYWdlTG9hZGVyXG5cbiAgICAgICAgQGhlYWRlciAgPSBuZXcgSGVhZGVyXG4gICAgICAgIEB3cmFwcGVyID0gbmV3IFdyYXBwZXJcblxuICAgICAgICBAXG4gICAgICAgICAgICAuYWRkQ2hpbGQgQGhlYWRlclxuICAgICAgICAgICAgLmFkZENoaWxkIEB3cmFwcGVyXG5cbiAgICAgICAgQG9uQWxsUmVuZGVyZWQoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgYmluZEV2ZW50cyA6ID0+XG5cbiAgICAgICAgQG9uICdhbGxSZW5kZXJlZCcsIEBvbkFsbFJlbmRlcmVkXG5cbiAgICAgICAgQG9uUmVzaXplKClcblxuICAgICAgICBAb25SZXNpemUgPSBfLmRlYm91bmNlIEBvblJlc2l6ZSwgMzAwXG4gICAgICAgIEAkd2luZG93Lm9uICdyZXNpemUgb3JpZW50YXRpb25jaGFuZ2UnLCBAb25SZXNpemVcbiAgICAgICAgQCR3aW5kb3cub24gXCJzY3JvbGxcIiwgQG9uU2Nyb2xsXG5cbiAgICAgICAgQCRib2R5Lm9uICdjbGljaycsICdhJywgQGxpbmtNYW5hZ2VyXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblNjcm9sbCA6ID0+XG5cbiAgICAgICAgQGxhc3RTY3JvbGxZID0gd2luZG93LnNjcm9sbFlcbiAgICAgICAgQHJlcXVlc3RUaWNrKClcblxuICAgICAgICBudWxsXG5cbiAgICByZXF1ZXN0VGljayA6ID0+XG5cbiAgICAgICAgaWYgIUB0aWNraW5nXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQHNjcm9sbFVwZGF0ZVxuICAgICAgICAgICAgQHRpY2tpbmcgPSB0cnVlXG5cbiAgICAgICAgbnVsbFxuXG4gICAgc2Nyb2xsVXBkYXRlIDogPT5cblxuICAgICAgICBAdGlja2luZyA9IGZhbHNlXG5cbiAgICAgICAgQCRib2R5LmFkZENsYXNzKCdkaXNhYmxlLWhvdmVyJylcblxuICAgICAgICBjbGVhclRpbWVvdXQgQHRpbWVyU2Nyb2xsXG5cbiAgICAgICAgQHRpbWVyU2Nyb2xsID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgQCRib2R5LnJlbW92ZUNsYXNzKCdkaXNhYmxlLWhvdmVyJylcbiAgICAgICAgLCA1MFxuXG4gICAgICAgIEB0cmlnZ2VyIEFwcFZpZXcuRVZFTlRfT05fU0NST0xMXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb25BbGxSZW5kZXJlZCA6ID0+XG5cbiAgICAgICAgIyBjb25zb2xlLmxvZyBcIm9uQWxsUmVuZGVyZWQgOiA9PlwiXG4gICAgICAgIEBiZWdpbigpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgYmVnaW4gOiA9PlxuXG4gICAgICAgIEB0cmlnZ2VyICdzdGFydCdcblxuICAgICAgICBATkMoKS5yb3V0ZXIuc3RhcnQoKVxuXG4gICAgICAgIEB1cGRhdGVNZWRpYVF1ZXJpZXNMb2coKVxuXG4gICAgICAgIEBwcmVsb2FkZXIuZmlyc3RIaWRlID0+XG5cbiAgICAgICAgICAgIEBoZWFkZXIuYW5pbWF0ZUluKClcbiAgICAgICAgICAgIEBsYXp5SW1hZ2VMb2FkZXIub25WaWV3VXBkYXRlZCgpXG4gICAgICAgICAgICBAc2Nyb2xsSXRlbUluVmlldy5nZXRJdGVtcygpXG4gICAgICAgICAgICBAb25TY3JvbGwoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25SZXNpemUgOiA9PlxuXG4gICAgICAgIEBnZXREaW1zKClcbiAgICAgICAgQHVwZGF0ZU1lZGlhUXVlcmllc0xvZygpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICB1cGRhdGVNZWRpYVF1ZXJpZXNMb2cgOiA9PlxuXG4gICAgICAgIGlmIEBoZWFkZXIgdGhlbiBAaGVhZGVyLiRlbC5maW5kKFwiLmJyZWFrcG9pbnRcIikuaHRtbCBcIjxkaXYgY2xhc3M9J2wnPkNVUlJFTlQgQlJFQUtQT0lOVDo8L2Rpdj48ZGl2IGNsYXNzPSdiJz4je01lZGlhUXVlcmllcy5nZXRCcmVha3BvaW50KCl9PC9kaXY+XCJcbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXREaW1zIDogPT5cblxuICAgICAgICB3ID0gd2luZG93LmlubmVyV2lkdGggb3IgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIG9yIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGhcbiAgICAgICAgaCA9IHdpbmRvdy5pbm5lckhlaWdodCBvciBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IG9yIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XG5cbiAgICAgICAgQGRpbXMgPVxuICAgICAgICAgICAgdyA6IHdcbiAgICAgICAgICAgIGggOiBoXG4gICAgICAgICAgICBvIDogaWYgaCA+IHcgdGhlbiAncG9ydHJhaXQnIGVsc2UgJ2xhbmRzY2FwZSdcbiAgICAgICAgICAgIGMgOiBpZiB3IDw9IEBNT0JJTEVfV0lEVEggdGhlbiBATU9CSUxFIGVsc2UgQE5PTl9NT0JJTEVcbiAgICAgICAgICAgIHIgOiBAZ2V0UndkU2l6ZSB3LCBoLCAod2luZG93LmRldmljZVBpeGVsUmF0aW8gb3IgMSlcblxuICAgICAgICBAdHJpZ2dlciBARVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBkaW1zXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBnZXRSd2RTaXplIDogKHcsIGgsIGRwcikgPT5cblxuICAgICAgICBwdyA9IHcqZHByXG5cbiAgICAgICAgc2l6ZSA9IHN3aXRjaCB0cnVlXG4gICAgICAgICAgICB3aGVuIHB3ID4gMTQ0MCB0aGVuIEByd2RTaXplcy5MQVJHRVxuICAgICAgICAgICAgd2hlbiBwdyA8IDY1MCB0aGVuIEByd2RTaXplcy5TTUFMTFxuICAgICAgICAgICAgZWxzZSBAcndkU2l6ZXMuTUVESVVNXG5cbiAgICAgICAgc2l6ZVxuXG4gICAgbGlua01hbmFnZXIgOiAoZSkgPT5cblxuICAgICAgICBocmVmID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKVxuXG4gICAgICAgIGlmIGhyZWYgdGhlbiBAbmF2aWdhdGVUb1VybCBocmVmLCBlXG5cbiAgICAgICAgbnVsbFxuXG4gICAgbmF2aWdhdGVUb1VybCA6ICggaHJlZiwgZSA9IG51bGwgKSA9PlxuXG4gICAgICAgIHJvdXRlICAgPSBpZiBocmVmLm1hdGNoKEBOQygpLkJBU0VfVVJMKSB0aGVuIGhyZWYuc3BsaXQoQE5DKCkuQkFTRV9VUkwpWzFdIGVsc2UgaHJlZlxuICAgICAgICBzZWN0aW9uID0gaWYgcm91dGUuaW5kZXhPZignLycpIGlzIDAgdGhlbiByb3V0ZS5zcGxpdCgnLycpWzFdIGVsc2Ugcm91dGVcblxuICAgICAgICBjb25zb2xlLmxvZyBcInJvdXRlLCBzZWN0aW9uXCJcbiAgICAgICAgY29uc29sZS5sb2cgcm91dGUsIHNlY3Rpb25cblxuICAgICAgICBpZiBATkMoKS5uYXYuZ2V0U2VjdGlvbiBzZWN0aW9uXG4gICAgICAgICAgICBlPy5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBATkMoKS5yb3V0ZXIubmF2aWdhdGVUbyByb3V0ZVxuICAgICAgICBlbHNlIFxuICAgICAgICAgICAgQGhhbmRsZUV4dGVybmFsTGluayBocmVmXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBoYW5kbGVFeHRlcm5hbExpbmsgOiAoZGF0YSkgPT4gXG5cbiAgICAgICAgIyMjXG5cbiAgICAgICAgYmluZCB0cmFja2luZyBldmVudHMgaWYgbmVjZXNzYXJ5XG5cbiAgICAgICAgIyMjXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICB0cmFja1BhZ2VWaWV3IDogPT5cblxuICAgICAgICByZXR1cm4gdW5sZXNzIHdpbmRvdy5nYVxuXG4gICAgICAgIGdhICdzZW5kJywgJ3BhZ2V2aWV3JywgJ3BhZ2UnIDogd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoQE5DKCkuQkFTRV9VUkwpWzFdIG9yICcvJ1xuXG4gICAgICAgIG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3XG4iLCJjbGFzcyBBYnN0cmFjdENvbGxlY3Rpb24gZXh0ZW5kcyBCYWNrYm9uZS5Db2xsZWN0aW9uXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0Q29sbGVjdGlvblxuIiwiVGVtcGxhdGVNb2RlbCA9IHJlcXVpcmUgJy4uLy4uL21vZGVscy9jb3JlL1RlbXBsYXRlTW9kZWwnXG5cbmNsYXNzIFRlbXBsYXRlc0NvbGxlY3Rpb24gZXh0ZW5kcyBCYWNrYm9uZS5Db2xsZWN0aW9uXG5cblx0bW9kZWwgOiBUZW1wbGF0ZU1vZGVsXG5cbm1vZHVsZS5leHBvcnRzID0gVGVtcGxhdGVzQ29sbGVjdGlvblxuIiwiQWJzdHJhY3RDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RDb2xsZWN0aW9uJ1xuTGF6eUltYWdlTW9kZWwgICAgID0gcmVxdWlyZSAnLi4vLi4vbW9kZWxzL2ltYWdlcy9MYXp5SW1hZ2VNb2RlbCdcblxuY2xhc3MgTGF6eUltYWdlQ29sbGVjdGlvbiBleHRlbmRzIEFic3RyYWN0Q29sbGVjdGlvblxuXG5cdG1vZGVsIDogTGF6eUltYWdlTW9kZWxcblxuXHRhZGRJbWFnZSA6IChpbWdUb0FkZCkgPT5cblxuXHRcdGV4aXN0aW5nUmVmID0gQGZpbmRXaGVyZSBzcmMgOiBpbWdUb0FkZC5zcmNcblxuXHRcdGlmIGV4aXN0aW5nUmVmXG5cdFx0XHRleGlzdGluZ1JlZi5hZGRFbCBpbWdUb0FkZC4kZWxcblx0XHRlbHNlXG5cdFx0XHRAYWRkIHNyYyA6IGltZ1RvQWRkLnNyYywgJGVscyA6IFtpbWdUb0FkZC4kZWxdXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gTGF6eUltYWdlQ29sbGVjdGlvblxuIiwiQWJzdHJhY3RDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RDb2xsZWN0aW9uJ1xuSG9tZVRhZ2xpbmVNb2RlbCAgID0gcmVxdWlyZSAnLi4vLi4vbW9kZWxzL3RhZ2xpbmVzL0hvbWVUYWdsaW5lTW9kZWwnXG5cbmNsYXNzIEhvbWVUYWdsaW5lc0NvbGxlY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdENvbGxlY3Rpb25cblxuXHRtb2RlbCA6IEhvbWVUYWdsaW5lTW9kZWxcblxuXHRjdXJyZW50IDogMFxuXG5cdGdldE5leHQgOiA9PlxuXG5cdFx0aWYgQGN1cnJlbnQgaXMgQGxlbmd0aC0xXG5cdFx0XHRAY3VycmVudCA9IDBcblx0XHRcdHJldHVybiBAZ2V0TmV4dCgpXG5cblx0XHRAY3VycmVudCsrXG5cblx0XHRyZXR1cm4gQGF0IEBjdXJyZW50XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVRhZ2xpbmVzQ29sbGVjdGlvblxuIiwiQVBJUm91dGVNb2RlbCA9IHJlcXVpcmUgJy4uL21vZGVscy9jb3JlL0FQSVJvdXRlTW9kZWwnXG5cbmNsYXNzIEFQSVxuXG5cdEBtb2RlbCA6IG5ldyBBUElSb3V0ZU1vZGVsXG5cblx0QGdldENvbnRhbnRzIDogPT5cblxuXHRcdCMjIyBhZGQgbW9yZSBpZiB3ZSB3YW5uYSB1c2UgaW4gQVBJIHN0cmluZ3MgIyMjXG5cdFx0QkFTRV9VUkwgOiBAUigpLkJBU0VfVVJMXG5cblx0QGdldCA6IChuYW1lLCB2YXJzKSA9PlxuXG5cdFx0dmFycyA9ICQuZXh0ZW5kIHRydWUsIHZhcnMsIEBnZXRDb250YW50cygpXG5cdFx0cmV0dXJuIEBzdXBwbGFudFN0cmluZyBAbW9kZWwuZ2V0KG5hbWUpLCB2YXJzXG5cblx0QHN1cHBsYW50U3RyaW5nIDogKHN0ciwgdmFscykgLT5cblxuXHRcdHJldHVybiBzdHIucmVwbGFjZSAve3sgKFtee31dKikgfX0vZywgKGEsIGIpIC0+XG5cdFx0XHRyID0gdmFsc1tiXSBvciBpZiB0eXBlb2YgdmFsc1tiXSBpcyAnbnVtYmVyJyB0aGVuIHZhbHNbYl0udG9TdHJpbmcoKSBlbHNlICcnXG5cdFx0KGlmIHR5cGVvZiByIGlzIFwic3RyaW5nXCIgb3IgdHlwZW9mIHIgaXMgXCJudW1iZXJcIiB0aGVuIHIgZWxzZSBhKVxuXG5cdEBOQyA6ID0+XG5cblx0XHRyZXR1cm4gd2luZG93Lk5DXG5cbm1vZHVsZS5leHBvcnRzID0gQVBJXG4iLCJjbGFzcyBBYnN0cmFjdERhdGFcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRfLmV4dGVuZCBALCBCYWNrYm9uZS5FdmVudHNcblxuXHRcdHJldHVybiBudWxsXG5cblx0TkMgOiA9PlxuXG5cdFx0cmV0dXJuIHdpbmRvdy5OQ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0RGF0YVxuIiwiVGVtcGxhdGVNb2RlbCAgICAgICA9IHJlcXVpcmUgJy4uL21vZGVscy9jb3JlL1RlbXBsYXRlTW9kZWwnXG5UZW1wbGF0ZXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vY29sbGVjdGlvbnMvY29yZS9UZW1wbGF0ZXNDb2xsZWN0aW9uJ1xuXG5jbGFzcyBUZW1wbGF0ZXNcblxuICAgIHRlbXBsYXRlcyA6IG51bGxcbiAgICBjYiAgICAgICAgOiBudWxsXG5cbiAgICBjb25zdHJ1Y3RvciA6ICh0ZW1wbGF0ZXMsIGNhbGxiYWNrKSAtPlxuXG4gICAgICAgIEBjYiA9IGNhbGxiYWNrXG5cbiAgICAgICAgJC5hamF4IHVybCA6IHRlbXBsYXRlcywgc3VjY2VzcyA6IEBwYXJzZVhNTFxuICAgICAgICAgICBcbiAgICAgICAgbnVsbFxuXG4gICAgcGFyc2VYTUwgOiAoZGF0YSkgPT5cblxuICAgICAgICB0ZW1wID0gW11cblxuICAgICAgICAkKGRhdGEpLmZpbmQoJ3RlbXBsYXRlJykuZWFjaCAoa2V5LCB2YWx1ZSkgLT5cbiAgICAgICAgICAgICR2YWx1ZSA9ICQodmFsdWUpXG4gICAgICAgICAgICB0ZW1wLnB1c2ggbmV3IFRlbXBsYXRlTW9kZWxcbiAgICAgICAgICAgICAgICBpZCAgIDogJHZhbHVlLmF0dHIoJ2lkJykudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIHRleHQgOiAkLnRyaW0gJHZhbHVlLnRleHQoKVxuXG4gICAgICAgIEB0ZW1wbGF0ZXMgPSBuZXcgVGVtcGxhdGVzQ29sbGVjdGlvbiB0ZW1wXG5cbiAgICAgICAgQGNiPygpXG4gICAgICAgIFxuICAgICAgICBudWxsICAgICAgICBcblxuICAgIGdldCA6IChpZCkgPT5cblxuICAgICAgICB0ID0gQHRlbXBsYXRlcy53aGVyZSBpZCA6IGlkXG4gICAgICAgIHQgPSB0WzBdLmdldCAndGV4dCdcbiAgICAgICAgXG4gICAgICAgIHJldHVybiAkLnRyaW0gdFxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlbXBsYXRlc1xuIiwiY2xhc3MgQWJzdHJhY3RNb2RlbCBleHRlbmRzIEJhY2tib25lLkRlZXBNb2RlbFxuXG5cdGNvbnN0cnVjdG9yIDogKGF0dHJzLCBvcHRpb24pIC0+XG5cblx0XHRhdHRycyA9IEBfZmlsdGVyQXR0cnMgYXR0cnNcblxuXHRcdHJldHVybiBCYWNrYm9uZS5EZWVwTW9kZWwuYXBwbHkgQCwgYXJndW1lbnRzXG5cblx0c2V0IDogKGF0dHJzLCBvcHRpb25zKSAtPlxuXG5cdFx0b3B0aW9ucyBvciAob3B0aW9ucyA9IHt9KVxuXG5cdFx0YXR0cnMgPSBAX2ZpbHRlckF0dHJzIGF0dHJzXG5cblx0XHRvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeSBhdHRyc1xuXG5cdFx0cmV0dXJuIEJhY2tib25lLkRlZXBNb2RlbC5wcm90b3R5cGUuc2V0LmNhbGwgQCwgYXR0cnMsIG9wdGlvbnNcblxuXHRfZmlsdGVyQXR0cnMgOiAoYXR0cnMpID0+XG5cblx0XHRhdHRyc1xuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdE1vZGVsXG4iLCJjbGFzcyBBUElSb3V0ZU1vZGVsIGV4dGVuZHMgQmFja2JvbmUuRGVlcE1vZGVsXG5cbiAgICBkZWZhdWx0cyA6XG5cbiAgICAgICAgc3RhcnQgICAgICAgICA6IFwiXCIgIyBFZzogXCJ7eyBCQVNFX1VSTCB9fS9hcGkvc3RhcnRcIlxuXG4gICAgICAgIGxvY2FsZSAgICAgICAgOiBcIlwiICMgRWc6IFwie3sgQkFTRV9VUkwgfX0vYXBpL2wxMG4ve3sgY29kZSB9fVwiXG5cbiAgICAgICAgdXNlciAgICAgICAgICA6XG4gICAgICAgICAgICBsb2dpbiAgICAgIDogXCJ7eyBCQVNFX1VSTCB9fS9hcGkvdXNlci9sb2dpblwiXG4gICAgICAgICAgICByZWdpc3RlciAgIDogXCJ7eyBCQVNFX1VSTCB9fS9hcGkvdXNlci9yZWdpc3RlclwiXG4gICAgICAgICAgICBwYXNzd29yZCAgIDogXCJ7eyBCQVNFX1VSTCB9fS9hcGkvdXNlci9wYXNzd29yZFwiXG4gICAgICAgICAgICB1cGRhdGUgICAgIDogXCJ7eyBCQVNFX1VSTCB9fS9hcGkvdXNlci91cGRhdGVcIlxuICAgICAgICAgICAgbG9nb3V0ICAgICA6IFwie3sgQkFTRV9VUkwgfX0vYXBpL3VzZXIvbG9nb3V0XCJcbiAgICAgICAgICAgIHJlbW92ZSAgICAgOiBcInt7IEJBU0VfVVJMIH19L2FwaS91c2VyL3JlbW92ZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gQVBJUm91dGVNb2RlbFxuIiwiY2xhc3MgVGVtcGxhdGVNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsXG5cblx0ZGVmYXVsdHMgOiBcblxuXHRcdGlkICAgOiBcIlwiXG5cdFx0dGV4dCA6IFwiXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZW1wbGF0ZU1vZGVsXG4iLCJBYnN0cmFjdE1vZGVsID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RNb2RlbCdcblxuY2xhc3MgTGF6eUltYWdlTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbFxuXG5cdEBzdGF0ZXMgOiBcblx0XHRMT0FERUQgICA6ICdMT0FERUQnXG5cdFx0UFJPR1JFU1MgOiAnUFJPR1JFU1MnXG5cblx0Y2xhc3NOYW1lcyA6XG5cdFx0TE9BREVEICAgOiAnbG9hZGVkJ1xuXHRcdEJHX0lNQUdFIDogJ2JnLWltYWdlJ1xuXG5cdGRlZmF1bHRzIDpcblx0XHRzcmMgICAgICA6IFwiXCJcblx0XHQkZWxzICAgICA6IFtdXG5cdFx0c3RhdGUgICAgOiBcIlwiXG5cdFx0cHJvZ3Jlc3MgOiAwXG5cdFx0Y2FuU2hvdyAgOiBmYWxzZVxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdHN1cGVyXG5cblx0XHRAc3RhcnQoKVxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRzdGFydCA6ID0+XG5cblx0XHQjIGlmICdGb3JtRGF0YScgb2Ygd2luZG93IHRoZW4gQF9sb2FkSW1hZ2VYSFIoKSBlbHNlIEBfbG9hZEltYWdlTm9YSFIoKVxuXHRcdEBfbG9hZEltYWdlTm9YSFIoKVxuXG5cdFx0bnVsbFxuXG5cdGFkZEVsIDogKCRlbCkgPT5cblxuXHRcdCRlbHMgPSBAZ2V0KCckZWxzJylcblx0XHQkZWxzLnB1c2ggJGVsXG5cdFx0QHNldCAnJGVscycsICRlbHNcblxuXHRcdG51bGxcblxuXHRfbG9hZEltYWdlTm9YSFIgOiA9PlxuXG5cdFx0aSA9IG5ldyBJbWFnZVxuXHRcdGkub25sb2FkID0gaS5vbmFib3J0ID0gaS5vbmVycm9yID0gQG9uTG9hZENvbXBsZXRlXG5cdFx0aS5zcmMgPSBAZ2V0KCdzcmMnKVxuXG5cdFx0bnVsbFxuXG5cdF9sb2FkSW1hZ2VYSFIgOiA9PlxuXG5cdFx0Y29uc29sZS5sb2cgXCJMT0FESU5HIFwiLCBAZ2V0KCdzcmMnKVxuXG5cdFx0ciA9ICQuYWpheFxuXHRcdFx0dHlwZSA6ICdHRVQnXG5cdFx0XHR1cmwgIDogQGdldCgnc3JjJylcblx0XHRcdHhociAgOiA9PlxuXHRcdFx0XHR4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcblx0XHRcdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIgXCJwcm9ncmVzc1wiLCAoZXZ0KSA9PlxuXHRcdFx0XHRcdEBvbkxvYWRQcm9ncmVzcyBldnRcblx0XHRcdFx0LCBmYWxzZVxuXHRcdFx0XHRyZXR1cm4geGhyXG5cblx0XHRyLmRvbmUgQG9uTG9hZENvbXBsZXRlXG5cdFx0ci5mYWlsIEBvbkxvYWRGYWlsXG5cblx0XHRudWxsXG5cblx0b25Mb2FkUHJvZ3Jlc3MgOiAoZXZ0KSA9PlxuXG5cdFx0QHNldCAnc3RhdGUnLCBMYXp5SW1hZ2VNb2RlbC5zdGF0ZXMuUFJPR1JFU1NcblxuXHRcdGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSlcblxuXHRcdFx0cGVyY2VudENvbXBsZXRlID0gKGV2dC5sb2FkZWQgLyBldnQudG90YWwpICogMTAwXG5cblx0XHQjIGNvbnNvbGUubG9nIFwicGVyY2VudENvbXBsZXRlIC0gI3twZXJjZW50Q29tcGxldGV9JSBmb3IgI3tAZ2V0KCdzcmMnKX1cIlxuXG5cdFx0bnVsbFxuXG5cdG9uTG9hZENvbXBsZXRlIDogKHJlcykgPT5cblxuXHRcdEBzZXQgJ3N0YXRlJywgTGF6eUltYWdlTW9kZWwuc3RhdGVzLkxPQURFRFxuXG5cdFx0IyBjb25zb2xlLmxvZyBcIm9uTG9hZENvbXBsZXRlIDogKHJlcykgPT5cIiwgQGdldCgnc3JjJylcblxuXHRcdGlmIEBnZXQoJ2NhblNob3cnKSB0aGVuIEBhbmltSW4oKVxuXG5cdFx0bnVsbFxuXG5cdG9uTG9hZEZhaWwgOiAocmVzKSA9PlxuXG5cdFx0Y29uc29sZS5lcnJvciBcIm9uTG9hZEZhaWwgOiA9PlwiLCByZXNcblxuXHRcdG51bGxcblxuXHRzaG93IDogPT5cblxuXHRcdCMgY29uc29sZS5sb2cgXCJzaG93IDogPT5cIiwgQGdldCgnc3JjJylcblxuXHRcdEBzZXQgJ2NhblNob3cnLCB0cnVlXG5cblx0XHRpZiBAZ2V0KCdzdGF0ZScpIGlzIExhenlJbWFnZU1vZGVsLnN0YXRlcy5MT0FERUQgdGhlbiBAYW5pbUluKClcblxuXHRcdG51bGxcblxuXHRhbmltSW4gOiA9PlxuXG5cdFx0IyBjb25zb2xlLmxvZyBcImFuaW1JbiA6ID0+XCIsIEBnZXQoJ3NyYycpXG5cblx0XHRmb3IgJGVsIGluIEBnZXQoJyRlbHMnKVxuXHRcdFx0JGVsXG5cdFx0XHRcdC5maW5kKFwiLiN7QGNsYXNzTmFtZXMuQkdfSU1BR0V9XCIpXG5cdFx0XHRcdFx0LmNzcygnYmFja2dyb3VuZC1pbWFnZScsIFwidXJsKCN7QGdldCgnc3JjJyl9KVwiKVxuXHRcdFx0XHRcdC5lbmQoKVxuXHRcdFx0XHQuYWRkQ2xhc3MgQGNsYXNzTmFtZXMuTE9BREVEXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gTGF6eUltYWdlTW9kZWxcbiIsIkFic3RyYWN0TW9kZWwgPSByZXF1aXJlICcuLi9BYnN0cmFjdE1vZGVsJ1xuXG5jbGFzcyBIb21lVGFnbGluZU1vZGVsIGV4dGVuZHMgQWJzdHJhY3RNb2RlbFxuXG5cdGRlZmF1bHRzIDpcblx0XHR0YWdsaW5lICAgICA6IFwiXCJcblx0XHR0YWdsaW5lSFRNTCA6IFwiXCJcblxuXHRfZmlsdGVyQXR0cnMgOiAoYXR0cnMpID0+XG5cblx0XHRpZiBhdHRycyBhbmQgYXR0cnMudGFnbGluZVxuXHRcdFx0YXR0cnMudGFnbGluZUhUTUwgPSBAX2dldFRhZ2xpbmVIVE1MIGF0dHJzLnRhZ2xpbmVcblxuXHRcdGF0dHJzXG5cblx0X2dldFRhZ2xpbmVIVE1MIDogKHRleHQpID0+XG5cblx0XHRwYXJ0cyA9IHRleHQuc3BsaXQgJzxici8+J1xuXG5cdFx0dGFnbGluZUhUTUwgPSBcIjxzcGFuIGNsYXNzPVxcXCJ3b1xcXCI+PHNwYW4gY2xhc3M9XFxcIndpXFxcIj4je3BhcnRzWzBdfTwvc3Bhbj48L3NwYW4+PC9icj48c3BhbiBjbGFzcz1cXFwid29cXFwiPjxzcGFuIGNsYXNzPVxcXCJ3aVxcXCI+I3twYXJ0c1sxXX08L3NwYW4+PC9zcGFuPlwiXG5cblx0XHR0YWdsaW5lSFRNTFxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVUYWdsaW5lTW9kZWxcbiIsIkFic3RyYWN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXcvQWJzdHJhY3RWaWV3J1xuUm91dGVyICAgICAgID0gcmVxdWlyZSAnLi9Sb3V0ZXInXG5cbmNsYXNzIE5hdiBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG4gICAgQEVWRU5UX0NIQU5HRV9WSUVXICAgICA6ICdFVkVOVF9DSEFOR0VfVklFVydcbiAgICBARVZFTlRfQ0hBTkdFX1NVQl9WSUVXIDogJ0VWRU5UX0NIQU5HRV9TVUJfVklFVydcblxuICAgIHNlY3Rpb25zIDpcbiAgICAgICAgSE9NRSAgICA6ICcnXG4gICAgICAgIEFCT1VUICAgOiAnYWJvdXQnXG4gICAgICAgIFdPUksgICAgOiAnd29yaydcbiAgICAgICAgQ09OVEFDVCA6ICdjb250YWN0J1xuICAgICAgICAjIGxhdGVyXG4gICAgICAgICMgQkxPRyA6ICdibG9nJ1xuICAgICAgICAjIExBQlMgOiAnbGFicydcblxuICAgIGN1cnJlbnQgIDogYXJlYSA6IG51bGwsIHN1YiA6IG51bGwsIHF1ZXJ5IDogbnVsbFxuICAgIHByZXZpb3VzIDogYXJlYSA6IG51bGwsIHN1YiA6IG51bGwsIHF1ZXJ5IDogbnVsbFxuXG4gICAgY29uc3RydWN0b3I6IC0+XG5cbiAgICAgICAgQE5DKCkucm91dGVyLm9uIFJvdXRlci5FVkVOVF9IQVNIX0NIQU5HRUQsIEBjaGFuZ2VWaWV3XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBnZXRTZWN0aW9uIDogKHNlY3Rpb24pID0+XG5cbiAgICAgICAgaWYgc2VjdGlvbiBpcyAnJyB0aGVuIHJldHVybiB0cnVlXG5cbiAgICAgICAgZm9yIHNlY3Rpb25OYW1lLCB1cmkgb2YgQHNlY3Rpb25zXG4gICAgICAgICAgICBpZiB1cmkgaXMgc2VjdGlvbiB0aGVuIHJldHVybiBzZWN0aW9uTmFtZVxuXG4gICAgICAgIGZhbHNlXG5cbiAgICBjaGFuZ2VWaWV3OiAoYXJlYSwgc3ViLCBxdWVyeSwgcGFyYW1zKSA9PlxuXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJhcmVhXCIsYXJlYVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3ViXCIsc3ViXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJwYXJhbXNcIixwYXJhbXNcblxuICAgICAgICBAcHJldmlvdXMgPSBAY3VycmVudFxuICAgICAgICBAY3VycmVudCAgPSBhcmVhIDogYXJlYSwgc3ViIDogc3ViLCBxdWVyeSA6IHF1ZXJ5XG5cbiAgICAgICAgQHRyaWdnZXIgTmF2LkVWRU5UX0NIQU5HRV9WSUVXLCBhcmVhLCBzdWIsIHF1ZXJ5XG5cbiAgICAgICAgaWYgQE5DKCkuYXBwVmlldy5tb2RhbE1hbmFnZXIuaXNPcGVuKCkgdGhlbiBATkMoKS5hcHBWaWV3Lm1vZGFsTWFuYWdlci5oaWRlT3Blbk1vZGFsKClcblxuICAgICAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2XG4iLCJjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBCYWNrYm9uZS5Sb3V0ZXJcblxuICAgIEBFVkVOVF9IQVNIX0NIQU5HRUQgICAgICAgICA6ICdFVkVOVF9IQVNIX0NIQU5HRUQnXG4gICAgQEVWRU5UX0hBU0hGUkFHTUVOVF9DSEFOR0VEIDogJ0VWRU5UX0hBU0hGUkFHTUVOVF9DSEFOR0VEJ1xuXG4gICAgRklSU1RfUk9VVEUgOiB0cnVlXG5cbiAgICByb3V0ZXMgOlxuICAgICAgICAnKC8pKDphcmVhKSgvOnN1YikoLyknIDogJ2hhc2hDaGFuZ2VkJ1xuICAgICAgICAnKmFjdGlvbnMnICAgICAgICAgICAgIDogJ25hdmlnYXRlVG8nXG5cbiAgICBhcmVhICAgOiBudWxsXG4gICAgc3ViICAgIDogbnVsbFxuICAgIHF1ZXJ5ICA6IG51bGxcbiAgICBwYXJhbXMgOiBudWxsXG5cbiAgICBzdGFydCA6ID0+XG5cbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCBcbiAgICAgICAgICAgIHB1c2hTdGF0ZSA6IHRydWVcbiAgICAgICAgICAgIHJvb3QgICAgICA6IEBOQygpLkJBU0VfUEFUSFxuXG4gICAgICAgIEBiaW5kRXZlbnRzKClcblxuICAgICAgICBudWxsXG5cbiAgICBiaW5kRXZlbnRzIDogPT5cblxuICAgICAgICBAb24gQEVWRU5UX0hBU0hGUkFHTUVOVF9DSEFOR0VELCBAb25IYXNoRnJhZ21lbnRDaGFuZ2VcblxuICAgICAgICBudWxsXG5cbiAgICBoYXNoQ2hhbmdlZCA6IChAYXJlYSA9IG51bGwsIEBzdWIgPSBudWxsLCBAcXVlcnkgPSBudWxsKSA9PlxuXG4gICAgICAgICMgY29uc29sZS5sb2cgXCI+PiBFVkVOVF9IQVNIX0NIQU5HRUQgQGFyZWEgPSAje0BhcmVhfSwgQHN1YiA9ICN7QHN1Yn0sIEBxdWVyeSA9ICN7SlNPTi5zdHJpbmdpZnkoQHF1ZXJ5KX0gPDxcIlxuXG4gICAgICAgIGlmICFAYXJlYSB0aGVuIEBhcmVhID0gQE5DKCkubmF2LnNlY3Rpb25zLkhPTUVcblxuICAgICAgICBAdHJpZ2dlciBSb3V0ZXIuRVZFTlRfSEFTSF9DSEFOR0VELCBAYXJlYSwgQHN1YiwgQHF1ZXJ5LCBAcGFyYW1zXG5cbiAgICAgICAgaWYgQEZJUlNUX1JPVVRFXG4gICAgICAgICAgICBARklSU1RfUk9VVEUgPSBmYWxzZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBATkMoKS5hcHBWaWV3LnRyYWNrUGFnZVZpZXcoKVxuXG4gICAgICAgIG51bGxcblxuICAgIG5hdmlnYXRlVG8gOiAod2hlcmUgPSAnJywgdHJpZ2dlciA9IHRydWUsIHJlcGxhY2UgPSBmYWxzZSwgQHBhcmFtcykgPT5cblxuICAgICAgICBpZiB3aGVyZS5jaGFyQXQoMCkgaXNudCBcIi9cIlxuICAgICAgICAgICAgd2hlcmUgPSBcIi8je3doZXJlfVwiXG4gICAgICAgIGlmIHdoZXJlLmNoYXJBdCggd2hlcmUubGVuZ3RoLTEgKSBpc250IFwiL1wiIGFuZCB3aGVyZS5pbmRleE9mKCc/JykgPCAwXG4gICAgICAgICAgICB3aGVyZSA9IFwiI3t3aGVyZX0vXCJcblxuICAgICAgICBpZiAhdHJpZ2dlclxuICAgICAgICAgICAgQHRyaWdnZXIgUm91dGVyLkVWRU5UX0hBU0hfQ0hBTkdFRCwgd2hlcmUsIG51bGwsIEBxdWVyeSwgQHBhcmFtc1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQG5hdmlnYXRlIHdoZXJlLCB0cmlnZ2VyOiB0cnVlLCByZXBsYWNlOiByZXBsYWNlXG5cbiAgICAgICAgbnVsbFxuXG4gICAgb25IYXNoRnJhZ21lbnRDaGFuZ2UgOiA9PlxuXG4gICAgICAgIEBOQygpLmFwcFZpZXcudHJhY2tQYWdlVmlldygpXG5cbiAgICAgICAgbnVsbFxuXG4gICAgTkMgOiA9PlxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXJcbiIsIkFwcFZpZXcgICAgICAgICAgICAgPSByZXF1aXJlICcuLi9BcHBWaWV3J1xuQWJzdHJhY3RWaWV3ICAgICAgICA9IHJlcXVpcmUgJy4uL3ZpZXcvQWJzdHJhY3RWaWV3J1xuV3JhcHBlciAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uL3ZpZXcvYmFzZS9XcmFwcGVyJ1xuTGF6eUltYWdlQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4uL2NvbGxlY3Rpb25zL2ltYWdlcy9MYXp5SW1hZ2VDb2xsZWN0aW9uJ1xuXG5jbGFzcyBMYXp5SW1hZ2VMb2FkZXIgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuXHRAQVRUUiA6ICdkYXRhLWxhenlpbWFnZSdcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRAaW1hZ2VzID0gbmV3IExhenlJbWFnZUNvbGxlY3Rpb25cblxuXHRcdHN1cGVyXG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uICdzdGFydCcsIEBvblN0YXJ0XG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdG9uU3RhcnQgOiA9PlxuXG5cdFx0QE5DKCkuYXBwVmlldy5vZmYgJ3N0YXJ0JywgQG9uU3RhcnRcblxuXHRcdEBiaW5kRXZlbnRzKClcblxuXHRcdG51bGxcblxuXHRiaW5kRXZlbnRzIDogPT5cblxuXHRcdEBOQygpLmFwcFZpZXcub24gQXBwVmlldy5FVkVOVF9VUERBVEVfRElNRU5TSU9OUywgQG9uVmlld1VwZGF0ZWRcblx0XHRATkMoKS5hcHBWaWV3LndyYXBwZXIub24gV3JhcHBlci5WSUVXX1VQREFURUQsIEBvblZpZXdVcGRhdGVkXG5cblx0XHRudWxsXG5cblx0b25WaWV3VXBkYXRlZCA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3LndyYXBwZXIuY3VycmVudFZpZXcuJGVsLmZpbmQoXCJbI3tMYXp5SW1hZ2VMb2FkZXIuQVRUUn1dXCIpLmVhY2ggKGksIGVsKSA9PiBAbG9hZCAkKGVsKVxuXG5cdFx0bnVsbFxuXG5cdGxvYWQgOiAoJGVsKSA9PlxuXG5cdFx0aW1nID0gQF9nZXRJbWFnZUZyb21FbCAkZWxcblxuXHRcdHJldHVybiB1bmxlc3MgaW1nLnNyY1xuXG5cdFx0QGltYWdlcy5hZGRJbWFnZSBpbWdcblxuXHRcdG51bGxcblxuXHRzaG93IDogKCRlbCkgPT5cblxuXHRcdGltZyA9IEBfZ2V0SW1hZ2VGcm9tRWwgJGVsXG5cblx0XHRpbWdSZWYgPSBAaW1hZ2VzLmZpbmRXaGVyZSBzcmMgOiBpbWcuc3JjXG5cblx0XHRpbWdSZWY/LnNob3coKVxuXG5cdFx0bnVsbFxuXG5cdF9nZXRJbWFnZUZyb21FbCA6ICgkZWwpID0+XG5cblx0XHRpbWcgPSB7fVxuXG5cdFx0aW1nLiRlbCA9IGlmICRlbC5hdHRyKFwiI3tMYXp5SW1hZ2VMb2FkZXIuQVRUUn1cIikgdGhlbiAkZWwgZWxzZSAkZWwuZmluZChcIlsje0xhenlJbWFnZUxvYWRlci5BVFRSfV1cIilcblx0XHRfaW1nU3JjID0gaW1nLiRlbC5hdHRyKFwiI3tMYXp5SW1hZ2VMb2FkZXIuQVRUUn1cIilcblx0XHRpbWcuc3JjID0gaWYgX2ltZ1NyYyB0aGVuIEBzdXBwbGFudFN0cmluZyBfaW1nU3JjLCBAX2dldFZhcnMoKSBlbHNlIG51bGxcblxuXHRcdGltZ1xuXG5cdF9nZXRWYXJzIDogPT5cblxuXHRcdHZhcnMgPVxuXHRcdFx0QkFTRV9VUkwgOiBATkMoKS5CQVNFX1VSTFxuXHRcdFx0UldEX1NJWkUgOiBATkMoKS5hcHBWaWV3LmRpbXMuclxuXG5cdFx0dmFyc1xuXG5tb2R1bGUuZXhwb3J0cyA9IExhenlJbWFnZUxvYWRlclxuIiwiIyAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIE1lZGlhIFF1ZXJpZXMgTWFuYWdlciBcbiMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBcbiMgICBAYXV0aG9yIDogRsOhYmlvIEF6ZXZlZG8gPGZhYmlvLmF6ZXZlZG9AdW5pdDkuY29tPiBVTklUOVxuIyAgIEBkYXRlICAgOiBTZXB0ZW1iZXIgMTRcbiMgICBcbiMgICBJbnN0cnVjdGlvbnMgYXJlIG9uIC9wcm9qZWN0L3Nhc3MvdXRpbHMvX3Jlc3BvbnNpdmUuc2Nzcy5cblxuY2xhc3MgTWVkaWFRdWVyaWVzXG5cbiAgICAjIEJyZWFrcG9pbnRzXG4gICAgQFNNQUxMRVNUICAgIDogXCJzbWFsbGVzdFwiXG4gICAgQFNNQUxMICAgICAgIDogXCJzbWFsbFwiXG4gICAgQElQQUQgICAgICAgIDogXCJpcGFkXCJcbiAgICBATUVESVVNICAgICAgOiBcIm1lZGl1bVwiXG4gICAgQExBUkdFICAgICAgIDogXCJsYXJnZVwiXG4gICAgQEVYVFJBX0xBUkdFIDogXCJleHRyYS1sYXJnZVwiXG5cbiAgICBAc2V0dXAgOiA9PlxuXG4gICAgICAgIE1lZGlhUXVlcmllcy5TTUFMTEVTVF9CUkVBS1BPSU5UID0ge25hbWU6IFwiU21hbGxlc3RcIiwgYnJlYWtwb2ludHM6IFtNZWRpYVF1ZXJpZXMuU01BTExFU1RdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIlNtYWxsXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLlNNQUxMRVNULCBNZWRpYVF1ZXJpZXMuU01BTExdfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTUVESVVNX0JSRUFLUE9JTlQgICA9IHtuYW1lOiBcIk1lZGl1bVwiLCBicmVha3BvaW50czogW01lZGlhUXVlcmllcy5NRURJVU1dfVxuICAgICAgICBNZWRpYVF1ZXJpZXMuTEFSR0VfQlJFQUtQT0lOVCAgICA9IHtuYW1lOiBcIkxhcmdlXCIsIGJyZWFrcG9pbnRzOiBbTWVkaWFRdWVyaWVzLklQQUQsIE1lZGlhUXVlcmllcy5MQVJHRSwgTWVkaWFRdWVyaWVzLkVYVFJBX0xBUkdFXX1cblxuICAgICAgICBNZWRpYVF1ZXJpZXMuQlJFQUtQT0lOVFMgPSBbXG4gICAgICAgICAgICBNZWRpYVF1ZXJpZXMuU01BTExFU1RfQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLlNNQUxMX0JSRUFLUE9JTlRcbiAgICAgICAgICAgIE1lZGlhUXVlcmllcy5NRURJVU1fQlJFQUtQT0lOVFxuICAgICAgICAgICAgTWVkaWFRdWVyaWVzLkxBUkdFX0JSRUFLUE9JTlRcbiAgICAgICAgXVxuICAgICAgICByZXR1cm5cblxuICAgIEBnZXREZXZpY2VTdGF0ZSA6ID0+XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIFwiYWZ0ZXJcIikuZ2V0UHJvcGVydHlWYWx1ZShcImNvbnRlbnRcIik7XG5cbiAgICBAZ2V0QnJlYWtwb2ludCA6ID0+XG5cbiAgICAgICAgc3RhdGUgPSBNZWRpYVF1ZXJpZXMuZ2V0RGV2aWNlU3RhdGUoKVxuXG4gICAgICAgIGZvciBpIGluIFswLi4uTWVkaWFRdWVyaWVzLkJSRUFLUE9JTlRTLmxlbmd0aF1cbiAgICAgICAgICAgIGlmIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5icmVha3BvaW50cy5pbmRleE9mKHN0YXRlKSA+IC0xXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lZGlhUXVlcmllcy5CUkVBS1BPSU5UU1tpXS5uYW1lXG5cbiAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgIEBpc0JyZWFrcG9pbnQgOiAoYnJlYWtwb2ludCkgPT5cblxuICAgICAgICBmb3IgaSBpbiBbMC4uLmJyZWFrcG9pbnQuYnJlYWtwb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBicmVha3BvaW50LmJyZWFrcG9pbnRzW2ldID09IE1lZGlhUXVlcmllcy5nZXREZXZpY2VTdGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYVF1ZXJpZXNcbiIsIiMjI1xuIyBSZXF1ZXN0ZXIgI1xuXG5XcmFwcGVyIGZvciBgJC5hamF4YCBjYWxsc1xuXG4jIyNcbmNsYXNzIFJlcXVlc3RlclxuXG4gICAgQHJlcXVlc3RzIDogW11cblxuICAgIEByZXF1ZXN0OiAoIGRhdGEgKSA9PlxuICAgICAgICAjIyNcbiAgICAgICAgYGRhdGEgPSB7YDxicj5cbiAgICAgICAgYCAgdXJsICAgICAgICAgOiBTdHJpbmdgPGJyPlxuICAgICAgICBgICB0eXBlICAgICAgICA6IFwiUE9TVC9HRVQvUFVUXCJgPGJyPlxuICAgICAgICBgICBkYXRhICAgICAgICA6IE9iamVjdGA8YnI+XG4gICAgICAgIGAgIGRhdGFUeXBlICAgIDogalF1ZXJ5IGRhdGFUeXBlYDxicj5cbiAgICAgICAgYCAgY29udGVudFR5cGUgOiBTdHJpbmdgPGJyPlxuICAgICAgICBgfWBcbiAgICAgICAgIyMjXG5cbiAgICAgICAgciA9ICQuYWpheCB7XG5cbiAgICAgICAgICAgIHVybCAgICAgICAgIDogZGF0YS51cmxcbiAgICAgICAgICAgIHR5cGUgICAgICAgIDogaWYgZGF0YS50eXBlIHRoZW4gZGF0YS50eXBlIGVsc2UgXCJQT1NUXCIsXG4gICAgICAgICAgICBkYXRhICAgICAgICA6IGlmIGRhdGEuZGF0YSB0aGVuIGRhdGEuZGF0YSBlbHNlIG51bGwsXG4gICAgICAgICAgICBkYXRhVHlwZSAgICA6IGlmIGRhdGEuZGF0YVR5cGUgdGhlbiBkYXRhLmRhdGFUeXBlIGVsc2UgXCJqc29uXCIsXG4gICAgICAgICAgICBjb250ZW50VHlwZSA6IGlmIGRhdGEuY29udGVudFR5cGUgdGhlbiBkYXRhLmNvbnRlbnRUeXBlIGVsc2UgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIixcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhIDogaWYgZGF0YS5wcm9jZXNzRGF0YSAhPSBudWxsIGFuZCBkYXRhLnByb2Nlc3NEYXRhICE9IHVuZGVmaW5lZCB0aGVuIGRhdGEucHJvY2Vzc0RhdGEgZWxzZSB0cnVlXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHIuZG9uZSBkYXRhLmRvbmVcbiAgICAgICAgci5mYWlsIGRhdGEuZmFpbFxuICAgICAgICBcbiAgICAgICAgclxuXG4gICAgQGFkZEltYWdlIDogKGRhdGEsIGRvbmUsIGZhaWwpID0+XG4gICAgICAgICMjI1xuICAgICAgICAqKiBVc2FnZTogPGJyPlxuICAgICAgICBgZGF0YSA9IGNhbnZhc3MudG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiKS5zbGljZShcImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsXCIubGVuZ3RoKWA8YnI+XG4gICAgICAgIGBSZXF1ZXN0ZXIuYWRkSW1hZ2UgZGF0YSwgXCJ6b2V0cm9wZVwiLCBAZG9uZSwgQGZhaWxgXG4gICAgICAgICMjI1xuXG4gICAgICAgIEByZXF1ZXN0XG4gICAgICAgICAgICB1cmwgICAgOiAnL2FwaS9pbWFnZXMvJ1xuICAgICAgICAgICAgdHlwZSAgIDogJ1BPU1QnXG4gICAgICAgICAgICBkYXRhICAgOiB7aW1hZ2VfYmFzZTY0IDogZW5jb2RlVVJJKGRhdGEpfVxuICAgICAgICAgICAgZG9uZSAgIDogZG9uZVxuICAgICAgICAgICAgZmFpbCAgIDogZmFpbFxuXG4gICAgICAgIG51bGxcblxuICAgIEBkZWxldGVJbWFnZSA6IChpZCwgZG9uZSwgZmFpbCkgPT5cbiAgICAgICAgXG4gICAgICAgIEByZXF1ZXN0XG4gICAgICAgICAgICB1cmwgICAgOiAnL2FwaS9pbWFnZXMvJytpZFxuICAgICAgICAgICAgdHlwZSAgIDogJ0RFTEVURSdcbiAgICAgICAgICAgIGRvbmUgICA6IGRvbmVcbiAgICAgICAgICAgIGZhaWwgICA6IGZhaWxcblxuICAgICAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdGVyXG4iLCJBcHBWaWV3ICAgICAgICAgID0gcmVxdWlyZSAnLi4vQXBwVmlldydcbkFic3RyYWN0VmlldyAgICAgPSByZXF1aXJlICcuLi92aWV3L0Fic3RyYWN0VmlldydcbldyYXBwZXIgICAgICAgICAgPSByZXF1aXJlICcuLi92aWV3L2Jhc2UvV3JhcHBlcidcbldvcmRUcmFuc2l0aW9uZXIgPSByZXF1aXJlICcuL1dvcmRUcmFuc2l0aW9uZXInXG5MYXp5SW1hZ2VMb2FkZXIgID0gcmVxdWlyZSAnLi9MYXp5SW1hZ2VMb2FkZXInXG5cbmNsYXNzIFNjcm9sbEl0ZW1JblZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuXHRjbGFzc05hbWVzIDpcblx0XHRTSE9XIDogJ3Nob3cnXG5cblx0ZGVmYXVsdHMgOlxuXHRcdHNob3dUaHJlc2hvbGQgOiAwLjhcblx0XHRpdGVtRGVsYXkgICAgIDogMjUwXG5cblx0aXRlbXMgOiBbXVxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdHN1cGVyXG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uICdzdGFydCcsIEBvblN0YXJ0XG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdG9uU3RhcnQgOiA9PlxuXG5cdFx0QE5DKCkuYXBwVmlldy5vZmYgJ3N0YXJ0JywgQG9uU3RhcnRcblxuXHRcdEBiaW5kRXZlbnRzKClcblxuXHRcdG51bGxcblxuXHRiaW5kRXZlbnRzIDogPT5cblxuXHRcdEBOQygpLmFwcFZpZXcub24gQXBwVmlldy5FVkVOVF9PTl9TQ1JPTEwsIEBvblNjcm9sbFxuXHRcdEBOQygpLmFwcFZpZXcud3JhcHBlci5vbiBXcmFwcGVyLlZJRVdfVVBEQVRFRCwgQG9uVmlld1VwZGF0ZWRcblxuXHRcdG51bGxcblxuXHRvblZpZXdVcGRhdGVkIDogPT5cblxuXHRcdEBnZXRJdGVtcygpXG5cdFx0QG9uU2Nyb2xsKClcblxuXHRcdG51bGxcblxuXHRvblNjcm9sbCA6ID0+XG5cblx0XHRyZXR1cm4gdW5sZXNzIEBpdGVtcy5sZW5ndGhcblxuXHRcdHRocmVzaG9sZCAgID0gQE5DKCkuYXBwVmlldy5sYXN0U2Nyb2xsWSArIChATkMoKS5hcHBWaWV3LmRpbXMuaCAqIEBkZWZhdWx0cy5zaG93VGhyZXNob2xkKVxuXHRcdGl0ZW1zVG9TaG93ID0gW11cblxuXHRcdChpZiB0aHJlc2hvbGQgPiBpdGVtLm9mZnNldCB0aGVuIGl0ZW1zVG9TaG93LnB1c2ggaXRlbSkgZm9yIGl0ZW0sIGkgaW4gQGl0ZW1zXG5cblx0XHRpZiBpdGVtc1RvU2hvdy5sZW5ndGhcblx0XHRcdEBzaG93SXRlbXMgaXRlbXNUb1Nob3dcblx0XHRcdEBpdGVtcyA9IEBpdGVtcy5zbGljZSBpdGVtc1RvU2hvdy5sZW5ndGgsIEBpdGVtcy5sZW5ndGhcblxuXHRcdG51bGxcblxuXHRnZXRJdGVtcyA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3LndyYXBwZXIuY3VycmVudFZpZXcuJGVsXG5cdFx0XHQuZmluZCgnW2RhdGEtc2Nyb2xsLWl0ZW1dJykuZWFjaCAoaSwgZWwpID0+XG5cblx0XHRcdFx0JGVsID0gJChlbClcblxuXHRcdFx0XHRAaXRlbXMucHVzaFxuXHRcdFx0XHRcdCRlbCAgICA6ICRlbFxuXHRcdFx0XHRcdG9mZnNldCA6ICRlbC5vZmZzZXQoKS50b3BcblxuXHRcdFx0XHRAaXRlbXMgPSBfLnNvcnRCeSBAaXRlbXMsIChpdGVtKSAtPiByZXR1cm4gaXRlbS5vZmZzZXRcblxuXHRcdG51bGxcblxuXHRzaG93SXRlbXMgOiAoaXRlbXMpID0+XG5cblx0XHRmb3IgaXRlbSwgaSBpbiBpdGVtc1xuXHRcdFx0ZG8gKGl0ZW0sIGkpID0+XG5cblx0XHRcdFx0ZGVsYXkgPSAoQGRlZmF1bHRzLml0ZW1EZWxheSppKVxuXG5cdFx0XHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdFx0XHRAc2hvd0l0ZW0gaXRlbS4kZWxcblx0XHRcdFx0LCBkZWxheVxuXG5cdFx0bnVsbFxuXG5cdHNob3dJdGVtIDogKCRlbCkgPT5cblxuXHRcdCRlbC5hZGRDbGFzcyBAY2xhc3NOYW1lcy5TSE9XXG5cblx0XHRXb3JkVHJhbnNpdGlvbmVyLmluICRlbFxuXHRcdEBOQygpLmFwcFZpZXcubGF6eUltYWdlTG9hZGVyLnNob3cgJGVsXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsSXRlbUluVmlld1xuIiwiY2xhc3MgU2Nyb2xsZXJcblxuXHRAZGVmYXVsdHMgOlxuXHRcdG9mZnNldCAgOiAwXG5cdFx0bWluVGltZSA6IDAuMVxuXHRcdG1heFRpbWUgOiAwLjZcblxuXHRAbWF4RGlzdCA6IDUwMFxuXG5cdEBzY3JvbGxUbyA6IChzZXR0aW5ncywgY2IpID0+XG5cblx0XHRvZmZzZXQgICA9IHNldHRpbmdzLm9mZnNldCBvciBAZGVmYXVsdHMub2Zmc2V0XG5cdFx0bWF4VGltZSAgPSBzZXR0aW5ncy5tYXhUaW1lIG9yIEBkZWZhdWx0cy5tYXhUaW1lXG5cdFx0bWluVGltZSAgPSBzZXR0aW5ncy5taW5UaW1lIG9yIEBkZWZhdWx0cy5taW5UaW1lXG5cdFx0dGFyZ2V0ICAgPSAoaWYgdHlwZW9mIHNldHRpbmdzLnRhcmdldCBpcyAnbnVtYmVyJyB0aGVuIHNldHRpbmdzLnRhcmdldCBlbHNlIHNldHRpbmdzLnRhcmdldC5vZmZzZXQoKS50b3ApICsgb2Zmc2V0XG5cblx0XHRkaXN0VG9HbyA9IHdpbmRvdy5zY3JvbGxZIC0gdGFyZ2V0XG5cdFx0ZGlzdFRvR28gPSBpZiBkaXN0VG9HbyA8IDAgdGhlbiBkaXN0VG9HbyotMSBlbHNlIGRpc3RUb0dvXG5cblx0XHRpZiBkaXN0VG9HbyBpcyAwXG5cdFx0XHR0aW1lID0gMFxuXHRcdGVsc2UgaWYgZGlzdFRvR28gPiBAbWF4RGlzdFxuXHRcdFx0dGltZSA9IG1heFRpbWUgKyBtaW5UaW1lXG5cdFx0ZWxzZVxuXHRcdFx0dGltZSA9ICgoZGlzdFRvR28gLyBAbWF4RGlzdCkgKiAgbWF4VGltZSkgKyBtaW5UaW1lXG5cblx0XHRjb25zb2xlLmxvZyBcIisrK1Njcm9sbGVyLCBkaXN0YW5jZSB0byBnbzogI3tkaXN0VG9Hb30sIHRpbWUgdG8gdGFrZSBpdDogI3t0aW1lfVwiXG5cblx0XHRUd2VlbkxpdGUudG8gd2luZG93LCB0aW1lLFxuICAgICAgICAgICAgc2Nyb2xsVG86e3g6IDAsIHk6IHRhcmdldH0sIGVhc2U6IFBvd2VyMy5lYXNlSW5PdXQsIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICBcdGNiPygpXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJcbiIsImNsYXNzIFdvcmRUcmFuc2l0aW9uZXJcblxuXHRAY2xhc3NOYW1lcyA6XG5cdFx0V09SRCAgICAgOiAnd28nXG5cdFx0QU5JTV9JTiAgOiAnYSdcblx0XHRBTklNX09VVCA6ICdhbydcblxuXHRAQU5JTV9ERUxBWSAgICA6IDUwMFxuXHRAQU5JTV9EVVJBVElPTiA6IDEwMDBcblxuXHRAaW4gOiAoJGVsLCBjYikgPT5cblxuXHRcdEBhbmltYXRlICdpbicsICRlbCwgY2JcdFx0XG5cblx0XHRudWxsXG5cblx0QG91dCA6ICgkZWwsIGNiKSA9PlxuXG5cdFx0QGFuaW1hdGUgJ291dCcsICRlbCwgY2JcblxuXHRcdG51bGxcblxuXHRAYW5pbWF0ZSA6IChkaXJlY3Rpb24sICRlbCwgY2IpID0+XG5cblx0XHRjbGFzc05hbWUgPSBAY2xhc3NOYW1lc1soaWYgZGlyZWN0aW9uIGlzICdpbicgdGhlbiAnQU5JTV9JTicgZWxzZSAnQU5JTV9PVVQnKV1cblxuXHRcdCR3b3JkcyA9ICRlbC5maW5kICcuJytAY2xhc3NOYW1lcy5XT1JEXG5cdFx0bGVuICAgID0gJHdvcmRzLmxlbmd0aFxuXG5cdFx0JHdvcmRzLmVhY2ggKGksIGVsKSA9PlxuXHRcdFx0ZG8gKGksIGVsLCAkd29yZHMpID0+XG5cdFx0XHRcdGRlbGF5ID0gKGkqQEFOSU1fREVMQVkpXG5cdFx0XHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdFx0XHQkKGVsKS5hZGRDbGFzcyBjbGFzc05hbWVcblx0XHRcdFx0XHRpZiBpIGlzIGxlbi0xXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0ID0+XG5cdFx0XHRcdFx0XHRcdGNiPygpXG5cdFx0XHRcdFx0XHRcdGlmIGRpcmVjdGlvbiBpcyAnb3V0JyB0aGVuIEByZXNldCAkd29yZHNcblx0XHRcdFx0XHRcdCwgQEFOSU1fRFVSQVRJT05cblx0XHRcdFx0LCBkZWxheVxuXG5cdFx0bnVsbFxuXG5cdEByZXNldCA6ICgkZWwpID0+XG5cblx0XHQkZWwucmVtb3ZlQ2xhc3MgQGNsYXNzTmFtZXMuQU5JTV9JTiArICcgJyArIEBjbGFzc05hbWVzLkFOSU1fT1VUXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gV29yZFRyYW5zaXRpb25lclxuIiwiY2xhc3MgQWJzdHJhY3RWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlld1xuXG5cdGVsICAgICAgICAgICA6IG51bGxcblx0aWQgICAgICAgICAgIDogbnVsbFxuXHRjaGlsZHJlbiAgICAgOiBudWxsXG5cdHRlbXBsYXRlICAgICA6IG51bGxcblx0dGVtcGxhdGVWYXJzIDogbnVsbFxuXG5cdCMgY296IG9uIHBhZ2UgbG9hZCB3ZSBhbHJlYWR5IGhhdmUgdGhlIERPTSBmb3IgYSBwYWdlLCBpdCB3aWxsIGdldCBpbml0aWFsaXNlZCB0d2ljZSAtIG9uY2Ugb24gY29uc3RydWN0aW9uLCBhbmQgb25jZSB3aGVuIHBhZ2UgaGFzIFwibG9hZGVkXCJcblx0aW5pdGlhbGl6ZWQgOiBmYWxzZVxuXHRcblx0aW5pdGlhbGl6ZSA6IChmb3JjZSkgLT5cblxuXHRcdHJldHVybiB1bmxlc3MgIUBpbml0aWFsaXplZCBvciBmb3JjZVxuXHRcdFxuXHRcdEBjaGlsZHJlbiA9IFtdXG5cblx0XHRpZiBAdGVtcGxhdGVcblx0XHRcdCR0bXBsID0gQE5DKCkuYXBwVmlldy4kZWwuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuXHRcdFx0QHNldEVsZW1lbnQgJHRtcGxcblx0XHRcdHJldHVybiB1bmxlc3MgJHRtcGwubGVuZ3RoXG5cblx0XHRAJGVsLmF0dHIgJ2lkJywgQGlkIGlmIEBpZFxuXHRcdEAkZWwuYWRkQ2xhc3MgQGNsYXNzTmFtZSBpZiBAY2xhc3NOYW1lXG5cdFx0XG5cdFx0QGluaXRpYWxpemVkID0gdHJ1ZVxuXHRcdEBpbml0KClcblxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXG5cdFx0bnVsbFxuXG5cdGluaXQgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdHVwZGF0ZSA6ID0+XG5cblx0XHRudWxsXG5cblx0cmVuZGVyIDogPT5cblxuXHRcdG51bGxcblxuXHRhZGRDaGlsZCA6IChjaGlsZCwgcHJlcGVuZCA9IGZhbHNlKSA9PlxuXG5cdFx0QGNoaWxkcmVuLnB1c2ggY2hpbGQgaWYgY2hpbGQuZWxcblxuXHRcdEBcblxuXHRyZXBsYWNlIDogKGRvbSwgY2hpbGQpID0+XG5cblx0XHRAY2hpbGRyZW4ucHVzaCBjaGlsZCBpZiBjaGlsZC5lbFxuXHRcdGMgPSBpZiBjaGlsZC5lbCB0aGVuIGNoaWxkLiRlbCBlbHNlIGNoaWxkXG5cdFx0QCRlbC5jaGlsZHJlbihkb20pLnJlcGxhY2VXaXRoKGMpXG5cblx0XHRudWxsXG5cblx0cmVtb3ZlIDogKGNoaWxkKSA9PlxuXG5cdFx0dW5sZXNzIGNoaWxkP1xuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0YyA9IGlmIGNoaWxkLmVsIHRoZW4gY2hpbGQuJGVsIGVsc2UgJChjaGlsZClcblx0XHRjaGlsZC5kaXNwb3NlKCkgaWYgYyBhbmQgY2hpbGQuZGlzcG9zZVxuXG5cdFx0aWYgYyAmJiBAY2hpbGRyZW4uaW5kZXhPZihjaGlsZCkgIT0gLTFcblx0XHRcdEBjaGlsZHJlbi5zcGxpY2UoIEBjaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSApXG5cblx0XHRjLnJlbW92ZSgpXG5cblx0XHRudWxsXG5cblx0b25SZXNpemUgOiAoZXZlbnQpID0+XG5cblx0XHQoaWYgY2hpbGQub25SZXNpemUgdGhlbiBjaGlsZC5vblJlc2l6ZSgpKSBmb3IgY2hpbGQgaW4gQGNoaWxkcmVuXG5cblx0XHRudWxsXG5cblx0bW91c2VFbmFibGVkIDogKCBlbmFibGVkICkgPT5cblxuXHRcdEAkZWwuY3NzXG5cdFx0XHRcInBvaW50ZXItZXZlbnRzXCI6IGlmIGVuYWJsZWQgdGhlbiBcImF1dG9cIiBlbHNlIFwibm9uZVwiXG5cblx0XHRudWxsXG5cblx0Q1NTVHJhbnNsYXRlIDogKHgsIHksIHZhbHVlPSclJywgc2NhbGUpID0+XG5cblx0XHRpZiBNb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZTNkKCN7eCt2YWx1ZX0sICN7eSt2YWx1ZX0sIDApXCJcblx0XHRlbHNlXG5cdFx0XHRzdHIgPSBcInRyYW5zbGF0ZSgje3grdmFsdWV9LCAje3krdmFsdWV9KVwiXG5cblx0XHRpZiBzY2FsZSB0aGVuIHN0ciA9IFwiI3tzdHJ9IHNjYWxlKCN7c2NhbGV9KVwiXG5cblx0XHRzdHJcblxuXHR1bk11dGVBbGwgOiA9PlxuXG5cdFx0Zm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC51bk11dGU/KClcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0Y2hpbGQudW5NdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRtdXRlQWxsIDogPT5cblxuXHRcdGZvciBjaGlsZCBpbiBAY2hpbGRyZW5cblxuXHRcdFx0Y2hpbGQubXV0ZT8oKVxuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRjaGlsZC5tdXRlQWxsKClcblxuXHRcdG51bGxcblxuXHRyZW1vdmVBbGxDaGlsZHJlbjogPT5cblxuXHRcdEByZW1vdmUgY2hpbGQgZm9yIGNoaWxkIGluIEBjaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHRyaWdnZXJDaGlsZHJlbiA6IChtc2csIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZC50cmlnZ2VyIG1zZ1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAdHJpZ2dlckNoaWxkcmVuIG1zZywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW4gOiAobWV0aG9kLCBwYXJhbXMsIGNoaWxkcmVuPUBjaGlsZHJlbikgPT5cblxuXHRcdGZvciBjaGlsZCwgaSBpbiBjaGlsZHJlblxuXG5cdFx0XHRjaGlsZFttZXRob2RdPyBwYXJhbXNcblxuXHRcdFx0aWYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoXG5cblx0XHRcdFx0QGNhbGxDaGlsZHJlbiBtZXRob2QsIHBhcmFtcywgY2hpbGQuY2hpbGRyZW5cblxuXHRcdG51bGxcblxuXHRjYWxsQ2hpbGRyZW5BbmRTZWxmIDogKG1ldGhvZCwgcGFyYW1zLCBjaGlsZHJlbj1AY2hpbGRyZW4pID0+XG5cblx0XHRAW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0Zm9yIGNoaWxkLCBpIGluIGNoaWxkcmVuXG5cblx0XHRcdGNoaWxkW21ldGhvZF0/IHBhcmFtc1xuXG5cdFx0XHRpZiBjaGlsZC5jaGlsZHJlbi5sZW5ndGhcblxuXHRcdFx0XHRAY2FsbENoaWxkcmVuIG1ldGhvZCwgcGFyYW1zLCBjaGlsZC5jaGlsZHJlblxuXG5cdFx0bnVsbFxuXG5cdHN1cHBsYW50U3RyaW5nIDogKHN0ciwgdmFscykgLT5cblxuXHRcdHJldHVybiBzdHIucmVwbGFjZSAve3sgKFtee31dKikgfX0vZywgKGEsIGIpIC0+XG5cdFx0XHRyID0gdmFsc1tiXVxuXHRcdFx0KGlmIHR5cGVvZiByIGlzIFwic3RyaW5nXCIgb3IgdHlwZW9mIHIgaXMgXCJudW1iZXJcIiB0aGVuIHIgZWxzZSBhKVxuXG5cdGRpc3Bvc2UgOiA9PlxuXG5cdFx0QHN0b3BMaXN0ZW5pbmcoKVxuXG5cdFx0bnVsbFxuXG5cdE5DIDogPT5cblxuXHRcdHJldHVybiB3aW5kb3cuTkNcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFZpZXdcbiIsIkFic3RyYWN0VmlldyA9IHJlcXVpcmUgJy4vQWJzdHJhY3RWaWV3J1xuTWVkaWFRdWVyaWVzID0gcmVxdWlyZSAnLi4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuXG5jbGFzcyBBYnN0cmFjdFZpZXdQYWdlIGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cblx0X3Nob3duICAgICAgICAgOiBmYWxzZVxuXHRfbGlzdGVuaW5nICAgICA6IGZhbHNlXG5cblx0YXJlYSAgICAgICAgICAgOiBudWxsXG5cdHN1YiAgICAgICAgICAgIDogbnVsbFxuXG5cdHBhZ2VUaXRsZSAgICAgIDogbnVsbFxuXHRhbmltYXRlZEhlYWRlciA6IG51bGxcblxuXHQkdHJhbnNpdGlvbkVscyAgIDogbnVsbFxuXHR0cmFuc2l0aW9uQ29uZmlnIDpcblx0XHRlbE9mZnNldCAgIDogMTVcblx0XHRlbERlbGF5ICAgIDogMC4xNVxuXHRcdGVsRHVyYXRpb24gOiAwLjJcblxuXHQjIHVzZSB0aGlzIGluIHByb2dyZXNzIGV2ZW50cywgd2UgY2FuJ3QgZ2V0IGFjdHVhbCBzaXplIGZyb20gSFRNTCBpbiBYSFIyLCBzbyB0aGlzIHdpbGwgZG8gaW5zdGVhZFxuXHQjIHVzZSB7cGFnZVNpemV9IG9uIHBlci1wYWdlIGJhc2lzLCBvciBhdlBhZ2VTaXplIHdpbGwgYmUgdXNlZCBhcyBkZWZhdWx0XG5cdGF2UGFnZVNpemUgOiAxMjAwMFxuXHRwYWdlU2l6ZSAgIDogbnVsbFxuXG5cdGNvbnN0cnVjdG9yIDogKEBhcmVhLCBAc3ViKSAtPlxuXG5cdFx0c3VwZXJcblxuXHRcdHJldHVybiBudWxsXG5cblx0Z2V0Vmlld0NvbnRlbnQgOiA9PlxuXG5cdFx0dXJsID0gIGlmIEBzdWIgdGhlbiBcIiN7QE5DKCkuQkFTRV9VUkx9LyN7QGFyZWF9LyN7QHN1Yn0vXCIgZWxzZSBcIiN7QE5DKCkuQkFTRV9VUkx9LyN7QGFyZWF9L1wiXG5cblx0XHRyID0gJC5hamF4XG5cdFx0XHR0eXBlIDogJ0dFVCdcblx0XHRcdHVybCAgOiB1cmxcblx0XHRcdHhociAgOiA9PlxuICAgICAgICAgICAgICAgIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyIFwicHJvZ3Jlc3NcIiwgKGV2dCkgPT5cbiAgICAgICAgICAgICAgICBcdEBfb25Mb2FkUHJvZ3Jlc3MgZXZ0XG4gICAgICAgICAgICAgICAgLCBmYWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB4aHJcblxuXHRcdHIuZG9uZSBAX29uTG9hZENvbXBsZXRlXG5cdFx0ci5mYWlsIEBfb25Mb2FkRmFpbFxuXG5cdFx0clxuXG5cdF9vbkxvYWRQcm9ncmVzcyA6IChldnQpID0+XG5cblx0XHRwZXJjZW50Q29tcGxldGUgPSAoZXZ0LmxvYWRlZCAvIChAcGFnZVNpemUgb3IgQGF2UGFnZVNpemUpKSAqIDEwMFxuXHRcdEBOQygpLmFwcFZpZXcucHJlbG9hZGVyLmdvVG8gcGVyY2VudENvbXBsZXRlXG5cblx0XHQjIGNvbnNvbGUubG9nIFwicGVyY2VudENvbXBsZXRlIC0gI3twZXJjZW50Q29tcGxldGV9JSBmb3IgcGFnZSAje0BhcmVhfSwgI3tAc3VifVwiXG5cblx0XHRudWxsXG5cblx0X29uTG9hZENvbXBsZXRlIDogKHJlcykgPT5cblxuXHRcdCMgY29uc29sZS5sb2cgXCIhISEgR0VUIFZJRVcgQ09OVEVOVCBET05FICEhIVwiXG5cblx0XHQkcmVzICAgICAgID0gJChyZXMpXG5cdFx0QHBhZ2VUaXRsZSA9ICRyZXMuZmlsdGVyKCd0aXRsZScpLmVxKDApLnRleHQoKVxuXHRcdEAkdG1wbCAgICAgID0gJHJlcy5maWx0ZXIoJyNtYWluJykuZmluZChcIltkYXRhLXRlbXBsYXRlPVxcXCIje0B0ZW1wbGF0ZX1cXFwiXVwiKVxuXG5cdFx0bnVsbFxuXG5cdF9vbkxvYWRGYWlsIDogPT5cblxuXHRcdGNvbnNvbGUuZXJyb3IgXCJfb25Mb2FkRmFpbCA6ID0+XCJcblxuXHRcdG51bGxcblxuXHQjIyNcblx0YGZvcmNlYCAtIGlmIGJvdGggdmlld3MgYXJlIGFydGlzdCB2aWV3LCB3ZSBoYXZlIHRvIGZvcmNlIHJlLWludGl0aWFsaXNhdGlvblxuXHQjIyNcblx0c2hvdyA6IChmb3JjZT1mYWxzZSwgY2IpID0+XG5cblx0XHRyZXR1cm4gdW5sZXNzICFAX3Nob3duXG5cdFx0QF9zaG93biA9IHRydWVcblxuXHRcdEBOQygpLmFwcFZpZXcud3JhcHBlci4kZWwuYXBwZW5kIEAkdG1wbFxuXHRcdEBpbml0aWFsaXplIGZvcmNlXG5cblx0XHRATkMoKS5hcHBWaWV3LndyYXBwZXIuYWRkQ2hpbGQgQFxuXG5cdFx0QGNhbGxDaGlsZHJlbkFuZFNlbGYgJ3NldExpc3RlbmVycycsICdvbidcblxuXHRcdEBfYW5pbWF0ZUluIGNiXG5cblx0XHRudWxsXG5cblx0X2FuaW1hdGVJbiA6IChjYikgPT5cblxuXHRcdEAkdHJhbnNpdGlvbkVscyA9IEAkZWwuZmluZCgnW2RhdGEtcGFnZS10cmFuc2l0aW9uXScpXG5cblx0XHRAJGVsLmNzcyAndmlzaWJpbGl0eScgOiAndmlzaWJsZSdcblx0XHQjIEAkdHJhbnNpdGlvbkVscy5jc3MgJ29wYWNpdHknIDogMFxuXG5cdFx0QCR0cmFuc2l0aW9uRWxzLmVhY2ggKGksIGVsKSA9PlxuXHRcdFx0ZG8gKGksIGVsKSA9PlxuXG5cdFx0XHRcdGRlbGF5ICAgICAgPSBpKkB0cmFuc2l0aW9uQ29uZmlnLmVsRGVsYXlcblx0XHRcdFx0ZnJvbVBhcmFtcyA9IG9wYWNpdHkgOiAwLCB5IDogQHRyYW5zaXRpb25Db25maWcuZWxPZmZzZXRcblx0XHRcdFx0dG9QYXJhbXMgICA9IGRlbGF5IDogZGVsYXksIG9wYWNpdHkgOiAxLCB5IDogMCwgZWFzZSA6IENpcmMuZWFzZU91dFxuXHRcdFx0XHRpZiBpIGlzIEAkdHJhbnNpdGlvbkVscy5sZW5ndGgtMVxuXHRcdFx0XHRcdHRvUGFyYW1zLm9uQ29tcGxldGUgICAgICAgPSBAX2FuaW1hdGVJbkRvbmVcblx0XHRcdFx0XHR0b1BhcmFtcy5vbkNvbXBsZXRlUGFyYW1zID0gW2NiXVxuXG5cdFx0XHRcdFR3ZWVuTGl0ZS5mcm9tVG8gJChlbCksIEB0cmFuc2l0aW9uQ29uZmlnLmVsRHVyYXRpb24sIGZyb21QYXJhbXMsIHRvUGFyYW1zXG5cblx0XHRudWxsXG5cblx0X2FuaW1hdGVJbkRvbmUgOiAoY2IpID0+XG5cblx0XHRAJHRyYW5zaXRpb25FbHMuYXR0ciBcInN0eWxlXCIsIFwiXCJcblxuXHRcdGNiPygpXG5cblx0XHRudWxsXG5cblx0aGlkZSA6IChjYikgPT5cblxuXHRcdHJldHVybiB1bmxlc3MgQF9zaG93blxuXHRcdEBfc2hvd24gPSBmYWxzZVxuXG5cdFx0QF9hbmltYXRlT3V0IGNiXG5cblx0XHRudWxsXG5cblx0X2FuaW1hdGVPdXQgOiAoY2IpID0+XG5cblx0XHRsZW4gPSBAJHRyYW5zaXRpb25FbHMubGVuZ3RoXG5cblx0XHRAJHRyYW5zaXRpb25FbHMuZWFjaCAoaSwgZWwpID0+XG5cdFx0XHRkbyAoaSwgZWwpID0+XG5cblx0XHRcdFx0ZGVsYXkgICAgICA9IChsZW4tKGkrMSkpKkB0cmFuc2l0aW9uQ29uZmlnLmVsRGVsYXlcblx0XHRcdFx0ZnJvbVBhcmFtcyA9IG9wYWNpdHkgOiAxLCB5IDogMFxuXHRcdFx0XHR0b1BhcmFtcyAgID0gZGVsYXkgOiBkZWxheSwgb3BhY2l0eSA6IDAsIHkgOiBAdHJhbnNpdGlvbkNvbmZpZy5lbE9mZnNldCwgZWFzZSA6IENpcmMuZWFzZU91dFxuXHRcdFx0XHRpZiBpIGlzIDBcblx0XHRcdFx0XHR0b1BhcmFtcy5vbkNvbXBsZXRlICAgICAgID0gQF9hbmltYXRlT3V0RG9uZVxuXHRcdFx0XHRcdHRvUGFyYW1zLm9uQ29tcGxldGVQYXJhbXMgPSBbY2JdXG5cblx0XHRcdFx0VHdlZW5MaXRlLmZyb21UbyAkKGVsKSwgQHRyYW5zaXRpb25Db25maWcuZWxEdXJhdGlvbiwgZnJvbVBhcmFtcywgdG9QYXJhbXNcblxuXHRcdG51bGxcblxuXHRfYW5pbWF0ZU91dERvbmUgOiAoY2IpID0+XG5cblx0XHRATkMoKS5hcHBWaWV3LndyYXBwZXIucmVtb3ZlIEBcblxuXHRcdCMjIyByZXBsYWNlIHdpdGggc29tZSBwcm9wZXIgdHJhbnNpdGlvbiBpZiB3ZSBjYW4gIyMjXG5cdFx0QCRlbC5jc3MgJ3Zpc2liaWxpdHknIDogJ2hpZGRlbidcblx0XHRjYj8oKVxuXG5cdFx0bnVsbFxuXG5cdGRpc3Bvc2UgOiA9PlxuXG5cdFx0QGNhbGxDaGlsZHJlbkFuZFNlbGYgJ3NldExpc3RlbmVycycsICdvZmYnXG5cblx0XHRzdXBlcigpXG5cblx0XHRudWxsXG5cblx0c2V0TGlzdGVuZXJzIDogKHNldHRpbmcpID0+XG5cblx0XHRyZXR1cm4gdW5sZXNzIHNldHRpbmcgaXNudCBAX2xpc3RlbmluZ1xuXHRcdEBfbGlzdGVuaW5nID0gc2V0dGluZ1xuXG5cdFx0bnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0Vmlld1BhZ2VcbiIsIkFic3RyYWN0VmlldyA9IHJlcXVpcmUgJy4uL0Fic3RyYWN0VmlldydcblJvdXRlciAgICAgICA9IHJlcXVpcmUgJy4uLy4uL3JvdXRlci9Sb3V0ZXInXG5NZWRpYVF1ZXJpZXMgPSByZXF1aXJlICcuLi8uLi91dGlscy9NZWRpYVF1ZXJpZXMnXG5cbmNsYXNzIEhlYWRlciBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG5cdHRlbXBsYXRlIDogJ3NpdGUtaGVhZGVyJ1xuXG5cdGNsYXNzTmFtZXMgOlxuXHRcdEFOSU1fSU4gICAgICA6ICdhbmltLWluJ1xuXHRcdE1FTlVfT1BFTiAgICA6ICdtZW51LW9wZW4nXG5cdFx0TUVOVV9DTE9TSU5HIDogJ21lbnUtY2xvc2luZydcblx0XHROQVZfQUNUSVZFICAgOiAnYWN0aXZlJ1xuXG5cdHNpemVzIDpcblx0XHRERVNLVE9QIDogNzZcblx0XHRNT0JJTEUgIDogNjVcblxuXHRNRU5VX1RSQU5TSVRJT05fRFVSQVRJT04gOiAzMDBcblxuXHRtZW51T3BlbiA6IGZhbHNlXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0c3VwZXIoKVxuXG5cdFx0QCRuYXYgICAgICA9IEAkZWwuZmluZCgnbmF2ICcpXG5cdFx0QCRuYXZMaW5rcyA9IEAkbmF2LmZpbmQoJ2EnKVxuXG5cdFx0QHNldERpbXMoKVxuXHRcdEBiaW5kRXZlbnRzKClcblxuXHRcdHJldHVybiBudWxsXG5cblx0YmluZEV2ZW50cyA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uIEBOQygpLmFwcFZpZXcuRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBzZXREaW1zXG5cdFx0QE5DKCkucm91dGVyLm9uIFJvdXRlci5FVkVOVF9IQVNIX0NIQU5HRUQsIEBvbkhhc2hDaGFuZ2VcblxuXHRcdEAkZWwuZmluZCgnW2RhdGEtbW9iaWxlLW1lbnVdJykub24gd2luZG93LnRvdWNoRW5kSW50ZXJhY3Rpb24sIEB0b2dnbGVNZW51XG5cblx0XHRudWxsXG5cblx0dG9nZ2xlTWVudSA6ID0+XG5cblx0XHRpZiBAbWVudU9wZW4gdGhlbiBAY2xvc2VNZW51KCkgZWxzZSBAb3Blbk1lbnUoKVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0b3Blbk1lbnUgOiA9PlxuXG5cdFx0QHNpemVNb2JpbGVNZW51KClcblxuXHRcdEAkZWwuYWRkQ2xhc3MoQGNsYXNzTmFtZXMuTUVOVV9PUEVOKVxuXHRcdEBOQygpLmFwcFZpZXcuZGlzYWJsZVRvdWNoKClcblxuXHRcdEBtZW51T3BlbiA9IHRydWVcblxuXHRcdG51bGxcblxuXHRjbG9zZU1lbnUgOiA9PlxuXG5cdFx0QCRlbC5hZGRDbGFzcyhAY2xhc3NOYW1lcy5NRU5VX0NMT1NJTkcpLnJlbW92ZUNsYXNzKEBjbGFzc05hbWVzLk1FTlVfT1BFTilcblx0XHRATkMoKS5hcHBWaWV3LmVuYWJsZVRvdWNoKClcblx0XHRzZXRUaW1lb3V0IEBvbk1lbnVDbG9zZWQsIEBNRU5VX1RSQU5TSVRJT05fRFVSQVRJT05cblxuXHRcdEBtZW51T3BlbiA9IGZhbHNlXG5cblx0XHRudWxsXG5cblx0b25NZW51Q2xvc2VkIDogPT5cblxuXHRcdEAkZWwucmVtb3ZlQ2xhc3MoQGNsYXNzTmFtZXMuTUVOVV9DTE9TSU5HKVxuXG5cdFx0bnVsbFxuXG5cdHNpemVNb2JpbGVNZW51IDogPT5cblxuXHRcdEAkbmF2LmNzcyBcImhlaWdodFwiIDogQE5DKCkuYXBwVmlldy5kaW1zLmhcblxuXHRcdG51bGxcblxuXHR1blNpemVNb2JpbGVNZW51IDogPT5cblxuXHRcdEAkbmF2LmNzcyBcImhlaWdodFwiIDogXCJhdXRvXCJcblxuXHRcdG51bGxcblxuXHRzZXREaW1zIDogPT5cblxuXHRcdHJldHVybiB1bmxlc3MgQG1lbnVPcGVuXG5cblx0XHRpZiBNZWRpYVF1ZXJpZXMuZ2V0QnJlYWtwb2ludCgpIGlzICdTbWFsbGVzdCdcblx0XHRcdEBzaXplTW9iaWxlTWVudSgpXG5cdFx0ZWxzZVxuXHRcdFx0QHVuU2l6ZU1vYmlsZU1lbnUoKVxuXHRcdFx0QGNsb3NlTWVudSgpXG5cblx0XHRudWxsXG5cblx0YW5pbWF0ZUluIDogPT5cblxuXHRcdEAkZWwuYWRkQ2xhc3MgQGNsYXNzTmFtZXMuQU5JTV9JTlxuXG5cdFx0bnVsbFxuXG5cdG9uSGFzaENoYW5nZSA6ID0+XG5cblx0XHRAY2xvc2VNZW51KCkgaWYgQG1lbnVPcGVuXG5cblx0XHRhcmVhID0gQE5DKCkucm91dGVyLmFyZWFcblx0XHR1cmwgID0gQF9nZXRMaW5rVVJMIGFyZWFcblxuXHRcdEAkbmF2TGlua3Ncblx0XHRcdC5ub3QoXCJbaHJlZj1cXFwiI3t1cmx9XFxcIl1cIilcblx0XHRcdFx0LnJlbW92ZUNsYXNzKEBjbGFzc05hbWVzLk5BVl9BQ1RJVkUpXG5cdFx0XHRcdC5lbmQoKVxuXHRcdFx0LmZpbHRlcihcIltocmVmPVxcXCIje3VybH1cXFwiXVwiKVxuXHRcdFx0XHQuYWRkQ2xhc3MoQGNsYXNzTmFtZXMuTkFWX0FDVElWRSlcblxuXHRcdG51bGxcblxuXHRfZ2V0TGlua1VSTCA6IChhcmVhKSA9PlxuXG5cdFx0cmV0dXJuIEBOQygpLkJBU0VfVVJMICsgJy8nICsgYXJlYVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclxuIiwiQWJzdHJhY3RWaWV3ID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuXG5jbGFzcyBQcmVsb2FkZXIgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblx0XG5cdGNiIDogbnVsbFxuXHRcblx0VFJBTlNJVElPTl9EVVJBVElPTiA6IDYwMFxuXHRGSVJTVF9ISURFX0RFTEFZICAgIDogNTAwXG5cblx0Y2xhc3NOYW1lcyA6XG5cdFx0U0hPVyAgIDogJ3Nob3cnXG5cdFx0U0hPV04gIDogJ3Nob3duJ1xuXHRcdEhJRElORyA6ICdoaWRpbmcnXG5cblx0dGVtcGxhdGVOYW1lIDogJ3ByZWxvYWRlcidcblxuXHRjb25zdHJ1Y3RvciA6IChAdHlwZSwgJGVsLCBAY2xhc3NOYW1lKSAtPlxuXG5cdFx0aWYgJGVsIGlzbnQgbnVsbFxuXHRcdFx0QHNldEVsZW1lbnQgJGVsXG5cdFx0IyBlbHNlXG5cdFx0IyBcdEBzZXRFbEZyb21UZW1wbGF0ZSgpXG5cblx0XHRzdXBlcigpXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdCMgc2V0RWxGcm9tVGVtcGxhdGUgOiA9PlxuXG5cdCMgXHR0bXBsID0gXy50ZW1wbGF0ZSBATkMoKS50ZW1wbGF0ZXMuZ2V0KEB0ZW1wbGF0ZU5hbWUpXG5cdCMgXHRAc2V0RWxlbWVudCAkIHRtcGwgdHlwZSA6IEB0eXBlXG5cdCMgXHRAaW5pdGlhbGl6ZSB0cnVlXG5cblx0IyBcdG51bGxcblxuXHRpbml0IDogPT5cblxuXHRcdEAkbWFza091dGVyID0gQCRlbC5maW5kKCdbZGF0YS1wcmVsb2FkZXItbWFzaz1cIm91dGVyXCJdJylcblx0XHRAJG1hc2tJbm5lciA9IEAkZWwuZmluZCgnW2RhdGEtcHJlbG9hZGVyLW1hc2s9XCJpbm5lclwiXScpXG5cblx0XHRudWxsXG5cblx0cmVzZXQgOiA9PlxuXG5cdFx0QCRtYXNrT3V0ZXIuY3NzIFwid2lkdGhcIiwgXCIxMDAlXCJcblx0XHRAJG1hc2tJbm5lci5jc3MgXCJ3aWR0aFwiLCBcIjAlXCJcblxuXHRcdG51bGxcblxuXHRzaG93IDogKEBjYikgPT5cblxuXHRcdEAkZWwuYWRkQ2xhc3MgQGNsYXNzTmFtZXMuU0hPV1xuXG5cdFx0IyBAJGVsLmNzcyAnZGlzcGxheScgOiAnYmxvY2snXG5cblx0XHRudWxsXG5cblx0b25TaG93Q29tcGxldGUgOiA9PlxuXG5cdFx0QGNiPygpXG5cblx0XHRudWxsXG5cblx0aGlkZSA6IChAY2IpID0+XG5cblx0XHQjIGNvbnNvbGUubG9nIFwiISEhIEhJRElORyBQUkVMT0FERVIgISEhXCJcblxuXHRcdGlmIEB0eXBlIGlzICdzaXRlJyB0aGVuIEBnb1RvIDEwMFxuXG5cdFx0QCRlbC5hZGRDbGFzcyhAY2xhc3NOYW1lcy5ISURJTkcpLnJlbW92ZUNsYXNzKEBjbGFzc05hbWVzLlNIT1cpXG5cdFx0c2V0VGltZW91dCBAb25IaWRlQ29tcGxldGUsIEBUUkFOU0lUSU9OX0RVUkFUSU9OXG5cblx0XHRudWxsXG5cblx0Zmlyc3RIaWRlIDogKGNiKSA9PlxuXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0QGhpZGUgY2Jcblx0XHQsIEBGSVJTVF9ISURFX0RFTEFZXG5cblx0XHRudWxsXG5cblx0b25IaWRlQ29tcGxldGUgOiA9PlxuXG5cdFx0I0AkZWwuY3NzICdkaXNwbGF5JyA6ICdub25lJ1xuXHRcdEBjYj8oKVxuXHRcdEByZXNldCgpXG5cblx0XHRAJGVsLnJlbW92ZUNsYXNzKEBjbGFzc05hbWVzLkhJRElORylcblx0XHRpZiBAdHlwZSBpcyAnc2l0ZScgdGhlbiBAJGVsLmFkZENsYXNzKEBjbGFzc05hbWVzLlNIT1dOKVxuXG5cdFx0bnVsbFxuXG5cdGdvVG8gOiAodmFsdWUpID0+XG5cblx0XHQjIGNvbnNvbGUubG9nIFwiZ29UbyA6ICh2YWx1ZSkgPT5cIiwgdmFsdWVcblxuXHRcdHZhbHVlID0gaWYgdmFsdWUgPiAxMDAgdGhlbiAxMDAgZWxzZSB2YWx1ZVxuXG5cdFx0QCRtYXNrT3V0ZXIuY3NzIFwid2lkdGhcIiwgXCIjeygxMDAtdmFsdWUpfSVcIlxuXHRcdEAkbWFza0lubmVyLmNzcyBcIndpZHRoXCIsIFwiI3sodmFsdWUpfSVcIlxuXG5cdFx0bnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRlclxuIiwiQWJzdHJhY3RWaWV3ICAgID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuSG9tZVBhZ2VWaWV3ICAgID0gcmVxdWlyZSAnLi4vcGFnZXMvaG9tZVBhZ2UvSG9tZVBhZ2VWaWV3J1xuQWJvdXRQYWdlVmlldyAgID0gcmVxdWlyZSAnLi4vcGFnZXMvYWJvdXRQYWdlL0Fib3V0UGFnZVZpZXcnXG5Xb3JrUGFnZVZpZXcgICAgPSByZXF1aXJlICcuLi9wYWdlcy93b3JrUGFnZS9Xb3JrUGFnZVZpZXcnXG5Qcm9qZWN0UGFnZVZpZXcgPSByZXF1aXJlICcuLi9wYWdlcy9wcm9qZWN0UGFnZS9Qcm9qZWN0UGFnZVZpZXcnXG5Db250YWN0UGFnZVZpZXcgPSByZXF1aXJlICcuLi9wYWdlcy9jb250YWN0UGFnZS9Db250YWN0UGFnZVZpZXcnXG5OYXYgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi9yb3V0ZXIvTmF2J1xuU2Nyb2xsZXIgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vdXRpbHMvU2Nyb2xsZXInXG5cbmNsYXNzIFdyYXBwZXIgZXh0ZW5kcyBBYnN0cmFjdFZpZXdcblxuXHRAVklFV19VUERBVEVEIDogJ1ZJRVdfVVBEQVRFRCdcblxuXHR0ZW1wbGF0ZSAgICAgICAgICA6ICd3cmFwcGVyJ1xuXG5cdHZpZXdzICAgICAgICAgICAgIDogbnVsbFxuXHRwcmV2aW91c1ZpZXcgICAgICA6IG51bGxcblx0Y3VycmVudFZpZXcgICAgICAgOiBudWxsXG5cblx0cGFnZVN3aXRjaERmZCAgICAgOiBudWxsXG5cdGFjdGl2ZVZpZXdSZXF1ZXN0IDogbnVsbFxuXHRzY3JvbGxUb1RvcERmZCAgICA6IG51bGxcblxuXHRGSVJTVF9WSUVXICAgICAgICA6IHRydWVcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRAdmlld3MgPVxuXHRcdFx0aG9tZSAgICA6IGNsYXNzUmVmIDogSG9tZVBhZ2VWaWV3LCAgICBhcmVhIDogQE5DKCkubmF2LnNlY3Rpb25zLkhPTUUsICAgIHN1YiA6IGZhbHNlXG5cdFx0XHRhYm91dCAgIDogY2xhc3NSZWYgOiBBYm91dFBhZ2VWaWV3LCAgIGFyZWEgOiBATkMoKS5uYXYuc2VjdGlvbnMuQUJPVVQsICAgc3ViIDogZmFsc2Vcblx0XHRcdHdvcmsgICAgOiBjbGFzc1JlZiA6IFdvcmtQYWdlVmlldywgICAgYXJlYSA6IEBOQygpLm5hdi5zZWN0aW9ucy5XT1JLLCAgICBzdWIgOiBmYWxzZVxuXHRcdFx0cHJvamVjdCA6IGNsYXNzUmVmIDogUHJvamVjdFBhZ2VWaWV3LCBhcmVhIDogQE5DKCkubmF2LnNlY3Rpb25zLldPUkssICAgIHN1YiA6IHRydWVcblx0XHRcdGNvbnRhY3QgOiBjbGFzc1JlZiA6IENvbnRhY3RQYWdlVmlldywgYXJlYSA6IEBOQygpLm5hdi5zZWN0aW9ucy5DT05UQUNULCBzdWIgOiBmYWxzZVxuXG5cdFx0c3VwZXIoKVxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRnZXRWaWV3QnlVUkwgOiAoYXJlYSwgc3ViKSA9PlxuXG5cdFx0Zm9yIG5hbWUsIGRhdGEgb2YgQHZpZXdzXG5cdFx0XHRyZXR1cm4gQHZpZXdzW25hbWVdIGlmIChhcmVhIGlzIEB2aWV3c1tuYW1lXS5hcmVhKSBhbmQgKChAdmlld3NbbmFtZV0uc3ViIGFuZCBzdWIpIG9yICghQHZpZXdzW25hbWVdLnN1YiBhbmQgIXN1YikpXG5cblx0XHRudWxsXG5cblx0aW5pdCA6ID0+XG5cblx0XHRATkMoKS5hcHBWaWV3Lm9uICdzdGFydCcsIEBzdGFydFxuXG5cdFx0bnVsbFxuXG5cdHN0YXJ0IDogPT5cblxuXHRcdEBOQygpLmFwcFZpZXcub2ZmICdzdGFydCcsIEBzdGFydFxuXG5cdFx0QHVwZGF0ZURpbXMoKVxuXHRcdEBiaW5kRXZlbnRzKClcblxuXHRcdG51bGxcblxuXHRiaW5kRXZlbnRzIDogPT5cblxuXHRcdEBOQygpLm5hdi5vbiBOYXYuRVZFTlRfQ0hBTkdFX1ZJRVcsIEBjaGFuZ2VWaWV3XG5cdFx0QE5DKCkuYXBwVmlldy5vbiBATkMoKS5hcHBWaWV3LkVWRU5UX1VQREFURV9ESU1FTlNJT05TLCBAdXBkYXRlRGltc1xuXHRcdEBvbiBXcmFwcGVyLlZJRVdfVVBEQVRFRCwgQG9uVmlld1VwZGF0ZWRcblxuXHRcdG51bGxcblxuXHR1cGRhdGVEaW1zIDogPT5cblxuXHRcdEAkZWwuY3NzICdtaW4taGVpZ2h0JywgQE5DKCkuYXBwVmlldy5kaW1zLmhcblxuXHRcdG51bGxcblxuXHRjaGFuZ2VWaWV3IDogKGFyZWEsIHN1YiwgcXVlcnkpID0+XG5cblx0XHRpZiBAcGFnZVN3aXRjaERmZCBhbmQgQHBhZ2VTd2l0Y2hEZmQuc3RhdGUoKSBpc250ICdyZXNvbHZlZCdcblx0XHRcdGRvIChhcmVhLCBzdWIpID0+IEBwYWdlU3dpdGNoRGZkLmRvbmUgPT4gQGNoYW5nZVZpZXcgYXJlYSwgc3ViXG5cdFx0XHRyZXR1cm5cblxuXHRcdG5ld1ZpZXcgPSBAZ2V0Vmlld0J5VVJMIGFyZWEsIHN1YlxuXG5cdFx0QE5DKCkuYXBwVmlldy5wcmVsb2FkZXIuc2hvdygpXG5cblx0XHRAcHJldmlvdXNWaWV3ID0gQGN1cnJlbnRWaWV3XG5cdFx0QGN1cnJlbnRWaWV3ICA9IG5ldyBuZXdWaWV3LmNsYXNzUmVmIGFyZWEsIHN1YiwgcXVlcnlcblxuXHRcdGlmIEBGSVJTVF9WSUVXXG5cdFx0XHRAdHJhbnNpdGlvblZpZXdzKClcblx0XHRcdEBGSVJTVF9WSUVXID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRAZ2V0TmV3Vmlld0NvbnRlbnQoKVxuXG5cblx0XHRudWxsXG5cblx0Z2V0TmV3Vmlld0NvbnRlbnQgOiA9PlxuXG5cdFx0QHBhZ2VTd2l0Y2hEZmQgPSAkLkRlZmVycmVkKClcblxuXHRcdEBhY3RpdmVWaWV3UmVxdWVzdCA9IEBjdXJyZW50Vmlldy5nZXRWaWV3Q29udGVudCgpXG5cdFx0QHNjcm9sbFRvVG9wRGZkICAgID0gQHNjcm9sbFRvVG9wKClcblxuXHRcdGRmZHMgPSBbQGFjdGl2ZVZpZXdSZXF1ZXN0LCBAc2Nyb2xsVG9Ub3BEZmRdXG5cblx0XHQkLndoZW4uYXBwbHkoJCwgZGZkcykuZG9uZSA9PlxuXG5cdFx0XHRATkMoKS5hcHBWaWV3LnByZWxvYWRlci5oaWRlID0+XG5cblx0XHRcdFx0QHRyYW5zaXRpb25WaWV3cyBAcHJldmlvdXNWaWV3LCBAY3VycmVudFZpZXcsID0+XG5cblx0XHRcdFx0XHRAdHJpZ2dlciBXcmFwcGVyLlZJRVdfVVBEQVRFRFxuXG5cdFx0bnVsbFxuXG5cdHRyYW5zaXRpb25WaWV3cyA6IChmcm9tPUBwcmV2aW91c1ZpZXcsIHRvPUBjdXJyZW50VmlldywgY2IpID0+XG5cblx0XHQjIGNvbnNvbGUubG9nIFwidHJhbnNpdGlvblZpZXdzIDogKGZyb209QHByZXZpb3VzVmlldywgdG89QGN1cnJlbnRWaWV3KSA9PlwiLCBmcm9tLCB0b1xuXG5cdFx0IyBjb25zb2xlLmxvZyBcIiEhISBUUkFOU0lUSU9OSU5HIFZJRVdTICEhIVwiXG5cblx0XHRmb3JjZSA9IChmcm9tIGFuZCAoZnJvbSBpbnN0YW5jZW9mIFByb2plY3RQYWdlVmlldyBhbmQgdG8gaW5zdGFuY2VvZiBQcm9qZWN0UGFnZVZpZXcpKVxuXG5cdFx0aWYgIWZyb21cblx0XHRcdHRvLnNob3cgPT4gY2I/KClcblx0XHRlbHNlXG5cdFx0XHRmcm9tLmhpZGUgPT4gdG8uc2hvdyBmb3JjZSwgPT5cblx0XHRcdFx0QHBhZ2VTd2l0Y2hEZmQucmVzb2x2ZSgpXG5cdFx0XHRcdGNiPygpXG5cblx0XHRATkMoKS5hcHBWaWV3LmdldERpbXMoKVxuXG5cdFx0bnVsbFxuXG5cdG9uVmlld1VwZGF0ZWQgOiA9PlxuXG5cdFx0QHVwZGF0ZVBhZ2VUaXRsZSBAY3VycmVudFZpZXcucGFnZVRpdGxlXG5cblx0XHRudWxsXG5cblx0dXBkYXRlUGFnZVRpdGxlIDogKHRpdGxlKSA9PlxuXG5cdFx0IyBjb25zb2xlLmxvZyBcInVwZGF0ZVBhZ2VUaXRsZSA6ICh0aXRsZSkgPT5cIiwgdGl0bGVcblxuXHRcdGlmIHRpdGxlIGFuZCAod2luZG93LmRvY3VtZW50LnRpdGxlIGlzbnQgdGl0bGUpIHRoZW4gd2luZG93LmRvY3VtZW50LnRpdGxlID0gdGl0bGVcblxuXHRcdG51bGxcblxuXHRzY3JvbGxUb1RvcCA6ID0+XG5cblx0XHRkZmQgPSAkLkRlZmVycmVkKClcblxuXHRcdFNjcm9sbGVyLnNjcm9sbFRvIHRhcmdldCA6IDAsID0+IGRmZC5yZXNvbHZlKClcblxuXHRcdGRmZFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdyYXBwZXJcbiIsIkFic3RyYWN0VmlldyA9IHJlcXVpcmUgJy4uL0Fic3RyYWN0VmlldydcblxuY2xhc3MgQWJzdHJhY3RNb2RhbCBleHRlbmRzIEFic3RyYWN0Vmlld1xuXG5cdCR3aW5kb3cgOiBudWxsXG5cblx0IyMjIG92ZXJyaWRlIGluIGluZGl2aWR1YWwgY2xhc3NlcyAjIyNcblx0bmFtZSAgICAgOiBudWxsXG5cdHRlbXBsYXRlIDogbnVsbFxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdEAkd2luZG93ID0gJCh3aW5kb3cpXG5cblx0XHRzdXBlcigpXG5cblx0XHRATkMoKS5hcHBWaWV3LmFkZENoaWxkIEBcblx0XHRAc2V0TGlzdGVuZXJzICdvbidcblx0XHRAYW5pbWF0ZUluKClcblxuXHRcdHJldHVybiBudWxsXG5cblx0aGlkZSA6ID0+XG5cblx0XHRAYW5pbWF0ZU91dCA9PiBATkMoKS5hcHBWaWV3LnJlbW92ZSBAXG5cblx0XHRudWxsXG5cblx0ZGlzcG9zZSA6ID0+XG5cblx0XHRAc2V0TGlzdGVuZXJzICdvZmYnXG5cdFx0QE5DKCkuYXBwVmlldy5tb2RhbE1hbmFnZXIubW9kYWxzW0BuYW1lXS52aWV3ID0gbnVsbFxuXG5cdFx0c3VwZXIoKVxuXG5cdFx0bnVsbFxuXG5cdHNldExpc3RlbmVycyA6IChzZXR0aW5nKSA9PlxuXG5cdFx0QCR3aW5kb3dbc2V0dGluZ10gJ2tleXVwJywgQG9uS2V5VXBcblx0XHRAJCgnW2RhdGEtY2xvc2VdJylbc2V0dGluZ10gJ2NsaWNrJywgQGNsb3NlQ2xpY2tcblxuXHRcdG51bGxcblxuXHRvbktleVVwIDogKGUpID0+XG5cblx0XHRpZiBlLmtleUNvZGUgaXMgMjcgdGhlbiBAaGlkZSgpXG5cblx0XHRudWxsXG5cblx0YW5pbWF0ZUluIDogPT5cblxuXHRcdFR3ZWVuTGl0ZS50byBAJGVsLCAwLjMsIHsgJ3Zpc2liaWxpdHknOiAndmlzaWJsZScsICdvcGFjaXR5JzogMSwgZWFzZSA6IFF1YWQuZWFzZU91dCB9XG5cdFx0VHdlZW5MaXRlLnRvIEAkZWwuZmluZCgnLmlubmVyJyksIDAuMywgeyBkZWxheSA6IDAuMTUsICd0cmFuc2Zvcm0nOiAnc2NhbGUoMSknLCAndmlzaWJpbGl0eSc6ICd2aXNpYmxlJywgJ29wYWNpdHknOiAxLCBlYXNlIDogQmFjay5lYXNlT3V0IH1cblxuXHRcdG51bGxcblxuXHRhbmltYXRlT3V0IDogKGNhbGxiYWNrKSA9PlxuXG5cdFx0VHdlZW5MaXRlLnRvIEAkZWwsIDAuMywgeyBkZWxheSA6IDAuMTUsICdvcGFjaXR5JzogMCwgZWFzZSA6IFF1YWQuZWFzZU91dCwgb25Db21wbGV0ZTogY2FsbGJhY2sgfVxuXHRcdFR3ZWVuTGl0ZS50byBAJGVsLmZpbmQoJy5pbm5lcicpLCAwLjMsIHsgJ3RyYW5zZm9ybSc6ICdzY2FsZSgwLjgpJywgJ29wYWNpdHknOiAwLCBlYXNlIDogQmFjay5lYXNlSW4gfVxuXG5cdFx0bnVsbFxuXG5cdGNsb3NlQ2xpY2s6ICggZSApID0+XG5cblx0XHRlLnByZXZlbnREZWZhdWx0KClcblxuXHRcdEBoaWRlKClcblxuXHRcdG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdE1vZGFsXG4iLCJBYnN0cmFjdE1vZGFsID0gcmVxdWlyZSAnLi9BYnN0cmFjdE1vZGFsJ1xuXG5jbGFzcyBPcmllbnRhdGlvbk1vZGFsIGV4dGVuZHMgQWJzdHJhY3RNb2RhbFxuXG5cdG5hbWUgICAgIDogJ29yaWVudGF0aW9uTW9kYWwnXG5cdHRlbXBsYXRlIDogJ29yaWVudGF0aW9uLW1vZGFsJ1xuXG5cdGNiICAgICAgIDogbnVsbFxuXG5cdGNvbnN0cnVjdG9yIDogKEBjYikgLT5cblxuXHRcdEB0ZW1wbGF0ZVZhcnMgPSB7QG5hbWV9XG5cblx0XHRzdXBlcigpXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5cdGluaXQgOiA9PlxuXG5cdFx0bnVsbFxuXG5cdGhpZGUgOiAoc3RpbGxMYW5kc2NhcGU9dHJ1ZSkgPT5cblxuXHRcdEBhbmltYXRlT3V0ID0+XG5cdFx0XHRATkMoKS5hcHBWaWV3LnJlbW92ZSBAXG5cdFx0XHRpZiAhc3RpbGxMYW5kc2NhcGUgdGhlbiBAY2I/KClcblxuXHRcdG51bGxcblxuXHRzZXRMaXN0ZW5lcnMgOiAoc2V0dGluZykgPT5cblxuXHRcdHN1cGVyXG5cblx0XHRATkMoKS5hcHBWaWV3W3NldHRpbmddICd1cGRhdGVEaW1zJywgQG9uVXBkYXRlRGltc1xuXHRcdEAkZWxbc2V0dGluZ10gJ3RvdWNoZW5kIGNsaWNrJywgQGhpZGVcblxuXHRcdG51bGxcblxuXHRvblVwZGF0ZURpbXMgOiAoZGltcykgPT5cblxuXHRcdGlmIGRpbXMubyBpcyAncG9ydHJhaXQnIHRoZW4gQGhpZGUgZmFsc2VcblxuXHRcdG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBPcmllbnRhdGlvbk1vZGFsXG4iLCJBYnN0cmFjdFZpZXcgICAgID0gcmVxdWlyZSAnLi4vQWJzdHJhY3RWaWV3J1xuT3JpZW50YXRpb25Nb2RhbCA9IHJlcXVpcmUgJy4vT3JpZW50YXRpb25Nb2RhbCdcblxuY2xhc3MgTW9kYWxNYW5hZ2VyIGV4dGVuZHMgQWJzdHJhY3RWaWV3XG5cblx0IyB3aGVuIG5ldyBtb2RhbCBjbGFzc2VzIGFyZSBjcmVhdGVkLCBhZGQgaGVyZSwgd2l0aCByZWZlcmVuY2UgdG8gY2xhc3MgbmFtZVxuXHRtb2RhbHMgOlxuXHRcdG9yaWVudGF0aW9uTW9kYWwgOiBjbGFzc1JlZiA6IE9yaWVudGF0aW9uTW9kYWwsIHZpZXcgOiBudWxsXG5cblx0Y29uc3RydWN0b3IgOiAtPlxuXG5cdFx0c3VwZXIoKVxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRpbml0IDogPT5cblxuXHRcdG51bGxcblxuXHRpc09wZW4gOiA9PlxuXG5cdFx0KCBpZiBAbW9kYWxzW25hbWVdLnZpZXcgdGhlbiByZXR1cm4gdHJ1ZSApIGZvciBuYW1lLCBtb2RhbCBvZiBAbW9kYWxzXG5cblx0XHRmYWxzZVxuXG5cdGhpZGVPcGVuTW9kYWwgOiA9PlxuXG5cdFx0KCBpZiBAbW9kYWxzW25hbWVdLnZpZXcgdGhlbiBvcGVuTW9kYWwgPSBAbW9kYWxzW25hbWVdLnZpZXcgKSBmb3IgbmFtZSwgbW9kYWwgb2YgQG1vZGFsc1xuXG5cdFx0b3Blbk1vZGFsPy5oaWRlKClcblxuXHRcdG51bGxcblxuXHRzaG93TW9kYWwgOiAobmFtZSwgY2I9bnVsbCkgPT5cblxuXHRcdHJldHVybiBpZiBAbW9kYWxzW25hbWVdLnZpZXdcblxuXHRcdEBtb2RhbHNbbmFtZV0udmlldyA9IG5ldyBAbW9kYWxzW25hbWVdLmNsYXNzUmVmIGNiXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kYWxNYW5hZ2VyXG4iLCJBYnN0cmFjdFZpZXdQYWdlID0gcmVxdWlyZSAnLi4vLi4vQWJzdHJhY3RWaWV3UGFnZSdcblxuY2xhc3MgQWJvdXRQYWdlVmlldyBleHRlbmRzIEFic3RyYWN0Vmlld1BhZ2VcblxuXHR0ZW1wbGF0ZSA6ICdwYWdlLWFib3V0J1xuXG5cdHBhZ2VTaXplIDogNjAwMFxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdCMjI1xuXG5cdFx0aW5zdGFudGlhdGUgY2xhc3NlcyBoZXJlXG5cblx0XHRAZXhhbXBsZUNsYXNzID0gbmV3IEV4YW1wbGVDbGFzc1xuXG5cdFx0IyMjXG5cblx0XHRzdXBlclxuXG5cdFx0IyMjXG5cblx0XHRhZGQgY2xhc3NlcyB0byBhcHAgc3RydWN0dXJlIGhlcmVcblxuXHRcdEBcblx0XHRcdC5hZGRDaGlsZChAZXhhbXBsZUNsYXNzKVxuXG5cdFx0IyMjXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0UGFnZVZpZXdcbiIsIkFic3RyYWN0Vmlld1BhZ2UgPSByZXF1aXJlICcuLi8uLi9BYnN0cmFjdFZpZXdQYWdlJ1xuXG5jbGFzcyBDb250YWN0UGFnZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdQYWdlXG5cblx0dGVtcGxhdGUgOiAncGFnZS1jb250YWN0J1xuXG5cdHBhZ2VTaXplIDogNjAwMFxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdCMjI1xuXG5cdFx0aW5zdGFudGlhdGUgY2xhc3NlcyBoZXJlXG5cblx0XHRAZXhhbXBsZUNsYXNzID0gbmV3IEV4YW1wbGVDbGFzc1xuXG5cdFx0IyMjXG5cblx0XHRzdXBlclxuXG5cdFx0IyMjXG5cblx0XHRhZGQgY2xhc3NlcyB0byBhcHAgc3RydWN0dXJlIGhlcmVcblxuXHRcdEBcblx0XHRcdC5hZGRDaGlsZChAZXhhbXBsZUNsYXNzKVxuXG5cdFx0IyMjXG5cblx0XHRyZXR1cm4gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3RQYWdlVmlld1xuIiwiQWJzdHJhY3RWaWV3UGFnZSAgICAgICA9IHJlcXVpcmUgJy4uLy4uL0Fic3RyYWN0Vmlld1BhZ2UnXG5Ib21lVGFnbGluZXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vLi4vLi4vY29sbGVjdGlvbnMvdGFnbGluZXMvSG9tZVRhZ2xpbmVzQ29sbGVjdGlvbidcbldvcmRUcmFuc2l0aW9uZXIgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi91dGlscy9Xb3JkVHJhbnNpdGlvbmVyJ1xuXG5jbGFzcyBIb21lUGFnZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdQYWdlXG5cblx0dGVtcGxhdGUgOiAncGFnZS1ob21lJ1xuXG5cdHN0YXJ0VGFnbGluZVRpbWUgOiBudWxsXG5cdHRhZ2xpbmVUaW1lciAgICAgOiBudWxsXG5cblx0Q0hBTkdFX1RBR0xJTkVfSU5URVJWQUwgOiA1MDAwXG5cdEZJUlNUX1NIT1dfREVMQVkgICAgICAgIDogMTAwMFxuXG5cdHBhZ2VTaXplIDogNTAwMFxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdEB0YWdsaW5lcyA9IG5ldyBIb21lVGFnbGluZXNDb2xsZWN0aW9uXG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRzZXRMaXN0ZW5lcnMgOiAoc2V0dGluZykgPT5cblxuXHRcdGlmIHNldHRpbmcgaXMgJ29uJ1xuXG5cdFx0XHRAJHRhZ2xpbmUgPSBAJGVsLmZpbmQoJ1tkYXRhLXRhZ2xpbmVdJylcblx0XHRcdEBzdGFydFRhZ2xpbmVUaW1lID0gc2V0VGltZW91dCA9PlxuXHRcdFx0XHRAc2hvd0ZpcnN0VGFnbGluZSgpXG5cdFx0XHRcdEBnZXRUYWdsaW5lcygpXG5cdFx0XHRcdEBzdGFydFRhZ2xpbmVUaW1lcigpXG5cdFx0XHQsIChpZiBATkMoKS5hcHBWaWV3LndyYXBwZXIuRklSU1RfVklFVyB0aGVuIEBGSVJTVF9TSE9XX0RFTEFZIGVsc2UgMClcblxuXHRcdGVsc2VcblxuXHRcdFx0Y2xlYXJUaW1lb3V0IEBzdGFydFRhZ2xpbmVUaW1lXG5cdFx0XHRAc3RvcFRhZ2xpbmVUaW1lcigpXG5cblx0XHRudWxsXG5cblx0c2hvd0ZpcnN0VGFnbGluZSA6ID0+XG5cblx0XHRXb3JkVHJhbnNpdGlvbmVyLmluIEAkdGFnbGluZVxuXG5cdFx0bnVsbFxuXG5cdGdldFRhZ2xpbmVzIDogPT5cblxuXHRcdEB0YWdsaW5lcy5hZGQgd2luZG93Ll9UQUdMSU5FUy5zaGlmdCgpXG5cdFx0QHRhZ2xpbmVzLmFkZCBfLnNodWZmbGUgd2luZG93Ll9UQUdMSU5FU1xuXG5cdFx0bnVsbFxuXG5cdHN0YXJ0VGFnbGluZVRpbWVyIDogPT5cblxuXHRcdGNvbnNvbGUubG9nIFwic3RhcnRUYWdsaW5lVGltZXIgOiA9PlwiXG5cblx0XHRAdGFnbGluZVRpbWVyID0gc2V0SW50ZXJ2YWwgQGNoYW5nZVRhZ2xpbmUsIEBDSEFOR0VfVEFHTElORV9JTlRFUlZBTFxuXG5cdFx0bnVsbFxuXG5cdHN0b3BUYWdsaW5lVGltZXIgOiA9PlxuXG5cdFx0Y2xlYXJJbnRlcnZhbCBAdGFnbGluZVRpbWVyXG5cblx0XHRudWxsXG5cblx0Y2hhbmdlVGFnbGluZSA6ID0+XG5cblx0XHRjb25zb2xlLmxvZyBcImNoYW5nZVRhZ2xpbmUgOiA9PlwiXG5cblx0XHRXb3JkVHJhbnNpdGlvbmVyLm91dCBAJHRhZ2xpbmUsID0+XG5cblx0XHRcdEAkdGFnbGluZS5odG1sIEB0YWdsaW5lcy5nZXROZXh0KCkuZ2V0KCd0YWdsaW5lSFRNTCcpXG5cblx0XHRcdCMgbGl0dGxlIGRlbGF5IHRvIGFsbG93IERPTSB0byB1cGRhdGVcblx0XHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdFx0V29yZFRyYW5zaXRpb25lci5pbiBAJHRhZ2xpbmVcblx0XHRcdCwgMzAwXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZVBhZ2VWaWV3XG4iLCJBcHBWaWV3ICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vQXBwVmlldydcbkFic3RyYWN0Vmlld1BhZ2UgPSByZXF1aXJlICcuLi8uLi9BYnN0cmFjdFZpZXdQYWdlJ1xuV29yZFRyYW5zaXRpb25lciA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL1dvcmRUcmFuc2l0aW9uZXInXG5TY3JvbGxlciAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vdXRpbHMvU2Nyb2xsZXInXG5NZWRpYVF1ZXJpZXMgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vdXRpbHMvTWVkaWFRdWVyaWVzJ1xuXG5jbGFzcyBQcm9qZWN0UGFnZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdQYWdlXG5cblx0dGVtcGxhdGUgOiAncGFnZS1wcm9qZWN0J1xuXG5cdGRldmljZSA6ICdERVNLVE9QJyAjIGRlZmF1bHRcblxuXHRzaXplcyA6IFxuXHRcdFBBRERJTkdfREVTS1RPUCA6IDIwXG5cdFx0UEFERElOR19NT0JJTEUgIDogMTJcblx0XHRISURFX0hFQURJTkcgICAgOiA1MFxuXG5cdGNsYXNzTmFtZXMgOiB7fVxuXG5cdGNvbnN0cnVjdG9yIDogLT5cblxuXHRcdEBmaWx0ZXJQcmVmaXggPSBpZiBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdEZpbHRlciBpc250IHVuZGVmaW5lZCB0aGVuICctd2Via2l0LScgZWxzZSAnJ1xuXG5cdFx0c3VwZXJcblxuXHRcdHJldHVybiBudWxsXG5cblx0aW5pdCA6ID0+XG5cblx0XHRAJGhlcm8gICAgICA9IEAkZWwuZmluZCgnLnByb2otaGVybycpXG5cdFx0QCRoZWFkaW5nICAgPSBAJGVsLmZpbmQoJy5wcm9qLWhlYWRpbmcnKVxuXHRcdEAkdG9GYWRlT3V0ID0gQCRoZWFkaW5nLmFkZCBAJGVsLmZpbmQoJy5zY3JvbGwtdG8tY29udGVudCcpXG5cblx0XHRudWxsXG5cblx0c2V0TGlzdGVuZXJzIDogKHNldHRpbmcpID0+XG5cblx0XHRATkMoKS5hcHBWaWV3W3NldHRpbmddIEFwcFZpZXcuRVZFTlRfVVBEQVRFX0RJTUVOU0lPTlMsIEBvblJlc2l6ZVxuXHRcdEBOQygpLmFwcFZpZXdbc2V0dGluZ10gQXBwVmlldy5FVkVOVF9PTl9TQ1JPTEwsIEBvblNjcm9sbFxuXG5cdFx0QCRlbC5maW5kKCdbZGF0YS1zY3JvbGwtdG8tY29udGVudF0nKVtzZXR0aW5nXSAnY2xpY2snLCBAc2Nyb2xsVG9Db250ZW50XG5cblx0XHRpZiBzZXR0aW5nIGlzICdvbidcblx0XHRcdEBvblJlc2l6ZSgpXG5cdFx0XHRAc2hvd1RpdGxlKClcblxuXHRcdG51bGxcblxuXHRvblJlc2l6ZSA6ID0+XG5cblx0XHRAZGV2aWNlID0gaWYgTWVkaWFRdWVyaWVzLmdldEJyZWFrcG9pbnQoKSBpcyAnU21hbGwnIHRoZW4gJ01PQklMRScgZWxzZSdERVNLVE9QJ1xuXG5cdFx0QHNpemVzLkhJREVfSEVBRElORyA9IEBOQygpLmFwcFZpZXcuZGltcy5oIC0gQE5DKCkuYXBwVmlldy5oZWFkZXIuc2l6ZXNbQGRldmljZV1cblxuXHRcdEAkaGVyby5jc3MgJ2hlaWdodCcsIEBOQygpLmFwcFZpZXcuZGltcy5oIC0gQE5DKCkuYXBwVmlldy5oZWFkZXIuc2l6ZXNbQGRldmljZV0gLSBAc2l6ZXNbXCJQQURESU5HXyN7QGRldmljZX1cIl1cblxuXHRcdG51bGxcblxuXHRvblNjcm9sbCA6ID0+XG5cblx0XHRpZiBATkMoKS5hcHBWaWV3Lmxhc3RTY3JvbGxZID4gMCBhbmQgQE5DKCkuYXBwVmlldy5sYXN0U2Nyb2xsWSA8IEBzaXplcy5ISURFX0hFQURJTkdcblxuXHRcdFx0bWF4SGVhZGluZ1RyYW5zbGF0ZSA9IDE1MFxuXHRcdFx0bWF4SGVyb1NjYWxlICAgICAgICA9IChATkMoKS5hcHBWaWV3LmRpbXMudy8oQE5DKCkuYXBwVmlldy5kaW1zLnctKEBzaXplc1tcIlBBRERJTkdfI3tAZGV2aWNlfVwiXSoyKSkpLTFcblxuXHRcdFx0c3RhdGUgPSAoQE5DKCkuYXBwVmlldy5sYXN0U2Nyb2xsWSAvIEBzaXplcy5ISURFX0hFQURJTkcpXG5cblx0XHRcdGhlYWRpbmdUcmFuc2xhdGUgPSBzdGF0ZSAqIG1heEhlYWRpbmdUcmFuc2xhdGVcblx0XHRcdGhlYWRpbmdPcGFjaXR5ICAgPSAxIC0gc3RhdGVcblx0XHRcdGhlcm9TY2FsZSAgICAgICAgPSAxICsgKHN0YXRlICogbWF4SGVyb1NjYWxlKVxuXG5cdFx0XHRncmF5c2NhbGUgID0gc3RhdGVcblx0XHRcdGJyaWdodG5lc3MgPSAxIC0gKHN0YXRlKjAuNSlcblxuXHRcdFx0aGVyb0NTUyA9ICd0cmFuc2Zvcm0nOiBcInNjYWxlKCN7aGVyb1NjYWxlfSlcIlxuXHRcdFx0aGVyb0NTU1tcIiN7QGZpbHRlclByZWZpeH1maWx0ZXJcIl0gPSBcImdyYXlzY2FsZSgje2dyYXlzY2FsZX0pIGJyaWdodG5lc3MoI3ticmlnaHRuZXNzfSlcIlxuXG5cdFx0XHRAJHRvRmFkZU91dC5jc3MgJ3RyYW5zZm9ybSc6IEBDU1NUcmFuc2xhdGUoMCwgaGVhZGluZ1RyYW5zbGF0ZSwgJ3B4JyksICdvcGFjaXR5JzogaGVhZGluZ09wYWNpdHlcblx0XHRcdEAkaGVyby5jc3MgaGVyb0NTU1xuXG5cdFx0ZWxzZSBpZiBATkMoKS5hcHBWaWV3Lmxhc3RTY3JvbGxZIDw9IDBcblxuXHRcdFx0aGVyb0NTUyA9ICd0cmFuc2Zvcm0nOiAnbm9uZSdcblx0XHRcdGhlcm9DU1NbXCIje0BmaWx0ZXJQcmVmaXh9ZmlsdGVyXCJdID0gXCJub25lXCJcblxuXHRcdFx0QCR0b0ZhZGVPdXQuY3NzICd0cmFuc2Zvcm0nOiAnbm9uZScsICdvcGFjaXR5JzogMVxuXHRcdFx0QCRoZXJvLmNzcyBoZXJvQ1NTXG5cblx0XHRudWxsXG5cblx0c2Nyb2xsVG9Db250ZW50IDogPT5cblxuXHRcdHRhcmdldCA9IEBOQygpLmFwcFZpZXcuZGltcy5oIC0gQE5DKCkuYXBwVmlldy5oZWFkZXIuc2l6ZXNbQGRldmljZV0gLSBAc2l6ZXNbXCJQQURESU5HXyN7QGRldmljZX1cIl1cblxuXHRcdFNjcm9sbGVyLnNjcm9sbFRvIHRhcmdldCA6IHRhcmdldCwgPT5cblxuXHRcdFx0aXRlbXMgPSBbXVxuXHRcdFx0QCRlbC5maW5kKCdbZGF0YS1wb3N0LWludHJvXScpLmZpbmQoJ1tkYXRhLXNjcm9sbC1pdGVtXScpLmVhY2ggKGksIGVsKSA9PiBpdGVtcy5wdXNoICRlbCA6ICQoZWwpXG5cdFx0XHRATkMoKS5hcHBWaWV3LnNjcm9sbEl0ZW1JblZpZXcuc2hvd0l0ZW1zIGl0ZW1zIGlmIGl0ZW1zLmxlbmd0aFxuXG5cblx0XHRudWxsXG5cblx0c2hvd1RpdGxlIDogPT5cblxuXHRcdFdvcmRUcmFuc2l0aW9uZXIuaW4gQCRoZWFkaW5nXG5cblx0XHRudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdFBhZ2VWaWV3XG4iLCJBYnN0cmFjdFZpZXdQYWdlID0gcmVxdWlyZSAnLi4vLi4vQWJzdHJhY3RWaWV3UGFnZSdcbldvcmRUcmFuc2l0aW9uZXIgPSByZXF1aXJlICcuLi8uLi8uLi91dGlscy9Xb3JkVHJhbnNpdGlvbmVyJ1xuXG5jbGFzcyBXb3JrUGFnZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXdQYWdlXG5cblx0dGVtcGxhdGUgOiAncGFnZS13b3JrJ1xuXG5cdHBhZ2VTaXplIDogMTAwMDBcblxuXHRjb25zdHJ1Y3RvciA6IC0+XG5cblx0XHRzdXBlclxuXG5cdFx0cmV0dXJuIG51bGxcblxuXHRzaG93IDogPT5cblxuXHRcdHN1cGVyXG5cblx0XHQjIFdvcmRUcmFuc2l0aW9uZXIuaW4gQCRlbFxuXG5cdFx0bnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtQYWdlVmlld1xuIl19
