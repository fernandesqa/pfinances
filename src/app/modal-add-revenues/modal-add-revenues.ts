import { Component, OnInit } from '@angular/core';
import { RevenuesService } from '../services/revenues.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Monetary } from '../share/monetary';
import { Months } from '../share/months';
import { Years } from '../share/years';

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
  public totalRevenues: number = 0;
  public revenues: any;
  public revenuesLastMonth: any;
  private monetary = new Monetary;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;

  constructor(
    private revenuesService: RevenuesService
  ) {}
  async ngOnInit() {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getLastYears(5);
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
    this.revenues = [{"id": 0, "descrption": '', "value": 0}];
  }

  public addItemToList() {
    this.totalRevenues = this.totalRevenues + 1;
    this.revenues.push({"id": this.totalRevenues, "descrption": '', "value": 0});
  }

  public removeLastItemFromLista() {
    this.revenues.pop();
  }

}
