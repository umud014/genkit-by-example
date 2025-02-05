# Human-in-the-Loop

This chatbot has an **interrupt** tool that allows it to ask the user questions with a structured UI. By default, it is set to act like a trivia host (although it's likely to hallucinate some of the answers).

Interrupts allow you to combine automatic tool execution (for e.g. fetching data) with the ability for the LLM to selectively pause the generation loop when out-of-band input is required.

## Things to Try

- Send a trivia topic like "1990s movies"
- Try sending a new chat message instead of using the UI to respond.
- Set the system message to something different, like `You are an event planner. I'll give you a type of event, then ask me clarifying questions using the askQuestion function to plan a great party. Keep examining past responses to formulate a plan. When you have enough information, generate a detailed party plan in Markdown syntax.`
