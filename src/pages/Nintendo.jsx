import React, {useEffect, useState} from 'react'
import Navbar from "../components/Navbar.jsx";
import {useDebounce} from "../components/debouce.jsx";
import Search from "../components/search.jsx";
import {BeatLoader} from "react-spinners";
import Gamecard from "../components/Gamecard.jsx";
import {useNavigate} from "react-router-dom";

const base_url = "/api"
const api_key = import.meta.env.VITE_RAWG_API_KEY;

const Nintendo = () => {
    const [mostPopular, setMostPopular] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 1000)
    const [gameList, setGameList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [specialgames, setSpecialgames] = useState([]);

    const fetchGames = async (query = '') => {

        try {
            setLoading(true);
            setErrorMessage('');

            const endpoint = query ? `${base_url}/games?key=${api_key}&search=${encodeURIComponent(query)}` : `${base_url}/games?key=${api_key}&ordering`;

            const response = await fetch(endpoint)

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();

            setGameList(data.results);
            setSpecialgames(data.results.filter(game => game.parent_platforms?.some(p => p.platform.name.includes("Nintendo"))));

        } catch (error) {
            setErrorMessage('Error fetching games. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
    const mostpopularGames = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const endpoint2 = `${base_url}/games?key=${api_key}&ordering=-metacritic`;
            const response2 = await fetch(endpoint2)

            if (!response2.ok) {
                Error('Failed to fetch popular games');
            }

            const data2 = await response2.json();

            setMostPopular(data2.results.filter(game => game.parent_platforms?.some(p => p.platform.name.includes("Nintendo"))));

        } catch (error) {
            setErrorMessage('Error fetching popular games. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!debouncedSearchTerm) {
            mostpopularGames();
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchGames(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const navigate = useNavigate();

    return (
        <main>
            <div className="pattern_nin"/>
            <div className="wrapper">
                <Navbar/>
                <header>
                    <img className="w-40 mb-10" src="/logo.svg" alt=""/>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="trending">
                    {debouncedSearchTerm ? null : <div>
                        <h2>Best Rating Nintendo Games According To <span className="text-gradient">RAWG</span> :
                        </h2>


                        {loading ? (
                            <BeatLoader className='text-center mt-10' color="rgba(214, 81, 8, 1)"/>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : (
                            <ul>
                                {mostPopular.map((game, index) => (
                                    <li key={game.id}>
                                        <p>{index + 1}</p>
                                        <img onClick={() => {
                                            navigate(`/game/${game.id}`)
                                        }} src={game.background_image ? game.background_image : '/no-name.png'}
                                             className={"cursor-pointer hover:scale-125  transition-all duration-500"}    alt="game.name"/>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>}
                </section>

                <section className="all-games">

                    {debouncedSearchTerm ? (<h2>Search Results for "<span className="text-gradient">{searchTerm}</span>"</h2>) : (
                        <h2>Best <span className={'text-gradient'}>Nintendo</span> Games :</h2>)}

                    {loading ? (
                        <BeatLoader className='text-center mt-10' color="rgba(214, 81, 8, 1)"/>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>

                            {specialgames.map((game) =>  { return (
                                <Gamecard key={game.id} game={game} /> )
                            })}


                        </ul>
                    )}
                </section>

            </div>
        </main>

    )
}

export default Nintendo