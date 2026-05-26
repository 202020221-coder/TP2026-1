import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { WorkCalendar } from '../components/work-calendar';
import { DailyStaffPanel } from '../components/daily-staff-panel';
import { BudgetAnalysis } from '../components/budget-analysis';
import {
  proyectoService,
  trabajoService,
  personalRequeridoService,
} from '../services/organizar-personal.service';
import type { Proyecto, Jornada } from '../types';

export default function OrganizarPersonalPage() {
  const { idProyecto } = useParams<{ idProyecto: string }>();
  const navigate = useNavigate();
  const projectId = Number(idProyecto);

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loadingProyecto, setLoadingProyecto] = useState(true);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [personalRequerido, setPersonalRequerido] = useState(0);

  useEffect(() => {
    if (!projectId) return;
    setLoadingProyecto(true);
    proyectoService
      .getById(projectId)
      .then((p) => setProyecto(p))
      .catch(() => setProyecto(null))
      .finally(() => setLoadingProyecto(false));
  }, [projectId]);

  useEffect(() => {
    if (!proyecto?.id_cotizacion) {
      setPersonalRequerido(0);
      return;
    }
    personalRequeridoService
      .getTotalByCotizacion(proyecto.id_cotizacion)
      .then(setPersonalRequerido)
      .catch(() => setPersonalRequerido(0));
  }, [proyecto?.id_cotizacion]);

  const loadJornadas = useCallback(() => {
    if (!proyecto?.ID_Trabajo) {
      setJornadas([]);
      return;
    }
    trabajoService
      .getJornadas(proyecto.ID_Trabajo)
      .then(setJornadas)
      .catch(() => setJornadas([]));
  }, [proyecto?.ID_Trabajo]);

  useEffect(() => {
    loadJornadas();
  }, [loadJornadas]);

  const projectName =
    proyecto?.descripcion_servicio ??
    (proyecto ? `Proyecto #${proyecto.id_Proyecto}` : '');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
      <div className="px-4 pt-4 pb-2 shrink-0 flex items-center gap-3 border-b bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/intranet/proyectos')}
          className="gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Proyectos
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">
            {loadingProyecto
              ? 'Cargando proyecto…'
              : proyecto
                ? projectName
                : 'Proyecto no encontrado'}
          </h2>
          {proyecto && (
            <p className="text-xs text-muted-foreground truncate">
              {proyecto.Cliente_Nombre ?? 'Sin cliente'}
              {proyecto.ubicacion ? ` · ${proyecto.ubicacion}` : ''}
              {personalRequerido > 0
                ? ` · Personal requerido por día: ${personalRequerido}`
                : ''}
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue="cronograma" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="shrink-0 px-4 pt-2 bg-white border-b justify-start rounded-none">
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="presupuesto">Análisis de Presupuesto</TabsTrigger>
        </TabsList>

        <TabsContent value="cronograma" className="flex flex-1 overflow-hidden m-0">
          <main className="flex-1 flex flex-col overflow-hidden">
            <WorkCalendar
              jornadas={jornadas}
              onSelectDate={setSelectedDate}
              personalRequerido={personalRequerido}
              fechaInicio={proyecto?.fecha_inicio ?? null}
              fechaFin={proyecto?.fecha_fin ?? null}
            />
          </main>

          <aside className="w-72 shrink-0 border-l bg-white flex flex-col overflow-hidden">
            <DailyStaffPanel
              selectedDate={selectedDate}
              idTrabajo={proyecto?.ID_Trabajo ?? null}
              jornadas={jornadas}
              personalRequerido={personalRequerido}
              onRefresh={loadJornadas}
              fechaInicio={proyecto?.fecha_inicio ?? null}
              fechaFin={proyecto?.fecha_fin ?? null}
            />
          </aside>
        </TabsContent>

        <TabsContent value="presupuesto" className="flex-1 overflow-y-auto p-4 m-0">
          <BudgetAnalysis
            jornadas={jornadas}
            personalRequerido={personalRequerido}
            fechaInicio={proyecto?.fecha_inicio ?? null}
            fechaFin={proyecto?.fecha_fin ?? null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
