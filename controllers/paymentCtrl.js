const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')


const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const { cart, paymentID, address } = req.body;

            const { _id, name, email } = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address
            })

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })


            await newPayment.save()
            res.json({ msg: "Payment Succes!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    updateStatus: async (req, res) => {
        const { id, status } = req.body;
        try {
            const order = await Payments.findByIdAndUpdate(id, { status }, { new: true });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },
}

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl
