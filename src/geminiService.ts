// src/geminiService.ts
export interface GeminiAction {
  action: "CREATE_FOLDER" | "ADD_LINK" | "ADD_TASK" | "START_POMODORO" | "NONE";
  payload?: any;
  reply: string;
}

const SYSTEM_INSTRUCTION = `
Eres la IA integrada en "Focus", una aplicación de escritorio cyberpunk.
Tu trabajo es interpretar los pedidos del usuario y responder SIEMPRE en formato JSON estricto.

Reglas de respuesta JSON:
1. Si el usuario pide crear una carpeta, añadir enlace, añadir tarea o iniciar pomodoro, devuelve la acción correspondiente.
2. Formato EXACTO a devolver:
{
  "action": "CREATE_FOLDER" | "ADD_LINK" | "ADD_TASK" | "START_POMODORO" | "NONE",
  "payload": { ... },
  "reply": "Mensaje de confirmación amigable para el usuario"
}

Estructuras de payload:
- Para crear carpeta: { "folderName": "NOMBRE_CARPETA" }
- Para añadir tarea: { "title": "Nombre de la tarea" }
- Para añadir enlace: { "title": "Nombre", "url": "https://...", "category": "CARPETA", "description": "Detalle", "badge": "XX" }
- Para pomodoro: { "minutes": 25, "sessionName": "Nombre sesión" }
- Para preguntas generales o saludos: action "NONE", payload {} y tu respuesta en "reply".
`;

export async function consultarGeminiConComandos(
  promptUsuario: string,
  apiKey: string
): Promise<GeminiAction> {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_INSTRUCTION}\n\nInstrucción del usuario: ${promptUsuario}` }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || `Error HTTP ${response.status}`;
      throw new Error(msg);
    }

    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Limpiamos bloques markdown por si Gemini devuelve formato ```json ... ```
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
        const parsed: GeminiAction = JSON.parse(jsonString);
        return parsed;
      }
    } catch (e) {
      console.warn("Respuesta en texto plano de la IA:", rawText);
    }

    return {
      action: "NONE",
      reply: rawText || "¡Hola, Daniel! Comando procesado correctamente."
    };

  } catch (error: any) {
    console.error("Error conectando con Gemini API:", error);
    return {
      action: "NONE",
      reply: `No se pudo conectar con los servidores de Gemini. Revisa que tu API Key sea válida o intenta de nuevo en unos segundos.`
    };
  }
}