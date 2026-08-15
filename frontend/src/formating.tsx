

export const formatLastUsed = (isoString: string) => {
    if (!isoString) return 'Never used';

    const date = new Date(isoString);
    const now = new Date();

    // Difference in seconds
    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));

    // 'always' forces "1 day ago" / "2 days ago"
    // 'auto' converts -1 day to "yesterday"
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    // diffInDays will be negative for past dates
    return `Last used ${rtf.format(diffInDays, 'day')}`;
}

export const formatLastCleaned = (isoString: string) => {
    if (!isoString) return 'Never cleaned';

    const date = new Date(isoString);
    const now = new Date();

    // Difference in seconds
    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));

    // 'always' forces "1 day ago" / "2 days ago"
    // 'auto' converts -1 day to "yesterday"
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    // diffInDays will be negative for past dates
    return `Last cleaned ${rtf.format(diffInDays, 'day')}`;
}



export const formatDateOpened = (isoString: string) => {
    if (!isoString) return 'Never opened';

    const date = new Date(isoString);
    const now = new Date();

    // Difference in seconds
    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));

    // 'always' forces "1 day ago" / "2 days ago"
    // 'auto' converts -1 day to "yesterday"
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    // diffInDays will be negative for past dates
    return `Opened ${rtf.format(diffInDays, 'day')}`;
}