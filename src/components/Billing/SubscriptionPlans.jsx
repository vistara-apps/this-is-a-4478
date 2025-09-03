import React from 'react'
import { CheckCircle, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { createCheckoutSession } from '../../services/stripeService'
import { initStripe } from '../../services/stripeService'
import LoadingSpinner from '../common/LoadingSpinner'

const SubscriptionPlans = () => {
  const { profile, isDemoUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState(null)
  
  const subscriptionPlans = [
    {
      id: 'free',
      priceId: 'price_free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['50 photos/month', 'Basic damage detection', 'Standard support'],
      current: profile?.subscription_tier === 'free',
    },
    {
      id: 'pro',
      priceId: 'price_pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      features: ['500 photos/month', 'Advanced AI analysis', 'Priority support', 'Data export'],
      current: profile?.subscription_tier === 'pro',
      popular: true,
    },
    {
      id: 'business',
      priceId: 'price_business',
      name: 'Business',
      price: '$199',
      period: '/month',
      features: ['2000+ photos/month', 'Custom integrations', 'Dedicated support', 'API access'],
      current: profile?.subscription_tier === 'business',
    },
  ]
  
  const handleSubscribe = async (plan) => {
    if (isDemoUser) {
      showError('Subscription changes are not available in demo mode')
      return
    }
    
    try {
      setLoading(true)
      setSelectedPlan(plan.id)
      
      const stripe = initStripe()
      
      if (!stripe) {
        throw new Error('Stripe is not initialized')
      }
      
      const { data, error } = await createCheckoutSession(
        profile.id,
        plan.priceId,
        `${window.location.origin}/account?success=true`,
        `${window.location.origin}/account?canceled=true`
      )
      
      if (error) throw error
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data?.sessionId) {
        // Use Stripe.js to redirect
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Subscription error:', err)
      showError('Failed to process subscription. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Subscription Plans</h2>
        <p className="text-gray-600 mt-1">Choose the plan that works best for you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 border rounded-lg ${
              plan.current
                ? 'border-accent bg-accent/5'
                : 'border-gray-200 hover:border-accent/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Most Popular</span>
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-primary">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-primary">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={plan.current || loading || isDemoUser}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                plan.current
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : loading && selectedPlan === plan.id
                  ? 'bg-accent/80 text-white cursor-wait'
                  : 'btn-primary'
              }`}
            >
              {loading && selectedPlan === plan.id ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Processing...</span>
                </div>
              ) : plan.current ? (
                'Current Plan'
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
        ))}
      </div>
      
      {isDemoUser && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p>
            <strong>Note:</strong> Subscription changes are not available in demo mode. In a real
            implementation, clicking Subscribe would redirect you to Stripe Checkout.
          </p>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPlans

