const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)

router.patch('/addcart', auth, userCtrl.addCart)

router.get('/history', auth, userCtrl.history)

router.get('/all', userCtrl.getAllUsers)

router.get('/:id', userCtrl.getOneUser)

router.patch('/update/:id', auth, userCtrl.updateUser)

router.delete('/delete/:id', auth, userCtrl.deleteUser)

router.patch('/:id/password', userCtrl.updatePassword)

router.patch('/:id/resetpassword', userCtrl.resetPassword)

router.get('/addkey', userCtrl.addKey)


module.exports = router