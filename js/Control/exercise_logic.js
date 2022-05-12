//import * as fileSystem from 'fs';
import Exercise  from '../Entity/exercise.js';
import Training_Set from '../Entity/training_set.js';

var exercise_set = new Training_Set();  //should be global

/*
console.log(" Writing into an file ");
const exercise = new Exercise("What did you have for breakfast?", "required", "forbidden");
const exercise_set = new Training_Set();
exercise_set.add(exercise);
exportEx(exercise_set);
console.log(" Finished ");

console.log(" About read the file ")
const imported = importEx("exercises.json");
console.log(" Read the file ");
console.log("question: " + imported);
*/

function check_solution() {     

}

function next_exercise() {

}

function get_value(elements){
  var values = elements.map((o) => o.value);
   elements.forEach(el => {
    el.value = ''
  });

  return values;
}

export default function add_exercise() {
  
  var question = document.getElementById("question").value;

  var symbol = Array.prototype.slice.call(document.getElementsByName('sym[]'));
  var symbol_val = get_value(symbol);

  var activity = Array.prototype.slice.call(document.getElementsByName('act[]'));
  var activity_val = get_value(activity);

  var dcr = Array.prototype.slice.call(document.getElementsByName('dcr[]'));
  var dcr_val = get_value(dcr);

  var req = Array.prototype.slice.call(document.getElementsByName('req[]'));
  var req_val = get_value(req);

  var hints = Array.prototype.slice.call(document.getElementsByName('hints[]'));
  var hints_val = get_value(hints);

  const exercise = new Exercise();
  exercise.question = question;
  exercise.symbol = symbol_val;
  exercise.activity = activity_val;
  exercise.scenario = dcr_val;
  exercise.req_or_forbidden = req_val;
  exercise.hints = hints_val;

  exercise_set.add(exercise);
  
  const test = JSON.stringify(exercise_set);
  console.log(test)
} 
document.getElementById('add_exercise').addEventListener('click', add_exercise);
/*

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
}*/
