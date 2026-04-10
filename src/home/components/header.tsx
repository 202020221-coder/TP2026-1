'use client'

import { ShoppingCart, Menu, X, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ cartCount, onCartClick, quotesCount, onQuotesClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll to make the header background more opaque
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pb-2 pointer-events-none">
      <header 
        className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl transition-all duration-300 border ${
          scrolled ? 'glass-effect shadow-xl backdrop-blur-xl' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-lg tracking-tighter">EF</span>
              </div>
              <span className={`text-xl font-bold hidden sm:inline tracking-tight transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}>
                ENGINEER <span className="text-gradient">FIRE</span>
              </span>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Servicios', 'Productos', 'Características', 'Contacto'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${
                    scrolled 
                      ? 'text-muted-foreground hover:text-primary' 
                      : 'text-white/80 hover:text-white drop-shadow-sm'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Quotes Button */}
              <button
                onClick={onQuotesClick}
                className={`relative p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  scrolled ? 'text-foreground hover:bg-black/5 dark:hover:bg-white/10' : 'text-white hover:bg-white/20'
                }`}
                title="Cotizaciones"
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                {quotesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg shadow-amber-500/40 animate-in zoom-in">
                    {quotesCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className={`relative p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  scrolled ? 'text-foreground hover:bg-black/5 dark:hover:bg-white/10' : 'text-white hover:bg-white/20'
                }`}
                title="Carrito"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg shadow-primary/40 animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl transition-colors ${
                  scrolled ? 'text-foreground hover:bg-black/5' : 'text-white hover:bg-white/20'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-4 fade-in">
              <div className="pt-2 border-t border-border/50">
                {['Servicios', 'Productos', 'Características', 'Contacto'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`} 
                    className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      scrolled ? 'text-foreground hover:bg-black/5' : 'text-white hover:bg-white/20'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
    </div>
  )
}
