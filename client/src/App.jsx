import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login"
import Cart from "./pages/Cart";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Success } from "./pages/Success";
import { useSelector } from 'react-redux'

const App = () => {
  const user = useSelector(state => state.user.currentUser)
  console.log(user)
  console.log('inside app')
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/products/:category" element={<ProductList/>} />
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/success" element={<Success/>} />
        <Route path="/login" element={user ? <Home/> : <Login/>} /> 
        <Route path="/register" element={!user ? <Home/> : <Register/>} />
        {/* <Route path="/paymentSuccess" element/> */}
      </Routes> 
    </Router>
  )
};

export default App;
