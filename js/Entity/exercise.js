export default class Exercise {
    constructor (question, symbol, activity, scenario, req_or_forbidden, hints) {
        this.question = question;
        this.symbol = symbol;
        this.activity = activity;
        this.scenario = scenario;
        this.req_or_forbidden = req_or_forbidden;
        this.hints = hints;
    }
}