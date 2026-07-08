import Image from "next/image";
import { withBasePath } from "@/lib/with-base-path";

interface LogoMarkProps {
  size?: number;
  className?: string;
  variant?: "auto" | "light" | "dark";
}

export default function LogoMark({ size = 64, className = "", variant = "auto" }: LogoMarkProps) {
  const width = Math.round(size * (1409 / 423));
  const imageClassName = "h-auto w-full object-contain";

  return (
    <div
      style={{ width: `${width}px`, maxWidth: "100%" }}
      className={`block ${className}`}
      aria-label="IOTrust Lab"
    >
      {variant === "light" ? (
        <Image
          src={withBasePath("/images/iotrust-logo.png")}
          alt="IOTrust Lab logo"
          height={size}
          width={width}
          className={imageClassName}
          priority
        />
      ) : null}

      {variant === "dark" ? (
        <Image
          src={withBasePath("/images/iotrust-logo-dark.png")}
          alt="IOTrust Lab logo"
          height={size}
          width={width}
          className={imageClassName}
          priority
        />
      ) : null}

      {/* Light mode logo */}
      {variant === "auto" ? (
        <Image
          src={withBasePath("/images/iotrust-logo.png")}
          alt="IOTrust Lab logo"
          height={size}
          width={width}
          className={`${imageClassName} dark:hidden`}
          priority
        />
      ) : null}

      {/* Dark mode logo */}
      {variant === "auto" ? (
        <Image
          src={withBasePath("/images/iotrust-logo-dark.png")}
          alt="IOTrust Lab logo (dark mode)"
          height={size}
          width={width}
          className={`hidden ${imageClassName} dark:block`}
          priority
        />
      ) : null}
    </div>
  );
}
