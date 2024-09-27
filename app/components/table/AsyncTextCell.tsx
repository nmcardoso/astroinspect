import { CustomCellRendererProps } from 'ag-grid-react'
import { MdErrorOutline, MdDownload } from "react-icons/md"
import { IoMdTime } from "react-icons/io"
import { useMemo } from 'react'
import { loadErrorState, loadingState, queuedState } from '@/lib/states'


const QueuedPlaceholder = () =>
  <span className="text-dark"><IoMdTime size={15} /> Queued</span>

const LoadingPlaceholder = () =>
  <span className="text-primary"><MdDownload size={15} /> Downloading</span>

const ErrorPlaceholder = () =>
  <span className="text-danger"><MdErrorOutline size={15} /> Server Error</span>



export default function AsyncTextCell(params: CustomCellRendererProps) {
  const AsyncText = useMemo(() => {
    if (params.value === queuedState) {
      return QueuedPlaceholder
    } else if (params.value === loadingState) {
      return LoadingPlaceholder
    } else if (params.value === loadErrorState) {
      return ErrorPlaceholder
    } else {
      const Text = () => <span>{params.value}</span>
      return Text
    }
  }, [params.value])

  
  return (
    <AsyncText />
    // <span>{params.value}</span>
  )
}