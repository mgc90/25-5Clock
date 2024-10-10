import './Component.css'
import { useState, useRef} from 'react'
import Countdown, { zeroPad } from 'react-countdown';

const Component = () => {
  const [ breakLength, setBreakLength ] = useState(5);
  const [ sessionLength, setSessionLength ] = useState(25);
  const [ countMode, setCountMode ] = useState("Session");
 
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
    setCountMode("Session");
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
    countMode === "Session" ? long = sessionLength : long = breakLength;
    return Date.now() + long * 60000;
  }

  const updateCount = () => {
    countdownRef.current.getApi().stop();
     (countMode === "Break") ?
      setCountMode("Session") :
      setCountMode("Break"); 
      countdownRef.current.getApi().start()
  }

  const reachZero = () => {
    audioRef.current.play();
    const timeoutId = setTimeout(() => {
      updateCount();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }

  const renderer = ({ hours, minutes, seconds, completed }) => { 
    return (
    <div id="time-left">
      {(minutes === 0 && hours === 1) ? 60 : zeroPad(minutes)}:{zeroPad(seconds)}
    </div>)
  }

  const changeColor = countMode === "Session" ? "darkcyan" : "saddlebrown";

  return (
    <div className='mainContainer' style={{"--changeColor": changeColor}}>
      <div id='break-label'>
        <p>Break Length</p> 
        <button id='break-increment' onClick={() => handleBreakLength("increment")} >▲</button>
        <div id='break-length' >{breakLength}</div>
        <button id='break-decrement' onClick={() => handleBreakLength("decrement")} >▼</button>
      </div>
      <div id='session-label'>
        <p>Session Length</p>
        <button id='session-increment' onClick={() => handleSessionLength("increment")} >▲</button>
        <div id='session-length' >{sessionLength}</div>
        <button id='session-decrement' onClick={() => handleSessionLength("decrement")} >▼</button>
      </div>
      <div id='timer-label' >
        {countMode} 
        <div id="countdownContainer" >
          <Countdown date={date()} renderer={renderer}
          zeroPadTime={2} ref={countdownRef} controlled={false}
          autoStart={false} onComplete={reachZero} />
        </div>
      </div>
      <div>
        <button id='start_stop' onClick={startStop} >Start/Pause</button>
        <button id='reset' onClick={handleReset} >Reset</button>
      </div>
      <audio  id="beep" ref={audioRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" >
      </audio>
    </div>
  )
}

export default Component