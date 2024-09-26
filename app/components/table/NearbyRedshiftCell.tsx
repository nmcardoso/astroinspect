import { useEffect, useState, useMemo } from 'react'
import { useXTableData } from '@/contexts/XTableDataContext'
import TableHelper from '@/lib/TableHelper'
import LegacyService from '@/services/LegacyService'
import Spinner from 'react-bootstrap/Spinner'

const legacyService = new LegacyService()

const RedshiftList = ({ redshifts }: { redshifts: string[] }) => {
  return (
    <>
      {redshifts.map((r, i) => (
        <div key={i}>
          <span>{r}</span>
          {i != redshifts.length - 1 && <hr className="my-1" />}
        </div>
      ))}
    </>
  )
}

export default function NearbyRedshiftCell({ rowId }: { rowId: number }) {
  const [redshifts, setRedshifts] = useState<string[] | null>(null)
  const { tdState } = useXTableData()
  const ra = useMemo(() => TableHelper.getRa(rowId, tdState), [rowId, tdState])
  const dec = useMemo(() => TableHelper.getDec(rowId, tdState), [rowId, tdState])

  useEffect(() => {
    legacyService.getNearbyRedshift(ra, dec, 0).then((resp: any) => {
      setRedshifts(resp[0]?.name.slice(0, 3))
    })
  }, [ra, dec])

  return (
    <>
      {redshifts === null ?
        <Spinner
          as="span"
          size="sm"
          role="status"
          animation="border"
          variant="secondary" /> :
        redshifts === undefined ?
          <>-</> :
          <RedshiftList redshifts={redshifts} />}
    </>
  )
}