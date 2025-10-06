import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-success',
  imports: [],
  templateUrl: './modal-success.html',
  styleUrl: './modal-success.css'
})
export class ModalSuccess {


  public openModal(title:string, message: string) {

    const elH1 = document.getElementById('modalSuccessTitle') as HTMLElement;
    const elH1Node = document.createTextNode(title);
    elH1.appendChild(elH1Node);

    const elSpan = document.getElementById('modalSuccessMessage') as HTMLElement;
    const elSpanNode = document.createTextNode(message);
    elSpan.appendChild(elSpanNode);

    //Abre o modal de mensagens de sucesso
    const modalSuccess = document.getElementById('modalSuccess');
    modalSuccess?.setAttribute('class', 'modal fade show');
    modalSuccess?.removeAttribute('aria-hidden');
    modalSuccess?.setAttribute('aria-modal', 'true');
    modalSuccess?.setAttribute('style', 'display: block;');
  }
  
  public closeModal() {
    const modal = document.getElementById('modalSuccess');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    window.location.reload();
  }

}
