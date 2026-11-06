type Surface = 'ivory' | 'dark' | 'sand' | 'paper'
export default function Wave({ next, reverse = false }: { next: Surface; reverse?: boolean }) {
  return <div className={`wave-divider ${reverse ? 'wave-reverse' : ''}`} data-next={next} aria-hidden="true">
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none" focusable="false"><path d="M0 36C260 126 435 8 730 47S1190 114 1440 22V101H0Z" /></svg>
  </div>
}
