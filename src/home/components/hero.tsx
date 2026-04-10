import { Button } from '@/shared/components/ui/button'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 min-h-[90vh] flex items-center">
      {/* Mesh Gradient Background / Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-in fade-in duration-1000" />
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen animate-in fade-in duration-1000 delay-300" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-secondary-foreground/5 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full animate-in slide-in-from-bottom-8 fade-in duration-1000">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/90 tracking-wide">Protección Profesional Contra Incendios</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
            Seguridad Integral <br className="hidden sm:block"/>
            <span className="text-gradient">Para Tu Negocio</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
            Soluciones avanzadas de prevención y respuesta ante incendios. Con más de <strong className="text-white font-semibold">20 años de experiencia</strong>, protegemos lo que es verdaderamente importante para ti.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-primary hover:opacity-90 text-white font-bold rounded-xl shadow-[0_0_40px_rgba(200,50,0,0.4)] hover:shadow-[0_0_60px_rgba(200,50,0,0.6)] hover:-translate-y-1 transition-all duration-300">
              Solicitar Consulta <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl transition-all duration-300 hover:-translate-y-1"
            >
              Explorar Servicios
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
