import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import NewsDashboard from '../../components/NewsDashboard'

describe('NewsDashboard', () => {
  const OLD_FETCH = global.fetch

  afterEach(() => {
    global.fetch = OLD_FETCH
    vi.restoreAllMocks()
  })

  it('renders article titles from API', async () => {
    const sample = { articles: [{ title: 'Breaking News' }, { title: 'Second' }] }
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(sample) } as any))

    render(<NewsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Breaking News')).toBeTruthy()
      expect(screen.getByText('Second')).toBeTruthy()
    })
  })
})
