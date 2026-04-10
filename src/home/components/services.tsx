'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Flame, AlertCircle, Users, Zap } from 'lucide-react'
import CustomService from './custom-service'

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

export default function Services({ onAddToCart }) {
  return (
    <section id="servicios" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Nuestra Especialidad</span>
          <h2 className="text-4xl sm:text-5xl font-black text-secondary mb-6 tracking-tight">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Servicios altamente profesionales diseñados para proteger tu inversión y garantizar la seguridad absoluta.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Servicios del catálogo */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card 
                    key={service.id} 
                    className="group p-8 rounded-2xl bg-card border-border hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl text-secondary mb-3">{service.name}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-3xl font-black text-secondary">${service.price}</span>
                      <Button
                        className="bg-secondary text-white hover:bg-primary transition-colors rounded-xl px-6"
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
            <CustomService onAddToCart={onAddToCart} />
          </div>
        </div>
      </div>
    </section>
  )
}
