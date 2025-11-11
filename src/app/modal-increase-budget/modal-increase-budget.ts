import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { BudgetsService } from '../services/budgets.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { RevenuesService } from '../services/revenues.service';
import { SavingsService } from '../services/savings.service';
import { DomHtml } from '../share/dom-html';
import { Monetary } from '../share/monetary';

@Component({
  selector: 'app-modal-increase-budget',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-increase-budget.html',
  styleUrl: './modal-increase-budget.css'
})
export class ModalIncreaseBudget implements OnInit {

  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  public isMonthIncreaseBudgetNotSelected: boolean = false;
  public isYearIncreaseBudgetNotSelected: boolean = false;
  public showResult: boolean = false;
  public revenueSourceList: any;
  public isRevenueSourceNotSelected: boolean = false;
  public budgetsList: any;
  public isBudgetToIncreaseNotSelected: boolean = false;
  public isInvalidValue: boolean = false;
  private cboMonthChanged: boolean = false;
  private cboYearChanged: boolean = false;
  private domHtml = new DomHtml;
  private monthYear: string = '';
  private monetary = new Monetary;

  constructor(
    private revenuesService: RevenuesService,
    private savingsService: SavingsService,
    private budgetsService: BudgetsService
  ) {}

  ngOnInit(): void {

    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getBillingYears();
    
  }

  public checkMonthIncreaseBudgetCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboMonthChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthIncreaseBudgetNotSelected = true;
      this.checkCbos();
    } else {
      this.isMonthIncreaseBudgetNotSelected = false;
      this.checkCbos();
    }
  }

  public checkYearIncreaseBudgetCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearIncreaseBudgetNotSelected = true;
      this.checkCbos();
    } else {
      this.isYearIncreaseBudgetNotSelected = false;
      this.checkCbos();
    }
  }

  private async checkCbos() {
    if(!this.isMonthIncreaseBudgetNotSelected && !this.isYearIncreaseBudgetNotSelected && this.cboMonthChanged && this.cboYearChanged) {
      this.showResult = false;
      this.revenueSourceList = [];
      this.budgetsList = [];
      this.domHtml.createSpinner('increaseBudgetSpinner');
      const monthCbo = document.getElementById('monthIncreaseBudget') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearIncreaseBudget') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.monthYear = month + yearCbo.value;

      var result = await this.revenuesService.getRevenuesByPeriod(this.monthYear);

      switch(result.status) {
        case 200:
          for(var i=0; i<result.response.data.length; i++) {
            var value: number = result.response.data[i].currentValue;
            var fixedString: String = value.toFixed(2);
            var RevenueCurrentValue: number = Number(fixedString);
            this.revenueSourceList.push({
                                          "type": "revenue",
                                          "id": result.response.data[i].revenueId,
                                          "revenueSourceDescription": result.response.data[i].revenueDescription,
                                          "currentValue": this.monetary.convertToMonetary(RevenueCurrentValue.toString())
                                        });
          }

          result = await this.savingsService.getSavings();

          switch(result.status) {
            case 200:
              for(var i=0; i<result.response.data.length; i++) {
                this.revenueSourceList.push({
                                            "type": "savings",
                                            "id": result.response.data[i].savingsId,
                                            "revenueSourceDescription": result.response.data[i].savingsDescription,
                                            "currentValue": this.monetary.convertToMonetary(result.response.data[i].currentValue.toString())
                                          });
              }
              break;
          }

          var result = await this.budgetsService.getBudgets(this.monthYear);

          switch(result.status) {
            case 200:
              for(var i=0; i<result.response.data.length; i++) {
                this.budgetsList.push({
                                                "budgetDestinationRevenueId": result.response.data[i].revenueId,
                                                "budgetId": result.response.data[i].budgetId,
                                                "budgetDescription": result.response.data[i].budgetDescription,
                                                "budgetCurrentValue": result.response.data[i].budgetCurrentValue
                                            });
              }
              break;
          }
          this.domHtml.removeAllChildNodes('increaseBudgetSpinner');
          this.showResult = true;
          break;
        case 404:
          this.domHtml.removeAllChildNodes('increaseBudgetSpinner');
          this.domHtml.createMsgDataNotFound('increaseBudgetSpinner');
          break;
        default:
          this.domHtml.removeAllChildNodes('increaseBudgetSpinner');
          this.domHtml.createMsgInternalError('increaseBudgetSpinner');
          break;
      }
    }
  }

  public checkRevenueSourceCbo(e: Event) {
    const revenueSourceCbo = e.target as HTMLSelectElement;
    const input = document.getElementById('revenueSourceValue') as HTMLInputElement;

    if(revenueSourceCbo.value=='selecione a fonte de receita') {
      this.isRevenueSourceNotSelected = true;
    } else {
      this.isRevenueSourceNotSelected = false;
      for(var i=0; i<this.revenueSourceList.length; i++) {
        if(this.revenueSourceList[i].revenueSourceDescription==revenueSourceCbo.value) {
          input.setAttribute('value', this.revenueSourceList[i].currentValue);
        }
      }
    }
  }

  public checkBudgetToIncreaseCbo(e: Event) {}

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  public addValue(e: Event) {}

}
