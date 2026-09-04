import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blob = await put(filename, request.body!, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload to Vercel Blob';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}