import { Card } from '@/shared/components/ui/card'
import { CheckCircle2, Clock, Shield, Headphones } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'Certificación Profesional',
    description: 'Nuestros equipos están minuciosamente certificados y exceden las normas internacionales de seguridad.',
  },
  {
    icon: Clock,
    title: 'Respuesta Inmediata',
    description: 'Disponibilidad absoluta 24/7. Protocolos de emergencia con tiempos de respuesta líderes en la industria.',
  },
  {
    icon: Shield,
    title: 'Garantía Total',
    description: 'Respaldamos nuestro trabajo. Garantía incondicional en todas nuestras instalaciones y mantenciones.',
  },
  {
    icon: Headphones,
    title: 'Soporte Premium',
    description: 'Un equipo élite de ingenieros listos para brindarte asistencia táctica en cualquier momento.',
  },
]

export default function Features() {
  return (
    <section id="caracteristicas" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-muted-foreground font-semibold tracking-widest uppercase text-xs mb-3 block">El Estándar de la Industria</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 tracking-tight">
            ¿Por Qué <span className="text-primary">Elegirnos?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Nuestra obsesión por el detalle y la seguridad absoluta nos convierte en el socio estratégico que las empresas líderes eligen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="group p-8 text-center bg-transparent border-none shadow-none hover:bg-muted/30 rounded-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300 ring-1 ring-border/50 group-hover:ring-primary/30">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
