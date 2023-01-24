import React from 'react'
import { SearchContext } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import { setCategoryId } from '../redux/slices/filterSlice.js'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../Pagination/Pagination'

const Home = () => {
  const dispatch = useDispatch()
  const { categoryId, sort } = useSelector((state) => state.filter)

  const onClickCategory = (i) => {
    dispatch(setCategoryId(i))
  }

  const { searchValue } = React.useContext(SearchContext)
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)

  const category = categoryId > 0 ? `&category=${categoryId}` : ''
  const search = searchValue ? `&q=${searchValue}` : ''
  const sortBy = sort.sortProperty.replace('-', '')
  const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

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
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  const skeletons = [...new Array(10)].map((_, i) => <Skeleton key={i} />)
  const pizzas = items.map((item) => <PizzaBlock key={item.id} {...item} />)

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  )
}

export default Home

{
  /* <Sort value={sortType} onClickSort={(obj) => setSortType(obj)} */
}
