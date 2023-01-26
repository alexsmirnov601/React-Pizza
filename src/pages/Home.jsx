import React from 'react'
import axios from 'axios'
import qs from 'qs'
import { SearchContext } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice.js'
import { useNavigate } from 'react-router-dom'
import Categories from '../components/Categories'
import Sort, { list } from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../Pagination/Pagination'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isSearch = React.useRef(false)
  const isMounted = React.useRef(false)
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter)

  const onClickCategory = (i) => {
    dispatch(setCategoryId(i))
  }

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number))
  }

  const { searchValue } = React.useContext(SearchContext)
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchPizzas = () => {
    setIsLoading(true)

    const category = categoryId > 0 ? `&category=${categoryId}` : ''
    const search = searchValue ? `&q=${searchValue}` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

    axios
      .get(
        `http://localhost:3001/items?_page=${currentPage}&_limit=4${category}&_sort=${sortBy}&_order=${order}${search}`
      )
      .then((res) => {
        setItems(res.data)
        setIsLoading(false)
      })
  }

  /* Если изменились параметры и был первый рендер,то будет проверка на  добавление параметров в url  */
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      })

      navigate(`?${queryString}`)
    }
    isMounted.current = true
  }, [categoryId, sort.sortProperty, currentPage])

  /* Если был первый рендер, то проверяем URL - параметры и сохраняем в Redux */
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1))

      const sort = list.find((obj) => obj.sortProperty === params.sortProperty)

      dispatch(
        setFilters({
          ...params,
          sort,
        })
      )
      isSearch.current = true
    }
  }, [])

  /* Если был преввый рендер, то запрашиваем пиццы */
  React.useEffect(() => {
    window.scroll(0, 0)

    if (!isSearch.current) {
      fetchPizzas()
    }
    isSearch.current = false
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
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home
