import { useState } from 'react'
import { ArrowLeft, Download, Plus, Trash2, ShieldCheck } from 'lucide-react'
import SignaturePad from './SignaturePad'
import { downloadInductionRegisterPdf, type InductionRegisterRecord, type InductionTopic } from '../services/inductionRegisterPdf'

const topics = [
  'Política de Seguridad y Salud en el Trabajo',
  'Política para la prevención y promoción frente al consumo de alcohol, tabaco y sustancias psicoactivas',
  'Política para la prevención del acoso laboral y acoso sexual laboral',
  'Otras políticas de la organización',
  'Objetivos y metas del sistema de gestión de la seguridad y salud en el trabajo (SG-SST)',
  'Conceptos de Riesgo y Peligro',
  'Concepto de auto reporte de condiciones',
  'Concepto de accidente de Trabajo y Enfermedad Laboral',
  'Sistema de Seguridad Social Integral',
  'Deberes y derechos de los trabajadores',
  'Comité Paritario de SST y Comité de Convivencia Laboral',
  'Plan y números de Emergencias',
  'Red de Atención Médica',
  'Clasificación de peligros y riesgos',
  'Controles frente a los peligros y riesgos',
  'Estándar para la prevención de caídas al mismo y diferente nivel',
  'Uso de Elementos de Protección Personal',
  '¿Qué hacer en caso de un accidente?',
  'Reporte e investigación de accidentes',
  'Incapacidades y ausencias',
]
const blankTopic = (name: string): InductionTopic => ({ name, response: '' })
const blankParticipant = () => ({ name: '', identification: '', socialized: '', signature: '' })
const today = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-') }
const initialRecord = (): InductionRegisterRecord => ({ date: today(), time: '08:00 AM', cargo: '', trainer: 'Matilde Chamorro Simanca', topics: topics.map(blankTopic), participants: [blankParticipant()] })

type Props = { onBack: () => void }
export default function InductionRegister({ onBack }: Props) {
  const [record, setRecord] = useState<InductionRegisterRecord>(initialRecord)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const update = (key: 'date'|'time'|'cargo'|'trainer', value: string) => setRecord(old => ({ ...old, [key]: value }))
  const updateTopic = (index: number, response: string) => setRecord(old => ({ ...old, topics: old.topics.map((t,i) => i === index ? {...t,response} : t) }))
  const updateParticipant = (index: number, key: 'name'|'identification'|'socialized'|'signature', value: string) => setRecord(old => ({...old, participants: old.participants.map((p,i) => i === index ? {...p,[key]:value} : p)}))
  const exportPdf = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice('')
    try { await downloadInductionRegisterPdf(record); setNotice('PDF preliminar generado. Revisa el diseño antes de usarlo como registro oficial.') }
    catch { setNotice('No se pudo generar el PDF. Intenta nuevamente.') }
    finally { setBusy(false) }
  }
  const fieldStyle: React.CSSProperties = { width:'100%', boxSizing:'border-box', padding:'11px 12px', border:'1px solid #d7dedb', borderRadius:8, background:'#fff', font:'inherit', color:'#182522' }
  const labelStyle: React.CSSProperties = { display:'grid', gap:7, fontSize:13, fontWeight:600, color:'#33413d' }
  const panelStyle: React.CSSProperties = { background:'#fff', border:'1px solid #e0e7e3', borderRadius:14, padding:20, marginTop:18 }
  return <section className="attendance-page">
    <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={16}/> Volver al catálogo</button>
    <div className="eyebrow"><span className="eyebrow-line"/> FORMULARIO EN DESARROLLO</div>
    <h1>Registro de inducción <span>SST.</span></h1>
    <p className="welcome-copy">FM-SST-15 · Versión 01 · Diligencia los datos, valida los temas tratados y registra a cada trabajador participante.</p>
    <div className="draft-warning"><ShieldCheck size={20}/><div><strong>Formato en validación</strong><p>Usa datos ficticios. Este prototipo no guarda información en una base de datos y el PDF generado requiere revisión visual contra la plantilla institucional.</p></div></div>
    <form onSubmit={exportPdf}>
      <div style={panelStyle}>
        <h2 style={{marginTop:0}}>01 · Datos de la actividad</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:16}}>
          <label style={labelStyle}>Fecha<input style={fieldStyle} type="date" required value={record.date} onChange={e=>update('date',e.target.value)}/></label>
          <label style={labelStyle}>Hora<input style={fieldStyle} required maxLength={30} value={record.time} onChange={e=>update('time',e.target.value)} placeholder="08:00 AM"/></label>
          <label style={labelStyle}>Cargo del trabajador<input style={fieldStyle} required maxLength={120} value={record.cargo} onChange={e=>update('cargo',e.target.value)} placeholder="Cargo del trabajador"/></label>
          <label style={labelStyle}>Nombre del capacitador<input style={fieldStyle} required maxLength={120} value={record.trainer} onChange={e=>update('trainer',e.target.value)}/></label>
        </div>
      </div>
      <div style={panelStyle}>
        <h2 style={{marginTop:0}}>02 · Contenido de la inducción</h2>
        <p style={{color:'#68756f',fontSize:13}}>Marca una respuesta por cada tema tratado.</p>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:'#edf3ef',textAlign:'left'}}><th style={{padding:10}}>Tema</th><th style={{padding:10,width:210}}>Respuesta</th></tr></thead>
            <tbody>{record.topics.map((topic,index)=><tr key={topic.name}><td style={{padding:10,borderBottom:'1px solid #e5ebe7'}}>{index+1}. {topic.name}</td><td style={{padding:10,borderBottom:'1px solid #e5ebe7'}}><select required aria-label={'Respuesta: '+topic.name} style={fieldStyle} value={topic.response} onChange={e=>updateTopic(index,e.target.value)}><option value="">Seleccionar…</option><option value="Sí">Sí</option><option value="No">No</option><option value="N/A">N/A</option></select></td></tr>)}</tbody>
          </table>
        </div>
        <p style={{fontSize:12,color:'#855d16',marginBottom:0}}>Nota de validación: la información recibida menciona 22 temas, pero enumera 20. Se han incluido los 20 temas suministrados, sin inventar los dos faltantes.</p>
      </div>
      <div style={panelStyle}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><div><h2 style={{margin:'0 0 5px'}}>03 · Trabajadores participantes</h2><p style={{margin:0,color:'#68756f',fontSize:13}}>Registra nombre, documento, socialización y firma.</p></div><button className="secondary-button" type="button" onClick={()=>setRecord(old=>({...old,participants:[...old.participants,blankParticipant()]}))}><Plus size={16}/> Agregar trabajador</button></div>
        {record.participants.map((p,index)=><div key={index} style={{border:'1px solid #e0e7e3',borderRadius:10,padding:14,marginTop:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><strong>TRABAJADOR {String(index+1).padStart(2,'0')}</strong>{record.participants.length>1&&<button type="button" className="remove-row" onClick={()=>setRecord(old=>({...old,participants:old.participants.filter((_,i)=>i!==index)}))}><Trash2 size={14}/> Quitar</button>}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,alignItems:'start'}}>
            <label style={labelStyle}>Nombre completo<input style={fieldStyle} required maxLength={140} value={p.name} onChange={e=>updateParticipant(index,'name',e.target.value)}/></label>
            <label style={labelStyle}>Cédula / documento<input style={fieldStyle} required maxLength={50} value={p.identification} onChange={e=>updateParticipant(index,'identification',e.target.value)}/></label>
            <label style={labelStyle}>¿Socializado?<select required style={fieldStyle} value={p.socialized} onChange={e=>updateParticipant(index,'socialized',e.target.value)}><option value="">Seleccionar…</option><option value="Sí">Sí</option><option value="No">No</option><option value="N/A">N/A</option></select></label>
            <SignaturePad label="Firma del colaborador" value={p.signature} onChange={value=>updateParticipant(index,'signature',value)}/>
          </div>
        </div>)}
      </div>
      {notice && <div className="form-notice" role="status">{notice}</div>}
      <div className="form-actions"><button type="button" className="secondary-button" onClick={()=>{setRecord(initialRecord());setNotice('')}}>Limpiar formulario</button><button type="submit" className="primary-button" disabled={busy}>{busy?'Generando PDF…':'Generar PDF preliminar'} <Download size={17}/></button></div>
    </form>
    <p className="prototype-disclaimer">Prototipo de desarrollo · No usar todavía para registros oficiales.</p>
  </section>
}
