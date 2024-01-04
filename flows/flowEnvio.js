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

const flujoEfectivo = addKeyword('##efectivo##').addAnswer('Te enviaremos a la brevedad el monto total a abonar, muchas gracias!')
const flujoMercado = addKeyword('##mercado##').addAnswer('Te enviaremos el link de pago en unos instantes, muchas gracias!')

let GLOBAL_STATE = {}
module.exports =  addKeyword('envio',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    await flowDynamic(`Puedes cancelar este proceso :❌Cancelar❌`)
})
.addAnswer('Comencemos con tu pedido... ¿Cuál es tu *nombre*?', {
    
    capture:true,


}, async (ctx, {endFlow}) => {

    if(ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){
        return endFlow(`Tu solicitud fue cancelada!`)
    }

    GLOBAL_STATE[ctx.from] = {
         
        "nombre": ctx.body,
        "calle": "",
        "pisodepto":"",
        "pedido":"",
        "aclaraciones":"",
        "pago":""
    }
})

.addAnswer('Un gusto !', 
    null, async (ctx, {flowDynamic}) => {
        
        const respuestaDeStrapi = await guardarTicket(GLOBAL_STATE[ctx.from])
        await flowDynamic(`Cuál es tu *dirección* ${respuestaDeStrapi.data.data.attributes.nombre}?\n\nRecuerda enviar esta información completa!`)
        
            
    })

.addAnswer('🏠 Ejemplo :_Jose Maria Paz 1111,Florida_ 🏠', 
{
   capture:true,
   delay:1000

}, async (ctx, {endFlow, fallBack}) => {

    if(ctx.body.toLowerCase()==='Cancelar'.toLowerCase()) {
        return endFlow(`Cancelaste tu solicitud de envio!`)
    }
    
    const verfNumeros = /\d/.test(ctx.body); 
    if(!verfNumeros){
        return fallBack()
    }

    GLOBAL_STATE[ctx.from].calle = ctx.body   
})

.addAnswer('¿Es correcta esta dirección?',{capture:true} , async(ctx, {flowDynamic}) => {
     
    if(ctx.body.toLowerCase()==='no'.toLowerCase()){
        await flowDynamic('Puedes *CORREGIR* tu dirección cuando pregunte, mas adelante, por las *ACLARACIONES*. Recuerdalo!')
    }

    const respuestaDeStrapi = await guardarTicket(GLOBAL_STATE[ctx.from])
    await flowDynamic(`La dirección ingresada es ${respuestaDeStrapi.data.data.attributes.calle}`)
    
        
})


.addAnswer('🏢¿PISO / DEPTO ...?🏢\nSi es una casa,simplemente contesta: "*No*"', {
    capture:true,
},async (ctx, {endFlow, flowDynamic}) => {

    if (ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){

    return endFlow()

    }
    GLOBAL_STATE[ctx.from].pisodepto = ctx.body

})
.addAnswer('--- *Pedido* ---')
.addAnswer('¿Puedes describirme tu *pedido* completo?', {
    capture:true,

 },async (ctx, {endFlow}) => {

    if (ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){
    return endFlow()

    }

    GLOBAL_STATE[ctx.from].pedido = ctx.body
})

.addAnswer('¿Tienes alguna aclaración?', {

    capture:true,

 },async (ctx, {endFlow}) => {

    if (ctx.body.toLowerCase() === 'Cancelar'.toLowerCase()){

        return endFlow(
    )}
    GLOBAL_STATE[ctx.from].aclaraciones = ctx.body
})

.addAnswer('--- 📝 Resumen 📝  ---', null, async (ctx, {flowDynamic}) => {
        
    const respuestaDeStrapi = await guardarTicket(GLOBAL_STATE[ctx.from])
    await flowDynamic(`Ordenaste: *_${respuestaDeStrapi.data.data.attributes.pedido}_*\n Aclaraciones:*_${respuestaDeStrapi.data.data.attributes.aclaraciones}_*`)

    
        
})
.addAnswer ('Recuerda que los horarios de nuestros repartos son de 15hs a 17hs... de pedido', {delay:800})
.addAnswer('Tu pedido se esta procesando...',null, async (ctx, {flowDynamic}) => {

const respuestaDeStrapi = await guardarTicket(GLOBAL_STATE[ctx.from])
await flowDynamic(`Muchas gracias *${respuestaDeStrapi.data.data.attributes.nombre}*\nOrden #*${respuestaDeStrapi.data.data.id}`)

    
})
.addAnswer('Para finalizar...¿cómo realizaras el pago? *Efectivo* o *Mercado Pago*?', {

    capture:true,
    delay:1400

    },async (ctx, { gotoFlow, fallBack}) => {

        
    if (ctx.body.toLowerCase() === 'Efectivo'.toLowerCase()){

    return gotoFlow(flujoEfectivo)
    
    }if (ctx.body.toLowerCase() === 'Mercado Pago'.toLowerCase()){ 
        
        
        return gotoFlow(flujoMercado)   
    }
    else {

        return fallBack()
        
}
    
}   
)