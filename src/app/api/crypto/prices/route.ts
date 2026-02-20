import { NextResponse } from "next/server";

const CMC_API_URL =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const SYMBOLS = "BTC,ETH,ADA";

export interface CryptoQuote {
    price: number;
    volume_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
    last_updated: string;
}

export interface CryptoData {
    id: number;
    name: string;
    symbol: string;
    quote: {
        USD: CryptoQuote;
    };
}

export interface CryptoPricesResponse {
    data: Record<string, CryptoData>;
    fetchedAt: string;
}

export async function GET() {
    const apiKey = process.env.COINMARKETCAP_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "CoinMarketCap API key not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `${CMC_API_URL}?symbol=${SYMBOLS}&convert=USD`,
            {
                headers: {
                    "X-CMC_PRO_API_KEY": apiKey,
                    Accept: "application/json",
                },
                // Revalidate every 2 minutes on the server cache
                next: { revalidate: 120 },
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("CoinMarketCap API error:", response.status, errorBody);
            return NextResponse.json(
                { error: "Failed to fetch crypto prices from CoinMarketCap" },
                { status: response.status }
            );
        }

        const json = await response.json();

        const result: CryptoPricesResponse = {
            data: json.data,
            fetchedAt: new Date().toISOString(),
        };

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
        return NextResponse.json(
            { error: "Internal server error while fetching crypto prices" },
            { status: 500 }
        );
    }
}
