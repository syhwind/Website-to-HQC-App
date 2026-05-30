import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";

function AppDetail() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        应用详情页 - Coming Soon
      </div>
    </Layout>
  );
}

function CategoryPage() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        分类页 - Coming Soon
      </div>
    </Layout>
  );
}

function SearchPage() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        搜索页 - Coming Soon
      </div>
    </Layout>
  );
}

function FavoritesPage() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        我的收藏 - Coming Soon
      </div>
    </Layout>
  );
}

function AdminPage() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        管理后台 - Coming Soon
      </div>
    </Layout>
  );
}

function PublishPage() {
  return (
    <Layout>
      <div className="text-center text-xl py-20">
        发布应用 - Coming Soon
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/app/:id" element={<AppDetail />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/publish" element={<PublishPage />} />
      </Routes>
    </Router>
  );
}
