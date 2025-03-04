import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import UserPrivate from "./UserPrivate";
import AdminPrivate from "./AdminPrivate";
import ProductOwnerPrivate from "./ProductOwnerPrivate";
import SignupProductOwner from "../pages/SignupProductOwner";
import AddProduct from "../pages/AddProduct";
import ProductList from "../pages/ProductList";
import UpdateProduct from "../pages/UpdateProduct";
import EditUser from "../pages/EditUser";
import UserProfile from "../pages/UserProfile";
import ProductPage from "../pages/ProductPage";
// For placing an order for a specific product (requires a product id in URL)
import CartPage from "../pages/CartPage";
// For listing all orders (using a parameter if needed)
import OrdersPage from "../pages/OrdersPage";
import PaymentPage from "../pages/PaymentPage";
import ManageOrders from "../pages/ManageOrder";
import EditOwner from "../pages/EditOwner";
import PrivateRoute from "./PrivateRoute";
export let myRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signupproductowner", element: <SignupProductOwner /> },
      { path: "/productlist", element: <ProductList /> },
      {
        path: "/admindashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/userprofile",
        element: (
          <UserPrivate>
            <UserProfile />
          </UserPrivate>
        ),
      },
      {
        // Product details page
        path: "/products/:id",
        element: (
          <PrivateRoute>
            <ProductPage />,
          </PrivateRoute>
        ),
      },
      ,
      {
        path: "/payment/:id",
        element: (
          <UserPrivate>
            <PaymentPage />
          </UserPrivate>
        ),
      },
      {
        // Orders list page (with a parameter, e.g. user id for filtering)
        path: "/orderpage/:id",
        element: (
          <UserPrivate>
            <OrdersPage />
          </UserPrivate>
        ),
      },
      {
        // Cart page for placing an order for a specific product.
        path: "/cartpage/:id",
        element: (
          <UserPrivate>
            <CartPage />
          </UserPrivate>
        ),
      },
      {
        path: "/edituser",
        element: (
          <UserPrivate>
            <EditUser />
          </UserPrivate>
        ),
      },
      {
        path: "/addproduct",
        element: (
          <ProductOwnerPrivate>
            <AddProduct />
          </ProductOwnerPrivate>
        ),
      },
      {
        path: "/updateproduct/:id",
        element: (
          <PrivateRoute>
            <UpdateProduct />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageorders",
        element: (
          <PrivateRoute>
            <ManageOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/editowner/:id",
        element: <EditOwner />,
      },
    ],
  },
]);
