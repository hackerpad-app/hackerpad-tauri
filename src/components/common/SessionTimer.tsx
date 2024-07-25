import { useState, useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { VscDebugStart, VscDebugStop } from "react-icons/vsc";

export const config = {
  session_time: 50,
  break_time: 10,
};

const SessionTimer = () => {
  const [time, setTime] = useState({
    minutes: config.session_time,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const updateTrayTime = useCallback((minutes: number, seconds: number) => {
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    console.log("Updating time in tray:", timeString);
    invoke("update_tray_time_command", { time: timeString })
      .then(() => console.log("Time updated in tray:", timeString))
      .catch((error) => console.error("Failed to update time in tray:", error));
  }, []);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    updateTrayTime(time.minutes, time.seconds);
  }, [isRunning, time, updateTrayTime]);

  const stopTimer = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setTime((prevTime) => {
        if (prevTime.seconds === 0) {
          if (prevTime.minutes === 0) {
            const audio = new Audio("/completed.mp3");
            audio.play().catch(console.error);
            const newTime = { minutes: config.session_time, seconds: 0 };
            updateTrayTime(newTime.minutes, newTime.seconds);
            return newTime;
          } else {
            const newTime = { minutes: prevTime.minutes - 1, seconds: 59 };
            updateTrayTime(newTime.minutes, newTime.seconds);
            return newTime;
          }
        } else {
          const newTime = { ...prevTime, seconds: prevTime.seconds - 1 };
          updateTrayTime(newTime.minutes, newTime.seconds);
          return newTime;
        }
      });
    };

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateTrayTime]);

  const timerMinutes = time.minutes.toString().padStart(2, "0");
  const timerSeconds = time.seconds.toString().padStart(2, "0");

  return (
    <div
      style={{
        borderColor: "rgba(28, 248, 110, 1.0)",
        borderWidth: "2px",
        borderStyle: "solid",
        zIndex: 0,
      }}
      className="p-5 mt-5 space-x-12 flex flex-row items-center justify-center rounded-md "
    >
      <div className="flex justify-center space-x-4 p-59">
        <VscDebugStart
          className="hover:text-bright-green cursor-pointer"
          onClick={startTimer}
          style={{ fontSize: "24px" }}
        />
        <VscDebugStop
          className="hover:text-bright-green cursor-pointer"
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
