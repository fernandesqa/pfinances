import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvitesService } from '../services/invites.service';

@Component({
  selector: 'app-first-access',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './first-access.html',
  styleUrl: './first-access.css'
})
export class FirstAccess implements OnInit {

  private router = new Router;
  public holder: boolean = true;
  public dependent: boolean = false;
  public form!: FormGroup;
  private lowerCaseRefExp: RegExp = /[A-Z]/;
  private emailRegExp: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  public invalidData: boolean = false;
  public isLoading: boolean = false;
  public internalError: boolean = false;
  public holderForm: boolean = false;
  public dependentForm: boolean = false;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private invitesService: InvitesService
  ) {}

  ngOnInit(): void {
    this.hideNavigation();

    this.form = this.formBuilder.group({
      emailFirstAccess: [null, [Validators.required, this.emailValidator]],
      inviteCode: ['', Validators.required]
    });

  }

  //Oculta a barra de navegação
  private hideNavigation() {
    var nav = document.getElementById('navigation');
    var div = document.getElementById('navigationBottom');
    nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0 d-none');
    div?.setAttribute('class', 'container-fluid bg-secondary d-none');
  }

  //Primeiro acesso do usuário titular
  public holderFirstAccess() {
    this.dependent = false;
    this.holder = true;
  }

  //Primeiro acesso do usuário dependente
  public dependentFirstAccess() {
    this.dependent = true;
    this.holder = false;
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  inputInviteCodeFocus() {
    this.renderer.selectRootElement('#inviteCode').focus();
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  inputEmailFocus() {
    this.renderer.selectRootElement('#email').focus();
  }

  //Valida o e-mail informado pelo usuário e exibe mensagem abaixo do campo caso o padrão esteja incorreto
  emailValidator(control: { value: string; }) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      const matches2 = control.value.match(/[A-Z]/);
      return matches ? false || matches2 != null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  //Valida se o e-mail informado está no padrão correto, quando não, então altera a cor da caixa do campo
  validateEmailField() { 

    const emailBoxEl = document.getElementById('emailFieldBoxFirstAccess');
    const emailField = document.getElementById('email') as HTMLInputElement;
    
    const matches = emailField.value.match(this.emailRegExp);
    
    const matches2 = emailField.value.match(this.lowerCaseRefExp);
    
    if(matches === null || matches2 != null) {
      //Altera a cor da borda do campo para vermelho
      emailBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px red');
    } else {
      //Altera a cor da borda do campo para #dce0e8
      emailBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px #dce0e8');
    }
    
  }

  //Valida se o código do convite foi informado, quando não, então altera a cor da caixa do campo
  validateInviteCodeField () {
    const passwordBoxEl = document.getElementById('inviteCodeFieldBox');
    const passwordField = document.getElementById('inviteCode') as HTMLInputElement;
    if(passwordField.value === '') {
      //Altera a cor da borda do campo para vermelho
      passwordBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px red');
    } else {
      //Altera a cor da borda do campo para #dce0e8
      passwordBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px #dce0e8');
    }
  }

  //Valida o convite
  public async validateInvite() {
    this.invalidData = false;
    this.internalError = false;
    this.holderForm = false;
    this.dependentForm = false;
    this.isLoading = true;
    const elInviteCode = document.getElementById('inviteCode') as HTMLInputElement;
    const elEmail = document.getElementById('email') as HTMLInputElement;
    let role = 'holder';
    if(this.dependent) {
      role = 'dependent';
    }

    var result = await this.invitesService.validateInvite(role, elInviteCode.value, elEmail.value);
    
    switch(result) {
      case 400:
        this.isLoading = false;
        this.invalidData = true;
        break;
      case 500:
        this.isLoading = false;
        this.internalError = true;
        break;
      default:
        this.isLoading = false;
        if(this.holder) {
          this.holderForm = true;
        } else {
          this.dependentForm = true;
        }
        break;
    }
    
  }

  //Redireciona para a página de login
  public goToLogin() {
    this.router.navigate(['login']);
  }

}
