// ReferEarnModal.tsx - improved mobile responsiveness
import Image from "next/image";
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
      <DialogContent className="w-auto max-w-[95%] sm:max-w-[600px] lg:max-w-[800px] p-3 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-2 sm:mb-4">
          <DialogTitle className="text-center text-lg sm:text-2xl font-bold text-yellow-500">
            REFER & EARN
          </DialogTitle>
        </DialogHeader>

        {/* Steps Section */}
        <div className="grid grid-cols-1 gap-4 py-2 sm:py-6 sm:grid-cols-3 sm:gap-8">
          {[
            { title: "REFER", text: "an industry-peer to Info-Tech" },
            { title: "SUCCESSFUL REFERRAL", text: "" },
            { title: "EARN", text: "10% commission of total sales (cash)" },
          ].map((item, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-20 sm:h-20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20223111-pDP0vcAw3dfGbIcUxpdRFhpL9IXsuI.png"
                  alt={item.title}
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="mt-1 sm:mt-3 text-sm sm:text-lg font-semibold text-blue-900">
                {item.title}
              </h3>
              {item.text && (
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 p-3 sm:p-6 rounded-lg mt-2 sm:mt-4">
          <h4 className="text-base sm:text-xl font-semibold text-center text-blue-900 mb-2 sm:mb-4">
            How It Works
          </h4>
          <p className="text-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
            For example:
          </p>
          <div className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
            {[
              "Step 1: You referred Ms Lakshmi from ABC company",
              "Step 2: Ms Lakshmi purchases Majulah Infotech Pvt Ltd Cloud HR Software worth ₹2,00,000",
              "Step 3: You will receive:",
            ].map((step, i) => (
              <p key={i} className="text-xs sm:text-sm">
                <span className="font-semibold">{step.split(":")[0]}:</span>{" "}
                {step.split(":")[1]}
              </p>
            ))}
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm font-semibold">
                10% commission of total sales (cash)
              </p>
              <p className="text-xs sm:text-sm">₹2,00,000 × 10% = ₹20,000</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 sm:mt-6 text-center">
          <Button
            className="bg-yellow-500 text-black hover:bg-yellow-400 px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg w-full"
            onClick={onStartReferral}
          >
            REFER AND EARN NOW
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
