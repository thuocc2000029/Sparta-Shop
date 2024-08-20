const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "Email đã tồn tại." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Mật khẩu dài ít nhất 6 ký tự." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash, phone
            })

            // Save mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken, newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không đúng." })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Vui lòng đăng nhập hoặc đăng ký" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Vui lòng đăng nhập hoặc đăng ký" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getOneUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const user = await Users.find().select('-password')
            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id; // Lấy id của người dùng cần cập nhật
            const userData = req.body; // Lấy thông tin cập nhật từ body của request

            // Thực hiện cập nhật thông tin người dùng trong cơ sở dữ liệu
            const updatedUser = await Users.findByIdAndUpdate(userId, userData, { new: true });

            // Trả về kết quả cập nhật
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id; // Lấy id của người dùng cần xóa

            // Thực hiện xóa người dùng trong cơ sở dữ liệu
            const deletedUser = await Users.findByIdAndDelete(userId);

            // Trả về kết quả cập nhật
            res.status(200).json(deletedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).send({ message: 'Invalid current password' });
            }

            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

            user.password = hashedPassword;

            await user.save();

            res.send({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Server error' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

            user.password = hashedPassword;

            await user.save();

            res.send({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Server error' });
        }
    },

    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id })

            res.json(history)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addKey: async (req, res) => {
        try {
            const user = await Users.updateMany(
                {},
                [
                    { "$set": { "phone": { "$concat": ["$team", " ", "$position"] } } }
                ]
            )
            res.json({
                msg: "Added to collection",
                user: user
            })
        } catch (error) {

        }
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl

