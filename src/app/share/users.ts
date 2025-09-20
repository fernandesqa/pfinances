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
        var usersData: any = [];

        data = await this.usersService.getUsersData(this.userId, this.familyId, this.accessToken);

        //Se o endpoint retornar erro, exibir mensagem
        if(data.message) {
            this.internalError();
        } else {
            //Se o endpoint retorna dados, exibir os dados
            for(var i=0; i<data.total; i++) {
                var concludedRegistry = 'Não';
                if(data.data[i].firstAccess==false) {
                concludedRegistry = 'Sim';
                }
                usersData.push({name: data.data[i].name, emailAddress: data.data[i].emailAddress, role: data.data[i].role, concludedRegistry: concludedRegistry});
                this.createUsersTable(usersData);
            }
        }
    }

    private showSpinner() {
        const result = document.getElementById('usersData') as HTMLElement;
        result.innerHTML = '';
        //cria o spinner
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

    private internalError() {
        const result = document.getElementById('usersData') as HTMLElement;
        result.innerHTML = '';
        //cria o spinner
        this.showSpinner();
        //Cria a mensagem de erro
        const eDivError = document.createElement('div');
        eDivError.setAttribute('class', 'd-flex justify-content-center my-5');

        const eI = document.createElement('i');
        eI.setAttribute('class', 'bi bi-emoji-frown-fill text-primary');

        const eSpan = document.createElement('span');
        eSpan.setAttribute('class', 'text-info');
        eSpan.appendChild(eI);
        const eSpanNode = document.createTextNode(' Erro interno, por favor tente mais tarde.');
        eSpan.appendChild(eSpanNode);

        eDivError.appendChild(eSpan);
        result.innerHTML = '';
        result.appendChild(eDivError);
    }

    private createUsersTable(data: any) {
        const result = document.getElementById('usersData') as HTMLElement;
        //cria o spinner
        this.showSpinner();
        //Cria a tabela
        const eTable = document.createElement('table');
        eTable.setAttribute('class', 'table table-striped table-bordered');

        const eThead = document.createElement('thead');
        const eTrHead = document.createElement('tr');
        const eThNome = document.createElement('th');
        const eThEmail = document.createElement('th');
        const eThTipoAcesso = document.createElement('th');
        const eThCadastro = document.createElement('th');

        eThNome.setAttribute('scope', 'col');
        const eThNomeNode = document.createTextNode('Nome');
        eThNome.appendChild(eThNomeNode);

        eThEmail.setAttribute('scope', 'col');
        const eThEmailNode = document.createTextNode('E-mail');
        eThEmail.appendChild(eThEmailNode);

        eThTipoAcesso.setAttribute('scope', 'col');
        const eThTipoAcessoNode = document.createTextNode('Tipo de Acesso');
        eThTipoAcesso.appendChild(eThTipoAcessoNode);

        eThCadastro.setAttribute('scope', 'col');
        const eThCadastroNode = document.createTextNode('Cadastro Concluído');
        eThCadastro.appendChild(eThCadastroNode);

        eTrHead.appendChild(eThNome);
        eTrHead.appendChild(eThEmail);
        eTrHead.appendChild(eThTipoAcesso);
        eTrHead.appendChild(eThCadastro);

        eThead.appendChild(eTrHead);
        eTable.appendChild(eThead);

        const eTbody = document.createElement('tbody');
        for(let i=0; i<data.length; i++) {
            const eTrBody = document.createElement('tr');
            const eTdNome = document.createElement('td');
            let eTdNomeNode: any;
            if(data[i].name==null) {
                eTdNomeNode = document.createTextNode(' - ');
            } else {
                eTdNomeNode = document.createTextNode(data[i].name);
            }
            
            eTdNome.appendChild(eTdNomeNode);

            const eTdEmail = document.createElement('td');
            const eTdEmailNode = document.createTextNode(data[i].emailAddress);
            eTdEmail.appendChild(eTdEmailNode);

            const eTdTipoAcesso = document.createElement('td');
            const eTdTipoAcessoNode = document.createTextNode(data[i].role);
            eTdTipoAcesso.appendChild(eTdTipoAcessoNode);

            const eTdCadastro = document.createElement('td');
            const eTdCadastroNode = document.createTextNode(data[i].concludedRegistry);
            eTdCadastro.appendChild(eTdCadastroNode);

            eTrBody.append(eTdNome);
            eTrBody.append(eTdEmail);
            eTrBody.append(eTdTipoAcesso);
            eTrBody.append(eTdCadastro);

            eTbody.appendChild(eTrBody);
        }

        eTable.appendChild(eTbody);
        result.innerHTML = '';
        result.appendChild(eTable);
    }
}