import { Injectable } from "@angular/core";

@Injectable()
export class Monetary {

    public convertToMonetary(value: string) {

        var monetaryValue = '';

        if(value==null) {
            monetaryValue = 'R$ 0,00';
        } else {
            switch(value.length) {
                case 4:
                    monetaryValue = 'R$ '+value.replace('.', ',')+'0';
                    console.log(monetaryValue);
                    break;
                case 5:
                    monetaryValue = 'R$ '+value.replace('.', ',');
                    if(monetaryValue.substring(6, 7)==',') {
                        monetaryValue = monetaryValue+'0';
                    }
                    break;
                case 6:
                    monetaryValue = 'R$ '+value.replace('.', ',');
                    if(monetaryValue.substring(7, 8)==',') {
                        monetaryValue = monetaryValue.substring(0, 3)+monetaryValue.substring(4, 5)+'.'+monetaryValue.substring(4, 9)+'0';
                    }
                    break;
                case 7:
                    if(value.substring(5,6)=='.') {
                        monetaryValue = 'R$ '+value.substring(0, 2)+'.'+value.substring(2, 7).replace('.', ',')+'0';
                    } else {
                        monetaryValue = 'R$ '+value.substring(0, 1)+'.'+value.substring(1, 7).replace('.', ',')
                    }
                    
                    break;
                case 8:
                    if (value.substring(6, 7)=='.') {
                        monetaryValue = 'R$ '+value.substring(0, 3)+'.'+value.substring(3, 8).replace('.', ',')+'0';
                        break;
                    } else {
                        monetaryValue = 'R$ '+value.substring(0, 2)+'.'+value.substring(2, 8).replace('.', ',');
                        break;
                    }
                case 9:
                     if (value.substring(7, 8)=='.') {
                        monetaryValue = 'R$ '+value.substring(0, 1)+'.'+value.substring(1, 4)+'.'+value.substring(4, 9).replace('.', ',')+'0';
                        break;
                    } else {
                        monetaryValue = 'R$ '+value.substring(0, 3)+'.'+value.substring(3, 9).replace('.', ',');
                        break;
                    }
                case 10:
                    monetaryValue = 'R$ '+value.substring(0, 1)+'.'+value.substring(1, 4)+'.'+value.substring(4, 10).replace('.', ',');
                        break;
            }
            
        }

        return monetaryValue;
    }

    public convertFromMonetaryToNumber(value: string) {

        var newValue = '';
        
        if(value.includes('R$')) {
            newValue = value.split('R$ ')[1];
            var removeDots = newValue.split('.');
            newValue = '';
            for(var i=0; i<removeDots.length; i++) {
                if(removeDots[i]!='.') {
                    if(i==0){
                        newValue = removeDots[i];
                    } else {
                        newValue = newValue + removeDots[i];
                    }
                }
            }
            newValue = newValue.replace(',', '.');
        } else {
            var removeDots = newValue.split('.');

            for(var i=0; i<removeDots.length; i++) {
                if(removeDots[i]!='.') {
                    if(i==0){
                        newValue = removeDots[i];
                    } else {
                        newValue = newValue + removeDots[i];
                    }
                }
            }
            newValue = newValue.replace(',', '.');
        }
        
        return newValue;
    }

}