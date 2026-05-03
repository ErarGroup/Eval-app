import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import nodemailer from 'nodemailer';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Set up Nodemailer Ethereal testing service
let transporter: any;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing email account. ' + err.message);
    } else {
        console.log('Ethereal Credentials obtained for emailing.');
        transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    }
});

// Global Roster Cache mapped once at backend spinup
let cache: any[] = [];

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFaYslUjSgHJnQUgUflpMKHAzz7DQH80kk2zuVD6EBxLchHWoorYUPnpcBuwYDrg/pub?output=csv';

async function syncRoster() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: any[] = xlsx.utils.sheet_to_json(sheet);
    
    const parsedRoster = rawData.map(d => {
      const fn = (d['Player\nFirst Name'] || d['Player First Name'] || '').trim();
      const ln = (d['Player\nLast Name'] || d['Player Last Name'] || '').trim();
      const full = fn || ln ? `${fn} ${ln}`.trim() : '';

      const potentialEmails = [
        d['Contact Email'],
        d['Guardian 1 Email Address'],
        d['Guardian 2 Email Address'],
        d['Guardian 2 Alternate Email'],
        d['Email/UserID']
      ];
      
      // Clean and uniquely deduplicate valid emails
      const validEmails = [...new Set(
        potentialEmails
          .map(e => String(e || '').trim().toLowerCase())
          .filter(e => e.includes('@'))
      )];

      return {
        program: String(d['Program'] || '').trim(),
        team: String(d['Team'] || '').trim(),
        age: String(d['Age/Division'] || '').trim(),
        name: full,
        emails: validEmails
      };
    }).filter(d => d.name !== '' || d.team !== '');
    
    // Deduplicate
    cache = parsedRoster.filter((value, index, self) => 
      index === self.findIndex((t) => (
        t.name === value.name && t.team === value.team
      ))
    );

    console.log(`Roster synced securely from Google Sheets! ${cache.length} active players loaded.`);
  } catch (e) {
    console.error('CRITICAL: Failed to sync Google Sheets Roster.', e);
  }
}

// Initial Sync & Auto-Refresh Setup
syncRoster();
setInterval(syncRoster, 1000 * 60 * 60); // Auto-refreshes roster every hour behind the scenes

app.get('/api/roster', (req, res) => {
  res.json(cache);
});

app.post('/api/evaluations', async (req, res) => {
  try {
    const evaluation = await prisma.evaluation.create({ data: req.body });
    
    // Shoot off ethereal email!
    if(transporter) {
       const targetParentEmails = req.body.parentEmails && req.body.parentEmails.length > 0 
           ? req.body.parentEmails.join(', ')
           : 'dos@deltonasoccer.com'; // Failure fallback

       let message = {
          from: 'Coach Eval System <coach@deltonasoccer.com>',
          to: targetParentEmails,
          cc: 'dos@deltonasoccer.com',
          subject: `DYSC Player Evaluation: ${req.body.playerName}`,
          text: `A new evaluation was just completed by the Coach for ${req.body.playerName} [${req.body.team}].\n\nMindset: ${req.body.mindsetAvg}\nPhysical: ${req.body.physicalAvg}\nTech: ${req.body.technicalAvg}\nTactical: ${req.body.tacticalAvg}\n\nA final PDF generation was printed successfully.`,
       };
       transporter.sendMail(message, (err: any, info: any) => {
          if (err) console.log('Email Error occurred. ' + err.message);
          else {
              console.log('Final Email Message Successfully Sent: %s', info.messageId);
              console.log('Preview Final Dispatch Payload here: %s', nodemailer.getTestMessageUrl(info));
          }
       });
    }

    res.json(evaluation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

app.get('/api/evaluations', async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

app.get('/api/targets', async (req, res) => {
  try {
    let target = await prisma.clubTarget.findUnique({ where: { id: 1 } });
    if (!target) {
      target = await prisma.clubTarget.create({
        data: { id: 1, mindsetAvg: 3.0, physicalAvg: 3.0, technicalAvg: 3.0, tacticalAvg: 3.0 }
      });
    }
    res.json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

app.post('/api/targets', async (req, res) => {
  try {
    const { mindsetAvg, physicalAvg, technicalAvg, tacticalAvg } = req.body;
    const target = await prisma.clubTarget.upsert({
      where: { id: 1 },
      update: { mindsetAvg, physicalAvg, technicalAvg, tacticalAvg },
      create: { id: 1, mindsetAvg, physicalAvg, technicalAvg, tacticalAvg }
    });
    res.json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update targets' });
  }
});

app.get('/api/team-targets', async (req, res) => {
  try {
    const targets = await prisma.teamTarget.findMany();
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team targets' });
  }
});

app.post('/api/team-targets', async (req, res) => {
  try {
    const { teamName, mindsetAvg, physicalAvg, technicalAvg, tacticalAvg } = req.body;
    const target = await prisma.teamTarget.upsert({
      where: { teamName: teamName.toLowerCase() },
      update: { mindsetAvg, physicalAvg, technicalAvg, tacticalAvg },
      create: { teamName: teamName.toLowerCase(), mindsetAvg, physicalAvg, technicalAvg, tacticalAvg }
    });
    res.json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team targets' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server API listening on http://localhost:${PORT}`);
});
