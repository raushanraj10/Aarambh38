export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0">
          © {new Date().getFullYear()} <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">Aarambh38</span>. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-blue-600 transition font-medium">About</a>
          <a href="#" className="hover:text-blue-600 transition font-medium">Contact</a>
          <a href="#" className="hover:text-blue-600 transition font-medium">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
