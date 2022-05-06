"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var fileSystem = _interopRequireWildcard(require("fs"));

var _exercise = _interopRequireDefault(require("../Entity/exercise"));

var _training_set = _interopRequireDefault(require("../Entity/training_set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

console.log(" Writing into an file ");
var exercise = new _exercise["default"]("question", "required", "forbidden");
var exercise_set = new _training_set["default"]();
exercise_set.add(exercise);
exportEx(exercise_set);
console.log(" Finished ");

function check_solution() {}

function next_exercise() {}

function add_exercise() {}

function importEx(path) {
  fileSystem.readFile(path, function (err, data) {
    if (err) {
      console.log("File can't be read", err);
      return;
    }

    try {
      var _exercise_set = JSON.parse(data);

      return _exercise_set;
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

function exportEx(exercise_set) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "exercises";
  var data = JSON.stringify(exercise_set);
  var path = "./" + name + ".json";
  fileSystem.writeFile(path, data, function (err) {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log('JSON data is written to the file successfully');
    }
  });
}