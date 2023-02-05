import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { calcTotalPrice } from '../../utils/calcTotalPrice'
import { getCartFromLs } from '../../utils/getCartFromLs'
import { CartItem, CartSliceState } from './types'

const initialState: CartSliceState = getCartFromLs()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id)
      if (findItem) {
        findItem.count++
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        })
      }
      state.totalPrice = calcTotalPrice(state.items)
    },

    minusItem(state, action: PayloadAction<number>) {
      const findItem = state.items.find((obj) => obj.id === action.payload)
      if (findItem) {
        findItem.count--
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload)
    },
    clearItem(state) {
      state.items = []
      state.totalPrice = 0
    },
  },
})

export const { addItem, removeItem, clearItem, minusItem } = cartSlice.actions

export default cartSlice.reducer
