'use client'
import { useState, useEffect } from 'react'

export default function Page() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const targetDate = new Date('2025-07-29T00:00:00').getTime()

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const difference = targetDate - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center space-y-6 p-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-white mb-4">
                        Coming Soon
                    </h1>
                    <p className="text-xl text-gray-300 max-w-md mx-auto">
                        Final Showcasing is expected to be on 29 July 2025. It will be updated on time
                    </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                        <div className="text-sm text-gray-300">Days</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                        <div className="text-sm text-gray-300">Hours</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                        <div className="text-sm text-gray-300">Minutes</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                        <div className="text-sm text-gray-300">Seconds</div>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="animate-pulse w-2 h-2 bg-purple-400 rounded-full delay-75"></div>
                    <div className="animate-pulse w-2 h-2 bg-pink-400 rounded-full delay-150"></div>
                </div>
            </div>
        </div>
    )
}
