import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private url = this.http.getApiUrl();
  private localStorage = new LocalStorage;

  //Gera os dados do convite do dependente
  async generateInvite(name: string, emailAddress: string): Promise<any> {
    let result = 0;
    this.url = this.url + '/generate-invite';
    await this.http.postData(this.url, 
      {
        "userId": this.localStorage.getUserId(),
        "familyId": this.localStorage.getFamilyId(),
        "name": name,
        "emailAddress": emailAddress
      }
    ).then ( (data) => {
      result = data.response;
    }).catch (error => {
        console.log(error);
        result = error;
    });

    return result;
  }

  //Busca os convites por família
  async getInvites(): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    this.url = this.url + '/family-invites/users/'+userId+'/families/'+familyId
    await this.http.getData(this.url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Valida se o convite informado é válido
  async validateInvite(role: string, inviteCode: string, emailAddress: string): Promise<any> {
    let result = 0;
    this.url = this.url + '/invite';
    await this.http.postData(this.url, 
      {
        "role": role,
        "inviteCode": inviteCode,
        "emailAddress": emailAddress
      }
    ).then ( (data) => {
      switch(data.status) {
        case 400:
          result = data.status;
          this.url = this.http.getApiUrl();
          break;
        default:
          result = data.response;
          this.url = this.http.getApiUrl();
          break;
      }
    }).catch (error => {
        console.log(error);
        result = error;
    });

    return result;
  }
}
