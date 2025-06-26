import { Injectable } from "@angular/core";

@Injectable()
export class Message {
    constructor() {}

    buildAutoCloseMessage(parentId: string, messageType: string, messageText: string, timeout: number) {
        var messageParent = document.getElementById(parentId);
        var elMsg = document.createElement('div');
        var MsgText = document.createTextNode(messageText);
        elMsg.setAttribute('class', 'alert alert-'+messageType);
        elMsg.setAttribute('role', 'alert');
        elMsg.appendChild(MsgText);
        messageParent?.appendChild(elMsg);
        const msgTimeout = setTimeout(removeEl,timeout);
        
        function removeEl() {
            while(messageParent?.firstChild) {
                messageParent.removeChild(messageParent.lastChild!);
                location.reload();
            }
        }
    }

    buildMessage(parentId: string, messageType: string, messageText: string) {
        var messageParent = document.getElementById(parentId);
        var elMsg = document.createElement('div');
        var MsgText = document.createTextNode(messageText);
        elMsg.setAttribute('class', 'alert alert-'+messageType);
        elMsg.setAttribute('role', 'alert');
        elMsg.appendChild(MsgText);
        messageParent?.appendChild(elMsg);
    }

    removeMessage(parentId: string) {
        var messageParent = document.getElementById(parentId);
        while(messageParent?.firstChild) {
            messageParent.removeChild(messageParent.lastChild!);
        }
    }
}