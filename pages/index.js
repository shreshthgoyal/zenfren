import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/express');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-10 text-center">
        <div className="mb-8 animate-bounce">
          <svg className="mx-auto h-28 w-28 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">Your Cozy Corner</h1>
        <p className="text-2xl text-gray-600 mb-8 font-light">A warm place to share your thoughts and feelings.</p>
        <div 
          className="inline-block px-10 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg cursor-pointer"
          onClick={handleNavigate}
        >
          Open Up
        </div>
      </div>
      <div className="mt-16 text-center">
        <p className="text-xl text-gray-600 mb-6 font-light">Here for you, always.</p>
        <div className="flex justify-center space-x-6">
          {[
            "M12 6v6m0 0v6m0-6h6m-6 0H6",
            "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ].map((path, index) => (
            <span key={index} className="bg-white p-4 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}