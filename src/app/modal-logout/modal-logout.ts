import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { TokenExpiredCheckService } from '../services/token-expired-check.service';
import { LocalStorage } from '../share/locasStorage';

@Component({
  selector: 'app-modal-logout',
  imports: [],
  templateUrl: './modal-logout.html',
  styleUrl: './modal-logout.css'
})
export class ModalLogout {

  private localStorage = new LocalStorage;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private token: TokenExpiredCheckService
  ) {}

  async logout() {
    let status = await this.sessionService.deleteSession();
    switch(status) {
      case 201:
        this.localStorage.removeItems();
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
