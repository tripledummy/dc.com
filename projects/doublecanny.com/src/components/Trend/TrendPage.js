import React, {useEffect, withGlobal} from "reactn";
import {getAuthUserName} from "../../futuremodules/auth/authAccessors";
import {Button, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import {connect, hangUpCall, phoneCall, sendChatMessage} from "../../futuremodules/webrtc/client";
import {useState} from "react";
import {Video, VideoPhoneChat} from "../../futuremodules/reactComponentStyles/reactCommon.styled";

const TrendPage = (props) => {

  const auth = props.auth;

  console.log("Auth:" + JSON.stringify(props));
  const [currentChat, setCurrentChat] = useState([]);
  const [wsconnection, setWSConnection] = useState(null);
  // const inChat = false;

  useEffect(() => {
    if (!wsconnection && auth) {
      setWSConnection(connect(getAuthUserName(auth), messageCallback));
    }
  }, [auth, wsconnection]);

  const makePhoneCall = () => {
    phoneCall("Dado");
  }

  const messageCallback = (msg) => {
    setCurrentChat(m => m.concat(msg));
  }

  // if (!isUserAuthenticated(props.auth)) {
  //   // return (<Redirect to={"/"}/>)
  //   return (<Fragment/>)
  // }

  return (
    <VideoPhoneChat>
      <Container>
        <Row>
          <Video id="received_video" width={"250px"} height={"240px"} autoPlay/>
        </Row>
        <Row>
          <Video id="local_video" width={"250px"} height={"240px"} autoPlay muted/>
        </Row>
        <Row>
          <Button id="call-button" onClick={() => makePhoneCall()}>
            Call
          </Button>
          <Button id="hangup-button" onClick={() => hangUpCall()} disabled={true}>
            Hang Up
          </Button>
        </Row>
        <Row>
          <ul>
            {currentChat.map((elem) => {
              return (
                <li> {elem.timestamp} <b>{elem.username}</b>: {elem.text}</li>
              )
            })}
          </ul>
          <InputGroup className="mb-3" id="text" type="text" name="text" maxLength="256" placeholder="..."
                      autoComplete="off" onKeyUp={(evt) => {
            if ((evt.keyCode === 13 || evt.keyCode === 14)) {
              sendChatMessage(evt.target.value);
              evt.target.value = "";
            }
          }}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl/>
          </InputGroup>
        </Row>
      </Container>
    </VideoPhoneChat>
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
