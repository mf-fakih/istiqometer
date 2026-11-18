const WORDS = ["LESS EXCUSES", "MORE CONSISTENCY", "BE HONEST", "LESS EXCUSES"];

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {[0, 1].map((rep) =>
        WORDS.map((w, i) => (
          <span key={`${rep}-${i}`} style={{ display: "contents" }}>
            <span className="marquee__item">{w}</span>
            <span className="marquee__sep" aria-hidden="true">
              —
            </span>
          </span>
        )),
      )}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee">
      <p className="sr-only">Less excuses — more consistency — be honest — less excuses</p>
      <div className="marquee__track" aria-hidden="true">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
