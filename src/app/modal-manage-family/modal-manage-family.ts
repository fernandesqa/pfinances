import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalInvites } from '../modal-invites/modal-invites';
import { Invites } from '../share/invites';

@Component({
  selector: 'app-modal-manage-family',
  imports: [
    CommonModule,
    ModalInvites
  ],
  providers: [],
  templateUrl: './modal-manage-family.html',
  styleUrl: './modal-manage-family.css'
})
export class ModalManageFamily {

  constructor() {}

  private invites = new Invites;

  loadInvites() {
    this.invites.getInvites();
  }

}
