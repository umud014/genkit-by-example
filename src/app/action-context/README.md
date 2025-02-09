# Action Context Chatbot

This demo showcases how action context can provide useful "priming" for a prompt as well as help you secure tool calls and avoid security issues when calling the LLM. When you choose a user above, information about the user is added to the action context which is included in the system prompt that drives the chat as well as the tools that are called.

Each user is in one or more groups. There is an `upcomingEvents` tool that will list upcoming events that the user can see (only public events and those of their group):

- `mammals`: sloth, koala, and panda are members
- `slowpokes`: sloth and turtle are members
- `bearish`: koala and panda are members

## Things to Try

- Ask the bot "who am I?". Switch users and ask it again.
- Ask the bot "what should I eat for dinner" as different users.
- Ask the bot "any upcoming events with trivia?" and inspect the source of the result.
- Ask the bot for upcoming events from a specific group while unauthenticated.
- Ask the for upcoming events of a group of which your user is a member.
- Ask the bot upcoming events of a group of which your user is not a member.

## Things to Notice

- **Security through context.** Because the action context is available to the tool and deterministic logic determines which events are returned to the user, there is no way to "trick" the LLM into disclosing information it shouldn't, even if you ask it explicitly for information from a group the current user cannot access.
- **Hidden tool usage.** In this example, the model makes tool calls invisibly behind the scenes. For an example where tool calls are shown as custom UI, see the [Tool Calling](/tool-calling) example.
