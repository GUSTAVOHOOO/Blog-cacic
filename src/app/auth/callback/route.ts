import { NextResponse } from 'next/server'

// Callback não é mais necessário para o fluxo de email+senha.
// Mantido para compatibilidade com links antigos enviados por e-mail.
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`)
}
