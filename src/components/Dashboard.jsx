import React from 'react'
import { 
  Camera, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3 
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
  const { state } = useApp()
  
  const stats = [
    {
      label: 'Photos Analyzed',
      value: '127',
      change: '+23%',
      icon: Camera,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Claims Processed',
      value: '34',
      change: '+12%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Avg. Processing Time',
      value: '2.3 min',
      change: '-15%',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Damage Detected',
      value: '89%',
      change: '+5%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  const recentAnalyses = [
    {
      id: 1,
      fileName: 'car_damage_001.jpg',
      damageTypes: ['Dent', 'Scratch', 'Paint Damage'],
      confidence: 94,
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      fileName: 'property_water_damage.jpg',
      damageTypes: ['Water Damage', 'Staining'],
      confidence: 87,
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      fileName: 'vehicle_collision.jpg',
      damageTypes: ['Impact Damage', 'Glass Damage'],
      confidence: 92,
      timestamp: '1 day ago',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Analysis Trends</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-accent mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization would appear here</p>
              <p className="text-sm text-gray-500 mt-1">Weekly analysis volume and accuracy trends</p>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="card">
          <h3 className="text-lg font-semibold text-primary mb-4">Recent Analyses</h3>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{analysis.fileName}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.damageTypes.map((type, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{analysis.timestamp}</span>
                    <span className="text-xs font-medium text-green-600">{analysis.confidence}% confident</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard