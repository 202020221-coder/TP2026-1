import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./routing/Navigation";
import { TooltipProvider } from "./shared/components/ui/tooltip";
const queryClient = new QueryClient();

function App() {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </TooltipProvider>
  );
}

export default App;
