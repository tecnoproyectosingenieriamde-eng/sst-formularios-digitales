import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export type InductionPdfQuestion = {
  number: number
  prompt: string
  answer: string
  options?: string[]
  group?: 'open' | 'trueFalse' | 'multiple' | 'arl'
  selected?: string
}
export type InductionPdfRecord = {
  name: string; cargo: string; kind: string; date: string; arl: string; signature: string; questions: InductionPdfQuestion[]
}
function safeFileName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'evaluacion'
}
function signatureBytes(dataUrl: string): Uint8Array | null {
  if (!dataUrl.startsWith('data:image/png;base64,')) return null
  const binary = atob(dataUrl.slice('data:image/png;base64,'.length))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}
function formatDate(value: string) {
  const parts = value.split('-')
  return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : value
}
export async function downloadInductionPdf(record: InductionPdfRecord) {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const W = 595.28, H = 841.89, margin = 32, right = W - margin, width = right - margin
  const ink = rgb(.12,.14,.13), line = rgb(.25,.27,.25), pale = rgb(.94,.95,.94), muted = rgb(.38,.4,.38)
  let page: PDFPage
  let y = 0
  const text = (value: string, x: number, top: number, size = 7.4, font: PDFFont = regular) => {
    page.drawText(value || '', { x, y: H - top - size, size, font, color: ink, maxWidth: Math.max(10, right-x) })
  }
  const rect = (x:number, top:number, w:number, h:number, fill?: boolean) => page.drawRectangle({x,y:H-top-h,width:w,height:h,borderColor:line,borderWidth:.55,...(fill?{color:pale}:{})})
  const wrap = (value:string, font:PDFFont, size:number, max:number) => {
    const out:string[]=[]; let current=''
    for(const word of (value||' ').split(/\s+/)) { const candidate=current?current+' '+word:word
      if(current && font.widthOfTextAtSize(candidate,size)>max){out.push(current);current=word}else current=candidate }
    if(current)out.push(current); return out
  }
  const cellText = (value:string,x:number,top:number,w:number,size=7.1,font:PDFFont=regular) => {
    let lines=wrap(value,font,size,w-8); const maxLines=Math.max(1,Math.floor((1000)/ (size+2)))
    lines=lines.slice(0,maxLines)
    lines.forEach((l,i)=>page.drawText(l,{x:x+4,y:H-top-5-size-i*(size+2),size,font,color:ink}))
  }
  const header = async (pageNo:number) => {
    // Use the company's supplied logo in the original header position (left); if the host blocks cross-origin access, retain a clean placeholder.
    let logoDrawn=false
    try {
      const response=await fetch('https://static.wixstatic.com/media/d0ce54_5945f241b1534afeb1a98e9e645f4482~mv2.jpg')
      if(response.ok){const bytes=new Uint8Array(await response.arrayBuffer());const logo=await pdf.embedJpg(bytes);page.drawImage(logo,{x:margin+5,y:H-58,width:58,height:38,opacity:1});logoDrawn=true}
    } catch { /* External logo is optional in the offline/blocked case. */ }
    rect(margin,28,width,58)
    if(!logoDrawn) { text('TECNOPROYECTOS',margin+6,40,7.2,bold); text('INGENIERÍA S.A.S.',margin+6,50,6.8,bold) }
    text('SISTEMA DE GESTIÓN INTEGRADO',margin+82,34,8,bold)
    text('GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO',margin+82,45,6.8,bold)
    text('EVALUACIÓN DE LA INDUCCIÓN EN SEGURIDAD Y SALUD EN EL TRABAJO',margin+82,56,6.1,bold)
    page.drawLine({start:{x:W-137,y:H-28},end:{x:W-137,y:H-86},thickness:.5,color:line})
    text('Código: FM-SST-16',W-130,35,6.5)
    text('Versión: 01',W-130,48,6.5)
    text('Fecha: 22/06/2026',W-130,61,6.5)
    y=94
  }
  const newPage = async () => { page=pdf.addPage([W,H]); await header(pdf.getPages().length) }
  const section = (label:string) => { rect(margin,y,width,15,true); text(label,margin+5,y+4,7.5,bold); y+=15 }
  const tableRow = (cells:string[], widths:number[], height:number, boldCells=false, selectedIndex=-1) => {
    let x=margin
    cells.forEach((value,i)=>{rect(x,y,widths[i],height,i===selectedIndex);cellText(value,x,y,widths[i],6.8,boldCells?bold:regular);x+=widths[i]})
    y+=height
  }
  const openTable = (items:InductionPdfQuestion[]) => {
    tableRow(['CONCEPTO','DEFINICIÓN'],[width*.39,width*.61],17,true)
    items.forEach(q=>{
      const promptLines=wrap(q.prompt,bold,7,width*.39-8)
      const answerLines=wrap(q.answer||' ',regular,7,width*.61-8)
      const h=Math.max(42,Math.max(promptLines.length,answerLines.length)*9+12)
      tableRow([q.number+'. '+q.prompt,q.answer||''],[width*.39,width*.61],Math.min(h,90))
    })
  }
  await newPage()
  section('DATOS GENERALES')
  tableRow(['NOMBRE',record.name,'CARGO',record.cargo],[width*.20,width*.35,width*.14,width*.31],24,true)
  tableRow(['INDUCCIÓN','☐ '+(record.kind==='Inducción'?'X':'')+'   RE-INDUCCIÓN','FECHA REALIZACIÓN',formatDate(record.date)],[width*.20,width*.30,width*.22,width*.28],24,true)
  section('CRITERIOS DE EVALUACIÓN')
  text('Cada pregunta suma un punto. La inducción se aprobará con un mínimo de 12 puntos en total; quien no apruebe debe recibir nuevamente inducción y presentarla.',margin+5,y+4,7)
  y+=24
  section('En las siguientes preguntas diligencie en el espacio en blanco las respuestas adecuadas a cada pregunta.')
  openTable(record.questions.filter(q=>q.group==='open'))
  y+=8
  section('Responda las siguientes preguntas con falso o verdadero según corresponda:')
  tableRow(['CONCEPTO','DEFINICIÓN','F','V'],[width*.23,width*.57,width*.10,width*.10],17,true)
  record.questions.filter(q=>q.group==='trueFalse').forEach(q=>{
    const h=Math.max(34,wrap(q.prompt,regular,6.6,width*.57-8).length*8+8)
    tableRow([q.prompt,q.prompt,'F '+(q.selected==='F'?'X':'') ,'V '+(q.selected==='V'?'X':'')],[width*.23,width*.57,width*.10,width*.10],h)
  })
  await newPage()
  section('De las TRES opciones que aparecen marque la respuesta correcta en la casilla correspondiente')
  tableRow(['CONCEPTO','DEFINICIÓN','A','B','C'],[width*.22,width*.58,width*.066,width*.066,width*.068],17,true)
  record.questions.filter(q=>q.group==='multiple').forEach(q=>{
    const options=q.options||[]
    const lines=options.map((o,i)=>String.fromCharCode(97+i)+') '+o)
    const height=Math.max(55,lines.reduce((n,v)=>n+wrap(v,regular,6.2,width*.58-8).length*7.5,0)+10)
    const x0=margin
    rect(x0,y,width*.22,height);cellText(q.number+'. '+q.prompt,x0,y,width*.22,6.8,bold)
    rect(x0+width*.22,y,width*.58,height)
    let ty=y+5
    lines.forEach((v,i)=>{const wrapped=wrap(v,regular,6.2,width*.58-8);wrapped.forEach(l=>{page.drawText(l,{x:x0+width*.22+4,y:H-ty-6.2,size:6.2,font:regular,color:ink});ty+=7.5});ty+=1})
    let x=x0+width*.80
    ;['A','B','C'].forEach(letter=>{rect(x,y,width*.066,height, q.selected===letter);cellText(q.selected===letter?'X':'',x,y,width*.066,7,bold);x+=width*.066})
    y+=height
  })
  y+=5
  tableRow(['¿A qué ARL quedará usted afiliado?',record.arl],[width*.45,width*.55],23,true)
  y+=8
  section('COMPROMISO')
  const commitment='Yo '+(record.name||'____________________________')+', me comprometo a cumplir y aplicar todas las normas y requerimientos de seguridad, salud en el trabajo y medio ambiente, al igual que las políticas internas de TECNOPROYECTOS INGENIERIA S.A.S., reportar todo acto y condición insegura, accidente de trabajo y enfermedad laboral.'
  const cLines=wrap(commitment,regular,7.2,width-12)
  cLines.forEach((l,i)=>text(l,margin+5,y+5+i*10,7.2))
  y+=cLines.length*10+14
  text('Firma',margin+width*.43,y,7.2,bold); rect(margin+width*.25,y+12,width*.5,45)
  const bytes=signatureBytes(record.signature)
  if(bytes){try{const image=await pdf.embedPng(bytes);page.drawImage(image,{x:margin+width*.28,y:H-y-52,width:width*.42,height:34})}catch{}}
  y+=66
  section('CALIFICACIÓN DEL EVALUADOR (DILIGENCIAR POR SST)')
  tableRow(['Puntaje obtenido: ____ / 15','Nombre del evaluador: __________________________'],[width*.48,width*.52],25)
  tableRow(['Resultado: ☐ Aprobó  ☐ No aprobó','Firma del evaluador: ___________________________'],[width*.48,width*.52],25)
  const pages=pdf.getPages()
  pages.forEach((p,i)=>{p.drawText('BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · NO USAR COMO REGISTRO OFICIAL',{x:margin,y:25,size:6.4,font:regular,color:muted});const label='Página '+(i+1)+' de '+pages.length;p.drawText(label,{x:right-regular.widthOfTextAtSize(label,6.4),y:25,size:6.4,font:regular,color:muted})})
  const bytesOut=await pdf.save()
  const pdfBuffer=new ArrayBuffer(bytesOut.byteLength);new Uint8Array(pdfBuffer).set(bytesOut)
  const blob=new Blob([pdfBuffer],{type:'application/pdf'});const url=URL.createObjectURL(blob);const link=document.createElement('a')
  link.href=url;link.download='FM-SST-16-'+safeFileName(record.name)+'.pdf';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url)
}
