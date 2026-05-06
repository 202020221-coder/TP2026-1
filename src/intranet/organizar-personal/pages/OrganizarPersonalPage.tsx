import { useEffect, useState, useCallback } from 'react';
import { ProjectList } from '../components/project-list';
import { WorkCalendar } from '../components/work-calendar';
import { DailyStaffPanel } from '../components/daily-staff-panel';
import { proyectoService, trabajoService } from '../services/organizar-personal.service';
import type { Proyecto, Jornada } from '../types';

export default function OrganizarPersonalPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    proyectoService
      .getAll(1, 100)
      .then((res) => setProyectos(res.data))
      .catch(console.error)
      .finally(() => setLoadingProyectos(false));
  }, []);

  const loadJornadas = useCallback(() => {
    if (!selectedProyecto?.ID_Trabajo) {
      setJornadas([]);
      return;
    }
    trabajoService
      .getJornadas(selectedProyecto.ID_Trabajo)
      .then(setJornadas)
      .catch(() => setJornadas([]));
  }, [selectedProyecto]);

  useEffect(() => {
    loadJornadas();
  }, [loadJornadas]);

  const handleSelectProyecto = (p: Proyecto) => {
    setSelectedProyecto(p);
    setSelectedDate(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
      {/* LEFT — Project list */}
      <aside className="w-64 shrink-0 border-r bg-gray-100 flex flex-col overflow-hidden">
        <ProjectList
          proyectos={proyectos}
          selectedId={selectedProyecto?.id_Proyecto ?? null}
          onSelect={handleSelectProyecto}
          loading={loadingProyectos}
        />
      </aside>

      {/* CENTER — Calendar */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <WorkCalendar
          jornadas={jornadas}
          onSelectDate={setSelectedDate}
          projectName={selectedProyecto?.descripcion_servicio ?? `Proyecto #${selectedProyecto?.id_Proyecto}`}
        />
      </main>

      {/* RIGHT — Daily staff */}
      <aside className="w-72 shrink-0 border-l bg-white flex flex-col overflow-hidden">
        <DailyStaffPanel
          selectedDate={selectedDate}
          idTrabajo={selectedProyecto?.ID_Trabajo ?? null}
          jornadas={jornadas}
          onRefresh={loadJornadas}
        />
      </aside>
    </div>
  );
}
