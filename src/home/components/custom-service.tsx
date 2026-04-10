"use client"

import { useState } from "react"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Lightbulb, CheckCircle } from "lucide-react"

export default function CustomService({ onAddToCart }: { onAddToCart?: any }) {
  const [formData, setFormData] = useState({
    serviceName: "",
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    ruc: "",
    email: "",
    phone: "",
    description: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (formData.serviceName && formData.description && onAddToCart) {
      setSubmitted(true)
      setFormData({
        serviceName: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        ruc: "",
        email: "",
        phone: "",
        description: "",
      })
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <Card className="relative p-8 rounded-2xl bg-card border-none shadow-xl lg:shadow-2xl overflow-hidden group">
      {/* Animated Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-50 blur-2xl" />
      <div className="absolute inset-0 bg-card m-[1px] rounded-2xl z-0" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <Lightbulb className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-secondary mb-2 tracking-tight">Servicio a Medida</h3>
            <p className="text-muted-foreground text-sm font-light">
              Diseñamos soluciones exactas para las necesidades críticas de tu empresa.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center animate-in fade-in zoom-in duration-500 min-h-[400px]">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <div>
              <p className="font-bold text-xl text-green-600 mb-2">¡Solicitud Aprobada!</p>
              <p className="text-sm text-green-700/80">
                Tu requerimiento especial está en nuestra mesa. Nos comunicaremos de inmediato.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Nombre del Servicio</label>
              <Input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="Ej: Auditoría Completa de Evacuación"
                className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Empresa / Cliente</label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nombre legal o personal"
                className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">RUC / ID</label>
                <Input
                  type="text"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  placeholder="ID fiscal"
                  className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Ubicación</label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Sede principal"
                  className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@empresa.com"
                  className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Teléfono</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 000 000 000"
                  className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary/70 uppercase tracking-widest mb-1.5">Descripción de Necesidad</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalla parámetros, cantidad de elementos o metros cuadrados..."
                className="bg-muted/50 border-border/50 focus:border-primary focus:ring-primary rounded-xl min-h-[100px] resize-none"
                required
              />
            </div>

            <Button type="submit" className="w-full h-14 bg-secondary hover:bg-primary text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-secondary/20 hover:shadow-primary/30 mt-4 text-base">
              Procesar Solicitud Especial
            </Button>
          </form>
        )}
      </div>
    </Card>
  )
}
