'use server';

/**
 * @fileOverview Provides AI-powered assistance for web development queries, including guidance and relevant documentation.
 *
 * - webDevelopmentAssistance - A function that handles web development assistance requests.
 * - WebDevelopmentAssistanceInput - The input type for the webDevelopmentAssistance function.
 * - WebDevelopmentAssistanceOutput - The return type for the webDevelopmentAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WebDevelopmentAssistanceInputSchema = z.object({
  query: z.string().describe('The web development question or request from the user.'),
});
export type WebDevelopmentAssistanceInput = z.infer<typeof WebDevelopmentAssistanceInputSchema>;

const WebDevelopmentAssistanceOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the web development query, including guidance and relevant documentation links.'),
});
export type WebDevelopmentAssistanceOutput = z.infer<typeof WebDevelopmentAssistanceOutputSchema>;

export async function webDevelopmentAssistance(input: WebDevelopmentAssistanceInput): Promise<WebDevelopmentAssistanceOutput> {
  return webDevelopmentAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'webDevelopmentAssistancePrompt',
  input: {schema: WebDevelopmentAssistanceInputSchema},
  output: {schema: WebDevelopmentAssistanceOutputSchema},
  prompt: `You are Kody AI, a web development expert.  A user will ask a question about web development. Provide a helpful answer with code examples when appropriate.

  If relevant, include links to documentation that would be helpful to the user.  Be concise.

  User Query: {{{query}}}`,
});

const webDevelopmentAssistanceFlow = ai.defineFlow(
  {
    name: 'webDevelopmentAssistanceFlow',
    inputSchema: WebDevelopmentAssistanceInputSchema,
    outputSchema: WebDevelopmentAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
