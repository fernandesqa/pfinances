import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';

@Injectable({
  providedIn: 'root'
})
export class FirstAccessService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private url = this.http.getApiUrl();

  //Realiza o primeiro acesso do titular
  public async sendHolderData(userName: string, emailAddress: string, password: string, familyName: string): Promise<any> {
    let result = 0;
    this.url = this.url + '/holder-first-access';
    await this.http.postData(this.url, 
      {
        "name": userName,
        "emailAddress": emailAddress,
        "password": password,
        "familyName": familyName
      }
    ).then ( (data) => {
      switch(data.status) {
        case 409:
          result = data.status;
          this.url = this.http.getApiUrl();
          break;
        default:
          result = data.status;
          this.url = this.http.getApiUrl();
          break;
      }
    }).catch (error => {
        console.log(error);
        result = error.status;
    });

    return result;
  }

  //Realiza o primeiro acesso do dependente
  public async sendDependentData(userName: string, emailAddress: string, password: string): Promise<any> {
    let result = 0;
    this.url = this.url + '/dependent-first-access';
    await this.http.postData(this.url, 
      {
        "name": userName,
        "emailAddress": emailAddress,
        "password": password
      }
    ).then ( (data) => {
      switch(data.status) {
        case 409:
          result = data.status;
          this.url = this.http.getApiUrl();
          break;
        default:
          result = data.status;
          this.url = this.http.getApiUrl();
          break;
      }
    }).catch (error => {
        console.log(error);
        result = error.status;
    });

    return result;
  }
}
