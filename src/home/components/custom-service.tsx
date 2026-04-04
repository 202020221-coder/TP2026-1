"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Lightbulb, CheckCircle } from "lucide-react";

export default function CustomService() {
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
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.serviceName && formData.description) {
      // Agregar servicio personalizado al carrito
      // onAddToCart({
      //   name: `Servicio Personalizado: ${formData.serviceName}`,
      //   price: 0,
      //   type: "custom_service",
      //   description: formData.description,
      //   details: {
      //     companyName: formData.companyName,
      //     location: formData.location,
      //     startDate: formData.startDate,
      //     endDate: formData.endDate,
      //     ruc: formData.ruc,
      //     email: formData.email,
      //     phone: formData.phone,
      //   },
      // })
      setSubmitted(true);
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
      });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <Card className="p-8 bg-linear-to-br from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary mb-2">
            Personaliza tus Servicios
          </h3>
          <p className="text-muted-foreground">
            ¿No encuentras lo que buscas? Solicita un servicio personalizado a
            tu medida
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Solicitud enviada</p>
            <p className="text-sm text-green-700">
              Tu servicio personalizado ha sido agregado. Nos contactaremos
              pronto.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del Servicio */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Nombre del Servicio
            </label>
            <Input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Ej: Inspección de Rutas de Evacuación"
              className="border-gray-300"
              required
            />
          </div>

          {/* Nombre de la Empresa o Personal Natural */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Nombre de la Empresa o Personal Natural
            </label>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ej: Empresa ABC S.A."
              className="border-gray-300"
              required
            />
          </div>

          {/* RUC */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              RUC
            </label>
            <Input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              placeholder="Ej: 20123456789"
              className="border-gray-300"
              required
            />
          </div>

          {/* Ubicación donde se realizará el servicio */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Ubicación donde se realizará el servicio
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Av. Principal 123, Piso 5"
              className="border-gray-300"
              required
            />
          </div>

          {/* Fecha de Inicio y Fecha de Finalización */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Fecha de Inicio
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Fecha de Finalización
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
            </div>
          </div>

          {/* Email de Contacto */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email de Contacto
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: contacto@empresa.com"
              className="border-gray-300"
              required
            />
          </div>

          {/* Número Celular de Contacto */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Número Celular de Contacto
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: +51 987654321"
              className="border-gray-300"
              required
            />
          </div>

          {/* Descripción del Servicio */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Descripción del Servicio
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Cuéntanos qué necesitas específicamente. Incluye detalles como ubicación, cantidad de personal, horarios, etc."
              className="border-gray-300 min-h-[100px]"
              required
            />
          </div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Agenda tu llamada
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Horario tentativo 1
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
              <Input
                type="time"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Horario tentativo 2
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
              <Input
                type="time"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border-gray-300"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
          >
            Solicitar Servicio Personalizado
          </Button>
        </form>
      )}
    </Card>
  );
}
