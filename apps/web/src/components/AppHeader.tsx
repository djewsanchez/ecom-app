import { Button, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, selectIsLoggedIn } from "../store/authSlice";
import { selectCartCount } from "../store/cartSlice";

export function AppHeader() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const cartCount = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();

  return (
    <Group justify="space-between" py="md">
      <Group gap="md">
        <Text fw={700}>ecom-app</Text>
        <Button component={Link} to="/" variant="subtle">
          Products
        </Button>
        <Button component={Link} to="/checkout" variant="subtle">
          Checkout ({cartCount})
        </Button>
        <Button component={Link} to="/orders" variant="subtle">
          My Orders
        </Button>
      </Group>

      <Group gap="sm">
        {!isLoggedIn ? (
          <>
            <Button component={Link} to="/register" variant="light">
              Register
            </Button>
            <Button component={Link} to="/login">
              Login
            </Button>
          </>
        ) : (
          <Button
            color="red"
            variant="light"
            onClick={() => dispatch(logout())}
          >
            Logout
          </Button>
        )}
      </Group>
    </Group>
  );
}
