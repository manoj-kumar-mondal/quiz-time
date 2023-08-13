import { Quiz } from '../quiz.js';
import { Template } from './template.js';
import { ReadFiles } from '../fileSystem.js';


export class Main {
    static instance: Main | null;

    private tempalte: Template;
    private startQuiz: HTMLDivElement;
    private contentSection: HTMLElement;
    private contentBox: HTMLDivElement;
    private currentContent: HTMLDivElement;

    private constructor() {
        this.tempalte = Template.getInstance();
        this.contentSection = document.getElementById('content')! as HTMLElement;
        this.startQuiz = document.getElementById('btn-startQuiz')! as HTMLDivElement;
        
        this.contentBox = Template.getTemplateContent(this.tempalte.contentTemplate);
        this.currentContent = Template.getTemplateContent(this.tempalte.instructionTemplate);
        this.handleStartQuiz();
    }
    
    private handlerListener() {
        this.contentSection.removeChild(this.startQuiz);
        this.contentSection.insertAdjacentElement('afterbegin', this.contentBox);
        this.renderContentFirstTime();
    }

    private handleStartQuiz() {
        const startQuizButton = this.startQuiz.querySelector('button') as HTMLButtonElement;
        startQuizButton.addEventListener('click', this.handlerListener.bind(this));
    }

    private renderContentFirstTime() {
        this.contentBox.insertAdjacentElement('afterbegin', this.currentContent);
        this.loadQuizInstructions(this.currentContent);
        const agreeButton = this.currentContent.querySelector('button') as HTMLButtonElement;

        agreeButton.addEventListener('click', () => {
            this.renderQuizContent();
        });
    }

    private async loadQuizInstructions(element: HTMLDivElement) {
        const instructions = await (new ReadFiles().readinstruction());
        const targetElement = element.querySelector('#instruction-area');
        let counter = 1;
        for(let each of instructions) {
            let pElement = document.createElement('p');
            pElement.innerText = `${counter}. ${each.toString()}`;
            counter++;
            targetElement?.appendChild(pElement);
        }
    }
    
    private renderQuizContent() {
        this.contentBox.removeChild(this.currentContent);
        this.currentContent = Template.getTemplateContent(this.tempalte.quizTemplate);
        this.contentBox.insertAdjacentElement('afterbegin', this.currentContent);
        Quiz.getInstance(this.currentContent);
    }

    static getInstance() {
        if(!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }
}
