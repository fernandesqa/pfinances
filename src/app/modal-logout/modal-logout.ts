import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from '../services/token-expired-check.service';

@Component({
  selector: 'app-modal-logout',
  imports: [],
  templateUrl: './modal-logout.html',
  styleUrl: './modal-logout.css'
})
export class ModalLogout {

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private token: TokenExpiredCheckService
  ) {}

  async logout() {
    let status = await this.sessionService.deleteSession();
    switch(status) {
      case 201:
        localStorage.removeItem('pFinancesAccessToken');
        localStorage.removeItem('pFinancesFamilyId');
        localStorage.removeItem('pFinancesRole');
        localStorage.removeItem('pFinancesUserEmailAddress');
        localStorage.removeItem('pFinancesUserId');
        localStorage.removeItem('pFinancesUserName');
        this.router.navigate(['login']);
        break;
      default:
        console.log('Erro ao excluir sessão, o serviço retornou erro '+status);
        //VERIFICA SE O TOKEN EXPIROU
        this.token.checkWetherTokenExpired(status);
        break;
    }
  }

}
