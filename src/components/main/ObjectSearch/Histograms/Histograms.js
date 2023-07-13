import React from 'react';
import './Histograms.scss';
import arrow_left_carousel_active from './images/arrow_left_carousel_active.png';
import arrow_right_carousel_active from './images/arrow_right_carousel_active.png';
import spinner from '../../../header/images/spinner.png';
import {useSelector} from 'react-redux';


function Histograms () {
    // СТЕЙТ: текущее смещение слайдера, max смещение слайлера, ширина экрана
    const [offset, setOffset] = React.useState(0);

    // достаем из стора histograms
    const histograms = useSelector(state => state.objectSearchReducer.histograms);

    const searchResultItem = useSelector(state => state.objectSearchReducer.searchResultItem);
    console.log("searchResultItem: " + searchResultItem.length); /* вывожу для себя */

    // перебираем histograms и сортируем его элементы по дате с помощью ф-и sortHist
    let sortedHistograms;
    if (histograms) {
        sortedHistograms = histograms.map(item => {
            item.data = sortHist(item.data);
            return item;
        });
    }

    // ф-я быстрой сортировки
    function sortHist(hist) {
        if (hist.length < 2) {
            return hist;
        } else {
            const pivotPosition = Math.floor(Math.random() * hist.length);
            const pivot = hist[pivotPosition];
            const less = hist.filter((item, index) => {
                const isPivot = index === pivotPosition;
                return !isPivot && (new Date(item.date) <= new Date(pivot.date));
            });
            const greater = hist.filter(item => new Date(item.date) > new Date(pivot.date));
            return [...sortHist(less), pivot, ...sortHist(greater)];
        }
    };

    // вычисляем количество найденных вариантов
   /* let totalVar;
    if (histograms && histograms.length > 0) {
        totalVar = sortedHistograms[0].data.reduce((sum, item) => {

            return sum + item.value;
        }, 0)
    };*/

    // Вычисляем количество и ширину видимых столбцов в слайдере гистограммы 
    // для экрана > 900 px:
    // max количество видимых столбцов 8
    // ширина всего слайдера 1282px (100%)
    // ширина титульного столбца 140px
    // ширина видимого потока 1282 - 140 = 1142px
    // ширина столбца потока, если длина массива 8 и менее = (1142/длинуМассива*100/1282) %

    // для экрана от 600 до 900
     // max количество видимых столбцов 4
    // ширина всего слайдера 782px (100%)
    // ширина титульного столбца 140px
    // ширина видимого потока 782 - 140 = 642px
    // ширина столбца потока, если длина массива 8 и менее = (642/длинуМассива*100/782) %

    let numVC;
    let widthVC;
    if (histograms && histograms.length) {
        if (window.innerWidth > 900) {
            if (sortedHistograms[0].data.length <= 8) {
                numVC = sortedHistograms[0].data.length;
                widthVC = (((1142/sortedHistograms[0].data.length)*100)/1282);
            } else {
                numVC = 8;
                widthVC = 10.92;
            }
        } else if (window.innerWidth <= 900 && window.innerWidth > 600) {
            if (sortedHistograms[0].data.length <= 4) {
                numVC = sortedHistograms[0].data.length;
                widthVC = (((642/sortedHistograms[0].data.length)*100)/782);
            } else {
                numVC = 4;
                widthVC = 19.82;
            }
        } else {
            numVC = 1;
            widthVC = 100;
        }
    }
    

    // функция для изменения окончания подсчета вариантов
    const getWord = (count) => {
        if (count >= 11 && count <= 19) {
            return 'вариантов';
        } else {
            count %= 10;
            if (count === 1) {return 'вариант'}
            else if (count >= 2 && count <= 4) {return 'варианта'}
            else {return 'вариантов'}
        }
    }


    // функция передвигания слайдера
    const moveSlider = (side) => {
        if (window.innerWidth > 600) {
            if (side === 'left') {
                if (offset < 0) {
                    setOffset(offset + widthVC);
            } else {return}
            } else {
                if (offset > ((-sortedHistograms[0].data.length + numVC) * widthVC)) {
                    setOffset(offset - widthVC);
                } else {return};
            }
        }
        else {
            if (side === 'left') {
                if (offset < 0) {
                    setOffset(offset + 100);
                } else {return}
            } else {
                if (offset > ((-sortedHistograms[0].data.length + numVC) * widthVC)) {
                    setOffset(offset - 100);
                } else {return};
            }
        }
    }


    return (
        <section className='objectSarch_section2'>
            <h4 className='h h4'>Общая сводка</h4>
            <p className='found'>Найдено {searchResultItem.length} {getWord(searchResultItem.length)}</p>

            <div className='wrapper_histograms'>
                <div  onClick={() => moveSlider('left')}>
                    <img src={arrow_left_carousel_active} alt="Стрелка влево" className={`${Math.round(offset) ? 'arrow_active' : 'arrow_passive'}`}/>
                </div>

                <div className='histograms'>
                    <div className='columnNames column'>
                        <p className='elemColumn'>Период</p>
                        <p className='elemColumn'>Всего</p>
                        <p className='elemColumn'>Риски</p>
                    </div>

                    {!histograms ?
                        <div className='spinner'><img src={spinner} alt="" /></div>
                        :
                        histograms.length ? /* ПРОБЛЕМА В ЭТОМ УСЛОВИИ */
                            <div className='flow' style={{'transform': `translateX(${offset}%)`}}>
                                {sortedHistograms[0].data.map((item, index) => {
                                    return (
                                        <div 
                                            className='columnResult column' 
                                            style={{'minWidth': `${Math.round(widthVC * 100) / 100}%`}}
                                            key={index}
                                        >
                                            <p className='elemColumn'>{new Intl.DateTimeFormat('ru').format(new Date(item.date))}</p>
                                            <p>{searchResultItem.length}</p>
                                            <p className='elemColumn'>{sortedHistograms[1].data[index].value}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className='noDate'>Нет данных по запросу</div>
                    }
                </div>

                <div className='arrow_carousel right' onClick={() => moveSlider('right')}>
                    <img 
                        src={arrow_right_carousel_active} 
                        alt="Стрелка вправо" 
                        className={`${!histograms || !histograms.length ? 'arrow_passive' :
                        offset === ((-sortedHistograms[0].data.length + numVC) * widthVC) ? 'arrow_passive' : 'arrow_active'}`}
                    />
                </div>
            </div>
        </section>
    )
}

export default Histograms;