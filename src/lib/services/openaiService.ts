import { ExerciseFormData } from '@/lib/types/exercise';
import { getSecrets } from './cloudflareService';

const generatePrompt = (formData: ExerciseFormData): string => {
  const interestsPrompt = formData.interests?.length
    ? `\nCentres d'intérêt des élèves : ${formData.interests.join(', ')}\n\nVeuillez adapter l'exercice en utilisant des exemples et contextes liés à ces centres d'intérêt pour le rendre plus engageant.`
    : '';

  return `Tu es professeur de ${formData.subject} pour le niveau ${formData.level}. Génère un exercice suivant les caractéristiques suivantes :

Sujet : ${formData.topic}
Type : ${formData.type}
Difficulté : ${formData.difficulty}
Durée estimée : ${formData.duration} minutes${interestsPrompt}

Format de sortie souhaité :
1. Un énoncé clair et structuré
2. Des instructions détaillées
3. Des indices si nécessaire (n'hésite pas à faire des dessins ou représentations visuelles)
4. La solution complète

L'exercice doit être adapté au niveau scolaire et inclure tous les éléments nécessaires à sa réalisation.`;
};

export const generateExerciseContent = async (formData: ExerciseFormData): Promise<string> => {
  try {
    const secrets = await getSecrets();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secrets.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur expert en pédagogie qui crée des exercices adaptés au niveau des élèves.'
          },
          {
            role: 'user',
            content: generatePrompt(formData)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Impossible de générer l\'exercice. Veuillez réessayer plus tard.');
  }
};