import { Component, OnInit } from '@angular/core';
import { Years } from '../share/years';
import { Months } from '../share/months';
import { DomHtml } from '../share/dom-html';
import { BudgetsService } from '../services/budgets.service';
import { Monetary } from '../share/monetary';

@Component({
  selector: 'app-modal-budget-transfering',
  imports: [],
  templateUrl: './modal-budget-transfering.html',
  styleUrl: './modal-budget-transfering.css'
})
export class ModalBudgetTransfering implements OnInit {

  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  public isMonthWithdrawNotSelected: boolean = false;
  public isYearWithdrawNotSelected: boolean = false;
  public isMonthDestinationNotSelected: boolean = false;
  public isYearDestinationNotSelected: boolean = false;
  private cboMonthWithdrawChanged: boolean = false;
  private cboYearWithdrawChanged: boolean = false;
  private domHtml = new DomHtml;
  private withdrawMonthYear: string = '';
  private destinationMonthYear: string = '';
  public showBudgetsWithdrawCbo: boolean = false;
  public showBudgetDestinationCbo: boolean = false;
  public budgetWithdrawList: any;
  public budgetDestinationList: any;
  public isBudgetWithdrawNotSelected: boolean = false;
  public isBudgetDestinationNotSelected: boolean = false;
  private monetary = new Monetary;
  private finalList: any = [];

  constructor(
    private budgetsService: BudgetsService
  ) {}


  ngOnInit(): void {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getBillingYears();
  }

  public checkMonthWithdrawCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboMonthWithdrawChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthWithdrawNotSelected = true;
      this.checkWithdrawCbos();
    } else {
      this.isMonthWithdrawNotSelected = false;
      this.checkWithdrawCbos();
    }
  }
  

  public checkYearWithdrawCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboYearWithdrawChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearWithdrawNotSelected = true;
      this.checkWithdrawCbos();
    } else {
      this.isYearWithdrawNotSelected = false;
      this.checkWithdrawCbos();
    }
  }

  private async checkWithdrawCbos() {
    if(!this.isMonthWithdrawNotSelected && !this.isYearWithdrawNotSelected && this.cboMonthWithdrawChanged && this.cboYearWithdrawChanged) {
      this.domHtml.createSpinner('withdrawSpinner');
      this.showBudgetsWithdrawCbo = false;
      const monthCbo = document.getElementById('monthBudgetWithdraw') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearBudgetWithdraw') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.withdrawMonthYear = month + yearCbo.value;

      var result = await this.budgetsService.getBudgets(this.withdrawMonthYear);

      switch(result.status) {
        case 200:
          this.budgetWithdrawList = [];
          this.domHtml.removeAllChildNodes('withdrawSpinner');
          for(var i=0; i<result.response.data.length; i++) {
            this.budgetWithdrawList.push({
                                            "budgetId": result.response.data[i].budgetId,
                                            "budgetDescription": result.response.data[i].budgetDescription,
                                            "budgetCurrentValue": result.response.data[i].budgetCurrentValue
                                        });
          }
          this.showBudgetsWithdrawCbo = true;
          break;
        case 404:
          this.showBudgetsWithdrawCbo = false;
          this.domHtml.removeAllChildNodes('withdrawSpinner');
          this.domHtml.createMsgDataNotFound('withdrawSpinner');
          break;
        default:
          this.showBudgetsWithdrawCbo = false;
          this.domHtml.removeAllChildNodes('withdrawSpinner');
          this.domHtml.createMsgInternalError('withdrawSpinner');
          break;
      }
    }
  }

  public checkBudgetWithdrawCbo(e: Event) {
    const budgetCbo = e.target as HTMLSelectElement;
    const input = document.getElementById('budgetWithdrawValue');

    if(budgetCbo.value=='selecione o orçamento') {
      this.isBudgetWithdrawNotSelected = true;
    } else {
      this.isBudgetWithdrawNotSelected = false;
      for(var i=0; i<this.budgetWithdrawList.length; i++) {
        if(budgetCbo.value==this.budgetWithdrawList[i].budgetDescription) {
          input?.setAttribute('value', this.monetary.convertToMonetary(this.budgetWithdrawList[i].budgetCurrentValue.toString()));
          this.finalList.push({
                                "budgetWithdrawId": parseInt(this.budgetWithdrawList[i].budgetId),
                                "budgetWithdrawDescription": this.budgetWithdrawList[i].budgetDescription,
                                "budgetDestinationId": 0,
                                "budgetDestinationDescription": ""
                              });
        }
      }
      
    }
  }

  public checkMonthDestinationCbo(e: Event) {

  }

  public checkYearDestinationCbo(e: Event) {
    
  }

}
