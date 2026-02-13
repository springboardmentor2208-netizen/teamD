import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <header className="h-[100vh] bg-gradient-to-r 
        from-blue-900 via-[#8a8181] to-blue-900
        bg-300% animate-gradient-move text-white flex-grow flex flex-col justify-center items-center text-center px-4 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Make Your City <span className="text-blue-200">Cleaner</span> & <span className="text-blue-200">Smarter</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
                        Report civic issues, track progress, and help build a better community together.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/report" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                            + Report an Issue
                        </Link>
                        <Link to="/complaints" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition duration-300">
                            View Reports
                        </Link>
                    </div>
                </div>
            </header>

            {/* How it Works Section */}
            <section
                className="
        py-20 px-4 sm:px-6 lg:px-8
        bg-white/5
        backdrop-blur-2xl
        border-t border-white/10
    "
            >
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                            How CleanStreet Works
                        </h2>
                        <p className="mt-4 text-xl text-blue-500/80">
                            Simple steps to make a difference in your community
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

                        {/* Step 1 */}
                        <div
                            className="
            flex flex-col items-center
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            rounded-2xl
            p-8
            shadow-xl shadow-black/10
            transition duration-300
            hover:bg-white/20
            hover:-translate-y-2
            cursor-pointer
            "
                        >
                            <div
                                className="
                flex items-center justify-center
                h-16 w-16 rounded-full
                bg-blue-500/20
                backdrop-blur-md
                text-blue-600
                mb-6
            "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-blue-600 mb-2">
                                Report Issues
                            </h3>

                            <p className="text-blue-600/80">
                                Easily report civic problems with photos and location details
                            </p>
                        </div>


                        {/* Step 2 */}
                        <div
                            className="
            flex flex-col items-center
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            rounded-2xl
            p-8
            shadow-xl shadow-black/10
            transition duration-300
            hover:bg-white/20
            hover:-translate-y-2
            cursor-pointer
            "
                        >
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-600 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-blue-600 mb-2">
                                Track Progress
                            </h3>

                            <p className="text-blue-600/80">
                                Monitor the status of reported issues and see updates in real-time
                            </p>
                        </div>


                        {/* Step 3 */}
                        <div
                            className="
            flex flex-col items-center
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            rounded-2xl
            p-8
            shadow-xl shadow-black/10
            transition duration-300
            hover:bg-white/20
            hover:-translate-y-2
            cursor-pointer
            "
                        >
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-600 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-blue-600 mb-2">
                                Community Impact
                            </h3>

                            <p className="text-blue-600/80">
                                Vote and comment on issues to help prioritize community needs
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
