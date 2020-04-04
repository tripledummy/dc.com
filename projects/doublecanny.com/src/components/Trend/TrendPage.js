import React, {Fragment, useEffect, useGlobal} from "reactn";
import {getUserName, isUserAuthenticated} from "../../futuremodules/auth/authAccessors";
import {Button} from "react-bootstrap";
import {connect, hangUpCall, sendChatMessage, useConnect} from "../../futuremodules/webrtc/client";
import {Video} from "./TrendPageStyle";
import {useState} from "react";

const TrendPage = ({auth}) => {

  const [currentChat, setCurrentChat] = useState([]);
  const [wsconnection, setWSConnection] = useState(null);

  useEffect(() => {
    if (auth[0] && !wsconnection) {
      console.log("Connecting with ", auth);
      setWSConnection(connect(getUserName(auth), messageCallback));
    }
  });

  const messageCallback = (msg) => {
    setCurrentChat( m => m.concat(msg) );
  }

  if (!isUserAuthenticated(auth)) {
    // return (<Redirect to={"/"}/>)
    return (<Fragment/>)
  }

  return (
    <div className="container">
      <div className="camerabox">
        <Video id="received_video" autoPlay/>
        <Video id="local_video" autoPlay muted/>
        <Button id="hangup-button" onClick={() => hangUpCall()}>
          Hang Up
        </Button>
      </div>
      <div className="empty-container"/>
      <ul>
        {currentChat.map((elem) => {
          return (
            <li> {elem.timestamp} <b>{elem.username}</b>: {elem.text}</li>
          )
        })}
      </ul>
      <div className="chat-controls">
        <input id="text" type="text" name="text" size="100" maxLength="256" placeholder="Say something meaningful..."
               autoComplete="off" onKeyUp={(evt) => {
          if (evt.keyCode === 13 || evt.keyCode === 14) {
            sendChatMessage(evt.target.value);
            evt.target.value = "";
          }
        }}/>
      </div>
    </div>
  )
};

export default TrendPage;
