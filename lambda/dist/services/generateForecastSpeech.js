"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateForecastSpeech = void 0;
const forecastApi_1 = require("../apis/forecastApi");
const geocodingApi_1 = require("../apis/geocodingApi");
const openAiApi_1 = require("../apis/openAiApi");
const handleDates_1 = require("./handleDates");
async function generateForecastSpeech(period, local) {
    const dateRange = (0, handleDates_1.calculateDateRange)(period);
    const { latitude, longitude } = await (0, geocodingApi_1.getCoordinates)(local);
    const forecastData = await (0, forecastApi_1.getForecastData)(latitude, longitude, dateRange);
    const speech = await (0, openAiApi_1.openAiApi)(JSON.stringify(forecastData));
    console.log("DATE RANGE", dateRange);
    console.log("LAT LONG", latitude, longitude);
    console.log("FORECAST DATA", forecastData);
    console.log("SPEECH", speech);
    return speech;
}
exports.generateForecastSpeech = generateForecastSpeech;
