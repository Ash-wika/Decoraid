# Decoraid 🎨
*AI-Powered Interior Design Automation*

Hey! Welcome to **Decoraid**. This is a project I built to explore how we can use Generative AI to automate the creative (and tedious) parts of interior design. The core idea is simple: take a photo of a room, tell the AI what style you want, and get a complete transformation plan + cost estimate instantly.

## 💡 The Concept

I wanted to build something that feels "magic" but is grounded in solid engineering. Instead of just "generating images," Decoraid actually understands the room geometry and items using computer vision (via Gemini), meaning the results are actually usable, not just pretty hallucinations.

## 🛠️ Tech Stack & Architecture

I kept the stack modern but focused on performance and developer experience:

*   **Frontend**: Built with **React** and **Vite**. I chose Vite over CRA because the Hot Module Replacement (HMR) is instant, which made iterating on the UI really fast. Used **TailwindCSS** for styling because I wanted a clean, custom design system without fighting default component styles.
*   **Backend**: **Node.js** with **Express**. It acts as the orchestrator. It handles image uploads (using `multer`), manages state, and securely talks to the AI provider.
*   **The Brain (AI)**: **Google Gemini Vision API**. This is the heavy lifter. I engineered specific prompts to make it "see" the room elements (walls, floors, furniture) and hallucinate a new style based on constraints.
*   **Database**: **Better-SQLite3**. For this scale, I didn't want the overhead of a full Postgres instance. SQLite is standard, file-based, and insanely fast for local dev.

## 🚀 How to Run It

I set up a unified build script so you don't need multiple terminals.

1.  **Install everything** (Root, Client, and Server dependencies):
    ```bash
    npm install
    # or if you want to be specific:
    npm run install:all
    ```

    > **Note**: I've excluded `node_modules` and environment secrets from this repo to keep it clean. Running the install command will fetch all necessary dependencies automatically.

2.  **Start the machine**:
    ```bash
    npm run dev
    ```
    *This relies on `concurrently` to spin up both the React builder and the Node server in one go.*

3.  Open `http://localhost:5173` and start designing!

## 🔮 Future Plans

*   Adding user accounts to save history (already have the DB schema for it).
*   Maybe try implementing a RAG pipeline to recommend real furniture products from a catalog.

---
*Created with ❤️ and a lot of coffee.*
