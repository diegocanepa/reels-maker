import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GET } from '../../../app/api/news/top/route'

describe('GET /api/news/top', () => {
  const OLD = process.env.WORLD_NEWS_API_KEY

  beforeEach(() => {
    delete process.env.WORLD_NEWS_API_KEY
  })

  afterEach(() => {
    process.env.WORLD_NEWS_API_KEY = OLD
  })

  it('returns 401 when WORLD_NEWS_API_KEY is missing', async () => {
    const res = await GET(new Request('http://localhost'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Missing API key')
  })

  it('returns 200 and articles array when API key present', async () => {
    process.env.WORLD_NEWS_API_KEY = 'stub'
    const res = await GET(new Request('http://localhost'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('articles')
    expect(Array.isArray(body.articles)).toBe(true)
  })
})
