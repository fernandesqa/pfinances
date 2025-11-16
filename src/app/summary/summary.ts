import { Component, OnInit } from '@angular/core';
import { RevenuesService } from '../services/revenues.service';
import { Months } from '../share/months';
import { Monetary } from '../share/monetary';
import { DomHtml } from '../share/dom-html';
import { ExpensesService } from '../services/expenses.service';
import { Years } from '../share/years';
import { BudgetsService } from '../services/budgets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary implements OnInit {

  public isLoadingRevenue: boolean = false;
  public isLoadingExpenses: boolean = false;
  public isRevenueLoaded: boolean = false;
  public isExpensesLoaded: boolean = false;
  private monetary = new Monetary;
  private months = new Months;
  public revenue: string = '';
  public expenses: string = '';
  public month: string = '';
  public expensesMonth: string = '';
  public year: string = '';
  public expensesYear: string = '';
  private domHTML = new DomHtml;
  public isDataFound: boolean = false;
  public isDataNotFound: boolean = false;
  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  private cboMonthChanged: boolean = false;
  private cboYearChanged: boolean = false;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  private monthYear: string = '';
  private budgetUsageMonth: string = '';
  private budgetUsageYear: string = '';
  public isLoadingData: boolean = false;
  public budgetsUsageDataList: any = [];
  public isLoadingBudgetsUsageData: boolean = false;
  public isBudgetUsageDataLoaded: boolean = false;
  private resultBudgetsSummary: any = [];
  public style = {};

  constructor(
    private revenuesService: RevenuesService,
    private expensesService: ExpensesService,
    private budgetsService: BudgetsService
  ) {}

  async ngOnInit() {
    this.isDataFound = true;
    this.domHTML.activateTab('summary');
    this.isRevenueLoaded = false;
    this.isLoadingRevenue = true;
    this.isLoadingExpenses = true;
    this.isBudgetUsageDataLoaded = false;
    this.isLoadingBudgetsUsageData = true;
    let result = await this.revenuesService.getRevenueCurrentMonth();
    let resultExpenses = await this.expensesService.getExpensesCurrentMonth();
    this.revenue = this.monetary.convertToMonetary(result.response.data[0].value)!;
    this.month = this.months.convertMonthNumberToMonthName(result.response.data[0].month);
    this.budgetUsageMonth = result.response.data[0].month;
    this.year = result.response.data[0].year;
    this.budgetUsageYear = result.response.data[0].year;
    this.monthYear = this.budgetUsageMonth+this.budgetUsageYear;
    this.expenses = this.monetary.convertToMonetary(resultExpenses.response.data[0].value);
    this.expensesMonth = this.months.convertMonthNumberToMonthName(resultExpenses.response.data[0].month);
    this.expensesYear = resultExpenses.response.data[0].year;
    this.isLoadingRevenue = false;
    this.isRevenueLoaded = true;
    this.isLoadingExpenses = false;
    this.isExpensesLoaded = true;
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getBillingYears();
    let resultBudgetUsage = await this.budgetsService.getBudgetsUsageData(this.monthYear);
    this.resultBudgetsSummary = resultBudgetUsage;
    switch(resultBudgetUsage.status) {
      case 200:
        for(var i=0; i<resultBudgetUsage.response.data.length; i++) {
          var icon;
          if(resultBudgetUsage.response.data[i].icon==null) {
            icon = "bi bi-wallet2";
          }

          var categoriesList = [];
          for(var j=0; j<resultBudgetUsage.response.data[i].categories.length; j++) {

            switch(resultBudgetUsage.response.data[i].categories[j].category) {
              case 'Moradia':
                this.style = {'stroke': 'red', 'stroke-width': '12'};
                break;
              case 'Alimentação':
                this.style = {'stroke': 'blue', 'stroke-width': '12'};
                break;
              case 'Saúde':
                this.style = {'stroke': 'purple', 'stroke-width': '12'};
                break;
              case 'Educação':
                this.style = {'stroke': 'gray', 'stroke-width': '12'};
                break;
              case 'Transporte':
                this.style = {'stroke': 'gold', 'stroke-width': '12'};
                break;
              case 'Lazer':
                this.style = {'stroke': 'brown', 'stroke-width': '12'};
                break;
              case 'Pessoal':
                this.style = {'stroke': 'orange', 'stroke-width': '12'};
                break;
              case 'Financeiro':
                this.style = {'stroke': 'black', 'stroke-width': '12'};
                break;
            }
            
            categoriesList.push({
                              "category": resultBudgetUsage.response.data[i].categories[j].category,
                              "percentage": parseFloat(resultBudgetUsage.response.data[i].categories[j].percentage),
                              "value": this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].categories[j].value.toString()),
                              "style": this.style
                            });
          }
          
          this.budgetsUsageDataList.push({
                                            "description": resultBudgetUsage.response.data[i].description,
                                            "icon": icon,
                                            "totalSet":  this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalSet.toString()),
                                            "totalUsed": this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalUsed.toString()),
                                            "totalAvailable": this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalAvailable.toString()),
                                            "categories": categoriesList
                                         });
        }
        
        this.isLoadingBudgetsUsageData = false;
        this.isBudgetUsageDataLoaded = true;
        break;
    } 
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

  private async checkCbos() {

    if(!this.isMonthNotSelected && !this.isYearNotSelected && this.cboMonthChanged && this.cboYearChanged) {
      this.isRevenueLoaded = false;
      this.isLoadingRevenue = true;
      this.isExpensesLoaded = false;
      this.isLoadingExpenses = true;
      this.isBudgetUsageDataLoaded = false;
      this.isLoadingBudgetsUsageData = true;
      this.isLoadingData = true;
      this.isDataFound = false;
      this.isDataNotFound = false;
      this.budgetsUsageDataList = [];
      
      const monthCbo = document.getElementById('monthSummary') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearSummary') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.monthYear = month + yearCbo.value;

      let result = await this.revenuesService.getTotalRevenuesByPeriod(this.monthYear);

      switch(result.status) {
        case 200:
          this.revenue = this.monetary.convertToMonetary(result.response.data[0].value)!;
          this.month = this.months.convertMonthNumberToMonthName(result.response.data[0].month);
          this.year = result.response.data[0].year;
          this.isLoadingRevenue = false;
          this.isDataNotFound = false;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.isRevenueLoaded = true;
          break;
        case 404:
          this.isLoadingData = false;
          this.isDataNotFound = true;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.domHTML.createMsgDataNotFound('summaryDataNotFound');
          break;
        
      }

      let resultExpenses = await this.expensesService.getExpensesByPeriod(this.monthYear);

      switch(resultExpenses.status) {
        case 200:
          this.expenses = this.monetary.convertToMonetary(resultExpenses.response.data[0].value);
          this.expensesMonth = this.months.convertMonthNumberToMonthName(resultExpenses.response.data[0].month);
          this.expensesYear = resultExpenses.response.data[0].year;
          this.isLoadingExpenses = false;
          this.isDataNotFound = false;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.isExpensesLoaded = true;
          break;
        case 404:
          this.isLoadingData = false;
          this.isDataNotFound = true;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.domHTML.createMsgDataNotFound('summaryDataNotFound');
          break;
      }

      let resultBudgetUsage = await this.budgetsService.getBudgetsUsageData(this.monthYear);
      switch(resultBudgetUsage.status) {
        case 200:
          for(var i=0; i<resultBudgetUsage.response.data.length; i++) {
            var icon;
            if(resultBudgetUsage.response.data[i].icon==null) {
              icon = "bi bi-wallet2";
            }
            
            this.budgetsUsageDataList.push({
                                              "description": resultBudgetUsage.response.data[i].description,
                                              "icon": icon,
                                              "totalSet":  this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalSet.toString()),
                                              "totalUsed": this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalUsed.toString()),
                                              "totalAvailable": this.monetary.convertToMonetary(resultBudgetUsage.response.data[i].totalAvailable.toString())
                                          });
          }
          this.isLoadingBudgetsUsageData = false;
          this.isDataNotFound = false;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.isBudgetUsageDataLoaded = true;
          break;
        case 404:
          this.isLoadingData = false;
          this.isDataNotFound = true;
          this.domHTML.removeAllChildNodes('summaryDataNotFound');
          this.domHTML.createMsgDataNotFound('summaryDataNotFound');
          break;
      } 

      if(this.isRevenueLoaded && this.isExpensesLoaded && this.isBudgetUsageDataLoaded) {
        this.isLoadingData = false;
        this.isDataFound = true;
      }
    }
  }
}
