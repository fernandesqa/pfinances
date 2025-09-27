import { Injectable } from '@angular/core';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private url = this.http.getApiUrl() + '/users/';

  //Obtém os dados dos usuários
  public async getUsersData(userId: string, familyId: string, accessToken: string): Promise<any> {
    this.url = this.url +userId+'/families/'+familyId;
    const data = await fetch(this.url, {
            headers: {
                "X-Api-Key": accessToken
            }
        });

        //VERIFICA SE O TOKEN EXPIROU
        this.token.checkWetherTokenExpired(data.status);
        this.url = this.http.getApiUrl() + '/users/';
        return await data.json() ?? [];
  }

  public async requestReset(emailAddress: string): Promise<any> {
    let url = this.http.getApiUrl();
    url = url + '/request-reset';
    var result = await this.http.noAuthPostData(url, 
      {
        "emailAddress": emailAddress
      }
    )

    return result;
  }
}
