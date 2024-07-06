import { RouterProvider } from "react-router-dom";
import root from "./router/root";
import { AuthProvider } from "./context/AuthContext";
import { startTransition } from "react";
import "boxicons/css/boxicons.min.css";

function App() {
  return (
    <AuthProvider>
      <RouterProvider
        router={root}
        fallbackElement={<div>Loading...</div>}
        onRouteChange={(route) => {
          startTransition(() => {
            return route;
          });
        }}
      />
    </AuthProvider>
  );
}

export default App;
