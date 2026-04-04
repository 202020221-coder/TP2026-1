'use client'

import { useState } from 'react';

import Header from '@/home/components/header';
import Hero from '@/home/components/hero';
import Services from '@/home/components/services';
import Products from '@/home/components/products';
import Features from '@/home/components/features';
import Cart from '@/home/components/cart';
import Footer from '@/home/components/footer';
import Quotes from '../components/quotes';


export interface CartItem {
  id: number,
  name:string,
  price:number,
  type: "product"|"service"
}

export interface Quote {
  id:number,
  name:string,
  description: string,
  price:number,
  date: string,
  status: "pending"|"accepted"|"rejected"
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      name: 'Cotización #001',
      description: 'Inspección anual de sistemas',
      price: 1500,
      date: '2024-11-20',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Cotización #002',
      description: 'Instalación de extintores',
      price: 2500,
      date: '2024-11-19',
      status: 'pending'
    }
  ])
  const [showQuotes, setShowQuotes] = useState(false)

  const handleAddToCart = (item:Omit<CartItem,"id">) => {
    setCartItems([...cartItems, { ...item, id: Math.random() }])
  }

  const handleRemoveFromCart = (itemId:CartItem["id"]) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  const handleAcceptQuote = (quoteId:Quote["id"]) => {
    setQuotes(quotes.map(quote =>
      quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
    ))
  }

  const handleRejectQuote = (quoteId:Quote["id"]) => {
    setQuotes(quotes.map(quote =>
      quote.id === quoteId ? { ...quote, status: 'rejected' } : quote
    ))
  }

  const pendingQuotesCount = quotes.filter(q => q.status === 'pending').length

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={cartItems.length} 
        onCartClick={() => setShowCart(!showCart)}
        quotesCount={pendingQuotesCount}
        onQuotesClick={() => setShowQuotes(!showQuotes)}
      />
      {showCart && (
        <Cart 
          items={cartItems} 
          onRemove={handleRemoveFromCart}
        />
      )}
      {showQuotes && (
        <Quotes 
          quotes={quotes}
          onClose={() => setShowQuotes(false)}
          onAccept={handleAcceptQuote}
          onReject={handleRejectQuote}
        />
      )}
      <Hero />
      <Services onAddToCart={handleAddToCart} />
      <Products onAddToCart={handleAddToCart} />
      <Features />
      <Footer />
    </div>
  )
}
