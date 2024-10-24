import { BsGithub } from 'react-icons/bs'
import Button from 'react-bootstrap/Button'

export default function GithubButton() {
  return (
    <Button
      size="sm"
      variant="outline-primary"
      href="https://github.com/nmcardoso/astrotools"
      target="_BLANK">
      <BsGithub size={20} />
  </Button>
  )
}