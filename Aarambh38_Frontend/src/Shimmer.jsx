export default function Shimmer() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse space-y-4 max-w-md w-full px-6">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
}
