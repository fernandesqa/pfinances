import { Component, OnInit } from '@angular/core';
import { Years } from '../share/years';
import { Months } from '../share/months';
import { DomHtml } from '../share/dom-html';
import { BudgetsService } from '../services/budgets.service';
import { Monetary } from '../share/monetary';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalLoading } from '../modal-loading/modal-loading';

@Component({
  selector: 'app-modal-budget-transfering',
  imports: [
    CurrencyMaskModule
  ],
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
  private cboMonthDestinationChanged: boolean = false;
  private cboYearDestinationChanged: boolean = false;
  private domHtml = new DomHtml;
  private withdrawMonthYear: string = '';
  private destinationMonthYear: string = '';
  public showBudgetsWithdrawCbo: boolean = false;
  public showBudgetsDestinationCbo: boolean = false;
  public budgetWithdrawList: any;
  public budgetDestinationList: any;
  public isBudgetWithdrawNotSelected: boolean = false;
  public isBudgetDestinationNotSelected: boolean = false;
  private monetary = new Monetary;
  private finalList: any = [];
  public isInvalidValue: boolean = false;
  private modalLoading = new ModalLoading;

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
      this.resetDestinationFields();
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
      this.resetDestinationFields();
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
          this.resetDestinationFields();
          break;
        default:
          this.showBudgetsWithdrawCbo = false;
          this.domHtml.removeAllChildNodes('withdrawSpinner');
          this.domHtml.createMsgInternalError('withdrawSpinner');
          this.resetDestinationFields();
          break;
      }
    }
    this.manageButton();
  }

  public checkBudgetWithdrawCbo(e: Event) {
    const budgetCbo = e.target as HTMLSelectElement;
    const input = document.getElementById('budgetWithdrawValue') as HTMLInputElement;
    const selectMonthDestination = document.getElementById('monthBudgetDestination') as HTMLSelectElement;
    const selectYearDestination = document.getElementById('yearBudgetDestination') as HTMLSelectElement;
    const selectWithdrawMonth = document.getElementById('monthBudgetWithdraw') as HTMLSelectElement;
    const selectWithdrawYear = document.getElementById('yearBudgetWithdraw') as HTMLSelectElement;
    var month = this.months.convertMonthNameToMonthNumber(selectWithdrawMonth.value);

    if(budgetCbo.value=='selecione o orçamento') {
      this.isBudgetWithdrawNotSelected = true;
      if(this.showBudgetsDestinationCbo) {
        this.resetDestinationFields();
      }
    } else {
      if(this.showBudgetsDestinationCbo) {
        this.resetDestinationFields();
      }
      
      this.finalList = [];
      this.isBudgetWithdrawNotSelected = false;
      for(var i=0; i<this.budgetWithdrawList.length; i++) {
        if(budgetCbo.value==this.budgetWithdrawList[i].budgetDescription) {
          input?.setAttribute('value', this.monetary.convertToMonetary(this.budgetWithdrawList[i].budgetCurrentValue.toString()));
          this.finalList.push({
                                "budgetWithdrawId": parseInt(this.budgetWithdrawList[i].budgetId),
                                "budgetWithdrawDescription": this.budgetWithdrawList[i].budgetDescription,
                                "budgetWithdrawMonthYear": month+selectWithdrawYear.value,
                                "budgetDestinationId": 0,
                                "budgetDestinationDescription": "",
                                "budgetDestinationMonthYear": "",
                                "value": 0
                              });
        }
      }
      selectMonthDestination.removeAttribute('disabled');
      selectYearDestination.removeAttribute('disabled');
    }
    this.manageButton();
  }

  public checkMonthDestinationCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboMonthDestinationChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthDestinationNotSelected = true;
      this.checkDestinationCbos();
    } else {
      this.isMonthDestinationNotSelected = false;
      this.checkDestinationCbos();
    }
  }

  public checkYearDestinationCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboYearDestinationChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearDestinationNotSelected = true;
      this.checkDestinationCbos();
    } else {
      this.isYearDestinationNotSelected = false;
      this.checkDestinationCbos();
    }
  }

  public async checkDestinationCbos() {
    if(!this.isMonthDestinationNotSelected && !this.isYearDestinationNotSelected && this.cboMonthDestinationChanged && this.cboYearDestinationChanged) {
      this.domHtml.createSpinner('destinationSpinner');
      this.showBudgetsDestinationCbo = false;
      const monthCbo = document.getElementById('monthBudgetDestination') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearBudgetDestination') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.destinationMonthYear = month + yearCbo.value;

      var result = await this.budgetsService.getBudgets(this.destinationMonthYear);

      switch(result.status) {
        case 200:
          this.budgetDestinationList = [];
          this.domHtml.removeAllChildNodes('destinationSpinner');
          for(var i=0; i<result.response.data.length; i++) {
            this.budgetDestinationList.push({
                                            "budgetId": result.response.data[i].budgetId,
                                            "budgetDescription": result.response.data[i].budgetDescription,
                                            "budgetCurrentValue": result.response.data[i].budgetCurrentValue
                                        });
          }
          this.showBudgetsDestinationCbo = true;
          break;
        case 404:
          this.showBudgetsDestinationCbo = false;
          this.domHtml.removeAllChildNodes('destinationSpinner');
          this.domHtml.createMsgDataNotFound('destinationSpinner');
          break;
        default:
          this.showBudgetsDestinationCbo = false;
          this.domHtml.removeAllChildNodes('destinationSpinner');
          this.domHtml.createMsgInternalError('destinationSpinner');
          break;
      }
    }
    this.manageButton();
  }

  public checkBudgetDestinationCbo(e: Event) {
    const budgetCbo = e.target as HTMLSelectElement;
    const selectDestinationMonth = document.getElementById('monthBudgetDestination') as HTMLSelectElement;
    const selectDestinationYear = document.getElementById('yearBudgetDestination') as HTMLSelectElement;
    var month = this.months.convertMonthNameToMonthNumber(selectDestinationMonth.value);

    if(budgetCbo.value=='selecione o orçamento') {
      this.isBudgetDestinationNotSelected = true;
    } else {
      this.isBudgetDestinationNotSelected = false;
      for(var i=0; i<this.budgetDestinationList.length; i++) {
        if(budgetCbo.value==this.budgetDestinationList[i].budgetDescription) {
          this.finalList[0].budgetDestinationId = parseInt(this.budgetDestinationList[i].budgetId);
          this.finalList[0].budgetDestinationDescription = this.budgetDestinationList[i].budgetDescription;
          this.finalList[0].budgetDestinationMonthYear = month+selectDestinationYear.value;
        }
      }
    }
    this.manageButton();
  }

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  public addValue(e: Event) {
    const inputDestinationValue = e.target as HTMLInputElement;
    const inputWithdrawValue = document.getElementById('budgetWithdrawValue') as HTMLInputElement;
    var destinationValue = this.monetary.convertFromMonetaryToNumber(inputDestinationValue.value);
    var withdrawValue = this.monetary.convertFromMonetaryToNumber(inputWithdrawValue.value);

    if(inputDestinationValue.value=='') {
      this.finalList[0].value = 0;
    }
    
    if(parseFloat(destinationValue)>parseFloat(withdrawValue)) {
      this.isInvalidValue = true;
      this.finalList[0].value = 0;
    } else {
      this.isInvalidValue = false;
      this.finalList[0].value = parseFloat(this.monetary.convertFromMonetaryToNumber(inputDestinationValue.value));
    }
    this.manageButton();
  }

  private resetDestinationFields() {
    const selectMonthDestination = document.getElementById('monthBudgetDestination') as HTMLSelectElement;
    const selectYearDestination = document.getElementById('yearBudgetDestination') as HTMLSelectElement;
    const selectBudgetDestination = document.getElementById('selectBudgetDestination') as HTMLSelectElement;
    const inputBudgetDestinationValue = document.getElementById('budgetDestinationValue') as HTMLInputElement;

    selectMonthDestination.setAttribute('disabled', 'true');
    selectYearDestination.setAttribute('disabled', 'true');
    selectMonthDestination.value = 'selecione o mês';
    selectYearDestination.value = 'selecione o ano';
    selectBudgetDestination.value = 'selecione o orçamento';
    inputBudgetDestinationValue.value = '';
    this.showBudgetsDestinationCbo = false;
    this.cboMonthDestinationChanged = false;
    this.cboYearDestinationChanged = false;
  }

  private manageButton() {
    const button = document.getElementById('buttonTransferBudget') as HTMLButtonElement;

    if(
        !this.isMonthWithdrawNotSelected && 
        !this.isYearWithdrawNotSelected && 
        this.cboMonthWithdrawChanged && 
        this.cboYearWithdrawChanged &&
        !this.isBudgetWithdrawNotSelected &&
        !this.isMonthDestinationNotSelected && 
        !this.isYearDestinationNotSelected && 
        this.cboMonthDestinationChanged && 
        this.cboYearDestinationChanged &&
        !this.isBudgetDestinationNotSelected &&
        this.finalList[0].value > 0
      ) {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', 'true');
      }
  }

  public async transferBudget() {
    this.modalLoading.openModal();
  }
}
