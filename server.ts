import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit for base64 image payloads
  app.use(express.json({ limit: "50mb" }));

  // Shared Gemini client initializer
  let aiClient: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
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
  };

  // API Route: AI Product Showcase Image Generation
  app.post("/api/generate-showcase", async (req, res) => {
    try {
      const { prompt, images, style } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ success: false, error: "Prompt is required." });
      }

      if (!images || !Array.isArray(images) || images.length < 2) {
        return res.status(400).json({ success: false, error: "At least 2 reference product images are required." });
      }

      const client = getAiClient();

      // Format input reference images for Gemini API
      const parts: any[] = [];
      images.forEach((img: { data: string; mimeType: string; angle?: string }, index: number) => {
        parts.push({
          text: `[Product Reference Image ${index + 1} - ${img.angle || 'Angle'} View]`,
        });
        parts.push({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType || "image/jpeg",
          },
        });
      });

      // Append prompt directive
      parts.push({ text: prompt });

      const contents = { parts };

      // Candidate models for image generation in priority order
      const candidateModels = [
        {
          name: "gemini-3.1-flash-lite-image",
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        },
        {
          name: "gemini-3.1-flash-image",
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K",
            },
          },
        },
        {
          name: "gemini-3-pro-image",
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K",
            },
          },
        },
      ];

      let response: any = null;
      let usedModel: string = "";
      let lastError: any = null;

      for (const candidate of candidateModels) {
        try {
          console.log(`[Gemini API] Attempting image generation with model: ${candidate.name}...`);
          response = await client.models.generateContent({
            model: candidate.name,
            contents,
            config: candidate.config,
          });
          usedModel = candidate.name;
          console.log(`[Gemini API] Successfully generated content with model: ${usedModel}`);
          break;
        } catch (modelError: any) {
          lastError = modelError;
          console.warn(`[Gemini API] Model ${candidate.name} failed:`, modelError?.message || modelError);
          
          const errStr = String(modelError?.message || modelError || "");
          // Check for quota (429) or permissions (403)
          if (errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("429") || errStr.toLowerCase().includes("quota")) {
            return res.status(429).json({
              success: false,
              error: "Gemini API Quota/Rate Limit Exceeded (429): Your Gemini API key or account quota has been reached. Please check your account quota or billing tier in Google AI Studio.",
              model: candidate.name,
            });
          }
          if (errStr.includes("PERMISSION_DENIED") || errStr.includes("403") || errStr.toLowerCase().includes("api key")) {
            return res.status(403).json({
              success: false,
              error: "Gemini API Access Denied (403): The configured API key is unauthorized or lacks permission for image generation.",
              model: candidate.name,
            });
          }
        }
      }

      if (!response && lastError) {
        const errMsg = lastError?.message || String(lastError);
        return res.status(500).json({
          success: false,
          error: `Gemini API Error: ${errMsg}`,
        });
      }

      let generatedImageUrl: string | null = null;
      let textResponse = "";

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64Data = part.inlineData.data;
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${base64Data}`;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          imageUrl: generatedImageUrl,
          text: textResponse,
          model: usedModel,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: textResponse || "Gemini model responded with text but did not return a generated image. Please try again with different inputs.",
          model: usedModel,
        });
      }
    } catch (error: any) {
      console.error("[Gemini API] Server endpoint error:", error);
      const errMsg = error?.message || "An unexpected error occurred during image generation.";
      const status = error?.status || 500;
      return res.status(status).json({
        success: false,
        error: errMsg,
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
