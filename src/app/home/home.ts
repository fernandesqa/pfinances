import { Component, OnInit } from '@angular/core';
import { checkRole } from '../share/checkRole';
import { NavigationBar } from '../share/navigationBar';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private navigationBar = new NavigationBar;

  ngOnInit(): void {
    this.navigationBar.hideNavigation();
    checkRole();
  }

}
