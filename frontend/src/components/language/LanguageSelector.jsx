import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "ENGLISH" },
  { code: "hi", label: "HINDI" },
  { code: "as", label: "ASSAMESE" },
  { code: "bn", label: "BENGALI" },
  { code: "brx", label: "BODO" },
  { code: "dgo", label: "DOGRI" },
  { code: "gu", label: "GUJARATI" },
  { code: "kn", label: "KANNADA" },
  { code: "kok", label: "KONKANI" },
  { code: "mai", label: "MAITHILI" },
  { code: "ml", label: "MALAYALAM" },
  { code: "mni", label: "MANIPURI" },
  { code: "mr", label: "MARATHI" },
  { code: "ne", label: "NEPALI" },
  { code: "or", label: "ORIYA" },
  { code: "pa", label: "PUNJABI" },
  { code: "sa", label: "SANSKRIT" },
  { code: "sd", label: "SINDHI" },
  { code: "si", label: "SINHALA" },
  { code: "ta", label: "TAMIL" },
  { code: "te", label: "TELUGU" }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || i18n.language || "en");

  // Ensure language persists on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      console.log("Applying stored language:", savedLang);
      i18n.changeLanguage(savedLang).then(() => {
        setCurrentLang(savedLang);
      });
    }
  }, []);

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng); // Ensure language is fully applied
    localStorage.setItem("language", lng); // Store it for persistence
    setCurrentLang(lng);
    console.log("Language changed to:", lng);
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        className="flex items-center gap-2 p-2 border rounded-lg bg-white shadow-md hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <Globe size={20} />
        {languages.find((lang) => lang.code === currentLang)?.label || "EN"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-20 bg-white border rounded-lg shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="block w-full px-4 py-2 text-left hover:bg-gray-200"
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
