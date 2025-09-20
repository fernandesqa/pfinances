import { Injectable } from "@angular/core";
import { InvitesService } from "../services/invites.service";

Injectable()
export class Invites {
    private invitesService = new InvitesService;
    public userId: string = '';
    public familyId: string = '';
    public accessToken: string = '';

    //Busca os convites por família
    async getInvites() {
        
        this.showSpinner();
        var data: any = [];

        data = await this.invitesService.getInvites();
        
        switch(data.status) {
            case 200:
                this.createInvitesTable(data);
                break;
            case 404:
                this.dataNotFound();
                break;
            default:
                this.internalError();
                break;
        }
    }

    private showSpinner() {
        const result = document.getElementById('invitesData') as HTMLElement;
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
        const result = document.getElementById('invitesData') as HTMLElement;
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

    private dataNotFound() {
        const result = document.getElementById('invitesData') as HTMLElement;
        //cria o spinner
        this.showSpinner();
        //Cria a mensagem de erro
        const eDivMessage = document.createElement('div');
        eDivMessage.setAttribute('class', 'd-flex justify-content-center my-5');

        const eSpan = document.createElement('span');
        eSpan.setAttribute('class', 'text-info');
        const eSpanNode = document.createTextNode('Nenhum registro encontrado!');
        eSpan.appendChild(eSpanNode);

        eDivMessage.appendChild(eSpan);
        result.innerHTML = '';
        result.appendChild(eDivMessage);
    }

     private createInvitesTable(data: any) {
        const result = document.getElementById('invitesData') as HTMLElement;
        //cria o spinner
        this.showSpinner();
        //Cria a tabela
        const eTable = document.createElement('table');
        eTable.setAttribute('class', 'table table-striped table-bordered');

        const eThead = document.createElement('thead');
        const eTrHead = document.createElement('tr');
        const eThInviteCode = document.createElement('th');
        const eThEmail = document.createElement('th');
        const eThUsedInvite = document.createElement('th');

        eThInviteCode.setAttribute('scope', 'col');
        const eThInviteCodeNode = document.createTextNode('Código do Convite');
        eThInviteCode.appendChild(eThInviteCodeNode);

        eThEmail.setAttribute('scope', 'col');
        const eThEmailNode = document.createTextNode('E-mail');
        eThEmail.appendChild(eThEmailNode);

        eThUsedInvite.setAttribute('scope', 'col');
        const eThUsedInviteNode = document.createTextNode('Convite Utilizado');
        eThUsedInvite.appendChild(eThUsedInviteNode);

        eTrHead.appendChild(eThInviteCode);
        eTrHead.appendChild(eThEmail);
        eTrHead.appendChild(eThUsedInvite);

        eThead.appendChild(eTrHead);
        eTable.appendChild(eThead);

        const eTbody = document.createElement('tbody');
        for(let i=0; i<data.response.total; i++) {
            const eTrBody = document.createElement('tr');
            const eTdInviteCode = document.createElement('td');
            let eTdInviteCodeNode: any;
            eTdInviteCodeNode = document.createTextNode(data.response.data[i].familyInviteCode);
            eTdInviteCode.appendChild(eTdInviteCodeNode);

            const eTdEmail = document.createElement('td');
            const eTdEmailNode = document.createTextNode(data.response.data[i].familyInviteEmail);
            eTdEmail.appendChild(eTdEmailNode);

            const eTdUsedInvite = document.createElement('td');
            let eTdUsedInviteNode: any;
            if(data.response.data[i].familyInviteUsed==false) {
                eTdUsedInviteNode = document.createTextNode('Não');
            } else {
                eTdUsedInviteNode = document.createTextNode('Sim');
            }
            
            eTdUsedInvite.appendChild(eTdUsedInviteNode);

            eTrBody.append(eTdInviteCode);
            eTrBody.append(eTdEmail);
            eTrBody.append(eTdUsedInvite);

            eTbody.appendChild(eTrBody);
        }

        eTable.appendChild(eTbody);
        result.innerHTML = '';
        result.appendChild(eTable);
    }
}