import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { DomHtml } from '../share/dom-html';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Monetary } from '../share/monetary';
import { BudgetsService } from '../services/budgets.service';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';
import { SavingsService } from '../services/savings.service';

@Component({
  selector: 'app-modal-add-savings',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-add-savings.html',
  styleUrl: './modal-add-savings.css'
})
export class ModalAddSavings implements OnInit {

  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  private cboMonthChanged: boolean = false;
  private cboYearChanged: boolean = false;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  private monthYear: string = '';
  private budgetControl: any = [];
  public budgetSource: any = [];
  public showForm: boolean = false;
  private domHTML = new DomHtml;
  public savings: any = [];
  public savingsList: any = [];
  private monetary = new Monetary;
  public isDescriptionEmpty: boolean = false;
  public isValueEmpty: boolean = false;
  public isInvalidForm: boolean = false;
  public totalSavings: number = 1;
  private dateInformed: boolean = false;
  public isFutureDate: boolean = false;
  private isBudgetSelected: boolean = false;
  private finalSavingsList: any = [];
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;

  constructor(
    private budgetsService: BudgetsService,
    private savingsService: SavingsService
  ) {}

  ngOnInit(): void {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getBillingYears();
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
      this.domHTML.createSpinner('spinnerParentSavings');
      this.totalSavings = 1;
      const monthCbo = document.getElementById('monthSavings') as HTMLSelectElement;
      const yearCbo = document.getElementById('yearSavings') as HTMLSelectElement;

      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.monthYear = month + yearCbo.value;

      var result = await this.budgetsService.getBudgets(this.monthYear);
      
      switch(result.status) {
        case 200:
          this.savings = [];
          this.budgetSource = [];
          this.budgetControl = [];
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

          this.savings.push({
                              "id": this.totalSavings,
                              "budgetSource": this.budgetSource
                           });
                  
          this.domHTML.removeAllChildNodes('spinnerParentSavings');
          this.showForm = true;
          break;
        case 404:
          this.savings = [];
          this.domHTML.removeAllChildNodes('spinnerParentSavings');
          this.domHTML.createMsgDataNotFound('spinnerParentSavings');
          break;
        default:
          this.savings = [];
          this.domHTML.removeAllChildNodes('spinnerParentSavings');
          this.domHTML.createMsgInternalError('spinnerParentSavings');
          break;
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

  public addSavings() {
    this.isDescriptionEmpty = true;
    this.totalSavings = this.totalSavings + 1;
    
    var sources = [];
    for(var i=0; i<this.budgetControl.length; i++) {
        sources.push({
                      "id": this.budgetControl[i].budgetId,
                      "description": this.budgetControl[i].budgetDescription,
                      "currentValue": this.monetary.convertToMonetary(this.budgetControl[i].budgetCurrentValue.toString()),
                      "selected": false
                    });
    }

    this.savings.push({
                        "id": this.totalSavings,
                        "budgetSource": sources
                      });
  }

  public removeLastSavings(){
    this.savings.pop();
  }

  public checkBudget(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const inputDescriptionId = checkbox.id.split('-')[0];
    let inputDescription = document.getElementById(inputDescriptionId) as HTMLInputElement;
    var inputDateId = checkbox.id.split('-')[0];
    inputDateId = 'date-'+inputDateId.split('savings')[1];
    let inputDate = document.getElementById(inputDateId) as HTMLInputElement;
    var date = '';
    if(inputDate.value != '') {
      this.dateInformed = true;
      var splitDate = inputDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0];
    } else {
      this.dateInformed = false;
    }
    
    if(checkbox.checked) {
      this.isValueEmpty = true;
      for(var i=0; i<this.savings.length; i++) {
        if(checkbox.name==this.savings[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.savings[i].budgetSource.length; j++) {
            
            if(id==this.savings[i].budgetSource[j].id) {
              
              this.savings[i].budgetSource[j].selected = true;
              this.savingsList.push({
                                    "checkboxId": checkbox.id,
                                    "date": date,
                                    "description": inputDescription.value,
                                    "value": "",
                                    "budgetId": id
                                  });
            }
          }
        }
      }

      this.validateDescription();

      this.checkBudgetsSelection();

      this.manageButton();

    } else {
      for(var i=0; i<this.savings.length; i++) {
        if(checkbox.name==this.savings[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.savings[i].budgetSource.length; j++) {
            
            if(id==this.savings[i].budgetSource[j].id) {
              
              this.savings[i].budgetSource[j].selected = false;

              for(var k=0; i<this.savingsList.length; k++) {

                if(this.savingsList[k].checkboxId==checkbox.id) {
                  const indexToRemove: number = i;

                  if(indexToRemove > -1) {
                    this.savingsList.splice(indexToRemove, 1);
                  }
                }

              }
            }
          }
        }
      }

      
      this.validateDescription();
      this.checkBudgetsSelection();
      this.manageButton();
    }
  }

  public addValue(e: Event) {
    const input = e.target as HTMLInputElement;
    var value = this.monetary.convertFromMonetaryToNumber(input.value);
    for(var i=0; i<this.savingsList.length; i++) {
      if(this.savingsList[i].checkboxId==input.name) {
        this.savingsList[i].value = value;
      }
    }

    var valuesCount = 0;

    for(var i=0; i<this.savingsList.length; i++) {
      if(this.savingsList[i].value=='') {
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

  public addDate(e: Event) {
    const elDate = e.target as HTMLInputElement;
    var date = '';
    if(elDate.value != '') {
      this.dateInformed = true;
      var splitDate = elDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0];

      //Verifica se a data informada não é futura
      const currentDate: Date = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      
      if(splitDate[0]<=year.toString()) {
        if(splitDate[1]<=month.toString()) {
          if(splitDate[2]<=day.toString()) {
            this.isFutureDate = false;
          } else {
            this.isFutureDate = true;
          }
        } else {
          this.isFutureDate = true;
        }
      } else {
        this.isFutureDate = true;
      }
    } else {
      this.dateInformed = false;
    }

    for(var i=0; i<this.savingsList.length; i++) {
      var savings = this.savingsList[i].checkboxId.split('-')[0];
      if(savings==elDate.name) {
        this.savingsList[i].date = date;
      }
    }

    this.validateDescription();

    this.checkBudgetsSelection();
    
    this.manageButton();
  }

  public addDescription(e: Event) {
    const input = e.target as HTMLInputElement;
    if(input.value=='') {
      this.isDescriptionEmpty = true;
    } else {
      this.isDescriptionEmpty = false;
    }

    for(var i=0; i<this.savingsList.length; i++) {
      var savings = this.savingsList[i].checkboxId.split('-')[0];
      if(savings==input.name) {
        this.savingsList[i].description = input.value;
      }
    }

    this.validateDescription();

    this.checkBudgetsSelection();

    this.manageButton();
  }

  private validateDescription() {
    var descriptionCount = 0;

    for(var i=0; i<this.savingsList.length; i++) {
      if(this.savingsList[i].description=='') {
        this.isDescriptionEmpty = true;
        descriptionCount = 1;
      }
    }

      if(descriptionCount==0) {
        this.isDescriptionEmpty = false;
      }
  }

  private checkBudgetsSelection() {
    var selectionCount = 0;
    for(var i=0; i<this.budgetSource.length; i++) {
      if(this.budgetSource[i].selected) {
        selectionCount = 1;
      }
    }

    if(selectionCount>0) {
      this.isBudgetSelected = true;
    } else {
      this.isBudgetSelected = false;
    }
  }

  private manageButton() {
    const button = document.getElementById('buttonAddSavings') as HTMLButtonElement;
    if(!this.isDescriptionEmpty && !this.isValueEmpty && !this.isFutureDate && this.isBudgetSelected && this.dateInformed) {
      button.removeAttribute('disabled');
      this.isInvalidForm = false;
    } else {
      button.setAttribute('disabled', 'true');
      this.isInvalidForm = true;
    }
  }

  public async createSavings() {
    for(var i=0; i<this.savingsList.length; i++) {
      this.finalSavingsList.push({
                                    "date": this.savingsList[i].date,
                                    "description": this.savingsList[i].description,
                                    "value": parseFloat(this.savingsList[i].value),
                                    "budgetId": parseInt(this.savingsList[i].budgetId)
                                 });
    }
    
    var result = await this.savingsService.createSavings(this.monthYear, this.finalSavingsList);

    switch(result.status) {
      case 200:
        this.modalSuccess.openModal("Registro de Economias", "Economia(s) registrada(s) com sucesso!");
        break;
      default:
        this.modalInternalError.openModal("Registro de Economias", "Erro ao tentar registrar a(s) economia(s), por favor tente novamente mais tarde!");
        break;
    }
  }

}
