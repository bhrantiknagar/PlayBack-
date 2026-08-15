import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Slider } from '../ui/Slider';
import { formatTime } from '../../utils/formatTime';

export function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();

  const handleSeekChange = (e) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="playback-progress-wrap">
      <span className="time-stamp">{formatTime(currentTime)}</span>
      <Slider
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={handleSeekChange}
      />
      <span className="time-stamp" style={{ textAlign: 'right' }}>
        {formatTime(duration)}
      </span>
    </div>
  );
}
