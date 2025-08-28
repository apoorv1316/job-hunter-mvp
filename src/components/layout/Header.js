export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Hunter</h1>
          <p className="text-sm text-gray-600 hidden sm:block">
            Find your dream remote job
          </p>
        </div>
      </div>
    </header>
  );
}