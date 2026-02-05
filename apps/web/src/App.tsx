import { Container, Title, Text } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./pages/ProductsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";

export default function App() {
  return (
    <Container py="xl">
      <Title order={1}>E-commerce Microservices</Title>
      <Text c="dimmed">Frontend scaffold is ready.</Text>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
