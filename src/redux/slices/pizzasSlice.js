import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPizzas = createAsyncThunk(
  'pizzas/fetchPizzasStatus',
  async (params, thunkApi) => {
    const { order, search, sortBy, category, currentPage } = params
    const { data } = await axios.get(
      `http://localhost:3001/items?_page=${currentPage}&_limit=4${category}&_sort=${sortBy}&_order=${order}${search}`
    )
    return data
  }
)

const initialState = {
  items: [],
  status: 'loading', // loading | success | error
}

const pizzasSlice = createSlice({
  name: 'pizzas',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload
    },
  },
  extraReducers: {
    [fetchPizzas.pending]: (state) => {
      state.status = 'loading'
      state.items = []
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload
      state.status = 'success'
    },
    [fetchPizzas.rejected]: (state, action) => {
      state.status = 'error'
      state.items = []
    },
  },
})

export const selectFilter = (state) => state.filter

export const selectPizzaData = (state) => state.pizzas
export const { setItems } = pizzasSlice.actions

export default pizzasSlice.reducer
