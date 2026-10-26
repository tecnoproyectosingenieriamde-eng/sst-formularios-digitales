import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  Menu,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

type FormItem = {
  code: string
  title: string
  category: string
  description: string
  icon: typeof ClipboardList
  status: 'Disponible para prototipo' | 'En planificación'
}

const forms: FormItem[] = [
  {
    code: 'FM-SST-14',
    title: 'Registro de asistencia',
    category: 'Capacitación y asistencia',
    description: 'Registro de actividades, responsables y participantes.',
    icon: ClipboardList,
    status: 'Disponible para prototipo',
  },
  {
    code: 'FM-SST-16',
    title: 'Evaluación de inducción SST',
    category: 'Inducción y evaluación',
    description: 'Evaluación de conocimientos y registro de resultados.',
    icon: ClipboardCheck,
    status: 'Disponible para prototipo',
  },
  {
    code: 'FM-SST-15',
    title: 'Formato SST',
    category: 'Gestión SST',
    description: 'Se habilitará después de revisar la plantilla original.',
    icon: FileText,
    status: 'En planificación',
  },
  {
    code: 'FM-SST-29',
    title: 'Autorreporte de actos inseguros',
    category: 'Reporte y prevención',
    description: 'Pendiente de revisar campos y flujo de aprobación.',
    icon: ShieldCheck,
    status: 'En planificación',
  },
]

export default function App() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null)

  const visibleForms = forms.filter((form) =>
    `${form.code} ${form.title} ${form.category}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={23} strokeWidth={2.4} /></div>
          <div><strong>TECNOPROYECTOS</strong><span>INGENIERÍA S.A.S.</span></div>
          <button className="icon-button mobile-close" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>
        <div className="workspace-label">MÓDULO INDEPENDIENTE</div>
        <nav className="side-nav" aria-label="Navegación principal">
          <a className="nav-link active" href="#inicio" onClick={() => setMenuOpen(false)}><ClipboardList size={18} /> Formularios SST</a>
          <a className="nav-link" href="#formatos" onClick={() => setMenuOpen(false)}><FileCheck2 size={18} /> Catálogo de formatos</a>
          <a className="nav-link disabled" href="#registros" onClick={(event) => event.preventDefault()}><Users size={18} /> Registros <span className="nav-soon">Próximamente</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="security-note"><ShieldCheck size={19} /><div><strong>Entorno de pruebas</strong><span>Sin conexión a producción</span></div></div>
          <span className="version-label">Versión inicial · 0.1.0</span>
        </div>
      </aside>

      {menuOpen && <button className="scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <main className="main-content" id="inicio">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="breadcrumb">Sistema SST <span>/</span> Formularios digitales</div>
          <div className="environment-pill"><span /> Entorno independiente</div>
        </header>

        <section className="welcome-section">
          <div className="eyebrow"><span className="eyebrow-line" /> SEGURIDAD Y SALUD EN EL TRABAJO</div>
          <h1>Formularios SST <span>digitales.</span></h1>
          <p className="welcome-copy">Gestiona los formatos del Sistema de Seguridad y Salud en el Trabajo desde un solo lugar. Esta versión es un prototipo independiente para validar el flujo antes de conectar datos reales.</p>
          <div className="welcome-meta">
            <div className="meta-icon"><ShieldCheck size={18} /></div>
            <span>Desarrollo aislado</span><span className="meta-divider" /><span>Datos de prueba únicamente</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Resumen del módulo">
          <div className="stat-card"><div className="stat-icon green"><ClipboardList size={19} /></div><div><span>Formatos priorizados</span><strong>02</strong><small>Primera fase de desarrollo</small></div></div>
          <div className="stat-card"><div className="stat-icon blue"><FileCheck2 size={19} /></div><div><span>Listos para revisión</span><strong>02</strong><small>Plantillas por validar</small></div></div>
          <div className="stat-card"><div className="stat-icon amber"><Users size={19} /></div><div><span>Registros guardados</span><strong>—</strong><small>Persistencia aún no conectada</small></div></div>
        </section>

        <section className="forms-section" id="formatos">
          <div className="section-heading">
            <div><span className="section-kicker">CATÁLOGO</span><h2>Formatos disponibles</h2><p>Selecciona un formato para revisar el siguiente paso de implementación.</p></div>
            <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar formato..." aria-label="Buscar formato" /></label>
          </div>

          <div className="forms-grid">
            {visibleForms.map((form) => {
              const Icon = form.icon
              const planned = form.status === 'En planificación'
              return (
                <article className="form-card" key={form.code}>
                  <div className="card-topline"><div className="form-icon"><Icon size={21} /></div><span className={`status-tag ${planned ? 'planned' : ''}`}><span />{planned ? 'En planificación' : 'Prioridad inicial'}</span></div>
                  <div className="form-code">{form.code}</div>
                  <h3>{form.title}</h3>
                  <p>{form.description}</p>
                  <div className="card-footer"><span>{form.category}</span><button className="text-action" onClick={() => setSelectedForm(form)}>{planned ? 'Ver detalle' : 'Explorar'} <ArrowRight size={16} /></button></div>
                </article>
              )
            })}
            {visibleForms.length === 0 && <div className="empty-state">No encontramos formatos con “{query}”. Prueba otra búsqueda.</div>}
          </div>
        </section>

        <section className="roadmap-banner">
          <div className="roadmap-icon"><ShieldCheck size={22} /></div>
          <div><strong>Diseñado para integrarse después</strong><p>Primero validamos formularios, permisos y generación de PDF en este entorno. La aplicación existente permanece intacta.</p></div>
          <span className="roadmap-badge">FASE 1</span>
        </section>
        <footer className="footer"><span>© Tecnoproyectos Ingeniería S.A.S.</span><span>Prototipo SST · No usar aún para registros oficiales</span></footer>
      </main>

      {selectedForm && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedForm(null)}>
        <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
          <button className="icon-button modal-close" aria-label="Cerrar" onClick={() => setSelectedForm(null)}><X size={20} /></button>
          <div className="modal-symbol"><selectedForm.icon size={25} /></div>
          <span className="form-code">{selectedForm.code}</span>
          <h2 id="modal-title">{selectedForm.title}</h2>
          <p>{selectedForm.description}</p>
          <div className="modal-info"><strong>Estado de implementación</strong><span>{selectedForm.status}</span><small>Esta pantalla es informativa. El formulario real se habilitará después de revisar su plantilla PDF y definir sus campos.</small></div>
          <button className="primary-button" onClick={() => setSelectedForm(null)}>Entendido <ArrowRight size={17} /></button>
        </section>
      </div>}
    </div>
  )
}
