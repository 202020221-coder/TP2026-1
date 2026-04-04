'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Flame, AlertCircle, Users, Zap } from 'lucide-react'
import CustomService from './custom-service'
import type { CartItem } from '../pages/Welcome'

const services = [
  {
    id: 1,
    name: 'Inspección de Seguridad',
    description: 'Evaluación completa de sistemas contra incendios',
    price: 299,
    icon: AlertCircle,
  },
  {
    id: 2,
    name: 'Instalación de Sistemas',
    description: 'Instalación profesional de alarmas y rociadores',
    price: 1499,
    icon: Zap,
  },
  {
    id: 3,
    name: 'Capacitación de Personal',
    description: 'Entrenamiento de equipo de emergencia',
    price: 599,
    icon: Users,
  },
  {
    id: 4,
    name: 'Mantenimiento Preventivo',
    description: 'Servicio mensual de mantenimiento y revisión',
    price: 399,
    icon: Flame,
  },
]
interface Props {
  onAddToCart: (item: Omit<CartItem, "id">) => void
}
export default function Services({ onAddToCart }:Props) {
  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Servicios profesionales diseñados para proteger tu inversión y garantizar la seguridad
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Servicios del catálogo */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => {
                const IconComponent = service.icon
                return (
                  <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                    <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-secondary mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${service.price}</span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() => onAddToCart({
                          name: service.name,
                          price: service.price,
                          type: 'service'
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

          {/* Servicios Personalizados */}
          <div className="lg:col-span-1">
            <CustomService />
          </div>
        </div>
      </div>
    </section>
  )
}
