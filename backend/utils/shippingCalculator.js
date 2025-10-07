// Dynamic shipping calculator based on distance and location

// Base shipping rates (in INR)
const SHIPPING_CONFIG = {
    baseRate: 20,           // Base delivery charge
    perKmRate: 5,           // Rate per km
    freeShippingThreshold: 500, // Free shipping above this order value
    maxDistance: 50,        // Maximum delivery distance in km
    
    // City-based flat rates (if exact distance not available)
    cityRates: {
        'mumbai': 30,
        'delhi': 40,
        'bangalore': 35,
        'pune': 30,
        'hyderabad': 35,
        'chennai': 35,
        'kolkata': 40,
        'ahmedabad': 35,
        'jaipur': 40,
        'surat': 30
    },
    
    // State-based rates
    stateRates: {
        'maharashtra': 40,
        'delhi': 40,
        'karnataka': 50,
        'tamil nadu': 50,
        'telangana': 50,
        'west bengal': 60,
        'gujarat': 45,
        'rajasthan': 55,
        'uttar pradesh': 50,
        'madhya pradesh': 55
    },
    
    defaultRate: 60  // Default for unknown locations
};

/**
 * Calculate shipping cost based on location
 * @param {Object} address - User's delivery address
 * @param {Number} orderValue - Total order value
 * @returns {Object} - Shipping details
 */
export const calculateShipping = (address, orderValue) => {
    // Free shipping for orders above threshold
    if (orderValue >= SHIPPING_CONFIG.freeShippingThreshold) {
        return {
            cost: 0,
            message: `Free delivery on orders above ₹${SHIPPING_CONFIG.freeShippingThreshold}`,
            estimatedDays: '30-45 mins'
        };
    }
    
    let shippingCost = SHIPPING_CONFIG.defaultRate;
    let estimatedDays = '45-60 mins';
    
    // Check if address has city
    if (address.city) {
        const city = address.city.toLowerCase().trim();
        if (SHIPPING_CONFIG.cityRates[city]) {
            shippingCost = SHIPPING_CONFIG.cityRates[city];
            estimatedDays = '30-45 mins';
        }
    }
    
    // Check if address has state (fallback)
    if (address.state && shippingCost === SHIPPING_CONFIG.defaultRate) {
        const state = address.state.toLowerCase().trim();
        if (SHIPPING_CONFIG.stateRates[state]) {
            shippingCost = SHIPPING_CONFIG.stateRates[state];
            estimatedDays = '45-60 mins';
        }
    }
    
    // Check if address has zipCode for more specific rates
    if (address.zipCode) {
        const zipPrefix = address.zipCode.substring(0, 3);
        // Mumbai area (400xxx)
        if (zipPrefix === '400') {
            shippingCost = 25;
            estimatedDays = '25-40 mins';
        }
        // Delhi area (110xxx)
        else if (zipPrefix === '110') {
            shippingCost = 30;
            estimatedDays = '30-45 mins';
        }
        // Bangalore area (560xxx)
        else if (zipPrefix === '560') {
            shippingCost = 30;
            estimatedDays = '30-45 mins';
        }
    }
    
    return {
        cost: shippingCost,
        message: `Delivery charge: ₹${shippingCost}`,
        estimatedDays
    };
};

/**
 * Calculate shipping based on distance (if coordinates available)
 * @param {Number} distance - Distance in km
 * @param {Number} orderValue - Total order value
 * @returns {Object} - Shipping details
 */
export const calculateShippingByDistance = (distance, orderValue) => {
    // Free shipping for orders above threshold
    if (orderValue >= SHIPPING_CONFIG.freeShippingThreshold) {
        return {
            cost: 0,
            message: `Free delivery on orders above ₹${SHIPPING_CONFIG.freeShippingThreshold}`,
            estimatedDays: '30-45 mins'
        };
    }
    
    // Check if distance exceeds maximum
    if (distance > SHIPPING_CONFIG.maxDistance) {
        return {
            cost: null,
            message: `Sorry, we don't deliver beyond ${SHIPPING_CONFIG.maxDistance}km`,
            estimatedDays: null,
            error: true
        };
    }
    
    // Calculate cost based on distance
    const shippingCost = SHIPPING_CONFIG.baseRate + (distance * SHIPPING_CONFIG.perKmRate);
    
    // Estimate delivery time based on distance
    let estimatedDays = '30-45 mins';
    if (distance > 20) {
        estimatedDays = '45-60 mins';
    } else if (distance > 10) {
        estimatedDays = '35-50 mins';
    } else if (distance <= 5) {
        estimatedDays = '20-30 mins';
    }
    
    return {
        cost: Math.round(shippingCost),
        message: `Delivery charge: ₹${Math.round(shippingCost)} (${distance.toFixed(1)}km)`,
        estimatedDays,
        distance: distance.toFixed(1)
    };
};

/**
 * Get distance between two coordinates using Haversine formula
 * @param {Number} lat1 - Restaurant latitude
 * @param {Number} lon1 - Restaurant longitude
 * @param {Number} lat2 - Customer latitude
 * @param {Number} lon2 - Customer longitude
 * @returns {Number} - Distance in km
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
};
