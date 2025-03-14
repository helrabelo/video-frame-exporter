import VideoPlayer from '@/components/VideoPlayer'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main>
        <h1 className="text-3xl font-bold mb-6 text-center">Video Frame Exporter</h1>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Video Player</h2>
          <VideoPlayer />
        </div>
      </main>
    </div>
  );
}
