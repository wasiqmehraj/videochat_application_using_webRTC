//Node.js
// get the http library
const http = require('http')

// make a new http server
// Create a local server to receive data from others

const server = http.createServer((req,res) => {})
// console.log(server) <*****>

// get the websocket library 
var WebSocketServer = require('websocket').server; 

var a_data;
var b_data;
//listen to port 3000 for anything
server.listen(3010,() =>{
   console.log('Listening to port 3010')
})

// connect this http server with websocket

const websocket =  new WebSocketServer({httpServer:server})
// console.log(websocket)

let clients = [];


websocket.on('request', (req) => {
  console.log(`a Client got connected.`);
  
  // Accept the connection request
  const connection = req.accept()
  clients.push(connection);

  console.log(`Total clients: ${clients.length}`);
  connection.on('message',(message) =>{
    console.log('<<<<<<<on message got triggered>>>>>>>')
   // this will occur when it recieves any message..
   const data = JSON.parse(message.utf8Data)
   
   if (data.type === 'alice-offer'){
      //alice's offer obtained, send it to bob
      console.log('RUNNING CASE: "alice-offer"\n alice-offer reached server.')
      // console.log(data)
      var a_data = {type: 'alice-offer', data: data.offer}
      // console.log(clients[0])
      // console.log('================================')
      // console.log(connection)
      clients[1].sendUTF(JSON.stringify(a_data));
      console.log('Alices offer -----sent to-------> Bob')

   } else if (data.type === 'bob-answer'){
      //bobs offer obtained, send it to alice
      console.log('RUNNING CASE: "bob-answer"\n bob-answer reached server.')
      var b_data = {type: 'bob-answer', data: data}
      // console.log(b_data.data)
      clients[0].sendUTF(JSON.stringify(b_data.data));
      // console.log(JSON.stringify(b_data))
      console.log('Alices <-----sent back to------- Bobs answer')
   }
  })
  websocket.on('close', () => {
    const index = clients.indexOf(websocket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log(`Client disconnected. Total clients: ${clients.length}`);
  });
});



