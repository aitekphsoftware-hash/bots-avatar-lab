import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Fetching D-ID voices...')
    
    const response = await fetch('https://api.d-id.com/clips/voices', {
      headers: {
        'accept': 'application/json',
        'authorization': `Basic ${Deno.env.get('DID_API_KEY')}`,
      },
    })

    console.log('D-ID voices API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('D-ID voices API error:', response.status, errorText)
      throw new Error(`D-ID API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully fetched voices:', data.voices?.length || 0)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in d-id-voices function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})