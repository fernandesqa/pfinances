import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-modal-manage-family',
  imports: [],
  providers: [
    UsersService
  ],
  templateUrl: './modal-manage-family.html',
  styleUrl: './modal-manage-family.css'
})
export class ModalManageFamily implements OnInit {

  constructor(private usersServices: UsersService) {}

  private userId: string = localStorage.getItem('pFinancesUserId')!;
  private familyId: string = localStorage.getItem('pFinancesFamilyId')!;
  private accessToken: string = localStorage.getItem('pFinancesAccessToken')!;
  private data: string = '';

  async ngOnInit() {

    this.data = await this.usersServices.getUsersData(this.userId, this.familyId, this.accessToken);

    console.log(this.data);
    
  }

}
