import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import SignInPage from './Pages/SignIn/SignInPage';
import SignUpPage from './Pages/SignUp/SignUpPage';
import MembershipSubscription from './Pages/MembershipSubscription';
import MembershipSubscriptionPage from './Pages/MembershipSubscription/MembershipSubscriptionPage';
import Account from './Pages/Account'
import PersonalDetailsPage from './Pages/Account/Details/PersonalDetailsPage';
import Orders from './Pages/Account/Orders';
import MyOrdersPage from './Pages/Account/Orders/MyOrdersPage';
import MyMembershipStatusPage from './Pages/Account/Membership/MyMembershipStatusPage';
import Trolley from './Pages/Trolley';
import TrolleyPage from './Pages/Trolley/TrolleyPage';
import TrolleyCheckoutSuccessPage from './Pages/Trolley/Checkout/TrolleyCheckoutSuccessPage';
import TrolleyCheckoutCancelPage from './Pages/Trolley/Checkout/TrolleyCheckoutCancelPage';
import Products from './Pages/Products';
import ProductListPage from './Pages/Products/ProductListPage';
import ProductDetailPage from './Pages/Products/ProductDetail/ProductDetailPage';
import Admin from './Pages/Admin';
import AdminProducts from './Pages/Admin/Products';
import AdminProductListPage from './Pages/Admin/Products/AdminProductListPage';
import AdminProductDetailPage from './Pages/Admin/Products/ProductDetail/AdminProductDetailPage';
import AdminProductAddPage from './Pages/Admin/Products/New/AdminProductAddPage';
import { useDispatch } from 'react-redux';
import NotFoundPage from './Pages/NotFoundPage';
import Header from './Components/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { registerTokenAndUserInfo } from './Data/GlobalState/UserSlice';
import OrderPage from './Pages/Account/Orders/OrderDetail/OrderPage';
import MembershipSubscriptionCheckoutSuccessPage from './Pages/MembershipSubscription/Checkout/MembershipSubscriptionCheckoutSuccessPage';
import MembershipSubscriptionCheckoutCancelPage from './Pages/MembershipSubscription/Checkout/MembershipSubscriptionCheckoutCancelPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if(token){
      dispatch(registerTokenAndUserInfo(token));
    }
  }, [dispatch])

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='' element={<HomePage />} />
            <Route path='signin' element={<SignInPage />} />
            <Route path='signup' element={<SignUpPage />} />
            <Route path='membershipsubscription' element={<MembershipSubscription />}>
              <Route index element={<MembershipSubscriptionPage />} />
              <Route path='checkout/success' element={<MembershipSubscriptionCheckoutSuccessPage />} />
              <Route path='checkout/cancel' element={<MembershipSubscriptionCheckoutCancelPage />} />
            </Route>
            <Route path='account' element={<Account />}>
              <Route path='details' element={<PersonalDetailsPage />} />
              <Route path='orders' element={<Orders />}>
                <Route index element={<MyOrdersPage />} />
                <Route path=':orderId' element={<OrderPage />} />
              </Route>
              <Route path='membership' element={<MyMembershipStatusPage />} />
            </Route>
            <Route path='trolley' element={<Trolley />}>
              <Route index element={<TrolleyPage />} />
              <Route path='checkout/success' element={<TrolleyCheckoutSuccessPage />} />
              <Route path='checkout/cancel' element={<TrolleyCheckoutCancelPage />} />
            </Route>
            <Route path='products' element={<Products />}>
              <Route index element={<ProductListPage />} />
              <Route path='categories/:categoryId' element={<ProductListPage />} />
              <Route path=':productId' element={<ProductDetailPage />} />
            </Route>
            <Route path='admin' element={<Admin />}>
              <Route path='products' element={<AdminProducts />}>
                <Route index element={<AdminProductListPage />} />
                <Route path='categories/:categoryId' element={<AdminProductListPage />} />
                <Route path=':productId' element={<AdminProductDetailPage />} />
                <Route path='new' element={<AdminProductAddPage />} />
              </Route>
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer
        position='top-center'
        hideProgressBar
      />
    </div>
  );
}

export default App;
