import type { SVGProps } from 'react'

export function DomusLogo({
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 458 148"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        d="M20 24h30c36 0 50 22 50 50s-14 50-50 50H20V24Zm16 14h12c22 0 33 16 33 36s-11 36-33 36H36V38Z"
      />
      <path d="M12 24h15v3.2H12V24Zm0 96.8h15V124H12v-3.2Z" />
      <path
        fillRule="evenodd"
        d="M157 24c22.64 0 41 22.39 41 50s-18.36 50-41 50-41-22.39-41-50 18.36-50 41-50Zm0 13.5c-13.81 0-25 16.34-25 36.5s11.19 36.5 25 36.5 25-16.34 25-36.5-11.19-36.5-25-36.5Z"
      />
      <path d="M214 24h16v100h-16V24Zm-8 0h26v3.2h-26V24Zm0 96.8h26V124h-26v-3.2Z" />
      <path d="M280 24h16v100h-16V24Zm-2 0h20v3.2h-20V24Z" />
      <path d="M226.89 37 276.89 115 283.11 111 233.11 33Z" />
      <path d="M276.89 33 226.89 111 233.11 115 283.11 37Z" />
      <path d="M255 67.6 261.4 74 255 80.4 248.6 74Z" />
      <path d="M340 24h16v80h-16V24Zm-2 0h26v3.2h-26V24Z" />
      <path d="M280 86a38 38 0 0 0 76 0h-16a22 22 0 0 0-44 0h-16Z" />
      <path d="M316.4 28.2h3.2V106h-3.2V28.2ZM313 24h10v3.2h-10V24Z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={15.5}
        strokeLinecap="butt"
        strokeLinejoin="round"
        d="M390 50c0-14 8-18 16-18s24 6 24 18-12 18-24 22c-16 8-24 16-24 28s10 16 24 16 24-6 24-16"
      />
    </svg>
  )
}
