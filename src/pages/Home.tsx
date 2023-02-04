import React from 'react'
import qs from 'qs'
import { useSelector } from 'react-redux'
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice'
import {
  fetchPizzas,
  SearchPizzaParams,
  selectFilter,
  selectPizzaData,
} from '../redux/slices/pizzasSlice'

import { useAppDispatch } from '../redux/store'
import { useNavigate } from 'react-router-dom'
import Categories from '../components/Categories'
import Sort, { list } from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../Pagination/Pagination'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isSearch = React.useRef(false)
  const isMounted = React.useRef(false)

  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter)

  const { items, status } = useSelector(selectPizzaData)

  const onClickCategory = React.useCallback((i: number) => {
    dispatch(setCategoryId(i))
  }, [])

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const getPizzas = async () => {
    const category = categoryId > 0 ? `&category=${categoryId}` : ''
    const search = searchValue ? `&q=${searchValue}` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        search,
        category,
        currentPage: String(currentPage),
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
      const params = qs.parse(
        window.location.search.substring(1) as unknown as SearchPizzaParams
      )

      const sort = list.find((obj) => obj.sortProperty === params.sortBy)

      // if (sort) {
      //   params.sortBy = sort
      // }

      dispatch(
        setFilters({
          searchValue: String(params.search),
          categoryId: Number(params.cateogory),
          currentPage: Number(params.currentPage),
          sort: sort || list[0],
        })
      )

      /* было так и проверки с if не было */
      // dispatch(
      //   setFilters({
      //     ...params,
      //     sort,
      //   })
      // )

      isSearch.current = true
    }
  }, [])

  /* Если был преввый рендер, то запрашиваем пиццы */
  React.useEffect(() => {
    window.scroll(0, 0)

    if (!isSearch.current) {
      /* нужно обернуть в dipatch? */ getPizzas()
    }
    isSearch.current = false
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  const skeletons = [...new Array(10)].map((_, i) => <Skeleton key={i} />)
  const pizzas = items.map((item: any) => (
    <PizzaBlock key={item.id} {...item} />
  ))

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort value={sort} />
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
