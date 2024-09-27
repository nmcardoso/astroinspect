import { BsGithub } from 'react-icons/bs'
import Button from 'react-bootstrap/Button'

export default function GithubButton() {
  return (
    <Button
      className="me-2"
      size="sm"
      variant="outline-primary"
      href="https://github.com/nmcardoso/astrotools"
      target="_BLANK">
      <BsGithub size={20} />
  </Button>
  )
}