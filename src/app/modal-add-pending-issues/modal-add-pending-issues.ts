import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';

@Component({
  selector: 'app-modal-add-pending-issues',
  imports: [
    CommonModule
  ],
  templateUrl: './modal-add-pending-issues.html',
  styleUrl: './modal-add-pending-issues.css'
})
export class ModalAddPendingIssues implements OnInit {

  public fields: any = [];
  public fieldId!: number;
  public emptyField: boolean = false;
  private pendingIssues: any;
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;

  constructor(
    private pendingIssuesService: PendingIssuesService
  ) {}

  ngOnInit(): void {
    this.fieldId = 0;
    this.fields.push({id: this.fieldId});
  }

  public addField() {
    this.fieldId = this.fieldId + 1;
    this.fields.push({id: this.fieldId});
  }

  public removeField() {
    this.fieldId = this.fieldId - 1;
    this.fields.pop();
  }

  public async addPendingIssues() {
    this.pendingIssues = [];
    this.emptyField = false;
    //Verifica se todos os campos foram preenchidos
    for(var i=0; i<this.fields.length; i++) {
      var id = 'description'+i;
      const elInput = document.getElementById(id) as HTMLInputElement;
      if(elInput.value==='') {
        this.emptyField = true;
        i = this.fields.lenght;
      } else {
        this.pendingIssues.push({"pendingIssueDescription": elInput.value});
      }
    }

    //Realiza o cadastro apenas se todos os campos foram preenchidos
    if(!this.emptyField) {
      let result = await this.pendingIssuesService.createPendingIssues(this.pendingIssues);
      switch(result.status) {
        case 200:
          this.modalSuccess.openModal('Cadastro de Pendências', 'Pendência(s) cadastrada(s) com sucesso!');
          break;
        default:
          this.modalInternalError.openModal('Cadastro de Pendências', 'Erro ao cadastrar a(s) pendência(s), por favor tente novamente mais tarde.');
          break;
      }
    }
  }

  public closeModal() {
    const modal = document.getElementById('modalAddPendingIssues');
    modal?.setAttribute('class', 'modal fade');
    modal?.removeAttribute('aria-modal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.removeAttribute('style');
  }
}
