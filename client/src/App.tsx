import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import StudentPage from "./pages/StudentPage";
import ProfessorPage from "./pages/ProfessorPage";
import ProjectorView from "./pages/ProjectorView";

function Router() {
  return (
    <Switch>
      {/* Alunos: rota principal */}
      <Route path={"/"} component={StudentPage} />
      {/* Professor: painel de controle */}
      <Route path={"/professor"} component={ProfessorPage} />
      {/* Projetor: tela cheia para sala de aula */}
      <Route path={"/projector"} component={ProjectorView} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
