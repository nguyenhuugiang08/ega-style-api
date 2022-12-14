const asyncHandle = require("../../middleware/asyncHandle");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const orderController = {
    //[GET] -> /order
    getAllOrders: asyncHandle(async (req, res, next) => {
        try {
            const orders = await Order.find();

            if (orders.length === 0)
                return res.status(200).json({
                    status: "Success",
                    message: "no data",
                });

            return res.status(200).json({
                status: "Success",
                result: orders.length,
                data: { orders },
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[POST] -> /order/create
    createOrder: asyncHandle(async (req, res, next) => {
        try {
            const userId = req.userId;

            const listProducts = [];
            const { products } = req.body;

            for (let product of products) {
                const productOrder = await Product.findOne({ name: product.name });
                const productId = productOrder._id;
                product = { _id: productId, ...product };
                listProducts.push(product);
            }

            const order = new Order({ ...req.body, userId: userId, products: listProducts });
            await order.save();

            res.status(200).json({
                status: "Success",
                data: order,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[PUT] -> /order/change-status/:id
    changeStatusOrder: asyncHandle(async (req, res, next) => {
        try {
            const orderId = req.params.id;
            const newStatus = req.body.status;

            const order = await Order.findOne({ _id: orderId });

            if (!order)
                return res.status(404).json({
                    status: "Failed",
                    message: "This order not found",
                });

            if (
                !["Ch??? x??c nh???n", "Ch??? l???y h??ng", "??ang giao", "???? giao", "???? thanh to??n"].includes(
                    newStatus
                )
            ) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Invalid status",
                });
            }

            await Order.updateOne({ _id: order._id }, { status: newStatus });

            res.status(200).json({
                status: "Success",
                message: "Change order's status successfully!",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /order/:id
    getOrderById: asyncHandle(async (req, res, next) => {
        try {
            const orderId = req.params.id;

            const order = await Order.findOne({ _id: orderId });

            if (!order)
                return res.status(404).json({
                    status: "Failed",
                    message: "This order not found",
                });

            res.status(200).json({
                status: "Success",
                data: order,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: error.message,
            });
        }
    }),
};

module.exports = orderController;
