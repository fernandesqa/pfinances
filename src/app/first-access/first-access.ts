import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvitesService } from '../services/invites.service';
import { FieldBox } from '../share/field-box';
import { md5 } from 'js-md5';
import { FirstAccessService } from '../services/first-access.service';
import { AuthService } from '../services/auth.service';
import { checkRole } from '../share/check-role';
import { LocalStorage } from '../share/local-storage';

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
  public formHolder!: FormGroup;
  public formDependent!: FormGroup;
  private lowerCaseRefExp: RegExp = /[A-Z]/;
  private emailRegExp: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  public invalidData: boolean = false;
  public isLoading: boolean = false;
  public internalError: boolean = false;
  public isFormHolder: boolean = false;
  public isFormDependent: boolean = false;
  public emailAddress: string = '';
  private fieldBox = new FieldBox;
  private isHolderPwdInputTypeText!: boolean;
  private isHolderConfirmPwdInputTypeText!: boolean;
  private isDependentPwdInputTypeText!: boolean;
  private isDependentConfirmPwdInputTypeText!: boolean;
  public holderPwdInputType!: string;
  public holderConfirmPwdInputType!: string;
  public dependentPwdInputType!: string;
  public dependentConfirmPwdInputType!: string;
  public holderPwdEyeIconClass!: string;
  public holderConfirmPwdEyeIconClass!: string;
  public dependentPwdEyeIconClass!: string;
  public dependentConfirmPwdEyeIconClass!: string;
  public holderPwdEyeIconEvent: EventEmitter<string> = new EventEmitter();
  public holderConfirmPwdEyeIconEvent: EventEmitter<string> = new EventEmitter();
  public holderPwdInputTypeEvent: EventEmitter<string> = new EventEmitter();
  public holderConfirmPwdInputTypeEvent: EventEmitter<string> = new EventEmitter();
  public dependentPwdEyeIconEvent: EventEmitter<string> = new EventEmitter();
  public dependentConfirmPwdEyeIconEvent: EventEmitter<string> = new EventEmitter();
  public dependentPwdInputTypeEvent: EventEmitter<string> = new EventEmitter();
  public dependentConfirmPwdInputTypeEvent: EventEmitter<string> = new EventEmitter();
  public isSendingData: boolean = false;
  public conflict: boolean = false;
  public sendingDataInternalError: boolean = false;
  private route: Router = new Router();
  public loginError: boolean = false;
  private localStorage = new LocalStorage;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private invitesService: InvitesService,
    private firstAccessService: FirstAccessService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hideNavigation();

    this.form = this.formBuilder.group({
      emailFirstAccess: [null, [Validators.required, this.emailValidator]],
      inviteCode: ['', Validators.required]
    });

    this.formHolder = this.formBuilder.group({
      holderFirstName: ['', Validators.required],
      holderLastName: ['', Validators.required],
      familyName: ['', Validators.required],
      holderPwd: ['', Validators.required],
      confirmHolderPwd: ['', Validators.required]
    }, { validators: this.holderPasswordMatchValidator() });

    this.formDependent = this.formBuilder.group({
      dependentFirstName: ['', Validators.required],
      dependentLastName: ['', Validators.required],
      dependentPwd: ['', Validators.required],
      confirmDependentPwd: ['', Validators.required]
    }, { validators: this.dependentPasswordMatchValidator() });

    this.holderPwdInputType = 'password';
    this.holderConfirmPwdInputType = 'password';
    this.dependentPwdInputType = 'password';
    this.dependentConfirmPwdInputType = 'password';
    this.isHolderPwdInputTypeText = false;
    this.isHolderConfirmPwdInputTypeText = false;
    this.isDependentPwdInputTypeText = false;
    this.isDependentConfirmPwdInputTypeText = false;
    this.holderPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
    this.holderConfirmPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
    this.dependentPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
    this.dependentConfirmPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';

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
  public inputInviteCodeFocus() {
    this.renderer.selectRootElement('#inviteCode').focus();
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputEmailFocus() {
    this.renderer.selectRootElement('#email').focus();
  }

  //Valida o e-mail informado pelo usuário e exibe mensagem abaixo do campo caso o padrão esteja incorreto
  private emailValidator(control: { value: string; }) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      const matches2 = control.value.match(/[A-Z]/);
      return matches ? false || matches2 != null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  //Valida se o e-mail informado está no padrão correto, quando não, então altera a cor da caixa do campo
  public validateEmailField() { 

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
  public validateInviteCodeField () {
    const inviteCodeFieldBoxEl = document.getElementById('inviteCodeFieldBox') as HTMLElement;
    const inviteCodeField = document.getElementById('inviteCode') as HTMLInputElement;
    if(inviteCodeField.value === '') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(inviteCodeFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(inviteCodeFieldBoxEl, true);
    }
  }

  //Valida o convite
  public async validateInvite() {
    this.invalidData = false;
    this.internalError = false;
    this.isFormHolder = false;
    this.isFormDependent = false;
    this.isLoading = true;
    const elInviteCode = document.getElementById('inviteCode') as HTMLInputElement;
    const elEmail = document.getElementById('email') as HTMLInputElement;
    this.emailAddress = elEmail.value;
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
          this.isFormHolder = true;
        } else {
          this.isFormDependent = true;
        }
        break;
    }
    
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputHolderFirstNameFocus() {
    this.renderer.selectRootElement('#holderFirstName').focus();
  }

  //Valida se o campo foi preenchido
  public validateHolderFirstName() {
    const holderFirstNameFieldBoxEl = document.getElementById('holderFirstNameFieldBox') as HTMLElement;
    const holderFirstNameInputEl = document.getElementById('holderFirstName') as HTMLInputElement;

    if(holderFirstNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(holderFirstNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(holderFirstNameFieldBoxEl, true);
    }
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputHolderLastNameFocus() {
    this.renderer.selectRootElement('#holderLastName').focus();
  }

  //Valida se o campo foi preenchido
  public validateHolderLastName() {
    const holderLastNameFieldBoxEl = document.getElementById('holderLastNameFieldBox') as HTMLElement;
    const holderLastNameInputEl = document.getElementById('holderLastName') as HTMLInputElement;

    if(holderLastNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(holderLastNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(holderLastNameFieldBoxEl, true);
    }
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputFamilyNameFocus() {
    this.renderer.selectRootElement('#familyName').focus();
  }

  //Valida se o campo foi preenchido
  public validateFamilyName() {
    const familyNameFieldBoxEl = document.getElementById('familyNameFieldBox') as HTMLElement;
    const familyNameInputEl = document.getElementById('familyName') as HTMLInputElement;

    if(familyNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(familyNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(familyNameFieldBoxEl, true);
    }
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputPasswordFocus() {
    this.renderer.selectRootElement('#password').focus();
  }

  //Altera o tipo do input do campo de senha, conforme o usuário clica no ícone de olho
  public changeHolderPwdInputType() {
    if(this.isHolderPwdInputTypeText == false) {
      this.isHolderPwdInputTypeText = true;
      this.holderPwdEyeIconClass = 'bi bi-eye-slash text-info me-3 fs-5';
      this.holderPwdInputType = 'text';
    } else {
      this.holderPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
      this.isHolderPwdInputTypeText = false;
      this.holderPwdInputType = 'password';
    }

    this.holderPwdEyeIconEvent.emit(this.holderPwdEyeIconClass);
    this.holderPwdInputTypeEvent.emit(this.holderPwdInputType);
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputConfirmPwdFocus() {
    this.renderer.selectRootElement('#confirmHolderPassword').focus();
  }

  //Altera o tipo do input do campo de senha, conforme o usuário clica no ícone de olho
  public changeHolderConfirmPwdInputType() {
    if(this.isHolderConfirmPwdInputTypeText == false) {
      this.isHolderConfirmPwdInputTypeText = true;
      this.holderConfirmPwdEyeIconClass = 'bi bi-eye-slash text-info me-3 fs-5';
      this.holderConfirmPwdInputType = 'text';
    } else {
      this.holderConfirmPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
      this.isHolderConfirmPwdInputTypeText = false;
      this.holderConfirmPwdInputType = 'password';
    }

    this.holderConfirmPwdEyeIconEvent.emit(this.holderConfirmPwdEyeIconClass);
    this.holderConfirmPwdInputTypeEvent.emit(this.holderConfirmPwdInputType);
  }

  //Valida se o campo foi preenchido
  public validatePassword() {
    const holderPwdFieldBoxEl = document.getElementById('holderPasswordFieldBox') as HTMLElement;
    const holderPwdInputEl = document.getElementById('password') as HTMLInputElement;

    if(holderPwdInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(holderPwdFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(holderPwdFieldBoxEl, true);
    }
  }

  //Valida se o campo foi preenchido
  public validateConfirmPwd() {
    const holderConfirmPwdFieldBoxEl = document.getElementById('confirmHolderPasswordFieldBox') as HTMLElement;
    const holderConfirmPwdInputEl = document.getElementById('confirmHolderPassword') as HTMLInputElement;

    if(holderConfirmPwdInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(holderConfirmPwdFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(holderConfirmPwdFieldBoxEl, true);
    }
  }

  public holderPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('holderPwd');
      const confirmPassword = control.get('confirmHolderPwd');
      
      if (!password || !confirmPassword) {
        return null; // Controls not found, no validation needed
      }

      return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
    };
  }

  public async sendHolderFirstAccess() {
    this.sendingDataInternalError = false;
    this.conflict = false;
    this.loginError = false;
    this.isSendingData = true;
    const firstNameEl = document.getElementById('holderFirstName') as HTMLInputElement;
    const lastNameEl = document.getElementById('holderLastName') as HTMLInputElement;
    const familyNameEl = document.getElementById('familyName') as HTMLInputElement;
    const emailAddressEl = document.getElementById('holderEmail') as HTMLInputElement;
    const passwordEl = document.getElementById('password') as HTMLInputElement;

    var name = firstNameEl.value + ' ' + lastNameEl.value;
    var familyName = familyNameEl.value;
    var emailAddress = emailAddressEl.value;
    var password = md5(passwordEl.value);

    var result = await this.firstAccessService.sendHolderData(name, emailAddress, password, familyName);

    switch(result) {
      case 500:
        this.isSendingData = false;
        this.sendingDataInternalError = true;
        break;
      case 409:
        this.isSendingData = false;
        this.conflict = true;
        break;
      default:
        this.isSendingData = false;
        this.authService.emailAddress = emailAddress;
        this.authService.password = password;
        var loginResult = await this.authService.Authenticate();
        switch(loginResult) {
          case 200:
            this.route.navigate(['resumo']);
            checkRole();
            break;
          default:
            this.loginError = true;
            this.localStorage.removeItems();
            break;
        }
        break;
    }
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputDependentFirstNameFocus() {
    this.renderer.selectRootElement('#dependentFirstName').focus();
  }

  //Valida se o campo foi preenchido
  public validateDependentFirstName() {
    const dependentFirstNameFieldBoxEl = document.getElementById('dependentFirstNameFieldBox') as HTMLElement;
    const dependentFirstNameInputEl = document.getElementById('dependentFirstName') as HTMLInputElement;

    if(dependentFirstNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(dependentFirstNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(dependentFirstNameFieldBoxEl, true);
    }
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputDependentLastNameFocus() {
    this.renderer.selectRootElement('#dependentLastName').focus();
  }

  //Valida se o campo foi preenchido
  public validateDependentLastName() {
    const dependentLastNameFieldBoxEl = document.getElementById('dependentLastNameFieldBox') as HTMLElement;
    const dependentLastNameInputEl = document.getElementById('dependentLastName') as HTMLInputElement;

    if(dependentLastNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(dependentLastNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(dependentLastNameFieldBoxEl, true);
    }
  }

   //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputDependentPwdFocus() {
    this.renderer.selectRootElement('#dependentPassword').focus();
  }

  //Valida se o campo foi preenchido
  public validateDependentPwd() {
    const dependentPwdFieldBoxEl = document.getElementById('dependentPasswordFieldBox') as HTMLElement;
    const dependentPwdInputEl = document.getElementById('dependentPassword') as HTMLInputElement;

    if(dependentPwdInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(dependentPwdFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(dependentPwdFieldBoxEl, true);
    }
  }


  //Altera o tipo do input do campo de senha, conforme o usuário clica no ícone de olho
  public changeDependentPwdInputType() {
    if(this.isDependentPwdInputTypeText == false) {
      this.isDependentPwdInputTypeText = true;
      this.dependentPwdEyeIconClass = 'bi bi-eye-slash text-info me-3 fs-5';
      this.dependentPwdInputType = 'text';
    } else {
      this.dependentPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
      this.isDependentPwdInputTypeText = false;
      this.dependentPwdInputType = 'password';
    }

    this.dependentPwdEyeIconEvent.emit(this.dependentPwdEyeIconClass);
    this.dependentPwdInputTypeEvent.emit(this.dependentPwdInputType);
  }

  //Foca no campo para digitação quando o usuário clica na caixa do campo
  public inputConfirmDependentPwdFocus() {
    this.renderer.selectRootElement('#confirmDependentPassword').focus();
  }

  //Altera o tipo do input do campo de senha, conforme o usuário clica no ícone de olho
  public changeDependentConfirmPwdInputType() {
    if(this.isDependentConfirmPwdInputTypeText == false) {
      this.isDependentConfirmPwdInputTypeText = true;
      this.dependentConfirmPwdEyeIconClass = 'bi bi-eye-slash text-info me-3 fs-5';
      this.dependentConfirmPwdInputType = 'text';
    } else {
      this.dependentConfirmPwdEyeIconClass = 'bi bi-eye text-info me-3 fs-5';
      this.isDependentConfirmPwdInputTypeText = false;
      this.dependentConfirmPwdInputType = 'password';
    }

    this.dependentConfirmPwdEyeIconEvent.emit(this.dependentConfirmPwdEyeIconClass);
    this.dependentConfirmPwdInputTypeEvent.emit(this.dependentConfirmPwdInputType);
  }

  //Valida se o campo foi preenchido
  public validateConfirmDependentPwd() {
    const holderConfirmDependentPwdFieldBoxEl = document.getElementById('confirmDependentPasswordFieldBox') as HTMLElement;
    const holderConfirmDependentPwdInputEl = document.getElementById('confirmDependentPassword') as HTMLInputElement;

    if(holderConfirmDependentPwdInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(holderConfirmDependentPwdFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(holderConfirmDependentPwdFieldBoxEl, true);
    }
  }

  public dependentPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('dependentPwd');
      const confirmPassword = control.get('confirmDependentPwd');
      
      if (!password || !confirmPassword) {
        return null; // Controls not found, no validation needed
      }

      return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
    };
  }

  public async sendDependentFirstAccess() {
    this.sendingDataInternalError = false;
    this.conflict = false;
    this.loginError = false;
    this.isSendingData = true;
    const firstNameEl = document.getElementById('dependentFirstName') as HTMLInputElement;
    const lastNameEl = document.getElementById('dependentLastName') as HTMLInputElement;
    const emailAddressEl = document.getElementById('dependentEmail') as HTMLInputElement;
    const passwordEl = document.getElementById('dependentPassword') as HTMLInputElement;

    var name = firstNameEl.value + ' ' + lastNameEl.value;
    var emailAddress = emailAddressEl.value;
    var password = md5(passwordEl.value);

    var result = await this.firstAccessService.sendDependentData(name, emailAddress, password);

    switch(result) {
      case 500:
        this.isSendingData = false;
        this.sendingDataInternalError = true;
        break;
      case 409:
        this.isSendingData = false;
        this.conflict = true;
        break;
      default:
        this.isSendingData = false;
        this.authService.emailAddress = emailAddress;
        this.authService.password = password;
        var loginResult = await this.authService.Authenticate();
        switch(loginResult) {
          case 200:
            this.route.navigate(['resumo']);
            checkRole();
            break;
          default:
            this.loginError = true;
            this.localStorage.removeItems();
            break;
        }
        break;
    }
  }

  //Redireciona para a página de login
  public goToLogin() {
    this.router.navigate(['login']);
  }

}
