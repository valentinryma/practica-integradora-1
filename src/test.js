const mongoose = require('mongoose');
const Chat = require('./dao/models/chat.js');

const main = async () => {
    const connectStr = 'mongodb+srv://user:UMDpnTEXC4OoOtSq@cluster0.fl7yeip.mongodb.net/'
    await mongoose.connect(connectStr, {
        dbName: 'ecommerce'
    });

    if (Chat.db.readyState !== 1) {
        console.log('error');
    }

    const getChat = async () => {
        const chat = await Chat.find();
        console.log(chat)
        return chat
    }

    getChat();
}
main();
