import { Component, OnInit } from '@angular/core';
import { RevenuesService } from '../services/revenues.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Monetary } from '../share/monetary';
import { Months } from '../share/months';
import { Years } from '../share/years';
import { ModalSuccess } from '../modal-success/modal-success';
import { ModalInternalError } from '../modal-internal-error/modal-internal-error';
import { ModalLoading } from '../modal-loading/modal-loading';

@Component({
  selector: 'app-modal-add-revenues',
  imports: [
    CurrencyMaskModule
  ],
  templateUrl: './modal-add-revenues.html',
  styleUrl: './modal-add-revenues.css'
})
export class ModalAddRevenues implements OnInit {

  public hasRevenuesLastMonth: boolean = false;
  public getRevenuesFromLastMonth: boolean = false;
  public internalError: boolean = false;
  public isDescriptionOrValueEmpty: boolean = false;
  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  public totalRevenues: number = 0;
  public revenues: any;
  public revenuesLastMonth: any;
  private monetary = new Monetary;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;
  private finalList: any;
  private modalSuccess = new ModalSuccess;
  private modalInternalError = new ModalInternalError;
  private modalLoading = new ModalLoading;

  constructor(
    private revenuesService: RevenuesService
  ) {}
  async ngOnInit() {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getBillingYears();
    this.resetRevenuesObjectList();
    this.revenuesLastMonth = await this.revenuesService.getRevenueLastMonth();
    switch(this.revenuesLastMonth.status) {
      case 200:
        this.hasRevenuesLastMonth = true;
        this.internalError = false;
        break;
      case 404:
        this.hasRevenuesLastMonth = false;
        this.internalError = false;
        break;
      default:
        this.hasRevenuesLastMonth = false;
        this.internalError = true;
        break;
    }  
  }

  public getSwitchValue(e: Event) {
    const elSwitch = e.target as HTMLInputElement;
    if(elSwitch.checked) {
      this.getRevenuesFromLastMonth = true;
      this.revenues = [];
      for(var i=0; i<this.revenuesLastMonth.response.data.length; i++) {
        var revenueValue = this.monetary.convertToMonetary(this.revenuesLastMonth.response.data[i].value);
        this.revenues.push({"id": i, "description": this.revenuesLastMonth.response.data[i].description, "value": revenueValue})
      }
    } else {
      this.getRevenuesFromLastMonth = false;
      this.isDescriptionOrValueEmpty = false;
      this.resetRevenuesObjectList();
    }
  }

  public currencyMaskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    align: 'left',
    allowNegative: false
  };

  private resetRevenuesObjectList() {
    this.revenues = [{"id": 0, "description": '', "value": 0}];
  }

  public addItemToList() {
    this.totalRevenues = this.totalRevenues + 1;
    this.revenues.push({"id": this.totalRevenues, "description": '', "value": 0});
  }

  public removeLastItemFromLista() {
    this.revenues.pop();
  }

  public updateRevenueList(e: Event) {
    const el = e.target as HTMLInputElement;
    if(el.value=='' || el.value=='R$ 0,00') {
      this.isDescriptionOrValueEmpty = true;
      var elId = el.id;
      var listId;
      listId = elId.substring(12);

      for(var i=0; i<this.revenues.length; i++) {
        if(listId==this.revenues[i].id) {
          this.revenues[i].value = el.value;
        }
      }
      this.checkEmptyFields();
    } else {
      var elId = el.id;
      var listId;
      if(elId.includes('revenueDescription')) {
        listId = elId.substring(18);

        for(var i=0; i<this.revenues.length; i++) {
          if(listId==this.revenues[i].id) {
            this.revenues[i].description = el.value;
          }
        }
      } else if(elId.includes('revenueValue')) {
        listId = elId.substring(12);

        for(var i=0; i<this.revenues.length; i++) {
          if(listId==this.revenues[i].id) {
            this.revenues[i].value = el.value;
          }
        }
      }

      this.checkEmptyFields();
    }
  }

  public checkMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthNotSelected = true;
    } else {
      this.isMonthNotSelected = false;
      //Verifica se todos os campos foram preenchidos
      this.checkEmptyFields();
    }
  }

  public checkYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearNotSelected = true;
    } else {
      this.isYearNotSelected = false;
      //Verifica se todos os campos foram preenchidos
      this.checkEmptyFields();
    }
  }

  private checkEmptyFields() {
    const monthCbo = document.getElementById('monthRevenue') as HTMLSelectElement;
    const yearCbo = document.getElementById('yearRevenue') as HTMLSelectElement;
    const button = document.getElementById('buttonAddRevenues') as HTMLButtonElement;
    var noFieldsEmpty: boolean = true;

    for(var i=0; i<this.revenues.length; i++) {
      if(this.revenues[i].description=='' || this.revenues[i].value==0 || this.revenues[i].value=='R$ 0,00') {
        noFieldsEmpty = false;
        this.isDescriptionOrValueEmpty = true;
        button.setAttribute('disabled', 'true');
      }
    }

    if(monthCbo.value!='selecione o mês' && yearCbo.value!='selecione o ano' && noFieldsEmpty) {
      this.isMonthNotSelected = false;
      this.isYearNotSelected = false;
      this.isDescriptionOrValueEmpty = false;
      button.removeAttribute('disabled');
    } else if (monthCbo.value=='selecione o mês' && yearCbo.value=='selecione o ano') {
      this.isMonthNotSelected = true;
      this.isYearNotSelected = true;
      button.setAttribute('disabled', 'true');
    } else if (monthCbo.value=='selecione o mês') {
      this.isMonthNotSelected = true;
      button.setAttribute('disabled', 'true');
    } else if (yearCbo.value=='selecione o ano') {
      this.isYearNotSelected = true;
      button.setAttribute('disabled', 'true');
    }
  }

  public async addRevenues() {
    this.modalLoading.openModal();
    this.finalList = [];
    const monthCbo = document.getElementById('monthRevenue') as HTMLSelectElement;
    const yearCbo = document.getElementById('yearRevenue') as HTMLSelectElement;

    for(var i=0; i<this.revenues.length; i++) {
      var value = this.monetary.convertFromMonetaryToNumber(this.revenues[i].value);
      this.finalList.push({"description": this.revenues[i].description, "value": value});
    }

    var monthYear = this.months.convertMonthNameToMonthNumber(monthCbo.value) + yearCbo.value;

    var result = await this.revenuesService.createRevenues(monthYear, this.finalList);

    switch(result.status) {
      case 200:
        this.modalLoading.closeModal();
        this.modalSuccess.openModal('Cadastro de Receitas', 'Receita(s) cadastrada(s) com sucesso!');
        break;
      default:
        this.modalLoading.closeModal();
        this.modalInternalError.openModal('Cadastro de Receitas', 'Erro ao realizar o cadastro da(s) receita(s), por favor tente novamente mais tarde!');
        break;
    }
  }

}
