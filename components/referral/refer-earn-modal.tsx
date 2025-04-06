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
      <DialogContent className="w-[95%] max-w-[600px] sm:max-w-[700px] lg:max-w-[500px] px-4 sm:px-6 py-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-2xl font-bold text-yellow-500">
            REFER & EARN
          </DialogTitle>
        </DialogHeader>

        {/* Steps Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-14 py-6">
          {[
            { title: "REFER", text: "an industry-peer to Info-Tech" },
            { title: "SUCCESSFUL REFERRAL", text: "" },
            { title: "EARN", text: "10% commission of total sales (cash)" },
          ].map((item, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20223111-pDP0vcAw3dfGbIcUxpdRFhpL9IXsuI.png"
                  alt={item.title}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-blue-900">
                {item.title}
              </h3>
              {item.text && (
                <p className="mt-2 text-sm text-gray-600">{item.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 p-5 sm:p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-center text-blue-900 mb-4">
            How It Works
          </h4>
          <p className="text-center text-sm text-gray-600 mb-4">For example:</p>
          <div className="space-y-4 text-sm">
            {[
              "Step 1: You referred Ms Lakshmi from ABC company",
              "Step 2: Ms Lakshmi purchases Majulah Infotech Pvt Ltd Cloud HR Software worth ₹2,00,000",
              "Step 3: You will receive:",
            ].map((step, i) => (
              <p key={i}>
                <span className="font-semibold">{step.split(":")[0]}:</span>{" "}
                {step.split(":")[1]}
              </p>
            ))}
            <div className="text-center mt-2">
              <p className="text-sm font-semibold">
                10% commission of total sales (cash)
              </p>
              <p className="text-sm">₹2,00,000 × 10% = ₹20,000</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 text-center">
          <Button
            className="bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-2 text-lg"
            onClick={onStartReferral}
          >
            REFER AND EARN NOW
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
