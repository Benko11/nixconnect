"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import WideLayout from "@/components/layouts/WideLayout";
import Link from "next/link";
import UserIcon from "@/public/assets/icons/User.png";
import BoldAsteriskIcon from "@/public/assets/icons/Bold Asterisk.png";
import PadlockIcon from "@/public/assets/icons/Pad lock.png";
import Image from "next/image";

export default function Settings() {
  return (
    <WideLayout>
      <Breadcrumbs
        hierachy={[{ href: "/", title: "Home" }]}
        currentTitle="Settings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Link href="/settings/user">
          <div className="bg-neutral flex items-center gap-4">
            <div className="bg-secondary h-16 aspect-square flex justify-center items-center">
              <Image src={UserIcon} alt="User" width={24} height={24} />
            </div>
            <div>Information about me</div>
          </div>
        </Link>

        <Link href="/settings/personalization">
          <div className="bg-neutral flex items-center gap-4">
            <div className="bg-accent h-16 aspect-square flex justify-center items-center">
              <Image
                src={BoldAsteriskIcon}
                alt="Appearance"
                width={24}
                height={24}
              />
            </div>
            <div>Personalization</div>
          </div>
        </Link>

        <Link href="/settings/privacy">
          <div className="bg-neutral flex items-center gap-4">
            <div className="bg-accent h-16 aspect-square flex justify-center items-center">
              <Image src={PadlockIcon} alt="Privacy" width={24} height={24} />
            </div>
            <div>Privacy</div>
          </div>
        </Link>
      </div>
    </WideLayout>
  );
}
