import React from 'react';
import './header.scss';
import '../../App.scss';

import logo from './images/logo.png';
import rectangle from './images/rectangle.svg';
import spinner from './images/spinner.png';
import burger from './images/burger.svg';

import {Link, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {displayAuthorization, getResponseAccountSettings, getErrorAccountSettings, logOutAccount} from '../store/actions';



function Header() {
    // стейт нажато ли бургер меню
    const [clickedBM, setClickedBM] = React.useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // достаем из стора токен, лимит аккаунта и данные пользователя
    const token = useSelector(state => state.loginReduсer.token);
    const accountSettings = useSelector(state => state.loginReduсer.accountSettings);
    const userData = useSelector(state => state.loginReduсer.userData);

    // выбор активной формы авторизации
    const handleAuthorization = () => {
        navigate("/authorization");
        dispatch(displayAuthorization())
    }

    // функция нажатия на бургер меню - отображает/скрывает БМ
    const handleBurgerMenu = () => {
        setClickedBM(!clickedBM);
    }

    // функция скрытия БМ при нажатии вне БМ
    // проверяем если нажато не само БМ, то скрываем БМ
    const hideBurgerMenu = (e) => {
        if (e.target.className !== 'burgerMenu' && clickedBM) {
            setClickedBM(false);
        }
    }

    // обработчик на клик по window для закрытия БМ
    React.useEffect(() => {
        document.addEventListener("click", hideBurgerMenu);
        return () => {
          document.removeEventListener("click", hideBurgerMenu)
        }
    }, [])

    // функция запроса лимитов аккаунта через FETCH
    const sendRequestAccountSettings = () => {
        const url = `https://gateway.scan-interfax.ru/api/v1/account/info`;

        const options = {
            method: 'GET',
            headers: {
                "Content-type": "application/json", 
                "Accept": "application/json",
                'Authorization': `Bearer ${token.accessToken}`,
            }
        }

        fetch(url, options)
            .then(response => {
                let result = response.json();
                return result;
            })
            .then(result => {
                if (result.eventFiltersInfo) {
                    dispatch(getResponseAccountSettings(result));
                } else {
                    dispatch(getErrorAccountSettings(result));
                }
                return result;
            })
            .catch(() => {
                dispatch(getErrorAccountSettings({errorCode: '', message: 'Ошибка запроса'}));
            })
    }

    // выход из аккаунта
    const handleExit = () => {
        dispatch(logOutAccount())
    }

    // если есть токен и нет лимита аккаунта - запускаем функцию запроса лимита аккаунта
    if (token && !accountSettings) {sendRequestAccountSettings()};


    return (
        <header>
            <div className='container'>
                <div className='header'>
                    <div className='itemHeader'>
                        <img src={logo} alt="Логотип" width="141"/>
                    </div>

                    <nav className='itemHeader nav'>
                        <ul className='ul'>
                            <li className='li'>
                                <Link className='a' to="/">Главная</Link>
                            </li>
                            <li className='li'>
                                <Link className='a' to="#">Тарифы</Link>
                            </li>
                            <li className='li'>
                                <Link className='a' to="#">FAQ</Link>
                            </li>
                        </ul>
                    </nav>

                    {token ? 
                    <div className='itemHeader wrapperPersonalData '>
                        <div className='accountSettings'>
                            {accountSettings ?
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='propertyTite'>Использовано компаний</td>
                                        <td className='propertyValue'>{accountSettings.eventFiltersInfo.usedCompanyCount}</td>
                                    </tr>
                                    <tr>
                                        <td className='propertyTite'>Лимит по компаниям</td>
                                        <td className='propertyValue limit'>{accountSettings.eventFiltersInfo.companyLimit}</td>
                                    </tr>
                                </tbody>
                            </table>
                            :
                            <div className='spinner'><img src={spinner} alt="" /></div>
                            }
                        </div>

                        <div className='accountData'>
                            <div className='name'>
                                {userData.firstName.slice(0, 1).toUpperCase() + userData.firstName.slice(1).toLowerCase() + ' ' + userData.lastName.slice(0, 1).toUpperCase() + '.'}
                                <p className='exit' onClick={handleExit}>Выйти</p>
                            </div>
                            <div className='avatar'>
                                <img src={userData.avatar} alt="аватар" width='100%'/>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='buttons itemHeader reg'>
                        <button className='buttonHeader'>Зарегистрироваться</button>
                        <img className='rectangle' src={rectangle} alt="" />
                        <button className='buttonHeader' onClick={handleAuthorization}>Войти</button>
                    </div>
                    }

                    <img className='burgerMenu' src={burger} onClick={handleBurgerMenu}/>
                    
                    {clickedBM && 
                    <div className='dropDown'>
                        <nav className='navBM'>
                            <ul className='ulBM'>
                                <li className='liBM'>
                                    <Link className='aBM' to="/">Главная</Link>
                                </li>
                                <li className='liBM'>
                                    <Link className='aBM' to="#">Тарифы</Link>
                                </li>
                                <li className='liBM'>
                                    <Link className='aBM' to="#">FAQ</Link>
                                </li>  
                                </ul>
                            </nav>

                        {token ?
                        <div className='accountDataBM'>
                            <br></br>
                            {userData.firstName.slice(0, 1).toUpperCase() + userData.firstName.slice(1).toLowerCase() + ' ' + userData.lastName.slice(0, 1).toUpperCase() + '.'}
                            <p className='exit' onClick={handleExit}>Выйти</p>
                        </div>
                        :
                        <nav className='navBM'>
                            <ul className='ulBM'>
                                <li className='liBM'>
                                    <Link className='aBM' to="#">Зарегистрироваться</Link>
                                </li>
                                <li className='liBM'>
                                    <Link className='aBM' to="/authorization">Войти</Link>
                                </li>
                            </ul>        
                        </nav>
                        }
                    </div>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header;