import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { BeatLoader } from "react-spinners";
import Gamecard from "../components/Gamecard.jsx";
import {useDebounce} from "../components/debouce.jsx";
import Search from "../components/Search.jsx"

const base_url = "/api";
const api_key = import.meta.env.VITE_RAWG_API_KEY;

const Colors = {
    PlayStation: "#F1F5F9",
    Xbox: "#82bd9f",
    Nintendo: "#fd0000",
    PC: "#fd0000",
    iOS: "#479fdf",
};

const platformLogos = {
    PlayStation: "/PlayStation-Icon-Logo.wine.svg",
    Xbox: "/Xbox_(app)-Logo.wine.svg",
    Nintendo: "/Nintendo_Switch-Logo.wine.svg",
    PC: "/PCMag-Logo.wine.svg",
    iOS: "/App_Store_(iOS)-Logo.wine.svg",
};

const getMetaColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-400";
    return "text-red-500";
};

const GameDetails = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { id } = useParams();
    const navigate = useNavigate();


    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm  = useDebounce(searchTerm,500)
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [relatedGames, setRelatedGames] = useState([]);
    const [dlc, setDlc] = useState([]);
    const [stores, setStores] = useState([]);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchSearchGames = async (query = '') => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const endpoint = `${base_url}/games?key=${api_key}&search=${encodeURIComponent(query)}`;
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();
            setSearchResults(data.results);
            console.log(data.results);
        } catch (error) {
            console.error('Error fetching games:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchSearchGames(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const resGame = await fetch(`${base_url}/games/${id}?key=${api_key}`);
                if (!resGame.ok) throw new Error("Failed to fetch game details");
                const data = await resGame.json();
                setGame(data);

                const resStores = await fetch(`${base_url}/games/${id}/stores?key=${api_key}`);
                if (!resStores.ok) throw new Error("Failed to fetch stores");
                const dataStores = await resStores.json();
                setStores(dataStores.results || []);

                const resDlc = await fetch(`${base_url}/games/${id}/additions?key=${api_key}`);
                if (!resDlc.ok) throw new Error("Failed to fetch DLC");
                const dataDlc = await resDlc.json();
                setDlc(dataDlc.results || []);
            } catch (err) {
                setError("Could not load game details.");
            } finally {
                setLoading(false);
            }
        };
        fetchGameDetails();
    }, [id]);

    useEffect(() => {
        if (!game?.genres?.length) return;

        let isMounted = true;
        const fetchRelatedGames = async () => {
            try {
                const genreIds = game.genres.map((g) => g.id).join(",");
                const tagIds = game.tags?.slice(0, 5).map((t) => t.id).join(",");
                const res = await fetch(
                    `${base_url}/games?genres=${genreIds}&tags=${tagIds}&page_size=50&ordering=-rating&key=${api_key}`
                );
                if (!res.ok) throw new Error("Failed to fetch related games");
                const data = await res.json();

                const scored = data.results
                    .filter((g) => g.id !== game.id && g.metacritic)
                    .map((g) => {
                        let score = g.metacritic * 2;
                        const sharedGenres = g.genres?.filter((gg) => game.genres.some((gen) => gen.id === gg.id)).length || 0;
                        score += sharedGenres * 30;
                        const sharedTags = g.tags?.filter((t) => game.tags?.some((gt) => gt.id === t.id)).length || 0;
                        score += sharedTags * 20;
                        if (g.released && game.released) {
                            const yearDiff = Math.abs(new Date(g.released).getFullYear() - new Date(game.released).getFullYear());
                            if (yearDiff <= 2) score += 15;
                        }
                        score += Math.random() * 20;
                        return { ...g, _relevanceScore: score };
                    })
                    .sort((a, b) => b._relevanceScore - a._relevanceScore);

                const finalGames = [];
                const usedGenreIds = new Set();
                for (const g of scored) {
                    const primaryGenreId = g.genres?.[0]?.id;
                    if (usedGenreIds.has(primaryGenreId)) continue;
                    finalGames.push(g);
                    usedGenreIds.add(primaryGenreId);
                    if (finalGames.length === 8) break;
                }

                let idx = 0;
                while (finalGames.length < 8 && idx < scored.length) {
                    const candidate = scored[idx];
                    if (!finalGames.find((fg) => fg.id === candidate.id)) finalGames.push(candidate);
                    idx++;
                }

                if (isMounted) setRelatedGames(finalGames.slice(0, 8));
            } catch (err) {
                console.error(err);
            }
        };
        fetchRelatedGames();
        return () => (isMounted = false);
    }, [game?.id]);

    if (loading) return <BeatLoader className="text-center mt-10" color="rgba(214, 81, 8, 1)" />;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (!game) return null;

    const fav = isFavorite(game.name);

    return (
        <main className="bg-[#0B0E14] min-h-screen text-white md:px-10">
            <div className={"pattern"}/>
            <div className={"wrapper"}>
                <Navbar />

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {debouncedSearchTerm ? (
                    <section className="mt-5 all-games">
                        <button
                            onClick={() => navigate(-1)}
                            className="button mb-6 text-sm ml-15 text-[#D65108] opacity-100 hover:scale-110 transition-all duration-200">
                            <img className={"cursor-pointer"} src="/back-svgrepo-com.svg" alt="Back" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">
                            Search Results for "<span className="text-gradient">{searchTerm}</span>"
                        </h2>

                        {searchLoading ? (
                            <BeatLoader className="text-center mt-10" color="rgba(214, 81, 8, 1)" />
                        ) : searchResults.length === 0 ? (
                            <p className="text-center text-[#FBFEF9] mt-4">No games found.</p>
                        ) : (
                            <ul>
                                {searchResults.map((game) => (
                                    <Gamecard key={game.id} game={game} />
                                ))}
                            </ul>
                        )}
                    </section>
                ) : (

                    <>
                        <button
                            onClick={() => navigate(-1)}
                            className="button mb-6 text-sm ml-15 text-[#D65108] opacity-100 hover:scale-110 transition-all duration-200">
                            <img className={"cursor-pointer"} src="/back-svgrepo-com.svg" alt="Back" />
                        </button>

                        {loading ? (
                            <BeatLoader className="text-center mt-10" color="rgba(214, 81, 8, 1)" />
                        ) : error ? (
                            <p className="text-center text-red-500 mt-10">{error}</p>
                        ) : !game ? null : (
                            <>
                                <section className="flex flex-col lg:flex-row gap-8 mt-6">
                                    <div className="lg:w-1/2 space-y-4">
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {game.parent_platforms
                                                ?.map((p) => p?.platform?.name)
                                                .filter(Boolean)
                                                .map((name) =>
                                                    platformLogos[name] ? (
                                                        <img
                                                            key={name}
                                                            src={platformLogos[name]}
                                                            alt={name}
                                                            className="h-12 w-12 rounded-xl"
                                                            style={{ backgroundColor: Colors[name] }}
                                                        />
                                                    ) : null
                                                )}
                                        </div>

                                        <h2 className="text-3xl font-bold text-center text-gradient">{game.name}</h2>

                                        <p className="text-center font-semibold text-lg text-[#FBFEF9]">
                                            {game.genres?.map((g) => g.name).join(" | ") || "N/A"}
                                        </p>

                                        <div className="space-y-2 mt-2">
                                            <p className="text-xl font-bold">
                                                MetaCritic: <span className={getMetaColor(game.metacritic)}>{game.metacritic ?? "N/A"}</span>
                                            </p>
                                            <p className="text-xl font-bold">
                                                Released In: <span className="text-[#D65108]">{game.released || "N/A"}</span>
                                            </p>
                                        </div>

                                        <p className="text-[#FBFEF9] font-light mt-4">
                                            {game.description ? game.description.split("</p>")[0].replace(/<[^>]+>/g, "") : "N/A"}
                                        </p>

                                        <div className="space-y-4 mt-4">
                                            <div>
                                                <p className="text-xl font-bold">
                                                    DLC's:{" "}
                                                    {dlc.length > 0 ? (
                                                        dlc.map((d) => (
                                                            <span key={d.id} className="block text-[#D65108] font-light mt-1">{d.name}</span>
                                                        ))) : (
                                                        <span className="text-[#D65108]">No DLC's Found.</span>
                                                    )}
                                                </p>
                                            </div>

                                            <p className="text-xl font-bold">
                                                Developers:{" "}
                                                <span className="text-[#D65108]">{game.developers.map((d) => d.name).join(" | ") || "N/A"}</span>
                                            </p>

                                            <p className="text-xl font-bold">
                                                Game's Website:{" "}
                                                {stores[0] ? (
                                                    <a href={stores[0].url} className="text-[#D65108] hover:underline">
                                                        {game.website || "N/A"}
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </p>

                                            <p className="text-xl font-bold">
                                                Achievements Count: <span className="text-[#D65108]">{game.achievements_count || "N/A"}</span>
                                            </p>

                                            <p className="text-xl font-bold">
                                                Reddit Count: <span className="text-[#D65108]">{game.reddit_count || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="lg:w-1/2 space-y-4">
                                        <div className="flex justify-end">
                                            <img
                                                onClick={() => toggleFavorite(game)}
                                                src={fav ? "/star-fill-svgrepo-com.svg" : "/star-sharp-svgrepo-com.svg"}
                                                alt="favorite"
                                                className="h-12 w-12 cursor-pointer"
                                            />
                                        </div>

                                        <img
                                            src={game.background_image || "/no-name.png"}
                                            alt={game.name}
                                            className="w-full rounded-lg object-cover hover:scale-110 transition-all duration-500 cursor-cell"
                                        />
                                        <h2>Stores :</h2>
                                        <div className="space-y-2 mt-2 text-[#D65108]">
                                            {stores.length > 0 ? (
                                                stores.map((store) => (
                                                    <div key={store.id}>
                                                        <a href={store.url} className="hover:underline">
                                                            Buy on: <br /> {store.url}
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[#FBFEF9]">No stores available</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section className="mt-16 w-full">
                                    <h2 className="text-2xl font-bold">
                                        Related <span className="text-gradient">Games</span>:
                                    </h2>
                                    {relatedGames.length === 0 ? (
                                        <p className="text-center text-[#FBFEF9] mt-4">No related games found.</p>
                                    ) : (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            {relatedGames.map((game) => (
                                                <Gamecard key={game.id} game={game} />
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default GameDetails;
