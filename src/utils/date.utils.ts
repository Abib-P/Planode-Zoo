export function parseDate(dateString: string) {
    
    if (dateString.includes('/')) {
        const str = dateString.split('/');

        const year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);

        return new Date(year, month, date);
    }
    const timestamp = Date.parse(dateString);
    return isNaN(timestamp) ? null : new Date(timestamp);

}
