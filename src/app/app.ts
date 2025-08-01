import { Component } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { LocalStorage } from './share/local-storage';
import { PendingIssuesService } from './services/pending-issues.service';
import { ModalPendingIssues } from './modal-pending-issues/modal-pending-issues';
import { ModalAddPendingIssues } from './modal-add-pending-issues/modal-add-pending-issues';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ModalManageFamily,
    ModalAddMember,
    ModalLogout,
    ModalPendingIssues,
    ModalAddPendingIssues,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AuthService,
    SessionService,
    UsersService,
    InvitesService,
    FirstAccessService,
    PendingIssuesService
  ]
})
export class App  {
  protected title = 'pfinances';  

  private users = new Users;
  private localStorage = new LocalStorage;

  public loadUsers() {
    this.users.userId = this.localStorage.getUserId()!;
    this.users.familyId = this.localStorage.getFamilyId()!;
    this.users.accessToken = this.localStorage.getAccessToken()!;
    this.users.getUsers();
  }

}
