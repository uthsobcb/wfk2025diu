import Link from "next/link";

export default function NavigationBar() {
    return (
        <nav className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-4 shadow-xl sticky top-0 z-50 backdrop-blur-sm border-b border-blue-500/20">
            <div className="max-w-6xl mx-auto px-5 flex flex-col items-center justify-between space-y-2 md:space-y-0">

                <Link href="/" className="text-lg font-bold group">
                    <div className="flex items-center justify-center flex-wrap gap-x-2 text-center md:text-left text-sm sm:text-base font-semibold tracking-wide group-hover:text-blue-200 transition-colors duration-300">
                        <p className="flex items-center gap-x-2">
                            <span>🌏</span>
                            <span className="font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">2025 WFK ICT Volunteer Program</span>
                            <span>🎓</span>
                            <span>Daffodil International University (DIU)</span>
                            <span>🚀</span>
                        </p>
                    </div>
                </Link>

                {/* Link Buttons */}
                <div className="flex items-center gap-4 text-sm sm:text-base font-bold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl mt-4 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                    <Link
                        href="/"
                        className="hover:text-blue-300 transition-colors duration-200 underline-offset-4 hover:underline px-2 py-1 rounded hover:bg-blue-500/20"
                    >
                        Home
                    </Link>
                    <Link
                        href="/games"
                        className="hover:text-blue-300 transition-colors duration-200 underline-offset-4 hover:underline px-2 py-1 rounded hover:bg-blue-500/20"
                    >
                        Game Jam
                    </Link>
                    <Link
                        href="/portfolio"
                        className="hover:text-teal-300 transition-colors duration-200 underline-offset-4 hover:underline px-2 py-1 rounded hover:bg-teal-500/20"
                    >
                        Portfolio
                    </Link>

                </div>
            </div>
        </nav>
    );
}
