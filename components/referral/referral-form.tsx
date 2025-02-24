"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ReferralForm({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const referralData = {
      referrer_company: formData.get("referrerCompany"),
      referrer_name: formData.get("referrerName"),
      referrer_email: formData.get("referrerEmail"),
      referrer_mobile: formData.get("referrerMobile"),
      company_name: formData.get("companyName"),
      contact_person: formData.get("contactPerson"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
    }

    const supabase = createClient()

    const { error } = await supabase.from("referrals").insert([referralData])

    if (error) {
      console.error("Error submitting referral:", error)
      setLoading(false)
      return
    }

    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-yellow-500">REFERRAL FORM</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referrerCompany">Company Name*</Label>
                <Input
                  id="referrerCompany"
                  name="referrerCompany"
                  required
                  defaultValue="JONSETA CORP PVT LTD(TRAIL)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referrerName">Name*</Label>
                <Input id="referrerName" name="referrerName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referrerEmail">Email*</Label>
                <Input id="referrerEmail" name="referrerEmail" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referrerMobile">Mobile No*</Label>
                <Input id="referrerMobile" name="referrerMobile" type="tel" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Your Referral</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name*</Label>
                <Input id="companyName" name="companyName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person*</Label>
                <Input id="contactPerson" name="contactPerson" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile No*</Label>
                <Input id="mobile" name="mobile" type="tel" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Click here to acknowledge the below Terms and Conditions
              </label>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                You acknowledge that you have read and understood the Terms of Service, agreed to allow DigiSME to
                collect, use and disclose your personal data for authenticity check, and that you have also obtained
                consent from the referee to be contacted by Majulah Infotech Pvt Ltd.
              </p>
              <p>
                You declare that your company has no control/ownership of the referred company. Otherwise, you will not
                be eligible for the referral reward.
              </p>
              <p>
                All company, product and service names/branch in this referral form are for identification and referral
                program purposes only.
              </p>
              <p>
                Please exercise discretion in sharing this referral form by only sharing your friends and contacts who
                you believe may have a genuine interest in DigiSME HR Cloud Systems.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              For more details, please contact our sales team at{" "}
              <a href="mailto:sales@digisme.in" className="text-blue-600">
                sales@digisme.in
              </a>{" "}
              and{" "}
              <a href="tel:+919500537347" className="text-blue-600">
                +91 9500 537 347
              </a>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CLOSE
            </Button>
            <Button type="submit" disabled={!agreed || loading} className="bg-blue-900 text-white hover:bg-blue-800">
              SUBMIT
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

