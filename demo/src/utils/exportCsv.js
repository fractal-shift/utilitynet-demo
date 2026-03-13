/**
 * Export rows to CSV and trigger download.
 * @param {Array<Record<string, unknown>>} rows - Array of row objects
 * @param {Array<{ key: string; label: string }>} columns - Column definitions
 * @param {string} filename - Download filename (without extension)
 */
export function exportTableToCsv(rows, columns, filename = 'export') {
  const headers = columns.map((c) => c.label).join(',');
  const escape = (v) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = rows.map((row) =>
    columns.map((c) => escape(row[c.key])).join(',')
  );
  const csv = [headers, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
