

interface ErrorTextProps {
  message: string | undefined
}

export function ErrorText({ message }: ErrorTextProps) {
  if (!message) return null
  return (
    <p role="alert" className="text-red-400 text-xs mt-1">
      {message}
    </p>
  )
}
