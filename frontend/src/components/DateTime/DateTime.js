import React from 'react';

// Setting default props for the DateTime component
DateTime.defaultProps = {
    options: {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    },
};

export default function DateTime({
    date,
    options: { weekday, year, month, day, hour, minute, second },
}) {
    // Get the current locale for the DateTime formatting
    const currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

    // Function to handle the date parsing and formatting
    const getDate = () => {
        // Attempt to parse the provided date
        const parsedDate = Date.parse(date);
        
        // If the date is invalid (NaN), return an error message
        if (isNaN(parsedDate)) {
            return <span>Invalid Date</span>; // Handle invalid date
        }

        // If valid, format the date according to the provided options
        const dateFormatter = new Intl.DateTimeFormat(currentLocale, {
            year,
            month,
            weekday,
            day,
            hour,
            minute,
            second,
        });

        return dateFormatter.format(parsedDate); // Return the formatted date
    };

    // Return the formatted date or the "Invalid Date" message
    return <>{getDate()}</>;
}
