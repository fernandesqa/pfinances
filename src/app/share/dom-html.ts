
export class DomHtml {

    public createSpinner(parentId: string) {
        const result = document.getElementById(parentId) as HTMLElement;
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

    public removeAllChildNodes(parentId: string) {
        const parentElement = document.getElementById(parentId) as HTMLElement;
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }

    public createTable(parentId: string, theadData: string[], data: string[][]) {
        const parentElement = document.getElementById(parentId) as HTMLElement;

        const table = document.createElement('table');
        table.setAttribute('class', 'table table-bordered');

        //Criação do cabaçalho da tabela
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');

        for(var i=0; i<theadData.length; i++) {
            const thHead = document.createElement('th');
            thHead.setAttribute('scope', 'col');
            thHead.setAttribute('class', 'bg-primary text-white');
            const thHeadNode = document.createTextNode(theadData[i]);
            thHead.appendChild(thHeadNode);
            trHead.appendChild(thHead);
        }

        thead.appendChild(trHead);
        table.appendChild(thead);

        //Criação do corpo da tabela
        const tbody = document.createElement('tbody');

        for(var i=0; i<data.length; i++) {
            const tbodyTr = document.createElement('tr');
            
            for(var j=0; j<data[i].length; j++) {
                const td = document.createElement('td');
                if(data[i][j].includes('+') && data[i][j].includes('R$')) {
                    td.setAttribute('class', 'text-success');
                } else if(data[i][j].includes('-') && data[i][j].includes('R$')) {
                    td.setAttribute('class', 'text-danger');
                }

                const tdNode = document.createTextNode(data[i][j]);
                td.appendChild(tdNode);
                tbodyTr.appendChild(td);
            }
            
            tbody.appendChild(tbodyTr);
        }

        table.appendChild(tbody);
        
        parentElement.appendChild(table);
        
    }

    public createMsgInternalError(parentId: string) {
        const parentElement = document.getElementById(parentId) as HTMLElement;

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
        parentElement.appendChild(eDivError);
    }

    public createMsgDataNotFound(parentId: string) {
        const parentElement = document.getElementById(parentId) as HTMLElement;
        //Cria a mensagem de erro
        const eDivMessage = document.createElement('div');
        eDivMessage.setAttribute('class', 'd-flex justify-content-center my-5');

        const eSpan = document.createElement('span');
        eSpan.setAttribute('class', 'text-info');
        const eSpanNode = document.createTextNode('Nenhum registro encontrado!');
        eSpan.appendChild(eSpanNode);

        eDivMessage.appendChild(eSpan);
        parentElement.appendChild(eDivMessage);
    }
}