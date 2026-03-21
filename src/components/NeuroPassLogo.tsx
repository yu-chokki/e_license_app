interface Props {
  variant?: 'dark' | 'light' | 'mini';
  width?: number;
}

/**
 * NeuroPass Blue ロゴ
 * variant="dark"  : 濃紺背景用（デフォルト）
 * variant="light" : 白/薄青背景用
 * variant="mini"  : ヘッダー小型用（アイコン + テキスト横並び）
 */
export default function NeuroPassLogo({ variant = 'light', width = 200 }: Props) {
  const height = Math.round(width * (130 / 240));

  if (variant === 'mini') {
    // ヘッダー用：小アイコン + テキスト横並び
    return (
      <span className="inline-flex items-center gap-1.5 select-none">
        {/* mini icon */}
        <svg width="28" height="28" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="72" rx="16" fill="#07122A" />
          <circle cx="18" cy="22" r="4" fill="#0C447C" stroke="#378ADD" strokeWidth="1" />
          <circle cx="18" cy="36" r="4" fill="#0C447C" stroke="#378ADD" strokeWidth="1" />
          <circle cx="18" cy="50" r="4" fill="#0C447C" stroke="#378ADD" strokeWidth="1" />
          <circle cx="36" cy="16" r="4.5" fill="#0F4A8A" stroke="#85B7EB" strokeWidth="1" />
          <circle cx="36" cy="36" r="4.5" fill="#0F4A8A" stroke="#85B7EB" strokeWidth="1" />
          <circle cx="36" cy="56" r="4.5" fill="#0F4A8A" stroke="#85B7EB" strokeWidth="1" />
          <circle cx="56" cy="36" r="7" fill="#042C53" stroke="#B5D4F4" strokeWidth="1.5" />
          <circle cx="56" cy="36" r="3.5" fill="#85B7EB" />
          <line x1="22" y1="22" x2="31.5" y2="16" stroke="#378ADD" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="22" x2="31.5" y2="36" stroke="#378ADD" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="36" x2="31.5" y2="36" stroke="#378ADD" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="36" x2="31.5" y2="56" stroke="#378ADD" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="50" x2="31.5" y2="56" stroke="#378ADD" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="50" x2="31.5" y2="36" stroke="#378ADD" strokeWidth="0.8" opacity="0.3" />
          <line x1="40.5" y1="16" x2="49" y2="36" stroke="#85B7EB" strokeWidth="1.2" opacity="0.8" />
          <line x1="40.5" y1="36" x2="49" y2="36" stroke="#B5D4F4" strokeWidth="1.5" opacity="1" />
          <line x1="40.5" y1="56" x2="49" y2="36" stroke="#85B7EB" strokeWidth="1.2" opacity="0.8" />
        </svg>
        {/* logotype */}
        <span style={{ fontFamily: "'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: '-0.03em' }}>
          <span style={{ fontWeight: 700, color: '#042C53', fontSize: 17 }}>Neuro</span>
          <span style={{ fontWeight: 300, color: '#185FA5', fontSize: 17, letterSpacing: '0.1em' }}>PASS</span>
        </span>
      </span>
    );
  }

  if (variant === 'dark') {
    return (
      <svg width={width} height={height} viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="goal-glow-d" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7EC8F7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7EC8F7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="28" cy="35" r="6" fill="#0C447C" stroke="#185FA5" strokeWidth="1.2" />
        <circle cx="28" cy="58" r="6" fill="#0C447C" stroke="#185FA5" strokeWidth="1.2" />
        <circle cx="28" cy="81" r="6" fill="#0C447C" stroke="#185FA5" strokeWidth="1.2" />
        <circle cx="28" cy="104" r="6" fill="#0C447C" stroke="#185FA5" strokeWidth="1.2" />
        <circle cx="82" cy="24" r="7" fill="#0F4A8A" stroke="#378ADD" strokeWidth="1.4" />
        <circle cx="82" cy="50" r="7" fill="#0F4A8A" stroke="#378ADD" strokeWidth="1.4" />
        <circle cx="82" cy="76" r="7" fill="#0F4A8A" stroke="#378ADD" strokeWidth="1.4" />
        <circle cx="82" cy="102" r="7" fill="#0F4A8A" stroke="#378ADD" strokeWidth="1.4" />
        <circle cx="142" cy="37" r="7.5" fill="#0C3E6E" stroke="#85B7EB" strokeWidth="1.5" />
        <circle cx="142" cy="69" r="7.5" fill="#0C3E6E" stroke="#85B7EB" strokeWidth="1.5" />
        <circle cx="142" cy="101" r="7.5" fill="#0C3E6E" stroke="#85B7EB" strokeWidth="1.5" />
        <circle cx="200" cy="69" r="22" fill="url(#goal-glow-d)" />
        <circle cx="200" cy="69" r="12" fill="#042C53" stroke="#85B7EB" strokeWidth="2" />
        <circle cx="200" cy="69" r="6" fill="#B5D4F4" />
        <line x1="34" y1="35" x2="75" y2="24" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="35" x2="75" y2="50" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="58" x2="75" y2="50" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="58" x2="75" y2="76" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="81" x2="75" y2="76" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="81" x2="75" y2="102" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="34" y1="104" x2="75" y2="102" stroke="#185FA5" strokeWidth="0.7" opacity="0.4" />
        <line x1="89" y1="24" x2="134" y2="37" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="89" y1="50" x2="134" y2="37" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="89" y1="50" x2="134" y2="69" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="89" y1="76" x2="134" y2="69" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="89" y1="76" x2="134" y2="101" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="89" y1="102" x2="134" y2="101" stroke="#378ADD" strokeWidth="0.9" opacity="0.55" />
        <line x1="150" y1="37" x2="188" y2="69" stroke="#85B7EB" strokeWidth="1.8" opacity="0.9" />
        <line x1="150" y1="69" x2="188" y2="69" stroke="#B5D4F4" strokeWidth="2.2" opacity="1" />
        <line x1="150" y1="101" x2="188" y2="69" stroke="#85B7EB" strokeWidth="1.8" opacity="0.9" />
        <text x="28" y="125" fontSize="19" fill="#E6F1FB" fontWeight="700" fontFamily="'SF Pro Display','Helvetica Neue',sans-serif" letterSpacing="-0.8">Neuro</text>
        <text x="93" y="125" fontSize="19" fill="#85B7EB" fontWeight="300" fontFamily="'SF Pro Display','Helvetica Neue',sans-serif" letterSpacing="1.5">PASS</text>
      </svg>
    );
  }

  // light variant
  return (
    <svg width={width} height={height} viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="35" r="6" fill="#B5D4F4" stroke="#378ADD" strokeWidth="1.2" />
      <circle cx="28" cy="58" r="6" fill="#B5D4F4" stroke="#378ADD" strokeWidth="1.2" />
      <circle cx="28" cy="81" r="6" fill="#B5D4F4" stroke="#378ADD" strokeWidth="1.2" />
      <circle cx="28" cy="104" r="6" fill="#B5D4F4" stroke="#378ADD" strokeWidth="1.2" />
      <circle cx="82" cy="24" r="7" fill="#85B7EB" stroke="#185FA5" strokeWidth="1.4" />
      <circle cx="82" cy="50" r="7" fill="#85B7EB" stroke="#185FA5" strokeWidth="1.4" />
      <circle cx="82" cy="76" r="7" fill="#85B7EB" stroke="#185FA5" strokeWidth="1.4" />
      <circle cx="82" cy="102" r="7" fill="#85B7EB" stroke="#185FA5" strokeWidth="1.4" />
      <circle cx="142" cy="37" r="7.5" fill="#378ADD" stroke="#0C447C" strokeWidth="1.5" />
      <circle cx="142" cy="69" r="7.5" fill="#378ADD" stroke="#0C447C" strokeWidth="1.5" />
      <circle cx="142" cy="101" r="7.5" fill="#378ADD" stroke="#0C447C" strokeWidth="1.5" />
      <circle cx="200" cy="69" r="14" fill="#0C447C" stroke="#042C53" strokeWidth="1.5" />
      <circle cx="200" cy="69" r="7" fill="#E6F1FB" />
      <line x1="34" y1="35" x2="75" y2="24" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="35" x2="75" y2="50" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="58" x2="75" y2="50" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="58" x2="75" y2="76" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="81" x2="75" y2="76" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="81" x2="75" y2="102" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="34" y1="104" x2="75" y2="102" stroke="#378ADD" strokeWidth="0.8" opacity="0.35" />
      <line x1="89" y1="24" x2="134" y2="37" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="89" y1="50" x2="134" y2="37" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="89" y1="50" x2="134" y2="69" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="89" y1="76" x2="134" y2="69" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="89" y1="76" x2="134" y2="101" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="89" y1="102" x2="134" y2="101" stroke="#185FA5" strokeWidth="1" opacity="0.5" />
      <line x1="150" y1="37" x2="186" y2="69" stroke="#0C447C" strokeWidth="1.8" opacity="0.8" />
      <line x1="150" y1="69" x2="186" y2="69" stroke="#042C53" strokeWidth="2.2" opacity="1" />
      <line x1="150" y1="101" x2="186" y2="69" stroke="#0C447C" strokeWidth="1.8" opacity="0.8" />
      <text x="28" y="125" fontSize="19" fill="#042C53" fontWeight="700" fontFamily="'SF Pro Display','Helvetica Neue',sans-serif" letterSpacing="-0.8">Neuro</text>
      <text x="93" y="125" fontSize="19" fill="#185FA5" fontWeight="300" fontFamily="'SF Pro Display','Helvetica Neue',sans-serif" letterSpacing="1.5">PASS</text>
    </svg>
  );
}
