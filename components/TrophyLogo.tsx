type Props = { size?: number };

// Logo trophée vectoriel doré (SVG) — net à n'importe quelle taille d'écran,
// remplace l'icône générique utilisée précédemment. Dégradé or inspiré de
// l'identité visuelle du concours.
export default function TrophyLogo({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="paboGoldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3D77A" />
          <stop offset="45%" stopColor="#D4A63A" />
          <stop offset="100%" stopColor="#9C7A22" />
        </linearGradient>
      </defs>
      <path
        d="M14 6h20v9c0 6.6-4.9 12-11 12h2c-6.1 0-11-5.4-11-12V6z"
        fill="url(#paboGoldGrad)"
      />
      <path
        d="M14 8H7c0 6 3.6 10.5 8.2 11.3-.7-1.7-1.2-3.7-1.2-6V8zM34 8h7c0 6-3.6 10.5-8.2 11.3.7-1.7 1.2-3.7 1.2-6V8z"
        fill="url(#paboGoldGrad)"
      />
      <rect x="22" y="27" width="4" height="7" fill="url(#paboGoldGrad)" />
      <path d="M16 38c0-2.8 3.6-5 8-5s8 2.2 8 5v2H16v-2z" fill="url(#paboGoldGrad)" />
    </svg>
  );
}
