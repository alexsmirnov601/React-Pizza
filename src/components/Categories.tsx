import React from 'react'

type CategoriesProps = {
  value: number
  onClickCategory: (i: number) => void
}

const categories = [
  'Все',
  ' Мясные',
  ' Вегетарианская',
  'Гриль',
  'Острые',
  'Закрытые',
]

const Categories: React.FC<CategoriesProps> = React.memo(
  ({ value, onClickCategory }) => {
    return (
      <div className="categories">
        <ul>
          {categories.map((item, i) => {
            return (
              <li
                key={item}
                className={value === i ? 'active' : ''}
                onClick={() => onClickCategory(i)}
              >
                {item}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
)
export default Categories
