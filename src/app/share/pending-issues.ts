import { PendingIssuesService } from "../services/pending-issues.service";
import { LocalStorage } from "./local-storage";

export class PendingIssues {
    private pendingIssuesService = new PendingIssuesService;
    private localStorage = new LocalStorage;

    public async loadPendingIssues(): Promise<any> {

        var role = this.localStorage.getRole();

        if(role=='1') {
            //Apresenta o spinner para indicar o carregamento das pendências
            const divHolderNotification = document.getElementById('holderNotification') as HTMLElement;
            const divSpinner = document.createElement('div');
            const spanSpinner = document.createElement('span');

            divSpinner.setAttribute('class', 'spinner-border spinner-border-sm text-primary');
            divSpinner.setAttribute('role', 'status');

            spanSpinner.setAttribute('class', 'sr-only');

            divSpinner.appendChild(spanSpinner);
            divHolderNotification.appendChild(divSpinner);

            //Busca as pendências
            var pendingIssues = await this.pendingIssuesService.getCurrentMonth();
            var totalPendingIssues = pendingIssues.response.pendings;

            if(totalPendingIssues > 0 && totalPendingIssues <= 9) {
                //Cria o span com a quantidade de notificações pendentes
                const spanNotificationNumber = document.createElement('span');
                const notificationNumberNode = document.createTextNode(totalPendingIssues);

                spanNotificationNumber.appendChild(notificationNumberNode);

                //Apaga o spinner da página
                divHolderNotification.innerHTML = '';
                divHolderNotification.setAttribute('class', 'label label-danger');
                divHolderNotification.setAttribute('style', 'padding: .2em .6em .3em;');

                //Exibe a quantidade de notificações pendentes
                divHolderNotification.appendChild(spanNotificationNumber);

                return pendingIssues;
            } else if(totalPendingIssues >= 10) {
                //Cria o span com a quantidade de notificações pendentes
                const spanNotificationNumber = document.createElement('span');
                const notificationNumberNode = document.createTextNode(totalPendingIssues);

                spanNotificationNumber.appendChild(notificationNumberNode);

                //Apaga o spinner da página
                divHolderNotification.innerHTML = '';
                divHolderNotification.setAttribute('class', 'label label-danger');
                divHolderNotification.setAttribute('style', 'padding: .3em .3em .3em;');

                //Exibe a quantidade de notificações pendentes
                divHolderNotification.appendChild(spanNotificationNumber);

                return pendingIssues;
            } else {
                //Se não há pendencias, para com a exibição do carregamento de pendências
                divHolderNotification.innerHTML = '';
                return pendingIssues;
            }
        } else {
            //Apresenta o spinner para indicar o carregamento das pendências
            const divDependentNotification = document.getElementById('dependentNotification') as HTMLElement;
            const divSpinner = document.createElement('div');
            const spanSpinner = document.createElement('span');

            divSpinner.setAttribute('class', 'spinner-border spinner-border-sm text-primary');
            divSpinner.setAttribute('role', 'status');

            spanSpinner.setAttribute('class', 'sr-only');

            divSpinner.appendChild(spanSpinner);
            divDependentNotification.appendChild(divSpinner);

            //Busca as pendências
            var pendingIssues = await this.pendingIssuesService.getCurrentMonth();
            var totalPendingIssues = pendingIssues.response.pendings;

            if(totalPendingIssues > 0 && totalPendingIssues <= 9) {
                //Cria o span com a quantidade de notificações pendentes
                const spanNotificationNumber = document.createElement('span');
                const notificationNumberNode = document.createTextNode(totalPendingIssues);

                spanNotificationNumber.appendChild(notificationNumberNode);

                //Apaga o spinner da página
                divDependentNotification.innerHTML = '';
                divDependentNotification.setAttribute('class', 'label label-danger');
                divDependentNotification.setAttribute('style', 'padding: .2em .6em .3em;');

                //Exibe a quantidade de notificações pendentes
                divDependentNotification.appendChild(spanNotificationNumber);

                return pendingIssues;
            } else if(totalPendingIssues >= 10) {
                //Cria o span com a quantidade de notificações pendentes
                const spanNotificationNumber = document.createElement('span');
                const notificationNumberNode = document.createTextNode(totalPendingIssues);

                spanNotificationNumber.appendChild(notificationNumberNode);

                //Apaga o spinner da página
                divDependentNotification.innerHTML = '';
                divDependentNotification.setAttribute('class', 'label label-danger');
                divDependentNotification.setAttribute('style', 'padding: .3em .3em .3em;');

                //Exibe a quantidade de notificações pendentes
                divDependentNotification.appendChild(spanNotificationNumber);

                return pendingIssues;
            } else {
                //Se não há pendencias, para com a exibição do carregamento de pendências
                divDependentNotification.innerHTML = '';
                return pendingIssues;
            }
        }
    }
}