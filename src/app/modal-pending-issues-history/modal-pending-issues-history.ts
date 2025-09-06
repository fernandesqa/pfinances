import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PendingIssuesService } from '../services/pending-issues.service';
import { Months } from '../share/months';

@Component({
  selector: 'app-modal-pending-issues-history',
  imports: [
    CommonModule
  ],
  templateUrl: './modal-pending-issues-history.html',
  styleUrl: './modal-pending-issues-history.css'
})
export class ModalPendingIssuesHistory implements OnInit {

  public isLoadingYears: boolean = false;
  public yearsNotFound: boolean = false;
  public yearsFound: boolean = false;
  public years: any = [];
  public months: any = [];
  public internalError: boolean = false;
  public dataInternalError: boolean = false;
  public isLoadingMonths: boolean = false;
  public yearNotSelected: boolean = true;
  public monthsNotFound: boolean = false;
  public monthsFound: boolean = false;
  private objMonths = new Months;
  public isLoadingData: boolean = false;
  public data: any = [];
  public isDataFound: boolean = false;


  constructor(
    private pendingIssuesService: PendingIssuesService
  ) {}

  async ngOnInit() {
    this.isLoadingYears = true;
    await this.getYears();
  }

  private async getYears() {
    let result = await this.pendingIssuesService.getYears();
    this.isLoadingYears = false;
    switch (result.status) {
      case 200:
        this.yearsFound = true;
        for(var i=0; i<result.response.years.length; i++) {
          this.years.push(result.response.years[i].year);
        }
        break;
      case 404:
        this.yearsNotFound = true;
        break;
      default:
        this.internalError = true;
        break;
    }
  }

  public async getMonths(e: Event) {
    const elSelectYears = e.target as HTMLSelectElement;
    if(elSelectYears.value!='ano') {
      this.yearNotSelected = false;
      this.monthsNotFound = false;
      this.internalError = false;
      this.isLoadingMonths = true;
      let result = await this.pendingIssuesService.getMonths(elSelectYears.value);
      this.isLoadingMonths = false;
      switch (result.status) {
        case 200:
          this.isLoadingMonths = false;
          this.monthsFound = true;
          for(var i=0; i<result.response.months.length; i++) {
            this.months.push(result.response.months[i].month);
          }
          break;
        case 404:
          this.monthsNotFound = true;
          break;
        default:
          this.internalError = true;
          break;
      }
    } else {
      this.yearNotSelected = true;
      this.isLoadingMonths = false;
    }
  }

  public buttonControl(e: Event) {
    const elMonth = e.target as HTMLSelectElement;
    const button = document.getElementById('buttonGetHistory') as HTMLButtonElement;

    if(elMonth.value!='mes') {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'true');
    }
  }

  public async getPendingIssuesHistory() {
    this.isLoadingData = true;
    this.isDataFound = false;
    const month = document.getElementById('months') as HTMLSelectElement;
    const year = document.getElementById('years') as HTMLSelectElement;
    var monthNumber = this.objMonths.convertMonthNameToMonthNumber(month.value);
    var monthYear = monthNumber + year.value;
    let result = await this.pendingIssuesService.getHistory(monthYear);
    switch(result.status) {
      case 200:
        for (var i=0; i<result.response.data.length; i++) {
          if(result.response.data[i].done == true) {
            this.data.push({"description": result.response.data[i].pendingIssueDescription, "status": "Sim"});
          } else {
            this.data.push({"description": result.response.data[i].pendingIssueDescription, "status": "Não"});
          } 
        }
        this.isLoadingData = false;
        this.isDataFound = true;
        break;
      default:
        this.isLoadingData = false;
        break;
    }
  }

}
