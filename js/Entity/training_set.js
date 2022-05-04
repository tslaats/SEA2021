class Training_Set {
    constructor () {
        this.exercises = [];
    }
    add(exercise) {
        this.exercises.push(exercise);
    }
    remove(index) {
        this.exercises.splice(index, index+1);
    }
}