import SvgIcon from '@mui/material/SvgIcon'

export default function ReticleIcon() {
  return (
    <SvgIcon>
      <svg id="reticle" viewBox="0 0 16 16" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="rgb(178, 50, 178)">
        <path d="M 0 7 L 5 7 L 5 9 L 0 9 L 0 7 Z" fill-rule="evenodd"></path>
        <path d="M 11 7 L 16 7 L 16 9 L 11 9 L 11 7 Z" fill-rule="evenodd"></path>
        <path d="M 7 11 L 9 11 L 9 16 L 7 16 L 7 11 Z" fill-rule="evenodd"></path>
        <path d="M 7 0 L 9 0 L 9 5 L 7 5 L 7 0 Z" fill-rule="evenodd"></path>
      </svg>
    </SvgIcon>
  )
}