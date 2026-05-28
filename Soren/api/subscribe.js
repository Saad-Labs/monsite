export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, preference } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis' });

  const payload = { email, listIds: [3], updateEnabled: true };
  if (preference) payload.attributes = { PARFUM: preference };

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  return res.status(response.ok ? 200 : 400).json(data);
}
