/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk');
const { generateForecastSpeech } = require('./dist/services/generateForecastSpeech');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "E aí surfista! Bem-vindo à Previsão de Ondas. Quer saber como estão as ondas? Pergunte-me sobre o período e local, como 'Como estão as ondas amanhã em Maresias?'";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SurfForecastIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SurfForecastIntent';
    },
    async handle(handlerInput) {
        console.log("LOCAL", handlerInput.requestEnvelope.request.intent.slots['local'].value)

        const periodSlotValue = handlerInput.requestEnvelope.request.intent.slots['period'].value || 'Hoje';
        const localSlotValue = handlerInput.requestEnvelope.request.intent.slots['local'].value
        
        try {
            await callDirectiveService(handlerInput);
          } catch (err) {
            console.log("error : " + err);
          }

        try {
            let speech 

            if (periodSlotValue === 'esta semana' || periodSlotValue === 'semana que vem') {
                speech = await generateForecastSpeech(periodSlotValue, localSlotValue, 'daily');
            } else {
                speech = await generateForecastSpeech(periodSlotValue, localSlotValue, 'hourly');
            }
            console.log("SPEECH",speech)
            return handlerInput.responseBuilder
                .speak(speech)
                .getResponse();
        } catch (err) {
            console.log("error : " + err);
            return handlerInput.responseBuilder
                .speak("Xiii, deu ruim! Tente novamente!")
                .getResponse();
        }    
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Claro, surfista! Aqui estão algumas coisas que você pode perguntar:\n\n" +
        " - 'Como estão as ondas amanhã em Maresias?'\n" +
        " - 'Qual a previsão do surf no fim de semana em Itamambuca?'\n" +
        " - 'Diga-me sobre as condições do mar para hoje em Itacaré.'\n\n" +
        "Lembre-se, estou aqui para te ajudar a obter as informações mais recentes sobre as ondas. Só perguntar e bora surfar!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = "Valeu, brou! Se precisar de mais informações sobre as ondas, é só perguntar. Até mais e boas ondas!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Desculpe, não consegui entender completamente sua pergunta sobre as ondas. Que tal tentar novamente ou perguntar de uma maneira diferente? Estou aqui para ajudar você a pegar as melhores ondas!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Posso ajudar com mais alguma coisa?")
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Xiiii, deu ruim. Tente novamente!';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function callDirectiveService(handlerInput) {
    const requestEnvelope = handlerInput.requestEnvelope;
    
    const requestId = requestEnvelope.request.requestId;
    const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();
  
    const directive = {
      header: {
        requestId,
      },
      directive: {
        type: "VoicePlayer.Speak",
        speech: "Fala Surfer, Estou checando a previsão, Aguarde...",
      },
    };
    console.log("DIRECTIVE END", directive)
    return directiveServiceClient.enqueue(directive);
  }

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SurfForecastIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();