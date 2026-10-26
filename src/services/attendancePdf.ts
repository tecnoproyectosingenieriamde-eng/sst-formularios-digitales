import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib'

export type AttendanceParticipant = {
  name: string
  identification: string
  cargo: string
  signature: string
}

export type AttendanceRecord = {
  activity: string
  date: string
  location: string
  responsible: string
  facilitatorName: string
  facilitatorRole: string
  facilitatorSignature: string
  observations: string
  participants: AttendanceParticipant[]
}

function safeFileName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'registro'
}

function signatureBytes(dataUrl: string): Uint8Array | null {
  if (!dataUrl.startsWith('data:image/png;base64,')) return null
  const binary = atob(dataUrl.slice('data:image/png;base64,'.length))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function downloadAttendancePdf(record: AttendanceRecord) {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 38
  const ink = rgb(0.12, 0.19, 0.16)
  const muted = rgb(0.38, 0.45, 0.41)
  const green = rgb(0.12, 0.31, 0.24)
  const pale = rgb(0.91, 0.95, 0.92)
  const line = rgb(0.80, 0.85, 0.82)
  let page = {} as PDFPage
  let y = 0
  let pageNumber = 0

  const drawText = (value: string, x: number, top: number, size = 9, font = regular, color = ink, maxWidth = pageWidth - margin - x) => {
    page.drawText(value || '-', { x, y: top - size, size, font, color, maxWidth })
  }
  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight])
    pageNumber += 1
    page.drawRectangle({ x: 0, y: pageHeight - 78, width: pageWidth, height: 78, color: green })
    drawText('TECNOPROYECTOS INGENIERÍA S.A.S.', margin, pageHeight - 18, 9, bold, rgb(1, 1, 1))
    drawText('SISTEMA DE SEGURIDAD Y SALUD EN EL TRABAJO', margin, pageHeight - 34, 7.5, regular, rgb(0.88, 0.94, 0.90))
    drawText('FM-SST-14 · REGISTRO DE ASISTENCIA', margin, pageHeight - 52, 12, bold, rgb(1, 1, 1))
    page.drawRectangle({ x: margin, y: pageHeight - 112, width: pageWidth - margin * 2, height: 23, color: rgb(1, 0.96, 0.87) })
    drawText('BORRADOR DE REVISIÓN', margin + 8, pageHeight - 96, 8, bold, rgb(0.52, 0.34, 0.08))
    drawText('Maqueta rediseñada: no es la plantilla institucional original validada.', margin + 8, pageHeight - 106, 6.5, regular, rgb(0.52, 0.34, 0.08))
    y = pageHeight - 132
  }
  const ensureSpace = (height: number) => {
    if (y - height < 55) addPage()
  }
  const section = (title: string) => {
    ensureSpace(28)
    page.drawRectangle({ x: margin, y: y - 18, width: pageWidth - margin * 2, height: 21, color: pale })
    drawText(title.toUpperCase(), margin + 7, y - 3, 8, bold, green)
    y -= 28
  }
  const field = (label: string, value: string, x: number, width: number) => {
    drawText(label.toUpperCase(), x, y, 6.5, bold, muted, width)
    const maxChars = Math.max(15, Math.floor(width / 5.1))
    const words = (value || '-').split(/\s+/)
    const lines: string[] = []
    let current = ''
    for (const word of words) {
      if (current && (current + ' ' + word).length > maxChars) {
        lines.push(current)
        current = word
      } else current = current ? current + ' ' + word : word
    }
    if (current) lines.push(current)
    lines.slice(0, 2).forEach((valueLine, index) => drawText(valueLine, x, y + 11 + index * 11, 8.5, regular, ink, width))
  }
  addPage()
  section('1. Información de la actividad')
  field('Tema / actividad', record.activity, margin, 320)
  field('Fecha', record.date, margin + 340, 170)
  y -= 31
  field('Lugar', record.location, margin, 240)
  field('Responsable de la actividad', record.responsible, margin + 260, 230)
  y -= 31
  field('Nombre del facilitador', record.facilitatorName, margin, 240)
  field('Cargo del facilitador', record.facilitatorRole, margin + 260, 230)
  y -= 35

  section('2. Registro de asistentes')
  const tableX = margin
  const tableWidth = pageWidth - margin * 2
  const cols = [
    { label: 'NOMBRE COMPLETO', x: tableX + 6, width: 160 },
    { label: 'IDENTIFICACIÓN', x: tableX + 170, width: 95 },
    { label: 'CARGO', x: tableX + 270, width: 105 },
    { label: 'FIRMA', x: tableX + 380, width: 135 },
  ]
  const drawTableHeader = () => {
    page.drawRectangle({ x: tableX, y: y - 19, width: tableWidth, height: 22, color: green })
    cols.forEach((col) => drawText(col.label, col.x, y - 3, 6.5, bold, rgb(1, 1, 1), col.width))
    y -= 22
  }
  drawTableHeader()
  const people = record.participants.filter((person) => person.name.trim() || person.identification.trim() || person.cargo.trim() || person.signature)
  if (people.length === 0) {
    page.drawRectangle({ x: tableX, y: y - 24, width: tableWidth, height: 25, color: rgb(0.98, 0.99, 0.98), borderColor: line, borderWidth: 0.4 })
    drawText('Sin asistentes registrados', tableX + 6, y - 6, 8, regular, muted)
    y -= 25
  }
  for (const [index, person] of people.entries()) {
    if (y - 31 < 65) {
      addPage()
      drawText('REGISTRO DE ASISTENTES (CONTINUACIÓN)', margin, y, 8, bold, green)
      y -= 18
      drawTableHeader()
    }
    const rowHeight = 29
    page.drawRectangle({ x: tableX, y: y - rowHeight + 4, width: tableWidth, height: rowHeight, color: index % 2 === 0 ? rgb(0.97, 0.98, 0.97) : rgb(1, 1, 1), borderColor: line, borderWidth: 0.35 })
    drawText(person.name.slice(0, 38), cols[0].x, y - 5, 7.2, regular, ink, cols[0].width)
    drawText(person.identification.slice(0, 22), cols[1].x, y - 5, 7.2, regular, ink, cols[1].width)
    drawText(person.cargo.slice(0, 25), cols[2].x, y - 5, 7.2, regular, ink, cols[2].width)
    const bytes = signatureBytes(person.signature)
    if (bytes) {
      try {
        const image = await pdf.embedPng(bytes)
        page.drawImage(image, { x: cols[3].x, y: y - 23, width: 85, height: 22 })
      } catch {
        drawText('Firma no válida', cols[3].x, y - 5, 6.5, regular, muted)
      }
    } else drawText('Sin firma', cols[3].x, y - 5, 6.5, regular, muted)
    y -= rowHeight
  }
  y -= 12
  section('3. Observaciones')
  const observations = (record.observations || '-').split(/\s+/)
  let observationLine = ''
  for (const word of observations) {
    if (observationLine && (observationLine + ' ' + word).length > 95) {
      ensureSpace(13)
      drawText(observationLine, margin, y, 8.5)
      y -= 12
      observationLine = word
    } else observationLine = observationLine ? observationLine + ' ' + word : word
  }
  if (observationLine) {
    ensureSpace(13)
    drawText(observationLine, margin, y, 8.5)
    y -= 12
  }
  y -= 16
  ensureSpace(70)
  drawText('FACILITADOR: ' + record.facilitatorName, margin, y, 7, bold, muted)
  y -= 10
  const facilitatorBytes = signatureBytes(record.facilitatorSignature)
  if (facilitatorBytes) {
    try {
      const image = await pdf.embedPng(facilitatorBytes)
      page.drawImage(image, { x: margin, y: y - 34, width: 135, height: 34 })
    } catch {
      drawText('Firma no válida', margin, y, 7, regular, muted)
    }
  } else drawText('Firma pendiente', margin, y, 7, regular, muted)
  y -= 42
  drawText('Firma del facilitador', margin, y, 7, regular, muted)
  const pages = pdf.getPages()
  pages.forEach((current, index) => {
    current.drawLine({ start: { x: margin, y: 34 }, end: { x: pageWidth - margin, y: 34 }, thickness: 0.5, color: line })
    current.drawText('Documento de trabajo · No usar como formato oficial sin validar la plantilla', { x: margin, y: 20, size: 6.5, font: regular, color: muted })
    current.drawText('Página ' + (index + 1) + ' de ' + pages.length, { x: pageWidth - margin - 70, y: 20, size: 6.5, font: regular, color: muted })
  })

  const bytes = await pdf.save()
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'FM-SST-14-' + safeFileName(record.activity) + '.pdf'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
