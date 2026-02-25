import { NextResponse } from "next/server";

const WORLD_NEWS_API_URL = "https://api.worldnewsapi.com/top-news";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsArticle {
    id: number;
    title: string;
    text: string;
    summary: string | null;
    url: string;
    image: string | null;
    author: string | null;
    language: string;
    source_country: string;
    sentiment: number | null;
    publish_date: string;
}

export interface NewsResponse {
    articles: NewsArticle[];
    fetchedAt: string;
    total: number;
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function GET() {
    const apiKey = process.env.WORLD_NEWS_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "World News API key not configured. Set WORLD_NEWS_API_KEY in environment variables." },
            { status: 500 }
        );
    }

    try {
        const url = new URL(WORLD_NEWS_API_URL);
        url.searchParams.set("language", "en");
        url.searchParams.set("api-key", apiKey);

        const response = await fetch(url.toString(), {
            next: { revalidate: 900 }, // 15-minute server-side cache
        });

        if (response.status === 401 || response.status === 403) {
            return NextResponse.json(
                { error: "Invalid or unauthorized World News API key. Please verify your WORLD_NEWS_API_KEY." },
                { status: 401 }
            );
        }

        if (response.status === 429) {
            return NextResponse.json(
                { error: "World News API rate limit reached. Please try again later." },
                { status: 429 }
            );
        }

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("World News API error:", response.status, errorBody);
            return NextResponse.json(
                { error: "Failed to fetch news from World News API." },
                { status: response.status }
            );
        }

        const json = await response.json();

        // World News API returns { top_news: [{ news: NewsArticle[] }] }
        // Each top_news entry has a `news` array — we flatten and take top 10
        const topNewsGroups: { news: NewsArticle[] }[] = json.top_news ?? [];
        const articles: NewsArticle[] = topNewsGroups
            .flatMap((group) => group.news ?? [])
            .slice(0, 10)
            .map((article) => ({
                id: article.id,
                title: article.title ?? "Untitled",
                text: article.text ?? "",
                summary: article.summary ?? null,
                url: article.url ?? "#",
                image: article.image ?? null,
                author: article.author ?? null,
                language: article.language ?? "en",
                source_country: article.source_country ?? "",
                sentiment: article.sentiment ?? null,
                publish_date: article.publish_date ?? new Date().toISOString(),
            }));

        const result: NewsResponse = {
            articles,
            fetchedAt: new Date().toISOString(),
            total: articles.length,
        };

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store", // Client always gets fresh data from this route
            },
        });
    } catch (error) {
        console.error("Error fetching news data:", error);
        return NextResponse.json(
            { error: "Internal server error while fetching news data." },
            { status: 500 }
        );
    }
}
