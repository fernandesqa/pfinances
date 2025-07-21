import { Component, OnInit } from '@angular/core';
import { checkRole } from '../share/checkRole';
import { NavigationBar } from '../share/navigationBar';
import { LocalStorage } from '../share/localStorage';
import { PendingIssuesService } from '../services/pending-issues.service';
import { PendingIssues } from '../share/pending-issues';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private navigationBar = new NavigationBar;
  private pendingIssues = new PendingIssues;


  async ngOnInit() {
    this.navigationBar.hideNavigation();
    checkRole();
    this.pendingIssues.loadPendingIssues();
  }

}
