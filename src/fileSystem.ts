export class ReadFiles {
    constructor() {}

    public async readMcqs() {
        try {
            const data = await (await fetch('../utils/mcqs.json')).json();
            return data;
            
        } catch (error) {
            console.log('Error while reading Mcqs');
        }
    }

    public async readinstruction() {
        try {
            const data = await (await fetch('../utils/instructions.json')).json()
            return data;
        } catch (error) {
            console.log('Error while reading instructions');
        }   
    }
}