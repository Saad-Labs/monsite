export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, subject, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Champs requis manquants' });

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'SOREN', email: 'contact@soren-paris.com' },
      to: [{ email: 'contact.sorenparis@gmail.com', name: 'SOREN' }],
      replyTo: { email: email, name: name || email },
      subject: subject ? `[SOREN] ${subject}` : '[SOREN] Nouveau message',
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0D0D0B">Nouveau message — SOREN</h2>
          <p><strong>Nom :</strong> ${name || 'Non renseigné'}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject || 'Non renseigné'}</p>
          <hr/>
          <p><strong>Message :</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `
    })
  });

  const data = await response.json().catch(() => ({}));
  return res.status(response.ok ? 200 : 400).json(data);
}
