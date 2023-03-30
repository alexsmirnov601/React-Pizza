import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { Pizza, SearchPizzaParams } from './types'

// type FetchPizzasArgs = {
//   order: string
//   search: string
//   sortBy: string
//   category: string
//   currentPage: string
// }
/* сокращенная запись, того что выше */
// type FetchPizzasArgs = Record<string, string>

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizzas/fetchPizzasStatus',
  async (params) => {
    const { order, search, sortBy, category, currentPage } = params
    const { data } = await axios.get<Pizza[]>(
      `https://pizza-server-da75.onrender.com/items?_page=${currentPage}&_limit=4${category}&_sort=${sortBy}&_order=${order}${search}`
    )
    return data
  }
)
