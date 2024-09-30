import { google } from 'googleapis';
import serviceAccount from '../../service-account-key.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body; // Get the email from the request body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Authenticate with Google API using the service account
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    // Create an authenticated Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    // Create a new Google Sheet with the Sheets API
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: 'Mood Tracker',
        },
      },
    });

    // Get the new sheet ID from the response
    const sheetId = createResponse.data.spreadsheetId;

    // Create an authenticated Google Drive API client for permission escalation
    const drive = google.drive({ version: 'v3', auth });

    // Escalate permissions for the specified email
    await drive.permissions.create({
      fileId: sheetId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: email,
      },
    });

    // Send the sheet ID back to the client
    res.status(200).json({ sheetId });
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
