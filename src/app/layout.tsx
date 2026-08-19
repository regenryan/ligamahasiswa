import type { Metadata } from "next";
import { Anton, Archivo, Baloo_2 } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liga Mahasiswa",
  description:
    "Gerakan mahasiswa Malaysia. Mansuh AUKU, kampus bebas. Stories, campaigns, and the fight for student rights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/*__LIGA_DIRECTION_CONTRACT__
        THESIS: A counter-culture student movement site. Youth-owned, image-led, never corporate.
        It refuses the category default of a clean NGO landing page with a hero metric strip.
        OWN-WORLD: Protest red #E11D2E, ink #111111, paper #F4EFE6. Five candidate directions:
        A Kad Merah (stamp + halftone poster), B Skuad Kampus (tape collage, highlighter),
        C Midnight Demo (dark glow), D Zine Print (risograph paper), E Flat Signal (geometric blocks).
        STORY: A visitor understands AUKU is the enemy, feels the movement is theirs, and joins.
        FIRST VIEWPORT: Full-bleed hero. AUKU countdown or ticker in view. Join action visible.
        FORM: Five user-pinned directions rendered behind the prototype picker, seeded in
        the plan approved before build. FINISH: unreviewed and undocumented is unfinished;
        this build ends with the finish review, the verdict, DESIGN.md, and every shipping
        raster carrying its provenance.
        __END__*/}
        {children}
      </body>
    </html>
  );
}
