// pages/api/search.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;
    console.log('Received query:', query);

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Find grants related to: ${query}\n\nGrants:`,
        max_tokens: 200,
        n: 3,
        stop: null,
        temperature: 0.7,
      });

      console.log('OpenAI API response:', completion.data);

      const grants = completion.data.choices.map(choice => {
        const [title, description] = choice.text.split(':').map(s => s.trim());
        return {
          title: title || 'Untitled Grant',
          description: description || 'No description available',
          link: `https://example.com/grants/${encodeURIComponent(title || 'untitled')}`
        };
      });

      res.status(200).json({ results: grants });
    } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
