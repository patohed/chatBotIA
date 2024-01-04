const { addKeyword } = require("@bot-whatsapp/bot");
const axios = require("axios");

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

let GLOBAL_STATE = {}
module.exports =  addKeyword('retiro',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    await flowDynamic(`Puedes cancelar este proceso :❌Cancelar❌`)
})

.addAnswer('Comencemos con tu pedido... ¿Cuál es tu *nombre*?', {
    
    capture:true,
    
    

}, async (ctx, {endFlow}) => {

    if(ctx.body.toLowerCase() ==='Cancelar'.toLowerCase()){
        return endFlow(`Tu solicitud fue cancelada!`)
    }

    GLOBAL_STATE[ctx.from] = {
         
        "nombre": ctx.body,
        "pedido":"",
        "aclaraciones":"",
        
    }
})
.addAnswer('--- *Pedido* ---')
.addAnswer('¿Puedes describirme tu *pedido* completo?', {
    capture:true,

 },async (ctx, {endFlow}) => {

    if (ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){
    return endFlow(`Tu solicitud fue cancelada!`)

    }

    GLOBAL_STATE[ctx.from].pedido = ctx.body
})
.addAnswer('¿Tienes alguna aclaración?', {

    capture:true,

 },async (ctx, {endFlow}) => {

    if (ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){

        return endFlow(`Tu solicitud fue cancelada!`
    )}
    GLOBAL_STATE[ctx.from].aclaraciones = ctx.body
})
.addAnswer('--- 📝 Resumen 📝  ---',null, async (ctx, {flowDynamic}) => {

    const respuestaDeStrapi = await guardarTicket(GLOBAL_STATE[ctx.from])
    await flowDynamic(`Muchas gracias *${respuestaDeStrapi.data.data.attributes.nombre}*\nOrden #*${respuestaDeStrapi.data.data.id}`)
    await flowDynamic(`Te enviaremos el monto total a abonar a la brevedad!`)
   
    
    
    
        
})





/**Frig. Panero* les desea felices fiestas**/