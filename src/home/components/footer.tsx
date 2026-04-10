import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contacto" className="bg-secondary text-secondary-foreground pt-20 pb-10 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Company */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-lg">EF</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">ENGINEER <span className="text-primary">FIRE</span></span>
            </div>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed font-light mb-6">
              Ingeniería táctica y protección patrimonial de alto rigor. Más de 20 años asegurando la continuidad de tu negocio en todo el país.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Nuestros Servicios</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><a href="#" className="flex items-center hover:text-primary transition-colors group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />Inspección Estructural</a></li>
              <li><a href="#" className="flex items-center hover:text-primary transition-colors group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />Instalaciones Inteligentes</a></li>
              <li><a href="#" className="flex items-center hover:text-primary transition-colors group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />Capacitación Brigadistas</a></li>
              <li><a href="#" className="flex items-center hover:text-primary transition-colors group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />Planes de Evacuación</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><a href="#" className="flex items-center hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="flex items-center hover:text-white transition-colors">Validar Certificados</a></li>
              <li><a href="#" className="flex items-center hover:text-white transition-colors">Centro de Recursos</a></li>
              <li><a href="#" className="flex items-center hover:text-white transition-colors">Portal de Clientes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Central Operativa</h4>
            <ul className="space-y-4 text-sm font-light text-secondary-foreground/80">
              <li className="flex items-start space-x-3 group cursor-pointer hover:text-white transition-colors">
                <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"><MapPin className="w-4 h-4" /></div>
                <div>
                  <span className="block font-medium text-white mb-0.5">Sede Principal</span>
                  Av. Empresarial 1234, Planta 5, Madrid
                </div>
              </li>
              <li className="flex items-start space-x-3 group cursor-pointer hover:text-white transition-colors">
                <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Phone className="w-4 h-4" /></div>
                <div>
                  <span className="block font-medium text-white mb-0.5">Línea de Emergencia 24/7</span>
                  +34 900 112 112
                </div>
              </li>
              <li className="flex items-start space-x-3 group cursor-pointer hover:text-white transition-colors">
                <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Mail className="w-4 h-4" /></div>
                <div>
                  <span className="block font-medium text-white mb-0.5">Correo Corporativo</span>
                  contacto@engineerfire.com
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-light text-secondary-foreground/50">
            © {new Date().getFullYear()} ENGINEER FIRE S.A. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-sm font-light text-secondary-foreground/50">
            <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos del Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
