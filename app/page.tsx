import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Divine Economy</h1>
        <p className="text-gray-400 mb-8">
          Personal site and tools by David Phelps
        </p>
        <div className="space-y-4">
          <Link
            href="/typography-tool"
            className="block p-6 bg-gray-900 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Pixel Blob Typography Tool</h2>
            <p className="text-gray-400">
              Create custom fonts with organic grid-based typography. Export as TTF/OTF for use in Figma.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
