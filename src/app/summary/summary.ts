import { Component, OnInit } from '@angular/core';
import { RevenuesService } from '../services/revenues.service';
import { Months } from '../share/months';
import { Monetary } from '../share/monetary';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary implements OnInit {

  public isLoadingRevenue: boolean = false;
  public isRevenueLoaded: boolean = false;
  private monetary = new Monetary;
  private months = new Months;
  public revenue: string = '';
  public month: string = '';
  public year: string = '';

  constructor(
    private revenuesService: RevenuesService
  ) {}

  async ngOnInit() {
    this.isRevenueLoaded = false;
    this.isLoadingRevenue = true;
    let result = await this.revenuesService.getRevenueCurrentMonth();
    this.revenue = this.monetary.convertToMonetary(result.response.data[0].value)!;
    this.month = this.months.convertMonthNumberToMonthName(result.response.data[0].month)
    this.year = result.response.data[0].year;
    this.isLoadingRevenue = false;
    this.isRevenueLoaded = true;
  }

}
