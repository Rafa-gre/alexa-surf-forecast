"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinates = void 0;
const axios_1 = __importDefault(require("axios"));
const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';
async function getCoordinates(place) {
    try {
        const response = await axios_1.default.get(apiUrl, {
            params: {
                name: place,
                count: 1,
                language: 'pt',
            }
        });
        if (response.data.results.length < 1) {
            throw new Error('Place not found');
        }
        return {
            latitude: response.data.results[0].latitude,
            longitude: response.data.results[0].longitude
        };
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.getCoordinates = getCoordinates;
