import React from 'react';
import { secondsToTime } from '../utils/secondsToTime';

interface Props {
  mainTime: number;
}

export function Timer({ mainTime }: Props): JSX.Element {
  return <div className="timer">{secondsToTime(mainTime)}</div>;
}
