import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenExpiredCheckService {

  constructor(
    private router: Router
  ) { }

  checkWetherTokenExpired(requestStatus: number): void {

        if(requestStatus === 401) {
            localStorage.removeItem('pFinancesAccessToken');
            localStorage.removeItem('pFinancesFamilyId');
            localStorage.removeItem('pFinancesRole');
            localStorage.removeItem('pFinancesUserEmailAddress');
            localStorage.removeItem('pFinancesUserId');
            localStorage.removeItem('pFinancesUserName');
            this.router.navigate(['login']);
        }
    
    }
}
