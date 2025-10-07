import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { SocialIcon } from 'react-social-icons';
<a href="https://www.flaticon.com/free-icons/instagram-logo" title="logo icons">Logo icons created by Pixel perfect - Flaticon</a>
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img className='logo' src={assets.sk_logo} />
                    <p>Connect with us on</p>
                    <div className="footer-social-icons">
                        <SocialIcon url="https://facebook.com" style={{ height: 36, width: 36, marginRight: 15 }} />
                        <SocialIcon url="https://whatsapp.com" style={{ height: 36, width: 36, marginRight: 15 }} />
                        <SocialIcon url="https://instagram.com" style={{ height: 36, width: 36, marginRight: 15 }} />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Company</h2>
                    <li>Home</li>
                    <li>Menu</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                </div>
                <div className="footer-content-right" id='contact'>
                    <h2>Contact</h2>
                    <ul>
                        <li>7506051375</li>
                        <li>shreekitchen@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright 2025 © ShreeKitchen.com - All Rights Reserved</p>
        </div>
    )
}

export default Footer
