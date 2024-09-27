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

    // Create a new Google Doc
    const fileMetadata = {
      name: 'Reflect Journal',
      mimeType: 'application/vnd.google-apps.document',
      parents: ['1iBMv_ZPX44oTSx1NqZmKSbUm8ns1rBCp'], // Replace with the folder ID shared with the service account
    };

    const templateDocID = "1oBKwteTRiCPrnR2V8GtPsS99Yt5yR7XKudDjmWURdvo";

    const file = await drive.files.copy({
      resource: fileMetadata,
      fileId: templateDocID,
    });

    const docId = file.data.id;

    // Respond with the newly created docId
    res.status(200).json({ docId });
   
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
