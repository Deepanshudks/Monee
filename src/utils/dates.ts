import { format, parseISO } from "date-fns";
export const monthKey = (date = new Date()) => format(date, "yyyy-MM");
export const monthLabel = (key: string) =>
  format(parseISO(`${key}-01`), "MMMM yyyy");
export const shortMonth = (key: string) => format(parseISO(`${key}-01`), "MMM");
export const dayLabel = (date: string) => format(parseISO(date), "MMMM d");
export const timeLabel = (date: string) => format(new Date(date), "h:mm a");
