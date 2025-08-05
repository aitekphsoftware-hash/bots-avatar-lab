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
    
    // D-ID doesn't seem to have a dedicated voices API endpoint
    // Return a curated list of common voices instead
    const commonVoices = [
      {
        voice_id: "en-US-JennyNeural",
        name: "Jenny (Neural)",
        gender: "female",
        language: "en-US",
        provider: "microsoft"
      },
      {
        voice_id: "en-US-GuyNeural", 
        name: "Guy (Neural)",
        gender: "male",
        language: "en-US",
        provider: "microsoft"
      },
      {
        voice_id: "en-US-AriaNeural",
        name: "Aria (Neural)", 
        gender: "female",
        language: "en-US",
        provider: "microsoft"
      },
      {
        voice_id: "en-GB-SoniaNeural",
        name: "Sonia (Neural)",
        gender: "female", 
        language: "en-GB",
        provider: "microsoft"
      },
      {
        voice_id: "en-GB-RyanNeural",
        name: "Ryan (Neural)",
        gender: "male",
        language: "en-GB", 
        provider: "microsoft"
      }
    ];

    console.log('Returning curated voices:', commonVoices.length)

    return new Response(JSON.stringify({ voices: commonVoices }), {
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