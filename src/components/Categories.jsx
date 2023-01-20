import React from 'react'

const Categories = ({ value, onClickCategory }) => {
  const categories = [
    'Все',
    ' Мясные',
    ' Вегетарианская',
    'Гриль',
    'Острые',
    'Закрытые',
  ]

  return (
    <div className="categories">
      <ul>
        {categories.map((item, index) => {
          return (
            <li
              key={item}
              className={value === index ? 'active' : ''}
              onClick={() => onClickCategory(index)}
            >
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Categories
