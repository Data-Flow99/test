
import { GoogleGenAI, Type } from "@google/genai";
import { RiskLevel } from "./types";

const getAIInstance = () => {
  // 实时从环境变量读取，以支持 openSelectKey 注入后的动态更新
  let apiKey = (process.env.API_KEY || (process.env as any).GEMINI_API_KEY)?.trim();
  
  // 识别并过滤无效占位符
  if (!apiKey || 
      apiKey === 'undefined' || 
      apiKey === 'PLACEHOLDER_API_KEY' || 
      apiKey.includes("YOUR_API_KEY") || 
      apiKey.length < 10) {
    apiKey = "";
  }
  
  return new GoogleGenAI({ apiKey: apiKey });
};

/**
 * 诊断工具：检查 API 密钥是否有效。
 */
export const testApiKeyConnectivity = async () => {
  try {
    const ai = getAIInstance();
    // 使用规范定义的 Flash Lite 模型进行探测
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: "Diagnostic Ping. Reply with 'OK'.",
    });
    return { success: true, message: response.text || "Connection established." };
  } catch (error: any) {
    console.error("Diagnostic Error:", error);
    
    let userFriendlyMsg = error.message || "Unknown connectivity error";
    let shouldResetKey = false;

    // 捕获 Requested entity was not found (404)
    if (userFriendlyMsg.includes("Requested entity was not found") || error.status === 404) {
      userFriendlyMsg = "错误 404: 找不到请求的模型或 API Key 权限不足。请确保选择了开启计费的 Paid Project 并重新授权。";
      shouldResetKey = true;
    } 
    else if (userFriendlyMsg.includes("API key not valid") || error.status === 400) {
      userFriendlyMsg = "API Key 无效。请检查部署平台的环境变量或重新连接。";
      shouldResetKey = true;
    }

    return { 
      success: false, 
      message: userFriendlyMsg,
      shouldResetKey: shouldResetKey,
      status: error.status || "FAILED"
    };
  }
};

export const analyzeRisk = async (scenario: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are the Polaris OS Cognitive Engine. Analyze this scenario using the "Structural Aversion Playbook" framework.
    Focus on these specific axes:
    1. Chronic Degradation
    2. Irreversible Inflection
    3. Judgment Sovereignty
    Scenario: ${scenario}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          axes: {
            type: Type.OBJECT,
            properties: {
              chronicDegradation: { type: Type.NUMBER },
              irreversibleInflection: { type: Type.NUMBER },
              judgmentSovereignty: { type: Type.NUMBER }
            },
            required: ["chronicDegradation", "irreversibleInflection", "judgmentSovereignty"]
          },
          riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          summary: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["axes", "riskLevel", "summary", "recommendations"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeGlobalResonance = async (event: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As the Polaris Global Intelligence Engine, analyze this global event: "${event}".
    Perform a 3rd-order ripple deduction focusing on Geopolitical Entropy and Sovereign Risk.
    Explain your reasoning path clearly.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ripples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                order: { type: Type.NUMBER },
                impact: { type: Type.STRING },
                probability: { type: Type.NUMBER }
              },
              required: ["order", "impact", "probability"]
            }
          },
          reasoningPath: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step logic nodes" },
          protocolUpdates: { type: Type.ARRAY, items: { type: Type.STRING } },
          entropyScore: { type: Type.NUMBER }
        },
        required: ["ripples", "reasoningPath", "protocolUpdates", "entropyScore"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const calibrateProtocol = async (prediction: any, reality: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `CALIBRATION SESSION:
    Original Prediction: ${JSON.stringify(prediction.ripples)}
    Actual Outcome: "${reality}"
    
    Tasks:
    1. Identify the logic gap.
    2. Extract the 'Cognitive Crystal' (a new rule for future scans).
    3. Show the thinking trace of this calibration.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gapAnalysis: { type: Type.STRING },
          thinkingTrace: { type: Type.ARRAY, items: { type: Type.STRING } },
          calibrationDelta: { type: Type.NUMBER },
          cognitiveCrystal: { 
            type: Type.OBJECT, 
            properties: {
              rule: { type: Type.STRING },
              weightAdjustment: { type: Type.STRING }
            },
            required: ["rule", "weightAdjustment"]
          },
          biasWarning: { type: Type.STRING }
        },
        required: ["gapAnalysis", "thinkingTrace", "calibrationDelta", "cognitiveCrystal", "biasWarning"]
      }
    }
  });
  
  return {
    data: JSON.parse(response.text),
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const analyzePowerDynamics = async (actors: any[], relationships: any[]) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze power dynamics: ${JSON.stringify({actors, relationships})}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instabilityPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          leveragePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          strategicAdvice: { type: Type.STRING }
        },
        required: ["instabilityPoints", "leveragePoints", "strategicAdvice"]
      }
    }
  });
  return JSON.parse(response.text);
};
