export class Template {
    constructor() {
        this._contentTemplate = document.getElementById('template-content');
        this._instructionTemplate = document.getElementById('tempalte-quiz-instruction');
        this._quizTemplate = document.getElementById('template-quiz-box');
        this._gameOverTempalte = document.getElementById('template-game-over');
    }
    get contentTemplate() {
        return this._contentTemplate;
    }
    get instructionTemplate() {
        return this._instructionTemplate;
    }
    get quizTemplate() {
        return this._quizTemplate;
    }
    get gameOverTemplate() {
        return this._gameOverTempalte;
    }
    static getTemplateContent(template) {
        const importedNode = document.importNode(template.content, true);
        return importedNode.firstElementChild;
    }
    static getInstance() {
        if (!Template.instance) {
            Template.instance = new Template();
        }
        return Template.instance;
    }
}
Template.instance = null;
