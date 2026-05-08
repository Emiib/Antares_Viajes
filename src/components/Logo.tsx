export default function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="antaresRed" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#F05A45"/>
          <stop offset="100%" stopColor="#B91C1C"/>
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="#C4A882" strokeWidth="5"/>
      {/* Red circle */}
      <circle cx="100" cy="100" r="90" fill="url(#antaresRed)"/>
      {/* Stylized A */}
      <path d="M65 140 L100 55 L135 140 M78 120 L122 120 M130 55 C130 55 155 40 165 48 C175 56 155 72 155 72" 
        stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Star */}
      <polygon points="158,48 162,58 173,58 164,65 168,76 158,69 148,76 152,65 143,58 154,58" 
        fill="#C4A882" stroke="#C4A882" strokeWidth="1"/>
    </svg>
  );
}
