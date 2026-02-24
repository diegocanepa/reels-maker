import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.WORLD_NEWS_API_KEY

  const headers = {
    'Cache-Control': 'public, max-age=60',
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401, headers })
  }

  // Skeleton: return empty articles array for now
  return NextResponse.json({ articles: [] }, { status: 200, headers })
}

export const runtime = 'edge'
