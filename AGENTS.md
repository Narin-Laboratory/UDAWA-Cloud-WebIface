## Environment Setup Instructions

This document outlines the necessary steps to initialize the project environment. Please run these commands in your terminal to set up the repository correctly before running the application.

### Prerequisites
- A stable and functional Node.js environment (LTS version recommended).
- `npm` or a compatible package manager.

### Initialization Steps

1.  **Scaffold the Preact Application:**
    Use Vite to create the project structure.
    ```bash
    npm create vite@latest udawa-smart-system -- --template preact-ts
    ```

2.  **Navigate into Project Directory:**
    All subsequent commands should be run from within the `udawa-smart-system` directory.
    ```bash
    cd udawa-smart-system
    ```

3.  **Install Dependencies:**
    Install the required dependencies for the project.
    ```bash
    npm install
    ```

4.  **Install Additional Libraries:**
    Install Tailwind CSS, its peer dependencies, `preact-router`, and `chart.js`.
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npm install preact-router chart.js
    ```

5.  **Initialize Tailwind CSS:**
    Generate the `tailwind.config.js` and `postcss.config.js` files.
    ```bash
    npx tailwindcss init -p
    ```

After completing these steps, you will need to configure the `tailwind.config.js` and `src/index.css` files as described in the plan. The agent will create these files in the subsequent steps. Once all files are created, you can run `npm run dev` to start the development server.