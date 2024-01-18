"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDateRange = void 0;
const date_fns_1 = require("date-fns");
const dateRanges = {
    'amanhã': (today) => ({ start: (0, date_fns_1.addDays)(today, 1), end: (0, date_fns_1.addDays)(today, 1) }),
    'hoje': (today) => ({ start: today, end: today }),
    'fim de semana': (today) => ({ start: (0, date_fns_1.startOfWeek)(today, { weekStartsOn: 6 }), end: (0, date_fns_1.endOfWeek)(today, { weekStartsOn: 6 }) }),
    'esta semana': (today) => ({ start: (0, date_fns_1.startOfWeek)(today), end: (0, date_fns_1.endOfWeek)(today) }),
    'semana que vem': (today) => ({ start: (0, date_fns_1.startOfWeek)((0, date_fns_1.addDays)(today, 7)), end: (0, date_fns_1.endOfWeek)((0, date_fns_1.addDays)(today, 7)) }),
};
function calculateDateRange(period) {
    const today = new Date();
    const lowerCasePeriod = period.toLowerCase();
    if (dateRanges.hasOwnProperty(lowerCasePeriod)) {
        return dateRanges[lowerCasePeriod](today);
    }
    else {
        throw new Error('Opção de período inválida');
    }
}
exports.calculateDateRange = calculateDateRange;
