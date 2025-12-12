import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUser } from "./providers/user.provider";
import { useSocket } from "./store/socket.store";
import { Toaster } from "./components/ui/sonner";
import { Router } from "./router";
import { useEffect } from "react";

const client = new QueryClient();

const App = () => {
  const { socket, initSocket } = useSocket();
  const { data } = useUser();

  useEffect(() => {
    if (data) {
      initSocket(data.session.id);
    }
    return () => {
      socket().disconnect();
    };
  }, [data, initSocket, socket]);

  return (
    <QueryClientProvider client={client}>
      <Router />
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
