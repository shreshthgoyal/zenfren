import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Authenticate with the Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Create a new Google Doc by copying a template
    const fileMetadata = {
      name: 'Reflect Journal',
      mimeType: 'application/vnd.google-apps.document',
      parents: ['1iBMv_ZPX44oTSx1NqZmKSbUm8ns1rBCp'], // Replace with your folder ID
    };

    const templateDocID = '1oBKwteTRiCPrnR2V8GtPsS99Yt5yR7XKudDjmWURdvo';

    const file = await drive.files.copy({
      resource: fileMetadata,
      fileId: templateDocID,
    });

    const docId = file.data.id;

    // Add edit permissions for the provided email
    await drive.permissions.create({
      fileId: docId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: email,
      },
    });

    // Respond with the newly created docId
    res.status(200).json({ docId });
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
