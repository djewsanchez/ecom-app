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
import { useAppDispatch } from "../store/hooks";
import { setToken } from "../store/authSlice";

function formatError(e: any) {
  if (typeof e?.detail === "string") return e.detail;
  return "Login failed";
}

export function LoginPage() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setErr(null);

    try {
      const resp = await api.login(email.trim(), password);
      dispatch(setToken(resp.access));
      nav("/");
    } catch (e: any) {
      setErr(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container py="xl" size="xs">
      <Title order={2}>Login</Title>

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
      />

      <Button
        mt="md"
        fullWidth
        onClick={submit}
        loading={loading}
        disabled={!email || !password}
      >
        Login
      </Button>

      {err && (
        <Alert title="Error" mt="md">
          {err}
        </Alert>
      )}
    </Container>
  );
}
