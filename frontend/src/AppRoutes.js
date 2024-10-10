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
import Edashboard from '../src/pages/EventManagement/DashBoard'
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
      <Route path="/events" element={<AllEvents />} /> {/* Default route */}
      <Route path="/events/add" element={<AddEvent />} /> {/* Route to add event */}
      <Route path="/eventplanner/add" element={<AddEventPlanner />} /> {/* Add Event Planner */}
      <Route path="/eventplanners" element={<AllEventPlanners />} /> {/* View All Event Planners */}
      <Route path="/planner/:id" element={<UpdatePlanner />} /> {/* Update specific event planner */}
      <Route path="/events/:id" element={<UpdateEvent />} /> {/* Update event profile */}
      <Route path="/" element={<Edashboard />} /> {/* Fixed closing tag */}

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
