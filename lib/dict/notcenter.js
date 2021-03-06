// Generated by CoffeeScript 1.9.0
(function() {
  var NoteUtil, NotificationCenter,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  NoteUtil = (function() {
    function NoteUtil() {}

    NoteUtil.prototype.createElement = function(tagname, id, cls, text, parent) {
      var elem;
      if (!tagname) {
        return false;
      }
      elem = document.createElement(tagname);
      if (cls) {
        elem.className = "" + cls;
      }
      if (id) {
        elem.id = "" + id;
      }
      if (text) {
        elem.innerHTML = this.markdown(text);
      }
      if (parent) {
        parent.appendChild(elem);
      }
      return elem;
    };

    NoteUtil.prototype.addEventListener = function(elem, event, handler) {
      if (elem.addEventListener) {
        return elem.addEventListener(event, handler, false);
      } else if (elem.attachEvent) {
        return elem.attachEvent('on' + event, handler);
      } else {
        return elem['on' + event] = handler;
      }
    };

    NoteUtil.prototype.removeEventListener = function(elem, event, handler) {
      if (elem.removeEventListener) {
        return elem.removeEventListener(event, handler, false);
      } else if (elem.detachEvent) {
        return elem.detachEvent('on' + event, handler);
      } else {
        return elem['on' + event] = null;
      }
    };

    NoteUtil.prototype.addClass = function(elem, cls) {
      if (__indexOf.call(elem.className.split(' '), cls) < 0) {
        return elem.className += ' ' + cls;
      }
    };

    NoteUtil.prototype.removeClass = function(elem, cls) {
      var b, x;
      b = (function() {
        var _i, _len, _ref, _results;
        _ref = elem.className.split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (x !== cls) {
            _results.push(x);
          }
        }
        return _results;
      })();
      return elem.className = b.join(' ');
    };

    NoteUtil.prototype.hasClass = function(elem, cls) {
      return __indexOf.call(elem.className.split(' '), cls) >= 0;
    };

    NoteUtil.prototype.markdown = function(text) {
      var a, re, rl, x, _i, _len, _ref;
      re = /^https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/i;
      a = [];
      _ref = text.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        rl = x.match(re);
        if (rl && rl.length) {
          a.push("<a class=\"notification-control\" href=\"" + rl[0] + "\" target=\"blank\">" + rl[0] + "</a>");
        } else {
          a.push("" + x);
        }
      }
      return a.join(" ");
    };

    return NoteUtil;

  })();

  NotificationCenter = (function() {
    function NotificationCenter() {
      this.time = 3000;
      this.util = new NoteUtil;
      this.title_ok = 'Ok';
      this.title_cancel = 'Cancel';
      this.type = {
        Info: 'INFO',
        Success: 'SUCCESS',
        Warning: 'WARNING',
        Error: 'ERROR'
      };
      this.classes = {
        notification: 'notification',
        notification_content_cell: 'notification-content-cell',
        notification_on: 'notification-on',
        notification_off: 'notification-off',
        notification_success: 'notification-success',
        notification_warning: 'notification-warning',
        notification_error: 'notification-error',
        notification_control: 'notification-control',
        loading_indicator: 'pl-loader active',
        loading_indicator_success: 'success',
        loading_indicator_warning: 'warning',
        loading_indicator_error: 'error'
      };
    }

    NotificationCenter.prototype.change = function(notification, type, msg, time, isLoader, okhandler, cancelhandler) {
      var t, typeobj;
      if (!notification) {
        return false;
      }
      if (notification.type && notification.type.cls) {
        this.util.removeClass(notification.main.element, notification.type.cls);
      }
      typeobj = this._getType(type);
      if (typeobj.cls) {
        this.util.addClass(notification.main.element, typeobj.cls);
      }
      notification.type = typeobj;
      if (msg) {
        notification.textnode.element.innerHTML = this.util.markdown(msg);
      }
      notification.loadnode.element.innerHTML = "";
      if (isLoader) {
        this._createLoadingIndicator(notification.loadnode.element, typeobj.licls);
      }
      this._removeActionHandlers(notification);
      this._removeControlPanel(notification);
      if (okhandler || cancelhandler) {
        t = this._createControlPanel(notification, okhandler, cancelhandler);
      }
      return this._setHideTimeout(notification, time);
    };

    NotificationCenter.prototype.create = function(type, msg, time, isLoader, okhandler, cancelhandler, parent) {
      var notification;
      if (!parent) {
        return false;
      }
      notification = {
        parent: parent,
        type: null,
        main: {
          element: null
        },
        loadnode: {
          element: null
        },
        textnode: {
          element: null
        },
        controlnode: {
          element: null,
          ok: {
            element: null,
            handler: null
          },
          cancel: {
            element: null,
            handler: null
          }
        }
      };
      notification.main.element = this.util.createElement('div', null, this.classes.notification, null, parent);
      notification.loadnode.element = this.util.createElement('div', null, this.classes.notification_content_cell, null, notification.main.element);
      notification.textnode.element = this.util.createElement('div', null, this.classes.notification_content_cell, msg, notification.main.element);
      notification.controlnode.element = this.util.createElement('div', null, this.classes.notification_content_cell, null, notification.main.element);
      this.change(notification, type, msg, time, isLoader, okhandler, cancelhandler);
      return notification;
    };

    NotificationCenter.prototype.show = function(type, msg, time, isLoader, okhandler, cancelhandler, parent) {
      var t;
      t = this.create(type, msg, time, isLoader, okhandler, cancelhandler, parent);
      this._fadeIn(t.main.element, null);
      return t;
    };

    NotificationCenter.prototype.hide = function(notification) {
      var t;
      if (!(notification && notification.parent)) {
        return false;
      }
      this._removeActionHandlers(notification);
      t = notification.main.element;
      return this._fadeOut(t, (function(_this) {
        return function() {
          return notification.parent.removeChild(t);
        };
      })(this));
    };

    NotificationCenter.prototype._fadeOut = function(element, callback) {
      var action, op, time, timer, _ref;
      _ref = [1, 12], op = _ref[0], time = _ref[1];
      element.style.opacity = op;
      action = (function(_this) {
        return function() {
          if (op <= 0.1) {
            clearInterval(timer);
            _this.util.addClass(element, _this.classes.notification_off);
            _this.util.removeClass(element, _this.classes.notification_on);
            if (callback) {
              return callback.call(_this);
            }
          } else {
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + (op * 100) + ')';
            return op -= op * 0.1;
          }
        };
      })(this);
      return timer = setInterval(action, time);
    };

    NotificationCenter.prototype._fadeIn = function(element, callback) {
      var action, op, time, timer, _ref;
      _ref = [0.1, 12], op = _ref[0], time = _ref[1];
      element.style.opacity = op;
      this.util.addClass(element, this.classes.notification_on);
      this.util.removeClass(element, this.classes.notification_off);
      action = (function(_this) {
        return function() {
          if (op >= 1) {
            clearInterval(timer);
            if (callback) {
              return callback.call(_this);
            }
          } else {
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + (op * 100) + ')';
            return op += op * 0.1;
          }
        };
      })(this);
      return timer = setInterval(action, time);
    };

    NotificationCenter.prototype._getType = function(type) {
      var obj;
      obj = {
        cls: null,
        licls: null
      };
      if (this.type.Success === type) {
        obj.cls = this.classes.notification_success;
        obj.licls = this.classes.loading_indicator_success;
      } else if (this.type.Warning === type) {
        obj.cls = this.classes.notification_warning;
        obj.licls = this.classes.loading_indicator_warning;
      } else if (this.type.Error === type) {
        obj.cls = this.classes.notification_error;
        obj.licls = this.classes.loading_indicator_error;
      }
      return obj;
    };

    NotificationCenter.prototype._createLoadingIndicator = function(parent, typecls) {
      var main;
      if (typecls == null) {
        typecls = false;
      }
      main = this.util.createElement('div', null, this.classes.loading_indicator, null, parent);
      if (typecls) {
        this.util.addClass(main, typecls);
      }
      return main;
    };

    NotificationCenter.prototype._createControlPanel = function(notification, okhandler, cancelhandler) {
      var cancel, ok, parent, _ref;
      if (!(okhandler || cancelhandler)) {
        return null;
      }
      parent = notification.controlnode.element;
      _ref = [null, null], ok = _ref[0], cancel = _ref[1];
      if (okhandler) {
        ok = this.util.createElement('a', null, this.classes.notification_control, this.title_ok, parent);
      }
      if (cancelhandler) {
        cancel = this.util.createElement('a', null, this.classes.notification_control, this.title_cancel, parent);
      }
      notification.controlnode.ok.element = ok;
      notification.controlnode.cancel.element = cancel;
      return this._setControlPanelHanders(notification, okhandler, cancelhandler);
    };

    NotificationCenter.prototype._setControlPanelHanders = function(notification, okhandler, cancelhandler) {
      if (!(okhandler || cancelhandler)) {
        return null;
      }
      if (okhandler) {
        notification.controlnode.ok.handler = (function(_this) {
          return function() {
            _this._setHideTimeout(notification, 0);
            return okhandler.call(_this);
          };
        })(this);
        this.util.addEventListener(notification.controlnode.ok.element, 'click', notification.controlnode.ok.handler);
      }
      if (cancelhandler) {
        notification.controlnode.cancel.handler = (function(_this) {
          return function() {
            _this._setHideTimeout(notification, 0);
            return cancelhandler.call(_this);
          };
        })(this);
        return this.util.addEventListener(notification.controlnode.cancel.element, 'click', notification.controlnode.cancel.handler);
      }
    };

    NotificationCenter.prototype._removeActionHandlers = function(notification) {
      var cancel, ok;
      if (!notification) {
        return false;
      }
      ok = notification.controlnode.ok;
      cancel = notification.controlnode.cancel;
      if (ok.element) {
        this.util.removeEventListener(ok.element, 'click', ok.handler);
      }
      if (cancel.element) {
        return this.util.removeEventListener(cancel.element, 'click', cancel.handler);
      }
    };

    NotificationCenter.prototype._removeControlPanel = function(notification) {
      if (!notification) {
        return false;
      }
      notification.controlnode.element.innerHTML = "";
      notification.controlnode.ok.element = null;
      notification.controlnode.ok.handler = null;
      notification.controlnode.cancel.element = null;
      return notification.controlnode.cancel.handler = null;
    };

    NotificationCenter.prototype._setHideTimeout = function(notification, time) {
      var action;
      if (notification.timeout) {
        clearTimeout(notification.timeout);
      }
      if (time == null) {
        time = this.time;
      }
      if (time >= 0) {
        action = (function(_this) {
          return function() {
            return _this.hide(notification);
          };
        })(this);
        return notification.timeout = setTimeout(action, time);
      }
    };

    return NotificationCenter;

  })();

  if (this.notificationcenter == null) {
    this.notificationcenter = new NotificationCenter;
  }

}).call(this);
