import { Component, OnInit } from '@angular/core';
import { Months } from '../share/months';
import { Years } from '../share/years';

@Component({
  selector: 'app-statement',
  imports: [],
  templateUrl: './statement.html',
  styleUrl: './statement.css'
})
export class Statement implements OnInit {

  public isMonthNotSelected: boolean = false;
  public isYearNotSelected: boolean = false;
  private months = new Months;
  private years = new Years;
  public monthsList: any;
  public yearsList: any;

  ngOnInit(): void {
    this.monthsList = this.months.getMonthsList();
    this.yearsList = this.years.getLastYears(5);
  }

  public checkMonthCbo(e: Event) {
    const monthCbo = e.target as HTMLSelectElement;

    if(monthCbo.value=='selecione o mês') {
      this.isMonthNotSelected = true;
    } else {
      this.isMonthNotSelected = false;
    }
  }

  public checkYearCbo(e: Event) {
    const yearCbo = e.target as HTMLSelectElement;
    
    if(yearCbo.value=='selecione o ano') {
      this.isYearNotSelected = true;
    } else {
      this.isYearNotSelected = false;
    }
  }

}
