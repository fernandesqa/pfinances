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
}