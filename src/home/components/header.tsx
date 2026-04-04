"use client";

import { ShoppingCart, Menu, X, FileText } from "lucide-react";
import { useState } from "react";

interface Props {
  cartCount: number;
  quotesCount: number;
  onCartClick: () => void;
  onQuotesClick: () => void;
}

export default function Header({
  cartCount,
  onCartClick,
  quotesCount,
  onQuotesClick,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur supports-backdrop-filter:bg-secondary/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                EF
              </span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">
              ENGINEER FIRE
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#servicios"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Servicios
            </a>
            <a
              href="#productos"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Productos
            </a>
            <a
              href="#caracteristicas"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Características
            </a>
            <a
              href="#contacto"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Quotes Button */}
            <button
              onClick={onQuotesClick}
              className="relative p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              title="Cotizaciones"
            >
              <FileText className="w-6 h-6" />
              {quotesCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {quotesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              title="Carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
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
          <nav className="md:hidden pb-4 space-y-2">
            <a
              href="#servicios"
              className="block px-2 py-2 text-sm font-medium hover:text-primary"
            >
              Servicios
            </a>
            <a
              href="#productos"
              className="block px-2 py-2 text-sm font-medium hover:text-primary"
            >
              Productos
            </a>
            <a
              href="#caracteristicas"
              className="block px-2 py-2 text-sm font-medium hover:text-primary"
            >
              Características
            </a>
            <a
              href="#contacto"
              className="block px-2 py-2 text-sm font-medium hover:text-primary"
            >
              Contacto
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
