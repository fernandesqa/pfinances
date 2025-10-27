import { Component, OnInit } from '@angular/core';
import { RevenuesService } from '../services/revenues.service';
import { Months } from '../share/months';
import { Monetary } from '../share/monetary';
import { DomHtml } from '../share/dom-html';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary implements OnInit {

  public isLoadingRevenue: boolean = false;
  public isLoadingExpenses: boolean = false;
  public isRevenueLoaded: boolean = false;
  public isExpensesLoaded: boolean = false;
  private monetary = new Monetary;
  private months = new Months;
  public revenue: string = '';
  public expenses: string = '';
  public month: string = '';
  public expensesMonth: string = '';
  public year: string = '';
  public expensesYear: string = '';
  private domHTML = new DomHtml;

  constructor(
    private revenuesService: RevenuesService,
    private expensesService: ExpensesService
  ) {}

  async ngOnInit() {
    this.domHTML.activateTab('summary');
    this.isRevenueLoaded = false;
    this.isLoadingRevenue = true;
    this.isLoadingExpenses = true;
    let result = await this.revenuesService.getRevenueCurrentMonth();
    let resultExpenses = await this.expensesService.getExpensesCurrentMonth();
    this.revenue = this.monetary.convertToMonetary(result.response.data[0].value)!;
    this.month = this.months.convertMonthNumberToMonthName(result.response.data[0].month)
    this.year = result.response.data[0].year;
    this.expenses = this.monetary.convertToMonetary(resultExpenses.response.data[0].value);
    this.expensesMonth = this.months.convertMonthNumberToMonthName(resultExpenses.response.data[0].month);
    this.expensesYear = resultExpenses.response.data[0].year;
    this.isLoadingRevenue = false;
    this.isRevenueLoaded = true;
    this.isLoadingExpenses = false;
    this.isExpensesLoaded = true;
  }

}
