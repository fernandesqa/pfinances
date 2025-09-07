import { Component, OnInit } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';

@Component({
  selector: 'app-modal-delete-pending-issue',
  imports: [],
  templateUrl: './modal-delete-pending-issue.html',
  styleUrl: './modal-delete-pending-issue.css'
})
export class ModalDeletePendingIssue implements OnInit {

  public isLoadingData: boolean = false;
  public data: any = [];
  public isDataFound: boolean = false;
  public isDataNotFound: boolean = false;
  public dataInternalError: boolean = false;
  private id = '';

  constructor(
      private pendingIssuesService: PendingIssuesService
    ) {}

  async ngOnInit() {
    this.isLoadingData = true;
    this.getPendingIssues();
  }

  private async getPendingIssues() {
    this.isLoadingData = true;
    this.isDataFound = false;
    this.isDataNotFound = false;
    this.dataInternalError = false;
    let result = await this.pendingIssuesService.getUserPendingIssues();
    switch(result.status) {
      case 200:
        for(var i=0; i<result.response.data.length; i++) {
          this.data.push({"id": result.response.data[i].pendingIssueId, "description": result.response.data[i].pendingIssueDescription});
        }
        console.log(this.data);
        this.isLoadingData = false;
        this.isDataFound = true;
        break;
      case 404:
        this.isDataNotFound = true;
        break;
      default:
        this.dataInternalError = true;
        break;
    }
  }

  public buttonControl(e: Event) {
    const button = document.getElementById('buttonDeletePendingIssues');
    const radio = e.target as HTMLElement;
    button?.removeAttribute('disabled');
    this.id = radio.id;
  }

  public async deletePendingIssue() {
    await this.pendingIssuesService.deletePendingIssue(this.id);
    window.location.reload();
  }

}
