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
  private localStorage = new LocalStorage;

  //Consulta as pendências do mês e ano atual
  public async getCurrentMonth(): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId+'/current-month';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Atualiza o status das pendências
  public async updatePendingIssueStatus(pendingIssues: any): Promise<any> {
    let userId = this.localStorage.getUserId();
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId+'/update-status';
    await this.http.patchData(url, 
      {
        "pendingIssues": pendingIssues
      }
    )
  }

  //Cadastra novas pendências
  public async createPendingIssues(pendingIssues: any): Promise<any> {
    let userId = this.localStorage.getUserId();
    let url = this.http.getApiUrl();
    url = url + '/create-pending-issues/users/'+userId;
    await this.http.postData(url, 
      {
        "pendingIssues": pendingIssues
      }
    )
  }

  //Atualiza as pendências
  public async updatePendingIssues(pendingIssues: any): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId+'/update-description';
    result = await this.http.putData(url, pendingIssues)
    return result;
  }

  //Lista os anos cadastrados na base vinculados ao id do usuário
  public async getYears(): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues-history/users/'+userId+'/years';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }
}
