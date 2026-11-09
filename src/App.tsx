import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Folder,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Search,
  Bookmark,
  X,
  FolderPlus,
  Clock,
  CheckSquare,
  BarChart2,
  LayoutDashboard,
  Zap,
  CheckSquare as CheckSquareIcon,
  Square,
  ExternalLink as LaunchAllIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontal,
  Palette,
  Type,
  Minus,
  Maximize2,
} from "lucide-react";

import CyberpunkIntro from "./CyberpunkIntro";
import KanbanBoard from "./KanbanBoard";
import DynamicBackground from "./DynamicBackground";
import InteractiveEffects from "./InteractiveEffects";
import { open } from '@tauri-apps/plugin-shell';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";


interface QuickLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  badge: string;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

type ThemeType =
  | "minimal"
  | "neon"
  | "matrix"
  | "synthwave"
  | "amber"
  | "acid"
  | "upside-down"
  | "arcade-pixel"
  | "solar-eclipse";
type FontType = "default" | "monospace" | "sans" | "serif";
type Language = "es" | "en";

const translations = {
  es: {
    language: "Idioma",
    searchPlaceholder: "Buscar accesos o notas rápidas...",
    themes: "Diseños",
    quickLinks: "Accesos Rápidos",
    kanban: "Tablero Kanban",
    dashboard: "Dashboard",
    morning: "Buenos días",
    afternoon: "Buenas tardes",
    evening: "Buenas noches",
    shortcutsSubtitle: "Gestión inteligente de enlaces y grupos directos.",
    kanbanSubtitle: "Planificación modular y flujo de proyectos activo.",
    dashboardSubtitle: "Métricas de productividad y control de objetivos.",
    themeLabel: "Tema",
    groupsTitle: "Mis Grupos y Carpetas",
    bulkDeletePrompt: "Selecciona las carpetas que deseas eliminar en masa.",
    groupsSummary: (links: number, categories: number) =>
      `Total: ${links} accesos guardados en ${categories} carpetas.`,
    deleteSelected: (count: number) => `Eliminar seleccionadas (${count})`,
    cancel: "Cancelar",
    selectMultiple: "Seleccionar / Borrar Múltiples",
    addLink: "+ Añadir Enlace",
    newCategoryPlaceholder: "Nombre de la nueva categoría...",
    create: "Crear",
    apps: "APPS",
    emptyFolder: "Carpeta vacía",
    clickToSelect: "Haz clic para seleccionar",
    tapToOpen: "Toca para desplegar",
    createFolder: "Crear Nueva Carpeta",
    completionStatus: "Estado de Cumplimiento",
    taskGoalTracking: "Seguimiento diario de tareas y objetivos",
    totalTasks: "TOTAL TAREAS",
    completed: "COMPLETADAS",
    inProgress: "EN CURSO",
    activeFocusTasks: "Tareas de Enfoque Activas",
    addTaskPlaceholder: "Agregar un objetivo o tarea...",
    add: "Añadir",
    pomodoro: "POMODORO",
    running: "En curso",
    paused: "Pausado",
    pause: "Pausar",
    start: "Iniciar",
    reset25: "Reiniciar a 25m",
    focusTask: "Optimizar arquitectura Tauri",
    retroClock: "RELOJ DIGITAL 80s",
    arcadeClock: "ARCADE TIMER",
    welcomeTitle: "Bienvenido a Focus",
    welcomeDescription: "¿Cómo te llamamos en tu espacio de enfoque?",
    namePlaceholder: "Tu nombre o alias",
    saveAndStart: "Guardar y comenzar",
    profileSettings: "Ajustes generales",
    editName: "Editar nombre",
    saveName: "Guardar nombre",
    guestName: "Focus",
    quickNotes: "NOTAS RÁPIDAS",
    notesPlaceholder: "Apunta ideas o fragmentos de código...",
    notesLive: "En vivo",
    notesSaved: "Guardado",
    vecnaClock: "RELOJ DE VECNA",
    themeSelector: "Selector de Diseños, Animaciones y Tipografías",
    themeDescription:
      "Al cambiar de tema, el fondo animado y la tipografía cambian automáticamente. Puedes probarlos en tiempo real.",
    fontType: "Tipo de Fuente:",
    automaticTheme: "Automática del Tema",
    monospaceFont: "Monospace (Consola)",
    sansFont: "Sans-Serif (Moderna)",
    serifFont: "Serif (Clásica)",
    active: "Activo",
    minimizeWindow: "Minimizar ventana",
    toggleWindowSize: "Maximizar o restaurar ventana",
    closeWindow: "Cerrar ventana",
    activeAnimation: "Animación activa",
    closeSave: "Cerrar y Guardar",
    addGeneralLink: "Añadir Enlace General",
    title: "Título",
    url: "URL (https://...)",
    description: "Descripción",
    saveLink: "Guardar Enlace",
    newLink: "+ Nuevo Enlace",
    emptyGroup: "Este grupo está vacío",
    emptyGroupDescription:
      "Añade tu primer enlace para empezar a estructurar tu espacio.",
    openLink: "Abrir Enlace",
    deleteLink: "Eliminar enlace",
    addLinkTo: (category: string) => `Añadir Enlace a ${category}`,
  },
  en: {
    language: "Language",
    searchPlaceholder: "Search links or quick notes...",
    themes: "Themes",
    quickLinks: "Quick Links",
    kanban: "Kanban Board",
    dashboard: "Dashboard",
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    shortcutsSubtitle: "Smart management for links and shortcut groups.",
    kanbanSubtitle: "Modular planning and active project workflow.",
    dashboardSubtitle: "Productivity metrics and goal tracking.",
    themeLabel: "Theme",
    groupsTitle: "My Groups and Folders",
    bulkDeletePrompt: "Select the folders you want to delete in bulk.",
    groupsSummary: (links: number, categories: number) =>
      `Total: ${links} links saved in ${categories} folders.`,
    deleteSelected: (count: number) => `Delete selected (${count})`,
    cancel: "Cancel",
    selectMultiple: "Select / Delete Multiple",
    addLink: "+ Add Link",
    newCategoryPlaceholder: "New category name...",
    create: "Create",
    apps: "APPS",
    emptyFolder: "Empty folder",
    clickToSelect: "Click to select",
    tapToOpen: "Click to open",
    createFolder: "Create New Folder",
    completionStatus: "Completion Status",
    taskGoalTracking: "Daily task and goal tracking",
    totalTasks: "TOTAL TASKS",
    completed: "COMPLETED",
    inProgress: "IN PROGRESS",
    activeFocusTasks: "Active Focus Tasks",
    addTaskPlaceholder: "Add a goal or task...",
    add: "Add",
    pomodoro: "POMODORO",
    running: "Running",
    paused: "Paused",
    pause: "Pause",
    start: "Start",
    reset25: "Reset to 25m",
    focusTask: "Optimize Tauri architecture",
    retroClock: "80s DIGITAL CLOCK",
    arcadeClock: "ARCADE TIMER",
    welcomeTitle: "Welcome to Focus",
    welcomeDescription: "What should we call you in your focus space?",
    namePlaceholder: "Your name or alias",
    saveAndStart: "Save and begin",
    profileSettings: "General settings",
    editName: "Edit name",
    saveName: "Save name",
    guestName: "Focus",
    quickNotes: "QUICK NOTES",
    notesPlaceholder: "Jot down ideas or code snippets...",
    notesLive: "Live",
    notesSaved: "Saved",
    vecnaClock: "VECNA'S CLOCK",
    themeSelector: "Theme, Animation and Font Selector",
    themeDescription:
      "Changing the theme also updates the animated background and font. Preview them in real time.",
    fontType: "Font Type:",
    automaticTheme: "Theme Default",
    monospaceFont: "Monospace (Console)",
    sansFont: "Sans-Serif (Modern)",
    serifFont: "Serif (Classic)",
    active: "Active",
    minimizeWindow: "Minimize window",
    toggleWindowSize: "Maximize or restore window",
    closeWindow: "Close window",
    activeAnimation: "Animation active",
    closeSave: "Close and Save",
    addGeneralLink: "Add General Link",
    title: "Title",
    url: "URL (https://...)",
    description: "Description",
    saveLink: "Save Link",
    newLink: "+ New Link",
    emptyGroup: "This group is empty",
    emptyGroupDescription:
      "Add your first link to start organizing your workspace.",
    openLink: "Open Link",
    deleteLink: "Delete link",
    addLinkTo: (category: string) => `Add Link to ${category}`,
  },
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const finishIntro = useCallback(() => setShowIntro(false), []);
  const [userName, setUserName] = useState(
    () => localStorage.getItem("focus_user_name")?.trim() || "",
  );
  const [nameDraft, setNameDraft] = useState(userName);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return localStorage.getItem("focus_language") === "en" ? "en" : "es";
  });
  const t = translations[currentLang];

  // NAVEGACIÓN PRINCIPAL
  const [activeTab, setActiveTab] = useState<
    "DASHBOARD" | "SHORTCUTS" | "KANBAN"
  >("SHORTCUTS");

  // ESTADOS: Temas, Tipografías y Personalización
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem("focus_theme") as ThemeType) || "neon";
  });

  const [customFont, setCustomFont] = useState<FontType>(() => {
    switch (localStorage.getItem("focus_custom_font")) {
      case "monospace":
        return "monospace";
      case "sans":
        return "sans";
      case "serif":
        return "serif";
      default:
        return "default";
    }
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // ESTADOS: Categorías y Enlaces
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("focus_categories");
    return saved
      ? JSON.parse(saved)
      : [
          "WORKSPACE",
          "INVESTIGACIÓN",
          "CÓDIGO",
          "CURSOS",
          "CARRERA",
          "LABORATORIO",
        ];
  });

  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem("focus_links");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Notion",
            url: "https://notion.so",
            description: "Proyectos y bases de datos",
            category: "WORKSPACE",
            badge: "NO",
          },
          {
            id: "2",
            title: "NotebookLM",
            url: "https://notebooklm.google.com",
            description: "Investigación con IA",
            category: "INVESTIGACIÓN",
            badge: "NB",
          },
          {
            id: "3",
            title: "GitHub",
            url: "https://github.com",
            description: "Repositorios y proyectos",
            category: "CÓDIGO",
            badge: "GH",
          },
          {
            id: "4",
            title: "Ironhack Portal",
            url: "https://ironhack.com",
            description: "Estudios y módulos",
            category: "CURSOS",
            badge: "IR",
          },
          {
            id: "5",
            title: "Domestika",
            url: "https://domestika.org",
            description: "Cursos creativos y diseño",
            category: "CURSOS",
            badge: "DO",
          },
          {
            id: "6",
            title: "Stripe Jobs",
            url: "https://stripe.com/jobs",
            description: "Portal de empleos",
            category: "CARRERA",
            badge: "ST",
          },
        ];
  });

  // Tareas
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem("focus_tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Diseñar arquitectura de carpetas",
            completed: true,
          },
          { id: "2", title: "Configurar integraciones externas", completed: true },
          {
            id: "3",
            title: "Probar compilación ejecutable de Tauri",
            completed: false,
          },
        ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [openFolderCategory, setOpenFolderCategory] = useState<string | null>(
    null,
  );
  const [folderSearchQuery, setFolderSearchQuery] = useState("");

  // Carrusel & Vista (Carrusel o Grid)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [isHoveredOnCarousel, setIsHoveredOnCarousel] = useState(false);
  const [folderViewMode, setFolderViewMode] = useState<"CAROUSEL" | "GRID">(
    "CAROUSEL",
  );

  // Modal independiente para añadir enlace dentro de la carpeta
  const [isAddLinkInFolderOpen, setIsAddLinkInFolderOpen] = useState(false);
  const [inFolderLinkTitle, setInFolderLinkTitle] = useState("");
  const [inFolderLinkUrl, setInFolderLinkUrl] = useState("");

  // Modales y Gestión General
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isQuickAddCatOpen, setIsQuickAddCatOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [inlineEditingCat, setInlineEditingCat] = useState<string | null>(null);
  const [inlineEditingInput, setInlineEditingInput] = useState("");

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    category: categories[0] || "WORKSPACE",
    badge: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [notesText, setNotesText] = useState(
    () => localStorage.getItem("focus_quick_notes") || "",
  );
  const [isNotesEditing, setIsNotesEditing] = useState(false);

  useEffect(() => {
    if (!isNotesEditing) return;
    const saveStatusTimer = window.setTimeout(
      () => setIsNotesEditing(false),
      700,
    );
    return () => window.clearTimeout(saveStatusTimer);
  }, [notesText, isNotesEditing]);

  // Pomodoro
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const savedValue = localStorage.getItem("focus_timer_seconds");
    if (savedValue === null) return 25 * 60;
    const savedSeconds = Number(savedValue);
    return Number.isInteger(savedSeconds) && savedSeconds > 0 && savedSeconds <= 25 * 60
      ? savedSeconds
      : 25 * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerDeadlineRef = useRef<number | null>(null);

  // Lista de enlaces filtrados para la carpeta actual
  const currentFolderLinks = links.filter(
    (l) =>
      l.category === openFolderCategory &&
      (l.title.toLowerCase().includes(folderSearchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(folderSearchQuery.toLowerCase())),
  );

  // Control de seguridad para índice del carrusel al borrar elementos
  useEffect(() => {
    if (
      currentFolderLinks.length > 0 &&
      activeCardIndex >= currentFolderLinks.length
    ) {
      const newIndex = currentFolderLinks.length - 1;
      setActiveCardIndex(newIndex);
      if (carouselRef.current) {
        const container = carouselRef.current;
        const cards = container.querySelectorAll(".carousel-card");
        const targetCard = cards[newIndex] as HTMLElement;
        if (targetCard) {
          const scrollLeft =
            targetCard.offsetLeft -
            container.clientWidth / 2 +
            targetCard.offsetWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      }
    }
  }, [currentFolderLinks.length]);

  // Al abrir la carpeta, centrar exactamente en el primer elemento (índice 0)
  useEffect(() => {
    if (
      openFolderCategory &&
      carouselRef.current &&
      currentFolderLinks.length > 0
    ) {
      const container = carouselRef.current;
      setTimeout(() => {
        const cards = container.querySelectorAll(".carousel-card");
        const firstCard = cards[0] as HTMLElement;
        if (firstCard) {
          const scrollLeft =
            firstCard.offsetLeft -
            container.clientWidth / 2 +
            firstCard.offsetWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: "auto" });
        }
        setActiveCardIndex(0);
      }, 50);
    }
  }, [openFolderCategory, folderSearchQuery]);

  // AUTOPLAY CENTRADO
  useEffect(() => {
    let timer: any;
    if (
      isAutoplayActive &&
      !isHoveredOnCarousel &&
      folderViewMode === "CAROUSEL" &&
      currentFolderLinks.length > 0
    ) {
      timer = setInterval(() => {
        setActiveCardIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % currentFolderLinks.length;
          if (carouselRef.current) {
            const container = carouselRef.current;
            const cards = container.querySelectorAll(".carousel-card");
            const targetCard = cards[nextIndex] as HTMLElement;
            if (targetCard) {
              const scrollLeft =
                targetCard.offsetLeft -
                container.clientWidth / 2 +
                targetCard.offsetWidth / 2;
              container.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
          }
          return nextIndex;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [
    isAutoplayActive,
    isHoveredOnCarousel,
    folderViewMode,
    currentFolderLinks.length,
  ]);

  useEffect(() => {
    localStorage.setItem("focus_timer_seconds", timerSeconds.toString());
  }, [timerSeconds]);

  useEffect(() => {
    localStorage.setItem("focus_categories", JSON.stringify(categories));
    localStorage.setItem("focus_links", JSON.stringify(links));
    localStorage.setItem("focus_tasks", JSON.stringify(tasks));
    localStorage.setItem("focus_quick_notes", notesText);
    localStorage.setItem("focus_theme", currentTheme);
    localStorage.setItem("focus_custom_font", customFont);
    localStorage.setItem("focus_language", currentLang);
    if (userName) {
      localStorage.setItem("focus_user_name", userName);
    }
  }, [
    categories,
    links,
    tasks,
    notesText,
    currentTheme,
    customFont,
    currentLang,
    userName,
  ]);

  useEffect(() => {
    if (!isTimerRunning) return;

    const startingSeconds = timerSeconds > 0 ? timerSeconds : 25 * 60;
    if (timerSeconds <= 0) setTimerSeconds(startingSeconds);
    timerDeadlineRef.current = Date.now() + startingSeconds * 1000;
    const updateRemainingTime = () => {
      const deadline = timerDeadlineRef.current;
      if (deadline === null) return;
      const remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimerSeconds(remainingSeconds);
      if (remainingSeconds === 0) {
        timerDeadlineRef.current = null;
        setIsTimerRunning(false);
      }
    };

    const intervalId = window.setInterval(updateRemainingTime, 200);
    updateRemainingTime();
    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return t.morning;
    if (hour >= 12 && hour < 20) return t.afternoon;
    return t.evening;
  };

  const saveUserName = (event: React.FormEvent) => {
    event.preventDefault();
    const savedName = nameDraft.trim();
    if (!savedName) return;
    localStorage.setItem("focus_user_name", savedName);
    setUserName(savedName);
    setNameDraft(savedName);
    setIsProfileSettingsOpen(false);
  };

  const saveOnboardingName = useCallback((name: string) => {
    const savedName = name.trim();
    if (!savedName) return;
    localStorage.setItem("focus_user_name", savedName);
    setUserName(savedName);
    setNameDraft(savedName);
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim().toUpperCase();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCatInput("");
      setIsQuickAddCatOpen(false);
    }
  };

  const handleToggleSelectCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleDeleteSelectedCategories = () => {
    if (selectedCategories.length === 0) return;
    setCategories(categories.filter((c) => !selectedCategories.includes(c)));
    setLinks(links.filter((l) => !selectedCategories.includes(l.category)));
    setSelectedCategories([]);
    setIsSelectionMode(false);
  };

  const handleOpenAllFolderLinks = () => {
    const folderLinks = links.filter((l) => l.category === openFolderCategory);
    folderLinks.forEach((link) => {
      window.open(link.url, "_blank");
    });
  };

  const handleSaveInlineRename = (oldCat: string) => {
    const newCatFormatted = inlineEditingInput.trim().toUpperCase();
    if (!newCatFormatted || newCatFormatted === oldCat) {
      setInlineEditingCat(null);
      return;
    }

    setCategories(categories.map((c) => (c === oldCat ? newCatFormatted : c)));
    setLinks(
      links.map((link) =>
        link.category === oldCat
          ? { ...link, category: newCatFormatted }
          : link,
      ),
    );
    if (openFolderCategory === oldCat) {
      setOpenFolderCategory(newCatFormatted);
    }
    setInlineEditingCat(null);
  };

  const handleSelectCardIndex = (index: number) => {
    setActiveCardIndex(index);
    if (carouselRef.current && currentFolderLinks.length > 0) {
      const container = carouselRef.current;
      const cards = container.querySelectorAll(".carousel-card");
      const targetCard = cards[index] as HTMLElement;

      if (targetCard) {
        const scrollLeft =
          targetCard.offsetLeft -
          container.clientWidth / 2 +
          targetCard.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (currentFolderLinks.length === 0 || !carouselRef.current) return;
    const container = carouselRef.current;
    const cards = container.querySelectorAll(".carousel-card");

    let newIndex =
      direction === "left" ? activeCardIndex - 1 : activeCardIndex + 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= currentFolderLinks.length)
      newIndex = currentFolderLinks.length - 1;

    setActiveCardIndex(newIndex);
    const targetCard = cards[newIndex] as HTMLElement;

    if (targetCard) {
      const scrollLeft =
        targetCard.offsetLeft -
        container.clientWidth / 2 +
        targetCard.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleAddLinkDirectlyInFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inFolderLinkTitle || !inFolderLinkUrl || !openFolderCategory) return;

    const formattedUrl = inFolderLinkUrl.startsWith("http")
      ? inFolderLinkUrl
      : `https://${inFolderLinkUrl}`;
    const badge = inFolderLinkTitle.substring(0, 2).toUpperCase();

    const created: QuickLink = {
      id: Date.now().toString(),
      title: inFolderLinkTitle.trim(),
      url: formattedUrl,
      description: openFolderCategory,
      category: openFolderCategory,
      badge,
    };

    setLinks([...links, created]);
    setInFolderLinkTitle("");
    setInFolderLinkUrl("");
    setIsAddLinkInFolderOpen(false);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    const formattedUrl = newLink.url.startsWith("http")
      ? newLink.url
      : `https://${newLink.url}`;
    const badge = newLink.badge || newLink.title.substring(0, 2).toUpperCase();

    const created: QuickLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: formattedUrl,
      description: newLink.description,
      category: newLink.category || "WORKSPACE",
      badge,
    };

    setLinks([...links, created]);
    setNewLink({
      title: "",
      url: "",
      description: "",
      category: categories[0] || "WORKSPACE",
      badge: "",
    });
    setIsAddLinkOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };
  const handleOpenLink = async (url: string) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    try {
      await open(formattedUrl);
    } catch (error) {
      console.error("Error al abrir el enlace:", error);
    }
  };

  const handleWindowAction = async (
    action: "minimize" | "toggleMaximize" | "close",
  ) => {
    try {
      const currentWindow = getCurrentWindow();
      await currentWindow[action]();
    } catch (error) {
      console.error(`Unable to ${action} the application window:`, error);
    }
  };
  const filteredBySearch = links.filter((link) => {
    if (!searchQuery) return true;
    return (
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const completionPercentage =
    tasks.length > 0
      ? Math.round((completedTasksCount / tasks.length) * 100)
      : 0;

  // Lista de temas
  const themesList: {
    id: ThemeType;
    name: string;
    description: string;
    colors: string[];
    badgeBg: string;
    borderRadius: string;
    defaultFont: FontType;
    shadowStyle: string;
  }[] = [
    {
      id: "neon",
      name: currentLang === "es" ? "Neón Cyberpunk" : "Cyberpunk Neon",
      description:
        currentLang === "es"
          ? "Cian eléctrico, morado profundo y brillos futuristas."
          : "Electric cyan, deep purple and futuristic glow.",
      colors: ["#00f0ff", "#7000ff", "#141418"],
      badgeBg: "linear-gradient(90deg, #00f0ff, #7000ff)",
      borderRadius: "14px",
      defaultFont: "sans",
      shadowStyle: "0 0 20px rgba(0, 240, 255, 0.25)",
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description:
        currentLang === "es"
          ? "Tonos sobrios, oscuros y limpios sin distracciones."
          : "Clean, understated dark tones with no distractions.",
      colors: ["#8e8e93", "#22222c", "#0c0d12"],
      badgeBg: "#7000ff",
      borderRadius: "8px",
      defaultFont: "sans",
      shadowStyle: "0 4px 12px rgba(0,0,0,0.15)",
    },
    {
      id: "matrix",
      name: "Matrix Terminal",
      description:
        currentLang === "es"
          ? "Verde esmeralda con lluvia digital y bordes rectos."
          : "Emerald green with digital rain and sharp edges.",
      colors: ["#00ff41", "#003b0c", "#000000"],
      badgeBg: "#00ff41",
      borderRadius: "2px",
      defaultFont: "monospace",
      shadowStyle: "0 0 15px rgba(0, 255, 65, 0.3)",
    },
    {
      id: "synthwave",
      name: "Synthwave 80s",
      description:
        currentLang === "es"
          ? "Horizonte retro 80s con rejilla láser y sol neón."
          : "Retro 80s horizon with a laser grid and neon sun.",
      colors: ["#ff007f", "#ff7b00", "#2b1055"],
      badgeBg: "linear-gradient(90deg, #ff007f, #ff7b00)",
      borderRadius: "16px",
      defaultFont: "serif",
      shadowStyle: "0 0 25px rgba(255, 0, 127, 0.35)",
    },
    {
      id: "amber",
      name: currentLang === "es" ? "Ámbar Pip-Boy" : "Pip-Boy Amber",
      description:
        currentLang === "es"
          ? "Estilo retro terminal Fallout con escaneo CRT."
          : "Fallout-inspired retro terminal style with CRT scanlines.",
      colors: ["#ffb000", "#332200", "#0a0700"],
      badgeBg: "#ffb000",
      borderRadius: "4px",
      defaultFont: "monospace",
      shadowStyle: "0 0 15px rgba(255, 176, 0, 0.3)",
    },
    {
      id: "acid",
      name: currentLang === "es" ? "Ácido Underground" : "Underground Acid",
      description:
        currentLang === "es"
          ? "Amarillo eléctrico tóxico y contrastes industriales."
          : "Toxic electric yellow and industrial contrast.",
      colors: ["#ccff00", "#222611", "#0d0e0a"],
      badgeBg: "#ccff00",
      borderRadius: "10px",
      defaultFont: "sans",
      shadowStyle: "0 0 20px rgba(204, 255, 0, 0.25)",
    },
    {
      id: "upside-down",
      name: "Upside Down",
      description:
        currentLang === "es"
          ? "Ceniza roja, luces misteriosas y sombras de Hawkins."
          : "Red ash, mysterious lights and shadows from Hawkins.",
      colors: ["#ff0033", "#1a1a3a", "#08080c"],
      badgeBg: "linear-gradient(90deg, #ff0033, #1a1a3a)",
      borderRadius: "10px",
      defaultFont: "serif",
      shadowStyle: "0 0 24px rgba(255, 0, 51, 0.32)",
    },
    {
      id: "arcade-pixel",
      name: "Arcade Pixel",
      description:
        currentLang === "es"
          ? "Neones arcade, píxeles y rejillas de los años 80."
          : "Arcade neon, pixels and 80s-inspired grids.",
      colors: ["#ffd700", "#00ffff", "#09090e"],
      badgeBg: "linear-gradient(90deg, #ffd700, #ff00ff)",
      borderRadius: "0px",
      defaultFont: "monospace",
      shadowStyle: "0 0 22px rgba(255, 215, 0, 0.3)",
    },
    {
      id: "solar-eclipse",
      name: "Solar Eclipse",
      description:
        currentLang === "es"
          ? "Una corona solar brillante entre polvo estelar."
          : "A glowing solar corona surrounded by stellar dust.",
      colors: ["#ff6600", "#4b0082", "#050508"],
      badgeBg: "linear-gradient(90deg, #ff6600, #4b0082)",
      borderRadius: "12px",
      defaultFont: "sans",
      shadowStyle: "0 0 24px rgba(255, 102, 0, 0.3)",
    },
  ];

  const currentThemeObj =
    themesList.find((t) => t.id === currentTheme) || themesList[0];

  const activeFontFamily =
    customFont === "default"
      ? currentThemeObj.defaultFont === "monospace"
        ? "monospace"
        : currentThemeObj.defaultFont === "serif"
          ? "Georgia, serif"
          : "system-ui, -apple-system, sans-serif"
      : customFont === "monospace"
        ? "monospace"
        : customFont === "sans"
          ? "system-ui, -apple-system, sans-serif"
          : "Georgia, serif";

  const accentColor = currentThemeObj.colors[0];

  return (
    <div
      className={`app-shell theme-${currentTheme}`}
      style={
        {
          fontFamily: activeFontFamily,
          "--theme-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <DynamicBackground theme={!userName ? "neon" : currentTheme} />
      <InteractiveEffects theme={currentTheme} />
      {showIntro && (
        <CyberpunkIntro
          lang={currentLang}
          needsName={!userName}
          initialName={userName}
          onConfirmName={saveOnboardingName}
          onFinish={finishIntro}
        />
      )}
      {showIntro && isTauri() && (
        <div className="window-controls window-controls-intro">
          <button
            className="window-control-button"
            onClick={() => void handleWindowAction("minimize")}
            title={t.minimizeWindow}
            aria-label={t.minimizeWindow}
          >
            <Minus size={14} />
          </button>
          <button
            className="window-control-button"
            onClick={() => void handleWindowAction("toggleMaximize")}
            title={t.toggleWindowSize}
            aria-label={t.toggleWindowSize}
          >
            <Maximize2 size={12} />
          </button>
          <button
            className="window-control-button close"
            onClick={() => void handleWindowAction("close")}
            title={t.closeWindow}
            aria-label={t.closeWindow}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {/* TOPBAR */}
      <header className="topbar" data-tauri-drag-region>
        <div className="brand">
          <div
            className="brand-mark"
            style={{
              borderColor: accentColor,
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            <Zap size={16} color={accentColor} />
          </div>
          <span
            style={{ color: currentTheme === "minimal" ? "#fff" : accentColor }}
          >
            Focus
          </span>
        </div>

        <div
          className="search-wrap"
          style={{ borderRadius: currentThemeObj.borderRadius }}
        >
          <Search size={14} color="#8e8e93" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd>Ctrl+K</kbd>
        </div>

        <div className="top-actions">
          <button
            onClick={() =>
              setCurrentLang((language) => (language === "es" ? "en" : "es"))
            }
            className="icon-button"
            title={`${t.language}: ${currentLang.toUpperCase()}`}
            aria-label={`${t.language}: ${currentLang.toUpperCase()}`}
            style={{
              width: "auto",
              padding: "0 10px",
              borderRadius: currentThemeObj.borderRadius,
              color: accentColor,
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {currentLang.toUpperCase()}
          </button>
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="icon-button"
            title={t.themeSelector}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "auto",
              padding: "0 10px",
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            <Palette size={16} color={accentColor} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#fff" }}>
              {t.themes}
            </span>
          </button>
          <button
            className="avatar"
            type="button"
            title={t.profileSettings}
            aria-label={t.profileSettings}
            onClick={() => {
              setNameDraft(userName);
              setIsProfileSettingsOpen(true);
            }}
            style={{
              borderColor: accentColor,
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            {userName
              ? userName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("")
              : "FO"}
          </button>
          {isTauri() && (
            <div className="window-controls">
              <button
                className="window-control-button"
                onClick={() => void handleWindowAction("minimize")}
                title={t.minimizeWindow}
                aria-label={t.minimizeWindow}
              >
                <Minus size={14} />
              </button>
              <button
                className="window-control-button"
                onClick={() => void handleWindowAction("toggleMaximize")}
                title={t.toggleWindowSize}
                aria-label={t.toggleWindowSize}
              >
                <Maximize2 size={12} />
              </button>
              <button
                className="window-control-button close"
                onClick={() => void handleWindowAction("close")}
                title={t.closeWindow}
                aria-label={t.closeWindow}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <div className="workspace">
        {/* RAIL LATERAL */}
        <nav className="rail">
          <button
            onClick={() => setActiveTab("SHORTCUTS")}
            className={`rail-button ${activeTab === "SHORTCUTS" ? "active" : ""}`}
            title={t.quickLinks}
            style={{ borderRadius: currentThemeObj.borderRadius }}
          >
            <Bookmark size={18} />
          </button>
          <button
            onClick={() => setActiveTab("KANBAN")}
            className={`rail-button ${activeTab === "KANBAN" ? "active" : ""}`}
            title={t.kanban}
            style={{ borderRadius: currentThemeObj.borderRadius }}
          >
            <CheckSquare size={18} />
          </button>
          <button
            onClick={() => setActiveTab("DASHBOARD")}
            className={`rail-button ${activeTab === "DASHBOARD" ? "active" : ""}`}
            title={t.dashboard}
            style={{ borderRadius: currentThemeObj.borderRadius }}
          >
            <LayoutDashboard size={18} />
          </button>
          <div className="rail-spacer" />
        </nav>

        {/* CONTENIDO CENTRAL */}
        <main className="content">
          <div className="welcome-row">
            <div>
              <p
                className="eyebrow"
                style={{
                  color: accentColor,
                  letterSpacing: "2px",
                  fontWeight: 600,
                }}
              >
                {new Date()
                  .toLocaleDateString(currentLang === "es" ? "es-ES" : "en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                  .toUpperCase()}
              </p>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  margin: "4px 0",
                  color: "#ffffff",
                  textShadow: `0 0 15px ${accentColor}44`,
                }}
              >
                {getDynamicGreeting()}, {userName || t.guestName}.
              </h1>
              <p className="subtitle">
                {activeTab === "SHORTCUTS" &&
                  t.shortcutsSubtitle}
                {activeTab === "KANBAN" &&
                  t.kanbanSubtitle}
                {activeTab === "DASHBOARD" &&
                  t.dashboardSubtitle}
              </p>
            </div>
            <div
              className="focus-pill"
              onClick={() => setIsThemeModalOpen(true)}
              style={{
                cursor: "pointer",
                borderColor: `${accentColor}55`,
                borderRadius: currentThemeObj.borderRadius,
              }}
            >
              <div
                className="status-dot"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
              <span style={{ textTransform: "capitalize" }}>
                {t.themeLabel}: {currentTheme}
              </span>
            </div>
          </div>

          {/* VISTA 1: ACCESOS RÁPIDOS */}
          {activeTab === "SHORTCUTS" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>{t.groupsTitle}</h2>
                  <p>
                    {isSelectionMode
                      ? t.bulkDeletePrompt
                      : t.groupsSummary(links.length, categories.length)}
                  </p>
                </div>

                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {isSelectionMode ? (
                    <>
                      <button
                        onClick={handleDeleteSelectedCategories}
                        style={{
                          background: "#ef4444",
                          border: 0,
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: currentThemeObj.borderRadius,
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {t.deleteSelected(selectedCategories.length)}
                      </button>
                      <button
                        onClick={() => {
                          setIsSelectionMode(false);
                          setSelectedCategories([]);
                        }}
                        style={{
                          background: currentThemeObj.colors[2],
                          border: "1px solid var(--border-color)",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: currentThemeObj.borderRadius,
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        {t.cancel}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsSelectionMode(true)}
                        style={{
                          background: currentThemeObj.colors[2],
                          border: "1px solid var(--border-color)",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: currentThemeObj.borderRadius,
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CheckSquareIcon size={14} color={accentColor} />
                        {t.selectMultiple}
                      </button>

                      <button
                        onClick={() => setIsAddLinkOpen(true)}
                        className="start-button"
                        style={{
                          fontSize: "11px",
                          padding: "6px 12px",
                          borderRadius: currentThemeObj.borderRadius,
                          background: accentColor,
                          color: "#000",
                        }}
                      >
                        {t.addLink}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Formulario rápido para añadir categoría */}
              {isQuickAddCatOpen && (
                <form
                  onSubmit={handleAddCategory}
                  style={{
                    background: currentThemeObj.colors[2],
                    border: "1px solid var(--border-color)",
                    padding: "12px",
                    borderRadius: currentThemeObj.borderRadius,
                    marginBottom: "16px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder={t.newCategoryPlaceholder}
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: "#0c0d12",
                      border: `1px solid ${accentColor}`,
                      borderRadius: currentThemeObj.borderRadius,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: "12px",
                      outline: 0,
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="start-button"
                    style={{
                      padding: "8px 14px",
                      fontSize: "11px",
                      borderRadius: currentThemeObj.borderRadius,
                      background: accentColor,
                      color: "#000",
                    }}
                  >
                    {t.create}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddCatOpen(false)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                </form>
              )}

              <div className="tool-grid">
                {categories.map((category) => {
                  const categoryLinks = filteredBySearch.filter(
                    (l) => l.category === category,
                  );
                  const isSelected = selectedCategories.includes(category);

                  return (
                    <div
                      key={category}
                      onClick={() => {
                        if (isSelectionMode) {
                          handleToggleSelectCategory(category);
                        } else {
                          setOpenFolderCategory(category);
                          setFolderSearchQuery("");
                          setInlineEditingCat(null);
                          setIsAddLinkInFolderOpen(false);
                          setActiveCardIndex(0);
                        }
                      }}
                      className="tool-card"
                      style={{
                        cursor: "pointer",
                        minHeight: "160px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        borderRadius: currentThemeObj.borderRadius,

                        // TEXTURAS Y RELIEVES ÚNICOS POR CADA TEMA:
                        background:
                          currentTheme === "synthwave"
                            ? "linear-gradient(135deg, rgba(80, 20, 110, 0.95) 0%, rgba(15, 8, 35, 0.98) 100%)"
                            : currentTheme === "matrix"
                              ? "linear-gradient(180deg, rgba(0, 60, 20, 0.6) 0%, rgba(2, 15, 5, 0.98) 100%)" // Panel verde oscuro con brillo superior
                              : currentTheme === "amber"
                                ? "linear-gradient(180deg, rgba(60, 40, 0, 0.85) 0%, rgba(12, 8, 0, 0.98) 100%)"
                                : currentTheme === "neon"
                                  ? "linear-gradient(135deg, rgba(0, 50, 80, 0.85) 0%, rgba(8, 12, 22, 0.98) 100%)"
                                  : currentTheme === "acid"
                                    ? "linear-gradient(135deg, rgba(50, 60, 10, 0.85) 0%, rgba(10, 12, 4, 0.98) 100%)"
                                    : currentThemeObj.colors[2],

                        // BORDES ILUMINADOS Y DISTINTIVOS:
                        border:
                          isSelectionMode && isSelected
                            ? "2px solid #ef4444"
                            : currentTheme === "synthwave"
                              ? "2px solid rgba(255, 0, 127, 0.8)"
                              : currentTheme === "matrix"
                                ? "2px solid rgba(0, 255, 65, 0.8)"
                                : currentTheme === "amber"
                                  ? "2px solid rgba(255, 176, 0, 0.8)"
                                  : currentTheme === "neon"
                                    ? "2px solid rgba(0, 240, 255, 0.8)"
                                    : currentTheme === "acid"
                                      ? "2px solid rgba(204, 255, 0, 0.8)"
                                      : "1px solid rgba(255, 255, 255, 0.25)",

                        // SOMBRAS Y BRILLOS INTERNOS TRIDIMENSIONALES:
                        boxShadow:
                          currentTheme === "synthwave"
                            ? "0 0 25px rgba(255, 0, 127, 0.35), inset 0 0 15px rgba(255, 123, 0, 0.15)"
                            : currentTheme === "matrix"
                              ? "0 0 25px rgba(0, 255, 65, 0.3), inset 0 0 15px rgba(0, 255, 65, 0.15)"
                              : currentTheme === "amber"
                                ? "0 0 25px rgba(255, 176, 0, 0.3), inset 0 0 15px rgba(255, 176, 0, 0.15)"
                                : currentTheme === "neon"
                                  ? "0 0 25px rgba(0, 240, 255, 0.35)"
                                  : currentTheme === "acid"
                                    ? "0 0 25px rgba(204, 255, 0, 0.35)"
                                    : "0 8px 24px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="tool-tag"
                          style={{ color: accentColor }}
                        >
                          {categoryLinks.length} {t.apps}
                        </span>

                        {isSelectionMode ? (
                          <div
                            style={{
                              color: isSelected
                                ? "#ef4444"
                                : "var(--text-muted)",
                            }}
                          >
                            {isSelected ? (
                              <CheckSquareIcon size={16} />
                            ) : (
                              <Square size={16} />
                            )}
                          </div>
                        ) : (
                          <Folder size={16} color={accentColor} />
                        )}
                      </div>

                      <div
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: currentThemeObj.borderRadius,
                          padding: "8px",
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "6px",
                          margin: "10px 0",
                          minHeight: "60px",
                          alignItems: "center",
                        }}
                      >
                        {categoryLinks.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            style={{
                              background: currentThemeObj.colors[2],
                              borderRadius: currentThemeObj.borderRadius,
                              height: "24px",
                              display: "grid",
                              placeItems: "center",
                              fontSize: "9px",
                              fontWeight: "bold",
                              color: "#fff",
                              border: `1px solid ${accentColor}33`,
                            }}
                          >
                            {item.badge}
                          </div>
                        ))}
                        {categoryLinks.length === 0 && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#666",
                              gridColumn: "span 3",
                              textAlign: "center",
                            }}
                          >
                            {t.emptyFolder}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 style={{ fontSize: "14px", margin: 0 }}>
                          {category}
                        </h3>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {isSelectionMode
                            ? t.clickToSelect
                            : t.tapToOpen}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div
                  onClick={() => setIsQuickAddCatOpen(true)}
                  className="empty-state"
                  style={{
                    cursor: "pointer",
                    minHeight: "160px",
                    flexDirection: "column",
                    gap: "8px",
                    borderRadius: currentThemeObj.borderRadius,
                  }}
                >
                  <FolderPlus size={22} color={accentColor} />
                  <span style={{ fontWeight: 600 }}>{t.createFolder}</span>
                </div>
              </div>
            </>
          )}

          {/* VISTA 2: KANBAN */}
          {activeTab === "KANBAN" && <KanbanBoard lang={currentLang} />}

          {/* VISTA 3: DASHBOARD */}
          {activeTab === "DASHBOARD" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div
                className="synthwave-panel"
                style={{
                  background: currentThemeObj.colors[2],
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BarChart2 size={18} color={accentColor} />{" "}
                      {t.completionStatus}
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        margin: "2px 0 0 0",
                      }}
                    >
                      {t.taskGoalTracking}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: accentColor,
                    }}
                  >
                    {completionPercentage}%
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background: "#141418",
                    borderRadius: currentThemeObj.borderRadius,
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    className="synthwave-stat-panel"
                    style={{
                      width: `${completionPercentage}%`,
                      height: "100%",
                      background: accentColor,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: currentThemeObj.colors[2],
                      border: "1px solid var(--border-color)",
                      padding: "12px",
                      borderRadius: currentThemeObj.borderRadius,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        display: "block",
                      }}
                    >
                      {t.totalTasks}
                    </span>
                    <strong style={{ fontSize: "18px", color: "#fff" }}>
                      {tasks.length}
                    </strong>
                  </div>
                  <div
                    className="synthwave-stat-panel"
                    style={{
                      background: currentThemeObj.colors[2],
                      border: "1px solid var(--border-color)",
                      padding: "12px",
                      borderRadius: currentThemeObj.borderRadius,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#22c55e",
                        display: "block",
                      }}
                    >
                      {t.completed}
                    </span>
                    <strong style={{ fontSize: "18px", color: "#22c55e" }}>
                      {completedTasksCount}
                    </strong>
                  </div>
                  <div
                    className="synthwave-stat-panel"
                    style={{
                      background: currentThemeObj.colors[2],
                      border: "1px solid var(--border-color)",
                      padding: "12px",
                      borderRadius: currentThemeObj.borderRadius,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#f59e0b",
                        display: "block",
                      }}
                    >
                      {t.inProgress}
                    </span>
                    <strong style={{ fontSize: "18px", color: "#f59e0b" }}>
                      {pendingTasksCount}
                    </strong>
                  </div>
                </div>
              </div>

              <div
                className="synthwave-panel"
                style={{
                  background: currentThemeObj.colors[2],
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  {t.activeFocusTasks}
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTaskTitle.trim()) return;
                    setTasks([
                      ...tasks,
                      {
                        id: Date.now().toString(),
                        title: newTaskTitle.trim(),
                        completed: false,
                      },
                    ]);
                    setNewTaskTitle("");
                  }}
                  style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
                >
                  <input
                    type="text"
                    placeholder={t.addTaskPlaceholder}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{
                      flex: 1,
                      background: currentThemeObj.colors[2],
                      border: "1px solid var(--border-color)",
                      borderRadius: currentThemeObj.borderRadius,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: "11px",
                      outline: 0,
                    }}
                  />
                  <button
                    type="submit"
                    className="start-button"
                    style={{
                      borderRadius: currentThemeObj.borderRadius,
                      background: accentColor,
                      color: "#000",
                    }}
                  >
                    {t.add}
                  </button>
                </form>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: currentThemeObj.colors[2],
                        border: "1px solid var(--border-color)",
                        padding: "10px 14px",
                        borderRadius: currentThemeObj.borderRadius,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setTasks(
                            tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !t.completed }
                                : t,
                            ),
                          )
                        }
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                            color: task.completed
                              ? "var(--text-muted)"
                              : "#fff",
                          }}
                        >
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setTasks(tasks.filter((t) => t.id !== task.id))
                        }
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "#f87171",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* PANEL DERECHO */}
        <aside
          className={`focus-sidebar theme-sidebar-${currentTheme}`}
          style={{
            width: "320px",
            background: currentThemeObj.colors[2],
            borderLeft: "1px solid var(--border-color)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Pomodoro */}
          <div
            className={`pomodoro-widget theme-pomodoro-${currentTheme}${currentTheme === "upside-down" ? " vecna-clock-widget" : ""}`}
            style={{
              background: currentThemeObj.colors[2],
              border:
                currentTheme === "arcade-pixel"
                  ? "1px solid #ff00ff88"
                  : currentTheme === "upside-down"
                    ? "3px double #6f1024"
                    : `1px solid ${accentColor}44`,
              borderRadius: currentThemeObj.borderRadius,
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                }}
              >
                {t.pomodoro}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: isTimerRunning ? "#22c55e" : "var(--text-muted)",
                }}
              >
                {isTimerRunning ? t.running : t.paused}
              </span>
            </div>

            {currentTheme === "upside-down" && (
              <div className="vecna-clock-label">{t.vecnaClock}</div>
            )}
            {currentTheme === "synthwave" && (
              <div className="synthwave-clock-label">{t.retroClock}</div>
            )}
            {currentTheme === "arcade-pixel" && (
              <div className="arcade-clock-label">{t.arcadeClock}</div>
            )}

            <p
              style={{
                fontSize: "12px",
                fontWeight: 500,
                margin: "0 0 10px 0",
              }}
            >
              {t.focusTask}
            </p>

            <div
              className={`pomodoro-clock pomodoro-clock-${currentTheme}${isTimerRunning ? " is-running" : ""}`}
              data-theme={currentTheme}
              aria-label={`${t.pomodoro}: ${formatTime(timerSeconds)}`}
              style={{
                fontSize: "32px",
                fontWeight: 800,
                textAlign: "center",
                fontFamily: "monospace",
                marginBottom: "12px",
                color: accentColor,
                textShadow: currentThemeObj.shadowStyle,
                "--timer-progress": `${((25 * 60 - timerSeconds) / (25 * 60)) * 100}%`,
              } as React.CSSProperties}
            >
              {currentTheme === "arcade-pixel" ? (
                <>
                  {formatTime(timerSeconds).slice(0, 2)}
                  <span className="arcade-clock-separator">:</span>
                  {formatTime(timerSeconds).slice(3)}
                </>
              ) : (
                formatTime(timerSeconds)
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="start-button"
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "12px",
                  background: accentColor,
                  color: "#000",
                  borderRadius: currentThemeObj.borderRadius,
                }}
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                {isTimerRunning ? t.pause : t.start}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                style={{
                  background: "#1e1e28",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "8px",
                  color: "#fff",
                  cursor: "pointer",
                }}
                title={t.reset25}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Notas Rápidas */}
          <div
            className="quick-notes-widget"
            style={{
              background: currentThemeObj.colors[2],
              border:
                currentTheme === "arcade-pixel"
                  ? "1px solid #ff00ff88"
                  : `1px solid ${accentColor}55`,
              borderRadius: currentThemeObj.borderRadius,
              padding: "16px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              <span>{t.quickNotes}</span>
              <span
                className={`notes-save-status${isNotesEditing ? " is-live" : ""}`}
                style={{ color: isNotesEditing ? accentColor : "#22c55e" }}
              >
                <span
                  className="notes-status-dot"
                  style={{
                    background: isNotesEditing ? accentColor : "#22c55e",
                    boxShadow: `0 0 8px ${isNotesEditing ? accentColor : "#22c55e"}`,
                  }}
                />
                {isNotesEditing ? t.notesLive : t.notesSaved}
              </span>
            </div>
            <textarea
              placeholder={t.notesPlaceholder}
              value={notesText}
              onChange={(e) => {
                setNotesText(e.target.value);
                setIsNotesEditing(true);
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: 0,
                color: "#fff",
                fontSize: "12px",
                resize: "none",
                outline: 0,
                lineHeight: "1.5",
              }}
            />
          </div>
        </aside>
      </div>

      {isProfileSettingsOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsProfileSettingsOpen(false)}
        >
          <form
            className="modal-content profile-settings-modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveUserName}
          >
            <div className="profile-settings-heading">
              <div>
                <span className="profile-settings-eyebrow">{t.profileSettings}</span>
                <h2>{t.editName}</h2>
              </div>
              <button
                type="button"
                className="profile-settings-close"
                onClick={() => setIsProfileSettingsOpen(false)}
                aria-label={t.cancel}
              >
                <X size={18} />
              </button>
            </div>
            <input
              autoFocus
              required
              maxLength={40}
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder={t.namePlaceholder}
              aria-label={t.namePlaceholder}
            />
            <button type="submit" className="start-button profile-settings-save">
              {t.saveName}
            </button>
          </form>
        </div>
      )}

      {/* MODAL DE SELECCIÓN DE DISEÑOS / AMBIENTES Y FUENTES */}
      {isThemeModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsThemeModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "700px",
              maxWidth: "95%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: currentThemeObj.borderRadius,
              border: `1px solid ${accentColor}44`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Palette size={20} color={accentColor} />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: 0,
                    color: "#fff",
                  }}
                >
                  {t.themeSelector}
                </h3>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: "0 0 16px 0",
              }}
            >
              {t.themeDescription}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                background: "#141418",
                padding: "10px",
                borderRadius: currentThemeObj.borderRadius,
              }}
            >
              <Type size={16} color={accentColor} />
              <span
                style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}
              >
                {t.fontType}
              </span>
              <select
                value={customFont}
                onChange={(e) => setCustomFont(e.target.value as FontType)}
                style={{
                  background: "#0c0d12",
                  color: "#fff",
                  border: "1px solid var(--border-color)",
                  padding: "6px 10px",
                  borderRadius: currentThemeObj.borderRadius,
                  fontSize: "12px",
                  outline: 0,
                }}
              >
                <option value="default">{t.automaticTheme}</option>
                <option value="monospace">{t.monospaceFont}</option>
                <option value="sans">{t.sansFont}</option>
                <option value="serif">{t.serifFont}</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                overflowY: "auto",
                paddingRight: "4px",
                maxHeight: "45vh",
              }}
            >
              {themesList.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setCustomFont("default");
                    }}
                    style={{
                      background: isSelected
                        ? `${theme.colors[0]}15`
                        : "#141418",
                      border: isSelected
                        ? `2px solid ${theme.colors[0]}`
                        : "1px solid var(--border-color)",
                      borderRadius: currentThemeObj.borderRadius,
                      padding: "14px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "10px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: theme.colors[0],
                            textShadow: `0 0 10px ${theme.colors[0]}55`,
                            margin: 0,
                          }}
                        >
                          {theme.name}
                        </h4>
                        {isSelected && (
                          <span
                            className="theme-active-badge"
                            style={{
                              fontSize: "10px",
                              background: theme.colors[0],
                              color: "#000",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: currentThemeObj.borderRadius,
                            }}
                          >
                            {t.active}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          margin: 0,
                          lineHeight: "1.3",
                        }}
                      >
                        {theme.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        {theme.colors.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: c,
                              border: "1px solid rgba(255,255,255,0.2)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          fontFamily: "monospace",
                        }}
                      >
                        {t.activeAnimation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="start-button"
                style={{
                  padding: "8px 20px",
                  fontSize: "12px",
                  borderRadius: currentThemeObj.borderRadius,
                  background: accentColor,
                  color: "#000",
                }}
              >
                {t.closeSave}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AÑADIR ENLACE */}
      {isAddLinkOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              width: "420px",
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                {t.addGeneralLink}
              </h3>
              <button
                onClick={() => setIsAddLinkOpen(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={handleAddLink}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                placeholder={t.title}
                value={newLink.title}
                onChange={(e) =>
                  setNewLink({ ...newLink, title: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              />
              <input
                type="text"
                placeholder={t.url}
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              />
              <input
                type="text"
                placeholder={t.description}
                value={newLink.description}
                onChange={(e) =>
                  setNewLink({ ...newLink, description: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              />
              <select
                value={newLink.category}
                onChange={(e) =>
                  setNewLink({ ...newLink, category: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="start-button"
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: currentThemeObj.borderRadius,
                  background: accentColor,
                  color: "#000",
                }}
              >
                {t.saveLink}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CARPETA (CARRUSEL) */}
      {openFolderCategory && (
        <div
          className="modal-overlay"
          onClick={() => {
            setOpenFolderCategory(null);
            setIsAddLinkInFolderOpen(false);
            setIsAutoplayActive(false);
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "740px",
              maxWidth: "95%",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            <div>
              {currentFolderLinks.length > 0 && (
                <button
                  onClick={() => setIsAddLinkInFolderOpen(true)}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                    border: `1px solid ${accentColor}`,
                    color: accentColor,
                    padding: "6px 14px",
                    borderRadius: currentThemeObj.borderRadius,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: `0 0 10px ${accentColor}33`,
                  }}
                >
                  <span>{t.newLink}</span>
                </button>
              )}

              {/* Botón Cerrar (X) */}
              <button
                onClick={() => setOpenFolderCategory(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "20px",
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {currentFolderLinks.length === 0 ? (
              <div
                style={{
                  minHeight: "320px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px 16px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "420px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "32px 24px",
                    border: `1px solid ${accentColor}33`,
                    borderRadius: currentThemeObj.borderRadius,
                    background: `radial-gradient(ellipse at center, ${accentColor}12 0%, transparent 72%)`,
                  }}
                >
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      borderRadius: "50%",
                      color: accentColor,
                      background: `${accentColor}12`,
                      border: `1px solid ${accentColor}44`,
                      boxShadow: `0 0 24px ${accentColor}22`,
                    }}
                  >
                    <Folder size={30} strokeWidth={1.5} />
                  </div>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: 700,
                      textShadow: `0 0 12px ${accentColor}55`,
                    }}
                  >
                    {t.emptyGroup}
                  </h2>
                  <p
                    style={{
                      maxWidth: "320px",
                      margin: "0 0 24px",
                      color: "#a1a1aa",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.emptyGroupDescription}
                  </p>
                  <button
                    onClick={() => setIsAddLinkInFolderOpen(true)}
                    style={{
                      minWidth: "190px",
                      padding: "12px 22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      border: `1px solid ${accentColor}`,
                      borderRadius: currentThemeObj.borderRadius,
                      background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}66)`,
                      color: accentColor,
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: `0 0 22px ${accentColor}44, inset 0 0 12px ${accentColor}18`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Plus size={17} />
                    <span>{t.newLink}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="steam-carousel-wrapper"
                onMouseEnter={() => setIsHoveredOnCarousel(true)}
                onMouseLeave={() => setIsHoveredOnCarousel(false)}
              >
              <button
                onClick={() => scrollCarousel("left")}
                className="carousel-arrow-btn carousel-arrow-left"
                style={{
                  background:
                    currentTheme === "synthwave"
                      ? "linear-gradient(135deg, rgba(80, 20, 110, 0.9), rgba(20, 10, 45, 0.95))"
                      : "rgba(10, 12, 18, 0.85)",
                  border: `2px solid ${accentColor}`,
                  color: accentColor,
                  width: "42px",
                  height: "42px",
                  borderRadius: currentThemeObj.borderRadius,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `0 0 20px ${accentColor}44, inset 0 0 10px ${accentColor}22`,
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <div
                className="carousel-container"
                ref={carouselRef}
                style={{
                  display: "flex",
                  gap: "20px",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  padding: "16px calc(50% - 130px) 24px calc(50% - 130px)",
                  alignItems: "center",
                  scrollbarWidth: "none",
                }}
              >
                {currentFolderLinks.map((item, index) => {
                  const isActive = index === activeCardIndex;
                  return (
                    <div
                      key={item.id}
                      className={`carousel-card ${isActive ? "active-card" : ""}`}
                      onClick={() => {
                        if (isActive) {
                          handleOpenLink(item.url);
                        } else {
                          handleSelectCardIndex(index);
                        }
                      }}
                      style={{
                        minWidth: "270px",
                        maxWidth: "270px",
                        height: "220px",
                        flexShrink: 0,
                        scrollSnapAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "20px",
                        borderRadius: currentThemeObj.borderRadius,
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                        // DISEÑO ÚNICO Y TEXTURIZADO POR CADA TEMA DENTRO DEL MODAL:
                        background:
                          currentTheme === "synthwave"
                            ? "linear-gradient(135deg, rgba(60, 15, 85, 0.95) 0%, rgba(20, 8, 45, 0.98) 100%)"
                            : currentTheme === "matrix"
                              ? "linear-gradient(180deg, rgba(0, 45, 12, 0.8) 0%, rgba(2, 12, 3, 0.98) 100%)"
                              : currentTheme === "amber"
                                ? "linear-gradient(180deg, rgba(45, 30, 0, 0.9) 0%, rgba(10, 6, 0, 0.98) 100%)"
                                : currentTheme === "neon"
                                  ? "linear-gradient(135deg, rgba(0, 35, 60, 0.9) 0%, rgba(6, 10, 25, 0.98) 100%)"
                                  : currentTheme === "acid"
                                    ? "linear-gradient(135deg, rgba(35, 45, 5, 0.9) 0%, rgba(8, 10, 2, 0.98) 100%)"
                                    : currentThemeObj.colors[2],

                        // BORDES LÁSER Y ACTIVOS:
                        border: isActive
                          ? `2px solid ${accentColor}`
                          : `1px solid ${accentColor}55`,

                        // SOMBRAS EFEECTO HOLOGRÁFICO / CRT:
                        boxShadow: isActive
                          ? currentTheme === "synthwave"
                            ? "0 0 35px rgba(255, 0, 127, 0.4), inset 0 0 20px rgba(255, 123, 0, 0.15)"
                            : currentTheme === "matrix"
                              ? "0 0 30px rgba(0, 255, 65, 0.35), inset 0 0 15px rgba(0, 255, 65, 0.15)"
                              : currentTheme === "amber"
                                ? "0 0 30px rgba(255, 176, 0, 0.35), inset 0 0 15px rgba(255, 176, 0, 0.15)"
                                : currentTheme === "neon"
                                  ? "0 0 35px rgba(0, 240, 255, 0.4)"
                                  : currentTheme === "acid"
                                    ? "0 0 30px rgba(204, 255, 0, 0.4)"
                                    : "0 12px 30px rgba(0,0,0,0.6)"
                          : "0 6px 16px rgba(0,0,0,0.3)",
                        transform: isActive ? "scale(1.03)" : "scale(0.97)",
                        opacity: isActive ? 1 : 0.65,
                      }}
                    >
                      {/* CABECERA DE LA TARJETA */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: currentThemeObj.borderRadius,
                            background:
                              currentTheme === "synthwave"
                                ? "linear-gradient(135deg, #ff007f, #ff7b00)"
                                : accentColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: currentTheme === "minimal" ? "#fff" : "#000",
                            fontWeight: 800,
                            fontSize: "12px",
                            boxShadow: `0 0 10px ${accentColor}88`,
                          }}
                        >
                          {item.badge ||
                            item.title.substring(0, 2).toUpperCase()}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(item.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.2s",
                          }}
                          title={t.deleteLink}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* INFORMACIÓN DEL ENLACE */}
                      <div>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#ffffff",
                            marginBottom: "4px",
                            textShadow: `0 0 8px ${accentColor}55`,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#a1a1aa",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description || item.url}
                        </p>
                      </div>

                      {/* BOTÓN DE ACCIÓN / ABRIR ENLACE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLink(item.url);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: currentThemeObj.borderRadius,
                          background:
                            currentTheme === "synthwave"
                              ? "linear-gradient(90deg, #ff007f, #ff7b00)"
                              : accentColor,
                          color:
                            currentTheme === "minimal" ? "#ffffff" : "#000000",
                          fontWeight: 700,
                          fontSize: "12px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          boxShadow: `0 0 15px ${accentColor}66`,
                          transition: "filter 0.2s",
                        }}
                      >
                        <span>{t.openLink}</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                className="carousel-arrow-btn carousel-arrow-right"
                style={{
                  background:
                    currentTheme === "synthwave"
                      ? "linear-gradient(135deg, rgba(80, 20, 110, 0.9), rgba(20, 10, 45, 0.95))"
                      : "rgba(10, 12, 18, 0.85)",
                  border: `2px solid ${accentColor}`,
                  color: accentColor,
                  width: "42px",
                  height: "42px",
                  borderRadius: currentThemeObj.borderRadius,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `0 0 20px ${accentColor}44, inset 0 0 10px ${accentColor}22`,
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronRight size={20} />
              </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isAddLinkInFolderOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAddLinkInFolderOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              borderRadius: currentThemeObj.borderRadius,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                {openFolderCategory
                  ? t.addLinkTo(openFolderCategory)
                  : t.addGeneralLink}
              </h3>
              <button
                onClick={() => setIsAddLinkInFolderOpen(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={handleAddLinkDirectlyInFolder}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                placeholder={t.title}
                value={inFolderLinkTitle}
                onChange={(e) => setInFolderLinkTitle(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              />
              <input
                type="text"
                placeholder={t.url}
                value={inFolderLinkUrl}
                onChange={(e) => setInFolderLinkUrl(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: currentThemeObj.borderRadius,
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              />
              <button
                type="submit"
                className="start-button"
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: currentThemeObj.borderRadius,
                  background: accentColor,
                  color: "#000",
                }}
              >
                {t.saveLink}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
