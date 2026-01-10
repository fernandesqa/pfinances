import { Component, OnInit } from '@angular/core';
import { BudgetsService } from '../services/budgets.service';
import { Monetary } from '../share/monetary';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalLoading } from '../modal-loading/modal-loading';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';

@Component({
  selector: 'app-modal-set-new-budget-value',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-set-new-budget-value.html',
  styleUrl: './modal-set-new-budget-value.css'
})
export class ModalSetNewBudgetValue implements OnInit {

  public budgetsList: any = [];
  private newValueList: any = [];
  public isBudgetNotSelected: boolean = false;
  public isValueNotInformed: boolean = false;
  private monetary = new Monetary;
  private modalLoading = new ModalLoading;
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;

  constructor(
    private budgetsService: BudgetsService
  ) {}

  async ngOnInit() {
    
    var result = await this.budgetsService.getAllBudgets();

    switch(result.status) {
      case 200:
        this.budgetsList = [];
        for(var i= 0; i<result.response.data.length; i++) {
          this.budgetsList.push({
                                  "budgetId": result.response.data[i].budgetId,
                                  "budgetDescription": result.response.data[i].budgetDescription,
                                  "budgetValue": result.response.data[i].budgetValue
                               });
        }
        break;
    }
  }

  public checkBudgetsCbo(e: Event) {
    const budgetCbo = e.target as HTMLSelectElement;
    const inputCurrentBudgetValue = document.getElementById('inputCurrentBudgetValue') as HTMLInputElement;

    if(budgetCbo.value=='selecione o orçamento') {
      this.isBudgetNotSelected = true;
      this.newValueList = [];
      inputCurrentBudgetValue.setAttribute('value', '');
    } else {
      this.isBudgetNotSelected = false;
      for(var i=0; i<this.budgetsList.length; i++) {
        if(this.budgetsList[i].budgetDescription==budgetCbo.value) {
          if(this.newValueList.length==0) {
            this.newValueList.push({
                                    "budgetId": this.budgetsList[i].budgetId,
                                    "budgetDescription": this.budgetsList[i].budgetDescription,
                                    "value": 0
                                });
          } else {
            this.newValueList[0].budgetId = this.budgetsList[i].budgetId;
            this.newValueList[0].budgetDescription = this.budgetsList[i].budgetDescription;
            this.manageButton();
          }
          
          var value = this.monetary.convertToMonetary(this.budgetsList[i].budgetValue.toString());
          inputCurrentBudgetValue.setAttribute('value', value);
        }
      }
    }
  }

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  public checkValue(e: Event) {
    const inputNewValue = e.target as HTMLInputElement;

    if(inputNewValue.value=='') {
      this.isValueNotInformed = true;
    } else {
      this.isValueNotInformed = false;
      this.newValueList[0].value = parseFloat(this.monetary.convertFromMonetaryToNumber(inputNewValue.value));
      this.manageButton();
    }
  }

  private manageButton() {
    const button = document.getElementById('buttonSetNewBudgetValue') as HTMLButtonElement;

    if(!this.isBudgetNotSelected && !this.isValueNotInformed) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'true');
    }
  }

  public async setNewBudgetValue() {
    this.modalLoading.openModal();

    let result = await this.budgetsService.setNewBudgetValue(this.newValueList[0]);

    switch(result.status) {
      case 200:
        this.modalLoading.closeModal();
        this.modalSuccess.openModal('Alteração de valor do orçamento', 'Valor alterado com sucesso.');
        break;
      default:
        this.modalLoading.closeModal();
        this.modalInternalError.openModal('Alteração de valor do orçamento', 'Erro ao tentar alterar o valor do orçamento, por favor tente novamente mais tarde.');
        break;
    }
  }
}
