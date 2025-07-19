import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorage {

    public getRole() {
        const role = localStorage.getItem('pFinancesRole');
        return role;
    }
}