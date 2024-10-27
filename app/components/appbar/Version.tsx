import packageJson from '@/../package.json'

export default function Version() {
  return (
    <span className="text-muded text-secondary fw-bold small">
      v{packageJson.version}
    </span>
  )
}