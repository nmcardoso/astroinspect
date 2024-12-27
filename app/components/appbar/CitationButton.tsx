import { useCallback, useEffect, useState } from 'react'
import AppbarButton from './AppbarButton'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import copy from 'copy-to-clipboard'
import { useNotifications } from '@/contexts/NotificationsContext'


const DOI = '10.5281/zenodo.7268504'
const CITATION = `@software{astroinspect,
    doi = {10.5281/zenodo.7268504},
    url = {https://doi.org/10.5281/zenodo.7268504},
    year = {2022},
    month = oct,
    publisher = {Zenodo},
    author = {Cardoso, N. M.},
    title = {AstroInspect: Web-based visual inspection tool}
}`


const CitationModal = () => {
  const [isDoiCopied, setDoiCopied] = useState(false)
  const [isCitationCopied, setCitationCopied] = useState(false)
  const notification = useNotifications()

  useEffect(() => {
    if (isDoiCopied) setTimeout(() => setDoiCopied(false), 3000)
    if (isCitationCopied) setTimeout(() => setCitationCopied(false), 3000)
  }, [isDoiCopied, isCitationCopied])


  const handleDOICopy = useCallback(() => {
    copy(DOI, {onCopy: () => notification?.show('DOI copied to clipboard!', {severity: 'success', autoHideDuration: 2500})})
  }, [notification])

  const handleBibtexCopy = useCallback(() => {
    copy(CITATION, {onCopy: () => notification?.show('CITATION copied to clipboard!', {severity: 'success', autoHideDuration: 2500})})
  }, [notification])

  return (
    <Box>
      <Typography sx={{ mb: 2 }}>
        If you used this software during the production process of
        your scientific project, please consider citing it with
        the information provided below.
      </Typography>

      <Typography variant="overline">DOI</Typography>
      <Button size="small" variant="text" onClick={handleDOICopy}>Copy</Button>
      <Typography gutterBottom>{DOI}</Typography>

      <Typography variant="overline">BIBTEX</Typography>
      <Button size="small" variant="text" onClick={handleBibtexCopy}>Copy</Button>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          component="div"
          sx={(theme) => ({
            whiteSpace: 'normal',
            my: 0,
            p: 1,
            bgcolor: 'grey.100',
            color: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            ...theme.applyStyles('dark', {
              bgcolor: '#101010',
              color: 'grey.300',
              borderColor: 'grey.800',
            }),
          })}>
          <pre>
            {CITATION}
          </pre>

        </Box>
      </Stack>

      {/* <CopyToClipboard
            text={DOI}
            onCopy={() => setDoiCopied(true)}>
            <Button variant="link" size="sm">Copy to Clipboard</Button>
          </CopyToClipboard>
          {isDoiCopied && <small className="text-success ms-3">Copied!</small>} */}


      {/* <CopyToClipboard
            text={CITATION}
            onCopy={() => setCitationCopied(true)}>
            <Button variant="link" size="sm">Copy to Clipboard</Button>
          </CopyToClipboard>
          {isCitationCopied && <small className="text-success ms-3">Copied!</small>} */}

    </Box>
  )
}

export default function CitationButton() {
  return (
    <AppbarButton
      icon={<FormatQuoteIcon />}
      tooltip="Cite this software"
      modal={<CitationModal />}
      modalWidth={620}
      modalTitle="Citation"
      modalIcon={<FormatQuoteIcon />} />
  )
}