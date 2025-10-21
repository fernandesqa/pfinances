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
  private dateInformed: boolean = false;
  private isValueEmpty: boolean = false;
  private expensesList: any =[];
  private isBudgetSelected: boolean = false;
  private isDescriptionEmpty: boolean = false;
  public isBillingMonthNotSelected: boolean = false;
  public isBillingYearNotSelected: boolean = false;
  public isLastBillingMonthNotSelected: boolean = false;
  public isLastBillingYearNotSelected: boolean = false;
  public cboBillingMonthChanged: boolean = false;
  public cboBillingYearChanged: boolean = false;
  public cboLastBillingMonthChanged: boolean = false;
  public cboLastBillingYearChanged: boolean = false;
  

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
    this.isBillingMonthNotSelected = false;
    this.isBillingYearNotSelected = false;
    this.isLastBillingMonthNotSelected = false;
    this.isLastBillingYearNotSelected = false;
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

        this.categories.push({
                              "id": 1, 
                              "description": "Moradia"
                             },
                             {"id": 2,
                              "description": "Alimentação"
                             }, 
                             {
                              "id": 3,
                              "description": "Saúde" 
                             }, 
                             {
                              "id": 4,
                              "description": "Educação"
                             });

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

  public checkBudget(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const inputDescriptionId = checkbox.id.split('-')[0];
    let inputDescription = document.getElementById(inputDescriptionId) as HTMLInputElement;
    var inputDateId = checkbox.id.split('-')[0];
    inputDateId = 'date-'+inputDateId.split('expense')[1];
    let inputDate = document.getElementById(inputDateId) as HTMLInputElement;
    var date = '';
    var monthYear = '';
    if(inputDate.value != '') {
      this.dateInformed = true;
      var time = this.dateTime.getLocalDateTime();
      time = time.split(',')[1];
      var splitDate = inputDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0]+' '+time;
      monthYear = splitDate[1]+splitDate[0];
    } else {
      this.dateInformed = false;
    }
    
    if(checkbox.checked) {
      var categoriesElementId = 'categories-'+checkbox.id.split('-')[0]; 
      var fixedExpenseElementId = 'fixed-'+checkbox.id.split('-')[0];
      const elCategories = document.getElementById(categoriesElementId) as HTMLSelectElement;
      const elFixedExpense = document.getElementById(fixedExpenseElementId) as HTMLInputElement;
      elCategories.removeAttribute('disabled');
      elFixedExpense.removeAttribute('disabled');
      this.isValueEmpty = true;
      for(var i=0; i<this.expenses.length; i++) {
        if(checkbox.name==this.expenses[i].id) {
          var id = checkbox.id.split('-')[1];
          var expenseId = checkbox.id.split('-')[0];
          var categoryId = 0;
          for(var j=0; j<this.expenses[i].budgetSource.length; j++) {
            
            if(id==this.expenses[i].budgetSource[j].id) {
              
              this.expenses[i].budgetSource[j].selected = true;
              if(this.expensesList.length>0) {
                for(var k=0; k<this.expensesList.length; k++) {
                  if(this.expensesList[k].checkboxId.split('-')[0]==expenseId) {
                    if(this.expensesList[k].date!='') {
                      date = this.expensesList[k].date;
                    } 
                    if(this.expensesList[k].categoryId!=0) {
                      categoryId = this.expensesList[k].categoryId;
                    }
                    if(!this.expensesList[k].installmentsExpense) {
                      monthYear = this.expensesList[k].billingMonthYear;
                    }
                  }
                }

                this.expensesList.push({
                                    "checkboxId": checkbox.id,
                                    "date": date,
                                    "description": inputDescription.value,
                                    "value": 0.0,
                                    "categoryId": categoryId,
                                    "budgetId": id,
                                    "fixedExpense": false,
                                    "installmentsExpense": false,
                                    "billingMonthYear": monthYear,
                                    "lastBillingMonthYear": ""
                                  });
              } else {
                this.expensesList.push({
                                    "checkboxId": checkbox.id,
                                    "date": date,
                                    "description": inputDescription.value,
                                    "value": 0.0,
                                    "categoryId": 0,
                                    "budgetId": id,
                                    "fixedExpense": false,
                                    "installmentsExpense": false,
                                    "billingMonthYear": monthYear,
                                    "lastBillingMonthYear": ""
                                  });
              }
            }
          }
        }
      }
      
      this.validateDescription();

      this.checkBudgetsSelection();

      this.manageButton();

    } else {
      for(var i=0; i<this.expenses.length; i++) {
        if(checkbox.name==this.expenses[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.expenses[i].budgetSource.length; j++) {
            
            if(id==this.expenses[i].budgetSource[j].id) {
              
              this.expenses[i].budgetSource[j].selected = false;

              for(var k=0; k<this.expensesList.length; k++) {

                if(this.expensesList[k].checkboxId==checkbox.id) {
                  const indexToRemove: number = i;

                  if(indexToRemove > -1) {
                    this.expensesList.splice(indexToRemove, 1);
                  }
                }

              }
            }
          }
        }
      }

      //Se todos os orçamentos forem desmarcados, então o campo de seleção da categoria é desabilitado
      var categoriesElementId = 'categories-'+checkbox.id.split('-')[0]; 
      var fixedExpenseElementId = 'fixed-'+checkbox.id.split('-')[0];
      const elCategories = document.getElementById(categoriesElementId) as HTMLSelectElement;
      const elFixedExpense = document.getElementById(fixedExpenseElementId) as HTMLInputElement;
      var counter = 0; 
      var expense;

      if(this.expensesList.length==0) {
        expense = 1;
      } else {
        for(var i=0; i<this.expensesList.length; i++) {
          expense = this.expensesList[i].checkboxId.split('-')[0].toString();
          if(this.expensesList[i].checkboxId.split('-')[0]==checkbox.id.split('-')[0]) {
            expense = expense.split('se')[1];
          }
        }
      }
      
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==expense) {
          for(var j=0; j<this.expenses[i].budgetSource.length; j++) {
            
            if(this.expenses[i].budgetSource[j].selected) {
              counter = counter + 1;
            }
          }

          if(counter==0) {
            elCategories.setAttribute('disabled', 'true');
            elFixedExpense.setAttribute('disabled', 'true');
            elCategories.value = 'selecione a categoria';
            elFixedExpense.checked = false;
            for(var i=0; i<this.expenses.length; i++) {
              if(this.expenses[i].id==expense) {
                this.expenses[i].fixedExpense = false;
                this.expenses[i].installmentsExpense = false;
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
    for(var i=0; i<this.expensesList.length; i++) {
      if(this.expensesList[i].checkboxId==input.name) {
        this.expensesList[i].value = value;
      }
    }

    var valuesCount = 0;

    for(var i=0; i<this.expensesList.length; i++) {
      if(this.expensesList[i].value=='') {
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

  public addCategory(e: Event) {
    const selectCategory = e.target as HTMLSelectElement;
    var id;
    for(var i=0; i<this.categories.length; i++) {
      if(this.categories[i].description==selectCategory.value) {
        id = this.categories[i].id;
      }
    }
    var expenseId = selectCategory.id.split('-')[1];
    for(var i=0; i<this.expensesList.length; i++) {
      if(this.expensesList[i].checkboxId.split('-')[0]==expenseId) {
        this.expensesList[i].categoryId = id;
      }
    }
  }

  public addDate(e: Event) {
    const inputDate = e.target as HTMLInputElement;
    var date = '';
    if(inputDate.value != '') {
      this.dateInformed = true;
      var time = this.dateTime.getLocalDateTime();
      time = time.split(',')[1];
      var splitDate = inputDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0]+' '+time;
      var monthYear = splitDate[1]+splitDate[0];
      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==inputDate.name) {
          this.expensesList[i].date = date;
          if(!this.expensesList[i].installmentsExpense) {
            this.expensesList[i].billingMonthYear = monthYear;
          }
        }
      }
    } else {
      this.dateInformed = false;
    }
  }

  public checkFixedExpense(e: Event) {
    const checkboxFixedExpense = e.target as HTMLInputElement;

    if(checkboxFixedExpense.checked) {
      var checkboxId = checkboxFixedExpense.id.split('-')[1];
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].fixedExpense = true;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].fixedExpense = true;
        }
      }
    } else {
      this.isBillingMonthNotSelected = false;
      this.isBillingYearNotSelected = false;
      this.isLastBillingMonthNotSelected = false;
      this.isLastBillingYearNotSelected = false;
      var checkboxId = checkboxFixedExpense.id.split('-')[1];
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].fixedExpense = false;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].fixedExpense = false;
        }
      }
    }
  }

  public checkInstallmentsExpense(e: Event) {
    const checkboxInstallmentsExpense = e.target as HTMLInputElement;

    if(checkboxInstallmentsExpense.checked) {
      var checkboxId = checkboxInstallmentsExpense.id.split('-')[1];
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].installmentsExpense = true;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].installmentsExpense = true;
        }
      }
    } else {
      this.isBillingMonthNotSelected = false;
      this.isBillingYearNotSelected = false;
      this.isLastBillingMonthNotSelected = false;
      this.isLastBillingYearNotSelected = false;
      var checkboxId = checkboxInstallmentsExpense.id.split('-')[1];
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].installmentsExpense = false;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].installmentsExpense = false;
        }
      }
    }
  }

  public checkBillingMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboBillingMonthChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isBillingMonthNotSelected = true;
      this.checkBillingCbos();
    } else {
      this.isBillingMonthNotSelected = false;
      this.checkBillingCbos();
    }
  }

  public checkBillingYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboBillingYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isBillingYearNotSelected = true;
      this.checkBillingCbos();
    } else {
      this.isBillingYearNotSelected = false;
      this.checkBillingCbos();
    }
  }

  private checkBillingCbos() {}

  public checkLastBillingMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboLastBillingMonthChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isLastBillingMonthNotSelected = true;
      this.checkLastBillingCbos();
    } else {
      this.isLastBillingMonthNotSelected = false;
      this.checkLastBillingCbos();
    }
  }

  public checkLastBillingYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboLastBillingYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isLastBillingYearNotSelected = true;
      this.checkLastBillingCbos();
    } else {
      this.isLastBillingYearNotSelected = false;
      this.checkLastBillingCbos();
    }
  }

  private checkLastBillingCbos() {}

  public addDescription(e: Event) {
    const input = e.target as HTMLInputElement;
    if(input.value=='') {
      this.isDescriptionEmpty = true;
    } else {
      this.isDescriptionEmpty = false;
    }

    for(var i=0; i<this.expensesList.length; i++) {
      var expense = this.expensesList[i].checkboxId.split('-')[0];
      if(expense==input.name) {
        this.expensesList[i].description = input.value;
      }
    }

    this.validateDescription();

    this.checkBudgetsSelection();

    this.manageButton();
  }

  private validateDescription() {
    var descriptionCount = 0;

    for(var i=0; i<this.expensesList.length; i++) {
      if(this.expensesList[i].description=='') {
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

  private manageButton() {}

  public createExpenses() {}

}
