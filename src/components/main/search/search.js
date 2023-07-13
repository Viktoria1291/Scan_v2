import React from 'react';
import './search.scss';
import documents from './images/Document.svg';
import folders from './images/Folders.svg';
import searchImage from './images/searchImage.svg';
import FormSearch from './form_search/FormSearch';


function Search () {
    return (
        <div className='container'>
            <section className='section1'>
                <div className='contentLeft'>
                    <h3 className='h h3'>Найдите необходимые данные в пару кликов.</h3>
                    <p className='subTitle'>Задайте параметры поиска. <br/>Чем больше заполните, тем точнее поиск</p>
                </div>
                <div className='contentRight'>
                    <img src={documents} alt="Изображение" 
                    className='document' width={91}/>
                    <img src={folders} alt="Изображение" 
                    className='folders' width={140}/>
                </div>
            </section>
            <section className='section2'>
                <FormSearch/>
                <div className='contentRight'>
                    <img src={searchImage} alt="Изображение" width={442} className='imgRight'/>
                </div>
            </section>
        </div>
    )
}

export default Search;