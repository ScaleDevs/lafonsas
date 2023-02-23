import dayjs from 'dayjs';

export const tableFormatTimeDisplay = (timeString: string | Date) => {
  return dayjs.utc(timeString).tz(process.env.NEXT_PUBLIC_TIMEZONE).format('MMM DD, YYYY');
};

export const PHpeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'PHP',
});
