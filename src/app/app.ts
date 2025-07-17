import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { ModalLogout } from './modal-logout/modal-logout';
import { ModalManageFamily } from './modal-manage-family/modal-manage-family';
import { UsersService } from './services/users.service';
import { ModalAddMember } from './modal-add-member/modal-add-member';
import { InvitesService } from './services/invites.service';
import { Users } from './share/users';
import { FirstAccessService } from './services/first-access.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ModalManageFamily,
    ModalAddMember,
    ModalLogout,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AuthService,
    SessionService,
    UsersService,
    InvitesService,
    FirstAccessService
  ]
})
export class App {
  protected title = 'pfinances';  

  private users = new Users;

  loadUsers() {
    this.users.userId = localStorage.getItem('pFinancesUserId')!;
    this.users.familyId = localStorage.getItem('pFinancesFamilyId')!;
    this.users.accessToken = localStorage.getItem('pFinancesAccessToken')!;
    this.users.getUsers();
  }
}
