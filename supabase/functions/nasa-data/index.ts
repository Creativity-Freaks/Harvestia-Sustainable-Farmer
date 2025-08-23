import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NASADataRequest {
  dataType: 'MODIS' | 'SMAP' | 'GISS' | 'OCO-2' | 'Landsat'
  location?: string
  startDate?: string
  endDate?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { dataType, location = 'global', startDate, endDate }: NASADataRequest = await req.json()

    // Check cache first
    const { data: cachedData } = await supabase
      .from('nasa_data_cache')
      .select('data')
      .eq('data_type', dataType)
      .eq('location', location)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (cachedData) {
      console.log(`Returning cached NASA ${dataType} data for ${location}`)
      return new Response(JSON.stringify(cachedData.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate realistic NASA data (in production, this would call actual NASA APIs)
    let nasaData = generateNASAData(dataType, location, startDate, endDate)

    // Cache the data
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 6) // Cache for 6 hours

    await supabase
      .from('nasa_data_cache')
      .upsert({
        data_type: dataType,
        location: location,
        data: nasaData,
        expires_at: expiresAt.toISOString()
      })

    console.log(`Generated and cached NASA ${dataType} data for ${location}`)

    return new Response(JSON.stringify(nasaData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('NASA Data API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateNASAData(dataType: string, location: string, startDate?: string, endDate?: string) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  switch (dataType) {
    case 'MODIS':
      // Vegetation health and crop monitoring
      return {
        type: 'MODIS_NDVI',
        location: location,
        timestamp: now.toISOString(),
        data: {
          ndvi_values: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            ndvi: 0.3 + Math.random() * 0.5, // NDVI range 0.3-0.8
            vegetation_health: Math.random() > 0.2 ? 'Good' : 'Stressed'
          })),
          average_ndvi: 0.55,
          trend: Math.random() > 0.5 ? 'Improving' : 'Declining',
          crop_health_score: 75 + Math.random() * 20
        }
      }
      
    case 'SMAP':
      // Soil moisture data
      return {
        type: 'SMAP_Soil_Moisture',
        location: location,
        timestamp: now.toISOString(),
        data: {
          soil_moisture_levels: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            moisture_percent: 15 + Math.random() * 25, // 15-40% moisture
            depth_cm: 5,
            status: Math.random() > 0.3 ? 'Adequate' : 'Low'
          })),
          average_moisture: 27.5,
          irrigation_recommendation: Math.random() > 0.6 ? 'Recommended' : 'Not needed',
          drought_risk: Math.random() > 0.7 ? 'High' : 'Low'
        }
      }
      
    case 'GISS':
      // Climate and temperature data
      return {
        type: 'GISS_Temperature',
        location: location,
        timestamp: now.toISOString(),
        data: {
          temperature_data: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temp_celsius: 15 + Math.random() * 20,
            humidity: 40 + Math.random() * 40,
            precipitation_mm: Math.random() * 10
          })),
          climate_trend: Math.random() > 0.5 ? 'Warming' : 'Stable',
          growing_season_outlook: Math.random() > 0.3 ? 'Favorable' : 'Challenging',
          frost_risk: Math.random() > 0.8 ? 'High' : 'Low'
        }
      }
      
    case 'OCO-2':
      // Carbon dioxide monitoring
      return {
        type: 'OCO2_Carbon',
        location: location,
        timestamp: now.toISOString(),
        data: {
          co2_levels: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            co2_ppm: 410 + Math.random() * 20,
            carbon_flux: -2 + Math.random() * 4 // Negative = absorption
          })),
          carbon_sequestration_rate: 2.5 + Math.random() * 2,
          sustainability_score: 65 + Math.random() * 30,
          recommendation: 'Consider cover crops to increase carbon absorption'
        }
      }
      
    case 'Landsat':
      // Land use and change detection
      return {
        type: 'Landsat_Land_Use',
        location: location,
        timestamp: now.toISOString(),
        data: {
          land_classification: {
            cropland: 65 + Math.random() * 20,
            forest: 10 + Math.random() * 15,
            grassland: 15 + Math.random() * 10,
            urban: 5 + Math.random() * 5,
            water: 2 + Math.random() * 3
          },
          change_detection: {
            crop_expansion: Math.random() * 5,
            deforestation_rate: Math.random() * 2,
            urbanization_rate: Math.random() * 3
          },
          land_health_index: 70 + Math.random() * 25
        }
      }
      
    default:
      return {
        type: 'Unknown',
        error: 'Unsupported data type'
      }
  }
}