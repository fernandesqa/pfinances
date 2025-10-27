import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';
import { FirstAccess } from './first-access/first-access';
import { Summary } from './summary/summary';
import { Revenues } from './revenues/revenues';
import { Statement } from './statement/statement';
import { Budget } from './budget/budget';
import { Savings } from './savings/savings';
import { Expense } from './expense/expense';

export const routes: Routes = [
    {path: 'login', canActivate: [loginGuard], component: Login},
    {path: 'minhas-financas', canActivate: [authGuard], component: Home, children: [
        {path: 'resumo', canActivate: [authGuard], component: Summary},
        {path: 'receitas', canActivate: [authGuard], component: Revenues},
        {path: 'orcamentos', canActivate: [authGuard], component: Budget},
        {path: 'despesas', canActivate: [authGuard], component: Expense},
        {path: 'economias', canActivate: [authGuard], component: Savings},
        {path: 'extrato', canActivate: [authGuard], component: Statement}
    ]},
    {path: 'primeiro-acesso', canActivate: [loginGuard], component: FirstAccess},
    {path: '**', redirectTo: 'login'}
];
