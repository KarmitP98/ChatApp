export class TextModel {
    constructor(
        public chatId: string,
        public textId: string,
        public from: string,
        public to: string,
        public content: string,
        public timeStamp: Date,
        public status: string ) {}
}
