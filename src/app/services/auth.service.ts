import { Injectable } from '@angular/core';
import { LocalStorage } from '../share/localStorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private authUrl: string = 'https://pfinances.com.br/app/apis/auth';
    public emailAddress!: string;
    public password!: string;
    private localStorage = new LocalStorage;

    async Authenticate(): Promise<number> {
        
        let result = 0;
       await this.postData(this.authUrl, { "email": this.emailAddress, "password": this.password }, ).then((data) => {
            
            result = data.status;

            if(result==200) {
                this.localStorage.setUserId(data.response.id);
                this.localStorage.setUserName(data.response.name);
                this.localStorage.setRole(data.response.roleId);
                this.localStorage.setUserEmailAddress(data.response.email);
                this.localStorage.setFamilyId(data.response.familyId);
                this.localStorage.setAccessToken(data.response.accessToken);
            }

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
