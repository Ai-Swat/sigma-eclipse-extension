import { MasterCardIcon } from './icons/MasterCardIcon'
import cn from 'clsx'
import css from './styles.module.css'

export type CardType =
  | 'mastercard'
  | 'visa'
  | 'amex'
  | 'diners'
  | 'discover'
  | 'eftpos_au'
  | 'jcb'
  | 'unionpay'
  | 'unknown'

export function PaymentMethodItem(props: { className?: string }) {
  const type = 'mastercard'
  const number = '51241111111114292'
  const cardNumber = `${number?.slice(0, 4)}..${number?.slice(-4)}`
  const cardDate = '1/2026'

  const CardIcon = () => {
    if (type === 'mastercard') return <MasterCardIcon />
    // if (type === 'visa') return <VisaIcon />
    // if (type === 'amex') return <AmexIcon />
    // if (type === 'discover') return <DiscoverIcon />
    // if (type === 'diners') return <DinersIcon />
    // if (type === 'jcb') return <JCBIcon />
    // if (type === 'unionpay') return <UnionPayIcon />

    return null
  }

  return (
    <div className={cn(css.wrapper, props.className)}>
      <CardIcon />

      <div>{cardNumber}</div>

      <div>{cardDate}</div>
    </div>
  )
}
