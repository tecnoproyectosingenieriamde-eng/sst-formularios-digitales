import { useState } from 'react'
import { ArrowLeft, Download, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import SignaturePad from './SignaturePad'

type Person = { name: string; id: string; role: string; training: string; signature: string }
type HazardRow = { task: string; hazard: string; consequence: string; controls: string; verification: 'Sí' | 'No' | '' }
type CheckRow = { item: string; status: 'Sí' | 'No' | 'N/A' | ''; notes: string }

const blankPerson = (): Person => ({ name: '', id: '', role: '', training: '', signature: '' })
const blankHazard = (): HazardRow => ({ task: '', hazard: '', consequence: '', controls: '', verification: '' })
const initialChecks = [
  'Área de trabajo inspeccionada', 'Personal competente y autorizado', 'EPP requerido disponible y en buen estado',
  'Herramientas y equipos inspeccionados', 'Acceso y sistema de protección contra caídas verificados',
  'Condiciones climáticas y del entorno evaluadas', 'Plan y equipos de emergencia disponibles',
  'Área señalizada y delimitada', 'Riesgos eléctricos identificados y controlados',
].map(item => ({ item, status: '' as const, notes: '' }))

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

export default function SafeWorkAnalysis({ onBack }: { onBack: () => void }) {
  const [date, setDate] = useState(today())
  const [time, setTime] = useState('')
  const [place, setPlace] = useState('')
  const [order, setOrder] = useState('')
  const [activity, setActivity] = useState('')
  const [height, setHeight] = useState('')
  const [responsible, setResponsible] = useState('')
  const [coordinator, setCoordinator] = useState('')
  const [people, setPeople] = useState<Person[]>([blankPerson(), blankPerson(), blankPerson()])
  const [hazards, setHazards] = useState<HazardRow[]>([blankHazard(), blankHazard(), blankHazard(), blankHazard()])
  const [checks, setChecks] = useState<CheckRow[]>(initialChecks)
  const [authorization, setAuthorization] = useState<'authorized' | 'stopped' | ''>('')
  const [workerName, setWorkerName] = useState('')
  const [workerSignature, setWorkerSignature] = useState('')
  const [coordinatorSignature, setCoordinatorSignature] = useState('')
  const [authorizerName, setAuthorizerName] = useState('')
  const [authorizerSignature, setAuthorizerSignature] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const print = () => window.print()
  const updatePerson = (i: number, key: keyof Person, value: string) => setPeople(old => old.map((p, n) => n === i ? { ...p, [key]: value } : p))
  const updateHazard = (i: number, key: keyof HazardRow, value: string) => setHazards(old => old.map((p, n) => n === i ? ({ ...p, [key]: value } as HazardRow) : p))
  const updateCheck = (i: number, key: keyof CheckRow, value: string) => setChecks(old => old.map((p, n) => n === i ? ({ ...p, [key]: value } as CheckRow) : p))

  return <section className="ats-page">
    <div className="ats-screen-controls">
      <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Volver al catálogo</button>
      <button className="primary-button" type="button" onClick={print}><Download size={17}/> Imprimir / Guardar PDF</button>
    </div>
    <div className="ats-document">
      <div className="ats-page-sheet">
        <header className="ats-header">
          <div className="ats-company"><strong>TECNOPROYECTOS</strong><span>INGENIERÍA S.A.S.</span></div>
          <div className="ats-title"><strong>SISTEMA DE GESTIÓN INTEGRADO</strong><strong>GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO</strong><b>ANÁLISIS DE TRABAJO SEGURO</b></div>
          <div className="ats-meta"><strong>Código: FM-SST-45</strong><span>Versión: 01</span><span>Fecha: 22/06/2026</span></div>
        </header>
        <div className="ats-fields">
          <label>Fecha:<input type="date" value={date} onChange={e=>setDate(e.target.value)} required /></label>
          <label>Hora inicio:<input type="time" value={time} onChange={e=>setTime(e.target.value)} /></label>
          <label>Lugar / frente:<input value={place} onChange={e=>setPlace(e.target.value)} /></label>
          <label>Orden de trabajo:<input value={order} onChange={e=>setOrder(e.target.value)} /></label>
          <label className="ats-span">Actividad:<input value={activity} onChange={e=>setActivity(e.target.value)} /></label>
          <label>Altura aprox. (metros):<input type="number" min="0" step="0.1" value={height} onChange={e=>setHeight(e.target.value)} /></label>
          <label>Responsable de la tarea:<input value={responsible} onChange={e=>setResponsible(e.target.value)} /></label>
          <label>Coordinador TA:<input value={coordinator} onChange={e=>setCoordinator(e.target.value)} /></label>
        </div>
        <h2 className="ats-section">1. PERSONAL PARTICIPANTE</h2>
        <table className="ats-table"><thead><tr><th>Nombre</th><th>Cédula</th><th>Cargo/rol</th><th>Capacitación TA vigente</th><th>Firma</th><th className="ats-screen-only">Acción</th></tr></thead><tbody>
          {people.map((p,i)=><tr key={i}><td><input aria-label={`Nombre participante ${i+1}`} value={p.name} onChange={e=>updatePerson(i,'name',e.target.value)}/></td><td><input aria-label="Cédula" value={p.id} onChange={e=>updatePerson(i,'id',e.target.value)}/></td><td><input aria-label="Cargo o rol" value={p.role} onChange={e=>updatePerson(i,'role',e.target.value)}/></td><td><select aria-label="Capacitación vigente" value={p.training} onChange={e=>updatePerson(i,'training',e.target.value)}><option value="">Seleccionar</option><option>Sí</option><option>No</option><option>N/A</option></select></td><td><input aria-label="Firma (nombre)" value={p.signature} onChange={e=>updatePerson(i,'signature',e.target.value)} placeholder="Firma / nombre"/></td><td className="ats-screen-only"><button type="button" className="ats-icon-button" aria-label="Quitar participante" onClick={()=>setPeople(old=>old.filter((_,n)=>n!==i))}><Trash2 size={14}/></button></td></tr>)}
        </tbody></table>
        <button type="button" className="secondary-button ats-add ats-screen-only" onClick={()=>setPeople(old=>[...old,blankPerson()])}><Plus size={14}/> Agregar participante</button>
        <h2 className="ats-section">2. ANÁLISIS DE PELIGROS, RIESGOS Y CONTROLES</h2>
        <table className="ats-table ats-hazards"><thead><tr><th>Etapa / tarea</th><th>Peligro</th><th>Consecuencia</th><th>Controles requeridos</th><th>Verificación</th><th className="ats-screen-only">Acción</th></tr></thead><tbody>
          {hazards.map((h,i)=><tr key={i}><td><textarea aria-label="Etapa o tarea" value={h.task} onChange={e=>updateHazard(i,'task',e.target.value)}/></td><td><textarea aria-label="Peligro" value={h.hazard} onChange={e=>updateHazard(i,'hazard',e.target.value)}/></td><td><textarea aria-label="Consecuencia" value={h.consequence} onChange={e=>updateHazard(i,'consequence',e.target.value)}/></td><td><textarea aria-label="Controles requeridos" value={h.controls} onChange={e=>updateHazard(i,'controls',e.target.value)}/></td><td><label className="ats-radio"><input type="radio" name={`verify-${i}`} checked={h.verification==='Sí'} onChange={()=>updateHazard(i,'verification','Sí')}/> Sí</label><label className="ats-radio"><input type="radio" name={`verify-${i}`} checked={h.verification==='No'} onChange={()=>updateHazard(i,'verification','No')}/> No</label></td><td className="ats-screen-only"><button type="button" className="ats-icon-button" aria-label="Quitar fila" onClick={()=>setHazards(old=>old.filter((_,n)=>n!==i))}><Trash2 size={14}/></button></td></tr>)}
        </tbody></table>
        <button type="button" className="secondary-button ats-add ats-screen-only" onClick={()=>setHazards(old=>[...old,blankHazard()])}><Plus size={14}/> Agregar etapa</button>
        <div className="ats-page-number">Página 1 de 2</div>
      </div>
      <div className="ats-page-sheet ats-page-two">
        <header className="ats-header">
          <div className="ats-company"><strong>TECNOPROYECTOS</strong><span>INGENIERÍA S.A.S.</span></div>
          <div className="ats-title"><strong>SISTEMA DE GESTIÓN INTEGRADO</strong><strong>GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO</strong><b>ANÁLISIS DE TRABAJO SEGURO</b></div>
          <div className="ats-meta"><strong>Código: FM-SST-45</strong><span>Versión: 01</span><span>Fecha: 22/06/2026</span></div>
        </header>
        <h2 className="ats-section">3. VERIFICACIONES PREVIAS Y RECURSOS</h2>
        <table className="ats-table"><thead><tr><th>Ítem</th><th>Cumple</th><th>Observaciones</th></tr></thead><tbody>{checks.map((c,i)=><tr key={c.item}><td>{c.item}</td><td>{(['Sí','No','N/A'] as const).map(v=><label className="ats-radio" key={v}><input type="radio" name={`check-${i}`} checked={c.status===v} onChange={()=>updateCheck(i,'status',v)}/>{v}</label>)}</td><td><input aria-label={`Observaciones ${c.item}`} value={c.notes} onChange={e=>updateCheck(i,'notes',e.target.value)}/></td></tr>)}</tbody></table>
        <h2 className="ats-section">4. AUTORIZACIÓN / REVALIDACIÓN</h2>
        <div className="ats-authorization"><label><input type="radio" name="authorization" checked={authorization==='authorized'} onChange={()=>setAuthorization('authorized')}/> Resultado del ATS: TRABAJO AUTORIZADO</label><label><input type="radio" name="authorization" checked={authorization==='stopped'} onChange={()=>setAuthorization('stopped')}/> TRABAJO NO AUTORIZADO / SUSPENDIDO</label></div>
        <div className="ats-signatures">
          <div className="ats-signature-box"><strong>Trabajador autorizado</strong><label>Nombre<input value={workerName} onChange={e=>setWorkerName(e.target.value)}/></label><SignaturePad label="Firma trabajador autorizado" value={workerSignature} onChange={setWorkerSignature}/></div>
          <div className="ats-signature-box"><strong>Coordinador de trabajo en alturas</strong><label>Nombre<input value={coordinator} onChange={e=>setCoordinator(e.target.value)}/></label><SignaturePad label="Firma coordinador TA" value={coordinatorSignature} onChange={setCoordinatorSignature}/></div>
          <div className="ats-signature-box"><strong>Responsable que autoriza</strong><label>Nombre<input value={authorizerName} onChange={e=>setAuthorizerName(e.target.value)}/></label><SignaturePad label="Firma responsable que autoriza" value={authorizerSignature} onChange={setAuthorizerSignature}/></div>
          <div className="ats-signature-box"><strong>Responsable de activar emergencias</strong><label>Nombre<input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}/></label><label>Teléfono<input type="tel" value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}/></label></div>
        </div>
        <p className="ats-legal">Revalidar o cancelar el ATS ante cambios de personal, turno, condiciones del sitio, método de acceso, condición eléctrica, clima o cualquier condición que modifique el riesgo.</p>
        <div className="ats-page-number">Página 2 de 2</div>
      </div>
    </div>
    <p className="prototype-disclaimer"><ShieldCheck size={14}/> Prototipo de revisión. Usa únicamente datos ficticios; no es un registro oficial.</p>
  </section>
}
