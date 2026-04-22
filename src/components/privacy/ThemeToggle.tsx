import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/LanguageContext";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={t("theme.toggle")}
      className="rounded-full h-10 w-10"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
};
