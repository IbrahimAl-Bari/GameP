import React, { useState, useEffect } from 'react';

const Filters = ({ onFilterChange, apiKey }) => {
    const [genres, setGenres] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedMetacritic, setSelectedMetacritic] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const platforms = [
        { id: 1, name: 'PC', icon: '/PCMag-Logo.wine.svg' },
        { id: 2, name: 'PlayStation', icon: '/PlayStation-Icon-Logo.wine.svg' },
        { id: 3, name: 'Xbox', icon: '/Xbox_(app)-Logo.wine.svg' },
        { id: 7, name: 'Nintendo', icon: '/Nintendo_Switch-Logo.wine.svg' },
        { id: 4, name: 'iOS', icon: '/App_Store_(iOS)-Logo.wine.svg' }
    ];

    const metacriticRanges = [
        { value: '', label: 'All Scores', emoji: '🎮' },
        { value: '90,100', label: 'Must Play', emoji: '🔥', range: '90+' },
        { value: '80,89', label: 'Great', emoji: '⭐', range: '80-89' },
        { value: '70,79', label: 'Good', emoji: '👍', range: '70-79' },
        { value: '60,69', label: 'Mixed', emoji: '😐', range: '60-69' }
    ];

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`/api/genres?key=${apiKey}`);
                const data = await response.json();
                setGenres(data.results || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, [apiKey]);

    useEffect(() => {
        onFilterChange({
            platforms: selectedPlatforms,
            genres: selectedGenres,
            metacritic: selectedMetacritic
        });
    }, [selectedPlatforms, selectedGenres, selectedMetacritic]);

    const togglePlatform = (platformId) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const clearFilters = () => {
        setSelectedPlatforms([]);
        setSelectedGenres([]);
        setSelectedMetacritic('');
    };

    const hasActiveFilters = selectedPlatforms.length > 0 || selectedGenres.length > 0 || selectedMetacritic;

    return (
        <div className="my-8">

            {/* Toggle Button */}
            <div className="flex justify-center-safe mb-4">

        <div className=" flex text-2xl font-bold text-[#FBFEF9] hover:text-[#D65108] transition-all duration-300" onClick={() => setIsOpen(!isOpen)}>
        <h2 className={"hover:text-[#D65108] transition-all duration-300"}>Filters  <span className={"text-gradient"}> Games </span> .</h2>

            <svg
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>


                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="mt-3 text-sm text-[#D65108] hover:underline flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {isOpen && (
                <div className="bg-linear-to-br from-[#1a1f2e] to-[#0B0E14] p-6 md:p-8 rounded-2xl border border-[#D65108]/20 space-y-8 animate-fadeIn">

                    {/* Platforms Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[#FBFEF9] flex items-center gap-2">
                            <span className="text-2xl">🎮</span>
                            Choose Your Platform
                        </h3>
                        <div className="grid grid-cols-subgrid max-xs:grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-3">
                            {platforms.map(platform => (
                                <button
                                    key={platform.id}
                                    onClick={() => togglePlatform(platform.id)}
                                    className={`group relative rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                        selectedPlatforms.includes(platform.id)
                                            ? 'bg-[#D65108] shadow-lg shadow-[#D65108]/50'
                                            : 'bg-[#0B0E14] hover:bg-[#1a1f2e] border border-[#D65108]/20'
                                    }`}
                                >
                                    <img
                                        src={platform.icon}
                                        alt={platform.name}
                                        className="h-10 w-10 mx-auto mb-2"
                                    />
                                    <p className={`text-xs font-semibold text-center ${
                                        selectedPlatforms.includes(platform.id)
                                            ? 'text-white'
                                            : 'text-[#FBFEF9]'
                                    }`}>
                                        {platform.name}
                                    </p>
                                    {selectedPlatforms.includes(platform.id) && (
                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                                            <svg className="w-3 h-3 text-[#D65108]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Metacritic Score Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[#FBFEF9] flex items-center gap-2">
                            <span className="text-2xl">⭐</span>
                            Rating Quality
                        </h3>
                        <div className="grid grid-cols-1  max-xs:grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-3">
                            {metacriticRanges.map(range => (
                                <button
                                    key={range.value}
                                    onClick={() => setSelectedMetacritic(range.value)}
                                    className={`group xs:h-25 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                        selectedMetacritic === range.value
                                            ? 'bg-[#D65108] shadow-lg shadow-[#D65108]/50'
                                            : 'bg-[#0B0E14] hover:bg-[#1a1f2e] border border-[#D65108]/20'
                                    }`}
                                >
                                    <span className="text-2xl block mb-1">{range.emoji}</span>
                                    <p className={`text-sm font-bold ${
                                        selectedMetacritic === range.value
                                            ? 'text-white'
                                            : 'text-[#FBFEF9]'
                                    }`}>
                                        {range.label}
                                    </p>
                                    {range.range && (
                                        <p className={`text-xs mt-1 ${
                                            selectedMetacritic === range.value
                                                ? 'text-white/80'
                                                : 'text-[#FBFEF9]/60'
                                        }`}>
                                            {range.range}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Genres Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex justify-center text-[#FBFEF9] items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            Pick Your Vibe
                        </h3>
                        <div className="flex flex-wrap justify-center max-md:grid max-md:grid-cols-4 max-md:grid-rows-5 gap-2 max-h-64 overflow-hidden pr-2">
                            {genres.map(genre => (
                                <button
                                    key={genre.id}
                                    onClick={() => toggleGenre(genre.id)}
                                    className={`max-md:px-0 px-4 py-2 whitespace-nowrap rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        selectedGenres.includes(genre.id)
                                            ? 'bg-[#D65108] text-white shadow-lg shadow-[#D65108]/30'
                                            : 'bg-[#0B0E14] text-[#FBFEF9] hover:bg-[#1a1f2e] border border-[#D65108]/20'
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="pt-4 border-t border-[#D65108]/20">
                            <p className="text-sm text-[#FBFEF9]/80 mb-2">
                                Active filters:
                                <span className="text-[#D65108] font-bold ml-2">
                                    {selectedPlatforms.length + selectedGenres.length + (selectedMetacritic ? 1 : 0)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Filters;