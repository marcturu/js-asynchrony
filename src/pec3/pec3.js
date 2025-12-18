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
      // Validate that each item in cartItems has the structure { id: Number, price: Number, quantity: Number } and quantity and price are positive NUMBERS
      if (!item || typeof item !== "object" || typeof item.id !== "number" || typeof item.price !== "number" || typeof item.quantity !== "number" ||
          item.price <= 0 || item.quantity <= 0) {
        throw new Error(ERROR_INVALID_ITEM);
      }

      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
      itemIds.push(item.id);
    }

    // Sort itemIds numerically in ascending order
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
  return new Promise((resolve, reject) => {
    // Validate that userId is a positive INTEGER. If not, notify the callback and reject the promise 
    if (!Number.isInteger(userId) || userId <= 0) {
      const error = new Error("Invalid user id");
      callback(error, null);
      reject(error);
      return;
    }

    // Simulate a 200ms delay
    setTimeout(() => {
      const payload = {
        userId,
        recommendations: [
          `Top pick for user ${userId}`,
          'Trending in your area',
          'Customers too enjoyed'
        ]
      }

      // Before resolving the promise, notify the callback with the object payload
      callback(null, payload);
      resolve(payload);
    }, 200)
  });
}

/**
 * Exercise 3: Promise with resolve/reject logic
 * Authorises a payment amount with simple business rules.
 * @param {number} amount
 * @returns {Promise<object>}
 */
function authorizeOrderPayment(amount) {
  return new Promise((resolve, reject) => {
    // Validate that amount is a positive NUMBER. If not, reject the promise
    if (typeof amount !== "number" || amount <= 0) {
      reject(new Error("Invalid order amount"));
      return;
    }

    // Validate that amount is not greater than 2500. If yes, reject the promise
    if (amount > 2500) {
      reject(new Error("Order total too high"));
      return;
    }

    resolve ({
      status: "approved", 
      amount
    });
  });
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
  return fetchCustomerProfile()
    .then((customer) => {
      // Fetch the subscription for the customer
      return fetchSubscription(customer.id)
        .then((subscription) => {
          // Use the customer and subscription objects to fetch the welcome pack
          return fetchWelcomePack({customer, subscription});
        });
    })
    // If any of the promises in the chain fails, throw an error
    .catch((error) => {
      throw new Error(`Onboarding failed: ${error.message}`);
    });
}

/**
 * Exercise 5: Async/await workflow
 * Loads e-commerce fulfillment performance data using async/await syntax.
 * @param {Function} fetchMetrics
 * @param {Function} processMetrics
 * @returns {Promise<object>}
 */
async function loadPerformanceReport(fetchMetrics, processMetrics) {
  try {
    const { warehouse, stats } = await fetchMetrics();

    // Validate that stats is an array of at least 2 numbers. If not, throw an error
    if (!Array.isArray(stats) || stats.length < 2 || !stats.every((stat) => typeof stat === "number")) {
      throw new Error("Stats must be an arry of at least 2 numbers");
    }

    const { average } = await processMetrics(stats);
    
    return { warehouse, stats, average };
  } catch(error) {
    throw new Error(`Failed to load performance report: ${error.message}`);
  }
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
  let statusRegistry = [];
  let intervalId = null;
  let isRunning = false;

  const processRestock = async () => {
    if (!isRunning) return; // If the scheduler is not running, do nothing
    
    try {
      // Fetch the next restock batch and, if it is null, stop the scheduler
      const restock = await fetchNextRestock();
      if (restock === null) {
        stop();
        return;
      }

      // Apply all restock updates in parallel and update statusRegistry
      await Promise.all(
        restock.map(async (update) => {
          try {
            const result = await applyRestock(update);
            statusRegistry.push({
              sku: update.sku,
              status: 'completed',
              result,
              error: null
            });
          } catch (error) {
            statusRegistry.push({
              sku: update.sku,
              status: 'failed',
              result: null,
              error: error.message
            });
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Start the scheduler if it is not already running
  const start = () => {
    if (isRunning) return;
    isRunning = true;
    processRestock();
    intervalId = setInterval(processRestock, intervalMs);
  }

  // Stop the scheduler and clear the interval
  const stop = () => {
    isRunning = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  const getStatus = () => [...statusRegistry];
  
  return { start, stop, getStatus };
}


export {
  summarizeCartItems,
  fetchUserRecommendations,
  authorizeOrderPayment,
  buildCustomerOnboarding,
  loadPerformanceReport,
  createInventoryScheduler
};
