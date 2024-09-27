

export default function DownloadTableButton() {
  return (
    <Button 
      variant="outline-primary" 
      className="d-inline-flex align-items-center"
      onClick={() => {}}>
      <AiOutlineCloudDownload size={19} className="me-1" />
      <span>Download</span>
    </Button>
  )
}