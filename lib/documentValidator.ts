import Tesseract from 'tesseract.js';

// PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)
export function validatePANFormat(panNumber: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber);
}

// Aadhaar format: 12 digits
export function validateAadhaarFormat(aadhaarNumber: string): boolean {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaarNumber);
}

// Verhoeff algorithm for Aadhaar validation
export function validateAadhaarChecksum(aadhaar: string): boolean {
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  let c = 0;
  const invertedArray = aadhaar.split('').map(Number).reverse();

  invertedArray.forEach((val, i) => {
    c = d[c][p[i % 8][val]];
  });

  return c === 0;
}

// OCR extraction from image
export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw error;
  }
}

// Extract PAN from OCR text
export function extractPANFromText(text: string): string | null {
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
  const matches = text.match(panRegex);
  return matches ? matches[0] : null;
}

// Extract Aadhaar from OCR text
export function extractAadhaarFromText(text: string): string | null {
  // Remove spaces and find 12 consecutive digits
  const cleanText = text.replace(/\s/g, '');
  const aadhaarRegex = /\d{12}/g;
  const matches = cleanText.match(aadhaarRegex);
  return matches ? matches[0] : null;
}
