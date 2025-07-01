export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-2 md:mb-0">
          © {new Date().getFullYear()} Aarambh38. All rights reserved.
        </p>
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
          <a href="#" className="hover:text-blue-600 transition">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
