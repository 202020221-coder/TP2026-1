import { useState } from "react";
import Header from "@extranet/home/components/header";
import Hero from "@extranet/home/components/hero";
import Services from "@extranet/home/components/services";
import Products from "@extranet/home/components/products";
import Features from "@extranet/home/components/features";
import Footer from "@extranet/home/components/footer";

import { useNavigate } from "react-router";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  type: "product" | "service";
  image: string;
}

export interface Quote {
  id: number;
  name: string;
  description: string;
  price: number;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

export function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    setCartItems([...cartItems, { ...item, id: Math.random() }]);
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLoginRedirect} />
      <Hero />
      <Services onAddToCart={handleAddToCart} />
      <Products onAddToCart={handleAddToCart} />
      <Features />
      <Footer />
    </div>
  );
}
