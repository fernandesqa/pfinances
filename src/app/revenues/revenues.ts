import { Component, OnInit } from '@angular/core';
import { DomHtml } from '../share/dom-html';

@Component({
  selector: 'app-revenues',
  imports: [],
  templateUrl: './revenues.html',
  styleUrl: './revenues.css'
})
export class Revenues implements OnInit {

  private domHTML = new DomHtml;
  
  ngOnInit(): void {
    this.domHTML.activateTab('revenues');
  }

}
