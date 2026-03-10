import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    // Lightweight connectivity check — count rows in a small table
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      // SEC-08: Never expose internal error details to client
      console.error('[health] Supabase connectivity check failed:', error);
      return NextResponse.json(
        { status: 'degraded', message: 'Database connectivity issue' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    // SEC-08: Log details server-side, return generic message to client
    console.error('[health] Unexpected error:', err);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
