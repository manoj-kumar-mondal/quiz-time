import { Template } from './display/template.js';
import { ReadFiles } from './fileSystem.js';

export class Quiz {
    static instance: Quiz | null;
    private static timerInstance: number | null;
    private static currentTime: number;

    private file: ReadFiles;
    private Quiz: HTMLDivElement;
    private mcqData: any;
    private cuurentMcq: number;
    private mcqSelection: HTMLDivElement;
    private cuurentChosedAnswer: string;
    private answersByUser: string[];
    private countDown: HTMLDivElement;
    private result: {
        correct: number;
        wrong: number;
        notAttempt: number;
    }

    public get quizResult() {
        return this.result;
    }

    private constructor(Element: HTMLDivElement) {
        Quiz.currentTime = 30;
        this.file = new ReadFiles();
        this.Quiz = Element;
        this.cuurentMcq = 0;
        this.cuurentChosedAnswer = '0';
        this.mcqSelection = this.Quiz.querySelector('#mcq-selection-area') as HTMLDivElement;
        this.countDown = this.Quiz.querySelector('#countdown') as HTMLDivElement;
        this.answersByUser = [];
        this.result = {
            correct: 0,
            wrong: 0,
            notAttempt: 0
        }

        this.init();
        this.trackOptions();
    }
    
    private async init() {
        this.mcqData = await this.file.readMcqs();
        this.resetTimer();
        this.handleNextButton();
    }

    private async resetTimer() {
        this.answersByUser.push(this.cuurentChosedAnswer);
        Quiz.currentTime = 30;
        this.countDown.innerText = '00:30';

        if(Quiz.timerInstance) {
            clearInterval(Quiz.timerInstance);
        }

        if(this.cuurentMcq >= this.mcqData.length) {
            this.endQuiz();
            return;
        }

        this.setTimer();
        this.renderMcqs(this.cuurentMcq);
        this.cuurentMcq++;
    }

    
    private setTimer() {
        Quiz.timerInstance = setInterval(this.timeHandler.bind(this), 1000);
    }
    
    private timeHandler() {
        if(Quiz.currentTime < 0) {
            this.resetTimer();
            return;
        }
        let temp = Quiz.currentTime;
        this.countDown.innerText = '00:' + (temp < 10 ? ('0'+temp) : ''+temp);
        Quiz.currentTime--;
    }

    private renderMcqs (index: number) {
        this.clearOptions();
        this.renderQuestion(this.mcqData[index].question);
        this.renderOptions(this.mcqData[index].options);
    }

    private renderQuestion(question: string) {
        const quetionElement = this.Quiz.querySelector('#question-area')! as HTMLDivElement;
        quetionElement.innerText = question || 'No Question Found';
    }

    private renderOptions(options: any) {
        const optionElement = this.Quiz.querySelectorAll('.mcq-option')! as NodeList;
        let element: HTMLDivElement;

        for(let i = 0 ; i < optionElement.length ; i++) {
            element = optionElement[i] as HTMLDivElement;
            element.innerText = options[`${i+1}`] || 'option not found';
        }
        
        this.cuurentChosedAnswer = '0';
    }

    private endQuiz() {
        for(let i = 0 ; i < this.mcqData.length ; i++) {
            if(this.answersByUser[i+1] === '0') {
                this.result.notAttempt++;
            } else {
                if(this.mcqData[i].answer === this.answersByUser[i+1]) {
                    this.result.correct++;
                } else {
                    this.result.wrong++;
                }
            }
        }
        this.renderResultScreen();
    }

    private trackOptions() {
        this.mcqSelection.addEventListener('click', (event: Event) => {
            let target = event.target as HTMLDivElement;
            if(target.classList.contains('mcq-option')) {
                this.clearOptions();
                target.style.backgroundColor = '#fdf142';
                this.cuurentChosedAnswer = target.id;
            }
        });
    }

    private clearOptions() {
        for(let each of this.mcqSelection.children) {
            (each as HTMLDivElement).style.backgroundColor = '#99cc5b';
        }
    }

    private handleNextButton() {
        const nextButton = this.Quiz.querySelector('#action-area')?.querySelector('button') as HTMLButtonElement;
        nextButton.addEventListener('click', () => {
            this.resetTimer();
        });
    }

    private renderResultScreen() {
        const gameOverElement = Template.getTemplateContent(Template.getInstance().gameOverTemplate);
        this.Quiz.innerHTML = '';
        this.renderResult(gameOverElement);
        this.Quiz.insertAdjacentElement('afterbegin', gameOverElement);
        this.handleTryAgain();
    }

    private renderResult(element: HTMLDivElement) {
        const classList = element.querySelectorAll('.answer-option');
        
        (classList[0] as HTMLHeadingElement).innerText = String(this.result.correct);
        (classList[1] as HTMLHeadingElement).innerText = String(this.result.wrong);
        (classList[2] as HTMLHeadingElement).innerText = String(this.result.notAttempt);
    }

    private handleTryAgain() {
        const tryAgainButton = this.Quiz.querySelector('#try-again') as HTMLButtonElement;
        tryAgainButton.addEventListener('click', () => {
            window.location.reload();
        });
    }

    static getInstance(Element: HTMLDivElement) {
        if(!Quiz.instance) {
            Quiz.instance = new Quiz(Element);
        }
        return Quiz.instance;
    }
}