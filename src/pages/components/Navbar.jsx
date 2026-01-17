import React from 'react'
import "../../components.css"
import {useState} from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
const [show, setShow] = useState(false);
const [light, setLight] = useState(false);

    return (
        <>
    <button onClick={() => setShow(!show)}> <img className={"cursor-pointer button"} src='/menu-burger-horizontal-svgrepo-com%20(1).svg' alt="menu"/> </button>

    {show && <div id="bar">

        <Link to='/'><a><img src="/home-svgrepo-com.svg" alt="home"/></a></Link>
        <Link to={"/Playstation"}><a><img id="a" src="/PlayStation-Icon-Logo.wine.svg" alt=""/></a></Link>
        <Link to={"/Xbox"}> <a><img id="b" src="/Xbox_(app)-Logo.wine.svg" alt=""/></a></Link>
        <Link to={"/Nintendo"}><a><img id="c" src="/Nintendo_Switch-Logo.wine.svg" alt=""/></a></Link>
        <Link to={"/PC"}><a><img id="d" src="/PCMag-Logo.wine.svg" alt=""/></a></Link>
       <Link to={"/Appstore"}><a><img id="e" src="/App_Store_(iOS)-Logo.wine.svg" alt=""/></a></Link>
        <Link to={"/Favourites"}><a><img src="/star-fill-svgrepo-com.svg" alt="star"/></a></Link>

        <>
            <a onClick={() => setLight(!light)}> {light ? <img src="/moon-svgrepo-com%20(1).svg" alt="black moon"/> : <img src="/moon-svgrepo-com.svg" alt="white moon"/>}</a>
        </>

    </div>}

        </>
)
}


export default Navbar