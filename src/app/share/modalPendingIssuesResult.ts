import { Injectable } from "@angular/core";

//Classe responsável por gerar os dados do modal de pendências
@Injectable()
export class ModalPendingIssuesResult {

    private modalResultId = 'pendingIssuesResult';

    public showSpinner() {
        const divResult = document.getElementById(this.modalResultId) as HTMLElement;
        divResult.innerHTML = '';
        const divSpinner = document.createElement('div');
        const spanSpinner = document.createElement('span');

        divResult.setAttribute('class', 'd-flex justify-content-center');

        divSpinner.setAttribute('class', 'spinner-border text-primary');
        divSpinner.setAttribute('role', 'status');

        spanSpinner.setAttribute('class', 'sr-only');

        divSpinner.appendChild(spanSpinner);
        divResult.appendChild(divSpinner);
    }

    public dataNotFound() {
        const divResult = document.getElementById(this.modalResultId) as HTMLElement;
        const p = document.createElement('p');
        const pNode = document.createTextNode('Nenhum registro encontrado.');
        const hr = document.createElement('hr');
        const a = document.createElement('a');
        const aNode = document.createTextNode('Cadastrar Pendências');
        divResult.innerHTML = '';
        divResult.removeAttribute('class');

        p.setAttribute('class', 'text-info text-center');
        a.setAttribute('type', 'button');
        a.setAttribute('data-bs-dismiss', 'modal');
        a.setAttribute('data-bs-target', '#modalAddPendingIssues');
        a.setAttribute('aria-label', 'Close');
        a.setAttribute('class', 'btn text-success');

        p.appendChild(pNode);
        a.appendChild(aNode);

        divResult.appendChild(p);
        divResult.appendChild(hr);
        divResult.appendChild(a);
    }

    public pendingIssuesList(data: any) {
        const divResult = document.getElementById(this.modalResultId) as HTMLElement;
        const row = document.createElement('div');
        const colAdd = document.createElement('div');
        const colEdit = document.createElement('div');
        const colHist = document.createElement('div');
        const colDelete = document.createElement('div');
        const divAdd = document.createElement('div');
        const divEdit = document.createElement('div');
        const divHist = document.createElement('div');
        const divDelete = document.createElement('div');
        const aAdd = document.createElement('a');
        const aEdit = document.createElement('a');
        const aHist = document.createElement('a');
        const aDelete = document.createElement('a');
        const iAdd = document.createElement('i');
        const iEdit = document.createElement('i');
        const iHist = document.createElement('i');
        const iDelete = document.createElement('i');
        const hr = document.createElement('hr');
        const h4 = document.createElement('h4');
        const h4Node = document.createTextNode('Lista de Pendências');

        row.setAttribute('class', 'row');
        colAdd.setAttribute('class', 'col');
        divAdd.setAttribute('class', 'd-flex justify-content-center');
        aAdd.setAttribute('type', 'button');
        aAdd.setAttribute('data-bs-dismiss', 'modal');
        aAdd.setAttribute('data-bs-target', '#modalAddPendingIssues');
        aAdd.setAttribute('aria-label', 'Close');
        aAdd.setAttribute('class', 'btn text-success');
        iAdd.setAttribute('class', 'bi bi-plus-square-fill fs-3');
        colEdit.setAttribute('class', 'col');
        divEdit.setAttribute('class', 'd-flex justify-content-center');
        aEdit.setAttribute('type', 'button');
        aEdit.setAttribute('data-bs-dismiss', 'modal');
        aEdit.setAttribute('data-bs-target', '#modalUpdatePendingIssues');
        aEdit.setAttribute('aria-label', 'Close');
        aEdit.setAttribute('class', 'btn text-warning');
        iEdit.setAttribute('class', 'bi bi-pencil-square fs-3');
        colHist.setAttribute('class', 'col');
        divHist.setAttribute('class', 'd-flex justify-content-center');
        aHist.setAttribute('type', 'button');
        aHist.setAttribute('data-bs-dismiss', 'modal');
        aHist.setAttribute('data-bs-target', '#modalPendingIssuesHistory');
        aHist.setAttribute('aria-label', 'Close');
        aHist.setAttribute('class', 'btn');
        iHist.setAttribute('class', 'bi bi-binoculars-fill fs-3');
        colDelete.setAttribute('class', 'col');
        divDelete.setAttribute('class', 'd-flex justify-content-center');
        aDelete.setAttribute('type', 'button');
        aDelete.setAttribute('data-bs-dismiss', 'modal');
        aDelete.setAttribute('data-bs-target', '#modalDeletePendingIssues');
        aDelete.setAttribute('aria-label', 'Close');
        aDelete.setAttribute('class', 'btn text-danger');
        iDelete.setAttribute('class', 'bi bi-x-square-fill fs-3');

        aAdd.appendChild(iAdd);
        divAdd.appendChild(aAdd);
        colAdd.appendChild(divAdd);
        row.appendChild(colAdd);

        aEdit.appendChild(iEdit);
        divEdit.appendChild(aEdit);
        colEdit.appendChild(divEdit);
        row.appendChild(colEdit);

        aHist.appendChild(iHist);
        divHist.appendChild(aHist);
        colHist.appendChild(divHist);
        row.appendChild(colHist);

        aDelete.appendChild(iDelete);
        divDelete.appendChild(aDelete);
        colDelete.appendChild(divDelete);
        row.appendChild(colDelete);

        divResult.innerHTML = '';
        divResult.removeAttribute('class');
        divResult.appendChild(row);
        divResult.appendChild(hr);

        h4.setAttribute('class', 'text-primary fw-bold');
        h4.appendChild(h4Node);
        divResult.appendChild(h4);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const thDescricao = document.createElement('th');
        const thConcluida = document.createElement('th');
        const thDescricaoNode = document.createTextNode('Descrição');
        const divThConcluida = document.createElement('div');
        const thConcluidaNode = document.createTextNode('Concluída');
        const tbody = document.createElement('tbody');

        table.setAttribute('class', 'table table-bordered');
        thConcluida.setAttribute('scope', 'col');
        thDescricao.setAttribute('scope', 'col');
        divThConcluida.setAttribute('class', 'd-flex justify-content-center');

        thDescricao.appendChild(thDescricaoNode);
        divThConcluida.appendChild(thConcluidaNode);
        thConcluida.appendChild(divThConcluida);
        trHead.appendChild(thDescricao);
        trHead.appendChild(thConcluida);

        thead.appendChild(trHead);

        table.appendChild(thead);

        var total = data.response.total;

        for(var i=0; i<total; i++) {
            const tr = document.createElement('tr');
            const tdDescricao = document.createElement('td');
            const tdDescricaoNode = document.createTextNode(data.response.data[i].pendingIssueDescription);

            const tdCheckBox = document.createElement('td');
            const divCheckBox = document.createElement('div');
            const inputCheckBox = document.createElement('input');

            divCheckBox.setAttribute('class', 'd-flex justify-content-center');
            inputCheckBox.setAttribute('type', 'checkbox');
            inputCheckBox.setAttribute('class', 'form-check-input');
            inputCheckBox.setAttribute('id', data.response.data[i].pendingIssueId);

            if(data.response.data[i].done) {
                inputCheckBox.setAttribute('checked', 'true');
                inputCheckBox.setAttribute('disabled', 'true');
            }

            tdDescricao.appendChild(tdDescricaoNode);
            divCheckBox.appendChild(inputCheckBox);
            tdCheckBox.appendChild(divCheckBox);
            tr.appendChild(tdDescricao);
            tr.appendChild(tdCheckBox);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        divResult.appendChild(table);

        const divTotal = document.createElement('div');
        const pTotal = document.createElement('p');
        const pTotalNode = document.createTextNode('Total: '+data.response.total);

        divTotal.setAttribute('class', 'd-flex justify-content-start ms-2');
        pTotal.setAttribute('class', 'text-info my-2');

        pTotal.appendChild(pTotalNode);
        divTotal.appendChild(pTotal);
        divResult.appendChild(divTotal);
    }

}