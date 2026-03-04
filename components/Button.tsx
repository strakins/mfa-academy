
import Link from "next/link";

export function Button({
  href,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const map =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : "btn-ghost";

  if (href) {
    return (
      <Link href={href} className={`${map} ${className}`}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={`${map} ${className}`} {...props}>
      {props.children}
    </button>
  );
}
