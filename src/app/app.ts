import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { ModalLogout } from './modal-logout/modal-logout';
import { ModalManageFamily } from './modal-manage-family/modal-manage-family';
import { UsersService } from './services/users.service';
import { ModalAddMember } from './modal-add-member/modal-add-member';
import { InvitesService } from './services/invites.service';

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
    InvitesService
  ]
})
export class App {
  protected title = 'pfinances';

  constructor() {}
}
