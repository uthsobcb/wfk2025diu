'use client';
import Image from "next/image";
import games from "@/lib/games.json";
import { useRouter } from 'next/navigation';

export default function Home() {
  interface Game {
    id: string;
    title: string;
    creator: string;
    thumbnail: string;
  }

  const router = useRouter();

  const handleGameClick = (game: Game) => {
    router.push(`/games/${game.id}`);
  };

  return (
    <div className="font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen">
      <header className="bg-white/5 backdrop-blur-sm border-b border-blue-500/20 p-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
          🎲 Game Jam 🕹️
        </h1>
        <p className="text-center text-lg text-gray-300 max-w-4xl mx-auto">
          This game jam took place at DIU during the <span className="text-blue-400 font-semibold">✨WFK 2025 event✨</span>.
          Individual students were challenged to create a game within 1 hour using Gemini CLI
        </p>
      </header>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game)}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 cursor-pointer h-[280px] transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative h-3/4">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative p-4 bg-gradient-to-r from-slate-800/80 to-blue-800/80 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 truncate">
                    {game.title}
                  </h2>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></span>
                    {game.creator}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

