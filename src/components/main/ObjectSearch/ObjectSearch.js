import React from 'react';
import './ObjectSearch.scss';
import {useSelector} from 'react-redux';
import {Navigate, useLocation} from 'react-router-dom';
import Histograms from './Histograms/Histograms';
import ScanDoc from './ScanDoc/ScanDoc';
import spinner from './images/spinner_big.svg';


function ObjectSearch () {
    // достаем из стора токен и гистограмму
    const token = useSelector(state => state.loginReduсer.token);
    const histograms = useSelector(state => state.objectSearchReducer.histograms);
    const searchResultItem = useSelector(state => state.objectSearchReducer.searchResultItem);


    const location = useLocation();

    // СТЕЙТ: количество видимых статей
    const [visibleInd, setVisibleInd] = React.useState(10);
    
    // достаем из стора скандок
    const scanDoc = useSelector(state => state.objectSearchReducer.scanDoc);
    

    // увеличение количества видимых статей
    const showMore = () => {
        setVisibleInd(visibleInd + 10);
    }

    return (
    // ecли нет авторизации, то редиректим на authorization
        !token ?
        <Navigate to={"/authorization"} state={{from: location}}/>
        :
            <div className='container'>
                <section className='objectSarch_section1'>
                    <div className='content_left'>
                        <h3 className='h h3'>Ищем. Скоро будут результаты</h3>
                        <p className='subTitle'>Поиск может занять некоторое время, просим сохранять терпение.</p>
                    </div>
                    <div className='content_right'></div>
                </section>

                <Histograms/>

                <section className='objectSarch_section3'>
                    <h4 className='h h4'>Список документов</h4>
                    <div className='wrapperDoc'>
                        {!histograms ?
                            <div className='spinner'><img src={spinner} alt="" /></div>
                            :
                            !searchResultItem.length ?
                                <div className='noDate'>Нет данных по запросу</div>
                                :
                                scanDoc.length ?
                                    scanDoc.map((item, index) => {
                                        return (
                                            <ScanDoc
                                                key={index}
                                                item={item}
                                                visibleInd={visibleInd}
                                                index={index}
                                            />
                                        )
                                    })
                                    :
                                    <div className='spinner'><img src={spinner} alt="" /></div>
                        }
                    </div>


                    {visibleInd <= scanDoc.length ? 
                    <button className='button btnObjectSearch' onClick={showMore}>Показать больше</button>
                    : ''}
                </section>
            </div>
        ) 
}

export default ObjectSearch;