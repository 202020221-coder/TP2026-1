'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { ShieldAlert, Package, Flame, Siren, Lightbulb, Box } from 'lucide-react'
import type { CartItem } from '../pages/HomePage'

const products = [
  {
    id: 1,
    name: 'Extintor ABC 10kg',
    description: 'Extintor multipropósito certificado para diversas clases de fuego',
    price: 89,
    icon: Flame,
  },
  {
    id: 2,
    name: 'Detector de Humo Inteligente',
    description: 'Sensor conectado con notificaciones push en tiempo real',
    price: 49,
    icon: Siren,
  },
  {
    id: 3,
    name: 'Luz de Emergencia LED',
    description: 'Iluminación autónoma de alta visibilidad comercial',
    price: 35,
    icon: Lightbulb,
  },
  {
    id: 4,
    name: 'Botiquín de Emergencia',
    description: 'Kit completo para primeros auxilios grado industrial',
    price: 79,
    icon: Box,
  },
  {
    id: 5,
    name: 'Panel de Control Smart',
    description: 'Sistema de monitoreo centralizado con alertas IA',
    price: 599,
    icon: ShieldAlert,
  },
  {
    id: 6,
    name: 'Equipo de Protección Personal',
    description: 'Set completo de EPP ignífugo para emergencias extremas',
    price: 129,
    icon: Package,
  },
]

interface Props {
  onAddToCart: (item: Omit<CartItem, "id">) => void
}
export default function Products({ onAddToCart }: Props) {
  return (
    <section id="productos" className="py-24 bg-muted/30 relative">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 block">Catálogo Premium</span>
          <h2 className="text-4xl sm:text-5xl font-black text-secondary mb-6 tracking-tight">
            Productos de <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Seguridad</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Equipo de altísima calidad certificado bajo normativas internacionales para una protección contra incendios invulnerable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon
            return (
              <Card
                key={product.id}
                className="group p-8 rounded-2xl bg-card border-border hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] group-hover:bg-accent/10 transition-colors duration-300" />

                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-xl text-secondary mb-3">{product.name}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-3xl font-black text-secondary">${product.price}</span>
                  <Button
                    className="bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors rounded-xl px-6"
                    onClick={() => onAddToCart({
                      name: product.name,
                      price: product.price,
                      type: 'product',
                      image: ''
                    })}
                  >
                    Agregar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
