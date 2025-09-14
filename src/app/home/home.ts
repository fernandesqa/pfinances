import { Component, OnInit } from '@angular/core';
import { checkRole } from '../share/check-role';
import { NavigationBar } from '../share/navigation-bar';
import { Summary } from '../summary/summary';

@Component({
  selector: 'app-home',
  imports: [
    Summary
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private navigationBar = new NavigationBar;


  async ngOnInit() {
    this.navigationBar.hideNavigation();
    checkRole();
  }

}
