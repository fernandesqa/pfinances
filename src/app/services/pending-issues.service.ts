import { Injectable } from '@angular/core';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Router } from '@angular/router';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class PendingIssuesService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private url = this.http.getApiUrl();
  private localStorage = new LocalStorage;

  //Consulta as pendências do mês e ano atual
  public async getCurrentMonth(): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    this.url = this.url + '/pending-issues/users/'+userId+'/current-month';
    await this.http.getData(this.url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }
}
