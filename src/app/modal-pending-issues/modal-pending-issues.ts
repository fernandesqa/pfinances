import { Component, OnInit } from '@angular/core';
import { PendingIssues } from '../share/pending-issues';
import { CommonModule } from '@angular/common';

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
  public data: any;
  public total: number = 0;
  private updateControl: any = [];

  ngOnInit(): void {
    this.loadPendingIssues();
  }

  public async loadPendingIssues() {
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
  
}
