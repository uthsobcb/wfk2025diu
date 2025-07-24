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

  return (
    <div className="font-sans bg-gray-100 text-gray-900 min-h-screen">
      <header className="bg-gray-200 p-4">
        <h1 className="text-3xl font-bold text-center">Game Platform</h1>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer border border-gray-300"
              onClick={() => handleGameClick(game)}
            >
              <Image
                src={game.thumbnail}
                alt={game.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{game.title}</h2>
                <p className="text-gray-600">{game.creator}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}