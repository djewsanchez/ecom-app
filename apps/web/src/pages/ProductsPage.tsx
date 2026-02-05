import { useEffect, useState } from "react";
import { Alert, Card, Container, SimpleGrid, Text, Title } from "@mantine/core";
import { api, type Product } from "../lib/api";

export function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(data);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.detail ?? "Something went wrong");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container py="xl">
      <Title order={2}>Products</Title>

      {loading && <Text>Loading…</Text>}
      {error && <Alert title="Error">{error}</Alert>}

      {!loading && !error && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md">
          {products.map((p) => (
            <Card key={p.id} withBorder>
              <Text fw={600}>{p.name}</Text>
              <Text c="dimmed" size="sm">
                {p.description || "—"}
              </Text>
              <Text mt="sm">₱ {(p.price_cents / 100).toFixed(2)}</Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
