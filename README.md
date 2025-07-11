
# Matrix Operator Console

Welcome, Neo. You've jacked into the Matrix Operator Console, a fully interactive, themeable chatbot and developer toolkit inspired by the world of *The Matrix*. This isn't just a command line; it's a connection to the Oracle, the Architect, and the core systems that run the simulation.

Ask questions, generate code, summarize web pages, and access a suite of developer utilities, all from a retro-themed terminal interface.

**➡️ Live Website: [wakeupneo.chat]([https://matrix-chatbot-neo.onrender.com](https://wakeupneo.onrender.com/))** 
*(Replace with your actual Render URL!)*


*(A screenshot of the live application)*

---

## Command Showcase (How to Use)

Here are a few examples of the core commands in action.

#### 1. Asking the Oracle
Use the `ask()` command for general-purpose questions. The AI will respond in the persona of the Oracle.

```
ask("Is choice an illusion?")
```


#### 2. Generating Code
Use `generate_code()` to get functional code snippets from the Architect.

```
generate_code(lang:"python", task:"a function to find prime numbers")
```


#### 3. Summarizing a Web Page
Use `find_exit()` to get a quick, thematic summary of any article.

```
find_exit(https://en.wikipedia.org/wiki/Simulacra_and_Simulation)
```


#### 4. Changing the Theme
Use `set_theme()` to switch between different visual styles.

```
set_theme(amber)
```


---

## Features

This console is powered by a Node.js & Express backend connected to the blazing-fast Groq API, with a vanilla JavaScript frontend to keep things lightweight and responsive.

### 🧠 AI-Powered Commands
*   **`ask("your question")`**: Connect directly to the Oracle for wise, enigmatic, and sometimes cryptic answers to any question.
*   **`generate_code(lang:"...", task:"...")`**: Access the Architect's toolbox to generate functional code snippets in any programming language.
*   **`find_exit(URL)`**: Provide a URL to an article or website, and the operator will trace its core meaning, providing a concise summary.

### 🛠️ Operator Utilities
*   **`fabricate_data(...)`**: Generate structured mock data in JSON format using a simple schema.
*   **`generate_key(...)`**: Create cryptographically strong, random passwords with customizable length and character sets.
*   **`process_data(...)`**: Encode text to Base64, decode it back, or generate a SHA-256 hash.

### 🎨 Console & Theming
*   **`set_theme(theme_name)`**: Change the entire console's color scheme. Current themes: `amber`, `sentinel_blue`, and the default `matrix_green`.
*   **`alias(shortcut, command)`**: Create your own custom command shortcuts.
*   **`clear`**: Clears the terminal output.
*   **Command History**: Use the `Up` and `Down` arrow keys to cycle through your previous commands.

---

## Tech Stack

*   **Frontend**: HTML5, CSS3, Vanilla JavaScript
*   **Backend**: Node.js, Express.js
*   **AI Engine**: Groq API (using the Llama 3 model)
*   **Deployment**: Render

---

## Running Locally

Want to run the console on your own machine? Follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Abhishek0Patil/Matrix_Chatbot.git
    cd Matrix_Chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    *   Create a new file named `.env` in the root of the project.
    *   Sign up for a free API key at [Groq.com](https://groq.com/).
    *   Add your key to the `.env` file:
      ```
      GROQ_API_KEY=gsk_YourSecretGroqApiKeyGoesHere
      ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The Operator Console will now be running at `http://localhost:3000`.

---

## Acknowledgements

This project was inspired by the incredible world-building of *The Matrix* films. All thematic elements are a tribute to the work of the Wachowskis.

