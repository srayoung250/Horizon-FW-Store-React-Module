// Displays an amount of metal shards — the currency of the Forbidden West —
// with a small faceted shard glyph. Amounts are whole numbers.
import shards from "../assets/MetalShardsTransparent.webp";

export function formatShards(amount) {
  return Math.round(amount || 0).toLocaleString();
}

function Shards({ amount, className = "" }) {
  return (
    <span className={`hfw-shards ${className}`}>
      <img className="hfw-shards-icon" src={shards} />
      {formatShards(amount)}
    </span>
  );
}

export default Shards;
