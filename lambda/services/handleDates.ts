import { addDays, startOfWeek, endOfWeek } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
}

const dateRanges: Record<string, (today: Date) => DateRange> = {
  'amanhã': (today) => ({ start: addDays(today, 1), end: addDays(today, 1) }),
  'hoje': (today) => ({ start: today, end: today }),
  'fim de semana': (today) => ({ start: startOfWeek(today, { weekStartsOn: 6 }), end: endOfWeek(today, { weekStartsOn: 6 }) }),
  'esta semana': (today) => ({ start: startOfWeek(today), end: endOfWeek(today) }),
  'semana que vem': (today) => ({ start: startOfWeek(addDays(today, 7)), end: endOfWeek(addDays(today, 7)) }),
};

export function calculateDateRange(period: string): DateRange {
  const today = new Date();
  const lowerCasePeriod = period.toLowerCase();

  if (dateRanges.hasOwnProperty(lowerCasePeriod)) {
    return dateRanges[lowerCasePeriod](today);
  } else {
    throw new Error('Opção de período inválida');
  }
}