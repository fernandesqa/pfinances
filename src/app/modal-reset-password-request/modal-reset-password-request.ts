import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-reset-password-request',
  imports: [],
  templateUrl: './modal-reset-password-request.html',
  styleUrl: './modal-reset-password-request.css'
})
export class ModalResetPasswordRequest {

  public closeModal() {
    const modal = document.getElementById('modalResetPasswordRequest');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }

}
