import nodemailer from 'nodemailer'
import xss from 'xss'
import { NextRequest } from 'next/server'
import { isValidEmail } from '@/app/_components/form-contact.utils'

export async function POST(req: NextRequest) {
  const requestBody = await req.json()
  const { data } = requestBody
  const { name, email, message } = data

  const email_trimmed = email.trim()
  if (!isValidEmail(email_trimmed))
    return new Response('Invalid email address.', { status: 400 })

  const email_safe = xss(email_trimmed)
  if (email_safe === '')
    return new Response('Email is required', { status: 400 })

  const name_safe = xss(name)
  if (name_safe === '') return new Response('Name is required', { status: 400 })

  const message_safe = xss(message)
  if (message_safe === '')
    return new Response('Message is required', { status: 400 })

  const host = process.env.CONTACT_MAIL_HOST
  const user = process.env.CONTACT_MAIL_USER
  const pass = process.env.CONTACT_MAIL_PW
  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  const serviceName = process.env.CONTACT_MAIL_DISPLAY_NAME
  try {
    await transporter.sendMail({
      from: `"${serviceName}" <${process.env.CONTACT_MAIL_USER}>`,
      to: email_trimmed,
      bcc: `${process.env.CONTACT_MAIL_BCC}`,
      subject: `Thank You for Reaching Out to ${serviceName}`,
      text: `${name_safe} 様\n\nお問い合わせありがとうございます。\n\nお客様からのメッセージを受け取りました。現在、内容を確認しておりますので、詳細な回答をご用意でき次第、改めてご連絡いたします。\n\nお送りいただいた情報は以下の通りです：\n\n---\n名前：${name_safe}\nメールアドレス：${email_trimmed}\nお客様のメッセージ：\n\n${message_safe}\n---\n\n今後とも、${serviceName}をよろしくお願いいたします。\n\n${serviceName} チーム`,
    })
    return new Response('Successful mail transmission', { status: 200 })
  } catch (error) {
    console.log({ error, user, pass })
    return new Response('Mail Sending Error', { status: 500 })
  }
}
