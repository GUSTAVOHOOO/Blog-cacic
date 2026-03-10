import { describe, it, expect } from 'vitest'
import { contatoSchema } from '../contato'
import { validateUpload } from '../upload'

describe('contatoSchema', () => {
  it('accepts valid contact form data', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty nome', () => {
    const result = contatoSchema.safeParse({
      nome: '',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects nome shorter than 2 characters', () => {
    const result = contatoSchema.safeParse({
      nome: 'A',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects nome longer than 100 characters', () => {
    const result = contatoSchema.safeParse({
      nome: 'A'.repeat(101),
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'not-an-email',
      assunto: 'Dúvida',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects assunto not in enum', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'joao@test.com',
      assunto: 'OutroValor',
      mensagem: 'Olá, tenho uma dúvida sobre o evento.',
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid assunto values', () => {
    for (const assunto of ['Dúvida', 'Sugestão', 'Parceria', 'Outro']) {
      const result = contatoSchema.safeParse({
        nome: 'João',
        email: 'joao@test.com',
        assunto,
        mensagem: 'Olá, tenho uma dúvida sobre o evento.',
      })
      expect(result.success).toBe(true)
    }
  })

  it('rejects empty mensagem', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mensagem shorter than 10 characters', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'curto',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mensagem longer than 2000 characters', () => {
    const result = contatoSchema.safeParse({
      nome: 'João',
      email: 'joao@test.com',
      assunto: 'Dúvida',
      mensagem: 'A'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })
})

describe('validateUpload', () => {
  it('accepts a 1MB JPEG as image', () => {
    const result = validateUpload({
      type: 'image/jpeg',
      size: 1 * 1024 * 1024,
      name: 'photo.jpg',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.category).toBe('image')
    }
  })

  it('accepts a 5MB PDF as document', () => {
    const result = validateUpload({
      type: 'application/pdf',
      size: 5 * 1024 * 1024,
      name: 'doc.pdf',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.category).toBe('document')
    }
  })

  it('rejects image/gif (not in allowed image types)', () => {
    const result = validateUpload({
      type: 'image/gif',
      size: 1 * 1024 * 1024,
      name: 'anim.gif',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects a 3MB JPEG (exceeds 2MB image limit)', () => {
    const result = validateUpload({
      type: 'image/jpeg',
      size: 3 * 1024 * 1024,
      name: 'large.jpg',
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('2MB')
    }
  })

  it('rejects a 11MB PDF (exceeds 10MB doc limit)', () => {
    const result = validateUpload({
      type: 'application/pdf',
      size: 11 * 1024 * 1024,
      name: 'large.pdf',
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('10MB')
    }
  })

  it('accepts image/png as image', () => {
    const result = validateUpload({
      type: 'image/png',
      size: 1 * 1024 * 1024,
      name: 'img.png',
    })
    expect(result.valid).toBe(true)
  })

  it('accepts image/webp as image', () => {
    const result = validateUpload({
      type: 'image/webp',
      size: 1 * 1024 * 1024,
      name: 'img.webp',
    })
    expect(result.valid).toBe(true)
  })
})
