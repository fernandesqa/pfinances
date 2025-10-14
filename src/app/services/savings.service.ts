import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private localStorage = new LocalStorage;

  //Consulta as economias da família
  public async getSavings() {
    let result: any;
    let userId: string = this.localStorage.getUserId()!;
    let familyId: string = this.localStorage.getFamilyId()!;
    let url = this.http.getApiUrl();
    url = url + '/list-savings/users/'+userId+'/families/'+familyId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }
}
