import { addDays, startOfWeek, endOfWeek, nextSaturday, nextSunday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface DateRange {
  start: Date;
  end: Date;
}

const dateRanges: Record<string, (today: Date) => DateRange> = {
  'amanhã': (today) => ({ start: addDays(today, 1), end: addDays(today, 1) }),
  'hoje': (today) => ({ start: today, end: today }),
  'fim de semana': (today) => ({ start: nextSaturday(today), end: nextSunday(today) }),
  'esta semana': (today) => ({ start: today, end: endOfWeek(today) }),
  'semana que vem': (today) => ({ start: startOfWeek(addDays(today, 7)), end: endOfWeek(addDays(today, 7)) }),
};

export function calculateDateRange(period: string): DateRange {

  const saoPauloTz = 'America/Sao_Paulo';
  const nowUTC = new Date();
  const today = utcToZonedTime(nowUTC, saoPauloTz);
  const lowerCasePeriod = period.toLowerCase();

  if (dateRanges.hasOwnProperty(lowerCasePeriod)) {
    return dateRanges[lowerCasePeriod](today);
  } else {
    throw new Error('Opção de período inválida');
  }
}
