import { PublicClientApplication, AuthenticationResult, RedirectRequest } from '@azure/msal-browser';

export class AuthService {
    private msalClient: PublicClientApplication;
    private currentUsername?: string;

    public get isAuthenticated(): boolean {
        return this.username !== undefined;
    }

    public get username(): string {
        return this.currentUsername;
    }

    constructor() {
        this.msalClient = new PublicClientApplication({
            auth: {
                clientId: '6ceeccc1-908f-4485-98b9-a2671a05df15',
                authority: 'https://mvsampleorg.b2clogin.com/6683685e-c6bd-4c54-a1e8-5d2f4f02b558/b2c_1_signinsignup/',
                knownAuthorities: ['mvsampleorg.b2clogin.com'],
            },
        });
    }

    public async initialize(): Promise<void> {
        try {
            const result = await this.msalClient.handleRedirectPromise();
            if (result) {
                this.handleResult(result);
                return;
            }
        } catch (error) {
            console.log('Authentication error (redirect): ' + error);
            return;
        }
    }

    public async login(): Promise<void> {
        const request = {
            redirectUri: window.location.origin,
            scopes: ['openid', 'profile'],
        } as RedirectRequest;

        try {
            const result = await this.msalClient.ssoSilent(request);
            if (result) {
                this.handleResult(result);
                return;
            }
        } catch (error) {
            console.log('Authentication error (silent): ' + error);
        }

        await this.msalClient.loginRedirect(request);
    }

    public logout(): void {
        this.msalClient.logout();
    }

    private async handleResult(result: AuthenticationResult) {
        if (result !== null) {
            if ('given_name' in result.idTokenClaims) {
                this.currentUsername = result.idTokenClaims['given_name'];
            }
        }
    }

}