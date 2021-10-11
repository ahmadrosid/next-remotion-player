import type { NextPage } from 'next'
import { Player, PlayerRef } from '@remotion/player';
import { useEffect, useRef, useState } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

type Props = {
  title: string;
  bgColor: string;
  color: string;
};

const CarSlideshow = ({ title, bgColor, color }: Props) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const left = interpolate(frame, [0, durationInFrames], [width, width * -1]);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: width,
        height: height,
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <h1
        style={{
          fontSize: '5em',
          fontWeight: 'bold',
          position: 'absolute',
          top: height / 2 - 100,
          left,
          color: color,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h1>
    </div>
  );
};
const Home: NextPage = () => {
  const [title, setTitle] = useState('Hello World');
  const [color, setColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [loop, setLoop] = useState(false);
  const [doubleClickToFullscreen, setDoubleClickToFullscreen] = useState(true);
  const [clickToPlay, setClickToPlay] = useState(true);
  const [logs, setLogs] = useState<string[]>(() => []);
  const [spaceKeyToPlayOrPause, setspaceKeyToPlayOrPause] = useState(true);

  const ref = useRef<PlayerRef>(null);

  useEffect(() => {
    ref.current?.addEventListener('play', () => {
      setLogs((l) => [...l, 'playing ' + Date.now()]);
    });
    ref.current?.addEventListener('pause', () => {
      setLogs((l) => [...l, 'pausing ' + Date.now()]);
    });
    ref.current?.addEventListener('seeked', (e) => {
      setLogs((l) => [...l, 'seeked to ' + e.detail.frame + ' ' + Date.now()]);
    });
    ref.current?.addEventListener('ended', (e) => {
      setLogs((l) => [...l, 'ended ' + Date.now()]);
    });
    ref.current?.addEventListener('error', (e) => {
      setLogs((l) => [...l, 'error ' + Date.now()]);
    });
    ref.current?.addEventListener('timeupdate', (e) => {
      setLogs((l) => [...l, 'timeupdate ' + e.detail.frame]);
    });
  }, []);

  return (
    <div style={{ margin: '2rem', display: 'flex', justifyContent: 'center', columnGap: '16px' }}>
      <div>
        <Player
          ref={ref}
          compositionWidth={500}
          compositionHeight={432}
          fps={30}
          durationInFrames={500}
          component={CarSlideshow}
          controls
          doubleClickToFullscreen={doubleClickToFullscreen}
          loop={loop}
          showVolumeControls={true}
          clickToPlay={clickToPlay}
          inputProps={{
            title: String(title),
            bgColor: String(bgColor),
            color: String(color),
          }}
          spaceKeyToPlayOrPause={spaceKeyToPlayOrPause}
        />
      </div>

      <div>
        <div style={{ paddingTop: '0.5rem' }}>
            Enter Text{' '}
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        <div style={{ paddingTop: '0.5rem' }}>
          <div>
            Select Text Color{' '}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div>
            Select Background Color{' '}
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
        </div>

        <br />
        <button type="button" onClick={(e) => ref.current?.play(e)}>
          Play
        </button>
        <button type="button" onClick={() => ref.current?.pause()}>
          Pause
        </button>
        <button type="button" onClick={() => ref.current?.mute()}>
          Mute
        </button>
        <button type="button" onClick={() => ref.current?.unmute()}>
          Unmute
        </button>

        <button type="button" onClick={() => ref.current?.toggle()}>
          toggle
        </button>
        <button type="button" onClick={() => ref.current?.seekTo(50)}>
          seekTo 50
        </button>
        <button type="button" onClick={() => ref.current?.seekTo(10)}>
          seekTo 10
        </button>
        <br />
        <button type="button" onClick={() => ref.current?.setVolume(0)}>
          set volume to 0
        </button>
        <button type="button" onClick={() => ref.current?.setVolume(0.5)}>
          set volume to 0.5
        </button>
        <button type="button" onClick={() => ref.current?.setVolume(1)}>
          set volume to 1
        </button>
        <button type="button" onClick={() => setLoop((l) => !l)}>
          loop = {String(loop)}
        </button>
        <br />
        <button type="button" onClick={() => setClickToPlay((l) => !l)}>
          clickToPlay = {String(clickToPlay)}
        </button>
        <button
          type="button"
          onClick={() => setDoubleClickToFullscreen((l) => !l)}
        >
          doubleClickToFullscreen = {String(doubleClickToFullscreen)}
        </button>
        <button
          type="button"
          onClick={() =>
            setLogs((l) => [
              ...l,
              `currentFrame = ${ref.current?.getCurrentFrame()}`,
            ])
          }
        >
          log currentFrame
        </button>
        <br />

        <button
          type="button"
          onClick={() =>
            setLogs((l) => [...l, `muted = ${ref.current?.isMuted()}`])
          }
        >
          log muted
        </button>
        <button
          type="button"
          onClick={() =>
            setLogs((l) => [...l, `volume = ${ref.current?.getVolume()}`])
          }
        >
          log volume
        </button>
        <button type="button" onClick={() => setspaceKeyToPlayOrPause((l) => !l)}>
          spaceKeyToPlayOrPause = {String(spaceKeyToPlayOrPause)}
        </button>
        <button
          type="button"
          onClick={() => {
            ref.current?.pause();
            ref.current?.seekTo(50);
          }}
        >
          pause and seek
        </button>
      </div>
    </div>
  );
}

export default Home
