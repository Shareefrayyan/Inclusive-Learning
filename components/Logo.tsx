import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  showText?: boolean
}

export default function Logo({ className = "", size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    hero: 'h-24 w-24 sm:h-32 sm:w-32'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl',
    hero: 'text-3xl'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-3">
        {/* TeachAssist Logo - Clean Modern Design */}
        <svg
          className={`${sizeClasses[size]}`}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Graduation Cap */}
          <path 
            d="M32 8L8 20l6 3.5v9L32 42l18-9.5v-9l6-3.5L32 8z" 
            fill="#1e293b"
            stroke="#1e293b" 
            strokeWidth="1"
          />
          <path 
            d="M50 23.5L32 33L14 23.5L32 14l18 9.5z" 
            fill="#334155"
          />
          <path 
            d="M50 32.5l-18 9.5-18-9.5v-6l18 9.5 18-9.5v6z" 
            fill="#1e293b"
          />
          
          {/* Tassel */}
          <line 
            x1="50" y1="23.5" 
            x2="52" y2="26" 
            stroke="#1e293b" 
            strokeWidth="2"
          />
          <circle cx="52" cy="27" r="1.5" fill="#1e293b"/>
          
          {/* Open Book */}
          <path 
            d="M16 36c0-2 4-3 8-3s8 1 8 3v16c0 1-4 2-8 2s-8-1-8-2V36z" 
            fill="#f97316"
          />
          <path 
            d="M32 36c0-2 4-3 8-3s8 1 8 3v16c0 1-4 2-8 2s-8-1-8-2V36z" 
            fill="#ea580c"
          />
          
          {/* Book binding/center */}
          <line 
            x1="32" y1="36" 
            x2="32" y2="52" 
            stroke="#dc2626" 
            strokeWidth="1"
          />
          
          {/* Pen Nib integrated in center */}
          <path 
            d="M28 40l4-2 4 2v8l-4 2-4-2V40z" 
            fill="#1e293b"
          />
          <path 
            d="M30 42l2-1 2 1v4l-2 1-2-1v-4z" 
            fill="#374151"
          />
          <circle cx="32" cy="44" r="1" fill="#f59e0b"/>
          
          {/* Book pages lines */}
          <line x1="20" y1="40" x2="28" y2="40" stroke="#fbbf24" strokeWidth="0.5"/>
          <line x1="20" y1="42" x2="28" y2="42" stroke="#fbbf24" strokeWidth="0.5"/>
          <line x1="20" y1="44" x2="28" y2="44" stroke="#fbbf24" strokeWidth="0.5"/>
          <line x1="36" y1="40" x2="44" y2="40" stroke="#fb923c" strokeWidth="0.5"/>
          <line x1="36" y1="42" x2="44" y2="42" stroke="#fb923c" strokeWidth="0.5"/>
          <line x1="36" y1="44" x2="44" y2="44" stroke="#fb923c" strokeWidth="0.5"/>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold text-slate-800 ${textSizeClasses[size]}`}>
          TeachAssist
        </span>
      )}
    </div>
  )
} 