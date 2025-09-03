/**
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export function handleApiError(error) {
  // Check if error is a response from the API
  if (error.response) {
    const { status, data } = error.response
    
    // Handle different status codes
    switch (status) {
      case 400:
        return data.error?.message || 'Invalid request. Please check your input.'
      case 401:
        return 'Authentication required. Please sign in.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This operation could not be completed due to a conflict.'
      case 422:
        return data.error?.message || 'Validation failed. Please check your input.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
      case 502:
      case 503:
      case 504:
        return 'A server error occurred. Please try again later.'
      default:
        return data.error?.message || 'An unexpected error occurred. Please try again.'
    }
  }
  
  // Handle network errors
  if (error.request) {
    return 'Network error. Please check your internet connection.'
  }
  
  // Handle other errors
  return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Log error to console and optionally to an error tracking service
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
export function logError(error, context = '') {
  console.error(`Error in ${context}:`, error)
  
  // In a real application, you would log the error to an error tracking service
  // like Sentry, LogRocket, etc.
  // Example:
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: { context } })
  // }
}

/**
 * Create a custom error with additional properties
 * @param {string} message - Error message
 * @param {object} properties - Additional properties to add to the error
 * @returns {Error} - Custom error object
 */
export function createError(message, properties = {}) {
  const error = new Error(message)
  
  // Add additional properties to the error
  Object.keys(properties).forEach(key => {
    error[key] = properties[key]
  })
  
  return error
}

/**
 * Handle form validation errors
 * @param {object} errors - Object with field names as keys and error messages as values
 * @returns {string} - User-friendly error message
 */
export function handleFormErrors(errors) {
  // If errors is an object with field names as keys
  if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
    const errorMessages = Object.values(errors).filter(Boolean)
    
    if (errorMessages.length === 0) {
      return 'Please check the form for errors.'
    }
    
    if (errorMessages.length === 1) {
      return errorMessages[0]
    }
    
    return 'Please correct the following errors:\n' + errorMessages.join('\n')
  }
  
  // If errors is an array of error messages
  if (Array.isArray(errors)) {
    if (errors.length === 0) {
      return 'Please check the form for errors.'
    }
    
    if (errors.length === 1) {
      return errors[0]
    }
    
    return 'Please correct the following errors:\n' + errors.join('\n')
  }
  
  // If errors is a string
  if (typeof errors === 'string') {
    return errors
  }
  
  return 'An error occurred. Please try again.'
}

/**
 * Check if an error is a network error
 * @param {Error} error - Error object
 * @returns {boolean} - True if error is a network error, false otherwise
 */
export function isNetworkError(error) {
  return (
    error.message === 'Network Error' ||
    (error.request && !error.response) ||
    error.code === 'ECONNABORTED'
  )
}

/**
 * Check if an error is an authentication error
 * @param {Error} error - Error object
 * @returns {boolean} - True if error is an authentication error, false otherwise
 */
export function isAuthError(error) {
  return (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  )
}

