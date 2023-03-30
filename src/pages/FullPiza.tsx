import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'

const FullPiza: React.FC = () => {
  const [pizza, setPizza] = React.useState<{
    imageUrl: string
    title: string
    price: number
  }>()
  const { id } = useParams()
  const navigate = useNavigate()

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          'https://pizza-server-da75.onrender.com/items' + id
        )
        setPizza(data)
      } catch (error) {
        alert('Ошибка при получении пиццы')
        navigate('/')
      }
    }
    fetchPizza()
  }, [])

  if (!pizza) {
    return <>Загрузка...</>
  }

  return (
    <div className="container">
      <img src={pizza.imageUrl} alt="pizza" />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price}</h4>
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  )
}

export default FullPiza
