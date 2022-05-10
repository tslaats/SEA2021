"use strict";

var _exercise = _interopRequireDefault(require("../Entity/exercise"));

var _training_set = _interopRequireDefault(require("../Entity/training_set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fileSystem = require("fs");

console.log(" Writing into an file ");
var exercise = new _exercise["default"]("What did you have for breakfast?", "required", "forbidden");
var exercise_set = new _training_set["default"]();
exercise_set.add(exercise);
exportEx(exercise_set);
console.log(" Finished ");
console.log(" About read the file ");
var imported = importEx("exercises.json");
console.log(" Read the file ");
var exs = imported.exercises;
var ex = exs[0];
console.log("question: " + ex.question);

function check_solution() {}

function next_exercise() {}

function add_exercise() {}

function importEx(path) {
  try {
    var data = fileSystem.readFileSync(path);
    var object = JSON.parse(data);
    return object;
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
}

function exportEx(exercise_set) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "exercises";
  var data = JSON.stringify(exercise_set);
  var path = "./" + name + ".json";
  fileSystem.writeFileSync(path, data);
}