import React, { useState, useEffect } from 'react';
import './css/admin.css';
import Title from "./title";
import search from "../../assets/img/search.png"
import axios from 'axios';
import config from '../../config';
import NewTrackChange from './NewTrackChange';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TrackList = () => {
    // Состояния для обычного списка треков и пагинации
    const [tracks, setTracks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);

    // Фильтры по статусу, филиалам и пользователям
    const [statuses, setStatuses] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [statusFilterText, setStatusFilterText] = useState('');
    const [showStatuses, setShowStatuses] = useState(false);

    const [filials, setFilials] = useState([]);
    const [filialFilterText, setFilialFilterText] = useState('');
    const [showFilials, setShowFilials] = useState(false);

    const [sortByDate, setSortByDate] = useState('latest');

    const [userFilter, setUserFilter] = useState('');
    const [showUserFilter, setShowUserFilter] = useState(false);
    const [textUserFilter, setTextUserFilter] = useState('');

    // Состояния для закладок и модальных окон для одного трека
    const [bookmarksWithoutStatus, setBookmarksWithoutStatus] = useState([]);
    const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);
    const [isModalBookmarkVisible, setIsModalBookmarkVisible] = useState(false);
    const [isModalTrackVisible, setIsModalTrackVisible] = useState(false);
    const [trackNumber, setTruckNumber] = useState('');

    // --- Новые состояния для массового добавления ---
    const [isModalMassTrackVisible, setIsModalMassTrackVisible] = useState(false);
    const [massDate, setMassDate] = useState('');
    const [massStatus, setMassStatus] = useState('');

    // Функция для установки номера страницы
    const setPage = (newPage) => {
        setCurrentPage(newPage <= 0 ? 1 : newPage);
    };

    const fetchBookmarksWithoutStatus = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/track/getBookmarksWithoutStatus`);
            setBookmarksWithoutStatus(response.data);
            setIsBookmarksVisible(!isBookmarksVisible);
        } catch (error) {
            console.error('Ошибка при получении закладок без статуса:', error.message);
        }
    };

    const handleCloseBookmarks = () => {
        setIsBookmarksVisible(false);
    };

    // Получение списка треков (с учётом пагинации, поиска, сортировки и фильтров)
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/track/tracks`, {
                    params: {
                        page: currentPage,
                        limit: perPage,
                        search: searchTerm,
                        sortByDate: sortByDate,
                        status: statusFilter,
                        userFilter: userFilter
                    }
                });
                setTracks(response.data.tracks);
                setTotalUsers(response.data.totalCount);
            } catch (error) {
                console.error('Ошибка при получении трек-кодов:', error.message);
            }
        };

        fetchTracks();
    }, [currentPage, perPage, searchTerm, sortByDate, statusFilter, userFilter]);

    // Получение списка статусов
    useEffect(() => {
        const fetchStatuses = async () => {
          try {
            const response = await axios.get(`${config.apiUrl}/api/status/getStatus`);
            setStatuses(response.data);
          } catch (error) {
            console.error('Ошибка при получении списка статусов:', error.message);
          }
        };
      
        fetchStatuses();
      }, []);

    // Получение списка филиалов
    useEffect(() => {
        const fetchFilials = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/filial/getFilial`);
                setFilials(response.data.map(f => f.filial));
            } catch (error) {
                console.error('Ошибка при получении списка филиалов:', error.message);
            }
        };

        fetchFilials();
    }, []);

    // Обработчики изменения номера и кол-ва страниц
    const handlePageChange = (e) => {
        setCurrentPage(e.target.value);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
    };

    const handlePageChangePlus = () => {
       setPage(currentPage + 1);
    };

    const handlePageChangeMinus= () => {
        setPage(currentPage - 1);
    };

    // Обработчик для изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    // Обработчик для сортировки по дате
    const handleSortByDate = (type) => {
        setSortByDate(type);
        setCurrentPage(1);
    };

    // Функция для получения текста статуса или филиала по его id
    const getStatusText = (statusId) => {
        const status = statuses.find((status) => status._id === statusId);
        if (status) {
            return status.statusText;
        }
        const filial = filials.find((filial) => filial._id === statusId);
        return filial ? filial.filialText : 'Статус не найден';
    };

    // Функции для переключения видимости всплывающих окон фильтров
    const toggleStatuses = () => {
        setShowStatuses(!showStatuses);
    };

    const toggleFilials = () => {
        setShowFilials(!showFilials);
    };

    const toggleUserFilter = () => {
        setShowUserFilter(!showUserFilter);
    };

    // Обработчики выбора фильтров
    const handleStatusFilter = (statusId, statusText) => {
        setStatusFilter(statusId);
        setStatusFilterText(statusText);
        setShowStatuses(false);
        setPage(1);
    };

    const handleFilialFilter = (statusId, statusText) => {
        setStatusFilter(statusId);
        setFilialFilterText(statusText);
        setShowFilials(false);
        setPage(1);
    };

    const handleUserFilter = (filterUser, userFilterText) => {
        setUserFilter(filterUser);
        setTextUserFilter(userFilterText);
        setShowUserFilter(!showUserFilter);
        setPage(1);
    };

    // Обработчики для одиночного изменения или добавления трека
    const handleAddBookmark = async (trackNumber) => {
        setIsModalBookmarkVisible(!isModalBookmarkVisible);
        setTruckNumber(trackNumber);
    };

    const handleChangeBookmark = async (trackNumber) => {
        setIsModalTrackVisible(!isModalTrackVisible);
        setTruckNumber(trackNumber);
    };

    const onCloseModal = () =>{
        setIsModalBookmarkVisible(!isModalBookmarkVisible);
        setTruckNumber("");
    };

    const onCloseModalTrack = () =>{
        setIsModalTrackVisible(!isModalTrackVisible);
        setTruckNumber("");
    };

    // --- Новый обработчик для массового добавления ---
    const handleMassTrackSubmit = async () => {
        if (!massDate || !massStatus) {
            alert('Выберите дату и статус');
            return;
        }
        try {
            // Извлекаем массив трек-кодов из текущего списка (фильтрованные треки)
            const trackNumbers = tracks.map(t => t.track);
            await axios.post(`${config.apiUrl}/api/track/addExcelTrack`, {
                tracks: trackNumbers,
                status: massStatus,
                date: massDate
            });
            alert('Треки успешно обновлены или созданы');
            setIsModalMassTrackVisible(false);
            // При необходимости можно перезагрузить список треков
            setCurrentPage(1);
        } catch (error) {
            console.error('Ошибка при массовом добавлении треков:', error);
            alert('Ошибка при массовом добавлении треков');
        }
    };

    return (
        <div className="mainAdmin">
            <Title text="Список посылок"/>
            <div className="users-container">
                <div className="header-bar">
                    <div className="search-bar">
                        <img src={search} alt="" className="searchIcon"/>
                        <input
                            type="text"
                            className="searchInput"
                            placeholder="Поиск..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="filter-bar">
                        <button className="filter-point" onClick={fetchBookmarksWithoutStatus}>
                            Добавлен в базу
                        </button>

                        <div
                            className={`filter-point ${sortByDate === 'latest' ? 'filter-point-active' : ''}`}
                            onClick={() => handleSortByDate('latest')}
                        >
                            Свежие по дате
                        </div>
                        <div
                            className={`filter-point ${sortByDate === 'oldest' ? 'filter-point-active' : ''}`}
                            onClick={() => handleSortByDate('oldest')}
                        >
                            Старые по дате
                        </div>
                        <div className="status-filter">
                            <div className="filter-point" onClick={toggleUserFilter}>
                                {textUserFilter || 'Пользователь'} ↓
                            </div>
                            {showUserFilter && (
                                <div className="statuses-popup">
                                    <div className="filter-point-status" onClick={() => handleUserFilter('', 'Пользователь')}>
                                        Все
                                    </div>
                                    <div className="filter-point-status" onClick={() => handleUserFilter('exists', 'Добавлен')}>
                                        Добавлен
                                    </div>
                                    <div className="filter-point-status" onClick={() => handleUserFilter('notExists', 'Не добавлен')}>
                                        Не добавлен
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="status-filter">
                            <div className="filter-point" onClick={toggleStatuses}>
                                {statusFilterText || 'По статусам'} ↓
                            </div>
                            {showStatuses && (
                                <div className="statuses-popup">
                                    <div className="filter-point-status" onClick={() => handleStatusFilter('', '')}>
                                        Все треки
                                    </div>
                                    {statuses.map((status) => (
                                        <div
                                            key={status._id}
                                            className="filter-point-status"
                                            onClick={() => handleStatusFilter(status._id, status.statusText)}
                                        >
                                            {status.statusText}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="status-filter">
                            <div className="filter-point" onClick={toggleFilials}>
                                {filialFilterText  || 'По филиалам'} ↓
                            </div>
                            {showFilials && (
                                <div className="statuses-popup">
                                    <div className="filter-point-status" onClick={() => handleFilialFilter('', '')}>
                                        Все треки
                                    </div>
                                    {filials.map((filial) => (
                                        <div
                                            key={filial._id}
                                            className="filter-point-status"
                                            onClick={() => handleFilialFilter(filial._id, filial.filialText)}
                                        >
                                            {filial.filialText}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Новая кнопка для массового добавления */}
                        <div
                            className="filter-point"
                            onClick={() => setIsModalMassTrackVisible(true)}
                        >
                            Массовое добавление
                        </div>
                    </div>
                </div>

                {!isBookmarksVisible && (
                    <>
                        <p className='totalCount'>Найдено: {totalUsers}</p>
                        <div className="table-user">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Трек-код</th>
                                        <th>Пользователь</th>
                                        <th>Статус</th>
                                        <th>Дата статуса</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map((track, index) => (
                                        <tr key={index}>
                                            <td>{track.track}</td>
                                            <td>
                                                <p className={`tdUserTrack ${!track.user ? 'user-unknown' : ''}`}>
                                                    {track.user || 'Неизвестно'}
                                                </p>
                                            </td>
                                            <td>{getStatusText(track.history[track.history.length - 1].status)}</td>
                                            <td>{formatDate(track.history[track.history.length - 1].date)}</td>
                                            <td>
                                                <button className='change-track-button' onClick={() => handleChangeBookmark(track.track)}>
                                                    Изменить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="page-point-bar">
                            <div className="page-point" onClick={handlePageChangeMinus}>
                                Предедущая страница
                            </div>
                            <div className="page-point">
                                <label htmlFor="page">Номер страницы: </label>
                                <input type="number" id="page" value={currentPage} onChange={handlePageChange} />
                            </div>
                            <div className="page-point">
                                <label htmlFor="perPage">Кол-во: </label>
                                <input type="number" id="perPage" value={perPage} onChange={handlePerPageChange} />
                            </div>
                            <div className="page-point" onClick={handlePageChangePlus}>
                                Следующая страница
                            </div>
                        </div>
                    </>
                )}

                {/* Вывод закладок без статуса */}
                {isBookmarksVisible && bookmarksWithoutStatus.length > 0 && (
                    <div className="table-user">
                        <div className="tableheader">
                            <h3 className='tabelH3'>
                                Треки прикрепленные пользователями, но не найденные
                            </h3>
                            <button onClick={handleCloseBookmarks} className='cancel-btn'>
                                Закрыть
                            </button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Пользователь</th>
                                    <th>Трек-код</th>
                                    <th>Дата создания</th>
                                    <th>Описание</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookmarksWithoutStatus.map((bookmark, index) => (
                                    <tr key={index}>
                                        <td>
                                            {bookmark.user 
                                                ? `${bookmark.user.name} ${bookmark.user.surname} (${bookmark.user.phone})`
                                                : 'Неизвестно'}
                                        </td>
                                        <td>{bookmark.trackNumber}</td>
                                        <td>{formatDate(bookmark.createdAt)}</td>
                                        <td>{bookmark.description}</td>
                                        <td>
                                            <button className='change-track-button' onClick={() => handleAddBookmark(bookmark.trackNumber)}>
                                                Добавить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalMassTrackVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Массовое добавление треков</h3>
                            <div className="modal-field">
                                <label>Дата: </label>
                                <input
                                    type="date"
                                    value={massDate}
                                    onChange={(e) => setMassDate(e.target.value)}
                                />
                            </div>
                            <div className="modal-field">
                                <label>Статус: </label>
                                <select
                                    value={massStatus}
                                    onChange={(e) => setMassStatus(e.target.value)}
                                >
                                    <option value="">Выберите статус</option>
                                    {statuses.map((status) => (
                                        <option key={status._id} value={status._id}>
                                            {status.statusText}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-field">
                                <h4>Список треков для массового добавления:</h4>
                                {/* Ограничиваем высоту списка и делаем его прокручиваемым */}
                                <div className="tracks-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {tracks.length > 0 ? (
                                        <ul>
                                            {tracks.map((t, index) => (
                                                <li key={index}>{t.track}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Нет треков для добавления</p>
                                    )}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className='sbros-button' onClick={handleMassTrackSubmit}>Загрузить</button>
                                <button className='sbros-button' onClick={() => setIsModalMassTrackVisible(false)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                )}


                {isModalBookmarkVisible && (
                    <NewTrackChange track={trackNumber} onClose={onCloseModal} textComponent={"Добавить трек клиента"} />
                )}
                {isModalTrackVisible && (
                    <NewTrackChange track={trackNumber} onClose={onCloseModalTrack} textComponent={"Изменить статус трека"} />
                )}
            </div>
        </div>
    );
};

export default TrackList;
