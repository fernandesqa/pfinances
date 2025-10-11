import { Component, OnInit } from '@angular/core';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-budget',
  imports: [],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class Budget implements OnInit {

  private domHTML = new DomHtml;

  ngOnInit(): void {
    this.domHTML.activateTab('budgets');
  }

}
