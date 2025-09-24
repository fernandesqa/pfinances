import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitesService } from '../services/invites.service';

@Component({
  selector: 'app-modal-add-member',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-add-member.html',
  styleUrl: './modal-add-member.css'
})
export class ModalAddMember implements OnInit {

  public form!: FormGroup;
  public inviteGenerated: boolean = false;
  public memberEmailAddress: string = '';
  public inviteCode: string = '';
  public loading: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nameDependent: [null, [Validators.required]],
      emailDependent: [null, [Validators.required, this.emailValidator]]
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private invitesServices: InvitesService
  ) {}

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

  async generateInvite() {
    this.loading = true;
    const emailAddress = document.getElementById('emailMember') as HTMLInputElement;
    const name = document.getElementById('nameMember') as HTMLInputElement;
    var result = await this.invitesServices.generateInvite(name.value, emailAddress.value);
    this.memberEmailAddress = result.emailAddress;
    this.inviteCode = result.inviteCode;
    this.loading = false;
    this.inviteGenerated = true;
  }

}
