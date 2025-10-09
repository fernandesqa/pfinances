import { Component, inject, OnInit } from '@angular/core';
import { checkRole } from '../share/check-role';
import { NavigationBar } from '../share/navigation-bar';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private navigationBar = new NavigationBar;
  private router = inject(Router);
  private currentLocation!: string;

  constructor() {
  }


  async ngOnInit() {
    this.navigationBar.hideNavigation();
    checkRole();
    this.currentLocation = this.router.url;
    if (this.currentLocation=='/minhas-financas/resumo') {
      this.tabSummary();
    } else if (this.currentLocation=='/minhas-financas/receitas') {
      this.tabRevenues();
    }
  }

  public tabSummary() {
     const tabSummary = document.getElementById('summary') as HTMLElement;
    const tabRevenues = document.getElementById('revenues') as HTMLElement;
    const tabBudgets = document.getElementById('budgets') as HTMLElement;
    const tabStatement = document.getElementById('statement') as HTMLElement;
    tabSummary.setAttribute('class', 'nav-link active tabs tab-active text-primary fw-bold');
    tabRevenues?.setAttribute('class', 'nav-link text-tertiary');
    tabBudgets?.setAttribute('class', 'nav-link text-tertiary');
    tabStatement?.setAttribute('class', 'nav-link text-tertiary');
    this.router.navigate(['/minhas-financas/resumo']);
  }

  public tabRevenues() {
    const tabRevenues = document.getElementById('revenues') as HTMLElement;
    const tabSummary = document.getElementById('summary') as HTMLElement;
    const tabBudgets = document.getElementById('budgets') as HTMLElement;
    const tabStatement = document.getElementById('statement') as HTMLElement;
    tabRevenues.setAttribute('class', 'nav-link active tabs tab-active text-primary fw-bold');
    tabSummary?.setAttribute('class', 'nav-link text-tertiary');
    tabBudgets?.setAttribute('class', 'nav-link text-tertiary');
    tabStatement?.setAttribute('class', 'nav-link text-tertiary');
    this.router.navigate(['/minhas-financas/receitas']);
  }

  public tabBudgets() {
    const tabRevenues = document.getElementById('revenues') as HTMLElement;
    const tabSummary = document.getElementById('summary') as HTMLElement;
    const tabBudgets = document.getElementById('budgets') as HTMLElement;
    const tabStatement = document.getElementById('statement') as HTMLElement;
    tabBudgets.setAttribute('class', 'nav-link active tabs tab-active text-primary fw-bold');
    tabRevenues?.setAttribute('class', 'nav-link text-tertiary');
    tabSummary?.setAttribute('class', 'nav-link text-tertiary');
    tabStatement?.setAttribute('class', 'nav-link text-tertiary');
    this.router.navigate(['/minhas-financas/orcamentos']);
  }

  public tabStatement() {
    const tabRevenues = document.getElementById('revenues') as HTMLElement;
    const tabSummary = document.getElementById('summary') as HTMLElement;
    const tabBudgets = document.getElementById('budgets') as HTMLElement;
    const tabStatement = document.getElementById('statement') as HTMLElement;
    tabStatement.setAttribute('class', 'nav-link active tabs tab-active text-primary fw-bold');
    tabSummary?.setAttribute('class', 'nav-link text-tertiary');
    tabBudgets?.setAttribute('class', 'nav-link text-tertiary');
    tabRevenues?.setAttribute('class', 'nav-link text-tertiary');
    this.router.navigate(['/minhas-financas/extrato']);
  }

}
