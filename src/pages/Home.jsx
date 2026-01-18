import React, { useEffect, useState } from 'react'
import Search from '../components/Search.jsx'
import {BeatLoader} from "react-spinners";
import {useDebounce} from "../components/debouce.jsx";
import Gamecard from '../components/Gamecard.jsx'
import Navbar from '../components/Navbar.jsx'
import Filters from '../components/Filters.jsx'
import {updateSearchCount , getTrendingGames} from "./../appwrite.js"
import {useNavigate} from "react-router-dom";


const base_url = "/api"
const api_key = import.meta.env.VITE_RAWG_API_KEY;

const Home = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [gameList, setGameList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading , setLoading] = useState(false);
    const [mostPopular , setMostPopular] = useState([]);
    const debouncedSearchTerm  = useDebounce(searchTerm,500)
    const [trendingGames, setTrendingGames] = useState([])
    const [filters, setFilters] = useState({
        platforms: [],
        genres: [],
        metacritic: ''
    });


    const fetchGames = async (query = '') => {

        try {
            setLoading(true);
            setErrorMessage('');

            let endpoint = query
                ? `${base_url}/games?key=${api_key}&search=${encodeURIComponent(query)}`
                : `${base_url}/games?key=${api_key}&ordering=-metacritic&metacritic=95,100`;


            if (filters.platforms.length > 0) {
                endpoint += `&parent_platforms=${filters.platforms.join(',')}`;
            }


            if (filters.genres.length > 0) {
                endpoint += `&genres=${filters.genres.join(',')}`;
            }

            if (filters.metacritic && query) {
                endpoint = endpoint.replace(/metacritic=[^&]+/, `metacritic=${filters.metacritic}`);
            } else if (filters.metacritic && !query) {
                endpoint = endpoint.replace(/metacritic=95,100/, `metacritic=${filters.metacritic}`);
            }

            const response = await fetch(endpoint)

            if(!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();

            setGameList(data.results);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        }
        catch (error) {
            setErrorMessage('Error fetching games. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    }

    const loadTrendingGames = async () => {
        try {
            const games = await getTrendingGames();

            setTrendingGames(games);
        } catch (error) {
            console.error(`Error fetching trending games: ${error}`);
        }
    }

    const mostpopularGames = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const endpoint =  `${base_url}/games?key=${api_key}&ordering=-added`
            const response = await fetch(endpoint)

            if(!response.ok) {
                throw Error('Failed to fetch popular games');
            }

            const data = await response.json();

            setMostPopular(data.results);

        } catch (error) {
            setErrorMessage('Error fetching popular games. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        fetchGames(debouncedSearchTerm);

        setMostPopular([])
        loadTrendingGames([]);

    }, [debouncedSearchTerm, filters]);

    useEffect(() => {
        loadTrendingGames();
    }, []);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            mostpopularGames();
        }
    }, [debouncedSearchTerm]);


    const navigate = useNavigate();

    const togithub = () => {
        window.location.href = "https://github.com/IbrahimAl-Bari/GameP"
    };

    return (
        <main className={"bg-[#0b0e14]"}>
            <div className="pattern"/>
            <div className="wrapper">
                <Navbar />
                <header>
                    <button onClick={togithub} className={"cursor-pointer max-md:h-10 max-md:w-10 absolute right-2 top-5 flex items-center justify-center w-15 h-15 rounded-2xl bg-[#D65108]"}>
                        <img className={"max-md:h-10 max-md:w-10 w-20 h-20"} src="/GitHub-Logo.wine.svg" alt=""/>
                    </button>
                    <img className="w-40 mb-10" src="/logo.svg" alt=""/>
                    <h1>Search Through Thousands of <span className="text-gradient">Games</span></h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <Filters onFilterChange={handleFilterChange} apiKey={api_key} />
                </header>

                {trendingGames.length > 0 && (
                    <section className="trending">
                        { debouncedSearchTerm ? null : <div>
                            <h2>Most Searched Games on <span className={"text-gradient"}>GameP</span> :</h2>


                            {loading ? (
                                <BeatLoader className='text-center mt-10' color="rgba(214, 81, 8, 1)" />
                            ) : errorMessage ? (
                                <p className="text-red-500">{errorMessage}</p>
                            ) : (
                                <ul>
                                    {trendingGames.map((game, index) => (
                                        <li key={game.$id}>
                                            <p>{index + 1}</p>
                                            <div>
                                                <img onClick={() => {
                                                    navigate(`/game/${game.game_id}`)
                                                }} className={"cursor-pointer hover:scale-125  transition-all duration-500"} src={game.background_image}
                                                     alt={game.name}/>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>}
                    </section>
                )}

                <section className="trending">
                    {debouncedSearchTerm ? (<h2 className={"mb-10"}>Search Results for "<span className="text-gradient">{searchTerm}</span>"</h2>) : (<h2 className={"mb-10"}>All The Finest <span className={"text-gradient"}>Games</span> :</h2>) }
                    {debouncedSearchTerm ? null : <div>

                        {loading ? (
                            <BeatLoader className='text-center mt-10' color="rgba(214, 81, 8, 1)" />
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : (
                            <ul>
                                {mostPopular.map((game , index) => (
                                    <li key={game.id}>
                                        <p>{index + 1}</p>
                                        <img onClick={() => {
                                            navigate(`/game/${game.id}`)
                                        }}
                                             className={"cursor-pointer hover:scale-125  transition-all duration-500"}  src={game.background_image ? game.background_image : '/no-name.png'} alt={game.name}/>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>}
                </section>



                <section className="all-games">

                    {loading ? (
                        <BeatLoader className='text-center mt-10' color="rgba(214, 81, 8, 1)" />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {gameList.map((game) => (
                                <Gamecard key={game.id} game={game} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>


    )
}
export default Home