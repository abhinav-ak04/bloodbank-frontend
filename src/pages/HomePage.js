import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bloodDonationImage from '../assets/image.png';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === 'learn-more') {
      document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
      // Clear the state after scrolling
      window.history.replaceState({}, document.title, '/');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white overflow-hidden relative py-24">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-red-500 opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-red-400 opacity-10"></div>
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-white opacity-5"></div>
        </div>

        <div className="container mx-auto px-6 relative z-1">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg mb-10 md:mb-0">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                DONATE BLOOD, <br />
                <span className="text-red-200">SAVE LIVES</span>
              </h1>
              <div className="h-2 w-24 bg-white opacity-50 rounded-full mb-8"></div>
              <p className="text-xl md:text-2xl font-light mb-10">
                Your donation can save up to three lives. Join our community and make a difference today.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  to="/register"
                  className="bg-white text-red-700 hover:bg-red-100 py-4 px-8 rounded-lg font-bold text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Become a Donor
                </Link>
                <a
                  href="#learn-more"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-red-700 py-4 px-8 rounded-lg font-bold text-lg transition duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={bloodDonationImage}
                alt="Blood donation illustration"
                className="w-full max-w-md h-auto object-cover rounded-lg shadow-2xl transform hover:scale-102 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="learn-more" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Would You Like To Help?</h2>
            <div className="flex justify-center items-center mb-6">
              <div className="w-12 h-1 bg-red-500 rounded-full mr-2"></div>
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="w-12 h-1 bg-red-500 rounded-full ml-2"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your role in the lifesaving process. Whether you're giving, receiving, or managing donations, your participation makes a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link to="/register" className="group">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-b-4 border-red-500 transition-all duration-300 h-full transform group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 px-6 text-center">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">DONOR</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-6">
                    Register as a blood donor and help save lives with your contribution. It only takes a few minutes to donate, but the impact lasts a lifetime.
                  </p>
                  <div className="bg-red-600 text-white py-3 px-6 rounded-lg inline-block font-semibold group-hover:bg-red-700 transition">
                    Register Now
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/recipient-register" className="group">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-b-4 border-red-500 transition-all duration-300 h-full transform group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 px-6 text-center">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">RECIPIENT</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-6">
                    Register as a blood recipient to find donors and get the help you need. Our community is here to support you in your time of need.
                  </p>
                  <div className="bg-red-600 text-white py-3 px-6 rounded-lg inline-block font-semibold group-hover:bg-red-700 transition">
                    Register Now
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/bloodbank-register" className="group">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-b-4 border-red-500 transition-all duration-300 h-full transform group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-8 px-6 text-center">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">BLOOD BANK</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-6">
                    Register your blood bank and connect with donors and recipients. Be the crucial link that brings lifesaving resources to those in need.
                  </p>
                  <div className="bg-red-600 text-white py-3 px-6 rounded-lg inline-block font-semibold group-hover:bg-red-700 transition">
                    Register Now
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Donate Blood?</h2>
            <div className="w-24 h-1 bg-red-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Blood donation is a simple act with profound benefits for both donors and recipients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-red-100 p-5 w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Save Lives</h3>
              <p className="text-gray-600 text-center">
                One donation can save up to three lives. Your blood can be separated into red cells, plasma, and platelets to help multiple patients with different needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-red-100 p-5 w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Health Benefits</h3>
              <p className="text-gray-600 text-center">
                Regular donors receive free health screenings and reduced risk of heart disease. Donating blood helps maintain healthy iron levels and reveals potential health issues.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-red-100 p-5 w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Quick & Convenient</h3>
              <p className="text-gray-600 text-center">
                The entire process takes less than an hour, with the actual donation taking only 8-10 minutes. Schedule at your convenience and make a lifelong impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-102 transition-all duration-500">
            <div className="p-12 text-white">
              <h2 className="text-3xl font-bold text-center mb-12">The Impact of Your Donation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 transform hover:rotate-3 transition-transform duration-300">
                    <span className="text-4xl font-bold">38%</span>
                  </div>
                  <p className="text-sm md:text-base">of people are eligible to donate blood</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 transform hover:rotate-3 transition-transform duration-300">
                    <span className="text-4xl font-bold">3</span>
                  </div>
                  <p className="text-sm md:text-base">lives saved with each donation</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 transform hover:rotate-3 transition-transform duration-300">
                    <span className="text-4xl font-bold">1:7</span>
                  </div>
                  <p className="text-sm md:text-base">hospital patients need blood</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 transform hover:rotate-3 transition-transform duration-300">
                    <span className="text-xl font-bold">10.8M</span>
                  </div>
                  <p className="text-sm md:text-base">donations needed annually</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto border-l-8 border-red-600 transform hover:scale-102 transition-all duration-500">
            <div className="p-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Give the Gift of Life</h2>
                <h3 className="text-2xl font-bold text-red-600 mb-6">Donate Blood Today!</h3>
                <div className="w-16 h-1 bg-red-500 rounded-full mx-auto mb-6"></div>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                  Your donation can make all the difference between life and death. Take action today and become a hero to someone in need.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 py-4 px-8 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-lg"
                >
                  Donate Now
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;