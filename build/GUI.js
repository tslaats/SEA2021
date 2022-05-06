"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var taskTable;

function fillDcrTable(status) {
  var _iterator = _createForOfIteratorHelper(status),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var row = _step.value;
      row.executed = row.executed ? "V:" + row.lastExecuted : "";
      row.pending = row.pending ? "!" + (row.deadline === undefined ? "" : ":" + row.deadline) : "";
      row.included = row.included ? "" : "%";
      row.name = "<button " + (row.enabled ? "" : "disabled") + " onclick=\"graph1.execute('" + row.name + "');fillDcrTable(graph1.status());\">" + row.label + "</button>";
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  taskTable.load(status);
  updateAccepting(graph1.isAccepting());
}

function updateAccepting(status) {
  document.getElementById("accepting").innerHTML = status ? "Accepting" : "Not accepting";
}

$(document).ready(function (e) {
  taskTable = dynamicTable.config('task-table', ['executed', 'included', 'pending', 'enabled', 'name'], ['Executed', 'Included', 'Pending', 'Enabled', 'Name'], 'There are no items to list...');
  $('#btn-time').click(function (e) {
    graph1.timeStep(1);
    fillDcrTable(graph1.status());
  });
  $('#ta-dcr').keyup(function (e) {
    var x = document.getElementById("ta-dcr");

    try {
      graph1 = parser.parse(x.value);
      fillDcrTable(graph1.status());
      document.getElementById("parse-error").innerHTML = "";
    } catch (err) {
      document.getElementById("parse-error").innerHTML = err.message + "</br>" + JSON.stringify(err.location);
    }
  });

  try {
    var x = document.getElementById("ta-dcr");
    graph1 = parser.parse(x.value);
    fillDcrTable(graph1.status());
    document.getElementById("parse-error").innerHTML = "";
  } catch (err) {
    document.getElementById("parse-error").innerHTML = err.message + "</br>" + JSON.stringify(err.location);
  }
});