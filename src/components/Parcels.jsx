import React, {useEffect, useState} from "react";
import './styles/parcels.css';
import {Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addBookmark } from "../action/bookmark";
import config from "../config";


import Tab from './Tab'

import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';


import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';
import Parcels2 from "./Parcels2";
import ArchiveParcels from "./ArchiveParcels"
import { useTranslation } from "react-i18next";
import '../i18n';


// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

const Parcels = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const [moreText, setMoreText] = useState('');
    const [trackText, setTrackText] = useState('');
    const [showArchive, setShowArchive] = useState(false); // Состояние для отображения архива

    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const userId = useSelector(state => state.user.currentUser.id);
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
      };
   
    

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
      }



    
    const handleAddBookmark = async () => {
        try {
            await addBookmark(userId, moreText, trackText);
            setMoreText('')
            setTrackText('')
        } catch (error) {
            console.error('Ошибка:', error.message);
        } finally {
            handleOpenModal()
        }
    };

    

    // Переключение между компонентами
    const toggleArchive = () => {
        setShowArchive(!showArchive);
    };

    const [userData, setUserData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Функция для получения данных профиля пользователя
        const fetchUserProfile = async () => {
            try {
                // Отправляем GET запрос на сервер для получения данных профиля
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Передаем токен в заголовке запроса
                    }
                });

                // Проверяем, успешно ли выполнен запрос
                if (response.ok) {
                    // Если запрос успешен, получаем данные профиля из ответа
                    const data = await response.json();
                    setUserData(data.user); // Сохраняем данные профиля в состоянии
                } else {
                    // Если произошла ошибка, выводим сообщение об ошибке
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                // Если произошла ошибка при выполнении запроса, выводим сообщение об ошибке
                console.error('Error fetching user profile:', error.message);
            }
        };

        // Вызываем функцию для получения данных профиля пользователя
        fetchUserProfile();
    }, []); // Запрос будет выполнен только при первом рендере компонента

    return (
      
        <div className="main__parcels">
                
                <header className="header">
                    <div className='LogoHeader'>
                        <div className="title2">
                            {showArchive ? 'Архив' : t('menu.myParcels')}
                        </div>

                        <div className="lang">
                            <button onClick={() => changeLanguage('kz')}>KZ</button>
                            <button onClick={() => changeLanguage('ru')}>RU</button>
                        </div>
                    </div>

                    <ul className="Menu">
                    <Link to="/main" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                        <p style={location.pathname === '/main' ? { color: '#1F800C' } : { color: '#808080' }}>{t('home.title')}</p>
                    </Link>

                    <Link to="/parcels" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box} alt="" />
                        <p style={location.pathname === '/parcels' ? { color: '#1F800C' } : { color: '#808080' }}>{t('menu.parcels')}</p>
                    </Link>

                    <Link to="/profile" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user} alt="" />
                        <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' }}>Профиль</p>
                    </Link>

                    {userData && (userData.role === 'admin' || userData.role === 'filial') && (
                        <Link to="/dashboard" className="tabbutton-menu">{t('menu.dashboard')}</Link>
                    )}
                </ul>



            </header>
                
                <div className="parcels">
                <div>
                   
                </div>
              
                        <div className="statuses-client">
                        
                        <div className="button__container">
                            <div className="add__track" onClick={handleOpenModal}>{t('menu.addTrack')}</div>
                            <div className="add__track open__archive" onClick={toggleArchive}>
                                {showArchive ? t('menu.moreTrack') : 'Архив'}
                            </div>
                        </div>

                       {/* Отображаем либо Parcels2, либо ArchiveParcels в зависимости от состояния */}
                        {showArchive ? <ArchiveParcels /> : <Parcels2 />}

                        </div>

                        {modalOpen && (
                            <div className="modalAdd">
                                <div className="modalAdd-header">
                                    <h2>{t('menu.addTrack')}</h2>
                                    <div className="close" onClick={handleOpenModal}></div>
                                </div>
                                <label className="labelTrack" htmlFor="">{t('menu.about')}</label>
                                <input
                                    type="text"
                                    value={moreText}
                                    onChange={(e) => setMoreText(e.target.value)}
                                    placeholder="Введите описание трека"
                                    className="input-trackAdd"
                                />
                                <label className="labelTrack"  htmlFor="">Трек номер посылки</label>
                                <input
                                    type="text"
                                    value={trackText}
                                    onChange={(e) => setTrackText(e.target.value)}
                                    placeholder="Введите Трек номер"
                                    className="input-trackAdd"
                                />
                                <div className="button__addTrack" onClick={handleAddBookmark}>{t('menu.addTrack')}</div>
                            </div>
                             )}
                             {modalOpen &&  (
                                <div className="overflow"></div>
                            )}
                       
                        
                    
                    <div className="area"></div>

                    
                    
                   
                </div>
            <Tab/>
        </div>

    )
}

export default Parcels;