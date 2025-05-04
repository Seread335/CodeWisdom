import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export function LanguageSwitch() {
  const { theme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState<string>("vi");

  const languages: Language[] = [
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  useEffect(() => {
    // Get stored language or use Vietnamese as default
    const storedLanguage = localStorage.getItem("preferred-language") || "vi";
    setCurrentLanguage(storedLanguage);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem("preferred-language", langCode);
    // In a real application, this would trigger i18n language change
    // i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Thay đổi ngôn ngữ</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLanguage === language.code ? "bg-accent text-accent-foreground" : ""}
          >
            <span className="mr-2">{language.code === "vi" ? "🇻🇳" : "🇺🇸"}</span>
            {language.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
