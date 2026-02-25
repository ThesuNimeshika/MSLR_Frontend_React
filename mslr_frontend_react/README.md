# MSL Recruitment Portal - Frontend

Welcome to the **MSL Recruitment Portal** frontend project. This is a premium, high-performance web application built with a modern React stack.

---

## 🚀 Getting Started

If you have downloaded this project as a ZIP file, follow these steps to get it running on your local machine.

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v20 or higher recommended).
- **npm**: Comes bundled with Node.js.

### 1. Extract the Project
Unzip the downloaded folder to a location of your choice.

### 2. Install Dependencies
Open your terminal (PowerShell, Command Prompt, or Terminal) in the root of the project folder and run:
```bash
npm install
```

### 3. Run the Development Server
Once the installation is complete, start the app in development mode:
```bash
npm run dev
```
The terminal will provide a local URL (usually `http://localhost:5173`). Open this URL in your browser to see the application.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**:
  - **SweetAlert2**: For premium, interactive alerts.
  - **React Hot Toast**: For smooth, non-intrusive notifications.
  - **React Data Table**: For powerful, responsive data displays.

---

## 📜 Git Workflow: Page-by-Page Updates

We follow a structured Git workflow to ensure stability and clarity. When updating the project, we commit and push changes on a "page-by-page" or "feature-by-feature" basis.

### The Process:
1.  **Branching**: Create a new branch for the specific page or feature you are working on.
    ```bash
    git checkout -b feature/login-page
    ```
2.  **Implementation**: Complete the UI and Logic for that specific page.
3.  **Local Testing**: Ensure the page is "clear running" without errors.
4.  **Staging changes**:
    ```bash
    git add .
    ```
5.  **Commit with Context**: Use descriptive commit messages.
    ```bash
    git commit -m "Update: Complete Login Page Refactor with SweetAlert integration"
    ```
6.  **Push to Repository**:
    ```bash
    git push origin feature/login-page
    ```
7.  **Final Push**: Once the entire portal is updated, we perform a final merge to the `main` branch.

---

## 📂 Project Structure
- `src/App.tsx`: The main entry point and routing container.
- `src/PluginDemo.tsx`: Demonstrations of SweetAlert, Toast, and Data Tables.
- `src/index.css`: Global design system and Tailwind 4 config.
- `dist/`: The folder created when running `npm run build` for production.

---

## ✅ Production Build
To create a production-ready bundle, run:
```bash
npm run build
```
The optimized files will be generated in the `dist/` directory.
