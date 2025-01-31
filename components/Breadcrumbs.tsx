import Link from "next/link";
import React from "react";

interface BreadcrumbsProps {
  hierachy: { title: string; href: string }[];
  currentTitle: string;
}

export default function Breadcrumbs({
  hierachy,
  currentTitle,
}: BreadcrumbsProps) {
  return (
    <h2 className="text-2xl">
      {hierachy.map((item) => (
        <React.Fragment key={item.href}>
          <Link href={item.href} className="text-default-primary">
            {item.title}
          </Link>{" "}
          /{" "}
        </React.Fragment>
      ))}
      {currentTitle}
    </h2>
  );
}
