const router = require('express').Router();
const { userIdCheck, userInfoCheck, userAvatarCheck } = require('../utils/celebrate');
const {
  getUsers, getUserId, updateUserInfo, updateUserAvatar, getAuthorizedUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getAuthorizedUser);

router.get('/users/:userId', userIdCheck, getUserId);

router.patch('/users/me', userInfoCheck, updateUserInfo);

router.patch('/users/me/avatar', userAvatarCheck, updateUserAvatar);

module.exports = router;
