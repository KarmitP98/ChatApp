export class User {
    constructor(
        public userName: string,
        public userEmail: string,
        public userPassword: string,
        public chatIds: { chatId: string, with: string }[]
    ) {}
}
