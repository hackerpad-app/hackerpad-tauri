import React, { useEffect, useRef, useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { VscDebugStart, VscDebugStop } from "react-icons/vsc";
import { useTimer } from "./../context/TimeContext";

export const config = {
  session_time: 1,
  break_time: 1,
};

interface SessionTimerProps {
  onRequestStart: () => void;
  onRequestStop: () => void;
  onRequestContinue: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({
  onRequestStart,
  onRequestStop,
  onRequestContinue,
}) => {
  const { time, setTime, isSessionActive, setIsSessionActive, tasks } =
    useTimer();
  const intervalRef = useRef<number | null>(null);
  const [isSessionInProgress, setIsSessionInProgress] = useState(false);

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
    if (isSessionInProgress) {
      console.log("1st condition");
      onRequestContinue();
      setIsSessionInProgress(true);
    } else if (!isSessionActive) {
      console.log("2nd condition");
      onRequestStart();
      setIsSessionInProgress(true);
    }
  }, [isSessionActive, onRequestStart]);

  const stopTimer = useCallback(() => {
    if (isSessionActive) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSessionActive(false);
      onRequestStop();
    }
  }, [isSessionActive, onRequestStop, setIsSessionActive]);

  useEffect(() => {
    if (!isSessionActive) return;

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
  }, [isSessionActive, updateTrayTime, setTime]);

  const timerMinutes = time.minutes.toString().padStart(2, "0");
  const timerSeconds = time.seconds.toString().padStart(2, "0");

  return (
    <>
      <div
        style={{
          borderColor: "rgba(28, 248, 110, 1.0)",
          borderWidth: "2px",
          borderStyle: "solid",
          zIndex: 0,
        }}
        className="p-5 mt-5 space-x-12 flex flex-row items-center justify-center rounded-md"
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

      {isSessionInProgress && tasks.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "300px",
            right: "10px",
            width: "200px",
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "blue",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <h3 className="font-bold mb-2">Session Goals:</h3>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SessionTimer;
