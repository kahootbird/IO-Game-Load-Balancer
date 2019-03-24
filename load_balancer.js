//GET IP ADDR
/*
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );
console.log( networkInterfaces.ens3[0].address );
*/
//SSL
var maxmind = require('maxmind');

maxmind.open('/usr/load_balancer/GeoLite2-Country.mmdb', (err, orgLookup) => {
  var city = orgLookup.get('66.6.44.4');
});
var cityLookup = maxmind.openSync('/usr/load_balancer/GeoLite2-Country.mmdb');
//ar city = cityLookup.get('66.6.44.4');
//console.log(city.country.iso_code);
var iso_code

var fs = require('fs'),
    http = require('http'),
    //https = require('https'),
    express = require('express');
//var port = 8880;
var port = 80

/*
const options = {
  key: fs.readFileSync('yonderroyale.io.key'),
  cert: fs.readFileSync('yonderroyale.io.pem')
};

var app = express();

var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

app.get('/', function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});

*/


var uuid = require('uuid-v4');
//var userid = []

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
   // https = require('http').Server(app),
   
    WebSocketServer = require('uws').Server,
    wss = new WebSocketServer({
        port: 8080,
      clientTracking: true
    });
    
app.use(express.static('public'));
app.get('/', function(req, res) {
   var forwardedIpsStr = req.header('x-forwarded-for');
   var IP = '';

   if (forwardedIpsStr) {
      IP = forwardedIps = forwardedIpsStr.split(',')[0];  
   }
//console.log(IP);
//console.log(IP);
iso_code = cityLookup.get(IP);
//console.log(iso_code.continent.code);
//If in EU then serve EU file, otherwise don't
if (iso_code.continent.code != null && iso_code.continent.code == "EU")
{
console.log("index2")
    res.sendFile(__dirname + '/index2.html');
}
else
{
    res.sendFile(__dirname + '/index.html');
}
});

//For each client connected
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
var server_list = []
var server_index = 0 
  var checklist
    var found = 0
    var playernum = 0
    var playerset = 0
    var lowest_number = 1
    var foundit = 0
    var total_count = 0
wss.on('connection', function(ws) {
  ws.id = uuid();
    ws.on('message', function(msg) {
    //Associate WS ID with the server number in case of disconnect
    //ws.send("yakback")
  
    console.log(msg)
    //console.log("sent")
    var data = msg.split(" ")

   if (data[0] == "Killswitch")
      {
        process.exit();
      }
      if (data[0] == "conn" && parseInt(data[1]) > 0)  
      {
        if (parseInt(data[1]) > 0)
        {
          //Check if already in list, if it is then ignore it. Useful for avoiding bugs.
          for (checklist = 0; checklist < server_list.length; checklist++)
          {
              if (server_list[checklist][0] == parseInt(data[1]))
              {
                found = 1
                //set the playercount
                server_list[checklist][2] = parseInt(data[2])
                //Set server active status
                if (parseInt(data[3]) == 0 || parseInt(data[3] == 1))
                {
                  server_list[checklist][3] = parseInt(data[3])
                }
            }

          }
          playernum = parseInt(data[2])
          if (playernum == null)
            playernum = 0
        if (found == 0)
          //Order of the array is server number, connection id, and player count, server recieving players or not
        server_list.push([parseInt(data[1]),ws.id,playernum,1]);    
        }

      }
    found = 0
    //get
    if (data[0] == "SN" && server_list.length > 0)
    {
      //reset lowest so it doesn't remain on an active server if its lower
      lowest_number = 99999
      foundit = 0
      //Player is getting server number. Send them the first active on the list.
      for (checklist = 0; checklist < server_list.length; checklist++)
      {
        if (server_list[checklist][3] == 1 && foundit == 0)
        {
          console.log(server_list)
          lowest_number = server_list[checklist][0]
          foundit = 1
        }
      
      }
      foundit = 0
         ws.send(ws.send(String(lowest_number)))
      console.log("Server Number:" + lowest_number)
    }
    //player count
    if (data[0] == "P")
    {
      total_count = 0
      for (checklist = 0; checklist < server_list.length; checklist++)
      {
        total_count += server_list[checklist][2]
      }
      console.log(total_count)
       ws.send(String(total_count))
    }



      });
        wss.clients.forEach(function each(client) {

    });
  ws.on('close', function close() {
    console.log('disconnected');
    console.log(server_list);
    var findit

    for (findit = 0; findit < server_list.length; findit++)
    {
      if (server_list[findit][1] == ws.id)
      {
        server_list.splice(findit,1)
      }
    }
    console.log("Remaining list:")
    console.log(server_list);
});


});
 

http.listen(port, function() {
    //console.log('listening on *:80');
});
