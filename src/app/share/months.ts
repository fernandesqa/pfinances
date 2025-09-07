import { Injectable } from "@angular/core";

@Injectable()
export class Months {

    public convertMonthNameToMonthNumber(month: string) {
        var monthNumber = '0';

        switch(month) {
            case 'Janeiro':
                monthNumber = '1';
                break;
            case 'Fevereiro':
                monthNumber = '2';
                break;
            case 'Março':
                monthNumber = '3';
                break;
            case 'Abril':
                monthNumber = '4';
                break;
            case 'Maio':
                monthNumber = '5';
                break;
            case 'Junho':
                monthNumber = '6';
                break;
            case 'Julho':
                monthNumber = '7';
                break;
            case 'Agosto':
                monthNumber = '8';
                break;
            case 'Setembro':
                monthNumber = '9';
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