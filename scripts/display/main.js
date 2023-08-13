var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Quiz } from '../quiz.js';
import { Template } from './template.js';
import { ReadFiles } from '../fileSystem.js';
export class Main {
    constructor() {
        this.tempalte = Template.getInstance();
        this.contentSection = document.getElementById('content');
        this.startQuiz = document.getElementById('btn-startQuiz');
        this.contentBox = Template.getTemplateContent(this.tempalte.contentTemplate);
        this.currentContent = Template.getTemplateContent(this.tempalte.instructionTemplate);
        this.handleStartQuiz();
    }
    handlerListener() {
        this.contentSection.removeChild(this.startQuiz);
        this.contentSection.insertAdjacentElement('afterbegin', this.contentBox);
        this.renderContentFirstTime();
    }
    handleStartQuiz() {
        const startQuizButton = this.startQuiz.querySelector('button');
        startQuizButton.addEventListener('click', this.handlerListener.bind(this));
    }
    renderContentFirstTime() {
        this.contentBox.insertAdjacentElement('afterbegin', this.currentContent);
        this.loadQuizInstructions(this.currentContent);
        const agreeButton = this.currentContent.querySelector('button');
        agreeButton.addEventListener('click', () => {
            this.renderQuizContent();
        });
    }
    loadQuizInstructions(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = yield (new ReadFiles().readinstruction());
            const targetElement = element.querySelector('#instruction-area');
            let counter = 1;
            for (let each of instructions) {
                let pElement = document.createElement('p');
                pElement.innerText = `${counter}. ${each.toString()}`;
                counter++;
                targetElement === null || targetElement === void 0 ? void 0 : targetElement.appendChild(pElement);
            }
        });
    }
    renderQuizContent() {
        this.contentBox.removeChild(this.currentContent);
        this.currentContent = Template.getTemplateContent(this.tempalte.quizTemplate);
        this.contentBox.insertAdjacentElement('afterbegin', this.currentContent);
        Quiz.getInstance(this.currentContent);
    }
    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }
}
