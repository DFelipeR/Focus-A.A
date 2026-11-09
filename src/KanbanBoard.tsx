import React, { useState, useEffect } from "react";
import { Plus, Trash2, Clock, CheckCircle2, AlertCircle, PlayCircle, GripVertical, X, Edit3 } from "lucide-react";

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
}

const kanbanTranslations = {
  es: {
    title: "Tablero de Proyectos y Objetivos",
    description:
      "Haz clic en cualquier tarjeta para ver su descripción o arrástrala entre columnas.",
    newTask: "Nueva Tarea",
    columns: {
      BACKLOG: "Por Hacer",
      IN_PROGRESS: "En Progreso",
      REVIEW: "En Revisión",
      DONE: "Completado",
    },
    deleteTask: "Eliminar tarea",
    dragHere: "Arrastra elementos aquí",
    details: "DESCRIPCIÓN DETALLADA",
    detailsPlaceholder: "Escribe detalles, notas o subtareas aquí...",
    autoSave: "* Los cambios se guardan automáticamente.",
    close: "Cerrar",
    newKanbanTask: "Nueva Tarea en Kanban",
    titlePlaceholder: "Título de la tarea...",
    descriptionPlaceholder: "Descripción detallada (opcional)...",
    cancel: "Cancelar",
    createTask: "Crear Tarea",
  },
  en: {
    title: "Projects and Goals Board",
    description:
      "Click any card to view its description, or drag it between columns.",
    newTask: "New Task",
    columns: {
      BACKLOG: "To Do",
      IN_PROGRESS: "In Progress",
      REVIEW: "In Review",
      DONE: "Completed",
    },
    deleteTask: "Delete task",
    dragHere: "Drag items here",
    details: "DETAILED DESCRIPTION",
    detailsPlaceholder: "Add details, notes or subtasks here...",
    autoSave: "* Changes are saved automatically.",
    close: "Close",
    newKanbanTask: "New Kanban Task",
    titlePlaceholder: "Task title...",
    descriptionPlaceholder: "Detailed description (optional)...",
    cancel: "Cancel",
    createTask: "Create Task",
  },
};

export default function KanbanBoard({ lang }: { lang: "es" | "en" }) {
  const t = kanbanTranslations[lang];
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem("focus_kanban_tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Diseñar interfaz Cyberpunk",
            description: "Ajustar colores neón y componentes visuales para la versión final de escritorio con Tauri.",
            status: "DONE",
          },
          {
            id: "2",
            title: "Configurar integraciones externas",
            description: "Organizar las conexiones necesarias para el espacio de trabajo.",
            status: "IN_PROGRESS",
          },
          {
            id: "3",
            title: "Compilar ejecutable con Tauri",
            description: "Probar el .exe en entorno de producción Windows y verificar rendimiento general.",
            status: "BACKLOG",
          },
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<KanbanTask["status"]>("BACKLOG");

  // Estado para el modal de detalle de la tarea seleccionada
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<KanbanTask | null>(null);

  // Estado para el arrastre libre con el ratón
  const [draggingTask, setDraggingTask] = useState<KanbanTask | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    localStorage.setItem("focus_kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: newTaskStatus,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (selectedTaskForModal?.id === id) {
      setSelectedTaskForModal(null);
    }
  };

  const handleUpdateTaskDesc = (newDesc: string) => {
    if (!selectedTaskForModal) return;
    const updated = { ...selectedTaskForModal, description: newDesc };
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTaskForModal(updated);
  };

  // --- ARRASTRE FLUIDO ESTILO NOTION ---
  const handleMouseDown = (e: React.MouseEvent, task: KanbanTask) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setHasMoved(false);
    setDraggingTask(task);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingTask) return;
      const dist = Math.abs(e.clientX - mousePos.x) + Math.abs(e.clientY - mousePos.y);
      if (dist > 5) setHasMoved(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingTask) return;

      if (hasMoved) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const columnElement = elements.find((el) => el.hasAttribute("data-column-id"));

        if (columnElement) {
          const targetStatus = columnElement.getAttribute("data-column-id") as KanbanTask["status"];
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === draggingTask.id ? { ...t, status: targetStatus } : t))
          );
        }
      } else {
        setSelectedTaskForModal(draggingTask);
      }

      setDraggingTask(null);
      setHasMoved(false);
    };

    if (draggingTask) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingTask, hasMoved, mousePos]);

  const columns: { id: KanbanTask["status"]; icon: any; color: string }[] = [
    { id: "BACKLOG", icon: Clock, color: "#8e8e93" },
    { id: "IN_PROGRESS", icon: PlayCircle, color: "#00f0ff" },
    { id: "REVIEW", icon: AlertCircle, color: "#f59e0b" },
    { id: "DONE", icon: CheckCircle2, color: "#22c55e" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", position: "relative" }}>
      {/* Cabecera del Kanban */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#fff" }}>
            {t.title}
          </h2>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
            {t.description}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="start-button"
          style={{ fontSize: "11px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={14} /> {t.newTask}
        </button>
      </div>

      {/* Columnas del Kanban con diseño mejorado y profundidad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          flex: 1,
          alignItems: "start",
        }}
      >
        {columns.map((col) => {
          const Icon = col.icon;
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              data-column-id={col.id}
              style={{
                background: "linear-gradient(180deg, rgba(20, 20, 24, 0.95) 0%, rgba(12, 13, 18, 0.95) 100%)",
                border: "1px solid var(--border-color)",
                borderTop: `3px solid ${col.color}`,
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                minHeight: "480px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} data-column-id={col.id}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }} data-column-id={col.id}>
                  <div
                    style={{
                      background: `${col.color}15`,
                      padding: "6px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={15} color={col.color} />
                  </div>
                  <h3 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "#fff", letterSpacing: "0.3px" }}>
                    {t.columns[col.id]}
                  </h3>
                </div>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }} data-column-id={col.id}>
                {colTasks.map((task) => {
                  const isBeingDragged = draggingTask?.id === task.id && hasMoved;
                  return (
                    <div
                      key={task.id}
                      onMouseDown={(e) => handleMouseDown(e, task)}
                      style={{
                        background: "#1c1c26",
                        border: isBeingDragged ? "1px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        opacity: isBeingDragged ? 0.3 : 1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        userSelect: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = col.color;
                        e.currentTarget.style.background = "#222230";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.background = "#1c1c26";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                        <GripVertical size={14} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
                        <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {task.title}
                        </h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "#f87171",
                          cursor: "pointer",
                          padding: "4px",
                          flexShrink: 0,
                          opacity: 0.7,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                        title={t.deleteTask}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div
                    style={{
                      flex: 1,
                      display: "grid",
                      placeItems: "center",
                      border: "1px dashed rgba(255, 255, 255, 0.06)",
                      borderRadius: "10px",
                      padding: "20px",
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      textAlign: "center",
                      background: "rgba(0, 0, 0, 0.15)",
                    }}
                    data-column-id={col.id}
                  >
                    {t.dragHere}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarjeta flotante que sigue el cursor al arrastrar */}
      {draggingTask && hasMoved && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x - 130,
            top: mousePos.y - 25,
            width: "260px",
            background: "#1c1c26",
            border: "1px solid #00f0ff",
            borderRadius: "10px",
            padding: "12px 14px",
            boxShadow: "0 10px 25px rgba(0, 240, 255, 0.4)",
            pointerEvents: "none",
            zIndex: 9999,
            transform: "rotate(2deg)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GripVertical size={14} color="#00f0ff" />
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>
              {draggingTask.title}
            </h4>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE TAREA */}
      {selectedTaskForModal && (
        <div className="modal-overlay" onClick={() => setSelectedTaskForModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "460px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={18} color="#00f0ff" />
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#fff" }}>
                  {selectedTaskForModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTaskForModal(null)}
                style={{ background: "transparent", border: 0, color: "#fff", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "1px" }}>
                {t.details}
              </label>
              <textarea
                value={selectedTaskForModal.description}
                onChange={(e) => handleUpdateTaskDesc(e.target.value)}
                placeholder={t.detailsPlaceholder}
                style={{
                  width: "100%",
                  height: "140px",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                  resize: "none",
                  lineHeight: "1.5",
                }}
              />
              <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                {t.autoSave}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setSelectedTaskForModal(null)}
                  className="start-button"
                  style={{ padding: "8px 18px", fontSize: "11px" }}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para añadir nueva tarea */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "400px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 16px 0", color: "#fff" }}>
              {t.newKanbanTask}
            </h3>
            <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder={t.titlePlaceholder}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
                autoFocus
              />
              <textarea
                placeholder={t.descriptionPlaceholder}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                  resize: "none",
                  height: "80px",
                }}
              />
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as KanbanTask["status"])}
                style={{
                  width: "100%",
                  background: "#141418",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  outline: 0,
                }}
              >
                <option value="BACKLOG">{t.columns.BACKLOG}</option>
                <option value="IN_PROGRESS">{t.columns.IN_PROGRESS}</option>
                <option value="REVIEW">{t.columns.REVIEW}</option>
                <option value="DONE">{t.columns.DONE}</option>
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#141418",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  {t.cancel}
                </button>
                <button type="submit" className="start-button" style={{ padding: "8px 16px", fontSize: "11px" }}>
                  {t.createTask}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}