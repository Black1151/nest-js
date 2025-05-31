import {
  Roboto,
  Lato,
  Montserrat,
  Open_Sans,
  Oswald,
  Slabo_27px,
  Source_Sans_Pro,
  Raleway,
  Poppins,
  Roboto_Condensed,
  Roboto_Slab,
  PT_Sans,
  Merriweather,
  Nunito,
  Ubuntu,
  Fira_Sans,
  Playfair_Display,
  Titillium_Web,
  Indie_Flower,
  Dancing_Script,
  Inconsolata,
  Bebas_Neue,
  Arimo,
  Noto_Sans,
  Noto_Serif,
  Tinos,
  Yanone_Kaffeesatz,
  Cabin,
  Bitter,
  Fjalla_One,
  Hind,
  Libre_Baskerville,
  Work_Sans,
  Cairo,
  Heebo,
  Lora,
  Mukta,
  Quicksand,
  Rubik,
  IBM_Plex_Sans,
  Noto_Sans_JP,
  Barlow,
  Inter,
  Manrope,
  Mulish,
  PT_Serif,
  Asap,
  Cinzel,
  Josefin_Sans,
  Anton
} from 'next/font/google';

const roboto = Roboto({ subsets: ['latin'], weight: ['400'] });
const lato = Lato({ subsets: ['latin'], weight: ['400'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400'] });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['400'] });
const slabo27 = Slabo_27px({ subsets: ['latin'], weight: ['400'] });
const sourceSansPro = Source_Sans_Pro({ subsets: ['latin'], weight: ['400'] });
const raleway = Raleway({ subsets: ['latin'], weight: ['400'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400'] });
const robotoCondensed = Roboto_Condensed({ subsets: ['latin'], weight: ['400'] });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], weight: ['400'] });
const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400'] });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400'] });
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400'] });
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['400'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400'] });
const titilliumWeb = Titillium_Web({ subsets: ['latin'], weight: ['400'] });
const indieFlower = Indie_Flower({ subsets: ['latin'], weight: ['400'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400'] });
const inconsolata = Inconsolata({ subsets: ['latin'], weight: ['400'] });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'] });
const arimo = Arimo({ subsets: ['latin'], weight: ['400'] });
const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400'] });
const notoSerif = Noto_Serif({ subsets: ['latin'], weight: ['400'] });
const tinos = Tinos({ subsets: ['latin'], weight: ['400'] });
const yanoneKaffeesatz = Yanone_Kaffeesatz({ subsets: ['latin'], weight: ['400'] });
const cabin = Cabin({ subsets: ['latin'], weight: ['400'] });
const bitter = Bitter({ subsets: ['latin'], weight: ['400'] });
const fjallaOne = Fjalla_One({ subsets: ['latin'], weight: ['400'] });
const hind = Hind({ subsets: ['latin'], weight: ['400'] });
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400'] });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400'] });
const cairo = Cairo({ subsets: ['latin'], weight: ['400'] });
const heebo = Heebo({ subsets: ['latin'], weight: ['400'] });
const lora = Lora({ subsets: ['latin'], weight: ['400'] });
const mukta = Mukta({ subsets: ['latin'], weight: ['400'] });
const quicksand = Quicksand({ subsets: ['latin'], weight: ['400'] });
const rubik = Rubik({ subsets: ['latin'], weight: ['400'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400'] });
const notoSansJp = Noto_Sans_JP({ subsets: ['latin'], weight: ['400'] });
const barlow = Barlow({ subsets: ['latin'], weight: ['400'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });
const manrope = Manrope({ subsets: ['latin'], weight: ['400'] });
const mulish = Mulish({ subsets: ['latin'], weight: ['400'] });
const ptSerif = PT_Serif({ subsets: ['latin'], weight: ['400'] });
const asap = Asap({ subsets: ['latin'], weight: ['400'] });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400'] });
const josefinSans = Josefin_Sans({ subsets: ['latin'], weight: ['400'] });
const anton = Anton({ subsets: ['latin'], weight: ['400'] });

export const availableFonts = [
  { label: 'Roboto', fontFamily: roboto.style.fontFamily },
  { label: 'Lato', fontFamily: lato.style.fontFamily },
  { label: 'Montserrat', fontFamily: montserrat.style.fontFamily },
  { label: 'Open Sans', fontFamily: openSans.style.fontFamily },
  { label: 'Oswald', fontFamily: oswald.style.fontFamily },
  { label: 'Slabo 27px', fontFamily: slabo27.style.fontFamily },
  { label: 'Source Sans Pro', fontFamily: sourceSansPro.style.fontFamily },
  { label: 'Raleway', fontFamily: raleway.style.fontFamily },
  { label: 'Poppins', fontFamily: poppins.style.fontFamily },
  { label: 'Roboto Condensed', fontFamily: robotoCondensed.style.fontFamily },
  { label: 'Roboto Slab', fontFamily: robotoSlab.style.fontFamily },
  { label: 'PT Sans', fontFamily: ptSans.style.fontFamily },
  { label: 'Merriweather', fontFamily: merriweather.style.fontFamily },
  { label: 'Nunito', fontFamily: nunito.style.fontFamily },
  { label: 'Ubuntu', fontFamily: ubuntu.style.fontFamily },
  { label: 'Fira Sans', fontFamily: firaSans.style.fontFamily },
  { label: 'Playfair Display', fontFamily: playfairDisplay.style.fontFamily },
  { label: 'Titillium Web', fontFamily: titilliumWeb.style.fontFamily },
  { label: 'Indie Flower', fontFamily: indieFlower.style.fontFamily },
  { label: 'Dancing Script', fontFamily: dancingScript.style.fontFamily },
  { label: 'Inconsolata', fontFamily: inconsolata.style.fontFamily },
  { label: 'Bebas Neue', fontFamily: bebasNeue.style.fontFamily },
  { label: 'Arimo', fontFamily: arimo.style.fontFamily },
  { label: 'Noto Sans', fontFamily: notoSans.style.fontFamily },
  { label: 'Noto Serif', fontFamily: notoSerif.style.fontFamily },
  { label: 'Tinos', fontFamily: tinos.style.fontFamily },
  { label: 'Yanone Kaffeesatz', fontFamily: yanoneKaffeesatz.style.fontFamily },
  { label: 'Cabin', fontFamily: cabin.style.fontFamily },
  { label: 'Bitter', fontFamily: bitter.style.fontFamily },
  { label: 'Fjalla One', fontFamily: fjallaOne.style.fontFamily },
  { label: 'Hind', fontFamily: hind.style.fontFamily },
  { label: 'Libre Baskerville', fontFamily: libreBaskerville.style.fontFamily },
  { label: 'Work Sans', fontFamily: workSans.style.fontFamily },
  { label: 'Cairo', fontFamily: cairo.style.fontFamily },
  { label: 'Heebo', fontFamily: heebo.style.fontFamily },
  { label: 'Lora', fontFamily: lora.style.fontFamily },
  { label: 'Mukta', fontFamily: mukta.style.fontFamily },
  { label: 'Quicksand', fontFamily: quicksand.style.fontFamily },
  { label: 'Rubik', fontFamily: rubik.style.fontFamily },
  { label: 'IBM Plex Sans', fontFamily: ibmPlexSans.style.fontFamily },
  { label: 'Noto Sans JP', fontFamily: notoSansJp.style.fontFamily },
  { label: 'Barlow', fontFamily: barlow.style.fontFamily },
  { label: 'Inter', fontFamily: inter.style.fontFamily },
  { label: 'Manrope', fontFamily: manrope.style.fontFamily },
  { label: 'Mulish', fontFamily: mulish.style.fontFamily },
  { label: 'PT Serif', fontFamily: ptSerif.style.fontFamily },
  { label: 'Asap', fontFamily: asap.style.fontFamily },
  { label: 'Cinzel', fontFamily: cinzel.style.fontFamily },
  { label: 'Josefin Sans', fontFamily: josefinSans.style.fontFamily },
  { label: 'Anton', fontFamily: anton.style.fontFamily },
];

export const chakraFonts = {
  heading: roboto.style.fontFamily,
  body: roboto.style.fontFamily,
};

