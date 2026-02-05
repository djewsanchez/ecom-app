import { useEffect, useState } from "react";
import { Alert, Card, Container, Text, Title } from "@mantine/core";
import { api } from "../lib/api";
import { useAppSelector } from "../store/hooks";
import { selectIsLoggedIn } from "../store/authSlice";

type Order = {
  id: number;
  total_cents: number;
  created_at: string;
  items: any[];
};

export function MyOrdersPage() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let mounted = true;
    api
      .getMyOrders()
      .then((data) => {
        if (!mounted) return;
        setOrders(data as any);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setErr(e?.detail ?? "Failed to load orders");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Container py="xl">
        <Title order={2}>My Orders</Title>
        <Alert title="Auth required" mt="md">
          Please log in to view your orders.
        </Alert>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Title order={2}>My Orders</Title>

      {loading && <Text>Loading…</Text>}
      {err && (
        <Alert title="Error" mt="md">
          {err}
        </Alert>
      )}
      {!loading && !err && orders.length === 0 && (
        <Text mt="md">No orders yet.</Text>
      )}

      {!loading &&
        !err &&
        orders.map((o) => (
          <Card key={o.id} withBorder mt="md">
            <Text fw={600}>Order #{o.id}</Text>
            <Text c="dimmed" size="sm">
              {new Date(o.created_at).toLocaleString()}
            </Text>
            <Text mt="sm">Total: ₱ {(o.total_cents / 100).toFixed(2)}</Text>
          </Card>
        ))}
    </Container>
  );
}
