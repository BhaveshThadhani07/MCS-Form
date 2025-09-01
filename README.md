# MCS-Form

Welcome to MCS-Form, a secure online examination platform designed to provide a safe and reliable testing environment. This project is built with Next.js and integrates advanced security features to ensure the integrity of the examination process.

## Features

- **Secure Examination Environment**: Implements a `SecurityManager` to detect and prevent cheating by monitoring user activity, such as leaving the exam tab or using multiple displays.
- **AI-Powered Behavioral Analysis**: Utilizes AI to analyze user behavior during the exam, providing insights into potential cheating patterns and generating a risk assessment.
- **AI-Powered Input Validation**: Uses Google AI (Gemini) to detect fake names and invalid email addresses, preventing users from entering random characters like "aaa", "riy98h3", or "qwert".
- **Dynamic Quiz System**: Fetches questions from a JSON file, allowing for easy updates and management of the quiz content.
- **User-Friendly Interface**: Built with modern UI components to provide a smooth and intuitive user experience for both students and administrators.
- **Detailed Results and Analysis**: Offers a comprehensive results screen that includes a summary of the user's answers, along with a behavioral analysis report.
- **Google Sheets Integration**: Automatically submits all form data including user details, answers, anomaly scores, and submission duration to Google Sheets.

## Getting Started

To get started with the MCS-Form platform, follow these steps:

1. **Installation**: Clone the repository and install the dependencies.
   ```bash
   git clone https://github.com/BhaveshThadhani07/mcs-form.git
   cd MCS-Form
   npm install
   ```

2. **AI Validation Setup**: To enable AI-powered name and email validation, you need to set up Google AI API:
   - Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env.local` file in the root directory
   - Add your API key: `GOOGLE_AI_API_KEY=AIzaSyB9z9OavhvtrimmrCuqK9GFIxuLJay3-H0`
   - The AI will detect fake names like "aaa", "riy98h3", "qwert" and invalid emails

3. **Configuration**: The quiz questions can be customized by editing the `public/questions.json` file.

4. **Running the Application**: Start the development server.
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Key Components

- **`src/app/page.tsx`**: The main entry point of the application, which handles the quiz flow and state management.
- **`src/components/quiz/SecurityManager.tsx`**: The component responsible for monitoring user activity and ensuring the security of the exam.
- **`src/ai/flows/analyze-user-behavior.ts`**: The AI flow that analyzes user behavior and provides a risk assessment.
- **`public/questions.json`**: The JSON file containing the quiz questions.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Firebase**: Provides the backend infrastructure and hosting for the application.
- **Genkit**: An open-source framework for building AI-powered applications.
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs.
- **Shadcn UI**: A collection of reusable UI components.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.