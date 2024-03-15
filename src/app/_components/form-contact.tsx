'use client'
import { useCallback, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import {
  validateContact,
  isValidEmailString,
  isValidString,
} from './form-contact.utils'
import { useReCaptcha } from 'next-recaptcha-v3'

export default function ContactForm({ csrfToken }: { csrfToken: string }) {
  const { executeRecaptcha } = useReCaptcha()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const [nameError, setNameError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [messageError, setMessageError] = useState<string>('')

  useEffect(() => {
    if (nameError !== '') isValidString(name, setNameError)
  }, [name, nameError])
  useEffect(() => {
    if (emailError !== '') isValidEmailString(email, setEmailError)
  }, [email, emailError])
  useEffect(() => {
    if (messageError !== '') isValidString(message, setMessageError)
  }, [message, messageError])

  const resetAll = () => {
    setName('')
    setEmail('')
    setMessage('')
    setNameError('')
    setEmailError('')
    setMessageError('')
  }
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const token = await executeRecaptcha('form_submit')
      if (
        !validateContact(
          name,
          email,
          message,
          setNameError,
          setEmailError,
          setMessageError
        )
      )
        return

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          data: { name, email, message, csrfToken },
          token,
        }),
      })
      if (response.ok) {
        alert('Successful mail transmission')
        resetAll()
      } else {
        const errorMessage = await response.text()
        alert(`Mail Sending Error. (${response.status}) ${errorMessage}`)
      }
    },
    [executeRecaptcha, name, email, message, csrfToken]
  )

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate={false} autoComplete='on'>
        <div>
          <TextField
            type='text'
            name='name'
            label='Name'
            placeholder='Your Name'
            variant='outlined'
            value={name}
            helperText={nameError}
            error={nameError !== ''}
            fullWidth
            required
            margin='normal'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value)
            }}
          />
        </div>
        <div>
          <TextField
            type='email'
            name='email'
            label='Email'
            placeholder='Your Email'
            variant='outlined'
            value={email}
            helperText={emailError}
            error={emailError !== ''}
            fullWidth
            required
            margin='normal'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value)
            }}
          />
        </div>
        <div>
          <TextField
            type='text'
            name='message'
            label='Message'
            placeholder='Write your message...'
            variant='outlined'
            value={message}
            helperText={messageError}
            error={messageError !== ''}
            fullWidth
            required
            multiline
            maxRows={10}
            minRows={5}
            margin='normal'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMessage(event.target.value)
            }}
          />
        </div>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          size='large'
          endIcon={<SendIcon />}
          sx={{ mt: 6 }}
          disableElevation
        >
          Send
        </Button>
      </form>
    </div>
  )
}
