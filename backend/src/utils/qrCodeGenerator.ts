import QRCode from 'qrcode';
import { ContainerColor } from '../types/Container';

/**
 * Generate a QR code as a data URL
 * @param qrCode - The QR code text (e.g., "Red-01")
 * @param size - Optional size in pixels (default: 300)
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateQRCodeImage(
  qrCode: string,
  size: number = 300
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(qrCode, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}

/**
 * Format QR code string from color and number
 * @param color - Container color
 * @param number - Container number (1-99)
 * @returns Formatted QR code string (e.g., "Red-01")
 */
export function formatQRCode(color: ContainerColor, number: number): string {
  // Pad number with leading zero if needed (01, 02, ... 99)
  const paddedNumber = number.toString().padStart(2, '0');
  return `${color}-${paddedNumber}`;
}

/**
 * Parse QR code string into color and number
 * @param qrCode - QR code string (e.g., "Red-01")
 * @returns Object with color and number, or null if invalid
 */
export function parseQRCode(qrCode: string): {
  color: string;
  number: number;
} | null {
  const match = qrCode.match(/^([A-Za-z]+)-(\d{2})$/);
  if (!match) return null;

  const [, color, numberStr] = match;
  const number = parseInt(numberStr, 10);

  if (number < 1 || number > 99) return null;

  return { color, number };
}

/**
 * Validate QR code format
 * @param qrCode - QR code string to validate
 * @returns true if valid format, false otherwise
 */
export function validateQRCodeFormat(qrCode: string): boolean {
  return parseQRCode(qrCode) !== null;
}
