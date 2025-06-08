import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/admin.css';
import config from '../../config';

let configUrl = config.apiUrl;

const defaultSchedule = [
  'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'
].map(day => ({
  day,
  from: '09:00',
  to: '18:00',
  isClosed: day === 'Sunday'
}));

const WorkingHoursForm = () => {
  const [schedules, setSchedules] = useState(defaultSchedule);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

    useEffect(() => {
  axios.get(`${configUrl}/api/settings/getSettings`)
    .then(res => {
      const data = res.data;
      if (Array.isArray(data.workingHours)) {
        setSchedules(data.workingHours);
      } else {
        // если поля нет — ставим дефолт
        setSchedules([
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ].map(day => ({
          day,
          from: '09:00',
          to: '18:00',
          isClosed: day === 'Sunday'
        })));
      }
    })
    .catch(err => {
      console.error('Ошибка загрузки графика:', err);
    });
}, []);


  const handleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`${configUrl}/api/settings/working-hours`, {
        workingHours: schedules
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Ошибка при сохранении графика:', err);
      alert('Не удалось сохранить график.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="working-hours-form">
      <h2 className="form-title">График работы</h2>
      {schedules.map((day, index) => (
        <div key={day.day} className="day-row">
          <div className="day-fields">
            <span className="day-name">{day.day}</span>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={day.isClosed}
                onChange={e => handleChange(index, 'isClosed', e.target.checked)}
              />
              Выходной
            </label>
            {!day.isClosed && (
              <>
                <input
                  type="time"
                  value={day.from}
                  onChange={e => handleChange(index, 'from', e.target.value)}
                  className="time-input"
                />
                <span className="separator">–</span>
                <input
                  type="time"
                  value={day.to}
                  onChange={e => handleChange(index, 'to', e.target.value)}
                  className="time-input"
                />
              </>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Сохраняем...' : 'Сохранить график'}
      </button>

      {success && <p className="success-message">Сохранено!</p>}
    </div>
  );
};

export default WorkingHoursForm;
