import { Component, OnInit } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BudgetsService } from '../services/budgets.service';
import { DomHtml } from '../share/dom-html';
import { DateTime } from '../share/date-time';
import { Monetary } from '../share/monetary';
import { Months } from '../share/months';
import { Years } from '../share/years';

@Component({
  selector: 'app-modal-add-expenses',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-add-expenses.html',
  styleUrl: './modal-add-expenses.css'
})
export class ModalAddExpenses implements OnInit {

  private domHTML = new DomHtml;
  private dateTime = new DateTime;
  public showForm: boolean = false;
  public isInvalidForm: boolean = false;
  public isFutureDate: boolean = false;
  public expenses: any = [];
  public totalExpenses: number = 0;
  public monthYear: string = '';
  public noBudgets: boolean = false;
  public budgetSource: any;
  public budgetControl: any;
  private monetary = new Monetary;
  private categories: any = [];
  private months = new Months;
  private years = new Years;
  private billingMonthsList: any;
  private billingYearsList: any;
  private lastBillingMonthsList: any;
  private lastBillingYearsList: any;
  

  constructor(
    private budgetsService: BudgetsService,
  ) {}

  async ngOnInit() {
    this.showForm = false;
    this.isInvalidForm = false;
    this.isFutureDate = false;
    this.noBudgets = false;
    this.totalExpenses = 1;
    this.budgetSource = [];
    this.budgetControl = [];
    let localTime = this.dateTime.getLocalDateTime();
    const date = localTime.split(',')[0];
    const month = date.split('/')[1];
    const year = date.split('/')[2];
    this.monthYear = month+year;
    this.billingMonthsList = this.months.getMonthsList();
    this.billingYearsList = this.years.getBillingYears();
    this.lastBillingMonthsList = this.months.getMonthsList();
    this.lastBillingYearsList = this.years.getFutureBillingYears();
    this.domHTML.createSpinner('spinnerParentExpense');
    var result = await this.budgetsService.getBudgets(this.monthYear);
    switch(result.status) {
      case 200:
        this.domHTML.removeAllChildNodes('spinnerParentExpense');
        for(var i=0; i<result.response.data.length; i++) {
          var value: number = result.response.data[i].budgetCurrentValue;
            var fixedString: String = value.toFixed(2);
            var budgetCurrentValue: number = Number(fixedString);
            this.budgetControl.push({
                                      "budgetId": result.response.data[i].budgetId,
                                      "budgetDescription": result.response.data[i].budgetDescription,
                                      "budgetCurrentValue":  budgetCurrentValue
                                   });
        }

        for(var i=0; i<this.budgetControl.length; i++) {
          var currentValue = this.monetary.convertToMonetary(this.budgetControl[i].budgetCurrentValue.toString());
          this.budgetSource.push({
                                    "id": this.budgetControl[i].budgetId,
                                    "description": this.budgetControl[i].budgetDescription,
                                    "currentValue": currentValue,
                                    "selected": false
                                });
        }

        this.categories.push("Moradia", "Alimentação", "Saúde", "Educação");

        this.expenses.push({
                              "id": this.totalExpenses,
                              "budgetSource": this.budgetSource,
                              "categories": this.categories,
                              "fixedExpense": false,
                              "installmentsExpense": false,
                              "billingMonths": this.billingMonthsList,
                              "billingYears": this.billingYearsList,
                              "lastBillingMonths": this.lastBillingMonthsList,
                              "lastBillingYears": this.lastBillingYearsList
                           });
                  
        this.domHTML.removeAllChildNodes('spinnerParentSavings');
        this.showForm = true;
        break;
      case 404:
        this.domHTML.removeAllChildNodes('spinnerParentExpense');
        this.noBudgets = true;
        break;
      default:
        this.domHTML.removeAllChildNodes('spinnerParentExpense');
        this.domHTML.createMsgInternalError('spinnerParentExpense');
        break;
    }
  }

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  public addExpense() {}

  public removeLastExpense() {}

  public checkBudget(e: Event) {}

  public addValue(e: Event) {}

  public addDate(e: Event) {}

  public checkFixedExpense(e: Event) {}

  public checkInstallmentsExpense(e: Event) {}

  public checkBillingMonthCbo(e: Event) {}

  public checkBillingYearCbo(e: Event) {}

  public checkLastBillingMonthCbo(e: Event) {}

  public checkLastBillingYearCbo(e: Event) {}

  public addDescription(e: Event) {}

  public createExpenses() {}

}
