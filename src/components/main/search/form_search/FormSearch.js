import React from 'react';
import './FormSearch.scss';
import infoCircle from '../../authorization/form_authorization/Input/images/info-circle.svg';
import Input from '../../authorization/form_authorization/Input/Input';
import Button from '../../authorization/form_authorization/Button/Button';
import Checkbox from './Checkbox/Checkbox';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {addHistogram, addSearchResultItem, addScanDoc, removeObjectSearch} from '../../../store/actions';



function FormSearch () {
    // записываем в стейт все значения инпутов 
    const [form, setForm] = React.useState({
        inn: '',
        tonality: 'any',
        limit: null,
        period: {
            beginDate: '',
            endDate: '',
            touched: false,
            invalidBegin: 'Это поле не может быть пустым',
            invalidEnd: 'Это поле не может быть пустым',
        },
        histogramTypes: {
            totalDocuments: false,
            riskFactors: false,
        },
        inBusinessNews: false,
        onlyMainRole: false,
        onlyWithRiskFactors: false,
        excludeTechNews: false,
        excludeAnnouncements: false,
        excludeDigests: false,
    });

    // еще один стейт - сообщение ошибки запроса
    const [errorReq, setErrorReq] = React.useState('');


    // на этапе монтирования обращаемся в localStorage за предыдущими значениями инпутов 
    React.useEffect(() => {
        let lastINN = JSON.parse(localStorage.getItem('lastINN'));
        if (lastINN) {setForm({...form, inn: lastINN})}
    }, [])

    // после изменения стейта form записываем в localStorage обновленный стейт
    React.useEffect(() => {
        localStorage.setItem('lastINN', JSON.stringify(form.inn));
    }, [form])



    // создаем экземпляр для навигации
    const navigate = useNavigate();

    // создаем экземпляр для записи в стор
    const dispatch = useDispatch();

    // достаем из стора токен
    const token = useSelector(state => state.loginReduсer.token);

    // создаем реф для инпута type=date, чтобы проверить не изменился ли тип
    let inputDate = React.createRef();

    // создаем сегодняшнюю дату в формате 'yyyy-mm-dd'
    let today = new Date().toISOString().slice(0, 10);

    // проверяем сообщения об ошибках в инпутах дат, и если имеется хотябы одно, записываем в переменную
    let invalidMessage = (!form.period.invalidBegin && !form.period.invalidEnd) ? '' : (!form.period.invalidBegin && form.period.invalidEnd) ? form.period.invalidEnd : (form.period.invalidBegin && !form.period.invalidEnd) ? form.period.invalidBegin : form.period.invalidEnd;

    // проверяем заполнение инпутов и отсутствие ошибок в форме
    let isFormSearchFull = form.inn && form.limit && form.period.beginDate && form.period.endDate && !form.period.invalidBegin && !form.period.invalidEnd ? true : false;

    // функция валидации
    const validate = (id, value) => {
        const regExpINN = /^\d{10}$/;

        // для формата dd.mm.yyyy dd.mm.yy
        const regExpDate = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

        // если значения соответствуют регулярным выражениям - записываем их в стейт
        if (id === 'searchINN') {
            if (regExpINN.test(value)) {setForm({...form, inn: value})} 
            else {setForm({...form, inn: ''})}
            return regExpINN.test(value);
        } else if (id === 'searchLimit') {
            if (+value > 0 && +value <= 1000) {setForm({...form, limit: value})} 
            else {setForm({...form, limit: null})}
            return +value > 0 && +value <= 1000;
        } else if (id === 'begin' || id === 'end') {
            return regExpDate.test(value);
        }
    }

    // функция проверки дат. Если даты в будущем времени или конечная дата раньше начальной - записываем в стейт ошибку
    const handleDate = (name, value) => {
        // проверки полей даты:
        // 1. проверка не пустое ли поле
        if (!value) {
            setForm({...form, period: {...form.period, invalid: 'Это поле не может быть пустым'}})
        } else {
            let errorMessage = '';

            // 2. если тип инпута 'text' - форматируем и проверяем валидность с regExp
            if (inputDate.current.type === 'text') {
                console.log(inputDate.current.type);
                if (!validate(name, value) || (new Date(value.split('.').reverse().join('-')) == 'Invalid Date')) {
                    errorMessage = 'Введите корректные данные';
                    value = '';
                }
                value = value.split('.').reverse().join('-');
            }

            // 3. проверка не будущее ли время
            if (!errorMessage && today < value) {
                errorMessage = 'Даты не должны быть в будущем времени';
                value = '';
            }

            // 4. проверка хронологии
            if (!errorMessage && value) {
                if (name === 'begin') {
                    if (form.period.endDate && (new Date(value) <= new Date(form.period.endDate))) {
                        errorMessage = '';
                    } else if (form.period.endDate && (new Date(value) > new Date(form.period.endDate))) {
                        errorMessage = 'Дата начала не может быть позднее даты конца';
                    }
                } else if (name === 'end') {
                    if (form.period.beginDate && (new Date(value) >= new Date(form.period.beginDate))) {
                        errorMessage = '';
                    } else if (form.period.beginDate && (new Date(value) < new Date(form.period.beginDate))) {
                        errorMessage = 'Дата начала не может быть позднее даты конца';
                    }
                }
            }

            // запись в стейт 
            if (name === 'begin') {
                setForm({...form, period: {...form.period, beginDate: value, invalidBegin: errorMessage}});
            } else {
                setForm({...form, period: {...form.period, endDate: value, invalidEnd: errorMessage}});
            }
        }
    }

    // проверяем чистоту инпута
    const handleBlur = () => {setForm({...form, period: {...form.period, touched: true}})}

    // передаем значение чекбоксов в стейт
    const handleChecked = (e, id) => {
        if (id === 'totalDocuments') {setForm({...form, histogramTypes: {...form.histogramTypes, totalDocuments: e}})}
        else if (id === 'inBusinessNews') {setForm({...form, inBusinessNews: e})}
        else if (id === 'onlyMainRole') {setForm({...form, onlyMainRole: e})}
        else if (id === 'onlyWithRiskFactors') {setForm({...form, histogramTypes: {...form.histogramTypes, riskFactors: e}})}
        else if (id === 'excludeTechNews') {setForm({...form, technicalNews: e})}
        else if (id === 'excludeAnnouncements') {setForm({...form, announceСalendars: e})}
        else if (id === 'excludeDigests') {setForm({...form, newsBulletins: e})}
    }

    // передаем в стейт значение селекта 
    const handleSelect = (value) => {
        setForm({...form, tonality: value})
    }

    // текст подсказок для соответствующих инпутов
    const invalidField = 'Введите корректные данные';
    const validINN = 'ИНН должен содержать 10 цифр, не допускаются буквы и другие символы.';
    const validNum = 'Количество документов в выдаче должно быть в диапазоне от 1 до 1000. Допускаются только цифры.';
    const validDate = 'Даты вводятся в формате ДД.ММ.ГГГГ (разделителем служит точка)';

    
    // функция отправки запроса
    const sendRequest = (event) => {
        // перед началом запроса убедимся в авторизации
        if (!token) {
            setErrorReq('Вы не авторизованы!');
            return;
        }

        // перед началом запроса обнулим ошибки в стейте и данные предыдущих запросов в сторе
        setErrorReq('');
        dispatch(removeObjectSearch());

        // данные запроса
        const data = {
            "issueDateInterval": {
                "startDate": new Date(form.period.beginDate),
                "endDate": new Date(form.period.endDate)
            },
            "searchContext": {
                "targetSearchEntitiesContext": {
                    "targetSearchEntities": [
                        {
                            "type": "company",
                            "sparkId": null,
                            "entityId": null,
                            "inn": form.inn,
                            "maxFullness": true,
                            "inBusinessNews": form.inBusinessNews
                        }
                    ],
                    "onlyMainRole": form.onlyMainRole,
                    "tonality": form.tonality,
                    "onlyWithRiskFactors": form.onlyWithRiskFactors,
                    "riskFactors": {
                        "and": [],
                        "or": [],
                        "not": []
                    },
                    "themes": {
                        "and": [],
                        "or": [],
                        "not": []
                    }
                },
                "themesFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                }
            },
            "searchArea": {
                "includedSources": [],
                "excludedSources": [],
                "includedSourceGroups": [],
                "excludedSourceGroups": []
            },
            "attributeFilters": {
                "excludeTechNews": form.excludeTechNews,
                "excludeAnnouncements": form.excludeAnnouncements,
                "excludeDigests": form.excludeDigests
            },
            "similarMode": "duplicates",
            "limit": form.limit,
            "sortType": "sourceInfluence",
            "sortDirectionType": "desc",
            "intervalType": "month",
            "histogramTypes": [
                "totalDocuments",
                "riskFactors"
            ]
        }

        // создание экземпляра
        const instance = axios.create({
            baseURL: 'https://gateway.scan-interfax.ru/api/v1'
        });



        instance.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
            return config;
        })

        // запрос на гистограмму
        instance
            .post('/objectsearch/histograms', data)
            .then(result => {
                if (result.status === 200) {
                    dispatch(addHistogram(result.data.data));
                    console.log('запрос на гистограмму: ' + result.status)
                    // запрос на ids 
                    instance
                        .post('/objectsearch', data)
                        .then(result => {
                            if (result.status === 200) {
                                dispatch(addSearchResultItem(result.data.items));
                                console.log('запрос на IDS: ' + result.status);
                                let arrIDS = [];
                                for (let i = 0; i < 100 && i < result.data.items.length; i++) {
                                    arrIDS.push(result.data.items[i].encodedId)
                                }
                                // запрос скандок
                                instance
                                    .post('/documents', {ids: arrIDS})
                                    .then(result => {
                                        if (result.status === 200) {
                                            dispatch(addScanDoc(result.data));
                                            console.log('запрос на scanDoc: ' + result.status);
                                        }
                                    })
                                    .catch(error => {console.log('запрос на scanDoc: ' + error.response.data.message)})
                            }
                        })
                        .catch(error => {console.log('запрос на IDS: ' + error.response.data.message)})
                        
                    // переадресация на страницу
                    navigate("/objectsearch", {state:{data: null}});
                }
            })
            .catch(error => {
                setErrorReq('запрос гистограммы: ' + error.response.data.message);
            });

        // блокирование нативного поведения form
        event.preventDefault();
    }



    return (
        <form action="" className='wrapperForm formSearch' onSubmit={sendRequest}>
            <div className='form formLeft'>
                <Input
                    name={'ИНН компании *'}
                    type={"text"} 
                    id={'searchINN'} 
                    validate={validate}
                    invalidValue={invalidField}
                    placeholder={'10 цифр'}
                    tooltip={validINN}
                    defaultValue={form.inn} 
                />

                <div className="wrapperInput">
                    <div className='wrapperLabel'>
                        <label htmlFor='tonality' className='label'>Тональность</label>
                    </div>
                    
                    <select name="" id="" className='input inputSearch' value={form.tonality} onChange={e => handleSelect(e.target.value)}>
                        <option className='option' value='positive'>Позитивная</option>
                        <option className='option' value='negative' >Негативная</option>
                        <option className='option' value='any'>Любая</option>
                    </select>
                    <div className='wrapperError wrapperErrorSearch'></div>
                </div>



                <Input
                    name={'Количество документов в выдаче *'}
                    type={"number"} 
                    id={'searchLimit'} 
                    validate={validate}
                    invalidValue={invalidField}
                    placeholder={'от 1 до 1000'}
                    tooltip={validNum} 
                    defaultValue={form.limit}
                />

                <div className="wrapperInput">
                    <div className='wrapperLabel'>
                        <label htmlFor='period' className='label'>Диапазон поиска *</label>

                        <div className='question questionSearch questionDate' datatooltip={validDate}>
                            <img src={infoCircle} alt="Подсказка"/>
                        </div>
                    </div>

                    <input 
                        ref={inputDate}
                        type='date' 
                        id='period'
                        className={`input inputSearch inputDate ${form.period.touched && invalidMessage ? 'inputInvalid' : ''}`} 
                        onChange={(e) => handleDate('begin', e.target.value)}
                        onBlur={(e) => handleBlur()} 
                        placeholder='Дата начала' 
                        max={today}
                        defaultValue={new Date(form.period.beginDate)}
                    />
                    <input 
                        type='date' 
                        id='period'
                        className={`input inputSearch inputDate ${form.period.touched && invalidMessage ? 'inputInvalid' : ''}`} 
                        onChange={(e) => handleDate('end', e.target.value)}
                        onBlur={(e) => handleBlur()} 
                        placeholder='Дата конца' 
                        max={today}
                        defaultValue={new Date(form.period.beginDate)}
                    />

                    <div className='wrapperError wrapperErrorSearch wrapperErrorSearchDate'>
                        {(form.period.touched && invalidMessage) && 
                        <span className='errorMessage'>{invalidMessage}</span>}
                    </div>
                </div>

            </div>
            <div className='formRight'>
                <div className='form_chek'>
                    <Checkbox
                        name={'Признак максимальной полноты'}
                        id={'totalDocuments'}
                        handleChecked={handleChecked}
                        defaultChecked={form.histogramTypes.totalDocuments}
                    />
                    <Checkbox
                        name={'Упоминания в бизнес-контексте'}
                        id={'inBusinessNews'}
                        handleChecked={handleChecked}
                        defaultChecked={form.inBusinessNews}
                    />
                    <Checkbox
                        name={'Главная роль в публикации'}
                        id={'onlyMainRole'}
                        handleChecked={handleChecked}
                        defaultChecked={form.onlyMainRole}
                    />
                    <Checkbox
                        name={'Публикации только с риск-факторами'}
                        id={'onlyWithRiskFactors'}
                        handleChecked={handleChecked}
                        disabled={form.histogramTypes.totalDocuments}
                        defaultChecked={form.onlyWithRiskFactors}
                    />
                    <Checkbox
                        name={'Включать технические новости рынков'}
                        id={'excludeTechNews'}
                        handleChecked={handleChecked}
                        disabled={form.histogramTypes.totalDocuments}
                        defaultChecked={form.excludeTechNews}
                    />
                    <Checkbox
                        name={'Включать анонсы и календари'}
                        id={'excludeAnnouncements'}
                        handleChecked={handleChecked}
                        defaultChecked={form.excludeAnnouncements}
                    />
                    <Checkbox
                        name={'Включать сводки новостей'}
                        id={'excludeDigests'}
                        handleChecked={handleChecked}
                        disabled={form.histogramTypes.totalDocuments}
                        defaultChecked={form.excludeDigests}
                    />
                </div>

                <div className='wrapperButton'>
                    <div className='errorReq'>{errorReq}</div>
                    <Button
                        type={'submit'} 
                        name={'Search'}
                        value={'Поиск'}
                        disabled={!isFormSearchFull}
                    />
                    <p className='footnote'>* Обязательные к заполнению поля</p>
                </div>   
            </div> 
        </form>
    )
}

export default FormSearch;