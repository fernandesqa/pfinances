import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { StatementDetailsService } from '../services/statement-details.service';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-modal-statement-details',
  imports: [],
  templateUrl: './modal-statement-details.html',
  styleUrl: './modal-statement-details.css'
})
export class ModalStatementDetails {

  public data: string[][] = [];
  private domHtml = new DomHtml;
  private tableThead: string[] = ["Autor", "Descrição", "Valor", "Data"];

  constructor (
    private statementDetailsService: StatementDetailsService
  ) {}


  public openModal(title: string, monthYear: string, budgetId: string) {

    const elH1 = document.getElementById('modalStatementDetailsTitle') as HTMLElement;
    elH1.innerHTML = '';
    const elH1Node = document.createTextNode(title);
    elH1.appendChild(elH1Node);

    //Abre o modal de detalhamento do extrato
    const modal = document.getElementById('modalStatementDetails');
    modal?.setAttribute('class', 'modal fade show');
    modal?.removeAttribute('aria-hidden');
    modal?.setAttribute('aria-modal', 'true');
    modal?.setAttribute('style', 'display: block;');

    //Chama o serviço para carregar os dados
    this.getDetails(monthYear, budgetId);
  }
  
  public closeModal() {
    const modal = document.getElementById('modalStatementDetails');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }

  private async getDetails(monthYear: string, budgetId: string) {
    this.domHtml.createSpinner('statementDetailsContent');
    var result = await this.statementDetailsService.getStatementDetails(monthYear, budgetId);
    switch(result.status) {
      case 200:
        this.domHtml.removeAllChildNodes('statementDetailsContent');
        for(var i=0; i<result.response.data.length; i++) {
          this.data.push([
                          result.response.data[i].author,
                          result.response.data[i].description,
                          result.response.data[i].value,
                          result.response.data[i].date
                        ]);
        }
        this.domHtml.createTable('statementDetailsContent', this.tableThead, this.data);
        break;
      case 404:
        this.domHtml.removeAllChildNodes('statementDetailsContent');
        this.domHtml.createMsgDataNotFound('statementDetailsContent');
        break;
      default:
        this.domHtml.removeAllChildNodes('statementDetailsContent');
        this.domHtml.createMsgInternalError('statementDetailsContent');
        break;
    }
  }
}
