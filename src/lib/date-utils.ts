import { format, parseISO, isValid, differenceInDays, addDays, subDays } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid Date';
  }
}

export function formatDateTime(date: string | Date, formatStr: string = 'dd/MM/yyyy HH:mm'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid Date';
  }
}

export function getDaysUntilExpiry(endDate: string | Date): number {
  try {
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    const today = new Date();
    if (!isValid(end)) return 0;
    return differenceInDays(end, today);
  } catch {
    return 0;
  }
}

export function isExpired(endDate: string | Date): boolean {
  return getDaysUntilExpiry(endDate) < 0;
}

export function isExpiringSoon(endDate: string | Date, daysThreshold: number = 7): boolean {
  const daysLeft = getDaysUntilExpiry(endDate);
  return daysLeft >= 0 && daysLeft <= daysThreshold;
}

export function addDaysToDate(date: string | Date, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
}

export function subtractDaysFromDate(date: string | Date, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subDays(dateObj, days);
}
