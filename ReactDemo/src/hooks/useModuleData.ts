import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getSchema, getDetail, getDetailSections, type ModuleSchema, type ModuleRow, type ModuleSection } from '../services/api'

export type UseModuleDataResult = {
  schema: ModuleSchema | null
  detailData: ModuleRow | null
  sections: ModuleSection[]
  loading: boolean
  error: string | null
  basePath: string
  detailId: string
}

/**
 * 通用模块数据获取 Hook
 * 自动根据当前路由获取 schema 和详情数据
 */
export function useModuleData(): UseModuleDataResult {
  const { pathname } = useLocation()
  const params = useParams()
  
  const [schema, setSchema] = useState<ModuleSchema | null>(null)
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 解析基础路径和详情ID
  const basePath = (() => {
    const parts = pathname.split('/').filter(Boolean)
    // 如果有动态参数 id，则取前面的部分作为 basePath
    if (params.id) {
      return `/${parts.slice(0, -1).join('/')}`
    }
    return pathname
  })()
  
  const detailId = params.id ?? ''
  
  useEffect(() => {
    let cancelled = false
    
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        // 获取 Schema
        const schemaRes = await getSchema(basePath)
        if (cancelled) return
        
        if (schemaRes.code !== 200 || !schemaRes.data) {
          setError('页面配置加载失败')
          return
        }
        
        setSchema(schemaRes.data)
        
        // 如果有 detailId，获取详情数据
        if (detailId) {
          const [detailRes, sectionsRes] = await Promise.all([
            getDetail(basePath, detailId),
            getDetailSections(basePath, detailId)
          ])
          
          if (cancelled) return
          
          if (detailRes.code === 200 && detailRes.data) {
            setDetailData(detailRes.data)
          }
          
          if (sectionsRes.code === 200 && sectionsRes.data) {
            setSections(sectionsRes.data)
          } else if (schemaRes.data.sections) {
            // fallback 到 schema 中的 sections
            setSections(schemaRes.data.sections)
          }
        } else {
          // 列表页或没有 detailId 的情况
          setSections(schemaRes.data.sections ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '加载失败')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      cancelled = true
    }
  }, [basePath, detailId])
  
  return {
    schema,
    detailData,
    sections,
    loading,
    error,
    basePath,
    detailId
  }
}
