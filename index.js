const { default: makeWASocket, DisconnectReason, useSingleFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent } = require("@adiwajshing/baileys")
const fs = require("fs");
const chalk = require('chalk')
const logg = require('pino')
const { serialize, fetchJson, sleep, getBuffer } = require("./lib/myfunc");

let set = JSON.parse(fs.readFileSync('./set.json'));
let session = `./node_modules/man.json`
const { state, saveState } = useSingleFileAuthState(session)

const memory = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
const rohmanzx = makeWASocket({
printQRInTerminal: true,
logger: logg({ level: 'fatal' }),
browser: ['Ｋａｇｕｙａ－ＭＤ','Safari','1.0.0'],
auth: state
})
memory.bind(rohmanzx.ev)

rohmanzx.ev.on('messages.upsert', async m => {
var msg = m.messages[0]
if (!m.messages) return;
if (msg.key && msg.key.remoteJid == "status@broadcast") return
msg = serialize(rohmanzx, msg)
msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
require('./rohmanzx-gamteng')(rohmanzx, msg, m, set, memory)
})

rohmanzx.ev.on('creds.update', () => saveState)

rohmanzx.reply = (from, content, msg) => rohmanzx.sendMessage(from, { text: content }, { quoted: msg })

rohmanzx.ev.on('connection.update', (update) => {
console.log('Connection update:', update)
if (update.connection === 'open') 
console.log("Connected with " + rohmanzx.user.id)
else if (update.connection === 'close')
connectToWhatsApp()
})



rohmanzx.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await rohmanzx.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

rohmanzx.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
return rohmanzx
}
connectToWhatsApp()
.catch(err => console.log(err))
