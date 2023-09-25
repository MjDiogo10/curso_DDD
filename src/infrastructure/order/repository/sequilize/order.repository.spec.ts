import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const costumer = new Customer("costumerId","costumerName");
    costumer.changeAddress(new Address("street", 1, "zip", "city"));
    await new CustomerRepository().create(costumer);

    const product = new Product("productId", "productName", 100);
    await new ProductRepository().create(product);
    const orderItem = new OrderItem("orderItemId", product.name, product.price, product.id, 5);
    const order = new Order("orderId", "costumerId", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find("orderId");

    const product2 = new Product("productId2", "productName", 100);
    await new ProductRepository().create(product2);
    const orderItem2 = new OrderItem("orderItemId2", product2.name, product2.price, product2.id, 5);

    orderResult.addItem(orderItem2);
    await orderRepository.update(orderResult);

    const orderResultUpdate = await orderRepository.find("orderId");
    expect(orderResultUpdate).toStrictEqual(orderResult);
  });

  it("should find a order", async () => {
    const costumer = new Customer("costumerId","costumerName");
    costumer.changeAddress(new Address("street", 1, "zip", "city"));
    await new CustomerRepository().create(costumer);

    const product = new Product("productId", "productName", 100);
    await new ProductRepository().create(product);

    const orderItem = new OrderItem("orderItemId", product.name, product.price, product.id, 5);
    const order = new Order("orderId", "costumerId", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    expect(await orderRepository.find("orderId")).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const costumer = new Customer("costumerId","costumerName");
    costumer.changeAddress(new Address("street", 1, "zip", "city"));
    await new CustomerRepository().create(costumer);

    const orderRepository = new OrderRepository();

    const product1 = new Product("productId1", "productName", 100);
    await new ProductRepository().create(product1);

    const orderItem1 = new OrderItem("orderItemId1", product1.name, product1.price, product1.id, 5);
    const order1 = new Order("orderId1", "costumerId", [orderItem1]);
    await orderRepository.create(order1);

    const product2 = new Product("productId2", "productName", 100);
    await new ProductRepository().create(product2);

    const orderItem2 = new OrderItem("orderItemId2", product2.name, product2.price, product2.id, 5);
    const order2 = new Order("orderId2", "costumerId", [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();
    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});

