'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Flame, Users, Zap, ShieldCheck, Settings, Droplets, Wind, Cylinder, Truck, Bell, Waves, Check, X } from 'lucide-react'
import type { CartItem } from '../pages/HomePage'

const services = [
  { id: 1, name: 'Sistemas preventivos contra incendios', description: 'Redes de rociadores, hidrantes y gabinetes certificados.', image: '/sistemas_preventivos_1775863722285.png', icon: ShieldCheck },
  { id: 2, name: 'Alquiler de Grupo Electrógeno MP-55', description: 'Energía de respaldo continua para sistemas críticos.', image: '/grupo_electrogeno_1775863736106.png', icon: Zap },
  { id: 3, name: 'Sistema de Detección de Incendios', description: 'Paneles inteligentes y detectores de humo de alta precisión.', image: '/deteccion_incendios_1775863750035.png', icon: Bell },
  { id: 4, name: 'Sistema de bombeo', description: 'Equipos de bombeo de gran capacidad para redes contra incendios.', image: '/sistema_bombeo_1775863772149.png', icon: Waves },
  { id: 5, name: 'Alquiler de camiones', description: 'Cisternas y unidades de respuesta equipadas para emergencias.', image: '/alquiler_camiones_1775863788061.png', icon: Truck },
  { id: 6, name: 'Brigadas de Bomberos', description: 'Personal altamente capacitado para respuesta inmediata.', image: '/brigada_bomberos_1775863804644.png', icon: Users },
  { id: 7, name: 'Servicio de Ranurado', description: 'Preparación técnica de tuberías para sistemas de acople rápido.', image: '/Servicio_Ranurado_20180427151302.png', icon: Settings },
  { id: 8, name: 'Servicio de Termofusión', description: 'Soldadura de tuberías HDPE para redes subterráneas.', image: '/servicio_termofusion.png', icon: Flame },
  { id: 9, name: 'Alquiler de Sistemas de Espuma', description: 'Supresión especializada para incendios de líquidos inflamables.', image: '/sistemas-de-espuma.png', icon: Droplets },
  { id: 10, name: 'Alquiler de Bombas Contra Incendios', description: 'Bombas portátiles y estacionarias para refuerzo de caudal.', image: '/Bombas_ContraIncendios_20180427145918.png', icon: Wind },
  { id: 11, name: 'Recarga de Botellas de Aire Autocontenido', description: 'Servicio de llenado certificado para equipos de respiración.', image: '/recarga_botella.png', icon: Cylinder },
]

interface Props {
  onAddToCart: (item: Omit<CartItem, "id">) => void
}

type Service = (typeof services)[0]

const serviceDetails: Record<number, {
  description: string;
  highlightTitle: string;
  highlightText: string;
  listTitle: string;
  listItems: string[];
}> = {
  2: {
    description: "Solución confiable y eficiente para sus necesidades energéticas temporales. Ideal para eventos, proyectos industriales, construcción, y situaciones de emergencia, este equipo garantiza un suministro continuo de energía.",
    highlightTitle: "Respaldo Energético Crítico",
    highlightText: "Con la potencia necesaria para respaldar operaciones críticas sin interrupciones.",
    listTitle: "Características del Grupo Electrógeno MP-55",
    listItems: ['Potencia Sostenible', 'Eficiencia Operativa', 'Diseño Compacto y Resistente', 'Tecnología Avanzada', 'Disponibilidad 24/7', 'Fácil Transporte y Despliegue']
  },
  3: {
    description: "Lorem ipsum is simply free text used by copytyping refreshing. Neque porro est qui dolorem ipsum quia quaed inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros.",
    highlightTitle: "Sistemas Inteligentes",
    highlightText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui.",
    listTitle: "Características de nuestros sistemas de detección de incendios",
    listItems: ['Alarmas manuales.', 'Alarma sonora y de luz estroboscópica', 'Sensores de humos', 'Sensores de temperatura']
  },
  4: {
    description: "En Engineer Fire, nos especializamos en el mantenimiento y prueba de sistemas de bombeo para incendios, cumpliendo con los estándares exigentes de la norma NFPA 20.",
    highlightTitle: "Eficiencia y Confiabilidad",
    highlightText: "Nuestro enfoque está dirigido a garantizar que sus sistemas de bombeo funcionen de manera confiable y eficiente en cualquier momento, protegiendo su infraestructura y minimizando riesgos.",
    listTitle: "Características del sistema de bombeo",
    listItems: ['Mantenimiento Preventivo y Correctivo', 'Pruebas de Funcionamiento', 'Cumplimiento de la Norma NFPA 20', 'Seguridad y Fiabilidad']
  },
  5: {
    description: "En Engineer Fire, ofrecemos el servicio de alquiler de camiones contra incendios, rescate y materiales peligrosos, proporcionando soluciones flexibles y eficaces para cada tipo de emergencia. Nuestras unidades están completamente equipadas con la última tecnología, garantizando una respuesta rápida y eficiente en situaciones críticas.",
    highlightTitle: "Soluciones Flexibles",
    highlightText: "Camiones Especializados para Incendios y Materiales Peligrosos: Alquile por Hora, Día, Semana o Mes",
    listTitle: "Características del Servicio de Alquiler de Camiones",
    listItems: ['Alquiler Flexible', 'Equipos de Alta Calidad', 'Camiones Especializados', 'Soporte Continuo']
  },
  6: {
    description: "En Engineer Fire, proporcionamos brigadas de bomberos especializadas para enfrentar situaciones de emergencia en diversos sectores, brindando una respuesta rápida y profesional ante incendios y rescates. Nuestro equipo de expertos está entrenado y equipado para intervenir en diversas industrias y entornos, garantizando la seguridad y el bienestar en todo momento.",
    highlightTitle: "Brigadas Especializadas",
    highlightText: "Rescate y Combate de Incendios en Áreas Críticas: Brigadas Especializadas para Cada Necesidad",
    listTitle: "Ámbitos de Especialización de Nuestras Brigadas de Bomberos:",
    listItems: ['Petrolero', 'Portuario', 'Aeronáutico', 'Técnicos MATPEL', 'Rescatistas']
  }
}

export default function Services({ onAddToCart }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    setTimeout(() => setSelectedService(null), 300) // Wait for transition
  }, [])

  useEffect(() => {
    if (selectedService) {
      // Trigger animation after state update
      const timer = setTimeout(() => setIsModalVisible(true), 10)
      return () => clearTimeout(timer)
    }
  }, [selectedService])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  const details = selectedService ? serviceDetails[selectedService.id] || {
    description: `${selectedService.description} Nuestro enfoque garantiza la máxima eficiencia y cumplimiento de los más altos estándares internacionales en ingeniería de protección contra incendios.`,
    highlightTitle: "Cumplimiento Normativo NFPA 20",
    highlightText: "Todos nuestros equipos y procedimientos están rigurosamente alineados con la normativa NFPA 20, asegurando que su instalación cumpla con los estándares globales de seguridad y operatividad para sistemas de bombeo y redes contra incendios.",
    listTitle: "Nuestros servicios incluyen:",
    listItems: ['Montaje Especializado', 'Mantenimiento Preventivo', 'Diseño de Ingeniería', 'Sistemas FM200', 'Sistemas de CO2', 'Soporte Técnico 24/7']
  } : null

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
                onClick={() => setSelectedService(service)}
                className="group flex flex-col rounded-2xl bg-card border-border hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer"
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
                    <Button
                      className="bg-secondary text-white hover:bg-primary transition-colors rounded-xl px-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart({ name: service.name, price: 0, image: service.image || "", type: "service"})
                      }}
                    >
                      Solicitar
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Modal Section */}
      {selectedService && details && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isModalVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className={`bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 transform transition-all duration-300 ${isModalVisible ? 'scale-100' : 'scale-95'}`}
          >
            {/* Header Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 sm:p-10">
              {/* Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-2xl">
                  <selectedService.icon className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-black text-red-600 tracking-tight">
                  {selectedService.name}
                </h2>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                {details.description}
              </p>

              {/* Technical / Highlight Block */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
                <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  {details.highlightTitle}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {details.highlightText}
                </p>
              </div>

              {/* Inclusion / Features List */}
              <div className="mb-10">
                <h4 className="font-bold text-secondary text-xl mb-4">
                  {details.listTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {details.listItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-red-50 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-600 stroke-[3px]" />
                      </div>
                      <span className="text-slate-600 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="py-6 px-8 rounded-2xl text-lg font-semibold text-slate-500 border-slate-200 hover:bg-slate-50 flex-1"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
