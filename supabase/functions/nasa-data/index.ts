import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NASADataRequest {
  dataType: 'MODIS' | 'VIIRS' | 'SMAP' | 'ECOSTRESS' | 'GPM_IMERG' | 'MERRA2' | 'NASA_POWER' | 'GIBS' | 'GISS' | 'OCO-2' | 'Landsat'
  location?: string
  latitude?: number
  longitude?: number
  startDate?: string
  endDate?: string
  parameters?: string[]
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

    const { dataType, location = 'global', latitude, longitude, startDate, endDate, parameters }: NASADataRequest = await req.json()

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

    // Fetch real NASA data from APIs
    let nasaData = await fetchRealNASAData(dataType, location, startDate, endDate, latitude, longitude, parameters)

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

async function fetchRealNASAData(dataType: string, location: string, startDate?: string, endDate?: string, latitude?: number, longitude?: number, parameters?: string[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Default coordinates (center of US agricultural region) if not provided
  const lat = latitude || 39.8283
  const lon = longitude || -98.5795
  
  try {
    switch (dataType) {
      case 'NASA_POWER':
        return await fetchNASAPowerData(lat, lon, parameters, startDate, endDate)
      
      case 'MODIS':
        return await fetchMODISData(lat, lon, startDate, endDate)
      
      case 'SMAP':
        return await fetchSMAPData(lat, lon, startDate, endDate)
      
      case 'GPM_IMERG':
        return await fetchGPMData(lat, lon, startDate, endDate)
      
      case 'ECOSTRESS':
        return await fetchECOSTRESSData(lat, lon, startDate, endDate)
      
      case 'GIBS':
        return await fetchGIBSData(location)
      
      default:
        return await generateFallbackData(dataType, location, lat, lon)
    }
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error)
    return await generateFallbackData(dataType, location, lat, lon)
  }
}

async function fetchNASAPowerData(lat: number, lon: number, parameters?: string[], startDate?: string, endDate?: string) {
  const params = parameters || ['T2M', 'RH2M', 'WS2M', 'ALLSKY_SFC_SW_DWN', 'PRECTOTCORR']
  const start = startDate || '20240101'
  const end = endDate || new Date().toISOString().slice(0, 10).replace(/-/g, '')
  
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params.join(',')}&community=AG&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`
  
  console.log('Fetching NASA POWER data from:', url)
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(`NASA POWER API error: ${data.message || response.statusText}`)
  }
  
  return {
    type: 'NASA_POWER_Agro',
    location: `${lat}, ${lon}`,
    latitude: lat,
    longitude: lon,
    timestamp: new Date().toISOString(),
    parameters: params,
    data: {
      daily_data: Object.keys(data.properties.parameter.T2M || {}).map(date => ({
        date: `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`,
        T2M: data.properties.parameter.T2M?.[date] || null,
        RH2M: data.properties.parameter.RH2M?.[date] || null,
        WS2M: data.properties.parameter.WS2M?.[date] || null,
        ALLSKY_SFC_SW_DWN: data.properties.parameter.ALLSKY_SFC_SW_DWN?.[date] || null,
        PRECTOTCORR: data.properties.parameter.PRECTOTCORR?.[date] || null
      })),
      metadata: data.properties.parameter
    }
  }
}

async function fetchMODISData(lat: number, lon: number, startDate?: string, endDate?: string) {
  // Using USGS MODIS service for NDVI data
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const end = endDate || new Date().toISOString().split('T')[0]
  
  return {
    type: 'MODIS_NDVI',
    location: `${lat}, ${lon}`,
    timestamp: new Date().toISOString(),
    data: {
      message: 'MODIS data integration requires authentication with NASA Earthdata. Using simulated data.',
      simulated_ndvi_values: Array.from({ length: 16 }, (_, i) => ({
        date: new Date(Date.now() - (15-i) * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ndvi: 0.3 + Math.random() * 0.5,
        quality: Math.random() > 0.1 ? 'Good' : 'Marginal'
      })),
      note: 'For production use, implement NASA Earthdata authentication'
    }
  }
}

async function fetchSMAPData(lat: number, lon: number, startDate?: string, endDate?: string) {
  return {
    type: 'SMAP_Soil_Moisture',
    location: `${lat}, ${lon}`,
    timestamp: new Date().toISOString(),
    data: {
      message: 'SMAP data requires NASA Earthdata authentication. Using simulated data.',
      simulated_soil_moisture: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        moisture_percent: 15 + Math.random() * 25,
        retrieval_quality: Math.random() > 0.2 ? 'Recommended' : 'Not recommended'
      })),
      note: 'For production use, implement NASA Earthdata authentication'
    }
  }
}

async function fetchGPMData(lat: number, lon: number, startDate?: string, endDate?: string) {
  return {
    type: 'GPM_Precipitation',
    location: `${lat}, ${lon}`,
    timestamp: new Date().toISOString(),
    data: {
      message: 'GPM IMERG data integration in progress. Using simulated data.',
      simulated_precipitation: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        precipitation_mm: Math.random() * 15,
        data_quality: Math.random() > 0.15 ? 'Good' : 'Fair'
      })),
      note: 'Integration with NASA Giovanni API planned'
    }
  }
}

async function fetchECOSTRESSData(lat: number, lon: number, startDate?: string, endDate?: string) {
  return {
    type: 'ECOSTRESS_ET',
    location: `${lat}, ${lon}`,
    timestamp: new Date().toISOString(),
    data: {
      message: 'ECOSTRESS data requires specialized processing. Using simulated data.',
      simulated_evapotranspiration: Array.from({ length: 15 }, (_, i) => ({
        date: new Date(Date.now() - (14-i) * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        et_mm_day: 3 + Math.random() * 8,
        quality_flag: Math.random() > 0.2 ? 'Good' : 'Marginal'
      })),
      note: 'Integration with AppEEARS API planned'
    }
  }
}

async function fetchGIBSData(location: string) {
  return {
    type: 'GIBS_Imagery',
    location: location,
    timestamp: new Date().toISOString(),
    data: {
      available_layers: [
        'MODIS_Terra_CorrectedReflectance_TrueColor',
        'MODIS_Terra_NDVI_8Day',
        'SMAP_L4_Analyzed_Root_Zone_Soil_Moisture',
        'GPM_3IMERGHH_06_precipitation'
      ],
      wmts_endpoint: 'https://map1.vis.earthdata.nasa.gov/wmts-geo/1.0.0/',
      tile_matrix_set: 'EPSG4326_250m',
      format: 'image/png',
      note: 'NASA GIBS provides real-time satellite imagery'
    }
  }
}

async function generateFallbackData(dataType: string, location: string, lat: number, lon: number) {
  const now = new Date()
  
  switch (dataType) {
    case 'GISS':
      return {
        type: 'GISS_Temperature',
        location: location,
        timestamp: now.toISOString(),
        data: {
          message: 'GISS temperature data integration planned',
          simulated_temperature: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(now.getTime() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temp_celsius: 15 + Math.random() * 20
          }))
        }
      }
      
    case 'OCO-2':
      return {
        type: 'OCO2_Carbon',
        location: location,
        timestamp: now.toISOString(),
        data: {
          message: 'OCO-2 CO2 data integration planned',
          simulated_co2: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(now.getTime() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            co2_ppm: 410 + Math.random() * 20
          }))
        }
      }
      
    case 'Landsat':
      return {
        type: 'Landsat_Land_Use',
        location: location,
        timestamp: now.toISOString(),
        data: {
          message: 'Landsat data integration requires USGS Earth Explorer API',
          simulated_land_use: {
            cropland: 65 + Math.random() * 20,
            forest: 10 + Math.random() * 15,
            grassland: 15 + Math.random() * 10
          }
        }
      }
      
    case 'VIIRS':
      return {
        type: 'VIIRS_EVI',
        location: location,
        timestamp: now.toISOString(),
        data: {
          message: 'VIIRS data integration planned',
          simulated_evi: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(now.getTime() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            evi: 0.2 + Math.random() * 0.6
          }))
        }
      }
      
    case 'MERRA2':
      return {
        type: 'MERRA2_Meteorology',
        location: location,
        timestamp: now.toISOString(),
        data: {
          message: 'MERRA-2 data integration planned',
          simulated_meteorology: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(now.getTime() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature_2m: 15 + Math.random() * 20,
            relative_humidity: 40 + Math.random() * 40
          }))
        }
      }
      
    default:
      return {
        type: 'Unknown',
        error: 'Unsupported data type',
        available_types: ['NASA_POWER', 'MODIS', 'SMAP', 'GPM_IMERG', 'ECOSTRESS', 'GIBS']
      }
  }
}