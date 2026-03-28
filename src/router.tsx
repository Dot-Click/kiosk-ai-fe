import { BrowserRouter, Route, Routes } from "react-router";
import { NotFound } from "./pages/notfound.page";
import { DashboardLayout } from "./layouts/dashboard.layout";
import DashboardPage from "./pages/dashboard.page";
import SelectMethodsPage from "./pages/selectmethods.page";
import CapturePhotoPage from "./pages/capturephoto.page";
import QrScanner from "./pages/qrscaner.page";
import Bluetooth from "./pages/bluetooth.page";
import DescribeDesignPage from "./pages/describedesign.page";
import ApplyMokupDesignPage from "./pages/applymokupdesgin.page";
import Checkout from "./pages/checkout.page";
import CheckoutSuccessPage from "./pages/checkoutSuccess.page";
import CheckoutFailedPage from "./pages/checkoutFailed.page";
import SpeakPrompt from "./pages/speakprompt.page";
import MobileToWebTransfer from "./pages/upload";
import LoginPage from "./pages/login.page";
import AdminDashboardPage from "./pages/admindashboard.page";
import StripeSettingsPage from "./pages/stripeSettings.page";
import AdminSettingsPage from "./pages/adminSettings.page";
import AdminOrdersPage from "./pages/adminOrders.page";
import AdminOrderDetailPage from "./pages/adminOrderDetail.page";
import AdminProductsPage from "./pages/adminProducts.page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/select-methods" element={<SelectMethodsPage />} />
          <Route
            path="/select-methods/capture-photo"
            element={<CapturePhotoPage />}
          />
          <Route
            path="/select-methods/capture-photo/describe-design"
            element={<DescribeDesignPage />}
          />
          <Route
            path="/upload"
            element={<MobileToWebTransfer />}
          /><Route
            path="/select-methods/speak-prompt"
            element={<SpeakPrompt />}
          />
          <Route
            path="/select-methods/capture-photo/describe-design/apply-mokup-design"
            element={<ApplyMokupDesignPage />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/failed" element={<CheckoutFailedPage />} />
          {/* <Route path="/track" element={<TrackPage />} /> */}
          <Route path="/select-methods/qrscanner" element={<QrScanner />} />
          <Route path="/select-methods/bluetooth" element={<Bluetooth />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/stripe-settings" element={<StripeSettingsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
