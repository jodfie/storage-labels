import { VALID_COLORS, ContainerColor } from '../types/Container';

/**
 * Validate container color
 * @param color - Color string to validate
 * @returns true if valid, false otherwise
 */
export function isValidColor(color: string): color is ContainerColor {
  return VALID_COLORS.includes(color as ContainerColor);
}

/**
 * Validate container number
 * @param number - Number to validate
 * @returns true if valid (1-99), false otherwise
 */
export function isValidNumber(number: number): boolean {
  return Number.isInteger(number) && number >= 1 && number <= 99;
}

/**
 * Validate UUID format
 * @param uuid - String to validate as UUID
 * @returns true if valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
