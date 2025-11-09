import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';
import { PendingIssues } from '../share/pending-issues';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';
import { ModalLoading } from '../modal-loading/modal-loading';

@Component({
  selector: 'app-modal-edit-pending-issues',
  imports: [
    CommonModule
  ],
  templateUrl: './modal-edit-pending-issues.html',
  styleUrl: './modal-edit-pending-issues.css'
})
export class ModalEditPendingIssues implements OnInit {

  public isLoadingPendingIssues: boolean = false;
  public dataNotFound: boolean = false;
  public internalError: boolean = false;
  public dataFound: boolean = false;
  private pendingIssuesData: any;
  public data: any;
  public total: number = 0;
  private idsList: any = [];
  private pendingIssuesUpdateList: any = {"pendingIssues": []};
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;
  private modalLoading = new ModalLoading;

  constructor(
    private pendingIssuesService: PendingIssuesService
  ) {}

  ngOnInit(): void {
    this.loadPendingIssues();
  }

    public async loadPendingIssues() {
    this.dataFound = false;
    this.dataNotFound = false;
    this.internalError = false;
    this.isLoadingPendingIssues = true;
    this.pendingIssuesData = await this.pendingIssuesService.getCurrentMonth();
    switch(this.pendingIssuesData.status) {
      case 200:
        this.isLoadingPendingIssues = false;
        this.data = this.pendingIssuesData.response.data;
        this.total = this.pendingIssuesData.response.total;
        this.dataFound = true;
        break;
      case 404:
        this.isLoadingPendingIssues = false;
        this.dataNotFound = true;
        break;
      default:
        this.isLoadingPendingIssues = false;
        this.internalError = true;
        break;
    }
  }

  public enableFields(e: Event) {
    const targetElement = e.target as HTMLElement;
    const buttonUpdate = document.getElementById("btnEditPendingIssues") as HTMLButtonElement;
    var selected = false;
    if(this.idsList.length > 0) {
      for(var i=0; i<this.idsList.length; i++) {
        if(this.idsList[i]==targetElement.id) {
          selected = true;
          const indexToRemove: number = i;
          this.idsList.splice(indexToRemove, 1);
          if(this.idsList.length==0) {
            buttonUpdate.setAttribute('disabled', 'true');
          }
          const input = document.getElementById("description"+targetElement.id);
          const checkbox = document.getElementById("checkbox"+targetElement.id);
          input?.setAttribute('disabled', 'true');
          checkbox?.setAttribute('disabled', 'true');
          for(var j=0; j<this.pendingIssuesUpdateList.pendingIssues.length; j++) {
            if(this.pendingIssuesUpdateList.pendingIssues[j].pendingIssueId==targetElement.id) {
              const indexToRemove: number = j;
              this.pendingIssuesUpdateList.pendingIssues.splice(indexToRemove, 1);
            }
          }
        }
      }
      
      if(!selected) {
        this.idsList.push(targetElement.id);
        const input = document.getElementById("description"+targetElement.id) as HTMLInputElement;
        const checkbox = document.getElementById("checkbox"+targetElement.id) as HTMLInputElement;
        input?.removeAttribute('disabled');
        checkbox?.removeAttribute('disabled');
        var done = false;
        if(checkbox?.checked) {
          done = true;
        }
        const id: number = +targetElement.id;
        this.pendingIssuesUpdateList.pendingIssues.push({
          "pendingIssueId": id,
          "pendingIssueDescription": input.value,
          "done": done
        });
      }
    } else {
      this.idsList.push(targetElement.id);
      const input = document.getElementById("description"+targetElement.id) as HTMLInputElement;
      const checkbox = document.getElementById("checkbox"+targetElement.id) as HTMLInputElement;
      input?.removeAttribute('disabled');
      checkbox?.removeAttribute('disabled');
      var done = false;
      if(checkbox?.checked) {
        done = true;
      }
      const id: number = +targetElement.id;
      this.pendingIssuesUpdateList.pendingIssues.push({
        "pendingIssueId": id,
        "pendingIssueDescription": input.value,
        "done": done
      });
    }
  }

  public newDescription(e: Event) {
    const input = e.target as HTMLInputElement;
    const buttonUpdate = document.getElementById("btnEditPendingIssues") as HTMLButtonElement;
    var id: number = +input.id.split("description")[1];

    for(var i=0; i<this.pendingIssuesUpdateList.pendingIssues.length; i++) {
      if(this.pendingIssuesUpdateList.pendingIssues[i].pendingIssueId==id) {
        this.pendingIssuesUpdateList.pendingIssues[i].pendingIssueDescription = input.value;
      }
    }
    buttonUpdate.removeAttribute('disabled');
  }

  public newStatus(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const buttonUpdate = document.getElementById("btnEditPendingIssues") as HTMLButtonElement;
    var id: number = +checkbox.id.split("checkbox")[1];
    var done = false;
    if(checkbox.checked) {
      done = true;
    }

    for(var i=0; i<this.pendingIssuesUpdateList.pendingIssues.length; i++) {
      if(this.pendingIssuesUpdateList.pendingIssues[i].pendingIssueId==id) {
        this.pendingIssuesUpdateList.pendingIssues[i].done = done;
      }
    }
    buttonUpdate.removeAttribute('disabled');    
  }

  public async editPendingIssues() {
    this.modalLoading.openModal();
    let result = await this.pendingIssuesService.updatePendingIssues(this.pendingIssuesUpdateList);
    switch(result.status) {
      case 200:
        this.modalLoading.closeModal();
        this.modalSuccess.openModal('Edição de Pendências', 'Pendência(s) editada(s) com sucesso!');
        break;
      default:
        this.modalLoading.closeModal();
        this.modalInternalError.openModal('Edição de Pendências', 'Erro ao editar pendência(s), por favor tente novamente mais tarde.');
        break;
    }
  }

}
