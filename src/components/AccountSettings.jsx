import React, { useState } from 'react'
import { 
  User, 
  CreditCard, 
  FileText, 
  Settings as SettingsIcon,
  CheckCircle,
  Star
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const AccountSettings = () => {
  const { state } = useApp()
  const [activeSection, setActiveSection] = useState('profile')

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['50 photos/month', 'Basic damage detection', 'Standard support'],
      current: state.user.subscriptionTier === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      features: ['500 photos/month', 'Advanced AI analysis', 'Priority support', 'Data export'],
      current: state.user.subscriptionTier === 'pro',
      popular: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '$199',
      period: '/month',
      features: ['2000+ photos/month', 'Custom integrations', 'Dedicated support', 'API access'],
      current: state.user.subscriptionTier === 'business',
    },
  ]

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'usage', label: 'Usage & Limits', icon: FileText },
    { id: 'settings', label: 'Preferences', icon: SettingsIcon },
  ]

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={state.user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              value={state.user.userId}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
            <input
              type="text"
              value="January 15, 2024"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Subscription Plans</h3>
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
                <h4 className="text-xl font-semibold text-primary">{plan.name}</h4>
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
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Payment Method</h3>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <span className="text-gray-600">•••• •••• •••• 4242</span>
            </div>
            <button className="text-accent hover:underline text-sm">Update</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsageSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Current Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Photos Analyzed</span>
              <span className="text-lg font-bold text-accent">
                {state.user.usedQuota} / {state.user.monthlyQuota}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: `${(state.user.usedQuota / state.user.monthlyQuota) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {state.user.monthlyQuota - state.user.usedQuota} photos remaining this month
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-25 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
              <span className="text-lg font-bold text-green-600">94.2%</span>
            </div>
            <p className="text-xs text-gray-600">Average confidence score across all analyses</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Usage History</h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">December 2024</td>
                <td className="px-4 py-3 text-sm text-gray-900">127 / 500</td>
                <td className="px-4 py-3 text-sm text-green-600">94.2%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">November 2024</td>
                <td className="px-4 py-3 text-sm text-gray-900">456 / 500</td>
                <td className="px-4 py-3 text-sm text-green-600">92.8%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">October 2024</td>
                <td className="px-4 py-3 text-sm text-gray-900">389 / 500</td>
                <td className="px-4 py-3 text-sm text-green-600">91.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Analysis Complete</p>
              <p className="text-xs text-gray-500">Get notified when photo analysis is finished</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Monthly Usage Reports</p>
              <p className="text-xs text-gray-500">Receive monthly summaries of your usage</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Feature Updates</p>
              <p className="text-xs text-gray-500">Stay informed about new features and improvements</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <button className="btn-secondary w-full sm:w-auto">Download My Data</button>
          <button className="btn-secondary w-full sm:w-auto">Delete Account</button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'billing':
        return renderBillingSection()
      case 'usage':
        return renderUsageSection()
      case 'settings':
        return renderSettingsSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary">Account Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account preferences and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-accent text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings