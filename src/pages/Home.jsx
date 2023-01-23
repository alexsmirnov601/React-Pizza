import React from 'react'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../Pagination/Pagination'
import { SearchContext } from '../App'

const Home = () => {
  const { searchValue } = React.useContext(SearchContext)
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [categoryId, setCategoryID] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(0)

  const [sortType, setSortType] = React.useState({
    name: 'популярности',
    sort: 'rating',
  })

  const category = categoryId > 0 ? `category=${categoryId}` : ''
  const search = searchValue ? `&q=${searchValue}` : ''
  const sortBy = sortType.sort.replace('-', '')
  const order = sortType.sort.includes('-') ? 'asc' : 'desc'

  React.useEffect(() => {
    setIsLoading(true)
    fetch(
      `http://localhost:3001/items?_page=${currentPage}&_limit=4${category}&_sort=${sortBy}&_order=${order}${search}`
    )
      .then((res) => res.json())
      .then((json) => {
        setItems(json)
        setIsLoading(false)
      })
    window.scroll(0, 0)
  }, [categoryId, sortType, searchValue, currentPage])

  const skeletons = [...new Array(10)].map((_, i) => <Skeleton key={i} />)
  const pizzas = items.map((item) => <PizzaBlock key={item.id} {...item} />)

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onClickCategory={(i) => setCategoryID(i)}
        />
        <Sort value={sortType} onClickSort={(obj) => setSortType(obj)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  )
}

export default Home
