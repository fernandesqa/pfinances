

export class DateTime {

    public getLocalDateTime() {
        const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const utcDate = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: timezoneName
        };
        
        const localTime = utcDate.toLocaleString('pt-BR', options);

        return localTime;
    }
}