'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import games from '@/lib/games.json';

interface Game {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  video?: string; // Can be YouTube link or MP4 file
}

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [game, setGame] = useState<Game | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const foundGame = games.find((g) => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
    }
  }, [gameId]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [game]);

  if (!game) {
    return <div>Game not found</div>;
  }

  const gameUrl = `/games/${game.id}/index.html`;

  const isYouTubeVideo = game.video?.includes('youtube.com') || game.video?.includes('youtu.be');

  return (
    <div className="font-sans bg-gray-100 text-gray-900 min-h-screen">
      <header className="bg-gray-200 p-4">
        <h1 className="text-3xl font-bold text-center">🎮 {game.title}</h1>
        <h2 className="text-xl font-semibold text-center">🧑‍💻 Created by: {game.creator}</h2>
      </header>
      <main className="p-8">
        <div className="w-full h-[80vh] flex justify-center items-center">
          {game.video ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="mb-4 text-center">This game is not playable in the browser. Watch a gameplay instead!</p>
              {isYouTubeVideo ? (
                <iframe
                  width="100%"
                  height="100%"
                  className="aspect-video"
                  src={convertToEmbedUrl(game.video)}
                  title="YouTube gameplay video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls autoPlay className="w-full h-full object-contain">
                  <source src={game.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={gameUrl}
              className="w-full h-full"
              title={game.title}
              onLoad={() => iframeRef.current?.focus()}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// 🔁 Converts normal YouTube URL to embeddable form
function convertToEmbedUrl(url: string): string {
  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  } else if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}
