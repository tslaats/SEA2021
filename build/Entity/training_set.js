"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Training_Set = /*#__PURE__*/function () {
  function Training_Set() {
    _classCallCheck(this, Training_Set);

    this.exercises = [];
  }

  _createClass(Training_Set, [{
    key: "add",
    value: function add(exercise) {
      this.exercises.push(exercise);
    }
  }, {
    key: "remove",
    value: function remove(index) {
      this.exercises.splice(index, index + 1);
    }
  }, {
    key: "get",
    value: function get(index) {
      return this.exercises[index];
    }
  }]);

  return Training_Set;
}();

exports["default"] = Training_Set;