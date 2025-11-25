import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure API key is set in environment

export const diagnoseIssue = async (
  deviceType: string,
  description: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key not found. Mocking response.");
    return "ระบบ AI ไม่พร้อมใช้งาน (กรุณาตรวจสอบ API Key)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a specific prompt for IT support context in Thai
    const prompt = `
      คุณเป็นผู้เชี่ยวชาญด้าน IT Support (Senior IT Support Specialist)
      
      ข้อมูลอุปกรณ์: ${deviceType}
      อาการที่ได้รับแจ้ง: "${description}"
      
      กรุณาวิเคราะห์สาเหตุที่เป็นไปได้เบื้องต้น และแนะนำวิธีแก้ไขปัญหาเบื้องต้นสั้นๆ (ไม่เกิน 3 ข้อ) เป็นภาษาไทย
      เพื่อให้เจ้าหน้าที่ IT เตรียมเครื่องมือหรืออะไหล่ได้ถูกต้อง
      
      รูปแบบการตอบ: 
      "สาเหตุที่เป็นไปได้: ... 
       คำแนะนำ: ..."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "ไม่สามารถวิเคราะห์ข้อมูลได้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI";
  }
};