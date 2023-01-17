import React from 'react'

const Categories = () => {
  const [activeIndex, setActiveIndex] = React.useState(0)

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
              className={activeIndex === index ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
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
