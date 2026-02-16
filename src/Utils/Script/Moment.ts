/**
 * Moment Framework Testing
 */

import moment from 'moment-timezone';

const currentDate = moment();

// ==================== MOMENT.JS POPULAR USAGE EXAMPLES ====================

// Basic Current Date/Time
console.log('\n--- Basic Date/Time ---');
console.log('Current Date and Time:', moment().format('YYYY-MM-DD HH:mm:ss'));
console.log(
  'Current Date in New York:',
  moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss'),
);
console.log(
  'Current Date in UTC:',
  moment().utc().format('YYYY-MM-DD HH:mm:ss'),
);

// Basic Arithmetic
console.log('\n--- Date Arithmetic ---');
console.log('Add 7 days:', moment().add(7, 'days').format('YYYY-MM-DD'));
console.log(
  'Subtract 3 hours:',
  moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
);
console.log('Add 2 months:', moment().add(2, 'months').format('YYYY-MM-DD'));
console.log(
  'Subtract 1 year:',
  moment().subtract(1, 'year').format('YYYY-MM-DD'),
);

// Date Properties & Checks
console.log('\n--- Date Properties ---');
console.log('Is 2024 a leap year?', moment('2024-02-29').isLeapYear());
console.log('Days in current month:', moment().daysInMonth());
console.log(
  'Start of the month:',
  moment().startOf('month').format('YYYY-MM-DD'),
);
console.log('End of the year:', moment().endOf('year').format('YYYY-MM-DD'));

// Date Differences
console.log('\n--- Date Differences ---');
console.log(
  'Difference between two dates in days:',
  moment('2024-12-31').diff(moment('2024-01-01'), 'days'),
);
console.log(
  'Hours until end of day:',
  moment().endOf('day').diff(moment(), 'hours'),
);

// Formatting Examples
console.log('\n--- Formatting Examples ---');
console.log(
  'Formatted Date:',
  moment('2024-06-15T14:30:00Z').format('MMMM Do YYYY, h:mm:ss a'),
);
console.log('ISO Format:', moment().toISOString());
console.log('Short Format:', moment().format('MMM DD, YYYY'));

// ==================== COMPREHENSIVE USAGE EXAMPLES ====================

// Parsing different date formats
console.log('\n--- Parsing Dates ---');
console.log(
  'Parse ISO string:',
  moment('2024-10-24T15:30:00Z').format('YYYY-MM-DD HH:mm:ss'),
);
console.log(
  'Parse specific format:',
  moment('24/10/2024', 'DD/MM/YYYY').format('YYYY-MM-DD'),
);
console.log(
  'Parse timestamp:',
  moment(1729782600000).format('YYYY-MM-DD HH:mm:ss'),
);

// Validation
console.log('\n--- Validation ---');
console.log('Is valid date:', moment('2024-13-45').isValid());
console.log(
  'Is valid format:',
  moment('24/10/2024', 'DD/MM/YYYY', true).isValid(),
);

// Comparisons
console.log('\n--- Date Comparisons ---');
const date1 = moment('2024-10-24');
const date2 = moment('2024-10-25');
console.log('Is before:', date1.isBefore(date2));
console.log('Is after:', date1.isAfter(date2));
console.log('Is same:', date1.isSame(date2));
console.log('Is same day:', date1.isSame(date2, 'day'));
console.log(
  'Is between:',
  moment('2024-10-24').isBetween('2024-10-23', '2024-10-25'),
);

// Getting specific parts
console.log('\n--- Getting Date Parts ---');
console.log('Year:', currentDate.year());
console.log('Month (0-11):', currentDate.month());
console.log('Date:', currentDate.date());
console.log('Day of week (0-6):', currentDate.day());
console.log('Day of year:', currentDate.dayOfYear());
console.log('Week of year:', currentDate.week());
console.log('Quarter:', currentDate.quarter());

// Setting specific parts
console.log('\n--- Setting Date Parts ---');
console.log('Set year to 2025:', moment().year(2025).format('YYYY-MM-DD'));
console.log('Set month to December:', moment().month(11).format('YYYY-MM-DD'));
console.log('Set date to 15th:', moment().date(15).format('YYYY-MM-DD'));

// Relative time
console.log('\n--- Relative Time ---');
console.log('From now:', moment().subtract(2, 'hours').fromNow());
console.log('To now:', moment().add(3, 'days').toNow());
console.log(
  'From specific date:',
  moment('2024-01-01').from(moment('2024-06-15')),
);

// Duration calculations
console.log('\n--- Duration ---');
const duration = moment.duration(
  moment('2024-12-31').diff(moment('2024-01-01')),
);
console.log('Duration in days:', duration.asDays());
console.log('Duration in hours:', duration.asHours());
console.log('Duration humanized:', duration.humanize());

// Calendar time
console.log('\n--- Calendar Time ---');
console.log('Calendar today:', moment().calendar());
console.log('Calendar yesterday:', moment().subtract(1, 'day').calendar());
console.log('Calendar tomorrow:', moment().add(1, 'day').calendar());

// Common date operations
console.log('\n--- Common Operations ---');
console.log(
  'Start of day:',
  moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
);
console.log('End of day:', moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
console.log('Start of week:', moment().startOf('week').format('YYYY-MM-DD'));
console.log('End of week:', moment().endOf('week').format('YYYY-MM-DD'));
console.log(
  'Start of quarter:',
  moment().startOf('quarter').format('YYYY-MM-DD'),
);
console.log('End of quarter:', moment().endOf('quarter').format('YYYY-MM-DD'));

// Working with different timezones
console.log('\n--- Timezone Operations ---');
console.log(
  'London time:',
  moment().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss z'),
);
console.log(
  'Tokyo time:',
  moment().tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss z'),
);
console.log('UTC time:', moment().utc().format('YYYY-MM-DD HH:mm:ss'));
console.log('Local time:', moment().local().format('YYYY-MM-DD HH:mm:ss'));

// Useful formatting patterns
console.log('\n--- Formatting Patterns ---');
console.log('ISO format:', moment().toISOString());
console.log('JSON format:', moment().toJSON());
console.log('Unix timestamp:', moment().unix());
console.log('Milliseconds timestamp:', moment().valueOf());
console.log('Date object:', moment().toDate());
console.log('Custom format:', moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
console.log('Short format:', moment().format('MMM DD, YYYY'));
console.log('Time only:', moment().format('HH:mm:ss'));

// Business days and weekends
console.log('\n--- Business Days ---');
console.log('Is weekend:', moment().day() === 0 || moment().day() === 6);
console.log('Is weekday:', moment().day() >= 1 && moment().day() <= 5);
console.log(
  'Next Monday:',
  moment().day(1).add(1, 'week').format('YYYY-MM-DD'),
);
console.log(
  'Previous Friday:',
  moment().day(5).subtract(1, 'week').format('YYYY-MM-DD'),
);

// Array of dates
console.log('\n--- Working with Date Arrays ---');
const dates = ['2024-10-20', '2024-10-25', '2024-10-22'];
const sortedDates = dates.map((d) => moment(d)).sort((a, b) => a.diff(b));
console.log(
  'Sorted dates:',
  sortedDates.map((d) => d.format('YYYY-MM-DD')),
);

// Age calculation
console.log('\n--- Age Calculation ---');
const birthDate = moment('1990-05-15');
const age = moment().diff(birthDate, 'years');
console.log(`Age from ${birthDate.format('YYYY-MM-DD')}:`, age, 'years old');

// Working hours calculation
console.log('\n--- Working Hours ---');
const startWork = moment().hour(9).minute(0).second(0);
const endWork = moment().hour(17).minute(30).second(0);
const workDuration = moment.duration(endWork.diff(startWork));
console.log('Work hours today:', workDuration.asHours(), 'hours');
