import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvitesService } from '../services/invites.service';
import { FieldBox } from '../share/field-box';

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
  public holderForm: boolean = false;
  public dependentForm: boolean = false;
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

    this.formHolder = this.formBuilder.group({
      holderFirstName: ['', Validators.required],
      holderLastName: ['', Validators.required],
      familyName: ['', Validators.required],
      holderPwd: ['', Validators.required],
      confirmHolderPwd: ['', Validators.required]
    });

    this.formDependent = this.formBuilder.group({});

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
    this.holderForm = false;
    this.dependentForm = false;
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
          this.holderForm = true;
        } else {
          this.dependentForm = true;
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
  public validatePassword() {
    const familyNameFieldBoxEl = document.getElementById('holderPasswordFieldBox') as HTMLElement;
    const familyNameInputEl = document.getElementById('password') as HTMLInputElement;

    if(familyNameInputEl.value==='') {
      //Altera a cor da borda do campo para vermelho
      this.fieldBox.changeBoxShadowColor(familyNameFieldBoxEl, false);
    } else {
      //Altera a cor da borda do campo para #dce0e8
      this.fieldBox.changeBoxShadowColor(familyNameFieldBoxEl, true);
    }
  }

  public checkHolderPwdConfirmation() {
    const holderInputPwdEl = document.getElementById('password') as HTMLInputElement;
    const holderInputConfirmPwdEl = document.getElementById('confirmHolderPassword') as HTMLInputElement;

    if(holderInputPwdEl.value===holderInputConfirmPwdEl.value) {
      return true;
    } else {
      return false;
    }
  }

  //Redireciona para a página de login
  public goToLogin() {
    this.router.navigate(['login']);
  }

}
