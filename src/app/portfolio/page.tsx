import React from 'react'

interface Person {
    name: string;
    githubUrl: string;
}

const people: Person[] = [
    {
        name: "Jihyuk Lee",
        githubUrl: "https://potatodevel0per.github.io/portfolio_website/"
    },
    {
        name: "Uthsob Chakraborty",
        githubUrl: "https://uthsob.me"
    },
    {
        name: "Sihab",
        githubUrl: "https://shihab69.github.io/portfolio/"
    },
    {
        name: "Md Sameul Hasan ",
        githubUrl: "https://sameul-hasan.github.io/Portfolio/"
    },
    {
        name: "Mostafic Yellahy Nahid",
        githubUrl: "https://mostaficnahid.github.io/My-Portfolio/"
    },
    {
        name: "Meherose Hossain Tasnia",
        githubUrl: "https://mhtasnia.github.io/Portfolio/"
    }
];

export default function page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xl text-white max-w-2xl mx-auto">
                        Discover amazing participants who created their own portfolio websites during the <span className="text-blue-400">✨WFK 2025 event!✨</span>
                    </p>
                </div>

                {/* People Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {people.map((person, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                        >
                            {/* Card Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                {/* Profile Avatar */}
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <span className="text-white text-xl font-bold">
                                        {person.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>

                                {/* Person Name */}
                                <h3 className="text-2xl font-semibold text-white mb-6 text-center group-hover:text-blue-300 transition-colors duration-300">
                                    {person.name}
                                </h3>

                                {/* GitHub Link */}
                                <div className="text-center">
                                    <a
                                        href={person.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                        <span>Visit Website</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
