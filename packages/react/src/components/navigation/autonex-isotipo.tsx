import type { SVGProps } from "react"

/**
 * Isotipo de Autonex en trazo plano (`currentColor`): las dos formas del
 * logotipo sin su degradado. Es el hueco por defecto del rail cuando no hay
 * selector de organización; la app puede pasar el isotipo oficial por `logo`.
 */
export function AutonexIsotipo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="250 260 1295 1010" fill="currentColor" role="img" aria-label="Autonex" {...props}>
      <path d="M1511.49,1258.43h-522.3c-20.49,0-30.67-24.79-15.95-39.05,90.91-88.04,281.05-341.84,285.88-927.37.1-12.52,10.18-22.8,22.7-22.8h229.68c12.6,0,22.81,10.21,22.81,22.81v943.6c0,12.6-10.21,22.81-22.81,22.81Z" />
      <path d="M285.39,1258.4c225.56-1,724.96-30.31,821.27-890.58,2.64-23.59-28.02-35.41-41.42-15.82-99.83,146.05-351,435.1-780.18,444.91-12.43.28-22.49,10.21-22.49,22.64v416.02c0,12.65,10.17,22.88,22.82,22.82Z" />
    </svg>
  )
}
