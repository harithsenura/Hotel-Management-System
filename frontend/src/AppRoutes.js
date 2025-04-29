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
import Users from './pages/Users/User';
import Eventlogin from './pages/EventManagement/login'

import AdminRoute from './components/AdminRoute/AdminRoute';
import FoodEditPage from './pages/FoodEdit/FoodEditPage'
import AddEvent from './pages/EventManagement/AddEvent'
import AddEventPlanner from './pages/EventManagement/AddEventPlanner'
import AllEventPlanners from './pages/EventManagement/AllEventPlanners'
import EventProfileUpdate from './pages/EventManagement/PlannerProfile'
import UpdatePlanner from './pages/EventManagement/UpdatePlanner'
import UpdateEvent from './pages/EventManagement/UpdateEvent'
import EventDashboard from './pages/EventManagement/EventDashBoard'
import CusLogin from "./components/CustomerManagement/CusLogin";
import AllCustomers from "./components/CustomerManagement/AllCustomers";
import AddCustomer from "./components/CustomerManagement/AddCustomer";
import CustomerProfile from "./components/CustomerManagement/CustomerProfile";
import CheckOutPage from "./components/CustomerManagement/CheckOutPage";
import CheckOutProfile from "./components/CustomerManagement/CheckOutProfile";
import AddRoom from "./components/CustomerManagement/AddRoom";
import RoomList from "./components/CustomerManagement/RoomList";
import AllEvents from './pages/EventManagement/AllEvents'


import AddEmployee from './components/EmployeeManagement/AddEmployee';
import EmployeeProfiles from './components/EmployeeManagement/EmployeeProfile';
import AllEmployees from './components/EmployeeManagement/AllEmployees';
import AddLeaveForm from './components/EmployeeManagement/AddLeaveForm';
import AllLeaves from "./components/EmployeeManagement/AllLeaves";
import EmpLogin from "./components/EmployeeManagement/Login";
import EmpProfile from "./components/EmployeeManagement/EmpProfile";
import EmpApprove from "./components/EmployeeManagement/EmpApprove";
import UpdateEmpProfile from "./components/EmployeeManagement/EmpProfile";
import AdminLogin from "./components/EmployeeManagement/AdminLogin";
import LoginAs from "./components/EmployeeManagement/LoginAs";
import WebHome from './pages/HomePage';
import AdminPannel from './pages/LoginForm';

import BarCartPage from "./components/Bar/CartPage";
import Homepage from "./components/Bar/Homepage";
import ItemsPage from "./components/Bar/ItemsPage";
import BillsPage from "./components/Bar/BillsPage";
import BarLogin from "./components/Bar/BarLogin";
import Bardash from "./components/Bar/CustomerPage"



export default function AppRoutes() {
  return (

    <Routes>
      <Route path="/" element={<WebHome />} />
      <Route path="/adminlogin" element={<AdminPannel />} />
      <Route path="/food" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/tag/:tag" element={<HomePage />} />
      <Route path="/food/:id" element={<FoodPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* Event Management */}
      <Route path="/Eventlogin" element={<Eventlogin />} />
      <Route path="/events" element={<AllEvents />} /> {/* Default route */}
      <Route path="/events/add" element={<AddEvent />} /> {/* Route to add event */}
      <Route path="/eventplanner/add" element={<AddEventPlanner />} /> {/* Add Event Planner */}
      <Route path="/eventplanners" element={<AllEventPlanners />} /> {/* View All Event Planners */}
      <Route path="/planner/:id" element={<UpdatePlanner />} /> {/* Update specific event planner */}
      <Route path="/events/:id" element={<UpdateEvent />} /> {/* Update event profile */}
      <Route path="/adminpannel" element={<HomeDashboard />} /> {/* Fixed closing tag */}
      <Route path="/eventdashboard" element={<EventDashboard />} />

      {/* Customer */}
      <Route path="/customers" element={<AllCustomers />} />
      <Route path="/customers/add" element={<AddCustomer />} />
      <Route path="/customer/:id" element={<CustomerProfile />} />
      <Route path="/checkout" element={<CheckOutPage />} />
      <Route path="/checkout/:id" element={<CheckOutProfile />} />
      <Route path="/cuslogin" element={<CusLogin />} />
      <Route path="/rooms/add" element={<AddRoom />} />
      <Route path="/rooms" element={<RoomList />} />

      {/* Employee */}
      <Route path="/Employee" element={<AllEmployees />} />
      <Route path="/Employee/add" element={<AddEmployee />} />
      <Route path="/employee/:id" element={<EmployeeProfiles />} />
      <Route path="/leaves" element={<AllLeaves />} />
      <Route path="/profile" element={<EmpProfile />} />
      <Route path="/Approve" element={<EmpApprove />} />
      <Route path="/leave/add" element={<AddLeaveForm />} />
      <Route path="/employee/update/:id" element={<UpdateEmpProfile />} />
      <Route path="/LoginChoose" element={<LoginAs />} />
      <Route path="/Admin_Login" element={<AdminLogin />} />
      <Route path="/Emp_Login" element={<EmpLogin />} />

      {/* Bar */}
      <Route path="/home" element={<Homepage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/barcart" element={<BarCartPage />} />
      <Route path="/bills" element={<BillsPage />} />
      <Route path="/barlogin" element={<BarLogin />} />
      <Route path="/bardashboard" element={<Bardash />} />





      <Route
        path="/foodcheckout"
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
        path="/foodprofile"
        element={
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AuthRoute>
            <Users />
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
