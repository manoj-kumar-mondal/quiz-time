var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Template } from './display/template.js';
import { ReadFiles } from './fileSystem.js';
export class Quiz {
    get quizResult() {
        return this.result;
    }
    constructor(Element) {
        Quiz.currentTime = 30;
        this.file = new ReadFiles();
        this.Quiz = Element;
        this.cuurentMcq = 0;
        this.cuurentChosedAnswer = '0';
        this.mcqSelection = this.Quiz.querySelector('#mcq-selection-area');
        this.countDown = this.Quiz.querySelector('#countdown');
        this.answersByUser = [];
        this.result = {
            correct: 0,
            wrong: 0,
            notAttempt: 0
        };
        this.init();
        this.trackOptions();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mcqData = yield this.file.readMcqs();
            this.resetTimer();
            this.handleNextButton();
        });
    }
    resetTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.answersByUser.push(this.cuurentChosedAnswer);
            Quiz.currentTime = 30;
            this.countDown.innerText = '00:30';
            if (Quiz.timerInstance) {
                clearInterval(Quiz.timerInstance);
            }
            if (this.cuurentMcq >= this.mcqData.length) {
                this.endQuiz();
                return;
            }
            this.setTimer();
            this.renderMcqs(this.cuurentMcq);
            this.cuurentMcq++;
        });
    }
    setTimer() {
        Quiz.timerInstance = setInterval(this.timeHandler.bind(this), 1000);
    }
    timeHandler() {
        if (Quiz.currentTime < 0) {
            this.resetTimer();
            return;
        }
        let temp = Quiz.currentTime;
        this.countDown.innerText = '00:' + (temp < 10 ? ('0' + temp) : '' + temp);
        Quiz.currentTime--;
    }
    renderMcqs(index) {
        this.clearOptions();
        this.renderQuestion(this.mcqData[index].question);
        this.renderOptions(this.mcqData[index].options);
    }
    renderQuestion(question) {
        const quetionElement = this.Quiz.querySelector('#question-area');
        quetionElement.innerText = question || 'No Question Found';
    }
    renderOptions(options) {
        const optionElement = this.Quiz.querySelectorAll('.mcq-option');
        let element;
        for (let i = 0; i < optionElement.length; i++) {
            element = optionElement[i];
            element.innerText = options[`${i + 1}`] || 'option not found';
        }
        this.cuurentChosedAnswer = '0';
    }
    endQuiz() {
        for (let i = 0; i < this.mcqData.length; i++) {
            if (this.answersByUser[i + 1] === '0') {
                this.result.notAttempt++;
            }
            else {
                if (this.mcqData[i].answer === this.answersByUser[i + 1]) {
                    this.result.correct++;
                }
                else {
                    this.result.wrong++;
                }
            }
        }
        this.renderResultScreen();
    }
    trackOptions() {
        this.mcqSelection.addEventListener('click', (event) => {
            let target = event.target;
            if (target.classList.contains('mcq-option')) {
                this.clearOptions();
                target.style.backgroundColor = '#fdf142';
                this.cuurentChosedAnswer = target.id;
            }
        });
    }
    clearOptions() {
        for (let each of this.mcqSelection.children) {
            each.style.backgroundColor = '#99cc5b';
        }
    }
    handleNextButton() {
        var _a;
        const nextButton = (_a = this.Quiz.querySelector('#action-area')) === null || _a === void 0 ? void 0 : _a.querySelector('button');
        nextButton.addEventListener('click', () => {
            this.resetTimer();
        });
    }
    renderResultScreen() {
        const gameOverElement = Template.getTemplateContent(Template.getInstance().gameOverTemplate);
        this.Quiz.innerHTML = '';
        this.renderResult(gameOverElement);
        this.Quiz.insertAdjacentElement('afterbegin', gameOverElement);
        this.handleTryAgain();
    }
    renderResult(element) {
        const classList = element.querySelectorAll('.answer-option');
        classList[0].innerText = String(this.result.correct);
        classList[1].innerText = String(this.result.wrong);
        classList[2].innerText = String(this.result.notAttempt);
    }
    handleTryAgain() {
        const tryAgainButton = this.Quiz.querySelector('#try-again');
        tryAgainButton.addEventListener('click', () => {
            window.location.reload();
        });
    }
    static getInstance(Element) {
        if (!Quiz.instance) {
            Quiz.instance = new Quiz(Element);
        }
        return Quiz.instance;
    }
}
