import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from './token-expired-check.service';
import { Http } from '../share/http';
import { LocalStorage } from '../share/local-storage';

@Injectable({
  providedIn: 'root'
})
export class RevenuesService {

  private router = new Router
  private token = new TokenExpiredCheckService(this.router);
  private http = new Http(this.token);
  private localStorage = new LocalStorage;

  //Consulta a receita total do mês atual
  public async getRevenueCurrentMonth() {
    let result: any;
    let userId: string = this.localStorage.getUserId()!;
    let familyId: string = this.localStorage.getFamilyId()!;
    let url = this.http.getApiUrl();
    url = url + '/revenues/users/'+userId+'/families/'+familyId+'/current-month';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Consulta as receitas cadastradas no mês anterior
  public async getRevenueLastMonth() {
    let result: any;
    let userId: string = this.localStorage.getUserId()!;
    let familyId: string = this.localStorage.getFamilyId()!;
    let url = this.http.getApiUrl();
    url = url + '/revenues/users/'+userId+'/families/'+familyId+'/last-month';
    await this.http.getData(url).then( (data) => {
      result = data;
    }).catch (error => {
      result = error;
    });

    return result;
  }

  //Cadastra novas receitas
  public async createRevenues(monthYear: string, revenues: any) {
    let userId = this.localStorage.getUserId();
    let url = this.http.getApiUrl();
    url = url + '/revenues/users/'+userId+'/periods/'+monthYear+'/create';
    var result = await this.http.postData(url, 
      {
        "revenues": revenues
      }
    )

    return result;
  }
}
