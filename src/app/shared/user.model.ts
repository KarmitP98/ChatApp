export class User {
    constructor(
        public userId: string,
        public userName: string,
        public userEmail: string,
        public userPassword: string,
        public phone: number,
        public chatIds: { chatId: string, with: string }[],
        public proPicUrl: string,
        public accountType: boolean,
        public ghostMode: boolean,
        public notify: boolean,
        public notiToken: string
    ) {}
}
