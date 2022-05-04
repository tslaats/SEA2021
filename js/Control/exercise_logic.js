const fileSystem = require("browserify-fs")

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