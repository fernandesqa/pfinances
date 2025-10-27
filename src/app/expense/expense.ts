import { Component, OnInit } from '@angular/core';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-expense',
  imports: [],
  templateUrl: './expense.html',
  styleUrl: './expense.css'
})
export class Expense implements OnInit {

  private domHtml = new DomHtml;

  ngOnInit(): void {
    this.domHtml.activateTab('expenses');
  }

}
