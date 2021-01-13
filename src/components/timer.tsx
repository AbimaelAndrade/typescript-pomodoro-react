import React from 'react';
import { secondsToMinutes } from '../utils/secondsToMinutes';

interface Props {
  mainTime: number;
}

export function Timer({ mainTime }: Props): JSX.Element {
  return <div className="timer">{secondsToMinutes(mainTime)}</div>;
}
