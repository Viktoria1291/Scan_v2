import React from 'react';
import logo from './images/logo_footer.png';
import './footer.scss';
import '../../App.scss';

function Footer() {
    return (
        <footer className='wrapper_footer'>
            <div className='container'>
                <div className='footer'>
                    <div className='footer_logo'>
                        <img src={logo} alt="Логотип" width="141"/>
                    </div>
                    <div className='wrapper_contacts'>
                        <div className='contacts'>
                            г. Москва, Цветной б-р, 40 <br/>
                            +7 495 771 21 11 <br/>
                            info@skan.ru
                        </div>
                        <div className='copyright'>Copyright. 2022</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;