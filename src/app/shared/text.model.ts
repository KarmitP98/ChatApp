export class TextModel {
    constructor( public textId: string,
                 public chatId: string,
                 public from: string,
                 public to: string,
                 public content: string,
                 public timeStamp: Date ) {}
}
