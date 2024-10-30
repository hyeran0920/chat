// Express 서버와 Socket.io를 설정하고, ViteExpress로 Vite 개발 서버와 Express 서버를 통합해 동작
import { Server } from 'socket.io';
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {cors: {
    origin: "*"
  }});

io.on('connection', (client) => {
    console.log(client.handshake.query);
    
    const connectedClientUserName = client.handshake.query.username;
    console.log(`${connectedClientUserName} 사용자가 들어왔습니다!`);

    client.broadcast.emit('new message', {username : "관리자", message:`${connectedClientUserName} 님이 들어왔습니다!`})


    client.on ('new message', (msg) =>{
        console.log(`${connectedClientUserName} 사용자의 메세지 :  ${msg}`);
        io.emit('new message', {username : msg.username, message: msg.message})

    })    
    
    client.on ('disconnect', () =>{
        console.log(`${connectedClientUserName} 사용자가 나갔습니다.`);
        io.emit('new message', {username : "관리자", message:`${connectedClientUserName} 님이 나갔습니다.`})

    })
    
});

server.listen(3000, () => {
    console.log('3000 서버에서 듣고있습니다.')
});//서버 설정한걸 3000이 받는다

app.get("/message", (_, res) => res.send("Hello from express!"));
app.get("/api", (_, res) => res.send("Hello from API!"));

ViteExpress.bind(app, server);
