import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReferEarnModal({
  open,
  onOpenChange,
  onStartReferral,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartReferral: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] w-[95%] sm:w-[90%] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-yellow-500">
            REFER & EARN
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 lg:gap-24 py-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20223111-pDP0vcAw3dfGbIcUxpdRFhpL9IXsuI.png"
                alt="Refer"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-blue-900">REFER</h3>
            <p className="mt-2 text-sm text-gray-600">
              an industry-peer to Info-Tech
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20223111-pDP0vcAw3dfGbIcUxpdRFhpL9IXsuI.png"
                alt="Successful Referral"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-blue-900">
              SUCCESSFUL REFERRAL
            </h3>
          </div>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20223111-pDP0vcAw3dfGbIcUxpdRFhpL9IXsuI.png"
                alt="Earn"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-blue-900">EARN</h3>
            <p className="mt-2 text-sm text-gray-600">
              10% commission of total sales (cash)
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-center text-blue-900 mb-4">
            How It Works
          </h4>
          <p className="text-center text-sm text-gray-600 mb-4">For example:</p>
          <div className="space-y-4">
            <p className="text-sm">
              <span className="font-semibold">Step 1:</span> You referred Ms
              Lakshmi from ABC company
            </p>
            <p className="text-sm">
              <span className="font-semibold">Step 2:</span> Ms Lakshmi
              purchases Majulah Infotech Pvt Ltd Cloud HR Software worth
              ₹2,00,000
            </p>
            <p className="text-sm">
              <span className="font-semibold">Step 3:</span> You will receive:
            </p>
            <div className="text-center">
              <p className="text-sm font-semibold">
                10% commission of total sales (cash)
              </p>
              <p className="text-sm">₹2,00,000 × 10% = ₹20,000</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            className="bg-yellow-500 text-black hover:bg-yellow-400 px-8"
            onClick={onStartReferral}
          >
            REFER AND EARN NOW
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
