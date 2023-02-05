import { CartItem } from '../redux/cart/types'

export const calcTotalPrice = (items: CartItem[]) => {
  return items.reduce((el, obj) => obj.price * obj.count + el, 0)
}
