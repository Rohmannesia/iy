"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const set = JSON.parse(fs.readFileSync('./set.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(rohmanzx, msg, m, set, store) => {
try {
let { nomorowner, namebot , namaorner } = set
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : ' '
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${set.ownerNumber}`,"6282139078344@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = rohmanzx.user.id.split(':')[0] + '@s.whatsapp.net'
const prem = ["628898369959101@s.whatsapp.net"].includes(sender) ? true : false

// Group
const groupMetadata = isGroup ? await rohmanzx.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = rohmanzx.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = rohmanzx.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []



const reply = (teks) => {rohmanzx.sendMessage(from, { text: teks }, { quoted: msg })}

//JAN
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
if (fromMe) return reply('')
await rohmanzx.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group`)
rohmanzx.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
rohmanzx.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
rohmanzx.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return rohmanzx.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `hi ${pushname} 
i'm botz Ｋａｇｕｙａ-ＭＤ\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Ｋａｇｕｙａ－ＭＤ,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/d1150da60b13e430b0b54.png' }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
case 'assalamualaikum':{
	let menu = `Waalaikumusalam Halo gyusz balik lagi ama gua rohman zx saya akan merivew script botz kaguya md v1 all fitur no error 💯, sebelum ke video nya jan lupa tekan tombol subscribe`
rohmanzx.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ot':{
if (!prem) return reply(mess.OnlyPrem)
	let menu = `
╭──❒ ♛ 𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨 ♛
❒ .bayar
❒ .ig
❒ .yt
❒ .liststore
❒ .sticker 
❒ .ytmp3/ytmp4
❒ .tourl
╰─────────────────`
rohmanzx.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'grupmenu':{
if (!prem) return reply(mess.OnlyPrem)
	let menu = `
╭──❒ ♛ 𝗚𝗥𝗨𝗣 𝗠𝗘𝗡𝗨 ♛
❒ .addlist
❒ .dellist
❒ .list
❒ .hapuslist
❒ .hidetag 
❒ .group on/off
❒ .antilink on/off
❒ .kick
╰─────────────────`
rohmanzx.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ow':{
let tekssss = `╭──❒ ♛ 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 ♛
❒ .addusr
❒ .addsrv 
❒ .listusr
❒ .listsrv
❒ .delusr
❒ .delsrv
❒ .unblock 
❒ .block 
❒ .join
╰─────────────────`
rohmanzx.sendMessage(from, { image: fs.readFileSync(`./gambar/man.jpg`),
 caption: tekssss, 
footer: `create by - ${set.nameowner}`},
{quoted: msg})
}
break
break
case 'stgc':{
	let menu = `
╭──❒ ♛ 𝙎𝙏𝙊𝙍𝙀 𝙂𝙍𝙊𝙐𝙋 ♛
❒ .addlist
❒ .dellist
❒ .list
╰─────────────────`
rohmanzx.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'menu':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Create by - ${pushname}`
let tampilan_nya = `╔═══《 _𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭_ 》════⊱
╠➤𝘽𝙊𝙏𝙕 𝙉𝘼𝙈𝙀 : ${namebot}
╠➤𝙊𝙒𝙉𝙀𝙍 𝙉𝘼𝙈𝙀 : ${set.namaowner}
╠➤𝙍𝙐𝙉𝙄𝙉𝙂 : 𝙋𝘼𝙉𝙀𝙇
╠➤𝙗𝙖𝙞𝙡𝙚𝙮𝙨 : 𝙈𝘿
╠➤𝙏𝙔𝙋𝙀 : 𝙉𝙊𝘿𝙀𝙅𝙎
╠➤𝗥𝗔𝗠 : *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*
╚═════════════⊱
╔═══《 𝑹𝑼𝑵𝑻𝑰𝑴𝑬 》═══⊱
╠❏*${runtime(process.uptime())}*
╚════[ ${namebot} ]══════⊱`
rohmanzx.sendMessage(from,
{text: tampilan_nya, image: fs.readFileSync(`./gambar/man.jpg`),
buttonText: "𝗟𝗜𝗦𝗧 𝗠𝗘𝗡𝗨",
sections: [{title: "═════════《 𝗟𝗜𝗦𝗧 𝗠𝗘𝗡𝗨 𝗕𝗢𝗧 》═════════",
rows: [
{title: "⭔𝙊𝙏𝙃𝙀𝙍 𝙈𝙀𝙉𝙐", rowId: prefix+"ot", description: "Menampilkan List other"},
{title: "⭔𝗚𝗥𝗨𝗣 𝗠𝗘𝗡𝗨", rowId: prefix+"grupmenu", description: "Menampilkan List fitur group"},
{title: "⭔𝙎𝙏𝙊𝙍𝙀 𝙈𝙀𝙉𝙐", rowId: prefix+"st", description: "Menampilkan List Store"},
{title: "⭔𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐", rowId: prefix+"ow", description: "Menampilkan List owner"}]},
{title: "═════════《 𝙎𝙊𝘾𝙄𝘼𝙇 𝙈𝙀𝘿𝙄𝘼 》═════════",
rows: [
{title: "⭔𝙔𝙊𝙐𝙏𝙐𝘽𝙀", rowId: prefix+"yt", description: "YOUTUBE OWNER SI GAMTEMG😎"},
{title: "⭔𝙄𝙣𝙨𝙩𝙧𝙖𝙜𝙧𝙖𝙢", rowId: prefix+"ig", description: "INSTRAGRAM NYA SI OWNER GAMTENG😎"}]},
],
footer: footer_nya,
mentions:[set.ownerNumber, sender]})
}
break
case 'st':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
let tampilan_nya = `沈𝙍𝙊𝙃𝙈𝘼𝙉𝙕𝙓䆮\n📮 𝙎𝙄𝙇𝘼𝙃𝙆𝘼𝙉 𝙋𝙄𝙇𝙄𝙃 𝙇𝙄𝙎𝙏 𝙎𝙏𝙊𝙍𝙀 𝙆𝘼𝙈𝙄`
rohmanzx.sendMessage(from,
{text: tampilan_nya, image: fs.readFileSync(`./gambar/man.jpg`),
buttonText: "LIST JUALAN",
sections: [{title: "═════════《 𝗟𝗜𝗦𝗧 𝗠𝗘𝗡𝗨 𝗦𝗧𝗢𝗥𝗘/𝗝𝗨𝗔𝗟𝗔𝗡 𝗞𝗔𝗠𝗜 》═════════",
rows: [
{title: "⭔𝗦𝗧𝗢𝗥𝗘 𝗞𝗛𝗨𝗦𝗨𝗦 𝗚𝗥𝗢𝗨𝗣", rowId: prefix+"stgc", description: "Menampilkan menu store untuk group"},
{title: "⭔𝗚𝗥𝗨𝗣 𝗠𝗘𝗡𝗨", rowId: prefix+"grupmenu", description: "Menampilkan List fitur group"},
{title: "⭔𝙎𝙏𝙊𝙍𝙀 𝙈𝙀𝙉𝙐", rowId: prefix+"liststore", description: "Menampilkan List Store"},
{title: "⭔𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐", rowId: prefix+"ow", description: "Menampilkan List owner"}]},
],
footer: footer_nya,
mentions:[set.ownerNumber, sender]})
}
break
case 'yt':
	rohmanzx.sendMessage(from, {text: `https://youtube.com/@rohmanzx
jan lupa subscribe`},
{quoted: msg})
break
case 'ig':
	rohmanzx.sendMessage(from, {text: `https://instagram.com/rohmanxd
jan lupa folow`},
{quoted: msg})
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await rohmanzx.groupAcceptInvite(ini_urrrl)
reply('*Sukses Join The Group..*')
}
break
case 'payment':
case 'pembayaran':
case 'bayar':{
let tekssss = `╭──❒ ♛ 𝙋𝘼𝙔𝙈𝙀𝙉𝙏 ♛
❒ 𝗚𝗢𝗣𝗔𝗬 : ${set.dana}
❒ 𝗗𝗔𝗡𝗔 : ${set.gopay}
╰─────────────────`
rohmanzx.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `create by - ${set.nameowner}`},
{quoted: msg})
}
break
case 'proses':{
let tek = (`「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n*--------------------------*\n\n*Pesanan ini akan diproses manual oleh admin,* *Tunggu admin memprosesnya🙏*\n*Admin Akan Mengabari Anda*`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE SAYA TUNGGU👍' }, type: 1 },
]
rohmanzx.sendMessage(from,
{text: tek,
buttons: btn_menu})
rohmanzx.sendMessage(`${set.ownerNumber}`, {text: `ASSLAMUALAIKUM MIN, ADA YANG ORDER NIH\n\n*DARI* : ${sender.split('@')[0]},\n\n TANGGAL : ${tanggal}\n\nJAM ${jam}`})
}
break
case 'done':{
if (!isOwner && !fromMe) return reply('Ngapain..?')
let tek = (`「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih Telah order di *Rama Gnnz*\nNext Order ya🙏`)
let btn_menu = [
{buttonId: `${prefix}aokeguwgw`, buttonText: { displayText: 'OKE THENKS👍' }, type: 1 },
]
rohmanzx.sendMessage(from,
{text: tek,
buttons: btn_menu})
}
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
rohmanzx.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.rohmanzx-gamteng.jsOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : off & on\nContoh : #${command} off`)
if (args[0] == "off") {
rohmanzx.groupsetUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "on") {
rohmanzx.groupsetUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : off & onn\nContoh : #${command} on`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
rohmanzx.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
rohmanzx.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'list':
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'click here',
footer: `*list from ${groupName}*`,
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
rohmanzx.sendMessage(from, listMsg)
break
case 'addlist':
if (!prem) return reply(`Wokawok`)
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'pilih disini',
footer: 'Silahkan pilih list yg mau dihapus',
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
rohmanzx.sendMessage(from, listMsg)
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
rohmanzx.sendMessage(set.ownerNumber, {text:errny, mentions:[sender]})
}}