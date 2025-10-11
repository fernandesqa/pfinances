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
}
