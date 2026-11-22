interface BarcodeLabelProps {
  svg: string;
  firstName: string;
  lastName: string;
  width: number;
  height: number;
}

// printable member label which is the barcode with the member's name
export function BarcodeLabel({
  svg,
  firstName,
  lastName,
  width,
  height,
}: BarcodeLabelProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return (
    <div
      className="flex flex-col items-center justify-center gap-1 overflow-hidden border border-gray-300 bg-white p-2 text-black print:border-0"
      style={{ width: `${width}in`, height: `${height}in` }}
    >
      <img
        src={src}
        alt={`Barcode for ${fullName}`}
        className="min-h-0 w-full flex-1 object-contain"
      />
      <p className="text-center text-sm leading-tight font-semibold">
        {fullName}
      </p>
      {/* TODO: show the membership expiration date once it's available */}
    </div>
  );
}
