"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateForecastSpeech = void 0;
const geocodingApi_1 = require("../apis/geocodingApi");
const openAiApi_1 = require("../apis/openAiApi");
const forecastData_1 = require("./forecastData");
const handleDates_1 = require("./handleDates");
async function generateForecastSpeech(period, local, periodicity) {
    try {
        const dateRange = (0, handleDates_1.calculateDateRange)(period);
        const { latitude, longitude } = await (0, geocodingApi_1.getCoordinates)(local);
        const forecastData = await (0, forecastData_1.getForecastData)(latitude, longitude, dateRange, periodicity);
        const speech = await (0, openAiApi_1.openAiApi)(JSON.stringify(forecastData));
        return speech;
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.generateForecastSpeech = generateForecastSpeech;
