'use client';
import Image from "next/image";
import games from "@/lib/games.json";
import { useState } from "react";
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

  const getGridClass = (index: number) => {
    if (index === 0) return "sm:col-span-4 row-span-2";
    if (index === 1) return "sm:col-span-2 row-span-1";
    return "sm:col-span-3 row-span-1";
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-900 min-h-screen">
      <header className="bg-gray-200 p-4">
        <h1 className="text-3xl font-bold text-center">🎲 GameJam 🕹️</h1>
        <p className="text-center mt-4">This gamejam was took place at DIU, during the WFK 2025 event. Individual Students required to create a game within 1 hour using Gemnini CLI</p>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-6 auto-rows-[200px] gap-6 p-6">
          {games.map((game, index) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className={`${getGridClass(index)} relative rounded-xl overflow-hidden shadow-md cursor-pointer`}
            >
              <Image
                src={game.thumbnail}
                alt={game.title}
                fill
                className="object-cover w-fit h-fit"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/60 p-4 text-white">
                <h2 className={index === 0 ? "text-xl font-bold" : "text-md font-semibold"}>{game.title}</h2>
                <p className="text-sm">{game.creator}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
