import { Injectable } from "@angular/core";

@Injectable()
export class NavigationBar {

    public displayNavigarion() {
        var nav = document.getElementById('navigation');
        nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0');
    }

    public displayDependentNavigation() {
        var nav = document.getElementById('navDependent');
        nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0');
    }

    public hideNavigation() {
        var nav = document.getElementById('navigation');
        var navDependent = document.getElementById('navDependent');
        nav?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0 d-none');
        navDependent?.setAttribute('class', 'navbar navbar-expand-lg bg-light p-0 d-none');
    }
}