require('dotenv').config()
const {createBot,createProvider,createFlow,} = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const welcomeFlow = require("./flows/welcome.flow");
const vendedorFlow = require('./flows/vendedor.flow')
const expertoFlow = require('./flows/experto.flow')
const pagarFlow = require('./flows/pagar.flow')
const flowRetiro = require('./flows/flowRetiro')
const flowEnvio = require('./flows/flowEnvio')
const {init} = require('bot-ws-plugin-openai');
const ServerAPI = require('./http');



/**
 * Configuracion de Plugin
 */


const employeesAddonConfig = {
  model: "gpt-3.5-turbo-1106",
  temperature: 1,
  apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees([
  {
    name: "EMPLEADO_PAGAR",
    description:"[INSTRUCCIONES]: Un {usuario} iniciará una conversación. Debes {identificar} todos los intentos de {saludos} tradicionales del castellano y analizarlos para enviar una respuesta. ",
    flow: pagarFlow,
  },
  {
    name: "EMPLEADO_VENDEDOR",
    description:  "[INSTRUCCIONES]: Seras Rob el vendedor amable encargado de contestar SOLO si un {usuario} tiene la INTENCION de hacer un encargo, para eso debes analizar el mensaje enviado. Trabajas en una carniceria, ejemplos para comparar: - Quiero hacer un pedido - Hola, Quiero hacer un pedido - Queria encargar algo para retirar. Debes analizar el mensaje de {usuario} para determinar si es compatible con hacer un pedido en una tienda, de lo contrario, ignorarlo.",
    flow: vendedorFlow,
  },
  {
    name: "EMPLEADO_EXPERTO",
    description:"[INSTRUCCIONES]: [INSTRUCCIONES]: Compartirás info sobre {horarios} y {asistencia}. Comprende que {usuario} pedirá {horarios} o {asistencia}. Nuestros horarios: L-V 9-13 y 16-20, Sáb 9-13, Dom cerrados. Deberas comparar la hora local de Argentina con nuestros horarios y VERIFICAR si estamos cerrados o abiertos para contestar Example: En estos momentos no estamos abiertos, intenta mas tarde! siempre que nos hablen fuera del horario.  Asistencia: 2040-3030. Al responder a {usuario}, usa frases de 30 caracteres + Frigorífico Panero. También, si {usuario} pregunta sobre {lista de precios}, verifica y responde en 6 palabras. El {link} para VER {lista de precios}: www.frigorificopanero.com.ar. IMPORTANTE: Trabajas en una carnicería en Argentina. Al {usuario} agradecerte, responde amablemente.Deberas responder con un maximo de 30 caracteres. Example:{usuario}: Gracias; {respuesta}: A vos!; De nada!, Hasta pronto!, etc.",
    flow: expertoFlow, 
  },


])

/**
 * 
 */


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    welcomeFlow,
    vendedorFlow,
    expertoFlow,
    pagarFlow,
    flowRetiro,
    flowEnvio,
    
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  const httpServer = new ServerAPI(adapterProvider, adapterDB)
  
  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
    
  }
  const listaNegra =  [
    '5491135810868',     // proveedor 
    '573xxxxxxxx',     // nnnn
    '573xxxxxxxx',      // mmmm
    '573xxxxxxxx'      // cccc
];
  {blackList: listaNegra }
  
  const configExtra = {
    extensions:{
      employeesAddon
    }
  }
  
  await createBot(configBot,configExtra);
  httpServer.start()
  
};

main();
