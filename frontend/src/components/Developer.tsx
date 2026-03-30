import { Helmet } from 'react-helmet-async';

const Developer = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center mt-10">
      <Helmet>
        <title>Developer | SAU Agricultural Economics Question Bank</title>
        <meta name="description" content="Learn about the developer behind the SAU Agricultural Economics Question Bank — a full-stack web application for Sher-e-Bangla Agricultural University." />
        <meta property="og:title" content="Developer | SAU Agricultural Economics Question Bank" />
        <meta property="og:description" content="Full-stack developer profile for the SAU Agri-Econ Question Bank application." />
      </Helmet>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10">
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
            A
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300 mb-2">Argho</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Full-Stack Developer</p>
        <p className="text-gray-500 dark:text-gray-400">
          Developer of the Agricultural Economics Question Bank Application.
        </p>
        <div className="mt-6">
          <a href="/" className="text-secondary-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default Developer;