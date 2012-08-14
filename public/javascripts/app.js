(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/blocks": function(exports, require, module) {
  var Block, Blocks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Block = require('../models/block');

  module.exports = Blocks = (function(_super) {

    __extends(Blocks, _super);

    function Blocks() {
      return Blocks.__super__.constructor.apply(this, arguments);
    }

    Blocks.prototype.model = Block;

    Blocks.prototype.getBySlug = function(slug) {
      var result;
      result = null;
      this.each(function(b) {
        if (b.get('slug') === slug) {
          return result = b;
        }
      });
      return result;
    };

    return Blocks;

  })(Backbone.Collection);
  
}});

window.require.define({"collections/channels": function(exports, require, module) {
  var Channel, Channels,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Channel = require('..models/channel');

  module.exports = Channels = (function(_super) {

    __extends(Channels, _super);

    function Channels() {
      return Channels.__super__.constructor.apply(this, arguments);
    }

    Channels.prototype.model = Channel;

    return Channels;

  })(Backbone.Collection);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var AppView, Router, UpdateLoop, _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.Browser) == null) {
    this.Browser = {};
  }

  if ((_ref1 = Browser.Routers) == null) {
    Browser.Routers = {};
  }

  if ((_ref2 = Browser.Views) == null) {
    Browser.Views = {};
  }

  if ((_ref3 = Browser.Models) == null) {
    Browser.Models = {};
  }

  if ((_ref4 = Browser.Collections) == null) {
    Browser.Collections = {};
  }

  this.Channel = require('models/channel');

  this.Block = require('models/block');

  this.User = require('models/user');

  AppView = require('views/app_view');

  Router = require('../routers/app_router');

  UpdateLoop = function() {
    TWEEN.update();
    requestAnimationFrame(UpdateLoop);
    return null;
  };

  $(function() {
    require('../lib/app_helpers');
    console.log("@", this, Browser);
    Browser.router = new Router();
    Backbone.history.start();
    UpdateLoop();
    return this;
  });
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    Swag.Config.partialsPath = '../views/templates/';
    (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
  				   group,groupCollapsed,groupEnd,info,log,markTimeline,\
  				   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
    String.prototype.capitalize = function() {
      return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
        return p1 + p2.toUpperCase();
      });
    };
    String.prototype.clip = function(n) {
      return this.substr(0, n - 1) + (this.length > n ? "&hellip;" : "");
    };
    String.prototype.truncate = function(count) {
      var a, ar, len, nar, str, trunc, _i, _len;
      len = 120;
      if (!count) {
        count = 20;
      }
      ar = this.split(' ');
      nar = [];
      for (_i = 0, _len = ar.length; _i < _len; _i++) {
        a = ar[_i];
        nar.push(a.clip(count));
      }
      str = nar.join(' ');
      trunc = str;
      if (trunc.length > len) {
        trunc = trunc.substring(0, len);
        trunc = trunc.replace(/\w+$/, "");
        trunc += " ...";
      }
      return trunc;
    };
    Backbone.View.prototype.template = function() {};
    Backbone.View.prototype.getRenderData = function() {
      var _ref;
      return (_ref = this.model) != null ? _ref.toJSON() : void 0;
    };
    Backbone.View.prototype.render = function() {
      console.debug("Rendering " + this.constructor.name, this);
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };
    return Backbone.View.prototype.afterRender = function() {};
  })();
  
}});

window.require.define({"models/block": function(exports, require, module) {
  var Block,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Block = (function(_super) {

    __extends(Block, _super);

    function Block() {
      return Block.__super__.constructor.apply(this, arguments);
    }

    Block.prototype.defaults = {
      title: "Untitled"
    };

    return Block;

  })(Backbone.Model);
  
}});

window.require.define({"models/channel": function(exports, require, module) {
  var Blocks, Channel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Blocks = require('../collections/blocks');

  module.exports = Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      return Channel.__super__.constructor.apply(this, arguments);
    }

    Channel.prototype.urlRoot = 'http://are.na/api/v2/channels/';

    Channel.prototype.initialize = function() {
      return this.isParsed = false;
    };

    Channel.prototype.parse = function(o) {
      var c, i, _i, _len, _ref;
      console.log('parse', o, this.isParsed);
      if (this.isParsed || !o.channel) {
        return;
      }
      this.isParsed = true;
      if (!this.attributes.blocks) {
        this.attributes.blocks = new Blocks();
      }
      i = -1;
      _ref = o.channel.contents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.object) {
          this.attributes.blocks.add(c.object);
        } else {
          this.attributes.blocks.add(c);
        }
      }
      if (this.attributes.blocks) {
        this.attributes.blocks.model = this;
      }
      return Channel.__super__.parse.call(this, o.channel);
    };

    return Channel;

  })(Backbone.Model);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  var User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Backbone.Model);
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter, AppView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppView = require('../views/app_view');

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      this.index = __bind(this.index, this);
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.defaultChannel = 'semblance';

    AppRouter.prototype.routes = {
      ':slug': "channel",
      '': "index"
    };

    AppRouter.prototype.route = function(route, name, cb) {
      console.log('route yo ', route, name);
      return AppRouter.__super__.route.call(this, route, name, cb);
    };

    AppRouter.prototype.connect = function(uri) {
      var ar, channelSlug, connectionSlug;
      ar = uri.split('/');
      channelSlug = ar[0];
      connectionSlug = ar[1];
      return this.view.addConnection(connectionSlug);
    };

    AppRouter.prototype.channel = function(slug) {
      console.log('BOOO BOOO ', slug);
      if (slug === this.current_channel) {
        return;
      }
      this.current_channel = slug;
      console.log('rout index', slug);
      this.model = new Channel({
        id: slug
      });
      this.view = new AppView({
        channel: this.model
      });
      this.render(this.view.render().el);
      return this;
    };

    AppRouter.prototype.index = function() {
      return this.navigate(this.defaultChannel, true);
    };

    AppRouter.prototype.render = function(el) {
      return $('#body').html(el);
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var AppView, ChannelShow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ChannelShow = require('./channels/show_view');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.moveOffset = __bind(this.moveOffset, this);

      this.center = __bind(this.center, this);

      this.velocityLoop = __bind(this.velocityLoop, this);

      this.velocitySlowLoop = __bind(this.velocitySlowLoop, this);

      this.mouseUp = __bind(this.mouseUp, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.id = 'app';

    AppView.prototype.connectionCount = 0;

    AppView.prototype.template = require('./templates/index');

    AppView.prototype.offset = {
      x: 0,
      y: 0
    };

    AppView.prototype.targetOffset = {
      x: 0,
      y: 0
    };

    AppView.prototype.dragStart = {
      x: 0,
      y: 0
    };

    AppView.prototype.velocity = {
      x: 0,
      y: 0
    };

    AppView.prototype.velocityLoopId = 0;

    AppView.prototype.velocitySlowLoopId = 0;

    AppView.prototype.events = {
      "mousedown": "mouseDown",
      "mousemove": "mouseMove",
      "mouseup": "mouseUp"
    };

    AppView.prototype.mouseDown = function(e) {
      document.onselectstart = function() {
        return false;
      };
      if (e.target.id !== "app") {
        return;
      }
      this.isDragging = true;
      this.dragStart = {
        x: e.screenX,
        y: e.screenY
      };
      this.velocity.x = 0;
      this.velocity.y = 0;
      clearInterval(this.velocityLoopId);
      clearInterval(this.velocitySlowLoopId);
      this.velocitySlowLoopId = setInterval(this.velocitySlowLoop, 1000 / 60);
      $(window).mouseup(this.mouseUp);
      return this.$el.addClass("grabbed");
    };

    AppView.prototype.mouseUp = function(e) {
      document.onselectstart = function() {
        return true;
      };
      if (!this.isDragging) {
        return;
      }
      this.velocityLoopId = setInterval(this.velocityLoop, 1000 / 60);
      this.isDragging = false;
      return this.$el.removeClass("grabbed");
    };

    AppView.prototype.velocitySlowLoop = function() {
      this.velocity.x *= .95;
      this.velocity.y *= .95;
      if (this.velocity.x < .01 && this.velocity.y < .01) {
        return clearInterval(this.velocitySlowLoop);
      }
    };

    AppView.prototype.velocityLoop = function() {
      this.offset.x += this.velocity.x;
      this.offset.y += this.velocity.y;
      this.moveOffset();
      if (this.velocity.x < .01 && this.velocity.y < .01) {
        return clearInterval(this.velocityLoopId);
      }
    };

    AppView.prototype.mouseMove = function(e) {
      var p;
      if (!this.isDragging) {
        return;
      }
      p = {
        x: e.screenX,
        y: e.screenY
      };
      this.offset.x += p.x - this.dragStart.x;
      this.offset.y += p.y - this.dragStart.y;
      this.velocity.x += 0.1 * (p.x - this.dragStart.x);
      this.velocity.y += 0.1 * (p.y - this.dragStart.y);
      this.moveOffset();
      return this.dragStart = p;
    };

    AppView.prototype.initialize = function() {
      EventBus.addEventListener('center', this.center);
      return this;
    };

    AppView.prototype.center = function(e) {
      var p;
      this.targetOffset = {
        x: e.target.x,
        y: e.target.y
      };
      p = {
        x: -e.target.x,
        y: -e.target.y
      };
      return new TWEEN.Tween(this.offset).to(p, 1000).onUpdate(this.moveOffset).start();
    };

    AppView.prototype.moveOffset = function() {
      this.$('#offset').css('left', this.offset.x);
      return this.$('#offset').css('top', this.offset.y);
    };

    AppView.prototype.render = function() {
      var channel;
      this.$el.html(this.template);
      channel = this.options.channel;
      channel.set('isRoot', true);
      this.rootView = new ChannelShow({
        model: channel
      });
      this.rootView.position.z = this.connectionCount += 1000;
      this.rootView.showRoot = true;
      if (!channel.hasChanged()) {
        channel.fetch();
      }
      this.$('#offset').append(this.rootView.render().el);
      return this;
    };

    AppView.prototype.addConnection = function(slug) {
      var model, originalBlock, view;
      originalBlock = this.options.channel.get('blocks').getBySlug(slug);
      model = new Channel({
        id: slug
      });
      model.originalBlock = originalBlock;
      this.connectionCount += 1000;
      originalBlock.view.position.z += this.connectionCount;
      originalBlock.view.updateZ();
      originalBlock.view.showLoader();
      model.fetch({
        success: function() {
          return originalBlock.view.hideLoader();
        }
      });
      originalBlock.nestedModel = model;
      view = new ChannelShow({
        model: model
      });
      model.view = view;
      view.position.x = this.targetOffset.x;
      view.position.y = this.targetOffset.y;
      view.position.z = this.connectionCount;
      this.$('#offset').append(view.render().el);
      return this;
    };

    return AppView;

  })(Backbone.View);
  
}});

window.require.define({"views/blocks/show_view": function(exports, require, module) {
  var BlocksShow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BlocksShow = (function(_super) {

    __extends(BlocksShow, _super);

    function BlocksShow() {
      this.updateZ = __bind(this.updateZ, this);

      this.mouseLeave = __bind(this.mouseLeave, this);

      this.mouseEnter = __bind(this.mouseEnter, this);

      this.zoomIn = __bind(this.zoomIn, this);
      return BlocksShow.__super__.constructor.apply(this, arguments);
    }

    BlocksShow.prototype.template = require("../templates/blocks/show");

    BlocksShow.prototype.className = "block";

    BlocksShow.prototype.position = {
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
      radius: 0,
      delay: 0
    };

    BlocksShow.prototype.startPosition = {
      x: 0,
      y: 0
    };

    BlocksShow.prototype.shadow = {
      alpha: 0,
      maxAlpha: .2
    };

    BlocksShow.prototype.useAnimation = true;

    BlocksShow.prototype.events = {
      "mouseenter .container": "mouseEnter",
      "mouseleave .container": "mouseLeave",
      "click a.channel": "openChannel"
    };

    BlocksShow.prototype.openImage = function(e) {
      return e.preventDefault();
    };

    BlocksShow.prototype.openChannel = function(e) {
      var channelJson, pos, target,
        _this = this;
      e.preventDefault();
      if (this.isOpen) {
        this.close();
        return null;
      }
      this.isOpen = true;
      pos = this.zoomIn(function() {
        return Browser.router.connect(channelJson.slug + '/' + e.target.dataset.slug);
      });
      EventBus.dispatch("center", pos);
      channelJson = this.model.collection.model.toJSON();
      return null;
      target = $(e.target).parents('.block');
      console.log(target.offset());
      return EventBus.dispatch("center", target.position());
    };

    BlocksShow.prototype.close = function() {
      this.isOpen = false;
      this.$el.animate({
        'left': this.position.x,
        'top': this.position.y
      });
      EventBus.dispatch("center", this.position);
      this.model.nestedModel.view.close();
      return this;
    };

    BlocksShow.prototype.zoomIn = function(onComplete) {
      var p, rad;
      rad = 600;
      p = {
        x: this.position.x + Math.cos(this.position.angle) * rad,
        y: this.position.y + Math.sin(this.position.angle) * rad
      };
      this.$el.animate({
        'left': p.x,
        'top': p.y
      }, 1000, onComplete);
      return p;
    };

    BlocksShow.prototype.mouseEnter = function() {
      return this.$el.css('z-index', 100001);
    };

    BlocksShow.prototype.mouseLeave = function() {
      return this.$el.css('z-index', this.position.z);
    };

    BlocksShow.prototype.render = function() {
      console.log(this.model.toJSON());
      this.$el.html(this.template({
        model: this.model.toJSON()
      }));
      if (this.model.get('title')) {
        console.log(this.model.get('title').truncate());
      }
      this.$('a.lightbox').lightBox();
      this.updateZ();
      this.animateIn();
      this.animateShadow();
      return this;
    };

    BlocksShow.prototype.updateZ = function() {
      return this.$el.css('z-index', this.position.z);
    };

    BlocksShow.prototype.animateIn = function() {
      var _this = this;
      this.$el.css('top', this.startPosition.y);
      this.$el.css('left', this.startPosition.x);
      if (this.useAnimation) {
        return setTimeout(function() {
          return _this.$el.animate({
            'top': _this.position.y,
            'left': _this.position.x
          }, 1000);
        }, this.position.delay);
      } else {
        this.$el.css('top', this.position.y);
        return this.$el.css('left', this.position.x);
      }
    };

    BlocksShow.prototype.animateShadow = function() {
      var shadowDiv, tween,
        _this = this;
      shadowDiv = this.$('.shadow');
      return tween = new TWEEN.Tween(this.shadow).to({
        alpha: this.shadow.maxAlpha
      }, 2000).delay(this.position.delay).onUpdate(function() {
        return shadowDiv.css('box-shadow', '0 0 50px rgba(0,0,0,' + _this.shadow.alpha + ')');
      }).start();
    };

    BlocksShow.prototype.fadeOut = function() {
      return this.$el.fadeOut();
    };

    BlocksShow.prototype.showLoader = function() {
      return this.$('.loader').fadeIn();
    };

    BlocksShow.prototype.hideLoader = function() {
      return this.$('.loader').fadeOut();
    };

    return BlocksShow;

  })(Backbone.View);
  
}});

window.require.define({"views/channels/show_view": function(exports, require, module) {
  var BlockShow, ChannelsShow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BlockShow = require('../blocks/show_view');

  module.exports = ChannelsShow = (function(_super) {

    __extends(ChannelsShow, _super);

    function ChannelsShow() {
      this.add = __bind(this.add, this);

      this.render = __bind(this.render, this);
      return ChannelsShow.__super__.constructor.apply(this, arguments);
    }

    ChannelsShow.prototype.blocks = [];

    ChannelsShow.prototype.position = {
      x: 0,
      y: 0,
      z: 1000
    };

    ChannelsShow.prototype.openChannel = function(e) {
      return console.log('open channel', e);
    };

    ChannelsShow.prototype.initialize = function() {
      this.model.bind('reset', this.render);
      this.model.bind('change', this.render);
      return this;
    };

    ChannelsShow.prototype.render = function() {
      var blocks, count, i, rad,
        _this = this;
      if (!this.model.hasChanged()) {
        return this;
      }
      this.$el.html("");
      blocks = this.model.get('blocks');
      count = blocks.length;
      i = 0;
      rad = count * 10 + 200;
      blocks.each(function(b) {
        _this.add(b, i, count, rad);
        return i += 1;
      });
      if (this.showRoot) {
        this.add(this.model, 1, 1, 0);
      }
      return this;
    };

    ChannelsShow.prototype.close = function() {
      var blocks,
        _this = this;
      blocks = this.model.get('blocks');
      return blocks.each(function(b) {
        return b.view.fadeOut();
      });
    };

    ChannelsShow.prototype.add = function(m, i, count, rad) {
      var angle, maxRandom, view;
      maxRandom = 20;
      view = new BlockShow({
        model: m
      });
      angle = Math.PI * 2 * i / count;
      view.position = {
        angle: angle,
        x: this.position.x + Math.cos(angle) * rad,
        y: this.position.y + Math.sin(angle) * rad,
        radius: rad,
        z: this.position.z - i,
        delay: i * 100
      };
      view.startPosition = this.position;
      m.view = view;
      return this.$el.append(view.render().el);
    };

    return ChannelsShow;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/blocks/show": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div class="container">\n\t<div class="cell">\n\t\t<div class="box">\n\n\t\t');
      
        if (this.model["class"] === "Image") {
          __out.push('\n\t\t\t<a href="');
          __out.push(__sanitize(this.model.image.display.url));
          __out.push('" class="image lightbox"><img src=\'');
          __out.push(__sanitize(this.model.image.thumb.url));
          __out.push('\' /></a>\n\t\t');
        } else if (this.model["class"] === "Link") {
          __out.push('\n\t\t\t<div class="text"><p><a href="');
          __out.push(__sanitize(this.model.source.url));
          __out.push('" target="_blank">');
          __out.push(__sanitize(this.model.title));
          __out.push('</a></p>\n\t\t\t');
          if (this.model.description && this.model.description.plaintext) {
            __out.push('\n\t\t\t\t');
            __out.push(this.model.description.plaintext.truncate(10));
            __out.push('\n\t\t\t');
          }
          __out.push('\n\t\t\t</div>\n\t\t');
        } else if (this.model["class"] === "Media") {
          __out.push('\n\t\t\t<div class="text">\n\t\t\t<p>\n\t\t\t\t<a href="');
          __out.push(__sanitize(this.model.source.url));
          __out.push('" target="_blank">');
          __out.push(__sanitize(this.model.title));
          __out.push('</a>\n\t\t\t</p>\n\t\t\t');
          if (this.model.description && this.model.description.plaintext) {
            __out.push('\n\t\t\t\t');
            __out.push(this.model.description.plaintext.truncate(10));
            __out.push('\n\t\t\t');
          }
          __out.push('\n\t\t\t</div>\n\t\t');
        } else if (this.model["class"] === "Text") {
          __out.push('\n\t\t\t<div class="text">\n\t\t\t<p>');
          __out.push(__sanitize(this.model.title));
          __out.push('</a></p>\n\t\t\t');
          __out.push(this.model.content.plaintext.truncate(10));
          __out.push('\n\t\t\t</div>\n\t\t');
        } else if (this.model.kind === "default" || this.model["class"] === "Channel") {
          __out.push('\n\t\t\t');
          if (this.model.isRoot) {
            __out.push('\n\t\t\t\t<div class="title channel ');
            __out.push(__sanitize(this.model.status));
            __out.push('">');
            __out.push(__sanitize(this.model.title));
            __out.push('</div>\n\t\t\t');
          } else {
            __out.push('\n\t\t\t\t<a href="#" data-slug="');
            __out.push(__sanitize(this.model.slug));
            __out.push('" class="channel ');
            __out.push(__sanitize(this.model.status));
            __out.push('">');
            __out.push(__sanitize(this.model.title));
            __out.push('</a>\n\t\t\t');
          }
          __out.push('\n\t\t\t<div class="loader"><img src="images/lightbox-ico-loading.gif"/></div>\n\t\t');
        }
      
        __out.push('\n\t\t</div>\n\t</div>\n</div>\n<div class="shadow"></div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/index": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div id="container">\n\t<div id="offset">\n\t</div>\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

