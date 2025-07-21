export function numberToMonth(n: string): string {
    const months = [
        '', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'HKs month'
    ];
    
    const index = parseInt(n, 10);

    if (isNaN(index) || index < 0 || index >= months.length) {
        return 'Invalid month';
    }

    return months[index];
}