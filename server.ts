import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // Lazy-init Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Brief Generation Endpoint
  app.post("/api/generate-brief", async (req, res) => {
    try {
      const {
        primaryKeyword,
        businessContext,
        targetAudience,
        contentGoal,
        contentType,
        additionalNotes,
      } = req.body;

      if (!primaryKeyword || !primaryKeyword.trim()) {
        res.status(400).json({ error: "Primary keyword is required." });
        return;
      }

      if (!businessContext || !businessContext.trim()) {
        res.status(400).json({ error: "Business context is required." });
        return;
      }

      const ai = getGeminiClient();

      const userPrompt = `
Generate a comprehensive, writer-ready SEO content brief based on the following input:

Target Primary Keyword: "${primaryKeyword.trim()}"
Business Context & Brand: "${businessContext.trim()}"
${targetAudience ? `Target Audience Persona: "${targetAudience.trim()}"` : ""}
${contentGoal ? `Content Goal / Conversion Aim: "${contentGoal.trim()}"` : ""}
${contentType ? `Content Format / Type: "${contentType.trim()}"` : ""}
${additionalNotes ? `Additional Instructions / Constraints: "${additionalNotes.trim()}"` : ""}

Remember to strictly abide by these rules:
- Prioritize search intent and genuine user usefulness.
- Avoid keyword stuffing; emphasize natural semantic relevance.
- Do not invent search volume, keyword difficulty, rankings, competitor statistics or SERP data.
- Do not claim that an article will rank.
- If information would require live search data, clearly identify it as a strategic recommendation or estimate.
- Keep the output professional, highly practical and easy for a content writer to produce without ambiguity.

Generate the complete brief adhering exactly to the structure required:
# AI SEO CONTENT BRIEF
## 1. Primary Keyword
## 2. Search Intent
## 3. Target Audience
## 4. Content Goal
## 5. Recommended SEO Title
## 6. Secondary Keywords
## 7. Recommended Word Count
## 8. Content Outline
(Detail H1, H2, and useful H3 sections with key points for each)
## 9. People-Also-Ask Questions
## 10. Unique Content Angle
## 11. Internal Link Opportunities
## 12. Recommended CTA
## 13. Writer Instructions
## 14. Quality Checklist
`;

      const systemInstruction = `You are an expert SEO Content Strategist and AI Content Brief Generator.
Your job is to transform a user's target keyword and business context into a practical, writer-ready SEO content brief.

Your brief must include:
1. Primary keyword
2. Search intent
3. Target audience
4. Content goal
5. Recommended SEO title
6. Secondary keywords
7. Recommended word count
8. Detailed content outline with H1, H2 and useful H3 sections
9. People-Also-Ask-style questions
10. A unique content angle
11. Internal link opportunities
12. Recommended CTA
13. Writer instructions
14. Quality Checklist

Rules:
- Prioritize search intent and usefulness.
- Avoid keyword stuffing.
- Do not invent search volume, keyword difficulty, rankings, competitor statistics or SERP data.
- Do not claim that an article will rank.
- If information would require live search data, clearly identify it as a recommendation or estimate.
- Keep the output professional, practical and easy for a content writer to use.

Use this output structure:

# AI SEO CONTENT BRIEF

## 1. Primary Keyword

## 2. Search Intent

## 3. Target Audience

## 4. Content Goal

## 5. Recommended SEO Title

## 6. Secondary Keywords

## 7. Recommended Word Count

## 8. Content Outline

### H1

### H2

### H2

### H2

### H2

### H2

### H2

## 9. People-Also-Ask Questions

## 10. Unique Content Angle

## 11. Internal Link Opportunities

## 12. Recommended CTA

## 13. Writer Instructions

## 14. Quality Checklist
`;

      const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let markdown = "";
      let lastError: unknown = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          markdown = response.text || "";
          if (markdown) {
            break;
          }
        } catch (err: unknown) {
          console.warn(`Model ${modelName} failed, trying fallback:`, err);
          lastError = err;
          // small delay before fallback
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      if (!markdown && lastError) {
        throw lastError;
      }

      res.json({
        success: true,
        briefMarkdown: markdown,
        generatedAt: new Date().toISOString(),
        primaryKeyword: primaryKeyword.trim(),
      });
    } catch (err: unknown) {
      console.error("Error generating brief:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred while generating the brief.";
      res.status(500).json({ error: message });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
