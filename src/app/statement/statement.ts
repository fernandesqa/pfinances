import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { StatementService } from '../services/statement.service';
import { ModalStatementDetails } from '../modal-statement-details/modal-statement-details';
import { StatementDetailsService } from '../services/statement-details.service';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-statement',
  imports: [],
  templateUrl: './statement.html',
  styleUrl: './statement.css'
})
export class Statement implements OnInit {

  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  private cboMonthChanged: boolean = false;
  private cboYearChanged: boolean = false;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  private monthYear: string = '';
  public isLoadingData: boolean = false;
  public isDataFound: boolean = false;
  public isDataNotFound: boolean = false;
  public dataInternalError: boolean = false;
  public data: any = [];
  private statementDetailsService = new StatementDetailsService;
  private modalStatementDetails = new ModalStatementDetails(this.statementDetailsService);
  private domHTML = new DomHtml;

  constructor(
    private statementService: StatementService
  ) {}

  ngOnInit(): void {
    this.domHTML.activateTab('statement');
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getLastYears(5);
  }

  public checkMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboMonthChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthNotSelected = true;
      this.checkCbos();
    } else {
      this.isMonthNotSelected = false;
      this.checkCbos();
    }
  }

  public checkYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearNotSelected = true;
      this.checkCbos();
    } else {
      this.isYearNotSelected = false;
      this.checkCbos();
    }
  }

  private checkCbos() {
    const button = document.getElementById('buttonGetStatement') as HTMLButtonElement;

    if(!this.isMonthNotSelected && !this.isYearNotSelected && this.cboMonthChanged && this.cboYearChanged) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'true');
    }
  }

  public async getStatement() {
    this.isDataFound = false;
    this.isDataNotFound = false;
    this.dataInternalError = false;
    this.isLoadingData = true;
    const cboMonth = document.getElementById('monthStatement') as HTMLSelectElement;
    const cboYear = document.getElementById('yearStatement') as HTMLSelectElement;
    var month = this.months.convertMonthNameToMonthNumber(cboMonth.value);
    var year = cboYear.value;
    this.monthYear = month+year;
    var result = await this.statementService.getStatement(this.monthYear);

    switch(result.status) {
      case 200:
        this.isLoadingData = false;
        for(var i=0; i<result.response.data.length; i++) {
          this.data.push({
                          "author": result.response.data[i].author, 
                          "description": result.response.data[i].description, 
                          "value": result.response.data[i].value,
                          "date": result.response.data[i].date,
                          "origin": result.response.data[i].origin,
                          "destination": result.response.data[i].destination,
                          "budgetId": result.response.data[i].budgetId
                        });
        }
        this.isDataFound = true;
        break;
      case 404:
        this.isLoadingData = false;
        this.isDataNotFound = true;
        break;
      default:
        this.isLoadingData = false;
        this.dataInternalError = true;
        break;
    }
  }

  public openModalStatementDetails(e: Event, title: string) {
    const element = e.target as HTMLElement;
    this.modalStatementDetails.openModal(title, this.monthYear, element.id);
  }

}
