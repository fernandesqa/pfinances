import { Injectable } from "@angular/core";

@Injectable()
export class Months {

    public convertMonthNameToMonthNumber(month: string) {
        var monthNumber = '0';

        switch(month) {
            case 'Janeiro':
                monthNumber = '01';
                break;
            case 'Fevereiro':
                monthNumber = '02';
                break;
            case 'Março':
                monthNumber = '03';
                break;
            case 'Abril':
                monthNumber = '04';
                break;
            case 'Maio':
                monthNumber = '05';
                break;
            case 'Junho':
                monthNumber = '06';
                break;
            case 'Julho':
                monthNumber = '07';
                break;
            case 'Agosto':
                monthNumber = '08';
                break;
            case 'Setembro':
                monthNumber = '09';
                break;
            case 'Outubro':
                monthNumber = '10';
                break;
            case 'Novembro':
                monthNumber = '11';
                break;
            default:
                monthNumber = '12';
                break; 
        }

        return monthNumber;
    }
}