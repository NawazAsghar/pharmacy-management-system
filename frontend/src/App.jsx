import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import Pharmacist from './PrimeReactPages/Pharmacist'
import Suppliers from './PrimeReactPages/Suppliers'
import MainLayout from './layout/MainLayout'
import Profile from './PrimeReactPages/Profile'
// PRIME REACT IMPORTS 
import Login from './PrimeReactPages/Login'
import Signup from './PrimeReactPages/Signup'
import StockOrder from './PrimeReactPages/OrderStock'
import OrderStockList from './PrimeReactPages/StockOrderList'
import CounterBill from './PrimeReactPages/CounterBill'
import TotalBills from './PrimeReactPages/TotalBills'
import Dashboard from './PrimeReactPages/Dashboard'
import OrderStatusUpdate from './PrimeReactPages/OrderStatusUpdate'
import Inventory from './PrimeReactPages/Inventory'


function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        { path: '/', element: <Profile /> },
        { path: '/login', element: <Login /> },
        { path: '/suppliers', element: <Suppliers /> },
        { path: '/pharmacists', element: <Pharmacist /> },
        { path: '/inventory', element: <Inventory /> },
        { path: '/OrderStockList', element: <OrderStockList /> },
        { path: '/updateStatus/:id', element: <OrderStatusUpdate /> },
        { path: '/signup', element: <Signup /> },
        { path: '/stockOrder', element: <StockOrder /> },
        { path: '/stockOrderList', element: <OrderStockList /> },
        { path: '/counterBill', element: <CounterBill /> },
        { path: '/totalBills', element: <TotalBills /> },
        { path: '/Dashboard', element: <Dashboard /> },
      ]
    }
  ])
  return (
      <RouterProvider router={router}> </RouterProvider>
  )

}

export default App;
