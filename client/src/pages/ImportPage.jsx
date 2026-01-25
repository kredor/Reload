import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import { useImportExcel, useImportStatus, useReplaceImportedLoads } from '../hooks/useImport';

export default function ImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const importExcel = useImportExcel();
  const replaceImportedLoads = useReplaceImportedLoads();
  const { data: importStatus } = useImportStatus();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const result = await importExcel.mutateAsync(selectedFile);

      alert(
        `Import successful!\n\n` +
        `Imported: ${result.imported} loads\n` +
        `Skipped: ${result.skipped} loads\n` +
        `Errors: ${result.errors.length}`
      );

      // Reset state
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to database page
      navigate('/database');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const handleReplace = async () => {
    if (!selectedFile) return;

    const confirmed = window.confirm(
      'Detta kommer RADERA alla tidigare importerade laddningar och ersätta dem med den nya filen.\n\n' +
      'Dina manuellt skapade laddningar (source = "user") kommer bevaras.\n\n' +
      'Denna åtgärd kan inte ångras. Fortsätt?'
    );

    if (!confirmed) return;

    try {
      const result = await replaceImportedLoads.mutateAsync(selectedFile);

      alert(
        `Ersättning lyckades!\n\n` +
        `Raderade: ${result.operation.deleted} importerade laddningar\n` +
        `Bevarade: ${result.operation.preserved} användarskapade\n` +
        `Importerade: ${result.operation.imported} nya laddningar\n` +
        `Hoppade över: ${result.operation.skipped}\n` +
        `Fel: ${result.operation.errors.length}\n\n` +
        `Totalt före: ${result.counts.before}\n` +
        `Totalt efter: ${result.counts.after}`
      );

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      navigate('/database');
    } catch (error) {
      alert(`Ersättning misslyckades: ${error.message}`);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>

      {/* Import Status */}
      {importStatus?.hasImportedLoads && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                Database contains {importStatus.importedCount} imported loads
              </p>
              <p className="text-sm text-blue-700">
                View them in the Database tab
              </p>
            </div>
            <button
              onClick={() => navigate('/database')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Database
            </button>
          </div>
        </div>
      )}

      {/* Excel Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-semibold mb-2">Excel Import</h2>
        <p className="text-gray-600 mb-6">
          Upload your reloading database Excel file (.xlsx or .xls)
        </p>

        {/* Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
          />

          {!selectedFile ? (
            <>
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your Excel file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: .xlsx, .xls (max 10MB)
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">✓</div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleImport}
                  disabled={importExcel.isPending || replaceImportedLoads.isPending}
                  className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {importExcel.isPending ? 'Importerar...' : 'Importera (Lägg till)'}
                </button>
                <button
                  onClick={handleReplace}
                  disabled={importExcel.isPending || replaceImportedLoads.isPending}
                  className="px-6 py-3 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                  title="Radera gamla importerade laddningar och ersätt med denna fil"
                >
                  {replaceImportedLoads.isPending ? 'Ersätter...' : 'Ersätt Importerad Data'}
                </button>
                <button
                  onClick={handleClear}
                  disabled={importExcel.isPending || replaceImportedLoads.isPending}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Rensa
                </button>
              </div>
            </>
          )}
        </div>

        {/* Import Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Expected Excel Format:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Column: <strong>Kaliber</strong> (Caliber)</li>
            <li>• Column: <strong>Kultyp / Tillverkare</strong> (Bullet type / Manufacturer)</li>
            <li>• Column: <strong>Kulevikt (grains)</strong> (Bullet weight in grains)</li>
            <li>• Column: <strong>Kruttsort</strong> (Powder type)</li>
            <li>• Column: <strong>Laddvikt (grains)</strong> (Charge weight)</li>
            <li>• Column: <strong>Hastighet (m/s)</strong> (Velocity)</li>
            <li>• And other optional columns...</li>
          </ul>
        </div>

        {/* Replace Operation Warning */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-medium text-orange-900 mb-2">Ersätt Importerad Data:</h3>
          <p className="text-sm text-orange-800 mb-2">
            Använd "Ersätt Importerad Data"-knappen för att radera alla tidigare importerade
            laddningar och ersätta dem med den nya Excel-filen.
          </p>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>✓ Dina manuellt skapade laddningar (source = "user") bevaras</li>
            <li>✗ Alla andra importerade laddningar raderas permanent</li>
            <li>→ Nya laddningar från Excel-filen importeras</li>
          </ul>
        </div>
      </div>

      {/* Other Import Options (Coming Soon) */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6 opacity-60">
          <h3 className="font-semibold mb-2">CSV Import</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a CSV file with your reloading data
          </p>
          <button disabled className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed">
            Coming Soon
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 opacity-60">
          <h3 className="font-semibold mb-2">JSON Import</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a JSON file with your reloading data
          </p>
          <button disabled className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>
    </Container>
  );
}
