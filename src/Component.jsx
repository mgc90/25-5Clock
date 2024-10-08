import './Component.css'
import { useState, useRef} from 'react'
import Countdown, { zeroPad } from 'react-countdown';

const Component = () => {
  const [ breakLength, setBreakLength ] = useState(5);
  const [ sessionLength, setSessionLength ] = useState(25);
  const [ sessionState, setSessionState ] = useState("Session");
 
  const countdownRef = useRef();
  const audioRef = useRef();

  const handleBreakLength = (modifys) => {
    const api = countdownRef.current.getApi();
    const pausedOrStopped = (api.isPaused() || api.isStopped());
    if ((modifys === "increment") && (breakLength < 60) && pausedOrStopped ) {
    setBreakLength(breakLength+1) 
    } else if ((modifys === "decrement") && (breakLength !== 1) && pausedOrStopped ) {
    setBreakLength(breakLength-1);
    }
  }
  
  const handleSessionLength = (modifys) => {
    const api = countdownRef.current.getApi();
    const pausedOrStopped = (api.isPaused() || api.isStopped());
    if ((modifys === "increment") && (sessionLength < 60) && pausedOrStopped ) {
      setSessionLength(sessionLength+1);
    } else if (modifys === "decrement" && (sessionLength !== 1) && pausedOrStopped ) {
      setSessionLength(sessionLength-1);
    }
  }

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setSessionState("Session");
    countdownRef.current.getApi().stop();
    audioRef.current.pause();
    audioRef.current.load();
  }

  const startStop = () => {
    const api = countdownRef.current.getApi();
    (api.isPaused() || api.isStopped()) ? 
    api.start() :
    api.pause() ;
  }

  const date = (long) => {
    sessionState === "Session" ? long = sessionLength : long = breakLength;
    return Date.now() + long * 60000;
  }

  const reachZero = () => {
    countdownRef.current.getApi().stop();
     (sessionState === "Break") ?
      setSessionState("Session") :
      setSessionState("Break"); 
      countdownRef.current.getApi().start()
  }

  const completedd = () => {
    audioRef.current.play();
 
    const timeoutId = setTimeout(() => {
      reachZero();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }

  const renderer = ({ hours, minutes, seconds, completed }) => { 
    return (
    <div id="time-left">
      {(minutes === 0 && hours === 1) ? 60 : zeroPad(minutes)}:{zeroPad(seconds)}
    </div>)
  }


  return (
    <div className='mainContainer'>
      <div id='break-label'>
        Break Length <br />
        <button id='break-increment' onClick={() => handleBreakLength("increment")} >▲</button>
        <div id='break-length' >{breakLength}</div>
        <button id='break-decrement' onClick={() => handleBreakLength("decrement")} >▼</button>
      </div>
      <div id='session-label'>
        Session Length <br />
        <button id='session-increment' onClick={() => handleSessionLength("increment")}  >▲</button>
        <div id='session-length' >{sessionLength}</div>
        <button id='session-decrement' onClick={() => handleSessionLength("decrement")} >▼</button>
      </div>
      <div id='timer-label' >
        {sessionState} 
        <div id="countdownContainer" >
          <Countdown date={date()} renderer={renderer}
          zeroPadTime={2} ref={countdownRef} controlled={false}
          autoStart={false} onComplete={completedd} />
        </div>
      </div>
      <div>
        <button id='start_stop' onClick={startStop} >Start/Stop</button>
        <button id='reset' onClick={handleReset} >Reset</button>
      </div>
      <audio  id="beep" ref={audioRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" >
      </audio>
    </div>
  )
}

export default Component