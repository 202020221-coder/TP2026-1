'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { ShieldAlert, Package } from 'lucide-react'
import type { CartItem } from '../pages/Welcome'

const products = [
  {
    id: 1,
    name: 'Extintor ABC 10kg',
    description: 'Extintor multipropósito certificado',
    price: 89,
    icon: ShieldAlert,
  },
  {
    id: 2,
    name: 'Detector de Humo Inteligente',
    description: 'Sensor conectado con notificaciones',
    price: 49,
    icon: Package,
  },
  {
    id: 3,
    name: 'Luz de Emergencia LED',
    description: 'Iluminación de salida autónoma',
    price: 35,
    icon: Package,
  },
  {
    id: 4,
    name: 'Botiquín de Emergencia',
    description: 'Kit completo para primeros auxilios',
    price: 79,
    icon: Package,
  },
  {
    id: 5,
    name: 'Panel de Control Smart',
    description: 'Sistema de monitoreo centralizado',
    price: 599,
    icon: ShieldAlert,
  },
  {
    id: 6,
    name: 'Equipo de Protección Personal',
    description: 'Set completo de EPP para emergencias',
    price: 129,
    icon: Package,
  },
]

interface Props {
  onAddToCart: (item: Omit<CartItem, "id">) => void
}
export default function Products({ onAddToCart }:Props) {
  return (
    <section id="productos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Productos de Seguridad
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Equipo de alta calidad para protección contra incendios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon
            return (
              <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                <div className="w-12 h-12 bg-accent/15 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg text-secondary mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">${product.price}</span>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-white"
                    onClick={() => onAddToCart({
                      name: product.name,
                      price: product.price,
                      type: 'product'
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
