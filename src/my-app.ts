import { AuthService } from "./auth-service";

export class MyApp {
    constructor(private auth: AuthService) {
    }

    async binding(): Promise<void> {
        await this.auth.initialize();
    }
}
