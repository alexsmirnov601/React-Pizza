import React from 'react'
import qs from 'qs'
import { SearchContext } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice.js'
import {
  fetchPizzas,
  selectFilter,
  selectPizzaData,
} from '../redux/slices/pizzasSlice'
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

  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter)

  const { items, status } = useSelector(selectPizzaData)

  const onClickCategory = (i) => {
    dispatch(setCategoryId(i))
  }

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number))
  }

  const getPizzas = async () => {
    const category = categoryId > 0 ? `&category=${categoryId}` : ''
    const search = searchValue ? `&q=${searchValue}` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

    dispatch(
      fetchPizzas({
        order,
        search,
        sortBy,
        category,
        currentPage,
      })
    )

    window.scroll(0, 0)
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
      getPizzas()
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
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>
            К сожалению, не удалось получить пиццы. Попробуйте повторить попытку
            позже
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === 'loading' ? skeletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home
