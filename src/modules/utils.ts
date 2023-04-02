import dayjs from 'dayjs';

export const tableFormatTimeDisplay = (timeString: string | Date) => {
  return dayjs.utc(timeString).tz(process.env.NEXT_PUBLIC_TIMEZONE).format('MMM DD, YYYY');
};

export const PHpeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'PHP',
});

export const capFirstLetters = (str: string) => {
  const arr = str.split(' ');

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(' ');
};
