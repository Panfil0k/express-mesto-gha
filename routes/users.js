const router = require('express').Router();
const {
  getUsers, getUserId, updateUserInfo, updateUserAvatar, getAuthorizedUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserId);
router.get('/users/me', getAuthorizedUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
