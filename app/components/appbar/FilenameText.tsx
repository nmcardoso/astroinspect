import { useXTableConfig } from "@/contexts/XTableConfigContext"

export default function FilenameText() {
  const { tcState } = useXTableConfig()

  return (
    <div 
      className="text-muted" 
      style={{
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        maxWidth: '310px', 
        whiteSpace: 'nowrap'
      }}>
        {tcState.table?.file?.name}
    </div>
  )
}