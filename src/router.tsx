import { BrowserRouter, Route, Routes } from "react-router";
import { NotFound } from "./pages/notfound.page";
import { DashboardLayout } from "./layouts/dashboard.layout";
import DashboardPage from "./pages/dashboard.page";
import SelectMethodsPage from "./pages/selectmethods.page";
import CapturePhotoPage from "./pages/capturephoto.page";
import BluetoothPage from "./pages/bluetooth.page";
import DescribeDesignPage from "./pages/describedesign.page";
import ApplyMokupDesignPage from "./pages/applymokupdesgin.page";

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
            path="/select-methods/capture-photo/describe-design/apply-mokup-design"
            element={<ApplyMokupDesignPage />}
          />
          <Route path="/select-methods/bluetooth" element={<BluetoothPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
