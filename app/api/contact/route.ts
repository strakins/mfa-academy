import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "");
    const email = String(body.email ?? "");
    const subject = String(body.subject ?? "Contact Form");
    const message = String(body.message ?? "");

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: subject,
      html: `
        <h3>New Contact Message</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Message sent",
    });

  } catch (e) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}