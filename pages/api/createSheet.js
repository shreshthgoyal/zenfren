import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';
import serviceAccount from '../../service-account-key.json';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {

    // Authenticate with the Google API
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });


    const drive = google.drive({ version: 'v3', auth });

    // Create a new Google Sheet
    const fileMetadata = {
      name: 'Mood Tracker',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: ['1iBMv_ZPX44oTSx1NqZmKSbUm8ns1rBCp'], // Replace with the folder ID shared with the service account
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    const sheetId = file.data.id;

    // Send the sheet ID back to the client
    res.status(200).json({ sheetId });
   
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
