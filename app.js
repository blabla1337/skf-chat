const { app, BrowserWindow, ipcMain,net } = require('electron');
const path = require ('path');
const fs = require('fs');
const os = require('os');

let window;

function createWindow(){
    window = new BrowserWindow({
        show: false,
        width: 800, 
        height: 550,
        titleBarStyle: 'hidden',
        show: false,
        icon: path.join(__dirname, 'images/bot.png'),
    });

    window.loadURL(`file://${__dirname}/index.html`);
    window.once('ready-to-show', function (){
        window.show();
    });

    window.webContents.openDevTools();

    let contents = window.webContents;

    window.on('closed', function() {
        window = null;
    });
}

ipcMain.on('form-submission', function (event, question) {
    console.log("this is the question from the form ->", question)
    
    const request = net.request({
      method: 'POST',
      url: 'https://demo.securityknowledgeframework.org/api/chatbot/question',
      rejectUnauthorized: false,
      requestCert: true
    })

    request.setHeader("Content-Type", "application/json")
    
    let body = ''
    var string = {question:question, question_option:0, question_lang:question}
    var postData = JSON.stringify(string);
   
    request.on('response', (response) => {
    
      // check response.statusCode to determine if the request succeeded
      //console.log(`STATUS: ${response.statusCode}`)
      //console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    
      // capture body of response 
      // - can be called more than once for large result
      response.on('data', (chunk) => {
        //console.log(`${chunk}`)
        body += chunk.toString()
      })
    
      // when response is complete, print body
      response.on('end', () => {
        //console.log(`BODY: ${body}`)
        event.returnValue = body;
      })
    })

    request.write(postData)
    request.end()

});

app.on('ready', function(){
    createWindow();
});