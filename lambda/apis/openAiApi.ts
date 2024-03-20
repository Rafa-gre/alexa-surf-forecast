import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();


const apiKey = process.env.OPENAI_API_KEY;
const orgId = process.env.OPENAI_ORG_ID;


const openai = new OpenAI({apiKey, organization: orgId});



export async function openAiApi(content: string): Promise<string | null> {
const today = new Date().toISOString()
const todayLocale = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
console.log("TODAY", today)
console.log("TODAY LOCALE", todayLocale)
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
  Seguem os dados: ${content}`
  

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    n: 1,
    temperature: 0.7
  };
  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
  return chatCompletion.choices[0].message?.content
}
