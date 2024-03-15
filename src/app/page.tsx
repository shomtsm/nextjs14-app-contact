import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { headers } from 'next/headers'
import ContactForm from './_components/form-contact'

export default function PageContact() {
  const csrfToken = headers().get('X-CSRF-Token') || 'missing'

  return (
    <ReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      useEnterprise={true}
    >
      <div style={{ width: '100%', maxWidth: '500px', margin: '3rem auto' }}>
        <h1>Next.js 14 - Contact</h1>
        <ContactForm csrfToken={csrfToken} />
      </div>
    </ReCaptchaProvider>
  )
}
