const { Client } = require('whatsapp-web.js');
const express = require('express');
const config = require('./config')

const app = express();
const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] }, session: config.session });

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

client.initialize();

client.on('auth_failure', msg => {
    console.error("There is a problem to authenticate, Kindly set the SESSION env var again and restart the app dynos.");
});

client.on('ready', () => {
    console.log('Bot has been started successfully.');
});

client.on('message_create', async(msg) => {
    if (msg.fromMe) {
        if (msg.body.startsWith("!spam")) {
            var data = msg.body.split(" ")
            msg.delete(true)
            if (data[2] > 1000) {
                await client.sendMessage(msg.to, "_Oops! looks like you are trying to spam a lot!_ \
                _Spamming *more than 1000* messages at a time isn't allowed to check abuse_ ;)")
            } else {
                if (data[1] == 1) {
                    for (i = 0; i < data[2]; i++) {
                        await client.sendMessage(msg.to, data[3].toString())
                        sleep(500)
                    }
                    console.log("Spammed", data[2], "times successfully")
                    await client.sendMessage(msg.to, "_Spammed *" + data[2] + "* times successfully_")
                } else if (data[1] == 2) {
                    for (i = 0; i < data[2]; i++) {
                        await client.sendMessage(msg.to, Math.floor((Math.random() * data[3]) + 1).toString())
                        sleep(500)
                    }
                    console.log("Spammed", data[2], "times successfully")
                    await client.sendMessage(msg.to, "_Spammed *" + data[2] + "* times successfully_")
                } else if (data[1] == 3) {
                    for (i = 0; i < data[2]; i++) {
                        await client.sendMessage(msg.to, makeid(data[3]))
                        sleep(500)
                    }
                    console.log("Spammed", data[2], "times successfully")
                    await client.sendMessage(msg.to, "_Spammed *" + data[2] + "* times successfully_")
                }
            }
        } else if (msg.body == '!help') {
            await msg.reply("_Spam syntaxes are as follows:_\n\n \
_*TYPE1:*_  ```!spam 1 <times> <text_to_spam>```\n \
_*TYPE1:*_  ```!spam 2 <times> <random_no_digit_length>```\n \
_*TYPE1:*_  ```!spam 3 <times> <random_alphanumeric_char_length>```\n")
        }
    }
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out.', reason);
});

app.get('/', (req, res) => {
    res.send('<h1 align="center"><tt>This server is powered by <a href="https://github.com/x0rzavi/whatsapp-spammer">whatsapp-spammer</a><br>By <a href="https://github.com/x0rzavi">X0rzAvi</a></tt></h1>')
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening at Port: ${process.env.PORT || 8080}`)
})
