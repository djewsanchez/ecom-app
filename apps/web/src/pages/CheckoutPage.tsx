import { useState } from "react";
import { Alert, Button, Container, Text, Title } from "@mantine/core";
import { api } from "../lib/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from "../store/cartSlice";
import { selectIsLoggedIn } from "../store/authSlice";

export function CheckoutPage() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <Container py="xl">
        <Title order={2}>Checkout</Title>
        <Alert title="Auth required" mt="md">
          Please log in to checkout.
        </Alert>
      </Container>
    );
  }

  const placeOrder = async () => {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.productId,
          quantity: i.quantity,
        })),
      };
      await api.createOrder(payload);
      dispatch(clearCart());
      setMsg("Order placed!");
    } catch (e: any) {
      setErr(e?.detail ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container py="xl">
      <Title order={2}>Checkout</Title>
      <Text mt="sm">Items in cart: {count}</Text>
      <Text mt="xs">Total: ₱ {(total / 100).toFixed(2)}</Text>

      <Button
        mt="md"
        onClick={placeOrder}
        disabled={count === 0}
        loading={loading}
      >
        Place order
      </Button>

      {msg && (
        <Alert title="Success" mt="md">
          {msg}
        </Alert>
      )}
      {err && (
        <Alert title="Error" mt="md">
          {err}
        </Alert>
      )}
    </Container>
  );
}
