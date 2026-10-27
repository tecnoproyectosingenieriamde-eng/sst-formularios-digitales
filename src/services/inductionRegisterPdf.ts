import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export type InductionTopic = { name: string; response: string }
export type InductionParticipant = { name: string; identification: string; socialized: string; signature: string }
export type InductionRegisterRecord = { date: string; time: string; cargo: string; trainer: string; topics: InductionTopic[]; participants: InductionParticipant[] }
const clean = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-_]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'registro'
const dateText = (value:string) => { const p=value.split('-'); return p.length===3 ? p[2]+'/'+p[1]+'/'+p[0] : value }
function sigBytes(value:string):Uint8Array|null { if(!value.startsWith('data:image/png;base64,')) return null; const raw=atob(value.slice('data:image/png;base64,'.length)); return Uint8Array.from(raw,c=>c.charCodeAt(0)) }
export async function downloadInductionRegisterPdf(record:InductionRegisterRecord) {
 const pdf=await PDFDocument.create(), regular=await pdf.embedFont(StandardFonts.Helvetica), bold=await pdf.embedFont(StandardFonts.HelveticaBold)
 const W=595.28,H=841.89,left=36,right=W-36,width=right-left,ink=rgb(.12,.16,.14),line=rgb(.42,.48,.44),pale=rgb(.92,.95,.93),muted=rgb(.38,.43,.4)
 let page={} as PDFPage, y=0
 const text=(v:string,x:number,top:number,size=8,font:PDFFont=regular,maxWidth=right-x)=>page.drawText(v||'',{x,y:H-top-size,size,font,color:ink,maxWidth:Math.max(10,maxWidth)})
 const rect=(x:number,top:number,w:number,h:number,fill=false)=>page.drawRectangle({x,y:H-top-h,width:w,height:h,borderColor:line,borderWidth:.5,...(fill?{color:pale}:{})})
 const wrap=(value:string,font:PDFFont,size:number,max:number)=>{const out:string[]=[];let cur='';for(const word of (value||'').split(/\s+/)){const next=cur?cur+' '+word:word;if(cur&&font.widthOfTextAtSize(next,size)>max){out.push(cur);cur=word}else cur=next}if(cur)out.push(cur);return out}
 const header=()=>{page=pdf.addPage([W,H]);rect(left,25,width,67);rect(left,25,105,67);text('TECNOPROYECTOS',left+5,43,7,bold,95);text('INGENIERÍA S.A.S.',left+5,55,6,bold,95);rect(left+105,25,250,67);text('SISTEMA DE GESTIÓN INTEGRADO',left+112,33,8,bold,235);text('GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO',left+112,46,6.5,bold,235);text('REGISTRO DE INDUCCIÓN EN SEGURIDAD Y SALUD EN EL TRABAJO',left+112,59,6,bold,235);rect(left+355,25,width-355,67);text('Código: FM-SST-15',left+361,36,7,regular,95);text('Versión: 01',left+361,50,7,regular,95);text('Fecha: 22/06/2026',left+361,64,6.5,regular,95);y=101}
 const section=(label:string)=>{rect(left,y,width,16,true);text(label,left+5,y+4,8,bold);y+=16}
 const cell=(value:string,x:number,top:number,w:number,h:number,size=7,font:PDFFont=regular,fill=false)=>{rect(x,top,w,h,fill);const lines=wrap(value,font,size,w-8);lines.slice(0,Math.max(1,Math.floor((h-7)/(size+2)))).forEach((v,i)=>text(v,x+4,top+4+i*(size+2),size,font,w-8))}
 header()
 section('DATOS DE LA ACTIVIDAD')
 const cols=[width*.18,width*.32,width*.15,width*.35], vals=[['FECHA',dateText(record.date)],['HORA',record.time],['CARGO DEL TRABAJADOR',record.cargo],['NOMBRE DEL CAPACITADOR',record.trainer]]
 let x=left; vals.forEach((v,i)=>{cell(v[0],x,y,cols[i],18,6.2,bold,true);cell(v[1],x,y+18,cols[i],26,7);x+=cols[i]});y+=44
 section('CONTENIDO DE LA INDUCCIÓN')
 const tw=[width*.78,width*.0733,width*.0733,width*.0734]
 let rowX=left;['TEMA','SÍ','NO','N/A'].forEach((v,i)=>{cell(v,rowX,y,tw[i],18,7,bold,true);rowX+=tw[i]});y+=18
 for(const topic of record.topics){const lines=wrap(topic.name,regular,6.8,tw[0]-8);const h=Math.max(19,lines.length*8+6);if(y+h>H-55){text('BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · FM-SST-15',left,H-30,6,regular,width);header();section('CONTENIDO DE LA INDUCCIÓN (CONTINUACIÓN)');rowX=left;['TEMA','SÍ','NO','N/A'].forEach((v,i)=>{cell(v,rowX,y,tw[i],18,7,bold,true);rowX+=tw[i]});y+=18}cell(topic.name,left,y,tw[0],h,6.8);let xx=left+tw[0];['Sí','No','N/A'].forEach((option,i)=>{cell(topic.response===option?'X':'',xx,y,tw[i+1],h,8,bold);xx+=tw[i+1]});y+=h}
 y+=8;section('TRABAJADORES PARTICIPANTES')
 const pw=[width*.29,width*.20,width*.14,width*.37]
 let px=left;['NOMBRE','CÉDULA / DOCUMENTO','¿SOCIALIZADO?','FIRMA'].forEach((v,i)=>{cell(v,px,y,pw[i],22,6.3,bold,true);px+=pw[i]});y+=22
 for(const p of record.participants){const h=42;if(y+h>H-55){text('BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · FM-SST-15',left,H-30,6,regular,width);header();section('TRABAJADORES PARTICIPANTES (CONTINUACIÓN)');px=left;['NOMBRE','CÉDULA / DOCUMENTO','¿SOCIALIZADO?','FIRMA'].forEach((v,i)=>{cell(v,px,y,pw[i],22,6.3,bold,true);px+=pw[i]});y+=22}let xx=left;cell(p.name,xx,y,pw[0],h,6.5);xx+=pw[0];cell(p.identification,xx,y,pw[1],h,6.5);xx+=pw[1];cell(p.socialized,xx,y,pw[2],h,7);xx+=pw[2];rect(xx,y,pw[3],h);const bytes=sigBytes(p.signature);if(bytes){try{const image=await pdf.embedPng(bytes);page.drawImage(image,{x:xx+4,y:H-y-h+4,width:pw[3]-8,height:h-8})}catch{}}y+=h}
 const pages=pdf.getPages();pages.forEach((p,i)=>{p.drawText('TECNOPROYECTOS INGENIERÍA S.A.S. · BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · NO ES REGISTRO OFICIAL',{x:left,y:18,size:5.8,font:regular,color:muted});const label='Página '+(i+1)+' de '+pages.length;p.drawText(label,{x:right-regular.widthOfTextAtSize(label,6),y:18,size:6,font:regular,color:muted})})
 const bytes=await pdf.save(),blob=new Blob([new Uint8Array(bytes)],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FM-SST-15-'+clean(record.trainer)+'.pdf';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)
}
