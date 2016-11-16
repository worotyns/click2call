# click2call

Click 2 Call for (Telecube.pl)
Client / Server library for webcall from telecube.pl (example implementation).

![ScreenShot](/screen.png)

This repository contains full working example:

### Example
 - Example server (nodejs)
 - Example client (js, html)
```
$ cp config.example.json config.json
#edit config file
$ npm install
$ npm run example # runs web server
```

### Server side config:
```
{
 "agent":  "48225999999", //number to agent
 "number": "48225999999", //number presents
 "secret": "SECRET", //secret api key
 "apiUrl": "https://panel.telecube.pl/api/LOGINHERE/web_call/" //api url
}
```

This example has 2 endpoints:
```
 GET  /
 POST /call
```

### Client side config (in index.html) example
```
var c2cconfig = {
    apiUrl: 'http://localhost:3000/call',
    delay: 0, //Delay to show icon;
    call: {
      //Triggers when call request end with 200 code
      onSuccess: function(response) {
        var self = this;
        this.status('ok'); //set status to ok
        setTimeout(function() {
          self.closeModal();
        }, 5000)
        console.log(response); //on success handler
      },
      onFail: function(error) {
        var self = this;
        this.status('error'); //set status to error
        this.unlock(); //unlock call button
        setTimeout(function() {
          self.closeModal();
        }, 5000)
        console.log(error) // on error handler
      }
    },
    modal: {
      id: "c2c-modal", //on id element
      delay: 1000, // 0 disabled
      class: "hide",
      input: {
        //Trigger when click to button
        id: "c2c-input", //on id element
        regexp: new RegExp(/^[0-9\-\+]{9,15}$/) //regexp validation match
      },
      button: {
        id: "c2c-call", //make call button id
      }
    },
    button: {
      id: "c2c-btn",
      delay: 500, //After delay
      class: "hide" //Toggle class when trigger
    }
};
```

### Library - you need this files to integrate click2call
 - Server side (click2call) api
 - Client side popup, ajax request for api

 To run this you need to have:
  - Node >= 4
  - Telecube account,
  - Enabled API for click2call in telecube

contributors: 
 - Mateusz Worotyński <mateusz@pushpushgo.com>
 - Agata Matoga <agata@pushpushgo.com>