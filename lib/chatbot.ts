export async function getChatbotResponse(message: string): Promise<string> {
  // Simulate a chatbot response
  const responses: { [key: string]: string } = {
    hello: "Hi there! How can I assist you today?",
    help: "Sure, I'm here to help! Please ask your question.",
    pneumonia: "Pneumonia is an infection that inflames the air sacs in the lungs.",
  };

  return responses[message.toLowerCase()] || "I'm sorry, I didn't understand that.";
}