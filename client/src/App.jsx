import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";
import ThemeToggle from "./components/ThemeToggle";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/statistics" component={Statistics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <SidebarProvider style={sidebarStyle}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1">
                  <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background sticky top-0 z-50 h-14">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger data-testid="button-sidebar-toggle" />
                      <h1 className="text-lg font-semibold hidden sm:block">FlashLearn</h1>
                    </div>
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <Router />
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
