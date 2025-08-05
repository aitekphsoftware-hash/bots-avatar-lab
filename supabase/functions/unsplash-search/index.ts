import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnsplashImage {
  id: string
  urls: {
    regular: string
    small: string
    thumb: string
    full: string
  }
  alt_description: string
  description: string
  user: {
    name: string
    username: string
  }
  width: number
  height: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, page = 1, per_page = 20, orientation } = await req.json()

    if (!query) {
      throw new Error('Search query is required')
    }

    const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY')
    if (!UNSPLASH_ACCESS_KEY) {
      throw new Error('Unsplash API key not configured')
    }

    // Build search URL with parameters
    const searchParams = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: per_page.toString(),
      ...(orientation && { orientation })
    })

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${searchParams}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Unsplash API error:', errorData)
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the response to our format
    const images: UnsplashImage[] = data.results.map((img: any) => ({
      id: img.id,
      urls: {
        regular: img.urls.regular,
        small: img.urls.small,
        thumb: img.urls.thumb,
        full: img.urls.full
      },
      alt_description: img.alt_description || img.description || 'Unsplash image',
      description: img.description,
      user: {
        name: img.user.name,
        username: img.user.username
      },
      width: img.width,
      height: img.height
    }))

    return new Response(
      JSON.stringify({
        images,
        total: data.total,
        total_pages: data.total_pages
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in unsplash-search function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})