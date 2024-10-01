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
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: 'Mood Tracker',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: ['1iBMv_ZPX44oTSx1NqZmKSbUm8ns1rBCp'], 
    };

    const templateSheetID = '1dl6foh_1RHHtxZqdATACpkgmfE5jGDiLpf-L5sMgOyA';

    const file = await drive.files.copy({
      resource: fileMetadata,
      fileId: templateSheetID,
    });

    const sheetId = file.data.id;


    await drive.permissions.create({
      fileId: sheetId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: email,
      },
    });

    res.status(200).json({ sheetId });
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
