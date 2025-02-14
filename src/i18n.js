// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  kz: {
    translation: {
      home: {
        title: "Басты бет",
        description: "Бұл біздің веб-сайтымыздың басты беті."
      },
      about: {
        title: "Біз туралы",
        description: "Компаниямыз туралы толығырақ біліңіз."
      },
      contact: {
        title: "Байланыс",
        description: "Бізбен байланысу үшін осы жерді пайдаланыңыз."
      },
      menu: {
        instruction: "Нұсқаулық",
        branches: "Филиалдар",
        warehouseAddress: "Қойманың мекенжайы",
        lostItems: "Жоғалған тауарлар",
        contacts: "Байланыс",
        copy: "Көшіру",
        aboutUs: "Біз туралы",
        prohibitedItems: "Тапсырыс беруге болмайтын тауарлар",
        home: "Басты бет",
        parcels: "Сәлемдемелер",
        profile: "Профиль",
        myParcels: "Менің тауарларым",
        addTrack: "Трек қосу",
        archive: "Мұрағат",
        allParcels: "Барлық сәлемдемелер",
        settings: "Параметрлер",
        currentPassword: "Ағымдағы пароль",
        newPassword: "Жаңа пароль",
        changePassword: "Құпия сөзді өзгерту",
        close: "Жабу",
        dashboard: "Басқару тақтасы",
        logout: "Шығу",
        about: "Сипаттама",
        moreTrack: "Барлық тауарлар",
        passwd: "Құпия сөз"
      }
    }
  },
  ru: {
    translation: {
      home: {
        title: "Главная",
        description: "Это главная страница нашего сайта."
      },
      about: {
        title: "О нас",
        description: "Узнайте больше о нашей компании."
      },
      contact: {
        title: "Контакты",
        description: "Свяжитесь с нами здесь."
      },
      menu: {
        instruction: "Инструкция",
        branches: "Филиалы",
        warehouseAddress: "Адрес склада",
        lostItems: "Потеряшки",
        contacts: "Контакты",
        copy: "Копировать",
        aboutUs: "О нас",
        prohibitedItems: "Товары, которые нельзя заказывать",
        home: "Главная",
        parcels: "Посылки",
        profile: "Профиль",
        myParcels: "Мои посылки",
        addTrack: "Добавить трек",
        archive: "Архив",
        allParcels: "Все посылки",
        settings: "Настройки",
        currentPassword: "Текущий пароль",
        newPassword: "Новый пароль",
        changePassword: "Сменить пароль",
        close: "Закрыть",
        dashboard: "Панель управления",
        logout: "Выйти",
        about: "Описание",
        moreTrack: "Все посылки",
        passwd: "Пароль"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Автоопределение языка пользователя
  .use(initReactI18next) // Инициализация для использования с React
  .init({
    resources,
    fallbackLng: "ru", // Язык по умолчанию
    detection: {
      // Настройка для использования localStorage
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'] // Сохраняем язык в localStorage
    },
    interpolation: {
      escapeValue: false // React уже делает экранирование
    }
  });

export default i18n;
