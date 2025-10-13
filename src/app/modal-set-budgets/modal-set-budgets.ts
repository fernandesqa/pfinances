import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { DomHtml } from '../share/dom-html';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Monetary } from '../share/monetary';
import { RevenuesService } from '../services/revenues.service';
import { SavingsService } from '../services/savings.service';
import { BudgetsService } from '../services/budgets.service';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';

@Component({
  selector: 'app-modal-set-budgets',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-set-budgets.html',
  styleUrl: './modal-set-budgets.css'
})
export class ModalSetBudgets implements OnInit {
  
  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  private cboMonthChanged: boolean = false;
  private cboYearChanged: boolean = false;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  private monthYear: string = '';
  private revenuesControl: any = [];
  public revenuesSource: any = [];
  public isLoadingsData: boolean = false;
  public showForm: boolean = false;
  private domHTML = new DomHtml;
  public budgets: any = [];
  public budgetsList: any = [];
  public finalBudgetsList: any = [];
  public valueControl: any = [];
  public totalBudgets: number = 1;
  private monetary = new Monetary;
  public isDescriptionEmpty: boolean = false;
  public isValueEmpty: boolean = false;
  public isInvalidAmount: boolean = false;
  public isInvalidForm: boolean = false;
  private isRevenueSelected: boolean = false;
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;
  public loadPreviousBudgets: boolean = false;
  public previousBudgets: any = [];

  constructor(
    private revenuesService: RevenuesService,
    private savingsService: SavingsService,
    private budgetsService: BudgetsService
  ) {}

  ngOnInit(): void {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getLastYears(5);
    this.previousBudgets.push({
                                "description": "Moradia",
                                "value": 2560
                             },
                             {
                               "description": "Mercado",
                                "value": 1800
                             },
                             {
                               "description": "Saúde",
                                "value": 1000
                             },
                             {
                               "description": "Entretenimento",
                                "value": 400
                             });
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
      this.showForm = false;
      this.domHTML.createSpinner('spinnerParent');
      this.totalBudgets = 1;
      const monthCbo = document.getElementById('monthBudget') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearBudget') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.monthYear = month + yearCbo.value;

      var result = await this.revenuesService.getRevenuesByPeriod(this.monthYear);

      switch(result.status) {
        case 200:
          this.budgets = [];
          this.revenuesSource = [];
          this.revenuesControl = [];
          for(var i=0; i<result.response.data.length; i++) {
            this.revenuesControl.push({
                                        "type": "revenue",
                                        "id": result.response.data[i].revenueId,
                                        "description": result.response.data[i].revenueDescription,
                                        "currentValue": result.response.data[i].currentValue
                                      });
          }

          result = await this.savingsService.getSavings();

          switch(result.status) {
            case 200:
              for(var i=0; i<result.response.data.length; i++) {
                this.revenuesControl.push({
                                            "type": "savings",
                                            "id": result.response.data[i].savingsId,
                                            "description": result.response.data[i].savingsDescription,
                                            "currentValue": result.response.data[i].currentValue
                                          });
              }
              break;

          }

          for(var i=0; i<this.revenuesControl.length; i++) {
            var currentValue = this.monetary.convertToMonetary(this.revenuesControl[i].currentValue.toString());
            this.revenuesSource.push({
                                      "type": this.revenuesControl[i].type,
                                      "id": this.revenuesControl[i].id,
                                      "description": this.revenuesControl[i].description,
                                      "currentValue": currentValue,
                                      "selected": false
                                    });
            
            this.valueControl.push({
                                    "id": this.revenuesControl[i].id,
                                    "currentValue": this.revenuesControl[i].currentValue
                                  });
          }
          
          this.budgets.push({
            "id": this.totalBudgets,
            "revenuesSource": this.revenuesSource
          });

          this.domHTML.removeAllChildNodes('spinnerParent');
          this.showForm = true;
          break;
        case 404:
          this.budgets = [];
          this.domHTML.removeAllChildNodes('spinnerParent');
          this.domHTML.createMsgDataNotFound('spinnerParent');
          break;
        default:
          this.budgets = [];
          this.domHTML.removeAllChildNodes('spinnerParent');
          this.domHTML.createMsgInternalError('spinnerParent');
          break;
      }
    } else {
      this.showForm = false;
    }
  }

  public showPreviousBudgets(e: Event) {
    this.showForm = false;
    this.budgets = [];
    this.totalBudgets = 0;

    const elflexSwitch = e.target as HTMLInputElement;
    if(elflexSwitch.checked) {
      for(var i=0; i<this.previousBudgets.length; i++) {
        this.totalBudgets = this.totalBudgets + 1;
        var sources = [];
        for(var j=0; j<this.revenuesControl.length; j++) {
          sources.push({
                        "type": this.revenuesControl[j].type,
                        "id": this.revenuesControl[j].id,
                        "description": this.revenuesControl[j].description,
                        "currentValue": this.monetary.convertToMonetary(this.revenuesControl[j].currentValue.toString()),
                        "selected": false
                      });
        }

        if(i==0) {
          this.budgets.push({
                            "id": this.totalBudgets,
                            "revenuesSource": this.revenuesSource,
                            "budgetDescription": this.previousBudgets[i].description,
                            "budgetPreviousValue": this.monetary.convertToMonetary(this.previousBudgets[i].value.toString())
                          });
        } else {
          this.budgets.push({
                            "id": this.totalBudgets,
                            "revenuesSource": sources,
                            "budgetDescription": this.previousBudgets[i].description,
                            "budgetPreviousValue": this.monetary.convertToMonetary(this.previousBudgets[i].value.toString())
                          });
        }
        
      }

      this.loadPreviousBudgets = true;
      this.isDescriptionEmpty = false;
    } else {
        this.totalBudgets = 1;
        this.budgets.push({
            "id": this.totalBudgets,
            "revenuesSource": this.revenuesSource
          });
        this.loadPreviousBudgets = false;
        this.isDescriptionEmpty = true;
        this.showForm = true;
    }

    
  }

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  public checkSource(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const inputDescriptionId = checkbox.id.split('-')[0];
    let inputDescription = document.getElementById(inputDescriptionId) as HTMLInputElement;
    if(checkbox.checked) {
      this.isValueEmpty = true;
      for(var i=0; i<this.budgets.length; i++) {
        if(checkbox.name==this.budgets[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.budgets[i].revenuesSource.length; j++) {
            
            if(id==this.budgets[i].revenuesSource[j].id) {
              
              this.budgets[i].revenuesSource[j].selected = true;
              if(this.budgets[i].revenuesSource[j].type=="revenue") {
                this.budgetsList.push({
                                "checkboxId": checkbox.id,
                                "description": inputDescription.value,
                                "value": "",
                                "revenue": true,
                                "savings": false,
                                "revenueId": id,
                                "savingsId": 0
                              });
              } else {
                this.budgetsList.push({
                                "checkboxId": checkbox.id,
                                "description": inputDescription.value,
                                "value": "",
                                "revenue": false,
                                "savings": true,
                                "revenueId": 0,
                                "savingsId": id
                              });
              }
            }
          }
        }
      }

      this.validateDescription();

      this.checkRevenuesSelection();

      this.manageButton();

    } else {
      for(var i=0; i<this.budgets.length; i++) {
        if(checkbox.name==this.budgets[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.budgets[i].revenuesSource.length; j++) {
            
            if(id==this.budgets[i].revenuesSource[j].id) {
              
              this.budgets[i].revenuesSource[j].selected = false;

              for(var k=0; i<this.budgetsList.length; k++) {

                if(this.budgetsList[k].checkboxId==checkbox.id) {
                  const indexToRemove: number = i;

                  if(indexToRemove > -1) {
                    this.budgetsList.splice(indexToRemove, 1);
                  }
                }

              }
            }
          }
        }
      }

      
      this.validateDescription();
      var inputId = "input-"+checkbox.id;
      const input = document.getElementById(inputId) as HTMLInputElement;
      this.checkRevenuesSelection();
      this.checkAmount(input);
      this.manageButton();
    }
  }

  public addValue(e: Event) {
    const input = e.target as HTMLInputElement;
    var value = this.monetary.convertFromMonetaryToNumber(input.value);
    for(var i=0; i<this.budgetsList.length; i++) {
      if(this.budgetsList[i].checkboxId==input.name) {
        this.budgetsList[i].value = value;
      }
    }

    if(value!='') {
      this.checkAmount(input);
    }

    var valuesCount = 0;

    for(var i=0; i<this.budgetsList.length; i++) {
      if(this.budgetsList[i].value=='') {
       this.isValueEmpty = true;
       valuesCount = 1;
      }
    }

    if(valuesCount==0) {
      this.isValueEmpty = false;
    }

    this.validateDescription();

    this.manageButton();
  }

  public addDescription(e: Event) {
    const input = e.target as HTMLInputElement;
    if(input.value=='') {
      this.isDescriptionEmpty = true;
    } else {
      this.isDescriptionEmpty = false;
    }

    for(var i=0; i<this.budgetsList.length; i++) {
      var budget = this.budgetsList[i].checkboxId.split('-')[0];
      if(budget==input.name) {
        this.budgetsList[i].description = input.value;
      }
    }

    this.validateEmptyValues(input);

    this.validateDescription();

    //Valida se não há valores de orçamentos maiores que as receitas
    var invalidAmountCount = 0;
    for(var i=0; i<this.revenuesSource.length; i++) {
      if(this.revenuesSource[i].selected) {
        var idInput = "input-"+input.id+"-"+this.revenuesSource[i].id;
        var total = 0;
        var id = idInput.split('-')[2];
        for(var i=0; i<this.budgetsList.length; i++) {
          if(this.budgetsList[i].revenueId==id || this.budgetsList[i].savingsId==id) {
            total = Number(total) + Number(this.budgetsList[i].value);
          }
        }

        for(var i=0; i<this.valueControl.length; i++) {
          if(id==this.valueControl[i].id) {
            if(total>Number(this.valueControl[i].currentValue)) {
              invalidAmountCount = 1;
            }
          }
        }
      }

      if(invalidAmountCount>0) {
        this.isInvalidAmount = true;
      } else {
        this.isInvalidAmount = false;
      }
    }


    this.manageButton();
  }

  public addBudget() {
    this.isDescriptionEmpty = true;
    this.totalBudgets = this.totalBudgets + 1;
    
    var sources = [];
    for(var i=0; i<this.revenuesControl.length; i++) {
        sources.push({
                      "type": this.revenuesControl[i].type,
                      "id": this.revenuesControl[i].id,
                      "description": this.revenuesControl[i].description,
                      "currentValue": this.monetary.convertToMonetary(this.revenuesControl[i].currentValue.toString()),
                      "selected": false
                    });
    }

    this.budgets.push({
                        "id": this.totalBudgets,
                        "revenuesSource": sources
                      });
  }

  public removeLastBudget(){
    this.budgets.pop();
  }

  private validateDescription() {
    var descriptionCount = 0;

    for(var i=0; i<this.budgetsList.length; i++) {
      if(this.budgetsList[i].description=='') {
        this.isDescriptionEmpty = true;
        descriptionCount = 1;
      }
    }

      if(descriptionCount==0) {
        this.isDescriptionEmpty = false;
      }


  }

  private checkAmount(input: HTMLInputElement) {
    var total = 0;
    var id = input.id.split('-')[2];
    var invalidAmountCount = 0;
    for(var i=0; i<this.budgetsList.length; i++) {
      if(this.budgetsList[i].revenueId==id || this.budgetsList[i].savingsId==id) {
        total = Number(total) + Number(this.budgetsList[i].value);
      }
    }

    for(var i=0; i<this.valueControl.length; i++) {
      if(id==this.valueControl[i].id) {
        if(total>Number(this.valueControl[i].currentValue)) {
          invalidAmountCount = 1;
        }
      }
    }
    
    if(invalidAmountCount>0) {
      this.isInvalidAmount = true;
    } else {
      this.isInvalidAmount = false;
    }
  }

  private checkRevenuesSelection() {
    var selectionCount = 0;
    for(var i=0; i<this.revenuesSource.length; i++) {
      if(this.revenuesSource[i].selected) {
        selectionCount = 1;
      }
    }

    if(selectionCount>0) {
      this.isRevenueSelected = true;
    } else {
      this.isRevenueSelected = false;
    }
  }

  private validateEmptyValues(el: HTMLInputElement) {
    var id = el.id;
    var countRevenuesSelectedforTheBudget = 0;
    var totalSelected = this.budgetsList.length;
    for(var i=0; i<this.budgetsList.length; i++) {
      if(this.budgetsList[i].checkboxId.includes(id)) {
        this.isValueEmpty = false;
      } else {
        countRevenuesSelectedforTheBudget = countRevenuesSelectedforTheBudget +1;
      }
    }

    if(totalSelected==countRevenuesSelectedforTheBudget) {
      this.isValueEmpty = true;
    }
  }

  private manageButton() {
    const button = document.getElementById('buttonSetBudgets') as HTMLButtonElement;
    if(!this.isDescriptionEmpty && !this.isValueEmpty && !this.isInvalidAmount && this.isRevenueSelected) {
      button.removeAttribute('disabled');
      this.isInvalidForm = false;
    } else {
      button.setAttribute('disabled', 'true');
      this.isInvalidForm = true;
    }
  }

  public async setBudgets() {
    var fail: boolean = false;
    for(var i=0; i<this.budgetsList.length; i++) {
      this.finalBudgetsList.push({
                                    "description": this.budgetsList[i].description,
                                    "value": parseFloat(this.budgetsList[i].value),
                                    "revenue": this.budgetsList[i].revenue,
                                    "savings": this.budgetsList[i].savings,
                                    "revenueId": parseInt(this.budgetsList[i].revenueId),
                                    "savingsId": parseInt(this.budgetsList[i].savingsId)
                                });
    }
    
    var result = await this.budgetsService.createBudgets(this.monthYear, this.finalBudgetsList);
      
    switch(result.status) {
      case 200:
        this.modalSuccess.openModal("Definição de orçamentos", "Oçamento(s) definido(s) com sucesso!");
        break;
      default:
        this.modalInternalError.openModal("Definição de orçamentos", "Erro ao tentar definir o(s) orçamento(s), por favor tente novamente mais tarde!");
        break;
    }
  }
}
