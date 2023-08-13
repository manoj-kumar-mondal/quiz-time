export class Template {
    static instance: Template | null = null;

    private _contentTemplate: HTMLTemplateElement;
    private _instructionTemplate: HTMLTemplateElement;
    private _quizTemplate: HTMLTemplateElement;
    private _gameOverTempalte: HTMLTemplateElement;

    private constructor() {
        this._contentTemplate = document.getElementById('template-content')! as HTMLTemplateElement;
        this._instructionTemplate = document.getElementById('tempalte-quiz-instruction')! as HTMLTemplateElement;
        this._quizTemplate = document.getElementById('template-quiz-box')! as HTMLTemplateElement;
        this._gameOverTempalte = document.getElementById('template-game-over')! as HTMLTemplateElement;
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

    static getTemplateContent(template: HTMLTemplateElement) {
        const importedNode = document.importNode(template.content, true);
        return importedNode.firstElementChild as HTMLDivElement;
    }

    static getInstance() {
        if(!Template.instance) {
            Template.instance = new Template();
        }
        return Template.instance;
    }
}