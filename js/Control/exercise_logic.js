const fileSystem = require("fs");
import Exercise from "../Entity/exercise";
import Training_Set from "../Entity/training_set";

console.log(" Writing into an file ");
const exercise = new Exercise("What did you have for breakfast?", "required", "forbidden");
const exercise_set = new Training_Set();
exercise_set.add(exercise);
exportEx(exercise_set);
console.log(" Finished ");

console.log(" About read the file ")
const imported = importEx("exercises.json");
console.log(" Read the file ");
const exs = imported.exercises;
const ex = exs[0];
console.log("question: " + ex.question);

function check_solution() {

}

function next_exercise() {

}

function add_exercise() {

}

function importEx(path) {
    try{
      const data = fileSystem.readFileSync(path)
      const object = JSON.parse(data)
      return object
    } catch(err) {
      console.log("Error parsing JSON string:", err)
    }
}

function exportEx(exercise_set, name = "exercises") {
    let data = JSON.stringify(exercise_set)
    let path = "./" + name + ".json"
    fileSystem.writeFileSync(path, data)
}