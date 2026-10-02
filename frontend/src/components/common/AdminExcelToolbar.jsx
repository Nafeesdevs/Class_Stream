import React, { useRef, useState } from "react";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

const AdminExcelToolbar = ({ rows, sheetName, fileName, onImport, onError }) => {
  const inputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState("");

  const exportWorkbook = async () => {
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
    const bytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const importWorkbook = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      setImporting(true);
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedRows = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });
      if (!importedRows.length) throw new Error("The workbook has no data rows.");

      const summary = await onImport(importedRows);
      setImportSummary(summary || `Loaded ${importedRows.length} rows.`);
    } catch (error) {
      onError?.(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-excel-toolbar">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={importWorkbook}
        style={{ display: "none" }}
        aria-label={`Import ${sheetName} from Excel`}
      />
      <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()} disabled={importing}>
        <Upload size={15} /> {importing ? "Reading..." : "Import Excel"}
      </button>
      <button type="button" className="btn btn-outline btn-sm" onClick={exportWorkbook} disabled={!rows.length}>
        <Download size={15} /> Export Excel
      </button>
      {importSummary && (
        <span className="admin-excel-summary" role="status">
          <FileSpreadsheet size={14} /> {importSummary}
        </span>
      )}
    </div>
  );
};

export default AdminExcelToolbar;