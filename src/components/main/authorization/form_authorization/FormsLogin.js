import React from 'react';
import './FormsLogin.scss';
import Input from './Input/Input';
import Button from './Button/Button';
import google from './images/Google.svg';
import facebook from './images/Facebook.svg';
import yandex from './images/Yandex.svg';
import padlock from './images/padlock.svg';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {displayAuthorization, sendingRequestAut, getResponseAut, logOutAccount, getResponseAccountSettings, getErrorAccountSettings} from '../../../store/actions';


function FormsLogin () {

    const [formReg, setFormReg] = React.useState({
        telValue: '',
        mailValue: '',
        loginValue: '',
        passwordValue: '',
        confirmPasswordValue: '',
    });
    
    const [formAut, setFormAut] = React.useState({
        loginValue: '',
        passwordValue: '',
        exampleValue: '',
    });
    

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const passwordVisible = useSelector(state => state.loginReduсer.passwordVisible);
    const errorRespAut = useSelector(state => state.loginReduсer.errorRespAut)

    const isFormAutFull = formAut.loginValue && formAut.passwordValue ? true : false;
    const isFormRegFull = formReg.telValue && formReg.mailValue && formReg.loginValue && formReg.passwordValue && formReg.confirmPasswordValue ? true : false;


    const clickAuthorization = () => {
        dispatch(displayAuthorization())
    }
   
    const validate = (id, value) => {
        const regExpLogin = /^[a-zA-Z0-9_]{3,20}$/i;
        const regExpTel = /\+7\d{10}/;
        const regExpMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const regExpPass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (id === 'loginAut') {
            if (regExpLogin.test(value) || regExpTel.test(value) || regExpMail.test(value)) {
                setFormAut({...formAut, loginValue: value})
            } else {setFormAut({...formAut, loginValue: ''})}
            return regExpLogin.test(value) || regExpTel.test(value) || regExpMail.test(value);
        }
        else if (id === 'passwordAut') {
            setFormAut({...formAut, passwordValue: value})
            return regExpPass.test(value);
        }

        else if (id === 'telReg') {
            if (regExpTel.test(value)) {setFormReg({...formReg, telValue: value})}
            else {setFormReg({...formReg, telValue: ''})}
            return regExpTel.test(value);
        }
        else if (id === 'mailReg') {
            if (regExpMail.test(value)) {setFormReg({...formReg, mailValue: value})}
            else {setFormReg({...formReg, mailValue: ''})}
            return regExpMail.test(value);
        }
        else if (id === 'loginReg') {
            if (regExpLogin.test(value)) {setFormReg({...formReg, loginValue: value})}
            else {setFormReg({...formReg, loginValue: ''})}
            return regExpLogin.test(value);
        }
        else if (id === 'passwordReg') {
            if (regExpPass.test(value)) {setFormReg({...formReg, passwordValue: value})}
            else {setFormReg({...formReg, passwordValue: ''})}
            return regExpPass.test(value);
        }
        else if (id === 'confirmPasswordReg') {
            if (value === formReg.passwordValue) {setFormReg({...formReg, confirmPasswordValue: value})}
            else {setFormReg({...formReg, confirmPasswordValue: value})}
            return value === formReg.passwordValue
        }
    }


    const invalidField = 'Введите корректные данные';
    const invalidPasAut = 'Возможно в пароле допущена ошибка';
    const invalidConfPasReg = 'Пароли не совпадают';
    const validTel = 'Номер телефона должен содержать 11 цифр и начинаться с +7, не допускаются буквы и другие символы.';
    const validMail = 'E-mail адрес состоит из двух частей, разделённых символом @.';
    const validLogin = 'Логин должен содержать только латинские буквы или цыфры. Не допускается употребление специальных символов. Общая длина логина от 3 до 20 символов.';
    const validPassword = 'Пароль должен иметь не менее 8 символов, содержать хотя бы: 1 цифру, 1 символ нижнего регистра, 1 символ верхнего регистра латиницы, один специальный символ !@#$%^&*';
    const validConfirmPas = 'Пароли должны совпадать';
    


    const urlAuth = `https://gateway.scan-interfax.ru/api/v1/account/login`;
    

    const sendRequest = (event) => {
        dispatch(logOutAccount());
        const options = {
            method: 'POST',
            body: JSON.stringify({
                "login": `${formAut.loginValue}`,
                "password": `${formAut.passwordValue}`
            }),
            headers: {
                "Content-type": "application/json", 
                "Accept": "application/json",
            }
        }

        fetch(urlAuth, options)
            .then(response => {
                let result = response.json();
                dispatch(sendingRequestAut(response.status));
                return result;
            })
            .then(result => {

                if (result.accessToken) {
                    dispatch(getResponseAut(result));
                    navigate("/");
                }
                else if (result.errorCode) {
                    dispatch(getResponseAut(result));
                }
                else {
                    dispatch(getResponseAut({errorCode: '', message: 'Отказ в доступе'}));
                }
                
                return result;
            })
            .catch(() => {
                dispatch(getResponseAut({errorCode: '', message: 'Ошибка запроса'}));
            })

        event.preventDefault();
    }





    return (
        <div className='wrapperForm'>
            <img src={padlock} alt="Изображение замок" className='padlock'/>
            <div className="wrapperTab">
                <div className='tab activeTab' onClick={clickAuthorization}>Войти</div>
                <div className='tab'>Зарегистрироваться</div>
            </div>

            <form action="" className='form' onSubmit={sendRequest}>
                    <Input
                        name={'Логин, e-mail или номер телефона:'}
                        type={"text"} 
                        id={'loginAut'} 
                        validate={validate}
                        invalidValue={invalidField} 
                    />

                    <Input
                        name={'Пароль:'}
                        type={`${passwordVisible ? 'text' : "password"}`} 
                        id={'passwordAut'} 
                        validate={validate}
                        invalidValue={invalidPasAut} 
                    />

                    <div className='wrapperError'> 
                        {errorRespAut && <span className='errorMessage'>{errorRespAut.message}</span>}
                    </div>

                    <Button
                        type={'submit'} 
                        name={'Login'}
                        value={'Войти'}
                        disabled={!isFormAutFull}
                    />

                    <a href="#" className='recover'>Восстановить пароль</a>
                </form>     

                    
            <div>Войти через:</div>
            <div className='wrapperButtons'>
                <button className='servises'>
                    <img src={google} alt="Google" width="59"/>
                </button>
                <button className='servises'>
                    <img src={facebook} alt="Facebook" width="59"/>
                </button>
                <button className='servises'>
                    <img src={yandex} alt="Yandex" width="59"/>
                </button>
            </div>
        </div>
    )
}

export default FormsLogin;