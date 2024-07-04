import { useState, useEffect, useRef } from "react";
import { VscDebugStart } from "react-icons/vsc";
import { IoStopOutline } from "react-icons/io5";

export const config = {
  session_time: 1,
  break_time: 1,
};

const SessionTimer = () => {
  const [minutes, setMinutes] = useState(config.session_time);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return; // if timer is already running, do nothing
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          setMinutes((prevMinutes) => {
            if (prevMinutes !== 0) {
              return prevMinutes - 1;
            } else {
              const audio = new Audio("/public/completed.mp3");
              audio.play();
              return config.session_time; // use config.session_time instead of hard-coded value
            }
          });
          return 59;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current === null) return; // if timer is not running, do nothing
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => {
      // cleanup function to clear interval on component unmount
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div
      style={{
        borderColor: "rgba(28, 248, 110, 1.0)",
        borderWidth: "2px",
        borderStyle: "solid",
      }}
      className="p-5 mt-5 space-x-12 flex flex-row items-center justify-center rounded-md "
    >
      <div className="flex justify-center space-x-4 p-59">
        <VscDebugStart
          className=" hover:text-bright-green cursor-pointer"
          onClick={startTimer}
          style={{ fontSize: "24px" }} // Adjust icon size as needed
        />
        <IoStopOutline
          className=" hover:text-bright-green cursor-pointer"
          onClick={stopTimer}
          style={{ fontSize: "24px" }}
        />
      </div>
      <div className="flex items-center justify-center text-4xl text-center h-full">
        <p>
          {timerMinutes}:{timerSeconds}
        </p>
      </div>
    </div>
  );
};

export default SessionTimer;
