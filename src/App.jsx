import { useState, useEffect } from 'react'
import { FaArrowUp } from "react-icons/fa"; // 화살표 아이콘 가져오기

import './App.css'
import {io} from "socket.io-client"

function App() {
  const [isConnected, setisConnected] = useState(false);

  const [messages, setMessages] = useState([]);

  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);  
  
  const [userInput, setUserInput] = useState('');



  function connectToChatServer(){
      console.log('채팅서버 연결되었습니다');
      const _socket = io('https://chat-izsj.onrender.com/',{
        autoConnect : false,
        query:{
          username : username,
        }
      });
      _socket.connect(); 

      setSocket(_socket);
    }

    function disconnectToChatServer(){
      console.log('connectToChatServer');
      socket?.disconnect(); //물음표는 소켓이 있는지 없는지 모르겠지만 일단 disconnect하는것
    }

    function onConnected(){
      console.log('연결되었습니다')
      setisConnected(true);
    }
    function onDisconnected(){
      console.log('종료되었습니다')
      setisConnected(false);
    }

    function sendMessageToChatServer(){
      console.log(`메세지 전송 ${userInput}` )
      socket?.emit("new message",{username: username, message : userInput},(response) =>{
        console.log(response);
      });
      setUserInput('');
    }

    function onMessageRecived(msg){
      console.log(msg)
      setMessages(previous => [...previous, msg]);
    }

    useEffect(() => {
      console.log('화면 스크롤' )

      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth" 
      });
    }, [messages]);
    

    useEffect(() => {
      console.log('useEffact called!');
      socket?.on('connect', onConnected)
      socket?.on('disconnect', onDisconnected)

      socket?.on('new message', onMessageRecived)

      return () => {
        console.log('useEffect clean up function called!')
        socket?.off('connect', onConnected)
        socket?.off('disconnect', onDisconnected)
        socket?.off('new message', onMessageRecived)
      };
    }, [socket]);

    const messageList = messages.map((aMsg, index) =>
      <li key={index}>
        {aMsg.username} : {aMsg.message}
      </li>
    );


  return (
    <>
      <div className="Navbar">
        {isConnected ? (
          // 접속 중일 때
          <>
            <h5 style={{ textAlign: "right" }}>
              유저 : {username} &nbsp;
              {/* 접속상태 : {isConnected ? "접속중" : "미접속"}&nbsp;&nbsp;<br/><br/> */}
            <button  onClick={() => disconnectToChatServer()}>
              접속종료
            </button>
            </h5>
          </>
        ) : (
          // 미접속 중일 때
          <div className="Card">
            <h5>닉네임을 입력해주세요!</h5>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="닉네임을 입력해주세요" 
            />&nbsp;
            <button onClick={() => connectToChatServer()}>
              접속하기
            </button>
          </div>
        )}
      </div>

      <ul className='ChatList'>
        {messageList}
      </ul>
      
        <div className="MessageInput">
          <input value={userInput} onChange={e => setUserInput(e.target.value)}          
          placeholder="채팅을 입력해주세요" />
          <button onClick={() => sendMessageToChatServer()}>
          <FaArrowUp /> {/* 위쪽 화살표 아이콘 */}
          </button>
        </div>

        
    </>
  )
}

export default App
