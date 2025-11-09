import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-loading',
  imports: [],
  templateUrl: './modal-loading.html',
  styleUrl: './modal-loading.css'
})
export class ModalLoading {

  public openModal() {

    //Abre o modal de processamento
    const modalLoading = document.getElementById('modalLoading');
    modalLoading?.setAttribute('class', 'modal fade show');
    modalLoading?.removeAttribute('aria-hidden');
    modalLoading?.setAttribute('aria-modal', 'true');
    modalLoading?.setAttribute('style', 'display: block;');
  }
  
  public closeModal() {
    const modal = document.getElementById('modalLoading');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }

}
