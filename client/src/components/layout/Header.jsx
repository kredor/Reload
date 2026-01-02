export default function Header() {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎯</div>
            <div>
              <h1 className="text-2xl font-bold">Reload</h1>
              <p className="text-sm text-primary-100">Reloading Data Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
