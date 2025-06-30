import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-manage-family',
  imports: [CommonModule],
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
  private data: any = [];
  public dataNotFound: boolean = false;
  public dataFound: boolean = false;
  public usersData: any = [];
  public loading: boolean = true;

  async ngOnInit() {

    this.data = await this.usersServices.getUsersData(this.userId, this.familyId, this.accessToken);

    //Se o endpoint não retorna dados, exibir mensagem
    if(this.data.message) {
      this.loading = false;
      this.dataNotFound = true;
    } else {
      //Se o endpoint retorna dados, exibir os dados
      this.loading = false;
      this.dataFound = true;
      for(var i=0; i<this.data.total; i++) {
        var concludedRegistry = 'Não';
        if(this.data.data[i].firstAccess==false) {
          concludedRegistry = 'Sim';
        }

        this.usersData.push({name: this.data.data[i].name, emailAddress: this.data.data[i].emailAddress, role: this.data.data[i].role, concludedRegistry: concludedRegistry});
      }
    }
  }

}
