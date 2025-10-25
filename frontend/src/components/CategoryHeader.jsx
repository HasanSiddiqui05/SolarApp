import React from 'react'

const CategoryHeader = ({ items }) => {
  return (
    <div className="flex w-full text-center font-bold border-b">
      {items.map((item, index) => (
        <div key={index} className="flex-1 p-2 border-r last:border-r-0">
          {item}
        </div>
      ))}
    </div>
  )
}

export default CategoryHeader
