import type { ExpenseCategory } from "@/types/finance";
export const categoryMeta: Record<
  ExpenseCategory,
  { icon: string; color: string }
> = {
  Food: { icon: "utensils", color: "#E28C62" },
  Travel: { icon: "car", color: "#7D9CC7" },
  Shopping: { icon: "shopping-bag", color: "#9A83C7" },
  Bills: { icon: "receipt", color: "#8E8B83" },
  Utilities: { icon: "zap", color: "#D3A34A" },
  Entertainment: { icon: "film", color: "#C7799A" },
  Health: { icon: "heart-pulse", color: "#6DA995" },
  Education: { icon: "book-open", color: "#7182B5" },
  Other: { icon: "circle", color: "#92909A" },
};
