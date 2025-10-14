import { Component } from '@angular/core';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-modal-info',
  imports: [],
  templateUrl: './modal-info.html',
  styleUrl: './modal-info.css'
})
export class ModalInfo {
  
  private domHTML = new DomHtml;

  public openModal(title:string, message: string) {

    const elH1 = document.getElementById('modalInfoTitle') as HTMLElement;
    const elH1Node = document.createTextNode(title);
    elH1.appendChild(elH1Node);

    const elSpan = document.getElementById('modalInfoMessage') as HTMLElement;
    const elSpanNode = document.createTextNode(message);
    elSpan.appendChild(elSpanNode);

    //Abre o modal de mensagens de sucesso
    const modalInfo = document.getElementById('modalInfo');
    modalInfo?.setAttribute('class', 'modal fade show');
    modalInfo?.removeAttribute('aria-hidden');
    modalInfo?.setAttribute('aria-modal', 'true');
    modalInfo?.setAttribute('style', 'display: block;');
  }
  
  public closeModal() {
    const modal = document.getElementById('modalInfo');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
    this.domHTML.removeAllChildNodes('modalInfoTitle');
    this.domHTML.removeAllChildNodes('modalInfoMessage');
  }
}
