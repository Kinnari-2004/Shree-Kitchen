import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'> 
      <div>
        <img className="bg-img" src={assets.bg_img}/>
      </div>
      <div className="header-contents">
        <h2>Authentic Gujarat's Taste at your <b>doorstep</b></h2>
        <p>Shree Kitchen by Nikita Vaghela</p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header
