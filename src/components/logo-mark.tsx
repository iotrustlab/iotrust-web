import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 64, className = "" }: LogoMarkProps) {
  const width = size * 2; // approximate aspect ratio

  return (
    <div
      style={{ height: size, width: "auto" }}
      className={`block ${className}`}
      aria-label="IoTrust Lab"
    >
      {/* Light mode logo */}
      <Image
        src="/images/iotrust-logo.png"
        alt="IoTrust Lab logo"
        height={size}
        width={width}
        className="object-contain dark:hidden"
        priority
      />
      {/* Dark mode logo */}
      <Image
        src="/images/iotrust-logo-dark.png"
        alt="IoTrust Lab logo (dark mode)"
        height={size}
        width={width}
        className="hidden dark:block object-contain"
        priority
      />
    </div>
  );
}
