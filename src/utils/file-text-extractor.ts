import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Configure PDF.js worker for Chrome extension
// Use chrome.runtime.getURL to get the correct path within the extension
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs')
} else {
  // Fallback for non-extension environment
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()
}

export interface ExtractedTextResult {
  text: string
  error?: string
}

/**
 * Extract text from various file formats
 */
export async function extractTextFromFile(file: File): Promise<ExtractedTextResult> {
  try {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    // Text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file)
    }

    // PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(file)
    }

    // DOC files
    if (
      fileType === 'application/msword' ||
      fileName.endsWith('.doc')
    ) {
      return { text: '', error: 'DOC format not fully supported, please use DOCX' }
    }

    // DOCX files
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file)
    }

    // Excel files
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls')
    ) {
      return await extractTextFromExcel(file)
    }

    // CSV files
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return await extractTextFromCsv(file)
    }

    return { text: '', error: 'Unsupported file format' }
  } catch (error) {
    console.error('Error extracting text from file:', error)
    return { text: '', error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Extract text from plain text file
 */
async function extractTextFromTxt(file: File): Promise<ExtractedTextResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve({ text: text || '' })
    }
    reader.onerror = () => {
      resolve({ text: '', error: 'Failed to read text file' })
    }
    reader.readAsText(file)
  })
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPdf(file: File): Promise<ExtractedTextResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    return { text: fullText.trim() }
  } catch (error) {
    return { text: '', error: 'Failed to extract text from PDF' }
  }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDocx(file: File): Promise<ExtractedTextResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return { text: result.value }
  } catch (error) {
    return { text: '', error: 'Failed to extract text from DOCX' }
  }
}

/**
 * Extract text from Excel file
 */
async function extractTextFromExcel(file: File): Promise<ExtractedTextResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    let fullText = ''
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const sheetText = XLSX.utils.sheet_to_csv(worksheet)
      fullText += `Sheet: ${sheetName}\n${sheetText}\n\n`
    })
    
    return { text: fullText.trim() }
  } catch (error) {
    return { text: '', error: 'Failed to extract text from Excel file' }
  }
}

/**
 * Extract text from CSV file
 */
async function extractTextFromCsv(file: File): Promise<ExtractedTextResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve({ text: text || '' })
    }
    reader.onerror = () => {
      resolve({ text: '', error: 'Failed to read CSV file' })
    }
    reader.readAsText(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`
}

/**
 * Get preview of extracted text (first N characters)
 */
export function getTextPreview(text: string, maxLength: number = 100): string {
  if (!text) return ''
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength) + '...'
}

