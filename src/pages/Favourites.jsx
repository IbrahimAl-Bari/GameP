
import GameCard from "../components/Gamecard.jsx";
import { useFavorites } from ".././context/FavoritesContext.jsx";
import NavBar from "../components/Navbar.jsx";

const Favourites = () => {

    const { favorites } = useFavorites();


            return (
                <main  className={"bg-[#0B0E14]"}>
                    <div className="pattern"/>
                    <div className="wrapper">
                        <NavBar />
                        <header>
                            <img className={"w-10"} src="/notextlogo.svg" alt=""/>
                        <h1 className={"text-4xl"}> <span className={"text-gradient"}>Your Favourite Games All in One Place</span></h1>
                        </header>


                        <section className="all-games">
                            { favorites.length === 0 ?
                                (<h2>No favourite games yet ⭐</h2>) : (
                                    <ul>
                                        {favorites.map(game => (
                                        <GameCard key={game.name} game={game} />
                                    ))}
                                    </ul> )
                            }
                        </section>

                    </div>
                </main>
            )
}

export default Favourites