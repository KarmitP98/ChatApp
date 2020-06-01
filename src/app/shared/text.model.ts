export class TextModel {
    constructor( public chatId: string,
                 public from: string,
                 public textId: string,
                 public to: string,
                 public content: string,
                 public timeStamp: Date,
                 public status: string ) {}
}
