/**
 * Exercise 1: Basic callback usage
 * Validates cart items and aggregates totals using a Node-style callback.
 * @param {Array} cartItems
 * @param {Function} callback
 * @returns {*}
 */
function summarizeCartItems(cartItems, callback) {
  const ERROR_EMPTY_ARRAY = "cartItems debe ser un array no vacío de objetos";
  const ERROR_INVALID_ITEM = "Los elementos del carrito deben tener la estructura { id: Number, price: Number, quantity: Number }, siendo quantity y price positivos";

  // Validate that cartItems is a non-empty array
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
      callback(ERROR_EMPTY_ARRAY, null);
      return 'done';
  }

  try {
    let totalItems = 0;
    let totalPrice = 0;
    const itemIds = [];

    for (const item of cartItems) {
      // Validate that each item in cartItems has the structure { id: Number, price: Number, quantity: Number } and quantity and price are positive
      if (!item || typeof item !== "object" || typeof item.id !== "number" || typeof item.price !== "number" || typeof item.quantity !== "number" ||
          item.price <= 0 || item.quantity <= 0) {
        throw new Error(ERROR_INVALID_ITEM);
      }

      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
      itemIds.push(item.id);
    }

    itemIds.sort((a, b) => a - b);

    const summary = {
      totalItems,
      totalPrice,
      itemIds
    };

    callback(null, summary); 
    return 'done';
  } catch (error) {
    callback(error.message, null);
    return 'done';
  }  
}

/**
 * Exercise 2: Promise that executes a callback
 * Simulates fetching personalised recommendations while notifying a callback.
 * @param {number} userId
 * @param {Function} callback
 * @returns {Promise<object>}
 */
function fetchUserRecommendations(userId, callback) {
}

/**
 * Exercise 3: Promise with resolve/reject logic
 * Authorises a payment amount with simple business rules.
 * @param {number} amount
 * @returns {Promise<object>}
 */
function authorizeOrderPayment(amount) {
}

/**
 * Exercise 4: Chaining different promises
 * Builds an onboarding payload by chaining multiple asynchronous sources.
 * @param {Function} fetchCustomerProfile
 * @param {Function} fetchSubscription
 * @param {Function} fetchWelcomePack
 * @returns {Promise<object>}
 */
function buildCustomerOnboarding(fetchCustomerProfile, fetchSubscription, fetchWelcomePack) {
}

/**
 * Exercise 5: Async/await workflow
 * Loads e-commerce fulfillment performance data using async/await syntax.
 * @param {Function} fetchMetrics
 * @param {Function} processMetrics
 * @returns {Promise<object>}
 */
async function loadPerformanceReport(fetchMetrics, processMetrics) {
}

/**
 * Exercise 6: Background process management
 * Creates an inventory scheduler that processes restock batches in the background.
 * @param {Function} fetchNextRestock
 * @param {Function} applyRestock
 * @param {number} [intervalMs=250]
 * @returns {{ start: Function, stop: Function, getStatus: Function }}
 */
function createInventoryScheduler(fetchNextRestock, applyRestock, intervalMs = 250) {
}

export {
  summarizeCartItems,
  fetchUserRecommendations,
  authorizeOrderPayment,
  buildCustomerOnboarding,
  loadPerformanceReport,
  createInventoryScheduler
};
