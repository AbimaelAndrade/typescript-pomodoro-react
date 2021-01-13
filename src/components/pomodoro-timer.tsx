/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';
import { useInterval } from '../hooks/set-interval';
import { generateArrayCycles } from '../utils/generateArrayCycles';
import { secondsToMinutes } from '../utils/secondsToMinutes';
import { secondsToTime } from '../utils/secondsToTime';
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

  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    generateArrayCycles(cycles),
  );
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [completeCycles, setCompleteCycles] = useState(0);

  const [audioStart] = useSound(bellStart);
  const [audioFinish] = useSound(bellFinish);
  const [audioPlay] = useSound(playSound);
  const [audioPause] = useSound(pauseSound);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) {
        setFullWorkingTime(fullWorkingTime + 1);
      }
    },
    timeCounting ? 1000 : null,
  );

  useEffect(() => {
    if (timeCounting) {
      audioPause();
      setPlayPauseText('Pause');
    } else {
      audioPlay();
      setPlayPauseText('Play');
    }
  }, [timeCounting, audioPause, audioPlay]);

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(pomodoroTimer);
    audioStart();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    audioStart,
    pomodoroTimer,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(longRestTime);
      } else {
        setMainTime(shortRestTime);
      }

      audioFinish();
    },
    [audioFinish, longRestTime, shortRestTime],
  );

  const configureLabelStatus = useCallback(() => {
    if (!timeCounting) return 'Pomodoro pausado';
    if (working) return 'Foco! Você está Trabalhado';
    if (resting) return 'Hora do descanso';
  }, [working, resting, timeCounting]);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(generateArrayCycles(cycles));
      setCompleteCycles(completeCycles + 1);
    }

    if (working) {
      setNumberOfPomodoros(numberOfPomodoros + 1);
    }
    if (resting) configureWork();
  }, [
    working,
    resting,
    cyclesQtdManager,
    configureRest,
    cycles,
    completeCycles,
    setCompleteCycles,
    setNumberOfPomodoros,
    numberOfPomodoros,
    pomodoroTimer,
    mainTime,
    configureWork,
  ]);

  return (
    <div className="pomodoro">
      <h3>
        {!working && !resting
          ? 'Aguardando início do pomodoro'
          : configureLabelStatus()}
      </h3>
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
        <p>Ciclos comcluídos: {completeCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
