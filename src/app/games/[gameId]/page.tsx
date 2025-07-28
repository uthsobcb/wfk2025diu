'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import games from '@/lib/games.json';
import Link from 'next/link';

interface Game {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  video?: string;
  live?: string;
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
    return (
      <div className="font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Game not found</h1>
          <Link href="/games" className="text-blue-400 hover:text-blue-300 underline mt-4 inline-block">
            ← Back to Game Jam
          </Link>
        </div>
      </div>
    );
  }

  const gameUrl = `/games/${game.id}/index.html`;
  const isYouTubeVideo = game.video?.includes('youtube.com') || game.video?.includes('youtu.be');

  return (
    <div className="font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen">
      <header className="bg-white/5 backdrop-blur-sm border-b border-blue-500/20 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
            🎮 {game.title}
          </h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            🧑‍💻 Created by: <span className="text-blue-300">{game.creator}</span>
          </h2>
          {game.live && (
            <div className="inline-flex items-center gap-2">
              <Link
                href={game.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span>📎</span>
                <span>Play Live</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="w-full h-[80vh] flex justify-center items-center">
              {game.video ? (
                <div className="flex flex-col items-center justify-center w-full h-full p-8">
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6 max-w-2xl">
                    <p className="text-center text-gray-300">
                      This game is not playable in the browser. Watch a gameplay video instead! 🎬
                    </p>
                  </div>
                  {isYouTubeVideo ? (
                    <iframe
                      width="100%"
                      height="100%"
                      className="aspect-video rounded-lg shadow-lg"
                      src={convertToEmbedUrl(game.video)}
                      title="YouTube gameplay video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls autoPlay className="w-full h-full object-contain rounded-lg shadow-lg">
                      <source src={game.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={gameUrl}
                  className="w-full h-full rounded-lg"
                  title={game.title}
                  onLoad={() => iframeRef.current?.focus()}
                />
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <span>←</span>
              <span>Back to Game Jam</span>
            </Link>
          </div>
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
