import React, { ReactElement } from 'react'

interface Props {
  className?: string
  size?: number
}

function WarningIcon({ className, size = 24 }: Props): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={size} width={size} className={className}>
      <path fill="currentColor" d="M12 5.99 19.53 19H4.47L12 5.99M12 2 1 21h22L12 2z" />
      <path fill="currentColor" d="M13 16h-2v2h2zM13 10h-2v5h2z" />
    </svg>
  )
}

export default WarningIcon
