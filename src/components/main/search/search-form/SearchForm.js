import React from 'react';
import './search-form.scss';
import infoCircle from '../../authorization/auth-form/Input/images/info-circle.svg';
import Input from '../../authorization/auth-form/Input/Input';
import Button from '../../authorization/auth-form/Button/Button';
import Checkbox from './checkbox/Checkbox';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addHistogram, addSearchResultItem, addScanDoc, removeObjectSearch } from '../../../store/search.actions';
import { getResponseAccountSettings } from '../../../store/search.actions';



function SearchForm() {
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

    // состояние для индикатора загрузки
    const [isLoading, setIsLoading] = React.useState(false);


    // на этапе монтирования обращаемся в localStorage за предыдущими значениями инпутов 
    React.useEffect(() => {
        let lastINN = JSON.parse(localStorage.getItem('lastINN'));
        if (lastINN) { setForm({ ...form, inn: lastINN }) }
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

    const accountSettings = useSelector(state => state.loginReduсer.accountSettings);

    // создаем реф для инпута type=date, чтобы проверить не изменился ли тип
    let inputDate = React.createRef();

    // создаем сегодняшнюю дату в формате 'yyyy-mm-dd'
    let today = new Date().toISOString().slice(0, 10);

    // проверяем сообщения об ошибках в инпутах дат, и если имеется хотябы одно, записываем в переменную
    let invalidMessage = (!form.period.invalidBegin && !form.period.invalidEnd) ? '' : (!form.period.invalidBegin && form.period.invalidEnd) ? form.period.invalidEnd : (form.period.invalidBegin && !form.period.invalidEnd) ? form.period.invalidBegin : form.period.invalidEnd;

    // проверяем заполнение инпутов и отсутствие ошибок в форме
    let isSearchFormFull = form.inn && form.limit && form.period.beginDate && form.period.endDate && !form.period.invalidBegin && !form.period.invalidEnd ? true : false;

    // функция валидации
    // Новая версия функции validate без проверки ИНН
    const validate = (id, value) => {
        // Удалена проверка ИНН, так как она теперь обрабатывается отдельно
        const regExpDate = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

        if (id === 'searchLimit') {
            if (+value > 0 && +value <= 1000) {
                setForm({ ...form, limit: value });
                return true;
            } else {
                setForm({ ...form, limit: null });
                return false;
            }
        } else if (id === 'begin' || id === 'end') {
            return regExpDate.test(value);
        }
        return true; // Добавлено возвращение true по умолчанию
    }

    // функция проверки дат. Если даты в будущем времени или конечная дата раньше начальной - записываем в стейт ошибку
    const handleDate = (name, value) => {
        // проверки полей даты:
        // 1. проверка не пустое ли поле
        if (!value) {
            setForm({ ...form, period: { ...form.period, invalid: 'Это поле не может быть пустым' } })
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
                setForm({ ...form, period: { ...form.period, beginDate: value, invalidBegin: errorMessage } });
            } else {
                setForm({ ...form, period: { ...form.period, endDate: value, invalidEnd: errorMessage } });
            }
        }
    }

    // проверяем чистоту инпута
    const handleBlur = () => { setForm({ ...form, period: { ...form.period, touched: true } }) }

    // передаем значение чекбоксов в стейт
    const handleChecked = (e, id) => {
        if (id === 'totalDocuments') { setForm({ ...form, histogramTypes: { ...form.histogramTypes, totalDocuments: e } }) }
        else if (id === 'inBusinessNews') { setForm({ ...form, inBusinessNews: e }) }
        else if (id === 'onlyMainRole') { setForm({ ...form, onlyMainRole: e }) }
        else if (id === 'onlyWithRiskFactors') { setForm({ ...form, histogramTypes: { ...form.histogramTypes, riskFactors: e } }) }
        else if (id === 'excludeTechNews') { setForm({ ...form, technicalNews: e }) }
        else if (id === 'excludeAnnouncements') { setForm({ ...form, announceСalendars: e }) }
        else if (id === 'excludeDigests') { setForm({ ...form, newsBulletins: e }) }
    }

    // передаем в стейт значение селекта 
    const handleSelect = (value) => {
        setForm({ ...form, tonality: value })
    }

    // текст подсказок для соответствующих инпутов
    const invalidField = 'Введите корректные данные';
    const validINN = 'ИНН должен содержать 10 цифр, не допускаются буквы и другие символы.';
    const validNum = 'Количество документов в выдаче должно быть в диапазоне от 1 до 1000. Допускаются только цифры.';
    const validDate = 'Даты вводятся в формате ДД.ММ.ГГГГ (разделителем служит точка)';


    // функция отправки запроса
    const sendRequest = (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Проверка лимита
        if (accountSettings && accountSettings.eventFiltersInfo.companyLimit <= 0) {
            setErrorReq('Лимит запросов исчерпан');
            setIsLoading(false);
            return;
        }

        // Проверка авторизации
        if (!token) {
            setErrorReq('Вы не авторизованы!');
            setIsLoading(false);
            return;
        }

        setErrorReq('');
        dispatch(removeObjectSearch());

        // Получаем историю поиска из localStorage
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};
        const currentINN = form.inn;
        const isNewSearch = !searchHistory[currentINN]; // Проверяем, новый ли это ИНН

        // данные запроса
        const data = {
            issueDateInterval: {
                startDate: form.period.beginDate,
                endDate: form.period.endDate
            },
            searchContext: {
                targetSearchEntitiesContext: {
                    targetSearchEntities: [
                        {
                            type: "company",
                            sparkId: null,
                            entityId: null,
                            inn: form.inn,
                            maxFullness: form.histogramTypes.totalDocuments,
                            inBusinessNews: form.inBusinessNews
                        }
                    ],
                    onlyMainRole: form.onlyMainRole,
                    tonality: form.tonality,
                    onlyWithRiskFactors: form.onlyWithRiskFactors,
                    riskFactors: {
                        and: [],
                        or: [],
                        not: []
                    },
                    themes: {
                        and: [],
                        or: [],
                        not: []
                    }
                },
                themesFilter: {
                    and: [],
                    or: [],
                    not: []
                }
            },
            searchArea: {
                includedSources: [],
                excludedSources: [],
                includedSourceGroups: [],
                excludedSourceGroups: []
            },
            attributeFilters: {
                excludeTechNews: form.excludeTechNews,
                excludeAnnouncements: form.excludeAnnouncements,
                excludeDigests: form.excludeDigests
            },
            similarMode: "duplicates",
            limit: form.limit,
            sortType: "sourceInfluence",
            sortDirectionType: "desc",
            intervalType: "month",
            histogramTypes: [
                "totalDocuments",
                "riskFactors"
            ]
        };

        const instance = axios.create({
            baseURL: 'https://gateway.scan-interfax.ru/api/v1'
        });

        instance.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
            return config;
        });

        // Цепочка запросов с обработкой ошибок
        instance.post('/objectsearch/histograms', data)
            .then(histogramsResult => {
                if (histogramsResult.status === 200) {
                    dispatch(addHistogram(histogramsResult.data.data));
                    return instance.post('/objectsearch', data);
                }
                throw new Error('Histogram request failed');
            })
            .then(searchResult => {
                if (searchResult && searchResult.status === 200) {
                    dispatch(addSearchResultItem(searchResult.data.items));

                    const ids = searchResult.data.items
                        .map(item => item.encodedId)
                        .filter(Boolean);

                    if (ids.length === 0) {
                        throw new Error("No documents available");
                    }

                    // Обновляем счетчики только если это новый ИНН
                    if (accountSettings && isNewSearch) {
                        const prevUsedCount = accountSettings.eventFiltersInfo.usedCompanyCount;
                        const prevCompanyLimit = accountSettings.eventFiltersInfo.companyLimit;

                        const updatedSettings = {
                            ...accountSettings,
                            eventFiltersInfo: {
                                ...accountSettings.eventFiltersInfo,
                                usedCompanyCount: prevUsedCount + 1,
                                companyLimit: prevCompanyLimit - 1
                            }
                        };
                        dispatch(getResponseAccountSettings(updatedSettings));

                        // Обновляем кеш в localStorage
                        localStorage.setItem('cachedAccountSettings', JSON.stringify(updatedSettings));

                        // Сохраняем информацию о поиске по этому ИНН
                        searchHistory[currentINN] = true;
                        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                    }

                    return instance.post('/documents', { ids });
                }
                throw new Error('Search request failed');
            })
            .then(docsResult => {
                if (docsResult && docsResult.status === 200) {
                    dispatch(addScanDoc(docsResult.data));
                    navigate("/objectsearch", { state: { data: null } });
                }
            })
            .catch(error => {
                if (error.message === "No documents available") {
                    setErrorReq("В базе нет данных для загрузки документов");
                } else {
                    console.error("Ошибка API:", error.response?.data);
                    setErrorReq(
                        error.response?.data?.message ||
                        "Ошибка сервера. Проверьте введённые данные."
                    );
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };



    return (
        <form action="" className='wrapperForm formSearch' onSubmit={sendRequest}>
            <div className='form formLeft'>

                {/* Поле ИНН */}
                <div className="wrapperInput">
                    <div className='wrapperLabel'>
                        <label htmlFor='searchINN' className='label'>ИНН компании *</label>
                        <div className='question questionSearch' datatooltip={validINN}>
                            <img src={infoCircle} alt="Подсказка" />
                        </div>
                    </div>
                    <input
                        type="text"
                        id="searchINN"
                        className="input inputSearch"
                        value={form.inn}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 10) {
                                setForm({ ...form, inn: value });
                            }
                        }}
                        placeholder="10 цифр"
                    />
                    <div className='wrapperError'></div>
                </div>

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
                    value={form.limit || ''}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />

                <div className="wrapperInput">
                    <div className='wrapperLabel'>
                        <label htmlFor='period' className='label'>Диапазон поиска *</label>

                        <div className='question questionSearch questionDate' datatooltip={validDate}>
                            <img src={infoCircle} alt="Подсказка" />
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
                        value={form.period.beginDate}
                    />
                    <input
                        type='date'
                        id='period'
                        className={`input inputSearch inputDate ${form.period.touched && invalidMessage ? 'inputInvalid' : ''}`}
                        onChange={(e) => handleDate('end', e.target.value)}
                        onBlur={(e) => handleBlur()}
                        placeholder='Дата конца'
                        max={today}
                        value={form.period.endDate}
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
                        value={isLoading ? 'Поиск...' : 'Поиск'}
                        disabled={!isSearchFormFull || isLoading}
                    />
                    <p className='footnote'>* Обязательные к заполнению поля</p>
                </div>
            </div>
        </form>
    )
}

export default SearchForm;