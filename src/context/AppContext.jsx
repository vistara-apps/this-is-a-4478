import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: 'user_123',
    email: 'demo@insurance.com',
    subscriptionTier: 'pro',
    monthlyQuota: 500,
    usedQuota: 127,
  },
  claims: [],
  photos: [],
  analyzing: false,
  error: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PHOTOS':
      return {
        ...state,
        photos: [...state.photos, ...action.payload],
      }
    case 'SET_ANALYZING':
      return {
        ...state,
        analyzing: action.payload,
      }
    case 'UPDATE_PHOTO_ANALYSIS':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.photoId === action.payload.photoId
            ? { ...photo, ...action.payload.analysis }
            : photo
        ),
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'UPDATE_USER_QUOTA':
      return {
        ...state,
        user: {
          ...state.user,
          usedQuota: state.user.usedQuota + action.payload,
        },
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}