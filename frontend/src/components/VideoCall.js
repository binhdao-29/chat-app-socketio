import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone";
import VideocamIcon from '@material-ui/icons/Videocam';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"


const socket = io.connect('http://localhost:5000')
function VideoCall({ isCall }) {
  const [me, setMe] = useState("")
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState("")
  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  useEffect(() => {
    if (isCall) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream)
        myVideo.current.srcObject = stream
      })
    }
  }, [isCall]);

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id)
    })

    socket.on("callUser", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })

  }, [])

  const callUser = (id) => {

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      })
    })
    peer.on("stream", (stream) => {

      userVideo.current.srcObject = stream

    })
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller })
    })
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream
    })

    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }

  const handleCloseCall = () => {
    setCallEnded(true);
    window.location.reload();
  }

  return (
    <div className={`video-call ${isCall ? 'active' : ''}`}>
      <div className="video-overlay"></div>
      <Button className="btn-close-video" onClick={handleCloseCall}>
        <CloseIcon fontSize='large' />
      </Button>
      <div className="video-container">
        <div className="video-wrapper">
          <div className="video">
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "330px" }} />}
          </div>
          <div className="video">
            {callAccepted && !callEnded ?
              <video playsInline ref={userVideo} autoPlay style={{ width: "330px" }} /> :
              null}
          </div>
        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CopyToClipboard text={me}>
            <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
              Copy ID
            </Button>
          </CopyToClipboard>

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
        </div>
        <div>
          <div>
            <div className="btn-form">
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <Button variant="contained" color="secondary" onClick={leaveCall}>
                    <PhoneDisabledIcon fontSize='large' />
                  </Button>
                ) : (
                  <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                )}
              </div>
              {receivingCall && !callAccepted ? (
                <div className="caller">
                  <IconButton className="btn-answer" onClick={answerCall}>
                    <VideocamIcon fontSize="large" />
                  </IconButton>
                </div>
              ) : null}
            </div>
            {receivingCall && !callAccepted ? (
              <h1 className="player-call">{name} is calling...</h1>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCall