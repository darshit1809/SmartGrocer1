// Utility to calculate totals
export const calculateTotals = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.total || 0), 0);
};
