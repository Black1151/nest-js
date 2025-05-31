import { Roboto, Lato, Montserrat, Open_Sans } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'] })
const lato = Lato({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

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
