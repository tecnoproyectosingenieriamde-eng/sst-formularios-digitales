import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export type AttendanceParticipant = {
  name: string
  identification: string
  company: string
  signature: string
}

export type AttendanceRecord = {
  activity: string
  date: string
  startTime: string
  endTime: string
  location: string
  instructor: string
  objective: string
  observations: string
  participants: AttendanceParticipant[]
}

function safeFileName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'registro'
}

export async function downloadAttendancePdf(record: AttendanceRecord) {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 42
  const ink = rgb(0.12, 0.22, 0.18)
  const muted = rgb(0.38, 0.44, 0.41)
  const green = rgb(0.12, 0.33, 0.26)
  const pale = rgb(0.91, 0.95, 0.92)
  let page = pdf.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight])
    y = pageHeight - margin
  }
  const ensureSpace = (height: number) => {
    if (y - height < margin) addPage()
  }
  const text = (value: string, x: number, top: number, size = 9, font = regular, color = ink) => {
    page.drawText(value || '—', { x, y: top - size, size, font, color, maxWidth: pageWidth - margin - x })
  }
  const wrapText = (value: string, maxChars = 90) => {
    const words = (value || '—').split(/\s+/)
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      if (line && `${line} ${word}`.length > maxChars) {
        lines.push(line)
        line = word
      } else {
        line = line ? `${line} ${word}` : word
      }
    }
    if (line) lines.push(line)
    return lines
  }
  const section = (title: string) => {
    ensureSpace(30)
    page.drawRectangle({ x: margin, y: y - 19, width: pageWidth - margin * 2, height: 22, color: pale })
    text(title.toUpperCase(), margin + 8, y - 3, 9, bold, green)
    y -= 31
  }
  const field = (label: string, value: string, x: number, width: number) => {
    text(label.toUpperCase(), x, y, 7, bold, muted)
    const lines = wrapText(value, Math.max(18, Math.floor(width / 5.2))).slice(0, 3)
    lines.forEach((line, index) => text(line, x, y - 12 - index * 12, 9, regular, ink))
  }

  page.drawRectangle({ x: 0, y: pageHeight - 95, width: pageWidth, height: 95, color: green })
  text('TECNOPROYECTOS INGENIERÍA S.A.S.', margin, pageHeight - 25, 10, bold, rgb(1, 1, 1))
  text('SISTEMA DE SEGURIDAD Y SALUD EN EL TRABAJO', margin, pageHeight - 44, 8, regular, rgb(0.87, 0.94, 0.89))
  text('FM-SST-14 · REGISTRO DE ASISTENCIA', margin, pageHeight - 66, 14, bold, rgb(1, 1, 1))
  y = pageHeight - 120

  page.drawRectangle({ x: margin, y: y - 34, width: pageWidth - margin * 2, height: 38, color: rgb(1, 0.96, 0.87) })
  text('BORRADOR DE REVISIÓN', margin + 9, y - 7, 9, bold, rgb(0.52, 0.34, 0.08))
  text('No es la plantilla oficial validada. Verificar el diseño antes de usarlo como registro oficial.', margin + 9, y - 21, 7, regular, rgb(0.52, 0.34, 0.08))
  y -= 55

  section('1. Información de la actividad')
  field('Actividad / tema', record.activity, margin, 310)
  field('Fecha', record.date, 390, 150)
  y -= 35
  field('Lugar', record.location, margin, 240)
  field('Responsable / facilitador', record.instructor, 310, 230)
  y -= 35
  field('Hora de inicio', record.startTime, margin, 220)
  field('Hora de finalización', record.endTime, 310, 230)
  y -= 35

  section('2. Objetivo de la actividad')
  for (const line of wrapText(record.objective, 100)) {
    ensureSpace(14)
    text(line, margin, y, 9)
    y -= 13
  }
  y -= 7

  section('3. Participantes')
  const columns = [
    { label: 'NOMBRE COMPLETO', x: margin + 5, width: 180 },
    { label: 'IDENTIFICACIÓN', x: margin + 190, width: 90 },
    { label: 'EMPRESA / ÁREA', x: margin + 285, width: 105 },
    { label: 'FIRMA / CONFIRMACIÓN', x: margin + 395, width: 110 },
  ]
  const drawParticipantHeader = () => {
    page.drawRectangle({ x: margin, y: y - 20, width: pageWidth - margin * 2, height: 23, color: green })
    columns.forEach((column) => text(column.label, column.x, y - 4, 6.2, bold, rgb(1, 1, 1)))
    y -= 26
  }
  drawParticipantHeader()
  const participants = record.participants.filter((person) => person.name.trim() || person.identification.trim() || person.company.trim() || person.signature.trim())
  for (const [index, person] of participants.entries()) {
    ensureSpace(28)
    if (y === pageHeight - margin - 55) drawParticipantHeader()
    if (index % 2 === 0) page.drawRectangle({ x: margin, y: y - 20, width: pageWidth - margin * 2, height: 23, color: rgb(0.97, 0.98, 0.97) })
    const values = [person.name, person.identification, person.company, person.signature]
    values.forEach((value, columnIndex) => {
      const column = columns[columnIndex]
      const clean = (value || '—').slice(0, columnIndex === 0 ? 32 : 19)
      text(clean, column.x, y - 5, 7.3)
    })
    y -= 23
  }
  if (participants.length === 0) {
    text('No se han agregado participantes.', margin + 5, y - 5, 8, regular, muted)
    y -= 23
  }
  y -= 12

  section('4. Observaciones')
  for (const line of wrapText(record.observations, 100)) {
    ensureSpace(14)
    text(line, margin, y, 9)
    y -= 13
  }
  y -= 25
  ensureSpace(60)
  page.drawLine({ start: { x: margin + 10, y }, end: { x: margin + 205, y }, thickness: 0.7, color: muted })
  page.drawLine({ start: { x: pageWidth - margin - 205, y }, end: { x: pageWidth - margin - 10, y }, thickness: 0.7, color: muted })
  text('Firma del responsable', margin + 10, y - 7, 8, regular, muted)
  text('Revisión SST', pageWidth - margin - 205, y - 7, 8, regular, muted)

  const pages = pdf.getPages()
  pages.forEach((current, index) => {
    current.drawLine({ start: { x: margin, y: 28 }, end: { x: pageWidth - margin, y: 28 }, thickness: 0.5, color: rgb(0.85, 0.88, 0.86) })
    current.drawText('Documento de trabajo · No usar como formato oficial sin validar la plantilla', { x: margin, y: 15, size: 7, font: regular, color: muted })
    current.drawText(`Página ${index + 1} de ${pages.length}`, { x: pageWidth - margin - 70, y: 15, size: 7, font: regular, color: muted })
  })

  const bytes = await pdf.save()
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `FM-SST-14-${safeFileName(record.activity)}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
