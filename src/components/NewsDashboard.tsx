import React, { useEffect, useState } from 'react'

type Article = { title: string }

export default function NewsDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/news/top')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        setArticles(data?.articles ?? [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!articles || articles.length === 0) return <div>No articles</div>

  return (
    <div>
      {articles.map((a, i) => (
        <div key={i}>{a.title}</div>
      ))}
    </div>
  )
}
