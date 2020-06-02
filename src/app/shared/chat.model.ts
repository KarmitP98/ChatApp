import { TextModel } from "./text.model";

export class ChatModel {
    constructor( public chatId: string,
                 public between: string[],
                 public lastMessage: string,
                 public messages: TextModel[]
    ) {}
}
