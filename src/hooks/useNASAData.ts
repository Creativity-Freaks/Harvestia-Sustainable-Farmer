import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

type NASADataType = 'MODIS' | 'SMAP' | 'GISS' | 'OCO-2' | 'Landsat'

interface NASADataRequest {
  dataType: NASADataType
  location?: string
  startDate?: string
  endDate?: string
}

export const useNASAData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchNASAData = useCallback(async (request: NASADataRequest) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('nasa-data', {
        body: request
      })

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NASA data'
      setError(errorMessage)
      toast({
        title: "NASA Data Error",
        description: errorMessage,
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchMODISData = useCallback((location?: string) => 
    fetchNASAData({ dataType: 'MODIS', location }), [fetchNASAData])
  
  const fetchSMAPData = useCallback((location?: string) => 
    fetchNASAData({ dataType: 'SMAP', location }), [fetchNASAData])
  
  const fetchGISSData = useCallback((location?: string) => 
    fetchNASAData({ dataType: 'GISS', location }), [fetchNASAData])
  
  const fetchOCO2Data = useCallback((location?: string) => 
    fetchNASAData({ dataType: 'OCO-2', location }), [fetchNASAData])
  
  const fetchLandsatData = useCallback((location?: string) => 
    fetchNASAData({ dataType: 'Landsat', location }), [fetchNASAData])

  return {
    loading,
    error,
    fetchNASAData,
    fetchMODISData,
    fetchSMAPData,
    fetchGISSData,
    fetchOCO2Data,
    fetchLandsatData
  }
}