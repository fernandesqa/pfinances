import { Injectable } from "@angular/core";

//Exibe a barra de navegação
Injectable()
export function displayNavigation() {
    var nav = document.getElementById('navigation');
    var div = document.getElementById('navigationBottom');
    nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0');
    div?.setAttribute('class', 'container-fluid bg-secondary');
}