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

  //Lista os meses cadastrados na base vinculados ao ano informado
  public async getMonths(year: string): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues-history/users/'+userId+'/years/'+year+'/months';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta os dados do histórico de pendências de acordo com o mês e ano informado
  public async getHistory(monthYear: string): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues-history/users/'+userId+'/periods/'+monthYear+'/data';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta as pendências cadastradas pelo usuário
  public async getUserPendingIssues(): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Exclui uma pendência
  public async deletePendingIssue(id: string): Promise<any> {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId+'/pending-issues-id/'+id+'/delete';
    await this.http.DeleteData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta a quantidade total de pendências do usuário
  public async getTotalPendingIssues() {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues/users/'+userId+'/total';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta notifições
  public async getPendingIssuesNotification() {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/pending-issues-notification/users/'+userId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Atualiza o status de notificação de criação
  public async updateCreationNotificationStatus() {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    let data = {"userId": Number(userId), "notificateCreation": false};
    url = url + '/pending-issues-notification-creation';
    result = await this.http.patchData(url, data);
    return result;
  }

  //Atualiza o status de notificação de reset
  public async updateResetNotificationStatus() {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    let data = {"userId": Number(userId), "notificateReset": false};
    url = url + '/pending-issues-notification-reset';
    result = await this.http.patchData(url, data);
    return result;
  }

  //Reinicia as pendências
  public async resetPendingIssues() {
    let userId = this.localStorage.getUserId();
    let result: any;
    let url = this.http.getApiUrl();
    url = url + '/reset-pending-issues/'+userId;
    result = await this.http.put(url);
    return result;
  }
}
