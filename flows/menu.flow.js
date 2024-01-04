const { addKeyword } = require("@bot-whatsapp/bot");
const { WAConnection, MessageType } = require('@adiwajshing/baileys');

module.exports =  addKeyword('menu',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    await flowDynamic(`asdasdasdasdasd`)
})


