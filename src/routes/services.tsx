import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Outlet } = require("@tanstack/react-router");
    return <Outlet />;
  },
});
