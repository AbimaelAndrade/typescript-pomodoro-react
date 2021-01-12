import React, { useState, useEffect } from 'react';
import { useInterval } from '../hooks/set-interval';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  pomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer({
  pomodoroTimer,
  shortRestTime,
  longRestTime,
  cycles,
}: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(pomodoroTimer);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null,
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
  }, [working]);

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(pomodoroTimer);
  };

  const configureRest = (long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (long) {
      setMainTime(longRestTime);
    } else {
      setMainTime(shortRestTime);
    }
  };

  return (
    <div className="pomodoro">
      <h3>You are: working</h3>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button onClick={configureWork}>Work</Button>
        <Button onClick={() => configureRest(false)}>Rest</Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          onClick={() => setTimeCounting(!timeCounting)}
        >
          {timeCounting ? 'Pause' : 'Play'}
        </Button>
      </div>
      <div className="details">
        <p>Working description</p>
      </div>
    </div>
  );
}
