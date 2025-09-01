import React from 'react';
import './header.scss';
import '../../App.scss';

import logo from './images/logo.png';
import rectangle from './images/rectangle.svg';
import spinner from './images/spinner.png';
import burger from './images/burger.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { displayAuthorization, getResponseAccountSettings, getErrorAccountSettings, logOutAccount } from '../store/search.actions';

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
    const hideBurgerMenu = React.useCallback((e) => {
        if (e.target.className !== 'burgerMenu' && clickedBM) {
            setClickedBM(false);
        }
    }, [clickedBM]);

    // обработчик на клик по window для закрытия БМ
    React.useEffect(() => {
        document.addEventListener("click", hideBurgerMenu);
        return () => {
            document.removeEventListener("click", hideBurgerMenu)
        }
    }, [hideBurgerMenu])

    // Функция запроса лимитов аккаунта через FETCH
    const sendRequestAccountSettings = React.useCallback(() => {
        // Запрашиваем данные только если их нет в localStorage
        const cachedAccountSettings = localStorage.getItem('cachedAccountSettings');
        if (cachedAccountSettings) {
            dispatch(getResponseAccountSettings(JSON.parse(cachedAccountSettings)));
            return;
        }

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
            .then(response => response.json())
            .then(result => {
                if (result.eventFiltersInfo) {
                    // Сохраняем данные в localStorage
                    localStorage.setItem('cachedAccountSettings', JSON.stringify(result));
                    dispatch(getResponseAccountSettings(result));
                } else {
                    dispatch(getErrorAccountSettings(result));
                }
            })
            .catch(() => {
                dispatch(getErrorAccountSettings({ errorCode: '', message: 'Ошибка запроса' }));
            })
    }, [token, dispatch]);

    // Выход из аккаунта
    const handleExit = () => {
        dispatch(logOutAccount());
        localStorage.removeItem('searchHistory');
        localStorage.removeItem('cachedAccountSettings'); // Очищаем кеш лимитов
    }

    // Запрашиваем данные аккаунта только при наличии токена и отсутствии данных
    React.useEffect(() => {
        if (token && !accountSettings) {
            sendRequestAccountSettings();
        }
    }, [token, accountSettings, sendRequestAccountSettings]);

    // Функция для перехода на главную с прокруткой вверх
    const handleMainPageClick = (e) => {
        e.preventDefault();
        setClickedBM(false);
        navigate('/');
        // Прокрутка вверх после небольшой задержки, чтобы страница успела загрузиться
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 50);
    }

    // Функция для обработки якорных ссылок
    const handleAnchorClick = (e, anchorId) => {
        e.preventDefault();
        setClickedBM(false);

        // Если мы не на главной странице, сначала переходим на главную
        if (window.location.pathname !== '/') {
            navigate('/');
            // Ждем немного чтобы главная страница успела загрузиться
            setTimeout(() => {
                const element = document.getElementById(anchorId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Если уже на главной, просто скроллим к элементу
            const element = document.getElementById(anchorId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Функция для обычных ссылок (регистрация, авторизация)
    const handleRegularLinkClick = (e, path) => {
        e.preventDefault();
        setClickedBM(false);
        navigate(path);
    }


    return (
        <header>
            <div className='container'>
                <div className='header'>
                    <div className='itemHeader'>
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            <img src={logo} alt="Логотип" width="141" />
                        </Link>
                    </div>

                    <nav className='itemHeader nav'>
                        <ul className='ul'>
                            <li className='li'>
                                <Link className='a' to="/" onClick={() => window.scrollTo(0, 0)}>Главная</Link>
                            </li>
                            <li className='li'>
                                <button className='a anchor-button' onClick={(e) => handleAnchorClick(e, 'tariffs')}>
                                    Тарифы
                                </button>
                            </li>
                            <li className='li'>
                                <button className='a anchor-button' onClick={(e) => handleAnchorClick(e, 'faq')}>
                                    FAQ
                                </button>
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
                                    <div className='spinner'><img src={spinner} alt="Загрузка" />
                                    </div>
                                }
                            </div>

                            <div className='accountData'>
                                <div className='name'>
                                    {userData.firstName.slice(0, 1).toUpperCase() + userData.firstName.slice(1).toLowerCase() + ' ' + userData.lastName.slice(0, 1).toUpperCase() + '.'}
                                    <p className='exit' onClick={handleExit}>Выйти</p>
                                </div>
                                <div className='avatar'>
                                    <img src={userData.avatar} alt="Аватар пользователя" width='100%' />
                                </div>
                            </div>
                        </div>
                        :
                        <div className='buttons itemHeader reg'>
                            <Link to="/registration" className='buttonHeader' onClick={() => window.scrollTo(0, 0)}>Зарегистрироваться</Link>
                            <img className='rectangle' src={rectangle} alt="" />
                            <button className='buttonHeader' onClick={handleAuthorization}>Войти</button>
                        </div>
                    }

                    <img className='burgerMenu' src={burger} alt="Меню" onClick={handleBurgerMenu} />

                    {clickedBM &&
                        <div className='dropDown'>
                            <nav className='navBM'>
                                <ul className='ulBM'>
                                    <li className='liBM'>
                                        <button className='aBM' onClick={handleMainPageClick}>
                                            Главная
                                        </button>
                                    </li>
                                    <li className='liBM'>
                                        <button className='aBM' onClick={(e) => handleAnchorClick(e, 'tariffs')}>
                                            Тарифы
                                        </button>
                                    </li>
                                    <li className='liBM'>
                                        <button className='aBM' onClick={(e) => handleAnchorClick(e, 'faq')}>
                                            FAQ
                                        </button>
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
                                            <button className='aBM' onClick={(e) => handleRegularLinkClick(e, '/registration')}>
                                                Зарегистрироваться
                                            </button>
                                        </li>
                                        <li className='liBM'>
                                            <button className='aBM' onClick={(e) => handleRegularLinkClick(e, '/authorization')}>
                                                Войти
                                            </button>
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