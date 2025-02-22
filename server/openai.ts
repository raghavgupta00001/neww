import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function checkPlagiarism(text: string): Promise<{
  aiScore: number;
  plagiarismScore: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "PlagiCheck Analysis: Analyze the following text and provide two scores: 1) likelihood it was AI generated (0-100), 2) likelihood it was plagiarized (0-100). Provide scores in JSON format: { 'aiScore': number, 'plagiarismScore': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content);
    return {
      aiScore: Math.min(100, Math.max(0, result.aiScore)),
      plagiarismScore: Math.min(100, Math.max(0, result.plagiarismScore)),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return { aiScore: 0, plagiarismScore: 0 };
  }
}