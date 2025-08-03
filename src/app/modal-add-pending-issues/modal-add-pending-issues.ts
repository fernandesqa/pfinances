import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';

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
      await this.pendingIssuesService.createPendingIssues(this.pendingIssues);
      window.location.reload();
    }
  }
}
