export default {
  getGenerativeModel: ({ model }: { model: string }) => {
    return {
      generateContent: async (prompt: string) => {
        try {
          console.log("Sending request to Gemini API with prompt:", prompt);

          const response = await fetch("https://api.gemini-model.com/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
            },
            body: JSON.stringify({ model, prompt }),
          });

          if (!response.ok) {
            console.error("Gemini API response status:", response.status);
            const errorText = await response.text();
            console.error("Gemini API response error:", errorText);
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          console.log("Gemini API response:", data);
          return data;
        } catch (error) {
          console.error("Error in generateContent:", error);
          throw error;
        }
      },
    };
  },
};