import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private localStorage = new LocalStorage;

  //Consulta as categorias de despesas
  public async getExpensesCategories() {
    let result: any;
    let userId = this.localStorage.getUserId();
    let url = this.http.getApiUrl();
    url = url + '/expenses-categories/users/'+userId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Registra as despesas na base
  public async createExpenses(expenses: any) {
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/expenses/users/'+userId+'/families/'+familyId+'/create';
    var result = await this.http.postData(url, 
      {
        "expenses": expenses
      }
    )

    return result;
  }

   //Consulta o total de despesas do mês atual
  public async getExpensesCurrentMonth() {
    let result: any;
    let userId: string = this.localStorage.getUserId()!;
    let familyId: string = this.localStorage.getFamilyId()!;
    let url = this.http.getApiUrl();
    url = url + '/expenses/users/'+userId+'/families/'+familyId+'/current-month';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta o total de despesas do período desejado
  public async getExpensesByPeriod(monthYear: string) {
    let result: any;
    let userId: string = this.localStorage.getUserId()!;
    let familyId: string = this.localStorage.getFamilyId()!;
    let url = this.http.getApiUrl();
    url = url + '/total-expenses/users/'+userId+'/families/'+familyId+'/periods/'+monthYear;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }
}
