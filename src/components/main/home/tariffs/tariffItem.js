import React from 'react';
import "./tariffs.scss";
import {useSelector} from 'react-redux';


function TariffItem ({tarif}) {
    // достаем из стора токен и данные пользователя (чтобы подсветить текущий тариф пользователя)
    const token = useSelector(state => state.loginReduсer.token);
    const userData = useSelector(state => state.loginReduсer.userData);

    // определяем, является ли данный TarrifsItem текущим тарифом
    const isCurrent = token && (tarif.title.toLowerCase() === userData.tarif.toLowerCase()) ? true : false;

    return (
        <div className={`${isCurrent ? 'current' : ''} tarif`} style={{'--background': tarif.background}}>
           
            <div 
                className='title' 
                style={{
                    '--background': tarif.background,
                    '--color': tarif.color,
                }}
            >
                <div className='title_text'>
                    <h5 className='h5 sec3_h5'>{tarif.title}</h5>
                    <p>{tarif.subTitle}</p>
                </div>
                <div className='img'>
                    <img src={tarif.img} alt="Изображение лампочка" width="93"/>
                </div>
            </div>

            <div className='currentTariff'>
                {isCurrent && <div className='badge'>Текущий тариф</div>}
            </div>

            <div className='text'>
                <p className='h5 sec3_h5'>
                    {tarif.price} &#8381; &emsp;
                    <span className='oldPrice'>{tarif.oldPrice} &#8381;</span>
                </p>

                <p className='installment'>{`или ${tarif.priceInstallment} ₽/мес. при рассрочке на 24 мес.`}</p>

                <ul className='ul'> 
                    <p className='ul_title'>В тариф входит:</p>
                    {tarif.bonus.map(item => {
                        return <li className='li' key={item}>{item}</li>
                    })}
                </ul>
                
            </div>

            <button 
                className={`buttonTariff ${isCurrent? 'buttonCurrent' : ''}`}>
                {isCurrent? 'Перейти в личный кабинет' : 'Подробнее'}
            </button>
        </div>
    )
}

export default TariffItem;