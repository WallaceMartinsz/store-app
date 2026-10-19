import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAdmin from '../auth/RequireAdmin';
import AdminLayout from '../layouts/AdminLayout';
import StoreLayout from '../layouts/StoreLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductCreatePage from '../pages/admin/AdminProductCreatePage';
import AdminProductEditPage from '../pages/admin/AdminProductEditPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminSalesPage from '../pages/admin/AdminSalesPage';
import CartPage from '../pages/cart/CartPage';
import StorefrontPage from '../pages/store/StorefrontPage';
import LegacyEditProductRedirect from './LegacyEditProductRedirect';
import LoginPage from '../pages/login/LoginPage';
import ProfilePage from '../pages/profile/ProfilePage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<StoreLayout />}>
      <Route path="/" element={<StorefrontPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route element={<RequireAdmin />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductCreatePage />} />
        <Route path="products/:id/edit" element={<AdminProductEditPage />} />
        <Route path="sales" element={<AdminSalesPage />} />
      </Route>
    </Route>

    <Route path="/add-product" element={<Navigate to="/admin/products/new" replace />} />
    <Route path="/edit-product/:id" element={<LegacyEditProductRedirect />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
