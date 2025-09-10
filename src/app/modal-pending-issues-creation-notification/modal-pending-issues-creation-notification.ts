import { Component } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';

@Component({
  selector: 'app-modal-pending-issues-creation-notification',
  imports: [],
  templateUrl: './modal-pending-issues-creation-notification.html',
  styleUrl: './modal-pending-issues-creation-notification.css'
})
export class ModalPendingIssuesCreationNotification {

  constructor(
    private pendingIssuesService: PendingIssuesService
  ) {}

  public closeModal() {
    const modal = document.getElementById('modalPendingIssuesCreationNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }

  public closeModalRememberMeLater() {
    const modal = document.getElementById('modalPendingIssuesCreationNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    const checkbox = document.getElementById('notificationOfCreationCheckBox') as HTMLInputElement;
    if(checkbox.checked) {
      this.pendingIssuesService.updateCreationNotificationStatus();
    }
  }

  public openModalPendingIssuesCreation() {
    //Fecha o modal
    const modal = document.getElementById('modalPendingIssuesCreationNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    
    //Abre o modal de criação de pendências
    const modalAddPendingIssues = document.getElementById('modalAddPendingIssues');
    modalAddPendingIssues?.setAttribute('class', 'modal fade show');
    modalAddPendingIssues?.removeAttribute('aria-hidden');
    modalAddPendingIssues?.setAttribute('aria-modal', 'true');
    modalAddPendingIssues?.setAttribute('style', 'display: block;');
  }
}
