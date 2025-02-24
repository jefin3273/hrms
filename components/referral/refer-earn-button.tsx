"use client";

import { ReactNode, useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferEarnModal from "./refer-earn-modal";
import ReferralForm from "./referral-form";

interface ReferEarnButtonProps {
  className?: string;
  children?: ReactNode;
}

export default function ReferEarnButton({
  className,
  children,
}: ReferEarnButtonProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowInfo(true)}
        className={className || "bg-yellow-500 text-black hover:bg-yellow-400"}
      >
        {children || (
          <>
            <Gift className="mr-2 h-4 w-4" />
            REFER AND EARN
          </>
        )}
      </Button>

      <ReferEarnModal
        open={showInfo}
        onOpenChange={setShowInfo}
        onStartReferral={() => {
          setShowInfo(false);
          setShowForm(true);
        }}
      />

      <ReferralForm open={showForm} onOpenChange={setShowForm} />
    </>
  );
}
