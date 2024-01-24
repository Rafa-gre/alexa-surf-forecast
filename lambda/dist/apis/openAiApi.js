"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAiApi = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.OPENAI_API_KEY;
const orgId = process.env.OPENAI_ORG_ID;
const openai = new openai_1.default({ apiKey, organization: orgId });
async function openAiApi(content) {
    var _a;
    const prompt = `
  Gere uma previsão de surf personalizada com base nos dados fornecidos de no máximo 3000 tokens.
  Mencione o período da previsão (hoje, amanhã, fim de semana, esta semana, semana que vem) sendo hoje = ${new Date().toISOString()}.
  Caso os dados forem referentes a mais de um dia, divida a previsão por dias.
  Os dados de previsão do vento são dados em nós (knots).
  Se os dados fornecidos forem referentes a somente um dia, divida a previsão pelos turnos da manhã e tarde.
  Utilize uma linguagem descontraída e autêntica, como se estivesse dando a previsão para um surfista ansioso para pegar umas ondas.
  Arredonde os valores para tornar mais amigável com 1 casa apenas depois da virgula.
  No Brasil as ondas variam entre 0.2m e 2.5m então ondas acima de 1m já são consideradas com um bom tamanho pro surf.
  customize os adjetivos de acordo com o tamanho das ondas e a velocidade do vento, se as ondas forem pequenas utilizar adjetivos negativos caso contrario utilizar adjetivos positivos.
  É importante que fale de todos os dados que recebeu (tamanho, direção período, velocidade do vento e direção do vento)
  Caso os dados entre os turnos da manhã e da tarde nao forem muito diferentes apenas mencionar que as condições nao mudam para tarde.
  O texto gerado será transformado em audio eletronicamente, portanto deve ser um texto fluído sem tabelas ou bullet points.
  Seguem os dados: ${content}`;
    const params = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        n: 1,
        temperature: 0.7
    };
    const chatCompletion = await openai.chat.completions.create(params);
    return (_a = chatCompletion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
}
exports.openAiApi = openAiApi;
// const data = [
//   {
//     time: '2024-01-17T00:00:00.000Z',
//     temperature: 26.924501419067383,
//     precipitationProbability: 0,
//     windSpeed: 5.804825305938721,
//     windDirection: 330.2552185058594,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 127,
//     wavePeriod: 7.199999809265137
//   },
//   {
//     time: '2024-01-17T03:00:00.000Z',
//     temperature: 26.524499893188477,
//     precipitationProbability: 0,
//     windSpeed: 6.369049549102783,
//     windDirection: 325.71307373046875,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 128,
//     wavePeriod: 7.349999904632568
//   },
//   {
//     time: '2024-01-17T06:00:00.000Z',
//     temperature: 26.774499893188477,
//     precipitationProbability: 0,
//     windSpeed: 6.193674087524414,
//     windDirection: 313.53125,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 129,
//     wavePeriod: 7.599999904632568
//   },
//   {
//     time: '2024-01-17T09:00:00.000Z',
//     temperature: 26.324501037597656,
//     precipitationProbability: 0,
//     windSpeed: 7.289444923400879,
//     windDirection: 312.27362060546875,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 130,
//     wavePeriod: 7.800000190734863
//   },
//   {
//     time: '2024-01-17T12:00:00.000Z',
//     temperature: 26.074501037597656,
//     precipitationProbability: 0,
//     windSpeed: 7.199999809265137,
//     windDirection: 311.1858215332031,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 132,
//     wavePeriod: 8
//   },
//   {
//     time: '2024-01-17T15:00:00.000Z',
//     temperature: 25.924501419067383,
//     precipitationProbability: 0,
//     windSpeed: 6.792466163635254,
//     windDirection: 308.6598205566406,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 133,
//     wavePeriod: 8.199999809265137
//   },
//   {
//     time: '2024-01-17T18:00:00.000Z',
//     temperature: 25.774499893188477,
//     precipitationProbability: 0,
//     windSpeed: 6.877789497375488,
//     windDirection: 321.3401794433594,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 135,
//     wavePeriod: 8.399999618530273
//   },
//   {
//     time: '2024-01-17T21:00:00.000Z',
//     temperature: 27.274499893188477,
//     precipitationProbability: 0,
//     windSpeed: 7.145795822143555,
//     windDirection: 320.82635498046875,
//     waveHeight: 0.20000000298023224,
//     waveDirection: 136,
//     wavePeriod: 8.550000190734863
//   }
// ]
// async function teste() {
//   const result = await openAiApi(JSON.stringify(data));
//   console.log(result);
// }
// teste()
