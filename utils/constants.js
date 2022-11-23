const OK_STATUS = 200;
const CREATED_STATUS = 201;

const SERVER_ERROR = 500;

const MESSAGE_SERVER_ERROR = 'На сервере произошла ошибка';
const MESSAGE_REQUEST_ERROR = 'Переданы некорректные данные';
const MESSAGE_NOT_FOUND_ERROR = 'Информация не найдена';
const MESSAGE_UNAUTHORIZED_ERROR = 'Неправильные почта или пароль';
const MESSAGE_AUTHENTICATION_ERROR = 'Необходима авторизация';
const MESSAGE_CONFLICT_REQUEST_ERROR = 'Пользователь с таким email уже зарегистрирован';
const MESSAGE_FORBIDDEN_ERROR = 'Нет прав на удаление карточки';

const REGEX_URL = /(http|https):\/\/([\w.]+\/?)\S*/;

const { secretKey = 'some-secret-key' } = process.env;

module.exports = {
  OK_STATUS,
  CREATED_STATUS,
  SERVER_ERROR,
  MESSAGE_SERVER_ERROR,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
  MESSAGE_UNAUTHORIZED_ERROR,
  MESSAGE_AUTHENTICATION_ERROR,
  MESSAGE_CONFLICT_REQUEST_ERROR,
  MESSAGE_FORBIDDEN_ERROR,
  REGEX_URL,
  secretKey,
};
