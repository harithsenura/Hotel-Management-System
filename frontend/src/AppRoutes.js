import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import FoodPage from './pages/Food/FoodPage'
import CartPage from './pages/Cart/CartPage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import AuthRoute from './components/AuthRoute/AuthRoute'
import PaymentPage from './pages/Payment/PaymentPage'
import ProfilePage from './pages/Profile/ProfilePage'
import OrdersPage from './pages/Orders/OrdersPage'
import Dashboard from './pages/Dashboard/Dashboard'
import HomeDashboard from './pages/EventManagement/DashBoard'
import FoodsAdminPage from './pages/FoodsAdminPage/FoodsAdminPage'
import AdminRoute from './components/AdminRoute/AdminRoute';
import FoodEditPage from './pages/FoodEdit/FoodEditPage'
import AllEvents from './pages/EventManagement/AllEvents'
import AddEvent from './pages/EventManagement/AddEvent'
import AddEventPlanner from './pages/EventManagement/AddEventPlanner'
import AllEventPlanners from './pages/EventManagement/AllEventPlanners'
import EventProfileUpdate from './pages/EventManagement/PlannerProfile'
import UpdatePlanner from './pages/EventManagement/UpdatePlanner'
import UpdateEvent from './pages/EventManagement/UpdateEvent'
import EventDashboard from './pages/EventManagement/EventDashBoard'
import Eventlogin from './pages/EventManagement/login'
import InItems from './pages/InventoryManagement/AddItems'
import InStockManage from './pages/InventoryManagement/StockManage'
import InUpdateItems from './pages/InventoryManagement/UpdateItems'
import InUpdateOrders from './pages/InventoryManagement/UpdateOrders'
import InDashboard from './pages/InventoryManagement/Dashboard'
import InAddOrders from './pages/InventoryManagement/AddOrders'
import Inventorylogin from './pages/InventoryManagement/InventoryLogin'
import FinanceStatement from './pages/FinanceManagement/IncomeTable'
import PettyCash from './pages/FinanceManagement/PettyCashTable'
import FinanceDashboard from './pages/FinanceManagement/Dashboard'
import IncomeForm from './pages/FinanceManagement/IncomeForm'
import FinanceLogin from './pages/FinanceManagement/login'

import SupplyerHeader from './components/Supplyer/SupplyerHeader';
import SupplyerLogin from './components/Supplyer/SupplyerLogin';
import SupplierProfile from "./components/Supplyer/SupplierProfile";
import ManagerProfile from "./components/Supplyer/ManagerProfile";
import AddSupplier from "./components/Supplyer/AddSupplier";
import AddManager from "./components/Supplyer/AddManager";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/food" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/tag/:tag" element={<HomePage />} />
      <Route path="/food/:id" element={<FoodPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Event Management */}
      <Route path="/events" element={<AllEvents />} /> {/* Default route */}
      <Route path="/events/add" element={<AddEvent />} /> {/* Route to add event */}
      <Route path="/eventplanner/add" element={<AddEventPlanner />} /> {/* Add Event Planner */}
      <Route path="/eventplanners" element={<AllEventPlanners />} /> {/* View All Event Planners */}
      <Route path="/planner/:id" element={<UpdatePlanner />} /> {/* Update specific event planner */}
      <Route path="/events/:id" element={<UpdateEvent />} /> {/* Update event profile */}
      <Route path="/" element={<HomeDashboard />} /> {/* Fixed closing tag */}
      <Route path="/eventdashboard" element={<EventDashboard />} />
      <Route path="/eventlogin" element={<Eventlogin />} />

      {/* Inventory Management */}
      <Route path="/inventory/additem" element={<InItems />} />
      <Route path="/inventory/manageitems" element={<InStockManage />} />
      <Route path="/update-items/:id" element={<InUpdateItems />} />
      <Route path="/update-orders/:id" element={<InUpdateOrders />} />
      <Route path="/inventory/addorder" element={<InAddOrders />} />
      <Route path="/inventory/dashobard" element={<InDashboard />} />
      <Route path="/inventorylogin" element={<Inventorylogin />} />

      {/* Finance Management */}
      <Route path="/finance/statement" element={<FinanceStatement />} />
      <Route path="/finance/pettycash" element={<PettyCash />} />
      <Route path="/finance/dashboard" element={<FinanceDashboard />} />
      <Route path="/finance/incomeform" element={<IncomeForm />} />
      <Route path="/finance/login" element={<FinanceLogin />} />


      {/* Supply Management */}
      <Route path="/SuppLogin" element={<SupplyerLogin />} />
      <Route path="/supplies" element={<SupplyerHeader />} />
      <Route path="/SupplierProfile" element={<SupplierProfile />} />
      <Route path="/ManagerProfile" element={<ManagerProfile />} />
      <Route path="/AddSupplier" element={<AddSupplier />} />
      <Route path="/AddManager" element={<AddManager />} />



      <Route
        path="/checkout"
        element={
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <AuthRoute>
            <PaymentPage />
          </AuthRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <AuthRoute>
            <OrdersPage />
          </AuthRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/admin/foods/:searchTerm?"
        element={
          <AdminRoute>
            <FoodsAdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/addFood"
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/editFood/:foodId"
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
    </Routes>
  )
}
