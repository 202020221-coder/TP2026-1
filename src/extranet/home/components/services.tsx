'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Flame, Users, Zap, ShieldCheck, Settings, Droplets, Wind, Cylinder, Truck, Bell, Waves, Check, X, Layers, Boxes, type LucideIcon } from 'lucide-react'
import { useLandingServices, type LandingService } from '../hooks/useLandingServices'
import { getServicioPrincipal } from '@/intranet/services/api/service.api'
import type { ServicioFase, ServicioSubservicio } from '@/intranet/services/interfaces/service'

/** Contenido real (fases/subservicios) cargado del backend para el prefill. */
type ServiceRequestExtras = {
  fases?: ServicioFase[]
  subservicios?: ServicioSubservicio[]
}

/** Ruta del asistente de creación de solicitudes (cliente). */
const CREATE_REQUEST_PATH = '/intranet/solicitudes/crear'

/**
 * Construye la descripción detallada, observaciones generales y la lista de
 * subservicios a partir del servicio. Incluye los nombres de las fases en la
 * descripción para que aparezcan en "Datos del Servicio" (pestaña 4).
 */
function buildServiceRequestPrefill(
  service: LandingService,
  extras?: ServiceRequestExtras,
): {
  descripcion: string
  observaciones: string
  subservicios: { id: number; nombre: string }[]
} {
  const detailedDesc = service.details?.description ?? service.description

  const fases = extras?.fases ?? service.fases ?? []
  const fasesText = fases.length
    ? `\n\nFases del servicio:\n${fases
        .map((fase, idx) => `${idx + 1}. ${fase.name}`)
        .join('\n')}`
    : ''

  const descripcion =
    `Solicito el servicio: ${service.name}.\n\n${detailedDesc}${fasesText}`.trim()

  let observaciones = ''
  if (service.observaciones?.trim()) {
    observaciones = service.observaciones.trim()
  } else if (service.details) {
    const feats = service.details.listItems?.length
      ? `\nIncluye: ${service.details.listItems.join(', ')}.`
      : ''
    observaciones = `${service.details.highlightTitle}: ${service.details.highlightText}${feats}`.trim()
  }

  const subservicios = (extras?.subservicios ?? service.subservicios ?? [])
    .filter((sub) => Number(sub.id) > 0 && (sub.nombre ?? '').trim().length > 0)
    .map((sub) => ({ id: Number(sub.id), nombre: sub.nombre }))

  return { descripcion, observaciones, subservicios }
}

/** Definición de un servicio estático de la landing. */
type StaticServiceDef = {
  id: number
  name: string
  description: string
  image: string
  icon: LucideIcon
  /**
   * Cuando es true, la tarjeta carga sus fases y subservicios reales desde la
   * plantilla del servicio principal del backend (GET /servicios/:id/principal),
   * usando `id` como identificador del servicio. Útil para mostrar el contenido
   * real de un servicio aunque aún no esté publicado en el endpoint público.
   */
  principalLinked?: boolean
  /**
   * Observaciones del servicio (respaldo mientras el servicio no esté publicado
   * en el endpoint público; si se publica, el backend las sobrescribe).
   */
  observaciones?: string
}

const services: StaticServiceDef[] = [
  { id: 2, name: 'Alquiler de Grupo Electrógeno MP-55', description: 'Energía de respaldo continua para sistemas críticos.', image: '/grupo_electrogeno_1775863736106.png', icon: Zap },
  {
    id: 15,
    name: 'Sistemas de Detección de incendios',
    description: 'Diseño e instalación de sistemas de detección y alarma contra incendios: detectores de humo y calor, sirenas, luces estroboscópicas y central de alarma, conforme a la norma NFPA 72.',
    image: '/deteccion_incendios_1775863750035.png',
    icon: Bell,
    principalLinked: true,
    observaciones:
      'Cumplimiento Normativo NFPA 20:\n' +
      'Todos nuestros equipos y procedimientos están rigurosamente alineados con la normativa NFPA 20, asegurando que su instalación cumpla con los estándares globales de seguridad y operatividad para sistemas de bombeo y redes contra incendios.\n' +
      'Nuestros servicios incluyen:\n' +
      'Montaje Especializado\n' +
      'Mantenimiento Preventivo\n' +
      'Diseño de Ingeniería\n' +
      'Sistemas FM200\n' +
      'Sistemas de CO2\n' +
      'Soporte Técnico 24/7',
  },
  { id: 4, name: 'Sistema de bombeo', description: 'Equipos de bombeo de gran capacidad para redes contra incendios.', image: '/sistema_bombeo_1775863772149.png', icon: Waves },
  { id: 5, name: 'Alquiler de camiones', description: 'Cisternas y unidades de respuesta equipadas para emergencias.', image: '/alquiler_camiones_1775863788061.png', icon: Truck },
  { id: 6, name: 'Brigadas de Bomberos', description: 'Personal altamente capacitado para respuesta inmediata.', image: '/brigada_bomberos_1775863804644.png', icon: Users },
  { id: 7, name: 'Servicio de Ranurado', description: 'Preparación técnica de tuberías para sistemas de acople rápido.', image: '/Servicio_Ranurado_20180427151302.png', icon: Settings },
  { id: 8, name: 'Servicio de Termofusión', description: 'Soldadura de tuberías HDPE para redes subterráneas.', image: '/servicio_termofusion.png', icon: Flame },
  { id: 9, name: 'Alquiler de Sistemas de Espuma', description: 'Supresión especializada para incendios de líquidos inflamables.', image: '/sistemas-de-espuma.png', icon: Droplets },
  { id: 10, name: 'Alquiler de Bombas Contra Incendios', description: 'Bombas portátiles y estacionarias para refuerzo de caudal.', image: '/Bombas_ContraIncendios_20180427145918.png', icon: Wind },
  { id: 11, name: 'Recarga de Botellas de Aire Autocontenido', description: 'Servicio de llenado certificado para equipos de respiración.', image: '/recarga_botella.png', icon: Cylinder },
]

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

const normalize = (value: string) =>
  value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const staticServices: LandingService[] = services.map((s) => ({
  key: `static-${s.id}`,
  id: s.id,
  name: s.name,
  description: s.description,
  image: s.image,
  icon: s.icon,
  isDynamic: false,
  principalLinked: s.principalLinked,
  observaciones: s.observaciones,
  details: serviceDetails[s.id],
}))

/**
 * Tarjeta de un servicio en la landing. Para los servicios dinámicos (backend)
 * carga las fases reales (con sus nombres) desde la plantilla del servicio
 * principal y las muestra en el contenido de la tarjeta.
 */
function ServiceCard({
  service,
  onSelect,
  onSolicitar,
}: {
  service: LandingService
  onSelect: (service: LandingService) => void
  onSolicitar: (service: LandingService, extras?: ServiceRequestExtras) => void
}) {
  const IconComponent = service.icon
  // Las tarjetas dinámicas (backend) y las estáticas enlazadas muestran su
  // contenido real (fases/subservicios) desde la plantilla del servicio.
  const usesBackendContent = !!service.isDynamic || !!service.principalLinked

  const { data: principalData } = useQuery({
    queryKey: ['servicio-principal', service.id],
    queryFn: () => getServicioPrincipal(service.id),
    enabled: usesBackendContent && !!service.id,
    staleTime: 60_000,
  })
  const fases = (principalData?.fases?.length ? principalData.fases : service.fases) ?? []
  const subservicios =
    (principalData?.subservicios?.length
      ? principalData.subservicios
      : service.subservicios) ?? []

  return (
    <Card
      onClick={() => onSelect(service)}
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

        <h3 className="font-bold text-xl text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3>
        {usesBackendContent ? (
          <>
            {/* 1. Descripción */}
            <p className="text-muted-foreground mb-2 line-clamp-2 leading-relaxed">{service.description}</p>
            {/* 2. Observaciones */}
            {service.observaciones && service.observaciones.trim() && (
              <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2 leading-relaxed whitespace-pre-line">{service.observaciones}</p>
            )}
            {/* 3. Nombre de las fases del servicio */}
            {fases.length > 0 && (
              <div className="mb-4">
                <span className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <Layers className="w-3.5 h-3.5" />
                  Fases del servicio
                </span>
                <ol className="space-y-1.5">
                  {fases.map((fase, idx) => (
                    <li key={fase.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span className="leading-snug line-clamp-1">{fase.name}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {/* 4. Subservicios que intervienen */}
            {subservicios.length > 0 && (
              <div className="mb-6 flex-1">
                <span className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <Boxes className="w-3.5 h-3.5" />
                  Subservicios
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subservicios.map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-0.5 text-xs font-medium text-secondary border border-border/60"
                    >
                      {sub.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">{service.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
          <Button
            className="bg-secondary text-white hover:bg-primary transition-colors rounded-xl px-6"
            onClick={(e) => {
              e.stopPropagation()
              onSolicitar(service, { fases, subservicios })
            }}
          >
            Solicitar
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function Services() {
  const navigate = useNavigate()
  const { apiServices } = useLandingServices()
  const [selectedService, setSelectedService] = useState<LandingService | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleSolicitar = useCallback(
    (service: LandingService, extras?: ServiceRequestExtras) => {
      const { descripcion, observaciones, subservicios } =
        buildServiceRequestPrefill(service, extras)
      const params = new URLSearchParams()
      params.set('desc', descripcion)
      params.set('servicioId', String(service.id))
      if (observaciones) params.set('obs', observaciones)
      if (subservicios.length) params.set('subs', JSON.stringify(subservicios))
      navigate(`${CREATE_REQUEST_PATH}?${params.toString()}`)
    },
    [navigate],
  )

  // Fusiona servicios estáticos y del backend (sin duplicar por nombre).
  // Los servicios reales (backend) tienen prioridad: muestran su descripción,
  // fases y subservicios reales en lugar del contenido estático de ejemplo.
  // Si el servicio del backend no tiene imagen, se reutiliza la imagen estática.
  const allServices = useMemo(() => {
    const byName = new Map<string, LandingService>()
    for (const s of staticServices) {
      byName.set(normalize(s.name), s)
    }
    for (const s of apiServices) {
      const key = normalize(s.name)
      const stat = byName.get(key)
      byName.set(key, {
        ...s,
        image: s.image && s.image.trim() ? s.image : (stat?.image ?? s.image),
      })
    }
    return Array.from(byName.values())
  }, [apiServices])

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

  const details = selectedService?.details ?? null

  // Fases reales del servicio (etapas + actividades) desde el backend para el modal.
  const { data: principalData } = useQuery({
    queryKey: ['servicio-principal', selectedService?.id],
    queryFn: () => getServicioPrincipal(selectedService!.id),
    enabled:
      (!!selectedService?.isDynamic || !!selectedService?.principalLinked) &&
      !!selectedService?.id,
    staleTime: 60_000,
  })
  const modalFases = principalData?.fases ?? selectedService?.fases ?? []
  const modalSubservicios =
    principalData?.subservicios ?? selectedService?.subservicios ?? []

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
          {allServices.map((service) => (
            <ServiceCard
              key={service.key}
              service={service}
              onSelect={setSelectedService}
              onSolicitar={handleSolicitar}
            />
          ))}
        </div>
      </div>

      {/* Modal Section */}
      {selectedService && (
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
              {selectedService.image ? (
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <selectedService.icon className="w-20 h-20 text-muted-foreground/30" />
                </div>
              )}
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
                {details ? details.description : selectedService.description}
              </p>

              {details ? (
                <>
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
                </>
              ) : (
                selectedService.observaciones && selectedService.observaciones.trim() && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10">
                    <h4 className="font-bold text-secondary mb-2">Observaciones</h4>
                    <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                      {selectedService.observaciones}
                    </p>
                  </div>
                )
              )}

              {/* Fases del servicio */}
              {modalFases.length > 0 && (
                <div className="mb-10">
                  <h4 className="font-bold text-secondary text-xl mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-600" />
                    Fases del servicio
                  </h4>
                  <div className="space-y-3">
                    {modalFases.map((fase, idx) => (
                      <div
                        key={fase.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                            {idx + 1}
                          </span>
                          <p className="font-semibold text-secondary">{fase.name}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subservicios que intervienen */}
            {modalSubservicios.length > 0 && (
              <div className="mb-10">
                <h4 className="font-bold text-secondary text-xl mb-4 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-red-600" />
                  Subservicios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modalSubservicios.map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600"
                    >
                      <span className="flex h-2 w-2 rounded-full bg-red-500" />
                      {sub.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="py-6 px-8 rounded-2xl text-lg font-semibold text-slate-500 border-slate-200 hover:bg-slate-50 flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() =>
                    handleSolicitar(selectedService, {
                      fases: modalFases,
                      subservicios: modalSubservicios,
                    })
                  }
                  className="py-6 px-8 rounded-2xl text-lg font-semibold bg-secondary text-white hover:bg-primary flex-1"
                >
                  Solicitar este servicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
