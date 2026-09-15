// AI Task Decomposition Service
// Supports Google Gemini API with smart contextual heuristic fallback

export const decomposeTaskWithAI = async ({ title, description = "", category = "Work" }) => {
  const cleanTitle = title?.trim() || "";
  const cleanDesc = description?.trim() || "";

  // 1. Try Google Gemini API if key is present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `You are a productivity expert. Break down the following task into 3 to 5 clear, concise, actionable subtask titles.
Task Title: "${cleanTitle}"
Description: "${cleanDesc}"
Category: "${category}"

Return ONLY a valid JSON array of strings, with no markdown formatting, backticks, or extra text. Example: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 250 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (rawText) {
          // Clean JSON markdown wraps if present
          const sanitized = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(sanitized);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({
              title: typeof item === "string" ? item.trim() : String(item.title || item),
              completed: false,
            }));
          }
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart contextual engine:", err.message);
    }
  }

  // 2. Intelligent Contextual Decomposition Engine (Zero-config fallback)
  return generateContextualSubtasks(cleanTitle, cleanDesc, category);
};

const generateContextualSubtasks = (title, description, category) => {
  const lower = `${title} ${description}`.toLowerCase();
  const subtasks = [];

  // Software & Development
  if (/bug|fix|error|issue|crash|patch|exception/.test(lower)) {
    subtasks.push("Reproduce issue and inspect stack trace logs");
    subtasks.push("Isolate root cause in component or service logic");
    subtasks.push("Implement fix and add regression test coverage");
    subtasks.push("Verify fix locally and deploy patch");
  } else if (/api|backend|endpoint|database|mongo|schema|server/.test(lower)) {
    subtasks.push("Design data schema and request validation rules");
    subtasks.push("Implement controller logic and route middleware");
    subtasks.push("Test endpoint with sample payloads in Postman or curl");
    subtasks.push("Add error handling and documentation");
  } else if (/frontend|ui|page|component|css|design|modal|dashboard/.test(lower)) {
    subtasks.push("Review UI specifications and responsive layout");
    subtasks.push("Build core component structure and state bindings");
    subtasks.push("Refine hover states, micro-animations, and theme styles");
    subtasks.push("Test cross-browser compatibility and mobile viewport");
  } else if (/feature|build|create|implement|add/.test(lower)) {
    subtasks.push(`Outline specifications and requirements for ${title}`);
    subtasks.push("Set up foundational data structures and handlers");
    subtasks.push("Develop core feature workflows and edge cases");
    subtasks.push("Perform end-to-end verification and code polish");
  }
  // Writing, Documentation & Presentation
  else if (/report|doc|readme|write|blog|article|proposal/.test(lower)) {
    subtasks.push("Gather key reference data and core objectives");
    subtasks.push("Draft initial outline and key section headers");
    subtasks.push("Write complete first draft with practical examples");
    subtasks.push("Proofread, format typography, and export final copy");
  } else if (/presentation|slides|pitch|demo/.test(lower)) {
    subtasks.push("Define narrative arc and key audience takeaways");
    subtasks.push("Draft slide outline and assemble visual assets");
    subtasks.push("Build high-impact slide deck with concise bullet points");
    subtasks.push("Do dry-run walkthrough and check timing");
  }
  // Meetings & Coordination
  else if (/meeting|call|sync|discuss|interview|review/.test(lower)) {
    subtasks.push("Prepare talking points and meeting agenda");
    subtasks.push("Collect background materials and open questions");
    subtasks.push("Conduct discussion and document action items");
    subtasks.push("Send follow-up summary notes to participants");
  }
  // Personal & Health
  else if (category === "Personal" || /grocery|buy|shop|workout|gym|health|clean|trip|travel/.test(lower)) {
    subtasks.push(`Define specific goals and items for ${title}`);
    subtasks.push("Schedule dedicated time block in calendar");
    subtasks.push("Execute primary tasks and clear action items");
    subtasks.push("Review completion and set next follow-up");
  }
  // Urgent Actions
  else if (category === "Urgent" || /urgent|asap|critical|immediate/.test(lower)) {
    subtasks.push("Assess immediate blockers and identify fast resolution path");
    subtasks.push("Execute highest-priority fix or response");
    subtasks.push("Notify relevant stakeholders of status");
    subtasks.push("Conduct brief post-mortem to avoid recurrence");
  }
  // Default General Productivity Flow
  else {
    subtasks.push(`Clarify scope and acceptance criteria for "${title}"`);
    subtasks.push("Complete initial groundwork and primary action steps");
    subtasks.push("Review progress and resolve remaining details");
    subtasks.push("Finalize deliverable and mark complete");
  }

  return subtasks.map((t) => ({ title: t, completed: false }));
};
