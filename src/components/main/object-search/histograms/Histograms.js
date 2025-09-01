import React from 'react';
import './histograms.scss';
import arrow_left_carousel_active from './images/arrow_left_carousel_active.png';
import arrow_right_carousel_active from './images/arrow_right_carousel_active.png';
import spinner from '../../../header/images/spinner.png';
import { useSelector } from 'react-redux';

function Histograms() {
    const [offset, setOffset] = React.useState(0);
    const [visibleColumns, setVisibleColumns] = React.useState(8);
    const [columnWidth, setColumnWidth] = React.useState(140);

    const histograms = useSelector(state => state.objectSearchReducer.histograms);
    const searchResultItem = useSelector(state => state.objectSearchReducer.searchResultItem);

    // Эффект для изменения ширины колонки при изменении размера окна
    React.useEffect(() => {
        const updateColumnWidth = () => {
            if (window.innerWidth <= 480) {
                setColumnWidth(110); // 110px для экранов ≤ 480px
            } else {
                setColumnWidth(140); // 140px для больших экранов
            }
        };

        updateColumnWidth();
        window.addEventListener('resize', updateColumnWidth);

        return () => window.removeEventListener('resize', updateColumnWidth);
    }, []);

    // Эффект для расчета количества видимых колонок
    React.useEffect(() => {
        const handleResize = () => {
            const containerWidth = document.querySelector('.histograms')?.offsetWidth || 1142;
            const columnNamesWidth = window.innerWidth <= 480 ? 110 : 140; // соответствуем ширине columnNames
            const availableWidth = containerWidth - columnNamesWidth;

            const maxVisibleColumns = Math.floor(availableWidth / columnWidth);
            const actualVisibleColumns = Math.min(
                maxVisibleColumns,
                sortedHistograms?.[0]?.data?.length || 8
            );

            setVisibleColumns(Math.max(1, actualVisibleColumns));
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [columnWidth, histograms]);

    // перебираем histograms и сортируем его элементы по дате
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

    // функция для изменения окончания подсчета вариантов
    const getWord = (count) => {
        if (count >= 11 && count <= 19) {
            return 'вариантов';
        } else {
            count %= 10;
            if (count === 1) { return 'вариант' }
            else if (count >= 2 && count <= 4) { return 'варианта' }
            else { return 'вариантов' }
        }
    }

    // функция передвигания слайдера
    const moveSlider = (side) => {
        if (!sortedHistograms?.[0]?.data) return;

        const totalColumns = sortedHistograms[0].data.length;
        const maxOffset = -((totalColumns - visibleColumns) * columnWidth);

        if (side === 'left') {
            setOffset(prev => Math.min(0, prev + columnWidth));
        } else {
            setOffset(prev => Math.max(maxOffset, prev - columnWidth));
        }
    }

    return (
        <section className='objectSarch_section2'>
            <h4 className='h h4'>Общая сводка</h4>
            <p className='found'>Найдено {searchResultItem.length} {getWord(searchResultItem.length)}</p>

            <div className='wrapper_histograms'>
                <div onClick={() => moveSlider('left')}>
                    <img src={arrow_left_carousel_active} alt="Стрелка влево"
                        className={offset < 0 ? 'arrow_active' : 'arrow_passive'} />
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
                        histograms.length ?
                            <div className='flow' style={{
                                'transform': `translateX(${offset}px)`,
                                'width': `${sortedHistograms[0].data.length * columnWidth}px`
                            }}>
                                {sortedHistograms[0].data.map((item, index) => {
                                    return (
                                        <div
                                            className='columnResult column'
                                            style={{
                                                'width': `${columnWidth}px`,
                                                'minWidth': `${columnWidth}px`
                                            }}
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
                        className={!histograms || !histograms.length ? 'arrow_passive' :
                            offset > -((sortedHistograms?.[0]?.data?.length - visibleColumns) * columnWidth) ?
                                'arrow_active' : 'arrow_passive'}
                    />
                </div>
            </div>
        </section>
    )
}

export default Histograms;