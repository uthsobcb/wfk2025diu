'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import games from '@/lib/games.json';

interface Game {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
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

  return (
    <div className="font-sans bg-gray-100 text-gray-900 min-h-screen">
      <header className="bg-gray-200 p-4">
        <h1 className="text-3xl font-bold text-center">🎮 {game.title}</h1>
        <h2 className='text-xl font-semibold text-center'>🧑‍💻 Created by: {game.creator}</h2>
      </header>
      <main className="p-8">
        <div className="w-full h-[80vh]">
          <iframe
            ref={iframeRef}
            src={gameUrl}
            className="w-full h-full"
            title={game.title}
            onLoad={() => iframeRef.current?.focus()}
          />
        </div>
      </main>
    </div>
  );
}
