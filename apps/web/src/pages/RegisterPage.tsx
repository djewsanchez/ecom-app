import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function formatError(e: any) {
  if (typeof e?.detail === "string") return e.detail;
  const k = e && typeof e === "object" ? Object.keys(e)[0] : null;
  const v = k ? (e as any)[k] : null;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "Registration failed";
}

export function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      await api.register(email.trim(), password);
      setMsg("Account created. Please log in.");
      setTimeout(() => nav("/login"), 500);
    } catch (e: any) {
      setErr(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container py="xl" size="xs">
      <Title order={2}>Register</Title>

      <TextInput
        mt="md"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        placeholder="you@example.com"
      />
      <PasswordInput
        mt="md"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        placeholder="Min 8 characters"
      />

      <Button
        mt="md"
        fullWidth
        onClick={submit}
        loading={loading}
        disabled={!email || password.length < 8}
      >
        Create account
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
