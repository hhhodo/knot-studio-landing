import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ClassesPage from "../pages/classes/page";
import OnedayPage from "../pages/oneday/page";
import ShopPage from "../pages/shop/page";
import ProductDetailPage from "../pages/shop/detail/page";
import CartPage from "../pages/cart/page";
import CheckoutPage from "../pages/checkout/page";
import AboutPage from "../pages/about/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/classes",
    element: <ClassesPage />,
  },
  {
    path: "/oneday",
    element: <OnedayPage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/shop/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;