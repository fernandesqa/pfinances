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

    public convertMonthNumberToMonthName(month: string) {

        var monthName = '';
        
        switch(month) {
            case '01':
                monthName = 'Janeiro';
                break;
            case '02':
                monthName = 'Fevereiro';
                break;
            case '03':
                monthName = 'Março';
                break;
            case '04':
                monthName = 'Abril';
                break;
            case '05':
                monthName = 'Maio';
                break;
            case '06':
                monthName = 'Junho';
                break;
            case '07':
                monthName = 'Julho';
                break;
            case '08':
                monthName = 'Agosto';
                break;
            case '09':
                monthName = 'Setembro';
                break;
            case '10':
                monthName = 'Outubro';
                break;
            case '11':
                monthName = 'Novembro';
                break;
            default:
                monthName = 'Dezembro';
                break;
                
        }

        return monthName;
    }

    public getMonthsList() {
        var months: string[] = [];
        months.push(
            "Janeiro", 
            "Fevereiro", 
            "Março", 
            "Abril", 
            "Maio", 
            "Junho", 
            "Julho", 
            "Agosto", 
            "Setembro", 
            "Outubro", 
            "Novembro", 
            "Dezembro"
        );
        return months;
    }
}