import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorage {

    public setUserId(userId: string) {
        localStorage.setItem('pFinancesUserId', userId);
    }

    public setUserName(userName: string) {
        localStorage.setItem('pFinancesUserName', userName);
    }

    public setRole(role: string) {
        localStorage.setItem('pFinancesRole', role);
    }

    public setUserEmailAddress(emailAddress: string) {
        localStorage.setItem('pFinancesUserEmailAddress', emailAddress);
    }

    public setFamilyId(familyId: string) {
        localStorage.setItem('pFinancesFamilyId', familyId);
    }

    public setAccessToken(accessToken: string) {
        localStorage.setItem('pFinancesAccessToken', accessToken);
    }

    public getUserId() {
        const userId = localStorage.getItem('pFinancesUserId');
        return userId;
    }

    public getUserName() {
        const userName = localStorage.getItem('pFinancesUserName');
        return userName;
    }

    public getRole() {
        const role = localStorage.getItem('pFinancesRole');
        return role;
    }

    public getUserEmailAddress() {
        const emailAddress = localStorage.getItem('pFinancesUserEmailAddress');
        return emailAddress;
    }

    public getFamilyId() {
        const familyId = localStorage.getItem('pFinancesFamilyId');
        return familyId;
    }

    public getAccessToken() {
        const accessToken = localStorage.getItem('pFinancesAccessToken');
        return accessToken;
    }

    public removeItems() {
        localStorage.removeItem('pFinancesAccessToken');
        localStorage.removeItem('pFinancesFamilyId');
        localStorage.removeItem('pFinancesRole');
        localStorage.removeItem('pFinancesUserEmailAddress');
        localStorage.removeItem('pFinancesUserId');
        localStorage.removeItem('pFinancesUserName');
    }
}