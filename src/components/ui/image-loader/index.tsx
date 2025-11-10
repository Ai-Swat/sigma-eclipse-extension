import styles from './styles.module.css'

export function ImageLoader() {
  const size = 56

  return (
    <div style={{ width: size, height: size }} className={styles.wrapper}>
      <svg
        className={styles.icon}
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='20'
        viewBox='0 0 21 20'
        fill='none'
      >
        <path
          d='M15.2503 1.66663C13.4093 1.66663 11.9169 3.15901 11.9169 4.99996C11.9169 6.84091 13.4093 8.33329 15.2503 8.33329C17.0912 8.33329 18.5836 6.84091 18.5836 4.99996C18.5836 3.15901 17.0912 1.66663 15.2503 1.66663Z'
          fill='inherit'
        />
        <path
          d='M15.0554 9.9627C14.6467 9.79319 14.1873 9.79319 13.7785 9.9627C13.4693 10.091 13.2579 10.3138 13.1054 10.5028C12.9714 10.669 12.828 10.8812 12.6744 11.1115L10.3464 7.74889C10.1784 7.50611 10.0217 7.27984 9.87642 7.10581C9.72381 6.92307 9.51413 6.70981 9.21124 6.58668C8.80881 6.42309 8.35841 6.42309 7.95597 6.58668C7.65308 6.70981 7.44341 6.92307 7.2908 7.10581C7.14546 7.27984 6.98885 7.5061 6.8208 7.74889L1.82631 14.9632C1.60944 15.2764 1.41501 15.5572 1.2804 15.7954C1.14631 16.0328 0.991033 16.3605 1.00928 16.7455C1.03255 17.2364 1.27125 17.692 1.66159 17.9905C1.96779 18.2247 2.32563 18.2836 2.59708 18.3084C2.86958 18.3333 3.2111 18.3333 3.59205 18.3333L16.0836 18.3333C16.0866 18.3333 16.0896 18.3333 16.0925 18.3333L16.9616 18.3333C17.3353 18.3333 17.6713 18.3333 17.94 18.3087C18.2089 18.2841 18.5615 18.2256 18.8654 17.9958C19.254 17.7018 19.4945 17.2524 19.5236 16.7659C19.5463 16.3856 19.3993 16.0598 19.2706 15.8224C19.1421 15.5852 18.9557 15.3056 18.7484 14.9947L16.2013 11.1741C16.0318 10.9198 15.8745 10.6839 15.7285 10.5028C15.5761 10.3138 15.3647 10.091 15.0554 9.9627Z'
          fill='inherit'
        />
      </svg>

      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
        <radialGradient id='a10' cx='.66' fx='.66' cy='.3125' fy='.3125'>
          <stop offset='0' stopColor='#007affff' />
        </radialGradient>
        <circle
          //eslint-disable-next-line react/no-unknown-property
          transform-origin='center'
          fill='none'
          stroke='url(#a10)'
          strokeWidth='14'
          strokeLinecap='round'
          strokeDasharray='200 1000'
          strokeDashoffset='0'
          cx='100'
          cy='100'
          r='90'
        >
          <animateTransform
            type='rotate'
            attributeName='transform'
            calcMode='spline'
            dur='2'
            values='360;0'
            keyTimes='0;1'
            keySplines='0 0 1 1'
            repeatCount='indefinite'
          />
        </circle>
        <circle
          //eslint-disable-next-line react/no-unknown-property
          transform-origin='center'
          fill='none'
          opacity='1'
          stroke='inherit'
          strokeWidth='14'
          strokeLinecap='round'
          cx='100'
          cy='100'
          r='90'
          className={styles.circle}
        />
      </svg>
    </div>
  )
}
