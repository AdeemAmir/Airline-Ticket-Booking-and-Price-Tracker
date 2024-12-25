/**
 * Formats a date into a readable format without the timezone.
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export function fDate(date) {
    const y = new Date(date).toLocaleString([], {
        weekday: 'short',
        month: 'short',  
        day: '2-digit',  
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    });
    return y;
}
