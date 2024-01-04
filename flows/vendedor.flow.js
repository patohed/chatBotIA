const { addKeyword, addAnswer, gotoFlow } = require("@bot-whatsapp/bot");
const axios = require("axios");
const flowRetiro = require('./flowRetiro')
const flowEnvio = require('./flowEnvio')

/**
 * FLujo Inteligente (va a ser activado por una intencion de una persona o por palabra clave)
 * Flujo de bienvenida
 */

const flujoMercado = addKeyword('###mercado')
.addAnswer('Generando link...te lo enviaremos a la brevedad.')

const flujoEfectivo = addKeyword('##efectivo')
.addAnswer('Estupendo, ha finalizado correctamente tu pedido !\n\nCualquier duda estaré aquí!')

const guardarTicket =  async (datosEntrantes) => {

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://strapi-production-aa8ff.up.railway.app/api/tickets',
    headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer 30db8a21ba0d8a5e36ef05afa7f7a3f896dfb95f9d37a6118c9bd1b72364912a3086af4aa79d5be77377b7f0125f79cc2a827cad7ffcd025ac47f2fe70140f1b2127a4e75d825424b907b67151f6d425811c9122e1fca7f985e483735b4559167df2f81ecca19109de689f26445b2b164439ebe4131f21e9b74b445e99146023'},
    data : JSON.stringify({
    "data": datosEntrantes,
    
    })
    };
    
    return axios.request(config) 
}
    
module.exports =  addKeyword('vendedor',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    await flowDynamic(`Sigue el flujo de conversación⬇️\nPuedes cancelar este proceso :❌Cancelar❌\n*Frig.Panero*🐄`)
})

.addAnswer('¿Es para envio o retiro en el local?', {

    capture:true,

 },async(ctx, {endFlow, gotoFlow, fallBack}) => {

    if(ctx.body.toLowerCase() ==='Cancelar'.toLowerCase()){
        return endFlow(`Tu solicitud fue cancelada!`)
    }
    if (ctx.body.includes('retiro') || ctx.body.includes('local'))
    {
        return gotoFlow(flowRetiro)
    }
    else if (ctx.body.includes('envio')) {
        return gotoFlow(flowEnvio)
    }
    else {return fallBack(`Ingrese una opcion correcta`)}
    
})




