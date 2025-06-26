import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = 'https://pfinances.com.br/app/apis/auth';
    emailAddress!: string;
    password!: string;

    async Authenticate(): Promise<number> {
        
        let result = 0;
       await this.postData(this.authUrl, { "email": this.emailAddress, "password": this.password }, ).then((data) => {
            
            result = data.status;

            localStorage.setItem('pFinancesUserId', data.response.id);
            localStorage.setItem('pFinancesFamilyId', data.response.familyId);
            localStorage.setItem('pFinancesRole', data.response.roleId);
            localStorage.setItem('pFinancesUserName', data.response.name);
            localStorage.setItem('pFinancesUserEmailAddress', data.response.email);
            localStorage.setItem('pFinancesAccessToken', data.response.accessToken);

        }).catch (error => {
            console.log(error);
            result = error;
        });

        return result;
        
    }

    async postData(url: string, data: {}) {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });
        const responseObj = {status: response.status, response: await response.json()}
        return responseObj;
    }
}
