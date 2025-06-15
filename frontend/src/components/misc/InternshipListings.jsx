import React, { useState, useEffect } from 'react';
import { Search, MapPin, WalletCards, Clock, DollarSign, Calendar, ExternalLink, Loader2, Briefcase, Filter } from 'lucide-react';

const InternshipCard = ({ internship }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 border border-gray-100 transform hover:-translate-y-1 hover:border-blue-300 h-full flex flex-col justify-between relative">
      <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-md">
        New
      </div>
      <div className="mb-4">
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-[10px] md:text-xs font-medium rounded-full mb-2">
          {internship.location}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-1 leading-tight">{internship.title}</h3>
        <p className="text-gray-700 font-semibold text-sm md:text-base">{internship.company}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex items-center text-gray-700 text-sm md:text-base">
          <Calendar size={14} md:size={16} className="mr-2 text-blue-600" />
          <span className="font-medium">{internship.duration}</span>
        </div>

        <div className="flex items-center text-gray-700 text-sm md:text-base">
          <WalletCards size={14} md:size={16} className="mr-2 text-green-500" />
          <span className="font-medium">{internship.stipend}</span>
        </div>

        {internship.posted_time !== "N/A" && (
          <div className="flex items-center text-gray-700 col-span-1 md:col-span-2 text-sm md:text-base">
            <Clock size={14} md:size={16} className="mr-2 text-blue-600" />
            <span className="font-medium">{internship.posted_time}</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <a
          href={internship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm md:text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Apply Now
          <ExternalLink size={14} md:size={16} className="ml-2" />
        </a>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p className="mt-6 text-xl text-blue-700 font-semibold">Discovering opportunities...</p>
      <p className="text-gray-500 mt-2 max-w-sm text-center">Scraping the latest internships from across the web just for you</p>
    </div>
  );
};

const EmptyState = ({ searchTerm, clearSearch }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Search size={24} className="text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-blue-900 mb-2">No results found</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-4">
        We couldn't find any internships matching "{searchTerm}". Try adjusting your search terms.
      </p>
      <button
        onClick={clearSearch}
        className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
      >
        Clear Search
      </button>
    </div>
  );
};

const InternshipListings = () => {
  const FLASK_API = import.meta.env.VITE_FLASK_API;
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${FLASK_API}/internships`);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          const validInternships = data.data.filter(
            internship => internship.company !== "N/A" && internship.title !== "N/A"
          );
          setInternships(validInternships);
        } else {
          throw new Error("Failed to fetch internships");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const filteredInternships = internships.filter(
    internship =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const locations = [...new Set(internships.map(item => item.location))];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto shadow-2xl rounded-2xl bg-white p-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 mb-3">
            Internship Explorer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Discover and apply to the latest internship opportunities from top companies across India
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                placeholder="Search by role, company or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-lg transition-colors text-sm md:text-base"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-blue-800 mb-2 text-sm md:text-base">Locations</h3>
              <div className="flex flex-wrap gap-2">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSearchTerm(location)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs md:text-sm font-medium rounded-full hover:bg-blue-200"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl text-center shadow-md">
            <p className="font-semibold text-lg mb-1">Failed to load internships</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              Try Again
            </button>
          </div>
        ) : filteredInternships.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                {filteredInternships.length} Internships Available
              </h2>
              <div className="flex items-center text-gray-600">
                <Briefcase size={20} className="mr-2" />
                <span className="font-medium text-sm md:text-base">Latest Opportunities</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredInternships.map((internship, index) => (
                <InternshipCard key={index} internship={internship} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState searchTerm={searchTerm} clearSearch={() => setSearchTerm('')} />
        )}

        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm md:text-base">
              <span className="font-medium text-blue-600">Internship Explorer</span> •
              Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipListings;
