import React from 'react';
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useNavigate } from "react-router-dom";


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

const GameCard = ({ game }) => {
    const { toggleFavorite, isFavorite } = useFavorites();

    const {
        name,
        parent_platforms,
        background_image,
        metacritic,
        released,
        genres,
    } = game;

    const fav = isFavorite(name);

    const navigate = useNavigate();

    const id = game.id
    const goToDetails = () => {
        navigate(`/game/${id}`);
    };
    return (
        <div className="game-card">

            <div className="flex justify-end">
                    <img onClick={() => toggleFavorite(game)}
                        className="h-10 w-10 cursor-pointer"
                        src={
                            fav
                                ? "/star-fill-svgrepo-com.svg"
                                : "/star-sharp-svgrepo-com.svg"
                        }
                        alt="favorite"
                    />
            </div>

            <div className="flex gap-4">
                {parent_platforms
                    ?.map(item => item?.platform?.name)
                    .filter(Boolean)
                    .map(name =>
                        platformLogos[name] ? (
                            <img
                                key={name}
                                className="h-9 w-9"
                                style={{ backgroundColor: Colors[name], marginBottom: "1rem" }}
                                src={platformLogos[name]}
                                alt={name}
                            />
                        ) : null
                    )}
            </div>


            <img onClick={goToDetails}
                className="w-full h-40.75 rounded-lg object-cover cursor-pointer hover:scale-110  transition-all duration-500"
                src={background_image || "/no-name.png"}
                alt={name}
            />


            <div className="mt-4">
                <h3>{name}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="/Metacritic_logo_original.svg" alt="Metacritic" />
                        <p>{metacritic ? metacritic.toFixed(1) : "N/A"}</p>
                    </div>

                    <span>•</span>

                    <p className="lang">
                        {parent_platforms
                            ?.map(item => item?.platform?.name)
                            .filter(Boolean)
                            .join(" | ")}
                    </p>

                    <span>•</span>

                    <p className="lang">
                        {genres
                            ? genres.map(g => g?.name).filter(Boolean).join(" | ")
                            : "N/A"}
                    </p>

                    <span>•</span>

                    <p className="year">
                        {released ? released.split("-")[0] : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
