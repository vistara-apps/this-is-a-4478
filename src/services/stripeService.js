import { loadStripe } from '@stripe/stripe-js'
import { isDemoMode } from './supabaseClient'
import { logError } from '../utils/errorHandler'

// Initialize Stripe
let stripePromise

/**
 * Initialize Stripe
 * @returns {object} - Stripe instance
 */
export function initStripe() {
  if (!stripePromise) {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (stripeKey) {
      stripePromise = loadStripe(stripeKey)
    }
  }
  return stripePromise
}

/**
 * Create a checkout session
 * @param {string} userId - User ID
 * @param {string} priceId - Price ID
 * @param {string} successUrl - Success URL
 * @param {string} cancelUrl - Cancel URL
 * @returns {Promise<object>} - Checkout session
 */
export async function createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock session
      return {
        data: {
          sessionId: 'demo_session_id',
          url: 'https://checkout.stripe.com/demo',
        },
        error: null,
      }
    }
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
        successUrl,
        cancelUrl,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create checkout session')
    }
    
    const data = await response.json()
    
    return { data, error: null }
  } catch (error) {
    logError(error, 'createCheckoutSession')
    return { data: null, error }
  }
}

/**
 * Get current subscription
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Subscription
 */
export async function getCurrentSubscription(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock subscription
      return {
        data: {
          id: 'sub_123',
          status: 'active',
          plan: {
            id: 'price_pro',
            name: 'Pro',
            amount: 4900,
            interval: 'month',
          },
          current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          cancel_at_period_end: false,
        },
        error: null,
      }
    }
    
    const response = await fetch(`/api/subscriptions/${userId}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get subscription')
    }
    
    const data = await response.json()
    
    return { data, error: null }
  } catch (error) {
    logError(error, 'getCurrentSubscription')
    return { data: null, error }
  }
}

/**
 * Cancel subscription
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Cancel result
 */
export async function cancelSubscription(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return success
      return {
        data: {
          success: true,
          message: 'Subscription will be canceled at the end of the billing period',
        },
        error: null,
      }
    }
    
    const response = await fetch(`/api/subscriptions/${userId}/cancel`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to cancel subscription')
    }
    
    const data = await response.json()
    
    return { data, error: null }
  } catch (error) {
    logError(error, 'cancelSubscription')
    return { data: null, error }
  }
}

/**
 * Get billing history
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Billing history
 */
export async function getBillingHistory(userId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return mock invoices
      return {
        data: [
          {
            id: 'in_123',
            amount: 4900,
            status: 'paid',
            created: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 30 days ago
            period_start: Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60, // 60 days ago
            period_end: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 30 days ago
            plan: 'Pro',
          },
          {
            id: 'in_124',
            amount: 4900,
            status: 'paid',
            created: Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60, // 60 days ago
            period_start: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60, // 90 days ago
            period_end: Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60, // 60 days ago
            plan: 'Pro',
          },
        ],
        error: null,
      }
    }
    
    const response = await fetch(`/api/subscriptions/${userId}/billing-history`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get billing history')
    }
    
    const data = await response.json()
    
    return { data, error: null }
  } catch (error) {
    logError(error, 'getBillingHistory')
    return { data: null, error }
  }
}

/**
 * Update payment method
 * @param {string} userId - User ID
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<object>} - Update result
 */
export async function updatePaymentMethod(userId, paymentMethodId) {
  try {
    if (isDemoMode()) {
      // In demo mode, return success
      return {
        data: {
          success: true,
          message: 'Payment method updated successfully',
        },
        error: null,
      }
    }
    
    const response = await fetch(`/api/subscriptions/${userId}/payment-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update payment method')
    }
    
    const data = await response.json()
    
    return { data, error: null }
  } catch (error) {
    logError(error, 'updatePaymentMethod')
    return { data: null, error }
  }
}

