import { AuthService } from "./auth-service";

export class MyApp {
    constructor(private auth: AuthService) {
    }

    async beforeBind(): Promise<void> {
        await this.auth.initialize();
    }
}
