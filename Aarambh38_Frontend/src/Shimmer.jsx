export default function Shimmer() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Animated App Name */}
      <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600  bg-[length:300%_100%] bg-clip-text text-transparent animate-shimmer tracking-wide mb-6">
        Aarambh38
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-600 font-medium animate-pulse">
        Stay motivated and please wait...
      </p>
    </div>
  );
}
