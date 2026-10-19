export const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
export const PHONE_PATTERN = /^\+?\d{10,15}$/

export type EnquiryField = 'name' | 'phone' | 'email'
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

type EnquiryInput = { name?: unknown; phone?: unknown; email?: unknown }

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {}
  const name = str(input.name)
  const phone = str(input.phone).replace(/[\s\-()]/g, '')
  const email = str(input.email)

  if (!name) errors.name = 'Please enter your name'
  else if (name.length < 2 || name.length > 80 || !/\p{L}/u.test(name)) errors.name = 'Please enter a valid name'

  if (!phone) errors.phone = 'Please enter your mobile number'
  else if (!PHONE_PATTERN.test(phone)) errors.phone = 'Please enter a valid mobile number'

  if (email && !EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address'

  return errors
}
