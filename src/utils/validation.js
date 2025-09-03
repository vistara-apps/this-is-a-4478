/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a password
 * @param {string} password - Password to validate
 * @returns {object} - Object with isValid and errors properties
 */
export function validatePassword(password) {
  const errors = []
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate a claim number
 * @param {string} claimNumber - Claim number to validate
 * @returns {boolean} - True if claim number is valid, false otherwise
 */
export function validateClaimNumber(claimNumber) {
  // Claim number should be in the format INS-12345
  const claimNumberRegex = /^[A-Z]{3}-\d{5}$/
  return claimNumberRegex.test(claimNumber)
}

/**
 * Validate a date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if date is valid, false otherwise
 */
export function validateDate(dateString) {
  if (!dateString) return false
  
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Validate a file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if file type is valid, false otherwise
 */
export function validateFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type)
}

/**
 * Validate a file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} - True if file size is valid, false otherwise
 */
export function validateFileSize(file, maxSize) {
  return file.size <= maxSize
}

/**
 * Validate a form field
 * @param {string} value - Field value
 * @param {object} options - Validation options
 * @returns {object} - Object with isValid and error properties
 */
export function validateField(value, options = {}) {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    validator,
    errorMessage,
  } = options
  
  // Check if field is required
  if (required && (!value || value.trim() === '')) {
    return {
      isValid: false,
      error: errorMessage || 'This field is required',
    }
  }
  
  // Check minimum length
  if (minLength && value && value.length < minLength) {
    return {
      isValid: false,
      error: errorMessage || `Must be at least ${minLength} characters`,
    }
  }
  
  // Check maximum length
  if (maxLength && value && value.length > maxLength) {
    return {
      isValid: false,
      error: errorMessage || `Must be no more than ${maxLength} characters`,
    }
  }
  
  // Check pattern
  if (pattern && value && !pattern.test(value)) {
    return {
      isValid: false,
      error: errorMessage || 'Invalid format',
    }
  }
  
  // Check custom validator
  if (validator && value && !validator(value)) {
    return {
      isValid: false,
      error: errorMessage || 'Invalid value',
    }
  }
  
  return {
    isValid: true,
    error: null,
  }
}

/**
 * Validate a form
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} - Object with isValid and errors properties
 */
export function validateForm(formData, validationRules) {
  const errors = {}
  let isValid = true
  
  // Validate each field
  Object.keys(validationRules).forEach(field => {
    const value = formData[field]
    const rules = validationRules[field]
    const { isValid: fieldIsValid, error } = validateField(value, rules)
    
    if (!fieldIsValid) {
      errors[field] = error
      isValid = false
    }
  })
  
  return {
    isValid,
    errors,
  }
}

