import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem("favorites");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // 🔹 SAVE TO LOCAL STORAGE ON CHANGE
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (game) => {
        setFavorites(prev =>
            prev.some(item => item.name === game.name)
                ? prev.filter(item => item.name !== game.name)
                : [...prev, game]
        );
    };

    const isFavorite = (name) =>
        favorites.some(item => item.name === name);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used inside FavoritesProvider");
    }
    return context;
};
