'use server';

import { webDevelopmentAssistance, type WebDevelopmentAssistanceInput } from '@/ai/flows/web-development-assistance';
import { z } from 'zod';

const inputSchema = z.object({
  query: z.string(),
});

export async function getAiResponse(input: WebDevelopmentAssistanceInput): Promise<{response?: string, error?: string}> {
  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await webDevelopmentAssistance(parsedInput.data);
    return { response: result.response };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while communicating with the AI.' };
  }
}
