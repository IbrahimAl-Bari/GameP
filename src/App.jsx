import Home from "./pages/Home";
import Playstation from "./pages/Playstation.jsx";
import Xbox from "./pages/Xbox.jsx";
import Nintendo from "./pages/Nintendo.jsx";
import PC from "./pages/PC.jsx";
import Appstore from "./pages/Appstore.jsx";
import Favourites from "./pages/Favourites.jsx";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import GameDetails from "./pages/GameDetails.jsx";

 const App = () => {

     return (
         <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/game/:id" element={<GameDetails />} />
             <Route path="/Playstation" element={<Playstation />} />
             <Route path="/Xbox" element={<Xbox />} />
             <Route path="/Nintendo" element={<Nintendo />} />
             <Route path="/PC" element={<PC />} />
             <Route path="/Appstore" element={<Appstore />} />
             <Route path="/Favourites" element={<Favourites />} />
             <Route path="*" element={<NotFound />} />
         </Routes>
     )
}
export default App
