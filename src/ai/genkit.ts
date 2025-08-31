import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
    // The Next.js plugin is disabled to resolve build issues.
    // Re-enable it for production deployment.
    // nextPlugin({
    //   //
    // }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
