import { stubModule } from './stub.js';

// Delivery: Epic → Story → Task from the PM provider; lifecycle stage derived from one
// configurable rule. Read-only vertical slice lands next.
export const deliveryModule = stubModule('delivery');
