'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Flame, Users, Zap, ShieldCheck, Settings, Droplets, Wind, Cylinder, Truck, Bell, Waves } from 'lucide-react'
import type { CartItem } from '../pages/HomePage'

const services = [
  { id: 1, name: 'Sistemas preventivos contra incendios', description: 'Redes de rociadores, hidrantes y gabinetes certificados.', price: 599, image: '/sistemas_preventivos_1775863722285.png', icon: ShieldCheck },
  { id: 2, name: 'Alquiler de Grupo Electrógeno MP-55', description: 'Energía de respaldo continua para sistemas críticos.', price: 899, image: '/grupo_electrogeno_1775863736106.png', icon: Zap },
  { id: 3, name: 'Sistema de Detección de Incendios', description: 'Paneles inteligentes y detectores de humo de alta precisión.', price: 450, image: '/deteccion_incendios_1775863750035.png', icon: Bell },
  { id: 4, name: 'Sistema de bombeo', description: 'Equipos de bombeo de gran capacidad para redes contra incendios.', price: 1200, image: '/sistema_bombeo_1775863772149.png', icon: Waves },
  { id: 5, name: 'Alquiler de camiones', description: 'Cisternas y unidades de respuesta equipadas para emergencias.', price: 1500, image: '/alquiler_camiones_1775863788061.png', icon: Truck },
  { id: 6, name: 'Brigadas de Bomberos', description: 'Personal altamente capacitado para respuesta inmediata.', price: 950, image: '/brigada_bomberos_1775863804644.png', icon: Users },
  { id: 7, name: 'Servicio de Ranurado', description: 'Preparación técnica de tuberías para sistemas de acople rápido.', price: 150, icon: Settings },
  { id: 8, name: 'Servicio de Termofusión', description: 'Soldadura de tuberías HDPE para redes subterráneas.', price: 200, icon: Flame },
  { id: 9, name: 'Alquiler de Sistemas de Espuma', description: 'Supresión especializada para incendios de líquidos inflamables.', price: 400, icon: Droplets },
  { id: 10, name: 'Alquiler de Bombas Contra Incendios', description: 'Bombas portátiles y estacionarias para refuerzo de caudal.', price: 350, icon: Wind },
  { id: 11, name: 'Recarga de Botellas de Aire Autocontenido', description: 'Servicio de llenado certificado para equipos de respiración.', price: 80, icon: Cylinder },
]

interface Props {
  onAddToCart: (item: Omit<CartItem, "id">) => void
}

export default function Services({ onAddToCart }: Props) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card 
                key={service.id} 
                className="group flex flex-col rounded-2xl bg-card border-border hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-8 pt-0 -mt-8 relative z-10 flex-1 flex flex-col">
                  <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="font-bold text-xl text-secondary mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">{service.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
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
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
