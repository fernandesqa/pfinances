import { Component } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';

@Component({
  selector: 'app-modal-pending-issues-reset-notification',
  imports: [],
  templateUrl: './modal-pending-issues-reset-notification.html',
  styleUrl: './modal-pending-issues-reset-notification.css'
})
export class ModalPendingIssuesResetNotification {

  constructor(
    private pendingIssuesService: PendingIssuesService
  ) {}

  public closeModal() {
    const modal = document.getElementById('modalPendingIssuesResetNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }

  public closeModalAndVerifyCheckbox() {
    const modal = document.getElementById('modalPendingIssuesResetNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    const checkbox = document.getElementById('notificationOfResetCheckBox') as HTMLInputElement;
    if(checkbox.checked) {
      this.pendingIssuesService.updateResetNotificationStatus();
    }
  }

  public async resetPendingIssues() {
    const modal = document.getElementById('modalPendingIssuesResetNotification');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');

    await this.pendingIssuesService.resetPendingIssues();
    window.location.reload();
  }
}
