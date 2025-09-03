import React from 'react'
import { Tag } from 'lucide-react'

const TagDisplay = ({ tags, variant = 'badge' }) => {
  if (!tags || tags.length === 0) {
    return <span className="text-gray-500 text-sm">No tags detected</span>
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <Tag className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{tag}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default TagDisplay