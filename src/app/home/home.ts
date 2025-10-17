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
  }

  public tabSummary() {
    this.router.navigate(['/minhas-financas/resumo']);
  }

  public tabRevenues() {
    this.router.navigate(['/minhas-financas/receitas']);
  }

  public tabBudgets() {
    this.router.navigate(['/minhas-financas/orcamentos']);
  }

  public tabSavings() {
    this.router.navigate(['/minhas-financas/economias']);
  }

  public tabStatement() {
    this.router.navigate(['/minhas-financas/extrato']);
  }

}
