import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { TokenExpiredCheckService } from './services/token-expired-check.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AuthService,
    SessionService
  ]
})
export class App {
  protected title = 'pfinances';

  constructor(
    private sessionService: SessionService,
    private token: TokenExpiredCheckService,
    private router: Router
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
