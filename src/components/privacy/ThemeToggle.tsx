import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="rounded-full h-10 w-10"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
};
