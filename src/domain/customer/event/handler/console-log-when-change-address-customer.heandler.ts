import CustomerChangeAddressEvent from "../customer-change-address.event";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class ConsoleLogWhenChangeAddressCustomerHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerChangeAddressEvent): void {
        console.log(`Customer ${event.eventData.id},
                              ${event.eventData.name} changed address to
                              ${event.eventData.Address.street}
                              ${event.eventData.Address.number},
                              ${event.eventData.Address.zip}
                              ${event.eventData.Address.city}`);
    }
}