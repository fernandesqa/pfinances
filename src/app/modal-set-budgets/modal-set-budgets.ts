import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { DomHtml } from '../share/dom-html';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Monetary } from '../share/monetary';

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
  private revenuesService: any = [];
  public revenuesSource: any = [];
  public isLoadingsData: boolean = false;
  public showForm: boolean = false;
  private domHTML = new DomHtml;
  public budgets: any = [];
  public budgetsList: any = [];
  public totalBudgets: number = 1;
  private monetary = new Monetary;

  ngOnInit(): void {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getLastYears(5);
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

  private checkCbos() {

    if(!this.isMonthNotSelected && !this.isYearNotSelected && this.cboMonthChanged && this.cboYearChanged) {
      this.domHTML.createSpinner('spinnerParent');
      this.totalBudgets = 1;
      this.revenuesService.push({
                                "type": "revenue",
                                "id": 3,
                                "description": "Salário",
                                "currentValue": "R$ 22.687,50"
                              },
                              {
                                "type": "savings",
                                "id": 5,
                                "description": "CDB",
                                "currentValue": "R$ 2.455,80"
                              });

      for(var i=0; i<this.revenuesService.length; i++) {
        this.revenuesSource.push({
                                  "type": this.revenuesService[i].type,
                                  "id": this.revenuesService[i].id,
                                  "description": this.revenuesService[i].description,
                                  "currentValue": this.revenuesService[i].currentValue,
                                  "selected": false
                                });
      }
      
      this.budgets.push({
        "id": this.totalBudgets,
        "revenuesSource": this.revenuesSource
      });

      this.domHTML.removeAllChildNodes('spinnerParent');
      this.showForm = true;
    } else {
      this.showForm = false;
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
    } else {
      for(var i=0; i<this.budgets.length; i++) {
        if(checkbox.name==this.budgets[i].id) {
          var id = checkbox.id.split('-')[1];
          for(var j=0; j<this.budgets[i].revenuesSource.length; j++) {
            
            if(id==this.budgets[i].revenuesSource[j].id) {
              
              this.budgets[i].revenuesSource[j].selected = false;

              for(var i=0; i<this.budgetsList.length; i++) {

                if(this.budgetsList[i].checkboxId==checkbox.id) {
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
  }

  public addDescription(e: Event) {
    const input = e.target as HTMLInputElement;
    for(var i=0; i<this.budgetsList.length; i++) {
      var budget = this.budgetsList[i].checkboxId.split('-')[0];
      if(budget==input.name) {
        this.budgetsList[i].description = input.value;
      }
    }
    console.log(this.budgetsList);
  }

  public addBudget() {
    this.totalBudgets = this.totalBudgets + 1;
    
    var sources = [];
    for(var i=0; i<this.revenuesService.length; i++) {
        sources.push({
                      "type": this.revenuesService[i].type,
                      "id": this.revenuesService[i].id,
                      "description": this.revenuesService[i].description,
                      "currentValue": this.revenuesService[i].currentValue,
                      "selected": false
                    });
      }
    this.budgets.push({
                        "id": this.totalBudgets,
                        "revenuesSource": sources
                      });
  }
}
