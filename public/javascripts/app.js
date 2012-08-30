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

window.require.define({"lib/colorutils": function(exports, require, module) {
  var ColorUtils;

  module.exports = ColorUtils = (function() {

    function ColorUtils() {}

    ColorUtils.rgbToHsl = function(r, g, b) {
      var d, h, l, max, min, s;
      r /= 255;
      g /= 255;
      b /= 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return [h, s, l];
    };

    ColorUtils.hslToHex = function(color) {
      return this.rgbToHex(this.hslToRgb(color[0], color[1], color[2]));
    };

    ColorUtils.hsvToHex = function(color) {
      return this.rgbToHex(this.hsvToRgb(color[0], color[1], color[2]));
    };

    ColorUtils.componentToHex = function(c) {
      var hex;
      hex = c.toString(16);
      if (hex.length === 1) {
        return "0" + hex;
      } else {
        return hex;
      }
    };

    ColorUtils.rgbToHex = function(color) {
      return this.componentToHex(Math.floor(color[0])) + this.componentToHex(Math.floor(color[1])) + this.componentToHex(Math.floor(color[2]));
    };

    ColorUtils.hslToRgb = function(h, s, l) {
      var b, g, hue2rgb, p, q, r;
      r = void 0;
      g = void 0;
      b = void 0;
      if (s === 0) {
        r = g = b = l;
      } else {
        hue2rgb = function(p, q, t) {
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1 / 2) {
            return q;
          }
          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }
          return p;
        };
        q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r, g, b];
    };

    ColorUtils.rgbToHsv = function(r, g, b) {
      var d, h, max, min, s, v;
      r = r / 255;
      g = g / 255;
      b = b / 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      v = max;
      d = max - min;
      s = (max === 0 ? 0 : d / max);
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return [h, s, v];
    };

    ColorUtils.hsvToRgb = function(h, s, v) {
      var b, f, g, i, p, q, r, t;
      r = void 0;
      g = void 0;
      b = void 0;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
      return [r * 255, g * 255, b * 255];
    };

    return ColorUtils;

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

window.require.define({"models/block_particle": function(exports, require, module) {
  var BlockParticle,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BlockParticle = (function(_super) {

    __extends(BlockParticle, _super);

    function BlockParticle() {
      return BlockParticle.__super__.constructor.apply(this, arguments);
    }

    return BlockParticle;

  })(Particle);
  
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
      if (this.isParsed || !o) {
        return;
      }
      this.isParsed = true;
      if (!this.attributes.blocks) {
        this.attributes.blocks = new Blocks();
      }
      i = -1;
      if (o.contents) {
        _ref = o.contents;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (c.object) {
            this.attributes.blocks.add(c.object);
          } else {
            this.attributes.blocks.add(c);
          }
        }
      }
      if (this.attributes.blocks) {
        this.attributes.blocks.model = this;
      }
      return Channel.__super__.parse.call(this, o);
    };

    return Channel;

  })(Backbone.Model);
  
}});

window.require.define({"models/queue_item": function(exports, require, module) {
  var LoadQueueItem;

  module.exports = LoadQueueItem = (function() {

    function LoadQueueItem() {}

    LoadQueueItem.prototype.type = null;

    LoadQueueItem.prototype.model = null;

    LoadQueueItem.prototype.particle = null;

    return LoadQueueItem;

  })();
  
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
  var AppRouter, AppView, MacroView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppView = require('../views/app_view');

  MacroView = require('../views/physics/macro_view');

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      this.index = __bind(this.index, this);

      this.macro = __bind(this.macro, this);
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.defaultChannel = 'semblance';

    AppRouter.prototype.routes = {
      ':slug': 'macro',
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
      if (slug === this.current_channel) {
        return;
      }
      this.current_channel = slug;
      this.model = new Channel({
        id: slug
      });
      this.view = new AppView({
        channel: this.model
      });
      this.render(this.view.render().el);
      return this;
    };

    AppRouter.prototype.macro = function(slug) {
      if (slug === this.current_channel) {
        return;
      }
      this.current_channel = slug;
      this.model = new Channel({
        id: slug
      });
      this.view = new MacroView({
        channel: this.model
      });
      this.render(this.view.el);
      return this.view.render();
    };

    AppRouter.prototype.index = function() {
      return this.macro(this.defaultChannel);
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

window.require.define({"views/physics/macro_view": function(exports, require, module) {
  var ColorUtils, MacroView, QueueItem, WebGLView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  WebGLView = require('./webgl_view');

  ColorUtils = require('/lib/colorutils');

  QueueItem = require('/models/queue_item');

  module.exports = MacroView = (function(_super) {

    __extends(MacroView, _super);

    function MacroView() {
      this.resize = __bind(this.resize, this);

      this.update = __bind(this.update, this);

      this.step = __bind(this.step, this);

      this.cursorMove = __bind(this.cursorMove, this);

      this.dblClick = __bind(this.dblClick, this);

      this.setup = __bind(this.setup, this);

      this.getCenter = __bind(this.getCenter, this);

      this.getRandomPosition = __bind(this.getRandomPosition, this);

      this.loadConnectionComplete = __bind(this.loadConnectionComplete, this);

      this.queueLoad = __bind(this.queueLoad, this);

      this.queueStart = __bind(this.queueStart, this);

      this.addToQueue = __bind(this.addToQueue, this);

      this.loadBlocks = __bind(this.loadBlocks, this);

      this.loadConnections = __bind(this.loadConnections, this);

      this.loadChannel = __bind(this.loadChannel, this);

      this.setRoot = __bind(this.setRoot, this);

      this.render = __bind(this.render, this);

      this.moveOffset = __bind(this.moveOffset, this);

      this.velocityLoop = __bind(this.velocityLoop, this);

      this.velocitySlowLoop = __bind(this.velocitySlowLoop, this);

      this.mouseUp = __bind(this.mouseUp, this);
      return MacroView.__super__.constructor.apply(this, arguments);
    }

    MacroView.prototype.id = 'app';

    MacroView.prototype.offset = {
      x: 0,
      y: 0
    };

    MacroView.prototype.targetOffset = {
      x: 0,
      y: 0
    };

    MacroView.prototype.dragStart = {
      x: 0,
      y: 0
    };

    MacroView.prototype.velocity = {
      x: 0,
      y: 0
    };

    MacroView.prototype.mouseX = 0;

    MacroView.prototype.mouseY = 0;

    MacroView.prototype.childMultiplier = 5;

    MacroView.prototype.velocityLoopId = 0;

    MacroView.prototype.velocitySlowLoopId = 0;

    MacroView.prototype.events = {
      "mousedown": "mouseDown",
      "mousemove": "mouseMove",
      "mouseup": "mouseUp"
    };

    MacroView.prototype.mouseDown = function(e) {
      document.onselectstart = function() {
        return false;
      };
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

    MacroView.prototype.mouseUp = function(e) {
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

    MacroView.prototype.velocitySlowLoop = function() {
      this.velocity.x *= .9;
      this.velocity.y *= .9;
      if (this.velocity.x < .01 && this.velocity.y < .01) {
        return clearInterval(this.velocitySlowLoop);
      }
    };

    MacroView.prototype.velocityLoop = function() {
      this.offset.x += this.velocity.x * (1 / this.renderer.zoom);
      this.offset.y += this.velocity.y * (1 / this.renderer.zoom);
      this.moveOffset();
      if (this.velocity.x < .01 && this.velocity.y < .01) {
        return clearInterval(this.velocityLoopId);
      }
    };

    MacroView.prototype.mouseMove = function(e) {
      var p;
      this.cursorMove(e);
      if (!this.isDragging) {
        return;
      }
      p = {
        x: e.screenX,
        y: e.screenY
      };
      this.offset.x += (p.x - this.dragStart.x) * (1 / this.renderer.zoom);
      this.offset.y += (p.y - this.dragStart.y) * (1 / this.renderer.zoom);
      this.velocity.x += 0.1 * (p.x - this.dragStart.x);
      this.velocity.y += 0.1 * (p.y - this.dragStart.y);
      this.moveOffset();
      return this.dragStart = p;
    };

    MacroView.prototype.moveOffset = function() {
      return null;
    };

    MacroView.prototype.render = function() {
      var c;
      this.setup();
      c = this.options.channel;
      c.set('isRoot', true);
      c.bind('change', this.setRoot);
      if (!c.hasChanged()) {
        c.fetch();
      }
      return this;
    };

    MacroView.prototype.setRoot = function(channel) {
      var center, centerParticle;
      centerParticle = this.makeParticle(10);
      channel.particle = centerParticle;
      center = this.getCenter();
      centerParticle.moveTo(center);
      centerParticle.angleCount = 1;
      centerParticle.level = 0;
      centerParticle.angleOffset = 0.0;
      return this.loadBlocks(channel);
    };

    MacroView.prototype.loadChannel = function(channel) {
      var angleVary, link, p, rad;
      link = channel.linkParticle;
      p = this.makeParticle(10, null, link, rad);
      angleVary = (Math.PI * 2) * (1 / link.angleCount);
      p.angleOffset = angleVary * (i / count) + offset;
      p.angleOffset = link.angleOffset;
      p.angleCount = link.angleCount;
      rad = 100;
      p.moveTo(Vector.add(link.pos, new Vector(Math.cos(p.angleOffset) * rad, Math.sin(p.angleOffset) * rad)));
      channel.particle = p;
      return this.loadBlocks(channel);
    };

    MacroView.prototype.loadConnections = function(block) {
      var angleVary, c, channel, colour, count, i, nextLevel, np, offset, p, particle, rad, repeat, _i, _len, _ref, _results;
      count = block.get('connections').length;
      particle = block.particle;
      count = particle.angleCount;
      nextLevel = particle.level + 1;
      rad = block.get('connections').length * 3 + 50;
      angleVary = (Math.PI * 2) * (1 / particle.angleCount);
      if (particle.angleCount > 1) {
        angleVary *= this.childMultiplier;
      }
      offset = particle.angleOffset;
      i = 0;
      _ref = block.get('connections');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c) {
          np = particle;
          repeat = false;
          while (np) {
            if (np.block && np.block.channel) {
              if (np.block.channel.get('slug') === c.slug) {
                repeat = true;
              }
            }
            if (np.linkParticle) {
              np = np.linkParticle;
            } else {
              np = null;
            }
          }
          if (!repeat && c.slug !== block.channel.get('slug')) {
            channel = new Channel({
              id: c.slug
            });
            channel.linkParticle = particle;
            colour = ColorUtils.hslToRgb(i / count, 1, Math.max(.3, 1 - (nextLevel / this.maxLevels)));
            p = this.makeParticle(5, c, colour, particle, rad);
            p.linkParticle = particle;
            p.title = c.title;
            p.slug = c.slug;
            p.channel = channel;
            p.angleOffset = angleVary * (i / count) + offset;
            p.colour = ColorUtils.hslToRgb(i / count, 1, .5);
            p.level = nextLevel;
            p.angleCount = count;
            p.moveTo(Vector.add(block.particle.pos, new Vector(Math.cos(p.angleOffset) * rad, Math.sin(p.angleOffset) * rad)));
            channel.particle = p;
            channel.bind('change', this.loadConnectionComplete);
            i += 1;
            _results.push(this.addToQueue(channel));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MacroView.prototype.loadBlocks = function(channel) {
      var angleVary, count, i, nextLevel, offset, particle, rad,
        _this = this;
      count = channel.get('blocks').length;
      particle = channel.particle;
      particle.setRadius(count);
      rad = count * 3 + 50;
      i = 0;
      nextLevel = particle.level + 1;
      angleVary = (Math.PI * 2) * (1 / particle.angleCount);
      if (particle.angleCount > 1) {
        angleVary *= this.childMultiplier;
      }
      offset = particle.angleOffset;
      offset -= angleVary / 2;
      return channel.get('blocks').each(function(b) {
        var colour, p;
        colour = ColorUtils.hslToRgb(i / count, 1, Math.max(.3, 1 - (nextLevel / _this.maxLevels)));
        p = _this.makeParticle(5, b, colour, particle, rad);
        p.linkParticle = particle;
        p.level = nextLevel;
        p.title = b.get('title');
        p.slug = channel.get('slug');
        p.block = b;
        b.channel = channel;
        p.angleOffset = angleVary * (i / count) + offset;
        p.angleCount = count + particle.angleCount;
        p.moveTo(Vector.add(channel.particle.pos, new Vector(Math.cos(p.angleOffset) * rad, Math.sin(p.angleOffset) * rad)));
        b.particle = p;
        if (b.get('connections')) {
          _this.loadConnections(b);
        }
        return i += 1;
      });
    };

    MacroView.prototype.makeParticle = function(radius, block, colour, centerParticle, spacing, stiffness) {
      var p, s;
      if (colour == null) {
        colour = null;
      }
      if (centerParticle == null) {
        centerParticle = null;
      }
      if (spacing == null) {
        spacing = 50;
      }
      if (stiffness == null) {
        stiffness = 0.001;
      }
      p = new Particle(radius);
      if (colour) {
        p.colour = colour;
      }
      p.setRadius(p.mass);
      p.moveTo(this.getRandomPosition());
      if (centerParticle) {
        s = new Spring(centerParticle, p, spacing, stiffness);
        p.spring = s;
        this.physics.springs.push(s);
      }
      this.physics.particles.push(p);
      this.renderer.addParticle(p);
      return p;
    };

    MacroView.prototype.queue = [];

    MacroView.prototype.queueRunning = false;

    MacroView.prototype.queueCount = 0;

    MacroView.prototype.queueLimit = 500;

    MacroView.prototype.maxLevels = 10;

    MacroView.prototype.addToQueue = function(o) {
      if (this.queueCount >= this.queueLimit) {
        return;
      }
      this.queueCount += 1;
      this.queue.push(o);
      return this.queueStart();
    };

    MacroView.prototype.queueStart = function() {
      if (this.queueRunning) {
        return;
      }
      this.queueRunning = true;
      return this.queueLoad();
    };

    MacroView.prototype.queueLoad = function() {
      var o, r;
      if (this.queue.length) {
        r = Math.floor(Math.random() * this.queue.length * .5);
        o = this.queue[r];
        this.queue.splice(r, 1);
        return o.fetch();
      } else {
        return this.queueRunning = false;
      }
    };

    MacroView.prototype.loadConnectionComplete = function(e) {
      this.loadBlocks(e);
      return this.queueLoad();
    };

    MacroView.prototype.getRandomPosition = function() {
      return new Vector(Random(this.width), Random(this.height));
    };

    MacroView.prototype.getCenter = function() {
      return new Vector(this.width / 2, this.height / 2);
    };

    MacroView.prototype.setup = function() {
      var max, min,
        _this = this;
      if (this.isSetup) {
        return;
      }
      console.log('setup');
      this.isSetup = true;
      this.physics = new Physics();
      this.renderTime = 0;
      this.counter = 0;
      this.width = 640;
      this.height = 480;
      this.renderer = new WebGLView();
      this.renderer.offset = this.offset;
      $(this.el).html(this.renderer.domElement);
      $(this.el).append("<div id='label'></div>");
      $(this.renderer.domElement).css("background", "#000");
      this.physics.integrator = new Verlet();
      min = new Vector(0.0, 0.0);
      max = new Vector(this.width, this.height);
      this.collide = new Collision(false);
      this.bounds = new EdgeBounce(min, max);
      this.renderer.init(this.physics);
      this.mouse = new Particle(5);
      this.mouse.setRadius(5);
      this.mouse.colour = [0, 0, 0];
      this.mouse.fixed = true;
      this.physics.particles.push(this.mouse);
      this.renderer.addParticle(this.mouse);
      $(window).resize(this.resize);
      $(window).dblclick(this.dblClick);
      $(window).mousewheel(function(e, d, dx, dy) {
        var a, tx, ty;
        e.preventDefault();
        tx = _this.mouseX * (1 / _this.renderer.zoom);
        ty = _this.mouseY * (1 / _this.renderer.zoom);
        a = d * .1;
        _this.renderer.zoom *= 1 + a;
        _this.renderer.offset.x -= tx * a;
        return _this.renderer.offset.y -= ty * a;
      });
      this.resize();
      return this.update();
    };

    MacroView.prototype.dblClick = function(e) {
      if (this.currentLink) {
        return window.open(this.currentLink);
      }
    };

    MacroView.prototype.cursorMove = function(event) {
      var closest, closestDist, d, dist, distSq, m, np, o, p, radii, t, x, y, _i, _len, _ref;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      this.mouse.pos.set(event.clientX * (1 / this.renderer.zoom) - this.offset.x, event.clientY * (1 / this.renderer.zoom) - this.offset.y);
      x = this.mouse.pos.x;
      y = this.mouse.pos.y;
      d = new Vector();
      o = this.mouse;
      closestDist = 999;
      closest = null;
      _ref = this.physics.particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (o !== p) {
          (d.copy(o.pos)).sub(p.pos);
          distSq = d.magSq();
          radii = p.radius + o.radius;
          if (distSq <= radii * radii) {
            dist = Math.sqrt(distSq);
            if (dist < closestDist) {
              closest = p;
              closestDist = dist;
            }
          }
        }
      }
      if (closest) {
        if (closest.channel) {
          m = closest.channel;
        } else if (closest.block) {
          m = closest.block;
        }
        if (m) {
          t = "Untitled";
          if (p.title) {
            t = p.title;
          }
          this.currentLink = "http://are.na/#/" + closest.slug;
          t += " ( " + this.currentLink + " ) ";
          np = closest;
          while (np) {
            if (np.linkParticle) {
              t = t + "<br/>" + np.linkParticle.title;
              np = np.linkParticle;
            } else {
              np = null;
            }
          }
          $('#label').html(t);
        }
      } else {
        $('#label').html("");
      }
      return null;
    };

    MacroView.prototype.step = function() {
      if (this.renderer.gl != null) {
        return this.renderer.render(this.physics);
      }
    };

    MacroView.prototype.update = function() {
      requestAnimationFrame(this.update);
      return this.step();
    };

    MacroView.prototype.resize = function() {
      this.width = $(window).width();
      this.height = $(window).height();
      this.bounds.max.x = this.width;
      this.bounds.max.y = this.height;
      if (this.renderer.gl != null) {
        this.renderer.setSize(this.width, this.height);
      }
      return null;
    };

    return MacroView;

  })(Backbone.View);
  
}});

window.require.define({"views/physics/physics_view": function(exports, require, module) {
  /* Base Renderer
  */

  var PhysicsRenderer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = PhysicsRenderer = (function(_super) {

    __extends(PhysicsRenderer, _super);

    function PhysicsRenderer() {
      this.setSize = __bind(this.setSize, this);
      this.width = 0;
      this.height = 0;
      this.renderParticles = true;
      this.renderSprings = true;
      this.renderMouse = true;
      this.initialized = false;
      this.renderTime = 0;
    }

    PhysicsRenderer.prototype.init = function(physics) {
      return this.initialized = true;
    };

    PhysicsRenderer.prototype.render = function(physics) {
      if (!this.initialized) {
        return this.init(physics);
      }
    };

    PhysicsRenderer.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
    };

    PhysicsRenderer.prototype.destroy = function() {};

    return PhysicsRenderer;

  })(Backbone.View);
  
}});

window.require.define({"views/physics/webgl_view": function(exports, require, module) {
  /* WebGL Renderer
  */

  var PhysicsRenderer, WebGLRenderer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PhysicsRenderer = require('./physics_view');

  module.exports = WebGLRenderer = (function(_super) {

    __extends(WebGLRenderer, _super);

    WebGLRenderer.prototype.offset = {
      x: 0,
      y: 0
    };

    WebGLRenderer.prototype.zoom = 1;

    WebGLRenderer.PARTICLE_VS = '\nuniform vec2 viewport;\nattribute vec3 position;\nattribute float radius;\nattribute vec4 colour;\nvarying lowp vec4 tint;\n\nvoid main() {\n\n	// convert the rectangle from pixels to 0.0 to 1.0\n	vec2 zeroToOne = position.xy / viewport;\n	zeroToOne.y = 1.0 - zeroToOne.y;\n\n	// convert from 0->1 to 0->2\n	vec2 zeroToTwo = zeroToOne * 2.0;\n\n	// convert from 0->2 to -1->+1 (clipspace)\n	vec2 clipSpace = zeroToTwo - 1.0;\n\n	gl_Position = vec4(clipSpace, 0, 1);\n	gl_PointSize = radius * 2.0;\n	tint = colour;\n}';

    WebGLRenderer.PARTICLE_FS = '\nuniform sampler2D texture;\nvarying lowp vec4 tint;\n\nvoid main() {\n	gl_FragColor = texture2D(texture, gl_PointCoord) * tint;\n}';

    WebGLRenderer.SPRING_VS = '\nuniform vec2 viewport;\nattribute vec3 position;\n\nvoid main() {\n\n	// convert the rectangle from pixels to 0.0 to 1.0\n	vec2 zeroToOne = position.xy / viewport;\n	zeroToOne.y = 1.0 - zeroToOne.y;\n\n	// convert from 0->1 to 0->2\n	vec2 zeroToTwo = zeroToOne * 2.0;\n\n	// convert from 0->2 to -1->+1 (clipspace)\n	vec2 clipSpace = zeroToTwo - 1.0;\n\n	gl_Position = vec4(clipSpace, 0, 1);\n}';

    WebGLRenderer.SPRING_FS = '\nvoid main() {\n	gl_FragColor = vec4(1.0, 1.0, 1.0, 0.2);\n}';

    function WebGLRenderer(usePointSprites) {
      this.usePointSprites = usePointSprites != null ? usePointSprites : true;
      this.setSize = __bind(this.setSize, this);

      WebGLRenderer.__super__.constructor.apply(this, arguments);
      this.particlePositionBuffer = null;
      this.particleRadiusBuffer = null;
      this.particleColourBuffer = null;
      this.particleTexture = null;
      this.particleShader = null;
      this.springPositionBuffer = null;
      this.springShader = null;
      this.canvas = document.createElement('canvas');
      try {
        this.gl = this.canvas.getContext('experimental-webgl');
      } catch (error) {

      } finally {
        if (!this.gl) {
          return new CanvasRenderer();
        }
      }
      this.domElement = this.canvas;
    }

    WebGLRenderer.prototype.init = function(physics) {
      WebGLRenderer.__super__.init.call(this, physics);
      this.initShaders();
      this.initBuffers(physics);
      this.particleTexture = this.loadTexture(this.createParticleTextureData());
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
      this.gl.enable(this.gl.VERTEX_PROGRAM_POINT_SIZE);
      this.gl.enable(this.gl.TEXTURE_2D);
      return this.gl.enable(this.gl.BLEND);
    };

    WebGLRenderer.prototype.initShaders = function() {
      this.particleShader = this.createShaderProgram(WebGLRenderer.PARTICLE_VS, WebGLRenderer.PARTICLE_FS);
      this.springShader = this.createShaderProgram(WebGLRenderer.SPRING_VS, WebGLRenderer.SPRING_FS);
      this.particleShader.uniforms = {
        viewport: this.gl.getUniformLocation(this.particleShader, 'viewport')
      };
      this.springShader.uniforms = {
        viewport: this.gl.getUniformLocation(this.springShader, 'viewport')
      };
      this.particleShader.attributes = {
        position: this.gl.getAttribLocation(this.particleShader, 'position'),
        radius: this.gl.getAttribLocation(this.particleShader, 'radius'),
        colour: this.gl.getAttribLocation(this.particleShader, 'colour')
      };
      return this.springShader.attributes = {
        position: this.gl.getAttribLocation(this.springShader, 'position')
      };
    };

    WebGLRenderer.prototype.initBuffers = function(physics) {
      var particle, _i, _len, _ref;
      this.colours = [];
      this.radii = [];
      this.particlePositionBuffer = this.gl.createBuffer();
      this.springPositionBuffer = this.gl.createBuffer();
      this.particleColourBuffer = this.gl.createBuffer();
      this.particleRadiusBuffer = this.gl.createBuffer();
      _ref = physics.particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        this.addParticle(particle);
      }
      return this.updateBuffers();
    };

    WebGLRenderer.prototype.addParticle = function(particle) {
      var rgba;
      rgba = particle.colour;
      this.colours.push(rgba[0], rgba[1], rgba[2], 1);
      this.radii.push(particle.radius || 32);
      return this.updateBuffers();
    };

    WebGLRenderer.prototype.updateBuffers = function() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleColourBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colours), this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleRadiusBuffer);
      return this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.radii), this.gl.STATIC_DRAW);
    };

    WebGLRenderer.prototype.createParticleTextureData = function(size) {
      var canvas, ctx, rad;
      if (size == null) {
        size = 128;
      }
      canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      ctx = canvas.getContext('2d');
      rad = size * 0.5;
      ctx.beginPath();
      ctx.arc(rad, rad, rad, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fillStyle = '#FFF';
      ctx.fill();
      return canvas.toDataURL();
    };

    WebGLRenderer.prototype.loadTexture = function(source) {
      var texture,
        _this = this;
      texture = this.gl.createTexture();
      texture.image = new Image();
      texture.image.onload = function() {
        _this.gl.bindTexture(_this.gl.TEXTURE_2D, texture);
        _this.gl.texImage2D(_this.gl.TEXTURE_2D, 0, _this.gl.RGBA, _this.gl.RGBA, _this.gl.UNSIGNED_BYTE, texture.image);
        _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MIN_FILTER, _this.gl.LINEAR);
        _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MAG_FILTER, _this.gl.LINEAR);
        _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_S, _this.gl.CLAMP_TO_EDGE);
        _this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_T, _this.gl.CLAMP_TO_EDGE);
        _this.gl.generateMipmap(_this.gl.TEXTURE_2D);
        return _this.gl.bindTexture(_this.gl.TEXTURE_2D, null);
      };
      texture.image.src = source;
      return texture;
    };

    WebGLRenderer.prototype.createShaderProgram = function(_vs, _fs) {
      var fs, prog, vs;
      vs = this.gl.createShader(this.gl.VERTEX_SHADER);
      fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(vs, _vs);
      this.gl.shaderSource(fs, _fs);
      this.gl.compileShader(vs);
      this.gl.compileShader(fs);
      if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(vs));
        null;
      }
      if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(fs));
        null;
      }
      prog = this.gl.createProgram();
      this.gl.attachShader(prog, vs);
      this.gl.attachShader(prog, fs);
      this.gl.linkProgram(prog);
      return prog;
    };

    WebGLRenderer.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
      WebGLRenderer.__super__.setSize.call(this, this.width, this.height);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.gl.viewport(0, 0, this.width, this.height);
      this.gl.useProgram(this.particleShader);
      this.gl.uniform2fv(this.particleShader.uniforms.viewport, new Float32Array([this.width, this.height]));
      this.gl.useProgram(this.springShader);
      return this.gl.uniform2fv(this.springShader.uniforms.viewport, new Float32Array([this.width, this.height]));
    };

    WebGLRenderer.prototype.render = function(physics) {
      var p, s, vertices, _i, _j, _len, _len1, _ref, _ref1;
      WebGLRenderer.__super__.render.apply(this, arguments);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      if (this.renderParticles) {
        vertices = [];
        _ref = physics.particles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          vertices.push((p.pos.x + this.offset.x) * this.zoom, (p.pos.y + this.offset.y) * this.zoom, 0.0);
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.particleTexture);
        this.gl.useProgram(this.particleShader);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particlePositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.particleShader.attributes.position, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.particleShader.attributes.position);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleColourBuffer);
        this.gl.enableVertexAttribArray(this.particleShader.attributes.colour);
        this.gl.vertexAttribPointer(this.particleShader.attributes.colour, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleRadiusBuffer);
        this.gl.enableVertexAttribArray(this.particleShader.attributes.radius);
        this.gl.vertexAttribPointer(this.particleShader.attributes.radius, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.POINTS, 0, vertices.length / 3);
      }
      if (this.renderSprings && physics.springs.length > 0) {
        vertices = [];
        _ref1 = physics.springs;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          s = _ref1[_j];
          vertices.push((s.p1.pos.x + this.offset.x) * this.zoom, (s.p1.pos.y + this.offset.y) * this.zoom, 0.0);
          vertices.push((s.p2.pos.x + this.offset.x) * this.zoom, (s.p2.pos.y + this.offset.y) * this.zoom, 0.0);
        }
        this.gl.useProgram(this.springShader);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.springPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.springShader.attributes.position, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.springShader.attributes.position);
        return this.gl.drawArrays(this.gl.LINES, 0, vertices.length / 3);
      }
    };

    WebGLRenderer.prototype.destroy = function() {};

    return WebGLRenderer;

  })(PhysicsRenderer);
  
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

