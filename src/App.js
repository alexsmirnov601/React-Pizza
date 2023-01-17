import './scss/app.scss'
import Categories from './components/Categories'
import Header from './components/Header'
import Sort from './components/Sort'
import PizzaBlock from './components/PizzaBlock'
import pizzasItems from './assets/pizza.json'

function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          <div className="content__top">
            <Categories />
            <Sort />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">
            {pizzasItems.map((item) => (
              <PizzaBlock key={item.id} {...item}></PizzaBlock>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
