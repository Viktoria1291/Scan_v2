import React from 'react';
import "./carousel_home.scss";
import arrow_left_carousel from './images/arrow_left_carousel.png';
import arrow_right_carousel from './images/arrow_right_carousel.png';
import watch from './images/watch.svg';
import magnifier from './images/magnifier.svg';
import keyhole from './images/keyhole.svg';
import finger from './images/finger.svg';


function Carousel_home () {
    // СТЕЙТ - слайды карусели
    const [carouselItems, setCarouselItems] = React.useState([
        {image: watch, description: 'Высокая и оперативная скорость обработки заявки'},
        {image: magnifier, description: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос'},
        {image: keyhole, description: 'Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству'},
        {image: finger, description: 'Просто мы классные! :)'}
    ]);

    // СТЕЙТ - смещение ленты карусели
    const [offset, setOffset] = React.useState(0);

    // функция передвижения ленты слайдера
    const moveSlider = (side) => {
        if (window.innerWidth > 700) {
            if (side === 'left') {
                if (offset < 0) {
                    setOffset(offset + 33.33);
                } else {setOffset((-carouselItems.length + 3) * 33.33)}
            } else {
                if (offset > ((-carouselItems.length + 3) * 33.33)) {
                    setOffset(offset - 33.33);
                } else (setOffset(0));
            }
        }
        else {
            if (side === 'left') {
                if (offset < 0) {
                    setOffset(offset + 100);
                } else {setOffset((-carouselItems.length + 1) * 100)}
            } else {
                if (offset > ((-carouselItems.length + 1) * 100)) {
                    setOffset(offset - 100);
                } else {setOffset(0)};
            }
        }
    }


    React.useEffect(() => {
        let timerID = setInterval(() => moveSlider(), 3000);
        return () => {
            clearInterval(timerID);
        };
    }, [carouselItems, offset]);



    return (
        <div className='wrapper_carousel'>
            <div className='arrow_carousel left' onClick={() => moveSlider('left')}>
                <img src={arrow_left_carousel} alt="Стрелка влево" />
            </div>

            
            <div className='carousel'>
                <div className='flow' style={{'transform': `translateX(${offset}%)`}}>
                    {carouselItems.map((item, index) => {
                        return (
                            <div className='carousel_item' key={index}>
                                <img src={item.image} alt="" className='svgIcon'/>
                                <p className='carousel_text'>{item.description}</p>
                            </div>
                        )
                    })}
                </div>
                
            </div>

            <div className='arrow_carousel right' onClick={() => moveSlider('right')}>
                <img src={arrow_right_carousel} alt="Стрелка вправо" />
            </div>
        </div>
    )
}

export default Carousel_home;