import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export type InductionPdfQuestion = {
  number: number
  prompt: string
  answer: string
}

export type InductionPdfRecord = {
  name: string
  cargo: string
  kind: string
  date: string
  arl: string
  signature: string
  questions: InductionPdfQuestion[]
}

function safeFileName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'evaluacion'
}

function wrapText(value: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = (value || ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ['']
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
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
  const W = 595.28
  const H = 841.89
  const margin = 48
  const contentWidth = W - margin * 2
  const ink = rgb(0.10, 0.16, 0.13)
  const green = rgb(0.16, 0.39, 0.28)
  const muted = rgb(0.36, 0.43, 0.39)
  const lineColor = rgb(0.80, 0.85, 0.81)
  let page: PDFPage
  let y = 0
  let pageNumber = 0

  const drawText = (text: string, x: number, top: number, size: number, font = regular, color = ink) => {
    page.drawText(text || '', { x, y: H - top - size, size, font, color })
  }
  const drawLine = (top: number) => {
    page.drawLine({ start: { x: margin, y: H - top }, end: { x: W - margin, y: H - top }, thickness: 0.6, color: lineColor })
  }
  const newPage = () => {
    page = pdf.addPage([W, H])
    pageNumber += 1
    page.drawRectangle({ x: margin, y: H - 90, width: contentWidth, height: 56, borderColor: lineColor, borderWidth: 0.8 })
    drawText('TECNOPROYECTOS INGENIERÍA S.A.S.', margin + 12, 43, 10, bold, green)
    drawText('SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO', margin + 12, 59, 8, regular, muted)
    drawText('EVALUACIÓN DE INDUCCIÓN SST', margin + 12, 73, 10, bold)
    drawText('Código: FM-SST-16  |  Versión: 01', W - margin - 160, 43, 7, regular, muted)
    y = 105
  }
  const ensureSpace = (needed: number) => {
    if (y + needed > H - 58) {
      newPage()
    }
  }
  const drawWrapped = (text: string, x: number, size: number, maxWidth: number, font = regular, color = ink, lineHeight = size + 4) => {
    const lines = wrapText(text, font, size, maxWidth)
    for (const line of lines) {
      ensureSpace(lineHeight)
      drawText(line, x, y, size, font, color)
      y += lineHeight
    }
  }
  newPage()
  drawText('DATOS DEL COLABORADOR', margin, y, 9, bold, green)
  y += 18
  const fieldRows = [
    ['Nombre', record.name],
    ['Cargo', record.cargo],
    ['Tipo de proceso', record.kind],
    ['Fecha de realización', formatDate(record.date)],
    ['ARL', record.arl],
  ]
  for (const [label, value] of fieldRows) {
    ensureSpace(22)
    drawText(label + ':', margin + 3, y, 8, bold)
    drawText(value || '—', margin + 130, y, 8, regular)
    drawLine(y + 16)
    y += 22
  }
  y += 10
  drawText('RESPUESTAS DE LA EVALUACIÓN', margin, y, 9, bold, green)
  y += 19

  for (const question of record.questions) {
    ensureSpace(40)
    drawWrapped(String(question.number) + '. ' + question.prompt, margin, 8.5, contentWidth, bold, ink, 12)
    drawWrapped('Respuesta: ' + (question.answer.trim() || 'Sin respuesta'), margin + 12, 8.5, contentWidth - 18, regular, muted, 12)
    y += 6
  }

  const commitment = 'Yo ' + (record.name || '____________________________') + ', me comprometo a cumplir y aplicar todas las normas y requerimientos de seguridad, salud en el trabajo y medio ambiente, al igual que las políticas internas de TECNOPROYECTOS INGENIERIA S.A.S., reportar todo acto y condición insegura, accidente de trabajo y enfermedad laboral.'
  ensureSpace(105)
  y += 5
  drawText('COMPROMISO', margin, y, 9, bold, green)
  y += 17
  drawWrapped(commitment, margin, 8.5, contentWidth, regular, ink, 12)
  y += 14
  ensureSpace(80)
  drawText('FIRMA DEL COLABORADOR', margin, y, 8, bold)
  y += 10
  drawLine(y + 46)
  const bytes = signatureBytes(record.signature)
  if (bytes) {
    try {
      const image = await pdf.embedPng(bytes)
      page.drawImage(image, { x: margin + 8, y: H - y - 42, width: 180, height: 38 })
    } catch {
      drawText('Firma no disponible', margin + 8, y + 15, 8, regular, muted)
    }
  } else {
    drawText('Sin firma', margin + 8, y + 15, 8, regular, muted)
  }

  const pages = pdf.getPages()
  pages.forEach((p, index) => {
    p.drawText('Documento de prueba · No usar como registro oficial', {
      x: margin, y: 24, size: 7, font: regular, color: muted,
    })
    const label = 'Página ' + (index + 1) + ' de ' + pages.length
    p.drawText(label, { x: W - margin - regular.widthOfTextAtSize(label, 7), y: 24, size: 7, font: regular, color: muted })
  })

  const bytesOut = await pdf.save()
  const blob = new Blob([bytesOut], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'FM-SST-16-' + safeFileName(record.name) + '.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
