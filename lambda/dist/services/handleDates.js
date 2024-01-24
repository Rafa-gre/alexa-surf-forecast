"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDateRange = void 0;
const date_fns_1 = require("date-fns");
const dateRanges = {
    'amanhã': (today) => ({ start: (0, date_fns_1.addDays)(today, 1), end: (0, date_fns_1.addDays)(today, 1) }),
    'hoje': (today) => ({ start: today, end: today }),
    'fim de semana': (today) => ({ start: (0, date_fns_1.nextSaturday)(today), end: (0, date_fns_1.nextSunday)(today) }),
    'esta semana': (today) => ({ start: today, end: (0, date_fns_1.endOfWeek)(today) }),
    'semana que vem': (today) => ({ start: (0, date_fns_1.startOfWeek)((0, date_fns_1.addDays)(today, 7)), end: (0, date_fns_1.endOfWeek)((0, date_fns_1.addDays)(today, 7)) }),
};
function calculateDateRange(period) {
    const today = (0, date_fns_1.subHours)(new Date(), 3); //timezone ;
    const lowerCasePeriod = period.toLowerCase();
    if (dateRanges.hasOwnProperty(lowerCasePeriod)) {
        return dateRanges[lowerCasePeriod](today);
    }
    else {
        throw new Error('Opção de período inválida');
    }
}
exports.calculateDateRange = calculateDateRange;
