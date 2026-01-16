'use client'

import { useState } from 'react'

export default function TestButton() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Button clicked!')
    alert('Button works!')
  }
  
  return (
    <div className="min-h-screen p-8 bg-cream-50/30">
      <h1 className="text-3xl font-serif text-warmgray-800 mb-8">Button Test Page</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Test input"
          className="w-full px-4 py-2 border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-warmgray-800 text-white py-3 px-4 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium disabled:opacity-50"
          style={{
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            minHeight: '44px',
            border: '3px solid red' // Make it VERY visible
          }}
        >
          {loading ? 'Processing...' : 'TEST BUTTON'}
        </button>
        
        <p className="text-sm text-warmgray-600 mt-4">
          If you can see the red-bordered button above, buttons work globally. 
          If not, there's a systemic CSS or build issue.
        </p>
      </form>
    </div>
  )
}
