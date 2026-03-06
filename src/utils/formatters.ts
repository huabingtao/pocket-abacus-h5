export function formatCurrency(num: number | string, decimals = 2): string {
  const value = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(value)) return '0.00'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function formatPercent(num: number | string, decimals = 2): string {
  const value = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(value)) return '0.00%'
  return (value * 100).toFixed(decimals) + '%'
}

export function parseCurrency(str: string): number {
  return parseFloat(str.replace(/[^\d.-]/g, '')) || 0
}

export function formatMonth(months: number): string {
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  if (years === 0) return `${remainMonths}个月`
  if (remainMonths === 0) return `${years}年`
  return `${years}年${remainMonths}个月`
}

export function formatBp(bp: number): string {
  if (bp === 0) return '0BP'
  if (bp > 0) return `+${bp}BP`
  return `${bp}BP`
}
