import { NavigationBar } from "./navigation-bar";
import { LocalStorage } from "./local-storage";

export function checkRole() {
    var navigationBar = new NavigationBar;
    var localStorage = new LocalStorage;
    var role = localStorage.getRole();
    if(role=='1') {
        navigationBar.displayNavigarion();
    } else if(role=='2') {
        navigationBar.displayDependentNavigation();
    }
}