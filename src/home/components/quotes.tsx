"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { X, CheckCircle, XCircle, FileText } from "lucide-react";
import { useState } from "react";
import type { Quote } from "../pages/HomePage";

interface Props {
  quotes: Quote[];
  onClose: () => void;
  onAccept: (quoteId: Quote["id"]) => void;
  onReject: (quoteId: Quote["id"]) => void;
}

export default function Quotes({ quotes, onClose, onAccept, onReject }: Props) {
  const [filter, setFilter] = useState("pending"); // pending, accepted, rejected

  const filteredQuotes = quotes.filter((quote) => quote.status === filter);

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const getStatusLabel = (status) => {
  //   switch (status) {
  //     case 'pending':
  //       return 'Pendiente'
  //     case 'accepted':
  //       return 'Aceptada'
  //     case 'rejected':
  //       return 'Rechazada'
  //     default:
  //       return status
  //   }
  // }

  return (
    <div className="fixed top-16 right-4 z-40 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Cotizaciones</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 border-b border-border">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "pending"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Pendientes ({quotes.filter((q) => q.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "accepted"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Aceptadas ({quotes.filter((q) => q.status === "accepted").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === "rejected"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Rechazadas ({quotes.filter((q) => q.status === "rejected").length})
          </button>
        </div>

        {/* Quotes List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredQuotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {filter === "pending" && "No hay cotizaciones pendientes"}
              {filter === "accepted" && "No hay cotizaciones aceptadas"}
              {filter === "rejected" && "No hay cotizaciones rechazadas"}
            </p>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-3 bg-muted/40 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {quote.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quote.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}
                  >
                    <button
                      onClick={() => setFilter("accepted")}
                      className={
                        "px-3 py-2 text-sm font-medium border-b-2 transition-colors bg-slate-500 border-primary text-muted-foreground hover:text-foreground"
                      }
                    >
                      Descargar
                    </button>
                  </span>
                </div>

                <div className="bg-background p-2 rounded mb-3">
                  <p className="text-sm font-bold text-primary">
                    ${quote.price}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fecha: {new Date(quote.date).toLocaleDateString("es-ES")}
                  </p>
                </div>

                {/* Action Buttons - Only show for pending quotes */}
                {quote.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onAccept(quote.id)}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      onClick={() => onReject(quote.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
