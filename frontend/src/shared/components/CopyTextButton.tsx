import { ContentCopy } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import type { IconButtonProps } from '@mui/material'
import { useClipboard } from '../hooks/useClipboard'

export type CopyTextButtonProps = IconButtonProps & {
  text: string
}

const COPIED_DELAY = 2000

export const CopyTextButton = ({ text, ...props }: CopyTextButtonProps) => {
  const { isCopying, copy } = useClipboard({ leaveDelay: COPIED_DELAY })

  return (
    <Tooltip
      title={isCopying ? 'Copied!' : props.title || 'Copy'}
      leaveDelay={isCopying ? COPIED_DELAY : undefined}
      disableHoverListener={props.disabled}
      disableTouchListener={props.disabled}
    >
      <IconButton
        {...props}
        onClick={(event) => {
          props.onClick?.(event)
          void copy(text)
        }}
      >
        <ContentCopy fontSize="small" sx={{ opacity: isCopying ? 0.5 : 1 }} />
      </IconButton>
    </Tooltip>
  )
}
