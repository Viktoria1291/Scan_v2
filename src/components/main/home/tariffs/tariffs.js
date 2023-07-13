import React from 'react';
import "./tariffs.scss";
import lamp from './images/lamp.svg';
import target from './images/target.svg';
import notebook from './images/notebook.svg';
import TariffItem from './tariffItem';

const prime_1 = '#029491';
const prime_2 = '#000000';
const prime_3 = '#ffffff';
const supplemental_1 = '#FFB64F';
const supplemental_2 = '#7CE3E1';
const supplemental_3 = '#5970FF';

// объект с тарифными планами
const tariffPlans = {
    beginner: {
        title: "Beginner",
        subTitle: 'Для небольшого исследования',
        img: lamp,
        price: 799,
        oldPrice: 1200,
        priceInstallment: 150,
        bonus: [
            'Безлимитная история запросов',
            'Безопасная сделка',
            'Поддержка 24/7', 
        ],
        background: supplemental_1,
        color: prime_2,
    },
    pro: {
        title: "Pro",
        subTitle: 'Для HR и фрилансеров',
        img: target,
        price: 1299,
        oldPrice: 2600,
        priceInstallment: 279,
        bonus: [
            'Все пункты тарифа Beginner',
            'Экспорт истории',
            'Рекомендации по приоритетам', 
        ],
        background: supplemental_2,
        color: prime_2,
    },
    business: {
        title: "Business",
        subTitle: 'Для корпоративных клиентов',
        img: notebook,
        price: 2379,
        oldPrice: 3700,
        priceInstallment: 0,
        bonus: [
            'Все пункты тарифа Pro',
            'Безлимитное количество запросов',
            'Приоритетная поддержка',
        ],
        background: prime_2,
        color: prime_3,
    },
}


function Tarrifs () {
    return (
        <div className={`hom_sec3_tariffs`}>
            <TariffItem tarif={tariffPlans.beginner}/>
            <TariffItem tarif={tariffPlans.pro}/>
            <TariffItem tarif={tariffPlans.business}/>
        </div>
    )
}

export default Tarrifs;