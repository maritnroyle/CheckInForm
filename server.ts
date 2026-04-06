import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-email", async (req, res) => {
    try {
      const { email, fullName, checkInDate, checkOutDate, signature } = req.body;

      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        return res.status(500).json({ error: "Gmail credentials not configured." });
      }

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
      };

      const formattedCheckIn = formatDate(checkInDate);
      const formattedCheckOut = formatDate(checkOutDate);

      // Generate PDF
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        doc.fontSize(20).text('Agreement and House Rules', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${fullName}`);
        doc.text(`Check-in Date: ${formattedCheckIn}`);
        doc.text(`Check-out Date: ${formattedCheckOut}`);
        doc.moveDown();
        
        doc.fontSize(14).text('Agreement', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text('1. Term of Agreement', { underline: true });
        doc.fontSize(10).text(`This agreement shall commence on ${formattedCheckIn} and continue on a week-to-week basis. You may terminate this agreement by providing 14 days’ notice.\nNotwithstanding the above, this agreement may be terminated immediately and without notice if you engage in illegal activity, physical violence, or behavior that seriously threatens the safety or well-being of other occupants.`);
        doc.moveDown(0.5);

        doc.fontSize(12).text('2. Rent', { underline: true });
        doc.fontSize(10).text('You agree to pay the designated share of the weekly rent. The rent includes electricity, water, and internet. You are not permitted to sublet the room or allow other individuals to move into the property.\nIn any instance where a full seven-day weekly cycle is not completed (such as during the first or final week of occupancy), a pro-rata rate of $35.00 per day shall be applied for each day of occupancy.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('3. Bond', { underline: true });
        doc.fontSize(10).text('At the end of this agreement, the bond will be refunded within 7 days. However, the bond may be withheld or subject to deductions if you:\n• Leave without providing the required 14 days\' notice;\n• Owe outstanding rent;\n• Cause damage to the property;\n• Fail to clean and return the bedding to a tidy condition upon check-out.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('4. House Rules', { underline: true });
        doc.fontSize(10).text('You agree to abide by all established house rules, maintain cleanliness in common areas, and respect the quiet enjoyment of all other occupants.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('5. Liability', { underline: true });
        doc.fontSize(10).text('You are responsible for the cost of repairing any damage caused to the premises or furnishings by yourself or your guests.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('6. Disputes', { underline: true });
        doc.fontSize(10).text('If a disagreement arises that cannot be resolved through discussion, you agree to refer the matter to the Disputes Tribunal.');
        doc.moveDown();

        doc.fontSize(14).text('House Rules', { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(12).text('General Conduct', { underline: true });
        doc.fontSize(10).text('- Please be kind and respectful to all flatmates.');
        doc.text('- Do not use or take the belongings of others without explicit permission.');
        doc.text('- No smoking or vaping inside the house.');
        doc.text('- No pets are permitted.');
        doc.text('- Use of drugs or any form of illegal substances are strictly prohibited.');
        doc.text('- We have zero tolerance for violence or disruptive behavior - Please report any concerns or incidents to us immediately.');
        doc.text('- No shoes are allowed inside the house or on the carpets.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Kitchen and Fridge', { underline: true });
        doc.fontSize(10).text('- Please kindly make sure you organize your belongings in the food cabinet and fridge accordingly. Keep it organized within 1 shelf per room (1 shelf shared by 2 pax). There are 2 fridge/freezers so there is enough space for everyone.');
        doc.text('- Do not overcrowd the fridge or freezer. Remove spoiled food promptly and keep your designated space clean.');
        doc.text('- All kitchen appliances must be cleaned after use and returned to the cupboard. Tidy and wipe down common kitchen areas after use.');
        doc.text('- Cooktops and ovens must be used safely. Ensure all knobs and switches are turned off and the units are left clean for the next person.');
        doc.text('- Dispose off and do not leave any food scraps in the sink. All rubbish must be wrapped and placed in the bin.');
        doc.text('- Please clean your dishes immediately once you finish your meals.');
        doc.text('- DO NOT pour cooking oil, fats or grease into the sink, as this will cause blockages. Contain these liquids in a sealed container and dispose of them into the main rubbish bin outside.');
        doc.text('- Note: If a professional plumber is required to clear blockages in the sink, the cost of the plumbing service will be shared equally by all current occupants.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Living and Dining room', { underline: true });
        doc.fontSize(10).text('- Do not leave any personal items in the common area.');
        doc.text('- Make sure you clean and wipe off the dining table after meals.');
        doc.text('- Do not leave the window open at night or when leaving the house.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Laundry', { underline: true });
        doc.fontSize(10).text('- Use of the washing machine and dryer is limited to once per week per person.');
        doc.text('- Please schedule your laundry so it is completed before 10:00 PM.');
        doc.text('- Remove your laundry from the machines promptly once the cycle is finished.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Bedrooms', { underline: true });
        doc.fontSize(10).text('- A healthy room starts from good sunlight and lots of ventilation. Please open up the curtains and air up your room on a regular basis to prevent build up of mold and mildew - this is for your own benefits!');
        doc.text('- Keep your room clean and tidy and vacuum it regularly.');
        doc.text('- Do not use any personal heating appliances in your room (i.e. electric heater etc), as this may cause overload on the main circuit breaker and pose fire risk.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Bathrooms', { underline: true });
        doc.fontSize(10).text('- Keep the bathroom clean and ensure all hair is removed from the shower drain after use.');
        doc.text('- Ensure the toilet is flushed and left clean after use.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Parking', { underline: true });
        doc.fontSize(10).text('- Do not park it on the grass area (the grass area near to the main tree/next to the bedroom) as this will damage the lawn.');
        doc.text('- Please make sure you register the car plate number with us. Any unregistered car within the house’s compound will be towed away.');
        doc.text('- Parking space is based on a first come first served basis.');
        doc.text('- Kindly note that onsite parking is strictly for flatmates only. Please make sure all visitors’ cars are parked outside the house or on the street.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Guest and Visitors', { underline: true });
        doc.fontSize(10).text('- No visitors or guests are allowed between 11:00 PM and 06:00 AM.');
        doc.text('- Visitors or guests are not permitted to stay overnight.');
        doc.text('- All visitors/guests must leave the property by 11:00 PM, ensuring that the common areas are left tidy.');
        doc.text('- No party with guests or visitors in the house. Flamate and their visitors must ensure orderly conduct with no disturbance to other flatmates or neighbors.');
        doc.moveDown(0.5);

        doc.fontSize(12).text('Check-Out and vacating the room', { underline: true });
        doc.fontSize(10).text('- Please make sure you wash & dry the bed sheets / pillow cases / duvets cover (do not remove bed protector) before you leave.');
        doc.text('- Kindly put it back as its original set up and send a photo before checking out.');
        doc.text('- The key card must be left inside the room upon vacating.');
        doc.text('- If you are the last person or there are no other flatmates in the room, kindly ensure the windows are closed before you leave.');
        doc.moveDown();

        doc.fontSize(12).text('I acknowledge that I have read, understood, and agree to abide by the House Rules stated above.');
        doc.moveDown();
        doc.text('Signature:');
        
        if (signature) {
          try {
            const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");
            const imgBuffer = Buffer.from(base64Data, 'base64');
            doc.image(imgBuffer, { width: 200 });
          } catch (e) {
            console.error("Failed to add signature to PDF", e);
          }
        }

        doc.end();
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Check-in Confirmation",
        text: `Dear ${fullName},\n\nThank you for completing your check-in for WhiteCloud Homestay.\n\nYour check-in date is ${formattedCheckIn} and check-out date is ${formattedCheckOut}.\n\nPlease find attached a copy of the Agreement and House Rules with your signature.\n\nWe look forward to hosting you!\n\nBest regards,\nWhiteCloud Homestay`,
        html: `<p>Dear ${fullName},</p><p>Thank you for completing your check-in for WhiteCloud Homestay.</p><p>Your check-in date is <strong>${formattedCheckIn}</strong> and check-out date is <strong>${formattedCheckOut}</strong>.</p><p>Please find attached a copy of the Agreement and House Rules with your signature.</p><p>We look forward to hosting you!</p><p>Best regards,<br/>WhiteCloud Homestay</p>`,
        attachments: [
          {
            filename: 'Agreement_and_House_Rules.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
