'use strict';

const Telegram = require('telegram-node-bot'),
    PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
    storage = new PersistentMemoryStorage(
        `${__dirname}/data/userStorage.json`,
        `${__dirname}/data/chatStorage.json`
    ),
    tg = new Telegram.Telegram('685224449:AAFK_6hsvjVPQiClh1bi1O2O8SLTRUvUqaM', {
        workers: 2,
        storage: storage
    });





const TodoController = require('./controllers/todo')
    , OtherwiseController = require('./controllers/otherwise');

const todoCtrl = new TodoController();

tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/get', 'getCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/check', 'checkCommand'), todoCtrl)
    .otherwise(new OtherwiseController());

function exitHandler(exitCode) {
    storage.flush();
    process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncaughtException', exitHandler.bind(null, 1));