import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private localStorage = new LocalStorage;

  //Cadastra novos orçamentos
  public async createBudgets(monthYear: string, budgets: any) {
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/budgets/users/'+userId+'/families/'+familyId+'/periods/'+monthYear+'/create';
    var result = await this.http.postData(url, 
      {
        "budgets": budgets
      }
    )

    return result;
  }

  //Consulta os orçamentos definidos em um determinado período
  public async getBudgetsAlreadySetOnPeriod(monthYear: string): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/list-budgets-already-set-on-period/users/'+userId+'/families/'+familyId+'/periods/'+monthYear;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta os orçamentos definidos no mês anterior ao atual
  public async getPreviousBudgets(): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/list-previous-budgets/users/'+userId+'/families/'+familyId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta os orçamentos de determinado período
  public async getBudgets(monthYear: string): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/list-budgets/users/'+userId+'/families/'+familyId+'/periods/'+monthYear;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta os dados de utilização dos orçamentos
  public async getBudgetsUsageData(monthYear: string) {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/budgets/users/'+userId+'/families/'+familyId+'/periods/'+monthYear;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Transfere valores entre orçamentos
  public async transferBudget(data: any) {
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/transfer-budget/users/'+userId+'/families/'+familyId;
    var result = await this.http.postData(url, data);

    return result;
  }

  //Aumenta o valor do orçamento
  public async increaseBudget(monthYear: string, data: any) {
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/increase-budget/users/'+userId+'/families/'+familyId+'/periods/'+monthYear;
    var result = await this.http.patchData(url, data);

    return result;
  }
}
