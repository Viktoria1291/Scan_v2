import React, { useEffect } from 'react';
import './input.scss';
import eye_not_visible from './images/eye_not_visible.svg';
import eye_visible from './images/eye_visible.svg';
import infoCircle from './images/info-circle.svg';
import { useSelector, useDispatch } from 'react-redux';
import { showHidePassword } from '../../../../store/search.actions';


function Input({ name, type, id, validate, invalidValue, placeholder, tooltip, value }) {

    const [touched, setTouched] = React.useState(false);
    const [invalid, setInvalid] = React.useState('');
    const [inputValue, setInputValue] = React.useState(value || ''); // Локальное состояние

    const dispatch = useDispatch();
    const passwordVisible = useSelector(state => state.loginReduсer.passwordVisible);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleChange = (value) => {
        if (type === 'tel') {

        }

        if (!value) {
            setInvalid('Введите корректные данные');
            validate(id, value);
        }
        else if (validate(id, value)) { setInvalid('') }
        else { setInvalid(invalidValue) }
    }

    const handleBlur = () => { setTouched(true) }

    const clickEyePas = () => { dispatch(showHidePassword()) }


    return (
        <div
            className={`wrapperInput ${id.includes('search') ? 'wrapperInputSearch' : ''}`}
        >
            <div className='wrapperLabel'>
                <label htmlFor={id} className='label'>{name}</label>
                {tooltip &&
                    <div className={`question ${id.includes('search') ? 'questionSearch' : ''}`} datatooltip={tooltip}>
                        <img src={infoCircle} alt="Подсказка" />
                    </div>
                }
            </div>

            <input
                type={type}
                id={id}
                className={`input ${(invalid && id !== 'passwordAut') ? 'inputInvalid' : ''} ${id.includes('search') ? 'inputSearch' : ''}`}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => handleBlur()}
                placeholder={placeholder}
                value={inputValue}
            />
            <div className={`wrapperError ${id.includes('search') ? 'wrapperErrorSearch' : ''}`}>
                {(touched && invalid) &&
                    <span className={`errorMessage ${id === 'passwordAut' ? 'errorPassAut' : ''}`}>{invalid}</span>}
            </div>
            {id.includes('assword') && <img src={passwordVisible ? eye_visible : eye_not_visible} alt="" className='eye' onMouseOver={clickEyePas} onMouseOut={clickEyePas} />}
        </div>
    )
}

export default Input;