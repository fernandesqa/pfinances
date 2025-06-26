import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';

export const routes: Routes = [
    {path: 'login', canActivate: [loginGuard], component: Login},
    {path: 'resumo', canActivate: [authGuard], component: Home},
    {path: '**', redirectTo: 'login'}
];
