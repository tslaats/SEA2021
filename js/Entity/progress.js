export default class Progress {
    constructor (training_set) {
        this.total_exercises = training_set.length;
        this.solved = 0;
        this.exercises = training_set.exercises;
        this.traces_fullfilled = [];
    }
}