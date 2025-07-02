import { Component, Injectable } from "@angular/core";
import { UsersService } from "../services/users.service";

Injectable()
export class Users {

    constructor() {}

    private usersService = new UsersService;
    public userId: string = '';
    public familyId: string = '';
    public accessToken: string = '';

    //carrega os dados do titular e seus dependentes
    async getUsers() {

        this.showSpinner();
        var data: any = [];
        var dataNotFound: boolean = false;
        var dataFound: boolean = false;
        var usersData: any = [];
        var loading: boolean = true;

        data = await this.usersService.getUsersData(this.userId, this.familyId, this.accessToken);

        //Se o endpoint não retorna dados, exibir mensagem
        if(data.message) {
            loading = false;
            dataNotFound = true;
        } else {
            //Se o endpoint retorna dados, exibir os dados
            for(var i=0; i<data.total; i++) {
                var concludedRegistry = 'Não';
                if(data.data[i].firstAccess==false) {
                concludedRegistry = 'Sim';
                }
                usersData.push({name: data.data[i].name, emailAddress: data.data[i].emailAddress, role: data.data[i].role, concludedRegistry: concludedRegistry});
                loading = false;
                dataFound = true;
            }
        }
    }

    private showSpinner() {
        const result = document.getElementById('usersData') as HTMLElement;
        result.innerHTML = '';
        //cria o spinner
        const eDivResult = document.createElement('div');
        eDivResult.setAttribute('id', 'usersData');

        const eDiv = document.createElement('div');
        eDiv.setAttribute('class', 'd-flex justify-content-center my-5');

        const eDivSpinner = document.createElement('div');
        eDivSpinner.setAttribute('class', 'spinner-border text-primary');
        eDivSpinner.setAttribute('role', 'status');

        const eSpan = document.createElement('span');
        eSpan.setAttribute('class', 'sr-only');

        eDivSpinner.appendChild(eSpan);
        eDiv.appendChild(eDivSpinner);
        result.appendChild(eDiv);

    }
}