import React, {useEffect, withGlobal} from "reactn";
import {getAuthUserName} from "../../futuremodules/auth/authAccessors";
import {Button} from "react-bootstrap";
import {connect, hangUpCall, phoneCall, sendChatMessage} from "../../futuremodules/webrtc/client";
import {Video} from "./TrendPageStyle";
import {useState} from "react";

const TrendPage = (props) => {

  const auth = props.auth;

  console.log("Auth:" + JSON.stringify(props));
  const [currentChat, setCurrentChat] = useState([]);
  const [wsconnection, setWSConnection] = useState(null);
  // const inChat = false;

  useEffect( () => {
    if ( !wsconnection && auth ) {
      setWSConnection( connect(getAuthUserName(auth), messageCallback) );
    }
  }, [auth, wsconnection]);

  const makePhoneCall = () => {
    phoneCall("Dado");
  }

  const messageCallback = (msg) => {
    setCurrentChat( m => m.concat(msg) );
  }

  // if (!isUserAuthenticated(props.auth)) {
  //   // return (<Redirect to={"/"}/>)
  //   return (<Fragment/>)
  // }

  return (
    <div className="container">
      <div className="camerabox">
        <Video id="received_video" width={"320px"} height={"240px"} autoPlay/>
        <Video id="local_video" width={"320px"} height={"240px"} autoPlay muted/>
        <Button id="call-button" onClick={() => makePhoneCall()}>
          Call
        </Button>
        <Button id="hangup-button" onClick={() => hangUpCall()} disabled={true}>
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
          if ((evt.keyCode === 13 || evt.keyCode === 14)) {
            sendChatMessage(evt.target.value);
            evt.target.value = "";
          }
        }}/>
      </div>
    </div>
  )
};

export default withGlobal(
  // Set the `value` prop equal to the global state's `value` property.
  global => ({
    auth: global.auth,
  }),

  // // Important Note: This is not the setGlobal helper function.
  // // Set the `incrementValue` prop to a function that increments the global
  // //   state's `value` property.
  // setGlobal => ({
  //   incrementValue: () => {
  //     // Important Note: This is not the setGlobal helper function.
  //     // This is the parameter referenced 4 lines up.
  //     setGlobal(global => ({
  //       value: global.value + 1,
  //     }));
  //   },
  // }),
)(TrendPage);
