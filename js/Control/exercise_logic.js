const fileSystem = require("fs")
const Exercise = require("../Entity/exercise");

console.log(" Writing into an file ");
const exercise = new Exercise("question", "required", "forbidden");
const exercise_set = new Training_Set();
exercise_set.add(exercise);
exportEx(exercise_set);
console.log(" Finished ");

function check_solution() {

}
function next_exercise() {

}
function add_exercise() {

}

function importEx(path) {
    fileSystem.readFile(path, (err, data) => {
        if(err) {
          console.log("File can't be read", err)
          return
        }
        try{
          const exercise_set = JSON.parse(data)
          return exercise_set
        }
        catch(err) {
          console.log("Error parsing JSON string:", err)
        }
    })
}

function exportEx(exercise_set, name = "exercises") {
    data = JSON.stringify(exercise_set)

    path = "./" + name + ".json"

    fileSystem.writeFile(path, data, err=>{
        if(err){
          console.log("Error writing file" ,err)
        } else {
          console.log('JSON data is written to the file successfully')
        }
    })
}