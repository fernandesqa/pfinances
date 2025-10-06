import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class StatementDetailsService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private localStorage = new LocalStorage;
  
  //Consulta o extrato de um determinado período
  public async getStatementDetails(monthYear: string, budgetId: string): Promise<any> {
    let result: any;
    let userId = this.localStorage.getUserId();
    let familyId = this.localStorage.getFamilyId();
    let url = this.http.getApiUrl();
    url = url + '/statement-details/users/'+userId+'/families/'+familyId+'/periods/'+monthYear+'/budgets/'+budgetId;
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }
}
