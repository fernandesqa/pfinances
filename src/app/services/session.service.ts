import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

    private userId: string = localStorage.getItem('pFinancesUserId')!;
    private sessionUrl: string = 'https://pfinances.com.br/app/apis/session/'+this.userId;
    private accessToken = localStorage.getItem('pFinancesAccessToken')!;

    constructor() {}

    async deleteSession(): Promise<number> {

        const response = await fetch(this.sessionUrl, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.accessToken
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        return response.status;
    }
}
