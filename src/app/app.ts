import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AuthService
  ]
})
export class App {
  protected title = 'pfinances';
}
