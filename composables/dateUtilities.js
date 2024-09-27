import { isAfter, isSameDay, subDays } from 'date-fns';

export function humanReadableDate(comparisonDate) {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const aWeekAgo = subDays(today, 7);
    const twoWeeksAgo = subDays(today, 14);
    const threeWeeksAgo = subDays(today, 21);

    // Ensure comparisonDate is a Date object
    const compare = comparisonDate instanceof Date ? comparisonDate : new Date(comparisonDate);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    let result = '';

    if (isSameDay(compare, today)) {
        result = rtf.format(0, 'day'); // Correct usage of .format()
    } else if (isSameDay(compare, yesterday)) {
        result = rtf.format(-1, 'day'); // Correct usage of .format()
    } else if (isAfter(compare, aWeekAgo)) {
        const diffInTime = compare.getTime() - aWeekAgo.getTime();
        result = rtf.format(Math.round(diffInTime / (1000 * 3600 * 24)), 'day');
    } else if (isAfter(compare, twoWeeksAgo)) {
        result = rtf.format(-1, 'week');
    } else if (isAfter(compare, threeWeeksAgo)) {
        result = rtf.format(-2, 'week');
    }

    return `${result}`;
}
