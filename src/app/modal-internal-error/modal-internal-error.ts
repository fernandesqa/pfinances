import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-internal-error',
  imports: [],
  templateUrl: './modal-internal-error.html',
  styleUrl: './modal-internal-error.css'
})
export class ModalInternalError {

    public openModal(title:string, message: string) {

    const elH1 = document.getElementById('modalInternalErrorTitle') as HTMLElement;
    const elH1Node = document.createTextNode(title);
    elH1.appendChild(elH1Node);

    const elSpan = document.getElementById('modalInternalErrorMessage') as HTMLElement;
    const elSpanNode = document.createTextNode(message);
    elSpan.appendChild(elSpanNode);

    //Abre o modal de criação de pendências
    const modalSuccess = document.getElementById('modalInternalError');
    modalSuccess?.setAttribute('class', 'modal fade show');
    modalSuccess?.removeAttribute('aria-hidden');
    modalSuccess?.setAttribute('aria-modal', 'true');
    modalSuccess?.setAttribute('style', 'display: block;');
  }
  
  public closeModal() {
    const modal = document.getElementById('modalInternalError');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    window.location.reload();
  }

}
