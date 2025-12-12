import { BrowserRouter, Route, Routes } from "react-router";
import { NotFound } from "./pages/notfound.page";
import { DashboardLayout } from "./layouts/dashboard.layout";
import DashboardPage from "./pages/dashboard.page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
