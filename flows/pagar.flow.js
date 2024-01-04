const { addKeyword } = require("@bot-whatsapp/bot");
const { handlerStripe } = require("../services/stripe");
/**
 * Flujo de bienvenida
 */
module.exports = addKeyword('hola')
.addAnswer('Hola, bienvenido! *Frig.Panero*🐄 \nMi nombre es "_nombredtubot_" ¿Cómo puedo ayudarte el día de hoy?\n🛒 *Realizar pedido*\n📋 *Ver lista de precios*\n👤 *Solicitar asistencia*.')


