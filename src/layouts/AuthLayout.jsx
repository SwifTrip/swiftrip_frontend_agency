// src/layouts/AuthLayout.jsx
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import HeroImage from '../assets/hero.jpg';

export default function AuthLayout({ children, mode = 'register' }) {
  const isLogin = mode === 'login';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-1/3 w-56 h-56 bg-purple-200 rounded-full opacity-25 blur-3xl"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✈️</span>
            </div>
            <span className="text-xl font-bold text-gray-800">SwiftTrip</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 font-medium transition">Home</a>
            <a href="/pricing" className="text-gray-700 hover:text-gray-900 font-medium transition">Pricing</a>
            <a href="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition">Contact</a>
            <a href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium transition">Login</a>
          </div>

          {/* Get Started Button */}
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 mt-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              <h1 className="text-3xl font-bold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {isLogin 
                  ? 'Sign in to continue your journey with SwiftTrip' 
                  : 'Join SwiftTrip and transform your travel agency'}
              </p>

              <div className="mt-8">
                {children ? children : <RegisterForm />}
              </div>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="hidden lg:block w-full mt-6">
            <div className="relative max-w-xl mx-auto">
              {/* Main image card with overlay text */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl -mt-5">
                <img 
                  src={HeroImage}
                  alt="Travel destination" 
                  className="w-full h-[550px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop';
                  }}
                />
                
                {/* Text overlay at bottom */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Start Your Journey
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Discover amazing destinations with SwiftTrip
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 animate-bounce" style={{animationDuration: '3s'}}>
                <span className="text-2xl">🎫</span>
              </div>
              <div className="absolute top-1/4 -right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-12">
                <span className="text-white text-xl">✨</span>
              </div>
              <div className="absolute -bottom-6 right-1/4 w-12 h-12 bg-cyan-400 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-xl">🌍</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating decorative icons in corners */}
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-purple-500 rounded-full shadow-lg flex items-center justify-center">
        <span className="text-white text-xl">💬</span>
      </div>
      <div className="absolute bottom-8 right-8 w-12 h-12 bg-pink-500 rounded-full shadow-lg flex items-center justify-center">
        <span className="text-white text-xl">💎</span>
      </div>
    </div>
  );
}