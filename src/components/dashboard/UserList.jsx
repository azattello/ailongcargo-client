import React, { useEffect, useState } from "react";
import './css/admin.css';
import search from "../../assets/img/search.png";
import axios from 'axios';
import config from "../../config";
import { getFilials, getFilialByUserPhone  } from "../../action/filial"; // Импортируем getFilials для получения списка филиалов
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sortByDate, setSortByDate] = useState('latest'); // Изначально сортируем по последнему добавленному
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByActivity, setSortByActivity] = useState(false);
  const [showByFilialSort, setShowByFilialSort] = useState(false); // Состояние для отображения выпадающего меню для фильтра по филиалу
  const [filials, setFilials] = useState([]); // Список филиалов
  const [sortByFilial, setSortByFilial] = useState(''); // Новый фильтр по филиалу

  const [totalUsers, setTotalUsers] = useState(0);
  
  const [sortByRole, setSortByRole] = useState('');
  const [showByRoleSort, setShowByRoleSort] = useState(false); // Для управления видимостью всплывающего окна

  // Состояния для модального окна и редактируемого пользователя
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [personalRate, setPersonalRate] = useState('');


  // Состояния для модального окна сброса пароля
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const role = useSelector(state => state.user.currentUser.role);
  const userPhone = useSelector(state => state.user.currentUser.phone);
  
  console.log(role)

  useEffect(() => {
    const fetchFilialData = async () => {
      try {
        const data = await getFilialByUserPhone(userPhone);
        console.log(data.filialText); // Исправлено здесь
        setSortByFilial(data.filialText)

      } catch (error) {
        console.error('Ошибка при загрузке данных о филиале:', error);
      }
    };
  
    if (role === "filial") {
      fetchFilialData();
    }
  }, [userPhone,role]);
  

  useEffect(() => {
    // Загружаем список филиалов при загрузке компонента
    const fetchFilials = async () => {
      const allFilials = await getFilials();
      setFilials(allFilials);
    };
    fetchFilials();
  }, []);

  // Функция для установки нового значения currentPage
  const setPage = (newPage) => {
    setCurrentPage(newPage <= 0 ? 1 : newPage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/user/users`, {
          params: {
            page: currentPage,
            limit: perPage,
            search: searchTerm,
            sortByDate: sortByDate,
            sortByActivity: sortByActivity,
            filterByRole : sortByRole,
            filterByFilial: sortByFilial, // Фильтрация по филиалу
          }
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.totalCount); // Обновление общего количества пользователей
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error.message);
      }
    };

    fetchUsers();
  }, [currentPage, perPage, sortByDate, searchTerm, sortByActivity, sortByRole, sortByFilial]);

  const handleSortByFilial = (filial) => {
    setSortByFilial(filial);
    setShowByFilialSort(false);
    setCurrentPage(1);
  };

  const handlePageChange = (e) => {
    setCurrentPage(parseInt(e.target.value, 10));
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
  };

  const handlePageChangePlus = () => {
    setPage(currentPage + 1);
  };

  const handlePageChangeMinus = () => {
    setPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Обновляем поисковый запрос при изменении текста в поле поиска
    setPage(1);
  };

  const handleSortByDate = (type) => {
    setSortByDate(type);
    setSortByActivity(false);
    setCurrentPage(1); // При изменении типа сортировки сбрасываем страницу на первую
  };

  const handleSortByActivity = () => {
    setSortByActivity(!sortByActivity);
    setSortByDate('');
    setCurrentPage(1);
  };

  const toggleRoleSort = () => {
    setShowByRoleSort(!showByRoleSort);
  };


  const handleSortByRole = (role) => {
    setSortByRole(role);
    setShowByRoleSort(false);
    setCurrentPage(1);
  };




  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(`${config.apiUrl}/api/user/${currentUser._id}/updatePersonalRate`, {
        personalRate,
      });

      
      

      alert('Изменения успешно сохранены');
      setIsModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error.message);
      alert('Ошибка при сохранении изменений');
    }
  };

  // Открытие модального окна для сброса пароля
  const openResetModal = (userId) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setModalError('');
    setModalSuccess('');
    setShowResetModal(true);
  };

  // Закрытие модального окна
  const closeResetModal = () => {
    setShowResetModal(false);
  };

  // Обработка изменения нового пароля
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Функция сброса пароля
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 4 || newPassword.length > 20) {
      setModalError('Пароль должен содержать от 4 до 20 символов');
      return;
    }
    try {
      await axios.put(`${config.apiUrl}/api/user/reset-password/${selectedUserId}`, {
        newPassword
      });
      setModalSuccess('Пароль успешно обновлён');
      // Можно также обновить список пользователей, если требуется
      // Например: перезагрузить список пользователей
      setTimeout(() => {
        closeResetModal();
      }, 1500);
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
      setModalError('Ошибка при сбросе пароля');
    }
  };


  return (
    <div className="users-container">
      <div className="header-bar">
        <div className="search-bar">
          <img src={search} alt="" className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-bar">
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
          <div
            className={`filter-point ${sortByActivity ? 'filter-point-active' : ''}`}
            onClick={handleSortByActivity}
          >
            Сортировка по активности
          </div>


         

          <div className="status-filter">
                <div className="filter-point" onClick={toggleRoleSort}>
                        {sortByRole || 'Роль'} ↓
                    </div>
                    {showByRoleSort && (
                        <div className="statuses-popup">                                   
                        <div className="filter-point-status" onClick={() => handleSortByRole('')}>
                                Все
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('client')}>
                            client
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('filial')}>
                              filial
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('admin')}>
                              admin
                            </div>

                        </div>
                    )}
            </div>

            {role === 'admin' && (
            <>
              <div className="status-filter">
                <div className="filter-point" onClick={() => setShowByFilialSort(!showByFilialSort)}>
                  {sortByFilial || 'По филиалам'} ↓
                </div>
                {showByFilialSort && (
                  <div className="statuses-popup">
                    <div className="filter-point-status" onClick={() => handleSortByFilial('')}>
                      Все филиалы
                    </div>
                    {filials.map(filial => (
                      <div
                        key={filial.filial._id}
                        className="filter-point-status"
                        onClick={() => handleSortByFilial(filial.filial.filialText)}
                      >
                        {filial.filial.filialText}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>


        
      </div>

      <p className='totalCount'>Найдено: {totalUsers}</p>


      <div className="table-user">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Номер</th>
              <th>Филиал</th>
              <th>Дата регистрации</th>
              <th>Пароль</th>
              <th>В пути</th>
              <th>Общее кол-во</th>
              <th>Роль</th>
              <th>Действия</th>

            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.personalId}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.phone}</td>
                <td>{user.selectedFilial}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{user.password}</td>
                <td>{user.bookmarkCount}</td>
                <td>{user.bookmarkCount + user.archiveCount}</td>
                <td>{user.role}</td>
                <td>
                  <button className="sbros-button"  onClick={() => openResetModal(user._id)}>Изменить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

            {/* Модальное окно для редактирования пользователя */}
            {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>Редактирование пользователя</h2>
                <div className="modal-fields">
                  <div className="modal-field">
                    <label>Имя:</label>
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="modal-field">
                    <label>Фамилия:</label>
                    <span>{currentUser.surname}</span>
                  </div>
                  <div className="modal-field">
                    <label>Номер:</label>
                    <span>{currentUser.phone}</span>
                  </div>
                  <div className="modal-field">
                    <label>Личный тариф пользователя:</label>
                    <input
                      type="text"
                      value={personalRate}
                      onChange={(e) => setPersonalRate(e.target.value)}
                    />
                   <p>{currentUser.personalRate ? currentUser.personalRate : ""}</p>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn save-btn" onClick={handleSaveChanges}>
                    Сохранить изменения
                  </button>
                  <button className="btn cancel-btn" onClick={handleCloseModal}>
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}




        <div className="page-point-bar">
          <div className="page-point" onClick={handlePageChangeMinus}>
            Предыдущая страница
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


          {/* Модальное окно для сброса пароля */}
      {showResetModal && (
        <div className="modal-overlay2">
          <div className="modal2">
            <h3>Сброс пароля</h3>
            <input
              type="password"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {modalError && <p className="error2">{modalError}</p>}
            {modalSuccess && <p className="success2">{modalSuccess}</p>}
            <div className="modal-buttons2">
              <button onClick={handleResetPassword}>Сохранить</button>
              <button onClick={closeResetModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
  );
};

export default UserList;
