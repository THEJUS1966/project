# Letter Box

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally in VS Code

To run this project on your local machine using Visual Studio Code, follow these steps:

1.  **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) (version 20 or higher) and npm installed on your computer.

2.  **Open in VS Code:** Open the project folder in Visual Studio Code.

3.  **Install Dependencies:** Open the integrated terminal in VS Code (you can use the `Ctrl+` or `Cmd+` backtick shortcut) and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

4.  **Run the Application:** This project has two parts that need to run simultaneously: the Next.js web application and the Genkit AI server.

    *   **Start the Web App:** In your first terminal, run:
        ```bash
        npm run dev
        ```
        This will start the Next.js development server. You can view your application by opening `http://localhost:9002` in your web browser.

    *   **Start the AI Server:** Open a second, new terminal in VS Code and run:
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit server, which powers the AI functionality of the app. Keep this terminal running alongside the web app terminal.

Now you should have the full application running locally!