import { TextModel } from "./text.model";

export class ChatModel {
    constructor( public chatId: string,
                 public user1: string,
                 public user2: string,
                 public messages: TextModel[]
    ) {}
}
