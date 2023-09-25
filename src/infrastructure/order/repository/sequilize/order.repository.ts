import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

    async find(id: string): Promise<Order> {
      try {
          const orderModel = await OrderModel.findOne({ where: { id }, include: ["items"] });
          return new Order(
              orderModel.id,
              orderModel.customer_id,
              orderModel.items.map((item) => {
                  return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity);
              }));
      } catch (e) {
          throw new Error("Order not found.");
      }
    }

    async findAll(): Promise<Order[]> {
        const orderModels: OrderModel[] = await OrderModel.findAll({include: ["items"]});
        return orderModels.map((orderModel) => {
            return new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map((item) => {
                    return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity);
                }));
        });
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.sequelize.transaction(async (t) => {
            await OrderItemModel.destroy({ where: { order_id: entity.id }, transaction: t });
            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
            await OrderItemModel.bulkCreate(items, {transaction: t});
            await OrderModel.update({ total: entity.total() }, { where: { id: entity.id }, transaction: t });
        });
    }
}
