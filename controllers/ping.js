'use strict';

const Telegram = require('telegram-node-bot');

    class PingController extends Telegram.TelegramBaseController {
        pingHandler($){
            $.sendMessage('pong');
        }


        get router(){
            return{
                'pingCommand': 'pingHandler'
            };
        }

    }

    module.exports = PingController;