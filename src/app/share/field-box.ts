import { Injectable } from "@angular/core";

@Injectable()
export class FieldBox {

    //Altera a cor da borda de um element
    //No contexto desse projeto, altera a cor da borda dos campos de texto
    public changeBoxShadowColor(element: HTMLElement, valid: boolean) {

        if(valid) {
            element.setAttribute('style', 'box-shadow: 0 0 0 1px #dce0e8');
        } else {
            element.setAttribute('style', 'box-shadow: 0 0 0 1px red');
        }

    }

}