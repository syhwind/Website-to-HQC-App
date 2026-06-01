import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import AppDetailPage from "@/pages/AppDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import SearchPage from "@/pages/SearchPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AdminPage from "@/pages/AdminPage";
import PublishAppPage from "@/pages/PublishAppPage";
import ManageAppsPage from "@/pages/ManageAppsPage";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  // 初始化主题
  useTheme();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/app/:id" element={<Layout><AppDetailPage /></Layout>} />
        <Route path="/category/:categoryId" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
        <Route path="/admin/publish" element={<Layout><PublishAppPage /></Layout>} />
        <Route path="/admin/apps" element={<Layout><ManageAppsPage /></Layout>} />
      </Routes>
    </Router>
  );
}
