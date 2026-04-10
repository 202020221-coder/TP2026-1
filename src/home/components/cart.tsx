'use client'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { X } from 'lucide-react'

export default function Cart({ items, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-top-4 fade-in duration-300">
      <Card className="p-6 shadow-2xl rounded-3xl border border-border/50 backdrop-blur-xl bg-background/95">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Carrito de Serivicios/Productos</h3>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>

        <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Carrito vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price}</p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="border-t border-border pt-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">${total}</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Proceder a Cotizar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
