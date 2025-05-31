import { Roboto, Lato, Montserrat, Open_Sans } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], weight: ['400'] })
const lato = Lato({ subsets: ['latin'], weight: ['400'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400'] })
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400'] })

export const availableFonts = [
  { label: 'Roboto', fontFamily: roboto.style.fontFamily },
  { label: 'Lato', fontFamily: lato.style.fontFamily },
  { label: 'Montserrat', fontFamily: montserrat.style.fontFamily },
  { label: 'Open Sans', fontFamily: openSans.style.fontFamily },
]

export const chakraFonts = {
  heading: roboto.style.fontFamily,
  body: roboto.style.fontFamily,
}
