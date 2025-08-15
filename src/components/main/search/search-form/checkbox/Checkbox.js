import React from 'react';
import './Checkbox.scss';


function Checkbox ({name, id, handleChecked, disabled, defaultChecked}) {
    return (
        <div className='wrapperCheckbox'>
            <input 
                type="checkbox" 
                className='checkbox' 
                id={id} 
                onChange={e => handleChecked(e.target.checked, id)}
                disabled={disabled}
                defaultChecked={defaultChecked}
            />
            <label className={`labelCheckbox ${disabled ? 'labelCheckboxDisabled' : ''}`} htmlFor={id}>
                {name}
            </label>
        </div>
    )
}

export default Checkbox;
