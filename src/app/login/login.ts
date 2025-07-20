import { Component, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '../share/message';
import { AuthService } from '../services/auth.service';
import { md5 } from 'js-md5';
import { Router } from '@angular/router';
import { FieldBox } from '../share/field-box';
import { NavigationBar } from '../share/navigationBar';
import { checkRole } from '../share/checkRole';
import { LocalStorage } from '../share/locasStorage';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  private isInputTypeText!: boolean;
  inputType!: string;
  eyeIconClass!: string;
  private lowerCaseRefExp: RegExp = /[A-Z]/;
  private emailRegExp: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  public form!: FormGroup;
  private fieldBox = new FieldBox;
  message = new Message();
  eyeIconEvent: EventEmitter<string> = new EventEmitter();
  inputTypeEvent: EventEmitter<string> = new EventEmitter();
  private route: Router = new Router();
  private navigationBar = new NavigationBar;
  private localStorage = new LocalStorage;

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      emailAddress: [null, [Validators.required, this.emailValidator]],
      pwd: ['', Validators.required]
    });

    this.inputType = 'password';
    this.isInputTypeText = false;
    this.eyeIconClass = 'bi bi-eye text-info me-3 fs-5';
    
  }

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.navigationBar.hideNavigation();
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

  //Altera o tipo do input do campo de senha, conforme o usuário clica no ícone de olho
  changeInputType() {
    if(this.isInputTypeText == false) {
      this.isInputTypeText = true;
      this.eyeIconClass = 'bi bi-eye-slash text-info me-3 fs-5';
      this.inputType = 'text';
    } else {
      this.eyeIconClass = 'bi bi-eye text-info me-3 fs-5';
      this.isInputTypeText = false;
      this.inputType = 'password';
    }

    this.eyeIconEvent.emit(this.eyeIconClass);
    this.inputTypeEvent.emit(this.inputType);
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  inputUserNameFocus() {
    this.renderer.selectRootElement('#username').focus();
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  inputPasswordFocus() {
    this.renderer.selectRootElement('#password').focus();
  }

  //Valida se o e-mail informado está no padrão correto, quando não, então altera a cor da caixa do campo
  validateEmailField() { 

    const emailBoxEl = document.getElementById('emailFieldBox') as HTMLElement;
    const emailField = document.getElementById('username') as HTMLInputElement;
    
    const matches = emailField.value.match(this.emailRegExp);
    
    const matches2 = emailField.value.match(this.lowerCaseRefExp);
    
    if(matches === null || matches2 != null) {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(emailBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(emailBoxEl, true);
    }
    
  }

  //Valida se a senha foi informada, quando não, então altera a cor da caixa do campo
  validatePasswordField () {
    const passwordBoxEl = document.getElementById('passwordFieldBox');
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if(passwordField.value === '') {
      //Altera a cor da borda do campo para vermelho
      passwordBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px red');
    } else {
      //Altera a cor da borda do campo para #dce0e8
      passwordBoxEl?.setAttribute('style', 'box-shadow: 0 0 0 1px #dce0e8');
    }
  }

  //Redireciona para a página de primeiro acesso
  goToFirstAccess() {
    this.route.navigate(['primeiro-acesso']);
  }

  //Chama o serviço de autenticação de usuário
  async authUser() {
    const emailField = document.getElementById('username') as HTMLInputElement;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    this.authService.emailAddress = emailField.value;
    this.authService.password = md5(passwordField.value);

    var result =  await this.authService.Authenticate();

    switch(result) {
      case 200:
        this.route.navigate(['resumo']);
        checkRole();
        break;
      default:
        this.message.buildAutoCloseMessage('errorMessageDiv', 'danger', 'Dados inválidos!', 2000);
        this.localStorage.removeItems();
        break;
    }
  }

}
