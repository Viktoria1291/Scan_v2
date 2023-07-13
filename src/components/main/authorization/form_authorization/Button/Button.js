import React from 'react';
import './Button.scss';


const tooltipLogin = 'Пожалуйста заполните все поля для ввода';
const tooltipSearch = 'Пожалуйста заполните обязательные поля';


function Button ({type, name, value, disabled}) {
    return (
        <button 
            type={type} 
            disabled={disabled} 
            className={`button button${name}`}
            {...(disabled ? {datatooltip: tooltipLogin} : {})}
            {...(disabled ? {datatooltip: tooltipSearch} : {})}
        >
            {value}
        </button>
    )
}

export default Button;