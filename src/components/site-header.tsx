import headerTexture from "@/assets/header-texture.png";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

/**
 * `leak` puts warm light under the torn edge, as though the sheet were lifted
 * off something lit. Deliberately rare — one route uses it, and it means
 * something there. See the Texture section of the design system.
 */
export function SiteHeader({ leak = false }: { leak?: boolean }) {
  return (
    <header className="site-header" data-leak={leak || undefined}>
      {/* Behind the paper, so the sheet occludes it and the light is only
          visible where the tear has taken the paper away. */}
      {leak ? <span className="site-header__leak" aria-hidden /> : null}
      {/* The cast shadow lives on the wrapper so it traces the img's masked
          edge rather than the asset's flat bottom cut. */}
      <div className="site-header__texture">
        <Image
          src={headerTexture}
          alt=""
          sizes="(max-width: 640px) 400vw, 120vw"
          priority
        />
      </div>
      <div className="site-header__inner">
        <Link className="site-header__wordmark" href="/">
          Alexpurdie.co
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
