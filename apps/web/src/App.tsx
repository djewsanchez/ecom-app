import { Container, Title, Text } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./pages/ProductsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { AppHeader } from "./components/AppHeader";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Container py="xl">
        <AppHeader />

        <Title order={1}>E-commerce Microservices</Title>
        <Text c="dimmed">Frontend scaffold is ready.</Text>

        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
