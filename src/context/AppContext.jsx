import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getClaimStatistics } from '../services/claimService'
import { getPhotoStatistics } from '../services/photoService'

// Create context
const AppContext = createContext()

// Initial state
const initialState = {
  user: {
    usedQuota: 0,
    monthlyQuota: 50,
  },
  stats: {
    claims: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      averageProcessingTime: 0,
    },
    photos: {
      total: 0,
      byCategory: {},
      byDamageType: {},
      averageConfidence: 0,
    },
  },
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    galleryView: 'grid',
    itemsPerPage: 12,
  },
}

// Action types
const ActionTypes = {
  SET_USER_QUOTA: 'SET_USER_QUOTA',
  SET_CLAIM_STATS: 'SET_CLAIM_STATS',
  SET_PHOTO_STATS: 'SET_PHOTO_STATS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  SET_GALLERY_VIEW: 'SET_GALLERY_VIEW',
  SET_ITEMS_PER_PAGE: 'SET_ITEMS_PER_PAGE',
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER_QUOTA:
      return {
        ...state,
        user: {
          ...state.user,
          usedQuota: action.payload.usedQuota,
          monthlyQuota: action.payload.monthlyQuota,
        },
      }
    case ActionTypes.SET_CLAIM_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          claims: action.payload,
        },
      }
    case ActionTypes.SET_PHOTO_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          photos: action.payload,
        },
      }
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed,
        },
      }
    case ActionTypes.SET_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      }
    case ActionTypes.SET_GALLERY_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          galleryView: action.payload,
        },
      }
    case ActionTypes.SET_ITEMS_PER_PAGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          itemsPerPage: action.payload,
        },
      }
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user, profile, isAuthenticated } = useAuth()
  
  // Load user quota from profile
  useEffect(() => {
    if (profile) {
      dispatch({
        type: ActionTypes.SET_USER_QUOTA,
        payload: {
          usedQuota: profile.used_quota || 0,
          monthlyQuota: profile.monthly_quota || 50,
        },
      })
      
      // Load UI preferences from profile
      if (profile.display_settings) {
        if (profile.display_settings.theme) {
          dispatch({
            type: ActionTypes.SET_THEME,
            payload: profile.display_settings.theme,
          })
        }
        
        if (profile.display_settings.gallery_view) {
          dispatch({
            type: ActionTypes.SET_GALLERY_VIEW,
            payload: profile.display_settings.gallery_view,
          })
        }
        
        if (profile.display_settings.items_per_page) {
          dispatch({
            type: ActionTypes.SET_ITEMS_PER_PAGE,
            payload: profile.display_settings.items_per_page,
          })
        }
      }
    }
  }, [profile])
  
  // Load statistics
  useEffect(() => {
    async function loadStats() {
      if (!isAuthenticated || !user?.id) return
      
      try {
        // Load claim statistics
        const { data: claimStats } = await getClaimStatistics(user.id)
        
        if (claimStats) {
          dispatch({
            type: ActionTypes.SET_CLAIM_STATS,
            payload: {
              total: claimStats.totalClaims,
              pending: claimStats.pendingClaims,
              approved: claimStats.approvedClaims,
              rejected: claimStats.rejectedClaims,
              averageProcessingTime: claimStats.averageProcessingTime,
            },
          })
        }
        
        // Load photo statistics
        const { data: photoStats } = await getPhotoStatistics(user.id)
        
        if (photoStats) {
          dispatch({
            type: ActionTypes.SET_PHOTO_STATS,
            payload: {
              total: photoStats.totalPhotos,
              byCategory: photoStats.byObjectCategory,
              byDamageType: photoStats.byDamageType,
              averageConfidence: photoStats.averageConfidence,
            },
          })
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    }
    
    loadStats()
  }, [isAuthenticated, user])
  
  // Actions
  const toggleSidebar = () => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR })
  }
  
  const setTheme = (theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme })
  }
  
  const setGalleryView = (view) => {
    dispatch({ type: ActionTypes.SET_GALLERY_VIEW, payload: view })
  }
  
  const setItemsPerPage = (count) => {
    dispatch({ type: ActionTypes.SET_ITEMS_PER_PAGE, payload: count })
  }
  
  // Context value
  const value = {
    state,
    toggleSidebar,
    setTheme,
    setGalleryView,
    setItemsPerPage,
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

