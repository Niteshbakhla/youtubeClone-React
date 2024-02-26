import React, { useState } from 'react'
import "../Navbar/Navbar.css"
import menu_icon from "../../assets/menu.png"
import search_icon from "../../assets/search.png"
import upload_icon from "../../assets/upload.png"
import more_icon from "../../assets/more.png"
import notification_icon from "../../assets/notification.png"
import profile_icon from "../../assets/jack.png"
import { Link } from 'react-router-dom'


const Navbar = ({ setSidebar, setSearchQuery }) => {

    const [searchInput, setSearchInput] = useState('');
    console.log(searchInput)
    const handleSearch = () => {
        setSearchQuery(searchInput)
        setSearchInput(" ")
    }

    const handleInputChange = (e) => {
        setSearchInput(e.target.value)

    }

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const  logo = "https://seeklogo.com/images/V/vtube-logo-70EAB944E4-seeklogo.com.png"


    return (
        <nav className='flex-div'>
            <div className='nav-left flex-div'>
                <img className='menu-icon' onClick={() => setSidebar(prev => !prev ? true : false)} src={menu_icon} alt="" />
                <Link to="/"> <img className='logo' src={logo} alt="" /></Link>
            </div>

            <div className='nav-middle flex-div'>
                <div className='search-box flex-div'>
                    <input type="text" placeholder='Search' value={searchInput} onChange={handleInputChange} onKeyDown={onKeyPress} />
                    <img src={search_icon} alt="" />
                </div>
            </div>

            <div className='nav-right flex-div'>
                <img src={upload_icon} alt="" />
                <img src={more_icon} alt="" />
                <img src={notification_icon} alt="" />
                <img src={profile_icon} className='user-icon' alt="" />
            </div>
        </nav>
    )
}

export default Navbar