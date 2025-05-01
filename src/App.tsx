import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import SignInPage from './Pages/SignIn/SignInPage';
import SignUpPage from './Pages/SignUp/SignUpPage';
import MembershipSubscriptionPage from './Pages/MembershipSubscription/MembershipSubscriptionPage';
import Account from './Pages/Account'
import PersonalDetailsPage from './Pages/Account/Details/PersonalDetailsPage';
import MyOrdersPage from './Pages/Account/Orders/MyOrdersPage';
import MyMembershipStatusPage from './Pages/Account/Membership/MyMembershipStatusPage';
import TrolleyPage from './Pages/Trolley/TrolleyPage';
import Products from './Pages/Products';
import ProductListPage from './Pages/Products/ProductListPage';
import ProductDetailPage from './Pages/Products/ProductDetail/ProductDetailPage';
import Admin from './Pages/Admin';
import AdminProducts from './Pages/Admin/Products';
import AdminProductListPage from './Pages/Admin/Products/AdminProductListPage';
import AdminProductDetailPage from './Pages/Admin/Products/ProductDetail/AdminProductDetailPage';
import AdminProductAddPage from './Pages/Admin/Products/New/AdminProductAddPage';
import { getStore } from './Data/GlobalState/Store';
import { Provider } from 'react-redux';
import NotFoundPage from './Pages/NotFoundPage';
import Header from './Components/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const store = getStore();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path='' element={<HomePage />} />
              <Route path='signin' element={<SignInPage />} />
              <Route path='signup' element={<SignUpPage />} />
              <Route path='membershipsubscription' element={<MembershipSubscriptionPage />} />
              <Route path='account' element={<Account />}>
                <Route path='details' element={<PersonalDetailsPage />} />
                <Route path='orders' element={<MyOrdersPage />} />
                <Route path='membership' element={<MyMembershipStatusPage />} />
              </Route>
              <Route path='trolley' element={<TrolleyPage />} />
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
      </Provider>
    </div>
  );
}

export default App;
