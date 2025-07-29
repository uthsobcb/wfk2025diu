'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [guestCount, setGuestCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images data
  const heroImages = [
    {
      src: "/wfkhero.jpeg",
      alt: "World Friend Korea ICT Volunteer Program - Korean experts and Bangladeshi students working together"
    },
    {
      src: "/wfk-hero2.jpeg",
      alt: "Technology training session with Korean volunteers"
    },
    {
      src: "/wfk-hero3.jpg",
      alt: "Cultural exchange and collaboration"
    },
    {
      src: "/wfk-hero3.jpeg",
      alt: "Students presenting their ICT projects"
    }
  ];

  // Counter animation effect
  useEffect(() => {
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    const timer = setTimeout(() => {
      animateCounter(4, setGuestCount);
      animateCounter(30, setStudentCount);
      animateCounter(3, setWeekCount);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide effect for hero images
  useEffect(() => {
    const heroSlideTimer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(heroSlideTimer);
  }, [heroImages.length]);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToHeroSlide = (index: number) => {
    setCurrentHeroSlide(index);
  };

  // Auto-slide effect for gallery
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideTimer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const galleryItems = [
    { type: 'image', src: '/gallery/0.jpg', alt: 'ICT Training Session' },
    { type: 'image', src: '/gallery/1.jpg', alt: 'ICT Training Session' },
    { type: 'image', src: '/gallery/1.5.jpeg', alt: 'ICT Training Session' },
    { type: 'image', src: '/gallery/2.jpg', alt: 'Technology Workshop' },
    { type: 'image', src: '/gallery/2.jpg', alt: 'Student Presentations' },
    { type: 'image', src: '/gallery/3.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/4.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/5.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/6.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/7.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/8.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/9.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/10.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/11.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/12.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/13.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/14.jpg', alt: 'Korean-Bangladeshi Collaboration' },
    { type: 'image', src: '/gallery/15.jpg', alt: 'Korean-Bangladeshi Collaboration' },

  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mt-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              World Friend Korea
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold mb-8 text-gray-200">
              ICT Volunteer Program 2025
            </h2>

            {/* Hero Image Carousel */}
            <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-96 md:h-96">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {/* Hero Navigation Arrows */}
                <button
                  onClick={prevHeroSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextHeroSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Hero Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToHeroSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentHeroSlide
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/70'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Bridging cultures through technology training, empowering students with latest ICT skills
              at Daffodil International University
            </p>
          </div>

          {/* Statistics Counter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                {guestCount}
              </div>
              <div className="text-xl font-semibold text-gray-200">Experts</div>
              <div className="text-gray-400 mt-2">ICT Volunteers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-teal-400/50 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">
                {studentCount}
              </div>
              <div className="text-xl font-semibold text-gray-200">Students</div>
              <div className="text-gray-400 mt-2">Trained</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                {weekCount}
              </div>
              <div className="text-xl font-semibold text-gray-200">Weeks</div>
              <div className="text-gray-400 mt-2">Intensive Training</div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Program Highlights
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Comprehensive ICT training program combining latest technology education with meaningful cultural exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">Latest Technology Training</h3>
              <p className="text-gray-300">Hands-on learning with cutting-edge development tools, frameworks, and industry best practices</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-teal-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-3 text-teal-300">Cultural Exchange</h3>
              <p className="text-gray-300">Building bridges between Korean and Bangladeshi tech communities through shared learning</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">ICT Skills Development</h3>
              <p className="text-gray-300">Comprehensive training in programming, web development, and modern software engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Program Gallery
            </h2>
            <p className="text-xl text-gray-300">
              Capturing moments from our incredible training journey and cultural exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative h-64">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm">{item.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Program Activities
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Explore the various projects and activities from our intensive training program
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/games"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-300 group-hover:text-blue-200">Game Development Jam</h3>
              <p className="text-gray-300">1-hour game development challenge using Gemini CLI and modern tools</p>
            </Link>
            <Link
              href="/portfolio"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-6xl mb-4">🤵‍♂️</div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-300 group-hover:text-blue-200">Portfolio</h3>
              <p className="text-gray-300">Showcasing awesome builds projects in unique way by students.</p>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
