import { Component, OnInit } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BudgetsService } from '../services/budgets.service';
import { DomHtml } from '../share/dom-html';
import { DateTime } from '../share/date-time';
import { Monetary } from '../share/monetary';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { ExpensesService } from '../services/expenses.service';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';
import { ModalLoading } from '../modal-loading/modal-loading';

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
  public isCategoryNotSelected: boolean = false;
  private isDescriptionEmpty: boolean = false;
  public isBillingMonthNotSelected: boolean = false;
  public isBillingYearNotSelected: boolean = false;
  public isLastBillingMonthNotSelected: boolean = false;
  public isLastBillingYearNotSelected: boolean = false;
  public cboBillingMonthChanged: boolean = false;
  public cboBillingYearChanged: boolean = false;
  public cboLastBillingMonthChanged: boolean = false;
  public cboLastBillingYearChanged: boolean = false;
  private billingMonthYear: string = '';
  private lastBillingMonthYear: string = '';
  private finalExpensesList: any = [];
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;
  private modalLoading = new ModalLoading;
  

  constructor(
    private budgetsService: BudgetsService,
    private expensesService: ExpensesService
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
                                      "revenueId": result.response.data[i].revenueId,
                                      "budgetDescription": result.response.data[i].budgetDescription,
                                      "budgetCurrentValue":  budgetCurrentValue
                                   });
        }

        for(var i=0; i<this.budgetControl.length; i++) {
          var currentValue = this.monetary.convertToMonetary(this.budgetControl[i].budgetCurrentValue.toString());
          this.budgetSource.push({
                                    "id": this.budgetControl[i].budgetId,
                                    "revenueId": this.budgetControl[i].revenueId,
                                    "description": this.budgetControl[i].budgetDescription,
                                    "currentValue": currentValue,
                                    "selected": false
                                });
        }

        var result = await this.expensesService.getExpensesCategories();

        switch(result.status) {
          case 200:
            for(var i=0; i<result.response.data.length; i++) {
              this.categories.push({
                                      "id": result.response.data[i].id,
                                      "description": result.response.data[i].description
                                   });
            }
            break;
        }

        this.expenses.push({
                              "id": this.totalExpenses,
                              "budgetSource": this.budgetSource,
                              "categories": this.categories,
                              "fixedExpense": false,
                              "installmentsExpense": false,
                              "creditCardExpense": false,
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

  public addExpense() {
    this.isDescriptionEmpty = true;
    this.totalExpenses = this.totalExpenses + 1;
    
    var sources = [];
    for(var i=0; i<this.budgetControl.length; i++) {
        sources.push({
                      "id": this.budgetControl[i].budgetId,
                      "revenueId": this.budgetControl[i].revenueId,
                      "description": this.budgetControl[i].budgetDescription,
                      "currentValue": this.monetary.convertToMonetary(this.budgetControl[i].budgetCurrentValue.toString()),
                      "selected": false
                    });
    }

    var categories = [];
    for(var i=0; i<this.categories.length; i++) {
      categories.push({
                        "id": this.categories[i].id,
                        "description": this.categories[i].description
                     });
    }

    var billingMonthsList = this.months.getMonthsList();
    var billingYearsList = this.years.getBillingYears();
    var lastBillingMonthsList = this.months.getMonthsList();
    var lastBillingYearsList = this.years.getFutureBillingYears();

    this.expenses.push({
                              "id": this.totalExpenses,
                              "budgetSource": sources,
                              "categories": categories,
                              "fixedExpense": false,
                              "installmentsExpense": false,
                              "creditCardExpense": false,
                              "billingMonths": billingMonthsList,
                              "billingYears": billingYearsList,
                              "lastBillingMonths": lastBillingMonthsList,
                              "lastBillingYears": lastBillingYearsList
                           });
  }

  public removeLastExpense() {
    this.expenses.pop();
    this.expensesList.pop();
    var counter = 0;
    for(var i=0; i<this.expensesList.length; i++) {
      if(this.expensesList[i].date=='') {
        counter = counter + 1;
      } else if(this.expensesList[i].description=='') {
        counter = counter + 1;
      } else if(this.expensesList[i].value=0.0) {
        counter = counter + 1;
      } else if(this.expensesList[i].categoryId==0) {
        counter = counter + 1;
      } else if(this.expensesList[i].budgetId==0) {
        counter = counter + 1;
      } else if(this.expensesList[i].installmentsExpense==true) {
        if(this.expensesList[i].billingMonthYear=='' || this.expensesList[i].lastBillingMonthYear=='') {
          counter = counter + 1;
        }
      }
    }

    if(counter==0) {
      this.isDescriptionEmpty = false; 
      this.isValueEmpty = false; 
      this.isFutureDate = false; 
      this.isBudgetSelected = true; 
      this.isCategoryNotSelected = false;
      this.dateInformed = true; 
      this.isBillingMonthNotSelected = false;
      this.isBillingYearNotSelected = false;
      this.isLastBillingMonthNotSelected = false;
      this.isLastBillingYearNotSelected = false;
    }

    this.manageButton();
  }

  public checkBudget(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const inputDescriptionId = checkbox.id.split('-')[0];
    let inputDescription = document.getElementById(inputDescriptionId) as HTMLInputElement;
    var inputDateId = checkbox.id.split('-')[0];
    inputDateId = 'date-'+inputDateId.split('expense')[1];
    let inputDate = document.getElementById(inputDateId) as HTMLInputElement;
    var date = '';
    
    if(inputDate.value != '') {
      this.dateInformed = true;
      var time = this.dateTime.getLocalDateTime();
      time = time.split(',')[1];
      var splitDate = inputDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0]+' '+time;
      this.monthYear = splitDate[1]+splitDate[0];
    } else {
      this.dateInformed = false;
    }
    
    if(checkbox.checked) {
      var categoriesElementId = 'categories-'+checkbox.id.split('-')[0]; 
      var fixedExpenseElementId = 'fixed-'+checkbox.id.split('-')[0];
      var creditCardExpenseElementId = 'credit-card-'+checkbox.id.split('-')[0];
      const elCategories = document.getElementById(categoriesElementId) as HTMLSelectElement;
      const elFixedExpense = document.getElementById(fixedExpenseElementId) as HTMLInputElement;
      const elCreditCardExpense = document.getElementById(creditCardExpenseElementId) as HTMLInputElement;
      elCategories.removeAttribute('disabled');
      elFixedExpense.removeAttribute('disabled');
      elCreditCardExpense.removeAttribute('disabled');
      this.isValueEmpty = true;
      for(var i=0; i<this.expenses.length; i++) {
        if(checkbox.name==this.expenses[i].id) {
          var id = checkbox.id.split('-')[1];
          var expenseId = checkbox.id.split('-')[0];
          var categoryId = 0;
          var revenueId = checkbox.id.split('-')[2];
          for(var j=0; j<this.expenses[i].budgetSource.length; j++) {
            
            if(id==this.expenses[i].budgetSource[j].id && revenueId==this.expenses[i].budgetSource[j].revenueId) {
              
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
                      this.monthYear = this.expensesList[k].billingMonthYear;
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
                                    "revenueId": revenueId,
                                    "fixedExpense": false,
                                    "installmentsExpense": false,
                                    "creditCardInFull": false,
                                    "billingMonthYear": this.monthYear,
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
                                    "revenueId": revenueId,
                                    "fixedExpense": false,
                                    "installmentsExpense": false,
                                    "creditCardInFull": false,
                                    "billingMonthYear": this.monthYear,
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
          var revenueId = checkbox.id.split('-')[2];
          for(var j=0; j<this.expenses[i].budgetSource.length; j++) {
            
            if(id==this.expenses[i].budgetSource[j].id && revenueId==this.expenses[i].budgetSource[j].revenueId) {
              
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
      var creditCardExpenseElementId = 'credit-card-'+checkbox.id.split('-')[0];
      const elCategories = document.getElementById(categoriesElementId) as HTMLSelectElement;
      const elFixedExpense = document.getElementById(fixedExpenseElementId) as HTMLInputElement;
      const elCreditCardExpense = document.getElementById(creditCardExpenseElementId) as HTMLElement;
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
            elCreditCardExpense.setAttribute('disabled', 'true');
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
    
    if(selectCategory.value!='selecione a categoria') {
      this.isCategoryNotSelected = false;
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
    } else {
      this.isCategoryNotSelected = true;
    }
    this.manageButton();
  }

  public addDate(e: Event) {
    const inputDate = e.target as HTMLInputElement;
    var date = '';
    if(inputDate.value != '') {
      this.dateInformed = true;
      var splitDate = inputDate.value.split('-');
      date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0];

      //Verifica se a data informada não é futura
      const currentDate: Date = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth()+1;
      const day = currentDate.getDate();
      if(splitDate[0]<=year.toString()) {
        if(splitDate[1]<=month.toString()) {
          
          if(splitDate[2]<=day.toString() || splitDate[1]<month.toString()) {
            this.isFutureDate = false;
            var time = this.dateTime.getLocalDateTime();
            time = time.split(',')[1];
            var splitDate = inputDate.value.split('-');
            date = splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0]+' '+time;
            var monthYear = splitDate[1]+splitDate[0];
            for(var i=0; i<this.expensesList.length; i++) {
              if(this.expensesList[i].checkboxId.split('-')[0]==inputDate.name) {
                this.expensesList[i].date = date;
                if(this.expensesList[i].creditCardInFull) {
                  var billingMonthYear = this.expensesList[i].billingMonthYear;
                  var billingMonth = billingMonthYear.substring(0, 2);
                  var billingYear = billingMonthYear.substring(2, 6);
              
                  if(billingMonthYear.length>2) {
                    if(billingMonth>splitDate[1] || billingYear>splitDate[0]) {
                      this.expensesList[i].date = '01/'+billingMonth+'/'+billingYear;
                    }
                  }
                } else {
                  this.expensesList[i].billingMonthYear = monthYear;
                }
              }
            }
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

    this.manageButton();
  }

  public checkFixedExpense(e: Event) {
    const checkboxFixedExpense = e.target as HTMLInputElement;

    if(checkboxFixedExpense.checked) {
      var checkboxId = checkboxFixedExpense.id.split('-')[1];
      var creditCardExpenseElementId = 'credit-card-'+checkboxId;
      var elCreditCardExpense = document.getElementById(creditCardExpenseElementId) as HTMLInputElement;
      elCreditCardExpense.setAttribute('disabled', 'true');
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].fixedExpense = true;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].fixedExpense = true;
          this.expensesList[i].creditCardInFull = false;
        }
      }
    } else {
      this.isBillingMonthNotSelected = false;
      this.isBillingYearNotSelected = false;
      this.isLastBillingMonthNotSelected = false;
      this.isLastBillingYearNotSelected = false;
      var checkboxId = checkboxFixedExpense.id.split('-')[1];
      var creditCardExpenseElementId = 'credit-card-'+checkboxId;
      var elCreditCardExpense = document.getElementById(creditCardExpenseElementId) as HTMLInputElement;
      elCreditCardExpense.removeAttribute('disabled');
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
      this.isBillingMonthNotSelected = true;
      this.isBillingYearNotSelected = true;
      this.isLastBillingMonthNotSelected = true;
      this.isLastBillingYearNotSelected = true;
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
          this.expenses[i].creditCardInFull = false;
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

    this.manageButton();
  }

  public checkCreditCardExpense(e: Event) {
    const checkboxCreditCardExpense = e.target as HTMLInputElement;
    this.isBillingMonthNotSelected = false;
    this.isBillingYearNotSelected = false;

    if(checkboxCreditCardExpense.checked) {
      var checkboxId = checkboxCreditCardExpense.id.split('-')[2];
      var fixedExpenseElementId = 'fixed-'+checkboxId;
      var elFixedExpense = document.getElementById(fixedExpenseElementId) as HTMLInputElement;
      elFixedExpense.setAttribute('disabled', 'true');
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].creditCardExpense = true;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].fixedExpense = false;
          this.expensesList[i].installmentsExpense = false;
          this.expensesList[i].creditCardInFull = true;
        }
      }

    } else {
      this.isBillingMonthNotSelected = false;
      this.isBillingYearNotSelected = false;
      var checkboxId = checkboxCreditCardExpense.id.split('-')[2];
      var expenseExpenseElementId = 'fixed-'+checkboxId;
      var elFixedExpense = document.getElementById(expenseExpenseElementId) as HTMLInputElement;
      elFixedExpense.removeAttribute('disabled');
      var id = checkboxId.split('se')[1];
      for(var i=0; i<this.expenses.length; i++) {
        if(this.expenses[i].id==id) {
          this.expenses[i].creditCardExpense = false;
        }
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].creditCardInFull = false;
        }
      }
    }
  }

  public checkBillingMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboBillingMonthChanged = true;
    
    if(monthCbo.value=='selecione o mês') {
      this.isBillingMonthNotSelected = true;
      this.checkBillingCbos(monthCbo);
    } else {
      this.isBillingMonthNotSelected = false;
      this.checkBillingCbos(monthCbo);
    }
  }

  public checkBillingYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboBillingYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isBillingYearNotSelected = true;
      this.checkBillingCbos(yearCbo);
    } else {
      this.isBillingYearNotSelected = false;
      this.checkBillingCbos(yearCbo);
    }
  }

  private checkBillingCbos(element: HTMLElement) {
    if(!this.isBillingMonthNotSelected && !this.isBillingYearNotSelected && this.cboBillingMonthChanged && this.cboBillingYearChanged) {
      var id = element.id;
      var monthId = '';
      var yearId = '';
      var monthCbo;
      var yearCbo; 
      if(id.includes('billing-month')) {
        monthCbo = document.getElementById(id) as HTMLSelectElement;
        yearId = 'billing-year'+id.split('billing-month')[1];
        yearCbo = document.getElementById(yearId) as HTMLSelectElement; 
      } else {
        yearCbo = document.getElementById(id) as HTMLSelectElement;
        monthId = 'billing-month'+id.split('billing-year')[1];
        monthCbo = document.getElementById(monthId) as HTMLSelectElement;
      }
      
      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.billingMonthYear = month + yearCbo.value;
      var checkboxId = '';
      if(monthId!='') {
        checkboxId = 'expense'+monthId;
        checkboxId = checkboxId.split('billing-month')[0] + checkboxId.split('billing-month')[1];
      } else {
        checkboxId = 'expense'+yearId;
        checkboxId.split('billing-year')[0] + checkboxId.split('billing-year')[1];
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].billingMonthYear = this.billingMonthYear;
        }
      }
    }
    this.manageButton();
  }

  public checkLastBillingMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;
    this.cboLastBillingMonthChanged = true;

    if(monthCbo.value=='selecione o mês') {
      this.isLastBillingMonthNotSelected = true;
      this.checkLastBillingCbos(monthCbo);
    } else {
      this.isLastBillingMonthNotSelected = false;
      this.checkLastBillingCbos(monthCbo);
    }
  }

  public checkLastBillingYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    this.cboLastBillingYearChanged = true;
    
    if(yearCbo.value=='selecione o ano') {
      this.isLastBillingYearNotSelected = true;
      this.checkLastBillingCbos(yearCbo);
    } else {
      this.isLastBillingYearNotSelected = false;
      this.checkLastBillingCbos(yearCbo);
    }
  }

  private checkLastBillingCbos(element: HTMLElement) {
    if(!this.isLastBillingMonthNotSelected && !this.isLastBillingYearNotSelected && this.cboLastBillingMonthChanged && this.cboLastBillingYearChanged) {
      var id = element.id;
      var monthId = '';
      var yearId = '';
      var monthCbo;
      var yearCbo; 
      if(id.includes('last-billing-month')) {
        monthCbo = document.getElementById(id) as HTMLSelectElement;
        yearId = 'last-billing-year'+id.split('last-billing-month')[1];
        yearCbo = document.getElementById(yearId) as HTMLSelectElement; 
      } else {
        yearCbo = document.getElementById(id) as HTMLSelectElement;
        monthId = 'last-billing-month'+id.split('last-billing-year')[1];
        monthCbo = document.getElementById(monthId) as HTMLSelectElement;
      }
      
      var month = this.months.convertMonthNameToMonthNumber(monthCbo.value);
      this.lastBillingMonthYear = month + yearCbo.value;
      var checkboxId = '';
      if(monthId!='') {
        checkboxId = 'expense'+monthId;
        checkboxId = checkboxId.split('last-billing-month')[0] + checkboxId.split('last-billing-month')[1];
      } else {
        checkboxId = 'expense'+yearId;
        checkboxId.split('last-billing-year')[0] + checkboxId.split('last-billing-year')[1];
      }

      for(var i=0; i<this.expensesList.length; i++) {
        if(this.expensesList[i].checkboxId.split('-')[0]==checkboxId) {
          this.expensesList[i].lastBillingMonthYear = this.lastBillingMonthYear;
        }
      }
    }

    this.manageButton();
  }

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

  private manageButton() {
    const button = document.getElementById('buttonAddExpense') as HTMLButtonElement;
    if(
        !this.isDescriptionEmpty && 
        !this.isValueEmpty && 
        !this.isFutureDate && 
        this.isBudgetSelected && 
        !this.isCategoryNotSelected &&
        this.dateInformed && 
        !this.isBillingMonthNotSelected &&
        !this.isBillingYearNotSelected &&
        !this.isLastBillingMonthNotSelected &&
        !this.isLastBillingYearNotSelected
      ) {
        button.removeAttribute('disabled');
        this.isInvalidForm = false;
      } else {
        button.setAttribute('disabled', 'true');
        this.isInvalidForm = true;
      }
  }

  public async createExpenses() {
    this.modalLoading.openModal();
    for(var i=0; i<this.expensesList.length; i++) {
      this.finalExpensesList.push({
                                    "date": this.expensesList[i].date,
                                    "description": this.expensesList[i].description,
                                    "value": parseFloat(this.expensesList[i].value),
                                    "categoryId": parseInt(this.expensesList[i].categoryId),
                                    "budgetId": parseInt(this.expensesList[i].budgetId),
                                    "revenueId": parseInt(this.expensesList[i].revenueId),
                                    "fixedExpense": this.expensesList[i].fixedExpense,
                                    "installmentsExpense": this.expensesList[i].installmentsExpense,
                                    "billingMonthYear": this.expensesList[i].billingMonthYear,
                                    "lastBillingMonthYear": this.expensesList[i].lastBillingMonthYear
                                 });
    }

    var result = await this.expensesService.createExpenses(this.finalExpensesList);

    switch(result.status) {
      case 200:
        this.modalLoading.closeModal();
        this.modalSuccess.openModal("Registro de Despesas", "Despesa(s) registrada(s) com sucesso!");
        break;
      default:
        this.modalLoading.closeModal();
        this.modalInternalError.openModal("Registro de Despesas", "Erro ao tentar registrar a(s) despesa(s), por favor tente novamente mais tarde!");
        break;
    }
  }

}
