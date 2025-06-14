import React, { useEffect, useState, useCallback } from "react";
import './css/admin.css';
import Title from "./title";
import circleStatus from "../../assets/img/circleStatus.png";
import tableList from "../../assets/img/tableList.png";
import scan from "../../assets/img/scan.png";
import { getStatus } from "../../action/status";
import { excelTracks, addTrack, deleteTracks} from "../../action/track";
import loadingPNG from "../../assets/img/loading.png";
import check from "../../assets/img/check.png";
import { useSelector } from "react-redux";
import { fetchFilialByUserPhone } from "../../action/filial";

const AddTrack = () => {
    const [statuses, setStatuses] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState();
    const [track, setTrack] = useState();
    const [date, setDate] = useState();
    const [textareaValue, setTextareaValue] = useState('');
    const [deleteValue, setDeleteValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [statusText, setStatusText] = useState("Выберите статус");
    const [filial, setFilial] = useState();
    const [modalDelete, setModalDelete] = useState(false);
    
    const role = localStorage.getItem('role');


    const resetSuccess = () => {
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
    };

    const phone = useSelector(state => state.user.currentUser.phone);

    const fetchStatuses = async () => {
        try {
            const statusesData = await getStatus();
            setStatuses(statusesData);
            console.log(statusesData);
        } catch (error) {
            console.error('Ошибка при получении статусов:', error);
        }
    };

    const getFilial = useCallback(async () => {
        try {
            const filialData = await fetchFilialByUserPhone(phone);
            setFilial(filialData);
            console.log(filialData);
        } catch (error) {
            console.log(error.message);
        }
    }, [phone]);

    useEffect(() => {
        // Получаем статусы при загрузке компонента
        fetchStatuses();
        getFilial();
    }, [phone, getFilial]);

    const handleStatusClick = (statusId, statusText) => {
        // Добавляем китайский перевод для статусов
        setStatus(statusId);
        setStatusText(statusText);
        setIsPopupOpen(false);
    };
    
    const handleDateChange = (event) => {
        const newDate = event.target.value; // Получаем новое значение из поля ввода
        const formattedDate = new Date(newDate).toISOString().slice(0, 10); // Преобразуем дату и обрезаем до 10 символов
        setDate(formattedDate); // Устанавливаем новое значение в состояние
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

     const handleOpenModalDelete = () => {
        setModalDelete(!modalDelete);
    };

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            setLoading(true);
            
            // Загружаем звуковой файл
            const successSound = new Audio('/sounds/success.mp3');

            try {
                // Проверка на пустой track до вызова replace
                if (!track || !status || !date || !track.trim()) {
                    setLoading(false);
                    return alert('Необходимо заполнить все поля');
                }
    
                const newTrack = track.replace(/\s/g, ''); // Убираем пробелы
    
                // Дополнительная проверка на пустую строку после очистки пробелов
                if (!newTrack) {
                    setLoading(false);
                    return alert('Поле трек не может быть пустым');
                }
    
                await addTrack(newTrack, status, date);
                successSound.play(); // Звук успеха
                setTrack('');
                setSuccess(true); // Устанавливаем флаг успешной загрузки
            } catch (error) {
                console.error('Ошибка при обновлении треков:', error);
                alert(error.response?.data?.message || 'Произошла ошибка при добавлении трека');
            } finally {
                setLoading(false); // Сбрасываем флаг загрузки после завершения запроса
            }
        }
        resetSuccess();
    };
    const handleClick = () => {
        // Вызов функции handleKeyDown напрямую
        handleKeyDown({ key: 'Enter' });
    };
    

    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };
     const handleDeleteChange = (event) => {
        setDeleteValue(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Проверка на пустые значения
        if (!status || !date || !textareaValue.trim()) {
            setLoading(false);
            return alert('Необходимо заполнить все поля');
        }

        const trackList = textareaValue
            .split('\n') // Разбиваем текст на строки
            .filter(track => track.trim() !== '') // Удаляем пустые строки
            .map(track => track.trim()); // Убираем пробелы из начала и конца каждой строки

        console.log(trackList);
        // Отправляем запрос на обновление треков
        try {
            await excelTracks(trackList, status, date);
            console.log('Треки успешно обновлены!');
            setSuccess(true); // Устанавливаем флаг успешной загрузки
        } catch (error) {
            console.error('Ошибка при обновлении треков:', error);
            alert(error.response.data.message); // Выводим сообщение об ошибке
        } finally {
            setLoading(false); // Сбрасываем флаг загрузки после завершения запроса
            setTextareaValue('');
            handleOpenModal();
        }
        resetSuccess();
    };

    const handleSubmitDelete = async () => {
        setLoading(true);
        // Проверка на пустые значения
        if (!deleteValue.trim()) {
            setLoading(false);
            return alert('Необходимо заполнить все поля');
        }

        const trackList = deleteValue
            .split('\n') // Разбиваем текст на строки
            .filter(track => track.trim() !== '') // Удаляем пустые строки
            .map(track => track.trim()); // Убираем пробелы из начала и конца каждой строки

        console.log(trackList);
        // Отправляем запрос на обновление треков
        try {
            await deleteTracks(trackList);
            console.log('Треки успешно Удалены!');
        } catch (error) {
            console.error('Ошибка при обновлении треков:', error);
            alert(error.response.data.message); // Выводим сообщение об ошибке
        } finally {
            setLoading(false); // Сбрасываем флаг загрузки после завершения запроса
            setDeleteValue('');
            handleOpenModal();
        }
    };

    return (
        <div className="mainAdmin">
            <Title text="Добавить трек"/>
            <div className="mainAdmin-container">
                {loading && <div className="loading modal-load"><img src={loadingPNG} alt="" /><p>Загрузка...</p></div>}
                {success && <div className="success modal-load"><img src={check} alt="" /><p>Успешно загружено!!</p></div>}
                <div className="mini-contianer">
                    
                    <div className="status-excel-container">
                        <div className="date-container_mobile">
                            <h3 className="h3-date">Выберите дату</h3>
                            <input 
                                type="date" 
                                className="date-block" 
                                value={date} 
                                onChange={handleDateChange} 
                            />
                        </div>
                        
                        <div className="status-block" onClick={togglePopup}>
                            <p>{statusText}</p>
                            <img src={circleStatus} alt="" />
                        </div>
                        
                        {statuses
                            .filter(status => status.statusText !== "Получено" && role === 'filial')
                            .map(status => (
                                <div key={status._id} className="status-el status-pop" onClick={() => handleStatusClick(status._id, status.statusText)} >
                                    <p>{status.statusText}</p>
                                </div>
                            ))}
                            
                        {role === 'filial' && filial && filial.filialText &&
                            <div key={filial._id} className="status-el status-pop " onClick={() => handleStatusClick(filial._id, filial.filialText)} >
                                <p>{filial.filialText}</p>
                            </div>
                        }
                        <div className="statuses">
                            {statuses
                                .filter(status => status.statusText === "Получено" && role === 'filial')
                                .map(status => (
                                    <div key={status._id} className="status-el status-pop" onClick={() => handleStatusClick(status._id, status.statusText)} >
                                        <p>{status.statusText}</p>
                                    </div>
                                ))}
                            {role !== 'filial' && isPopupOpen && (
                                statuses
                                    .filter(status => status.statusText === "Поступило на склад в Китае" || status.statusText === "Выехало со склада в Китае")
                                    .map(status => (
                                        <div key={status._id} className="status-el status-pop" onClick={() => handleStatusClick(status._id, status.statusText)} >
                                            <p>{status.statusText}</p>
                                        </div>
                                    ))
                            )}
                            {role !== 'filial' && isPopupOpen && (
                                statuses
                                    .filter(status => status.statusText !== "Поступило на склад в Китае" && status.statusText !== "Выехало со склада в Китае")
                                    .map(status => (
                                        <div key={status._id} className="status-el status-pop" onClick={() => handleStatusClick(status._id, status.statusText)} >
                                            <p>{status.statusText}</p>
                                        </div>
                                    ))
                            )}

                        </div>
                        <div className="excel-block" onClick={handleOpenModal}>
                            <p>Массовая загрузка</p>
                            <img src={tableList} alt="" />
                        </div>
                        {modalOpen && (
                            <div className="modalExcel">
                                <div className="modal-header">
                                    <h2>Массовая загрузка</h2>
                                    <div className="close" onClick={handleOpenModal}></div>
                                </div>
                                <textarea value={textareaValue} onChange={handleTextareaChange} name="textarea" id="" cols="30" rows="10" className="textarea"></textarea>
                                <button className="buttonExcel" onClick={handleSubmit}>Загрузить</button>
                            </div>
                        )}

                        {modalDelete && (
                            <div className="modalExcel">
                                <div className="modal-header">
                                    <h2>Массовое удаление</h2>
                                    <div className="close" onClick={handleOpenModalDelete}></div>
                                </div>
                                <textarea value={deleteValue} onChange={handleDeleteChange} name="textarea" id="" cols="30" rows="10" className="textarea"></textarea>
                                <button className="buttonExcel" onClick={handleSubmitDelete}>Удалить</button>
                            </div>
                        )}
                    </div>
                    <div className="date-container">
                        <h3 className="h3-date">Выберите дату</h3>
                        <input 
                            type="date" 
                            className="date-block" 
                            value={date} 
                            onChange={handleDateChange} 
                        />

                    </div>
                </div>    
                <div className="scaner-block">
                    <input 
                        type="text" 
                        className="scaner-input"
                        placeholder="Пробить сканером..."
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        onKeyDown={handleKeyDown} 
                    />
                    <img src={scan} alt="scan" onClick={handleClick} />
                </div>
            </div>
            <div className="deleteButton" onClick={handleOpenModalDelete}>Удаление трековв</div>
        </div>
    );
};

export default AddTrack;
