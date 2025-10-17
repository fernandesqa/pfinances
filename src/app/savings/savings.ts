import { Component, OnInit } from '@angular/core';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-savings',
  imports: [],
  templateUrl: './savings.html',
  styleUrl: './savings.css'
})
export class Savings implements OnInit {

  private domHtml = new DomHtml;

  ngOnInit(): void {
    this.domHtml.activateTab('savings');
  }
}
