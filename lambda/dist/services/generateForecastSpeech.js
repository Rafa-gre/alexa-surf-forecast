"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateForecastSpeech = void 0;
const geocodingApi_1 = require("../apis/geocodingApi");
const openAiApi_1 = require("../apis/openAiApi");
const forecastData_1 = require("./forecastData");
const handleDates_1 = require("./handleDates");
async function generateForecastSpeech(period, local, periodicity) {
    try {
        console.log("11111111111111111111111111", periodicity);
        const dateRange = (0, handleDates_1.calculateDateRange)(period);
        console.log("2222222222222222222222222", dateRange);
        const { latitude, longitude } = await (0, geocodingApi_1.getCoordinates)(local);
        console.log("AQUIIIIIIIIIII");
        const forecastData = await (0, forecastData_1.getForecastData)(latitude, longitude, dateRange, periodicity);
        console.log("FORECAST DATA", forecastData);
        const speech = await (0, openAiApi_1.openAiApi)(JSON.stringify(forecastData));
        console.log("DATE RANGE", dateRange);
        console.log("LAT LONG", latitude, longitude);
        console.log("FORECAST DATA", forecastData);
        console.log("SPEECH", speech);
        return speech;
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.generateForecastSpeech = generateForecastSpeech;
