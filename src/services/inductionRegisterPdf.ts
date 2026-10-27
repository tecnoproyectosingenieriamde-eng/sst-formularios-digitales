import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export type InductionTopic = { name: string; response: string }
export type InductionParticipant = { name: string; identification: string; signature: string }
export type InductionRegisterRecord = { date: string; time: string; cargo: string; trainer: string; topics: InductionTopic[]; participants: InductionParticipant[] }
const LOGO_URL = 'https://static.wixstatic.com/media/d0ce54_5945f241b1534afeb1a98e9e645f4482~mv2.jpg'
const clean = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-_]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'registro'
const dateText = (value:string) => { const p=value.split('-'); return p.length===3 ? p[2]+'/'+p[1]+'/'+p[0] : value }
function sigBytes(value:string):Uint8Array|null { if(!value.startsWith('data:image/png;base64,')) return null; const raw=atob(value.slice('data:image/png;base64,'.length)); return Uint8Array.from(raw,c=>c.charCodeAt(0)) }
function drawCheck(page:PDFPage,x:number,top:number,size:number,checked:boolean,H:number){page.drawRectangle({x,y:H-top-size,width:size,height:size,borderColor:rgb(.22,.34,.46),borderWidth:.65});if(checked){page.drawLine({start:{x:x+2,y:H-top-size/2},end:{x:x+size*.42,y:H-top-size+2},thickness:1.1,color:rgb(.08,.31,.57)});page.drawLine({start:{x:x+size*.42,y:H-top-size+2},end:{x:x+size-1,y:H-top-2},thickness:1.1,color:rgb(.08,.31,.57)})}}
export async function downloadInductionRegisterPdf(record:InductionRegisterRecord) {
 const pdf=await PDFDocument.create(), regular=await pdf.embedFont(StandardFonts.Helvetica), bold=await pdf.embedFont(StandardFonts.HelveticaBold)
 const W=841.89,H=595.28,left=25,right=W-25,width=right-left,ink=rgb(.12,.19,.27),line=rgb(.58,.68,.78),blue=rgb(.08,.31,.57),pale=rgb(.86,.92,.97),muted=rgb(.35,.42,.5)
 let page={} as PDFPage, y=0
 const text=(v:string,x:number,top:number,size=7,font:PDFFont=regular,maxWidth=right-x,color=ink)=>page.drawText(v||'',{x,y:H-top-size,size,font,color,maxWidth:Math.max(10,maxWidth)})
 const rect=(x:number,top:number,w:number,h:number,fill=false)=>page.drawRectangle({x,y:H-top-h,width:w,height:h,borderColor:line,borderWidth:.55,...(fill?{color:pale}:{})})
 const wrap=(value:string,font:PDFFont,size:number,max:number)=>{const out:string[]=[];let cur='';for(const word of (value||'').split(/\s+/)){const next=cur?cur+' '+word:word;if(cur&&font.widthOfTextAtSize(next,size)>max){out.push(cur);cur=word}else cur=next}if(cur)out.push(cur);return out}
 let logoBytes:Uint8Array|null=null
 try { const response=await fetch(LOGO_URL); if(response.ok) logoBytes=new Uint8Array(await response.arrayBuffer()) } catch { /* El documento mantiene el recuadro del logo si no hay conexión. */ }
 let logo=null
 if(logoBytes){try{logo=await pdf.embedJpg(logoBytes)}catch{try{logo=await pdf.embedPng(logoBytes)}catch{logo=null}}}
 const header=()=>{page=pdf.addPage([W,H]);rect(left,16,width,60);rect(left,16,105,60);if(logo){const scale=Math.min(93/logo.width,49/logo.height);page.drawImage(logo,{x:left+6,y:H-21-logo.height*scale,width:logo.width*scale,height:logo.height*scale})}else{text('LOGO',left+34,39,9,bold,45,blue)}rect(left+105,16,490,60);text('SISTEMA DE GESTIÓN INTEGRADO',left+115,23,8,bold,470,blue);text('GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO',left+115,35,7,bold,470,blue);text('REGISTRO DE INDUCCIÓN EN SEGURIDAD Y SALUD EN EL TRABAJO',left+115,47,7,bold,470,blue);rect(left+595,16,width-595,60);text('Código: FM-SST-15',left+602,24,7,regular,110);text('Versión: 01',left+602,37,7,regular,110);text('Fecha: 22/06/2026',left+602,50,6.5,regular,110);y=81}
 const section=(label:string)=>{rect(left,y,width,14,true);text(label,left+5,y+3,7.5,bold,width-10,blue);y+=14}
 const cell=(value:string,x:number,top:number,w:number,h:number,size=6.4,font:PDFFont=regular,fill=false,color=ink)=>{rect(x,top,w,h,fill);const lines=wrap(value,font,size,w-6);const maxLines=Math.max(1,Math.floor((h-4)/(size+1.5)));lines.slice(0,maxLines).forEach((v,i)=>text(v,x+3,top+2+i*(size+1.5),size,font,w-6,color))}
 header()
 section('DATOS DE LA ACTIVIDAD')
 const cols=[width*.16,width*.13,width*.28,width*.43], vals=[['FECHA',dateText(record.date)],['HORA',record.time],['CARGO DEL TRABAJADOR',record.cargo],['NOMBRE DEL CAPACITADOR',record.trainer]]
 let x=left; vals.forEach((v,i)=>{cell(v[0],x,y,cols[i],13,5.8,bold,true,blue);cell(v[1],x,y+13,cols[i],17,6.5);x+=cols[i]});y+=30
 section('CONTENIDO DE LA INDUCCIÓN')
 const gap=8,blockW=(width-gap)/2,topicW=blockW-66,checkW=22,headerH=15
 for(let block=0;block<2;block++){
   const bx=left+block*(blockW+gap)
   cell('TEMA',bx,y,topicW,headerH,6.1,bold,true,blue)
   let cx=bx+topicW;['SÍ','NO','N/A'].forEach(v=>{cell(v,cx,y,checkW,headerH,5.8,bold,true,blue);cx+=checkW})
 }
 y+=headerH
 const rows=Array.from({length:10},(_,i)=>i)
 for(const row of rows){
   const rowTopics=[record.topics[row],record.topics[row+10]]
   const wraps=rowTopics.map((t,i)=>wrap((i===0?row+1:row+11)+'. '+(t?.name||''),regular,6.1,topicW-6))
   const rh=Math.max(24,...wraps.map(lines=>lines.length*7+5))
   for(let block=0;block<2;block++){
     const bx=left+block*(blockW+gap),topic=rowTopics[block],number=row+(block*10)
     cell((number+1)+'. '+(topic?.name||''),bx,y,topicW,rh,6.1,regular,row%2===1)
     let cx=bx+topicW
     ;['Sí','No','N/A'].forEach((option,j)=>{rect(cx,y,checkW,rh,row%2===1);drawCheck(page,cx+(checkW-8)/2,y+(rh-8)/2,8,topic?.response===option,H);cx+=checkW})
   }
   y+=rh
 }
 y+=5
 section('TRABAJADORES PARTICIPANTES')
 const pw=[width*.37,width*.25,width*.38],pxs=[left,left+width*.37,left+width*.62],headH=16
 ;['NOMBRE','CÉDULA / DOCUMENTO','FIRMA'].forEach((v,i)=>cell(v,pxs[i],y,pw[i],headH,6.1,bold,true,blue))
 y+=headH
 for(const p of record.participants){
   const h=30
   if(y+h>H-30){text('BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · FM-SST-15',left,H-23,5.6,regular,width,muted);header();section('TRABAJADORES PARTICIPANTES (CONTINUACIÓN)');;['NOMBRE','CÉDULA / DOCUMENTO','FIRMA'].forEach((v,i)=>cell(v,pxs[i],y,pw[i],headH,6.1,bold,true,blue));y+=headH}
   cell(p.name,pxs[0],y,pw[0],h,6.2);cell(p.identification,pxs[1],y,pw[1],h,6.2);rect(pxs[2],y,pw[2],h)
   const bytes=sigBytes(p.signature);if(bytes){try{const image=await pdf.embedPng(bytes);const scale=Math.min((pw[2]-8)/(image.width),(h-4)/(image.height));page.drawImage(image,{x:pxs[2]+4,y:H-y-h+2,width:image.width*scale,height:image.height*scale})}catch{}}
   y+=h
 }
 const pages=pdf.getPages();pages.forEach((p,i)=>{p.drawText('TECNOPROYECTOS INGENIERÍA S.A.S. · BORRADOR DIGITAL PARA VALIDACIÓN INTERNA · NO ES REGISTRO OFICIAL',{x:left,y:9,size:5.5,font:regular,color:muted});const label='Página '+(i+1)+' de '+pages.length;p.drawText(label,{x:right-regular.widthOfTextAtSize(label,5.7),y:9,size:5.7,font:regular,color:muted})})
 const bytes=await pdf.save(),blob=new Blob([new Uint8Array(bytes)],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FM-SST-15-'+clean(record.trainer)+'.pdf';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)
}
