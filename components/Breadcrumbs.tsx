import Link from "next/link";
import React from "react";

interface BreadcrumbsProps {
  hierachy: { title: string; href: string }[];
  currentTitle: string;
  classes?: string;
}

export default function Breadcrumbs({
  hierachy,
  currentTitle,
  classes = "",
}: BreadcrumbsProps) {
  return (
    <h2 className={`text-2xl ${classes}`}>
      {hierachy.map((item) => (
        <React.Fragment key={item.href}>
          <Link href={item.href} className="text-primary">
            {item.title}
          </Link>{" "}
          /{" "}
        </React.Fragment>
      ))}
      {currentTitle}
    </h2>
  );
}
