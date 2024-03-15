import xss from 'xss'

export const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isValidEmailString = (
  email: string,
  setEmailError: (error: string) => void
) => {
  const email_trimmed = email.trim()
  if (!isValidEmail(email_trimmed)) {
    setEmailError('Invalid email address.')
    return false
  } else {
    setEmailError('')
    return true
  }
}
export const isValidString = (
  string: string,
  setError: (error: string) => void
) => {
  const stringSafe = xss(string)
  if (stringSafe === '') {
    setError('Name is required')
    return false
  } else {
    setError('')
    return true
  }
}

export const validateContact = (
  name: string,
  email: string,
  message: string,
  setNameError: (error: string) => void,
  setEmailError: (error: string) => void,
  setMessageError: (error: string) => void
) => {
  let isOK = true
  if (!isValidEmailString(email, setEmailError)) isOK = false
  if (!isValidString(name, setNameError)) isOK = false
  if (!isValidString(message, setMessageError)) isOK = false
  return isOK
}
