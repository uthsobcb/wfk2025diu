import Link from "next/link";

export default function NavigationBar() {
    return (
        <nav className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-4 shadow-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-5 flex flex-col items-center justify-between space-y-2 md:space-y-0">

                {/* Main Title Link */}
                <Link href="/" className="text-lg font-bold">
                    <div className="flex items-center justify-center flex-wrap gap-x-2 text-center md:text-left text-sm sm:text-base font-semibold tracking-wide">
                        <p className="flex items-center gap-x-2">
                            <span>🌏</span>
                            <span className="font-bold">2025 WFK ICT Volunteer Program</span>
                            <span>🎓</span>
                            <span>Daffodil International University (DIU)</span>
                            <span>🚀</span>
                        </p>
                    </div>
                </Link>

                {/* Link Buttons */}
                <div className="flex items-center gap-4 text-sm sm:text-base font-bold bg-white/10 px-4 py-2 rounded-xl mt-4">
                    <Link
                        href="/"
                        className="hover:text-yellow-300 transition-colors duration-200 underline-offset-4 hover:underline"
                    >
                        Game Jam
                    </Link>
                    <Link
                        href="/hackathon"
                        className="hover:text-yellow-300 transition-colors duration-200 underline-offset-4 hover:underline"
                    >
                        Hackathon
                    </Link>
                </div>
            </div>
        </nav>
    );
}
