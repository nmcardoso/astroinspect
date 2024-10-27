import {version} from '../../../package.json'

export default function Version() {
  return (
    <span className="text-muded text-secondary fw-bold small">
      v{version}
    </span>
  )
}