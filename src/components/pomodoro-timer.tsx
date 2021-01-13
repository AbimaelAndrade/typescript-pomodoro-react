/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { useInterval } from '../hooks/set-interval';
import { Button } from './button';
import { Timer } from './timer';

const bellStart = require('../sounds/bell-start.mp3');
const bellFinish = require('../sounds/bell-finish.mp3');
const playSound = require('../sounds/switch-off.mp3');
const pauseSound = require('../sounds/switch-on.mp3');

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
  const [playPauseText, setPlayPauseText] = useState('Pause');
  const [audioStart] = useSound(bellStart);
  const [audioFinish] = useSound(bellFinish);
  const [audioPlay] = useSound(playSound);
  const [audioPause] = useSound(pauseSound);

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

  useEffect(() => {
    if (timeCounting) {
      audioPause();
      setPlayPauseText('Pause');
    } else {
      audioPlay();
      setPlayPauseText('Play');
    }
  }, [timeCounting]);

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(pomodoroTimer);
    audioStart();
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

    audioFinish();
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
          {playPauseText}
        </Button>
      </div>
      <div className="details">
        <p>Working description</p>
      </div>
    </div>
  );
}
