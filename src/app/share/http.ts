import { Injectable } from "@angular/core";
import { TokenExpiredCheckService } from "../services/token-expired-check.service";

@Injectable()
export class Http {
    constructor(private sessionToken: TokenExpiredCheckService) {}

    private token = localStorage.getItem('pFinancesAccessToken');

    getApiUrl(): string {
        var url = 'https://pfinances.com.br/app/apis';
        return url;
    }

    //UTILIZAR ESSE MÉTODO COM REQUISIÇÕES GET
    async getData(url: string) {
        
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.token!
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        //VERIFICA SE O TOKEN EXPIROU
        this.sessionToken.checkWetherTokenExpired(response.status);
        const responseObj = await response.json();
        return responseObj;
    }

    //UTILIZAR ESSE MÉTODO COM REQUISIÇÕES GET
    async getStatusCode(url: string) {
        
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.token!
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        //VERIFICA SE O TOKEN EXPIROU
        this.sessionToken.checkWetherTokenExpired(response.status);
        await response.json();
        var statusCode = response.status;
        return statusCode;
    }

    //UTILIZAR ESSE MÉTODO COM REQUISIÇÕES POST
    async postData(url: string, data: {}) {

        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.token!
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });
        const responseObj = {status: response.status, response: await response.json()}
        return responseObj;
    }

    //UTILIZAR ESSE MÉTODO EM REQUISIÇÕES PUT
    async putData(url: string, data: {}) {

        const response = await fetch(url, {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.token!
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });
        const responseObj = {status: response.status, response: await response.json()}
        return responseObj;
    }

    //UTILIZAR ESSE MÉTODO PARA REQUISIÇÕES DELETE
    async DeleteData(url: string) {

        const response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.token!
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        //VERIFICA SE O TOKEN EXPIROU
        this.sessionToken.checkWetherTokenExpired(response.status);
        await response.json();
        var statusCode = response.status;
        return statusCode;
    }
}