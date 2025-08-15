import React from 'react';
import './authorization.scss';
import authorizationImage from './images/authorizationImage.svg';
import LoginForm from './auth-form/LoginForm';


function Authorization () {

    return (
        <div className='container'>
            <div className='wrapper'>
                <div className='contentLeft'>
                    <h3 className='h h3'>Для оформления подписки на тариф, необходимо авторизоваться.</h3>
                    <img src={authorizationImage} alt="Изображение" className='authorizationImage701'/>
                </div>
                <LoginForm/>
                <img src={authorizationImage} alt="Изображение"
                className='authorizationImage700'/>
            </div>
        </div>
    )
}

export default Authorization;



