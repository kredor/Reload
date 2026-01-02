import Container from '../components/layout/Container';

export default function ImportPage() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Import reloading data from various sources.
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">CSV Import</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a CSV file with your reloading data
            </p>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">JSON Import</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a JSON file with your reloading data
            </p>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Norma Database</h3>
            <p className="text-sm text-gray-600 mb-3">
              Import data from Norma's public reloading database
            </p>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
