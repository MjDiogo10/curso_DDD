import EventDispatcher from "../../@shared/event/event-dispatcher";
import Address from "../value-object/address";
import CustomerFactory from "../factory/customer.factory";
import ConsoleLogWhenChangeAddressCustomerHandler from "./handler/console-log-when-change-address-customer.heandler";
import CustomerChangeAddressEvent from "./customer-change-address.event";

describe("CustomerChangeAddressEvent unit tests", () => {
    it("should create a CustomerChangeAddressEvent", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenChangeAddressCustomerHandler();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);
    });

    it("should notify a customer change address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenChangeAddressCustomerHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        const address = new Address("street", 1, "zip", "city");
        const customer = CustomerFactory.createWithAddress("customer", address);
        const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

        eventDispatcher.notify(customerChangeAddressEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });
});