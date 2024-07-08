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
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that finds grants. Provide 3 relevant grants with their titles and descriptions." },
          { role: "user", content: `Find grants related to: ${query}` }
        ],
        max_tokens: 500,
        n: 1,
        temperature: 0.7,
      });

      console.log('Raw OpenAI API response:', JSON.stringify(completion.data, null, 2));

      const content = completion.data.choices[0].message.content.trim();
      const grants = content.split('\n\n').map((grant, index) => {
        const [title, ...descriptionParts] = grant.split('\n');
        return {
          title: title.replace(/^\d+\.\s*/, '').trim() || `Grant ${index + 1}`,
          description: descriptionParts.join('\n').trim() || 'No description available',
          link: `https://example.com/grants/${encodeURIComponent(title.replace(/^\d+\.\s*/, '').trim() || `grant-${index + 1}`)}`
        };
      });

      res.status(200).json({ results: grants });
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('OpenAI API error response:', error.response.data);
      }
      res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}