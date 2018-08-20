const ipcRenderer = require('electron').ipcRenderer;

function sendForm(event, arg) {

    event.preventDefault();
    let question = document.getElementById("question").value;

    ipcRenderer.send('asynchronous-message', question)
    var answer = ipcRenderer.sendSync('form-submission', question)
    console.log(answer);

    var jsonData = JSON.parse(answer);
    for (var i = 0; i < jsonData.options.length; i++) {
        var counter = jsonData.options[i];
        botAnswer = counter.answer;
    }
    

    var usermessage = document.createElement('div');
    usermessage.className = 'usermessage';
    usermessage.innerHTML =
        `<li class="message right appeared fade-in"> \
            <div class="avatar"></div>\
            <div class="text_wrapper">\
              <div class="text">${question}</div>\
            </div>\
          </li>`;

    var botmessage = document.createElement('div');
    botmessage.className = 'usermessage';
    botmessage.innerHTML =
        `<li class="message left appeared"> \
                  <div class="avatar"></div>\
                  <div class="text_wrapper">\
                    <div class="text">${botAnswer}</div>\
                  </div>\
                </li>`;

    document.getElementById('messages').appendChild(usermessage);
    


    setTimeout(func, 1000);
    function func() {
        document.getElementById('messages').appendChild(botmessage)
    }

    document.getElementById("question").value = ""
}


