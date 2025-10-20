import { Injectable } from "@angular/core";

@Injectable()
export class Years {

    public getLastYears(qtd: number) {
        var years: string[] = [];
        const date: Date = new Date;
        var past: number = 0;

        for(var i=0; i<qtd; i++) {
            if(i==0) {
                years.push(date.getFullYear().toString());
            } else {
                past = date.getFullYear()-i;
                years.push(past.toString());
            }
        }

        return years;
    }

    public getBillingYears() {
        var years: string[] = [];
        const date: Date = new Date;
        var current: number = 0;
        var past: number = 0;
        var counter = -2;
        for(var i=6; i>0; i--) {
            counter = counter + 1;
            if(i==6) {
                let nextYear = date.getFullYear() + 1;
                years.push(nextYear.toString());
            } else if(i==5) {
                current = date.getFullYear();
                years.push(current.toString());
            } else {
                past = date.getFullYear()-counter;
                years.push(past.toString());
            }
        }

        return years;
    }

    public getFutureBillingYears() {
        var years: string[] = [];
        const date: Date = new Date;
        for(var i=0; i<35; i++) {
            if(i==0) {
                years.push(date.getFullYear().toString());
            } else {
                let future = date.getFullYear()+i;
                years.push(future.toString());
            }
        }

        return years;
    }
}