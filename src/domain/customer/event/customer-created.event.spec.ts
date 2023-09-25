import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import ConsoleLog1WhenCustomerIsCreatedHeandler from "./handler/console-log-1-when-customer-is-created.heandler";
import ConsoleLog2WhenCustomerIsCreatedHeandler from "./handler/console-log-2-when-customer-is-created.heandler";
import Customer from "../entity/customer";

describe("CustomerCreatedEvent unit tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCustomerIsCreatedHeandler();
        const eventHandler2 = new ConsoleLog2WhenCustomerIsCreatedHeandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    });

    it("should notify a created customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCustomerIsCreatedHeandler();
        const eventHandler2 = new ConsoleLog2WhenCustomerIsCreatedHeandler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customer = new Customer("customerId", "customerName");
        const customerCreatedEvent = new CustomerCreatedEvent(customer);

        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1).toHaveBeenCalled()
        expect(spyEventHandler2).toHaveBeenCalled()
    });
});