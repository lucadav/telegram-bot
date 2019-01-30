'use strict';

const Telegram = require('telegram-node-bot')
const firebase = require("firebase");
require("firebase/firestore");


class TodoController extends Telegram.TelegramBaseController {


    addHandler($) {
        let db = this._initFirbase();
        let todo = $.message.text.split(' ').slice(1).join(' ');
        if (!todo) return $.sendMessage('Sorry, please pass a todo item.');
        this._addTodo(db,todo)
        //
        // $.getUserSession('todos')
        //     .then(todos => {
        //         if (!Array.isArray(todos)) $.setUserSession('todos', [todo]);
        //         else $.setUserSession('todos', todos.concat([todo]));
        //         $.sendMessage('Added new todo!');
        //     });
    }

    getHandler($) {
        let db = this._initFirbase();
        this._serializeList(db,$)
    }

    checkHandler($) {
        let db = this._initFirbase();
        let index = $.message.text.split(' ').slice(1)[0];
        if (!index){
            return  $.sendMessage('Sorry, you didn\'t pass a valid index.');
        }
        db.collection("users").doc(index).delete().then(function() {
            $.sendMessage('Checked todo!');
        }).catch(function(error) {
            $.sendMessage('Sorry, you didn\'t pass a valid index.');
        });
        // let index = parseInt($.message.text.split(' ').slice(1)[0]);
        // if (isNaN(index)) return $.sendMessage('Sorry, you didn\'t pass a valid index.');
        //
        // $.getUserSession('todos')
        //     .then(todos => {
        //         if (index >= todos.length) return $.sendMessage('Sorry, you didn\'t pass a valid index.');
        //         todos.splice(index, 1);
        //         $.setUserSession('todos', todos);
        //         $.sendMessage('Checked todo!');
        //     });
    }

    get routes() {
        return {
            'addCommand': 'addHandler',
            'getCommand': 'getHandler',
            'checkCommand': 'checkHandler'
        };
    }

    _serializeList(db,$) {
        let serialized = '*Your Todos:*\n\n';
        let i ='';
        let t='';
        db.collection("users").get().then((querySnapshot) => {
            if(querySnapshot.size<1){
                return   $.sendMessage('no element in the list');
            }
            console.log(querySnapshot.size)
            querySnapshot.forEach((doc) =>{
                i = doc.id;
                t=doc.data().time;
                serialized += `*${i}* - ${t}\n`;
               // console.log(doc.data());
            });
          return  $.sendMessage(serialized, { parse_mode: 'Markdown' });
        });
        // todoList.forEach((t, i) => {
        //     serialized += `*${i}* - ${t}\n`;
        // });
        // return serialized;
    }



    _initFirbase() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCJGoJbwAID_6uQhuFHT9websKT5kJlKOg",
                authDomain: "servlesscomputing.firebaseapp.com",
                projectId: "servlesscomputing"
            });
            // Initialize Cloud Firestore through Firebase

        }
        var db = firebase.firestore();
        // Disable deprecated features
        db.settings({
            timestampsInSnapshots: true
        });
        return db;
    }

    _addTodo(db,todo) {

        // Add a new document in collection "cities"
        db.collection("users").get().then((querySnapshot) => {
            let index = querySnapshot.size+2;
            querySnapshot.forEach((doc) =>{
                let id = parseInt(doc.id)
                if(id>index || id===index){
                    index=id;
                    index +=1
                }
            });
            console.log(index.toString());
            db.collection("users").doc(index.toString()).set({
                time: todo,
            })
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
        });


    }

}

module.exports = TodoController;
