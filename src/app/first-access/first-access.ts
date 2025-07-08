import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-access',
  imports: [],
  templateUrl: './first-access.html',
  styleUrl: './first-access.css'
})
export class FirstAccess implements OnInit {

  private router = new Router;

  ngOnInit(): void {
    this.hideNavigation();
  }

  //Oculta a barra de navegação
  private hideNavigation() {
    var nav = document.getElementById('navigation');
    var div = document.getElementById('navigationBottom');
    nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0 d-none');
    div?.setAttribute('class', 'container-fluid bg-secondary d-none');
  }

  //Redireciona para a página de login
  goToLogin() {
    this.router.navigate(['login']);
  }

}
