import React, { useState } from 'react';
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

  useInterval(() => {
    setMainTime(mainTime - 1);
  }, 1000);

  return (
    <div className="pomodoro">
      <h3>You are: working</h3>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button>Init</Button>
        <Button>Reset</Button>
        <Button>Stop</Button>
      </div>
      <div className="details">
        <p>Working description</p>
      </div>
    </div>
  );
}
