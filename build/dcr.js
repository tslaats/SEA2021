"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* 
 Basic DCR Engine supporting:
 - Condition, response, include, exclude, milestone
 - Single-instance subprocesses
 - Time
 - Guarded relations (BEWARE: guard expressions are evaluated with eval(), use at own risk.)
*/
var Marking = /*#__PURE__*/function () {
  function Marking(e, p, i) {
    _classCallCheck(this, Marking);

    this.executed = e;
    this.included = p;
    this.pending = i;
    this.lastExecuted = undefined;
    this.deadline = undefined;
    this.value;
  }

  _createClass(Marking, [{
    key: "toString",
    value: function toString() {
      return "(" + (executed ? 1 : 0) + "," + (included ? 1 : 0) + "," + (pending ? 1 : 0) + ")";
    }
  }]);

  return Marking;
}();

var Event = /*#__PURE__*/function () {
  function Event(n, l, p) {
    var g = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new DCRGraph();

    _classCallCheck(this, Event);

    this.children = g;
    this.loading = false;
    this.parent = p;
    this.name = n;
    this.label = l;
    this.events = new Set();
    this.marking = new Marking(false, true, false);
    this.conditions = new Set();
    this.respones = new Set();
    this.milestones = new Set();
    this.includes = new Set();
    this.excludes = new Set();
  }

  _createClass(Event, [{
    key: "isSubProcess",
    get: function get() {
      return this.children.events.size > 0;
    }
  }, {
    key: "enabled",
    value: function enabled() {
      if (this.parent instanceof Event) if (!this.parent.enabled()) return false;

      var _iterator = _createForOfIteratorHelper(this.events),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var e = _step.value;
          if (!e.isAccepting) return false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!this.marking.included) return false;

      var _iterator2 = _createForOfIteratorHelper(this.conditions),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var r = _step2.value;

          if (eval(r.guard)) {
            var e = r.src;
            if (e.marking.included && !e.marking.executed) return false;
            if (r.delay !== undefined) if (r.delay > e.marking.lastExecuted) return false;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = _createForOfIteratorHelper(this.milestones),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var r = _step3.value;

          if (eval(r.guard)) {
            var e = r.src;
            if (e.marking.included && e.marking.pending) return false;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return true;
    }
  }, {
    key: "canTimeStep",
    value: function canTimeStep(diff) {
      if (this.marking.deadline !== undefined) return this.marking.deadline <= diff;
    }
  }, {
    key: "timeStep",
    value: function timeStep(diff) {
      if (this.marking.lastExecuted !== undefined) this.marking.lastExecuted += diff;
      if (this.marking.deadline !== undefined) this.marking.deadline -= diff;
    }
  }, {
    key: "execute",
    value: function execute() {
      if (!this.enabled()) return;
      this.marking.executed = true;
      this.marking.pending = false;
      this.marking.deadline = undefined;
      this.marking.lastExecuted = 0;

      var _iterator4 = _createForOfIteratorHelper(this.respones),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var r = _step4.value;

          if (eval(r.guard)) {
            var e = r.trg;
            e.marking.pending = true;
            e.marking.deadline = r.deadline;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var _iterator5 = _createForOfIteratorHelper(this.excludes),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var r = _step5.value;

          if (eval(r.guard)) {
            var e = r.trg;
            e.marking.included = false;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var _iterator6 = _createForOfIteratorHelper(this.includes),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var r = _step6.value;

          if (eval(r.guard)) {
            var e = r.trg;
            e.marking.included = true;
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      if (this.parent instanceof Event) if (this.parent.enabled()) this.parent.execute();
      return;
    }
  }, {
    key: "isAccepting",
    value: function isAccepting() {
      return !(this.marking.pending && this.marking.included);
    }
  }]);

  return Event;
}();

var DCRGraph = /*#__PURE__*/function () {
  function DCRGraph(pg) {
    _classCallCheck(this, DCRGraph);

    _defineProperty(this, "parent", undefined);

    _defineProperty(this, "parentGraphTemp", undefined);

    _defineProperty(this, "events", new Map());

    this.parentGraphTemp = pg;
  }

  _createClass(DCRGraph, [{
    key: "parentGraph",
    value: function parentGraph() {
      if (this.parent === undefined) return this.parentGraphTemp;else return this.parent.parent;
    }
  }, {
    key: "root",
    value: function root() {
      if (this.parentGraph() !== undefined) return this.parentGraph().root();else return this;
    }
  }, {
    key: "removeEvent",
    value: function removeEvent(o) {
      this.events["delete"](o.name);

      var _iterator7 = _createForOfIteratorHelper(this.events.values()),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var e = _step7.value;
          e.children.removeEvent(o);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "replaceEvent",
    value: function replaceEvent(o, n) {
      var _iterator8 = _createForOfIteratorHelper(this.events.values()),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var e = _step8.value;

          if (e === o) {
            var _iterator9 = _createForOfIteratorHelper(o.conditions),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var r = _step9.value;
                n.conditions.push(r);
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }

            var _iterator10 = _createForOfIteratorHelper(o.milestones),
                _step10;

            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                var r = _step10.value;
                n.milestones.push(r);
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }

            var _iterator11 = _createForOfIteratorHelper(o.respones),
                _step11;

            try {
              for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                var r = _step11.value;
                n.respones.push(r);
              }
            } catch (err) {
              _iterator11.e(err);
            } finally {
              _iterator11.f();
            }

            var _iterator12 = _createForOfIteratorHelper(o.includes),
                _step12;

            try {
              for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                var r = _step12.value;
                n.includes.push(r);
              }
            } catch (err) {
              _iterator12.e(err);
            } finally {
              _iterator12.f();
            }

            var _iterator13 = _createForOfIteratorHelper(o.excludes),
                _step13;

            try {
              for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                var r = _step13.value;
                n.excludes.push(r);
              }
            } catch (err) {
              _iterator13.e(err);
            } finally {
              _iterator13.f();
            }

            delete this.events[e.name];
          }

          this.replaceInRelation(e.conditions, o, n);
          this.replaceInRelation(e.milestones, o, n);
          this.replaceInRelation(e.respones, o, n);
          this.replaceInRelation(e.includes, o, n);
          this.replaceInRelation(e.excludes, o, n);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "replaceInRelation",
    value: function replaceInRelation(r, o, n) {
      var _iterator14 = _createForOfIteratorHelper(r),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var e = _step14.value;

          if (e === o) {
            r["delete"](o);
            r.add(n);
          }
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }
    }
  }, {
    key: "hasEvent",
    value: function hasEvent(n) {
      return this.getEvent(n) !== undefined;
    }
  }, {
    key: "getEvent",
    value: function getEvent(n) {
      if (this.events.has(n)) return this.events.get(n);

      var _iterator15 = _createForOfIteratorHelper(this.events.values()),
          _step15;

      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var e = _step15.value;
          if (e.children.getEvent(n) !== undefined) return e.children.getEvent(n);
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }

      return undefined;
    }
  }, {
    key: "addLoadingEvent",
    value: function addLoadingEvent(n) {
      if (this.hasEvent(n)) return this.getEvent(n);
      if (this.root().hasEvent(n)) return this.root().getEvent(n);
      var e = this.addEvent(n);
      e.loading = true;
      return e;
    }
  }, {
    key: "addEvent",
    value: function addEvent(n) {
      var l = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : n;
      var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        ex: false,
        "in": true,
        pe: false
      };
      var g = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new DCRGraph();

      if (this.hasEvent(n) || this.root().hasEvent(n)) {
        if (this.hasEvent(n)) var e = this.getEvent(n);else var e = this.root().getEvent(n);
        if (!e.loading) throw new Error("Event '" + n + "' is hard defined in more than one location!");else {
          this.removeEvent(e);
          this.root().removeEvent(e);
          e.label = l;
          e.parent = this;
          e.children = g;
        }
      } else {
        var e = new Event(n, l, this, g);
      }

      this.events.set(n, e);
      g.parent = e;
      e.marking.executed = m.ex;
      e.marking.included = m["in"];
      e.marking.pending = m.pe;
      if (m.deadline !== undefined) e.marking.deadline = m.deadline;
      if (m.lastExecuted !== undefined) e.marking.lastExecuted = m.lastExecuted;
      return e;
    } // src -->* trg

  }, {
    key: "addCondition",
    value: function addCondition(src, trg) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var guard = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      if (!this.root().hasEvent(src)) var eSrc = this.addLoadingEvent(src);else var eSrc = this.root().getEvent(src);
      if (!this.root().hasEvent(trg)) var eTrg = this.addLoadingEvent(trg);else var eTrg = this.root().getEvent(trg);
      eTrg.conditions.add({
        src: eSrc,
        delay: delay,
        guard: guard
      });
    } // src --><> trg

  }, {
    key: "addMilestone",
    value: function addMilestone(src, trg) {
      var guard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!this.root().hasEvent(src)) var eSrc = this.addLoadingEvent(src);else var eSrc = this.root().getEvent(src);
      if (!this.root().hasEvent(trg)) var eTrg = this.addLoadingEvent(trg);else var eTrg = this.root().getEvent(trg);
      eTrg.milestones.add({
        src: eSrc,
        guard: guard
      });
    } // src *--> trg

  }, {
    key: "addResponse",
    value: function addResponse(src, trg) {
      var deadline = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var guard = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      if (!this.root().hasEvent(src)) var eSrc = this.addLoadingEvent(src);else var eSrc = this.root().getEvent(src);
      if (!this.root().hasEvent(trg)) var eTrg = this.addLoadingEvent(trg);else var eTrg = this.root().getEvent(trg);
      eSrc.respones.add({
        trg: eTrg,
        deadline: deadline,
        guard: guard
      });
    } // src -->+ trg

  }, {
    key: "addInclude",
    value: function addInclude(src, trg) {
      var guard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!this.root().hasEvent(src)) var eSrc = this.addLoadingEvent(src);else var eSrc = this.root().getEvent(src);
      if (!this.root().hasEvent(trg)) var eTrg = this.addLoadingEvent(trg);else var eTrg = this.root().getEvent(trg);
      eSrc.includes.add({
        trg: eTrg,
        guard: guard
      });
    } // src -->% trg

  }, {
    key: "addExclude",
    value: function addExclude(src, trg) {
      var guard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!this.root().hasEvent(src)) var eSrc = this.addLoadingEvent(src);else var eSrc = this.root().getEvent(src);
      if (!this.root().hasEvent(trg)) var eTrg = this.addLoadingEvent(trg);else var eTrg = this.root().getEvent(trg);
      eSrc.excludes.add({
        trg: eTrg,
        guard: guard
      });
    }
  }, {
    key: "execute",
    value: function execute(e) {
      if (!this.hasEvent(e)) return;
      this.getEvent(e).execute();
    }
  }, {
    key: "isAccepting",
    value: function isAccepting() {
      var _iterator16 = _createForOfIteratorHelper(this.events.values()),
          _step16;

      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var e = _step16.value;
          if (!e.isAccepting()) return false;
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }

      return true;
    }
  }, {
    key: "canTimeStep",
    value: function canTimeStep(diff) {
      var _iterator17 = _createForOfIteratorHelper(this.events.values()),
          _step17;

      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var e = _step17.value;
          if (!e.canTimeStep(diff)) return false;
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }

      return true;
    }
  }, {
    key: "timeStep",
    value: function timeStep(diff) {
      var _iterator18 = _createForOfIteratorHelper(this.events.values()),
          _step18;

      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var e = _step18.value;
          e.timeStep(diff);
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }
    }
  }, {
    key: "status",
    value: function status() {
      var result = [];

      var _iterator19 = _createForOfIteratorHelper(this.events.values()),
          _step19;

      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var e = _step19.value;
          result.push({
            executed: e.marking.executed,
            pending: e.marking.pending,
            included: e.marking.included,
            enabled: e.enabled(),
            name: e.name,
            lastExecuted: e.marking.lastExecuted,
            deadline: e.marking.deadline,
            label: e.label
          });

          var _iterator20 = _createForOfIteratorHelper(e.children.status()),
              _step20;

          try {
            for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
              var s = _step20.value;
              result.push({
                executed: s.executed,
                pending: s.pending,
                included: s.included,
                enabled: s.enabled,
                name: s.name,
                lastExecuted: s.lastExecuted,
                deadline: s.deadline,
                label: e.label + '.' + s.label
              });
            }
          } catch (err) {
            _iterator20.e(err);
          } finally {
            _iterator20.f();
          }
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }

      return result;
    }
  }]);

  return DCRGraph;
}();