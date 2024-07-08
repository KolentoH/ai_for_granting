// File: pages/api/search.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Find grants for an organization with the following description: ${query}\n\nGrants:`,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.5,
      });

      const grants = completion.data.choices[0].text
        .split('\n')
        .filter(grant => grant.trim() !== '')
        .map(grant => {
          const [title, description] = grant.split(':');
          return { 
            title: title.trim(), 
            description: description.trim(),
            link: `https://example.com/grants/${encodeURIComponent(title.trim())}`
          };
        });

      res.status(200).json({ results: grants });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

