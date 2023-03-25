import * as R from 'remeda';
import { format, parseISO } from 'date-fns/fp';

const BOOKING_ROOT = 'https://www.planyo.com/booking.php?planyo_lang=NO&mode=reserve&prefill=true';

export function createClickableBookingLink(date: string, time: string) {
  const dateNorwegian = R.pipe(date, parseISO, format('dd.MM.yyyy'));
  const weirdTime = time.replace(':30', '.5').replace(':00', '');

  return `${BOOKING_ROOT}&one_date=${dateNorwegian}&start_date=${dateNorwegian}&start_time=${weirdTime}&resource_id=189283',189283)`;
}
