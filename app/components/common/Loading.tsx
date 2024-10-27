import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'

export default function Loading() {
  return (
    <Stack direction="horizontal">
      <Spinner animation="border" role="status" variant="secondary" size="sm" />
      <span className="text-secondary ms-2">Loading...</span>
    </Stack>
  )
}