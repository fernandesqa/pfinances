import { Component, OnInit } from '@angular/core';
import { PendingIssues } from '../share/pending-issues';
import { CommonModule } from '@angular/common';
import { PendingIssuesService } from '../services/pending-issues.service';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';

@Component({
  selector: 'app-modal-pending-issues',
  imports: [
    CommonModule
  ],
  templateUrl: './modal-pending-issues.html',
  styleUrl: './modal-pending-issues.css'
})
export class ModalPendingIssues implements OnInit {

  private pendingIssues = new PendingIssues;
  public isLoadingPendingIssues: boolean = false;
  public dataNotFound: boolean = false;
  public dataFound: boolean = false;
  public pendingIssuesData: any;
  public internalError: boolean = false;
  public data: any;
  public total: number = 0;
  private updateControl: any = [];
  private pendingIssuesUpdate: any = [];
  private totalPendingIssues: any;
  private notifications: any;
  public reset: boolean = false;
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;

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
    this.reset = false;
    this.isLoadingPendingIssues = true;
    this.pendingIssuesData = await this.pendingIssues.loadPendingIssues();
    switch(this.pendingIssuesData.status) {
      case 200:
        this.isLoadingPendingIssues = false;
        this.data = this.pendingIssuesData.response.data;
        this.total = this.pendingIssuesData.response.total;
        for(var i=0; i<this.total; i++) {
          if(!this.pendingIssuesData.response.data[i].done) {
            this.updateControl.push({id: this.pendingIssuesData.response.data[i].pendingIssueId, selected: false});
          }
        }
        this.dataFound = true;
        break;
      case 404:
        this.isLoadingPendingIssues = false;
        this.dataNotFound = true;
        this.totalPendingIssues = await this.pendingIssuesService.getTotalPendingIssues();
        if(this.totalPendingIssues.response.total==0) {
          this.notifications = await this.pendingIssuesService.getPendingIssuesNotification();
          if(this.notifications.response.data[0].pendingIssuesNotificationCreation) {
            const modalCreation = document.getElementById('modalPendingIssuesCreationNotification');
            modalCreation?.setAttribute('class', 'modal fade show');
            modalCreation?.removeAttribute('aria-hidden');
            modalCreation?.setAttribute('aria-modal', 'true');
            modalCreation?.setAttribute('style', 'display: block;');
          } 
        } else {
          this.reset = true;
          this.notifications = await this.pendingIssuesService.getPendingIssuesNotification();
          if(this.notifications.response.data[0].pendingIssuesNotificationReset) {
            const modalReset = document.getElementById('modalPendingIssuesResetNotification');
            modalReset?.setAttribute('class', 'modal fade show');
            modalReset?.removeAttribute('aria-hidden');
            modalReset?.setAttribute('aria-modal', 'true');
            modalReset?.setAttribute('style', 'display: block;');
          }
        }
        break;
      default:
        this.isLoadingPendingIssues = false;
        this.internalError = true;
        break;
    }
  }

  public updateControlList(event: Event) {
    const element = event.target as HTMLElement;
    for(var i=0; i<this.updateControl.length; i++) {
      if(this.updateControl[i].id==element.id) {
        if(this.updateControl[i].selected){
          this.updateControl[i].selected = false;
        } else {
          this.updateControl[i].selected = true;
        }
      }
    }
    //Habilita ou desabilita o botão Atualizar
    const updateButton = document.getElementById('buttonUpdateStatus') as HTMLButtonElement;
    var anySelected = false;
    for(var i=0; i<this.updateControl.length; i++) {
      if(this.updateControl[i].selected) {
        anySelected = true;
        i = this.updateControl.length;
        updateButton.removeAttribute('disabled');
      } else if (i+1==this.updateControl.length && !anySelected) {
        updateButton.setAttribute('disabled', '');
      }
    }
  }

  public async updatePendingIssuesStatus() {
    this.pendingIssuesUpdate = [];
    for(var i=0; i<this.updateControl.length; i++) {
      if(this.updateControl[i].selected) {
        this.pendingIssuesUpdate.push({"pendingIssueId": this.updateControl[i].id, "done": true});
      }
    }

    //Atualiza o status das pendências
    let result = await this.pendingIssuesService.updatePendingIssueStatus(this.pendingIssuesUpdate);
    switch(result.status) {
      case 200:
        this.modalSuccess.openModal('Pendências', 'Situação da(s) pendência(s) atualizada com sucesso!');
        break;
      default:
        this.modalInternalError.openModal('Pendências', 'Erro ao atualizar a situação da(s) pendência(s), por favor tente novamente mais tarde.');
        break;
    } 
  }

  //Reinicia as pendências
  public async resetPendingIssues() {
    let result = await this.pendingIssuesService.resetPendingIssues();
    switch(result.status) {
      case 200:
        this.modalSuccess.openModal('Reiniciar Pendências', 'Pendência(s) reiniciada(s) com sucesso!');
        break;
      default:
        this.modalInternalError.openModal('Reiniciar Pendências', 'Erro ao reiniciar pendência(s), por favor tente novamente mais tarde.');
        break;
    }
  }
  
}
