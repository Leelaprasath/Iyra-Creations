import { Link, useNavigate } from 'react-router'
import { transitionTo } from '../../runtime/transition'

/** A router Link that plays the IYRA page transition before navigating. */
export function TransitionLink({ to, onClick, ...rest }) {
  const navigate = useNavigate()
  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    transitionTo(navigate, to)
  }
  return <Link to={to} onClick={handleClick} {...rest} />
}
