"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CompanyFormProps {
  onSuccess: () => void;
  initialData?: any;
}

const states = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  // Add all Indian states...
];

export default function CompanyForm({
  onSuccess,
  initialData,
}: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [taxSlabType, setTaxSlabType] = useState("monthly");
  const [taxSlabs, setTaxSlabs] = useState<
    Array<{
      startRange: string;
      endRange: string;
      amount: string;
    }>
  >([{ startRange: "", endRange: "", amount: "" }]);
  const { toast } = useToast();
  const supabase = createClient();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      code: formData.get("code"),
      name: formData.get("name"),
      address1: formData.get("address1"),
      address2: formData.get("address2"),
      state: formData.get("state"),
      city: formData.get("city"),
      postal_code: formData.get("postal_code"),
      notifications: {
        enable_clock_in: formData.get("enable_clock_in") === "on",
        enable_clock_out: formData.get("enable_clock_out") === "on",
        enable_imei: formData.get("enable_imei") === "on",
      },
      daily_rate: formData.get("daily_rate"),
      epf: {
        number: formData.get("epf_number"),
        employee_contribution: formData.get("epf_employee"),
        employer_contribution: formData.get("epf_employer"),
        include_in_ctc: formData.get("epf_include_ctc") === "on",
        include_admin: formData.get("epf_include_admin") === "on",
        include_edu: formData.get("epf_include_edu") === "on",
      },
      esi: {
        number: formData.get("esi_number"),
        employee_contribution: formData.get("esi_employee"),
        employer_contribution: formData.get("esi_employer"),
        include_in_ctc: formData.get("esi_include_ctc") === "on",
      },
      professional_tax: {
        number: formData.get("pt_number"),
        slab_type: taxSlabType,
        slabs: taxSlabs,
      },
    };

    if (logo) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(`${data.code}/logo`, logo);

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload logo",
        });
      } else {
        (data as any).logo_url = uploadData.path;
      }
    }

    const { error } = await supabase.from("companies").upsert({
      ...data,
      id: initialData?.id,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: `Company ${
          initialData ? "updated" : "created"
        } successfully`,
      });
      onSuccess();
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Company</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Company Code*</Label>
            <Input
              id="code"
              name="code"
              defaultValue={initialData?.code}
              placeholder="Enter Company Code"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Company Name*</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              placeholder="Enter Company Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address1">Address1*</Label>
            <Input
              id="address1"
              name="address1"
              defaultValue={initialData?.address1}
              placeholder="Enter Address1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address2">Address2</Label>
            <Input
              id="address2"
              name="address2"
              defaultValue={initialData?.address2}
              placeholder="Enter Address2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Territory*</Label>
            <Select name="state" defaultValue={initialData?.state}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              name="city"
              defaultValue={initialData?.city}
              placeholder="Enter City"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code*</Label>
            <Input
              id="postal_code"
              name="postal_code"
              defaultValue={initialData?.postal_code}
              placeholder="Enter Postal Code"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-white">
                {logo ? (
                  <img
                    src={URL.createObjectURL(logo) || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : initialData?.logo_url ? (
                  <img
                    src={initialData.logo_url || "/placeholder.svg"}
                    alt="Company logo"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <Label
                htmlFor="logo"
                className="cursor-pointer flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-4 w-4" />
                <span>Change Logo</span>
                <input
                  id="logo"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setLogo(file);
                  }}
                />
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Company logo supported: jpg,jpeg,png,gif
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Settings</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_clock_in"
                  name="enable_clock_in"
                  defaultChecked={initialData?.notifications?.enable_clock_in}
                />
                <Label htmlFor="enable_clock_in">
                  Enable Clock-in Notification Reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_clock_out"
                  name="enable_clock_out"
                  defaultChecked={initialData?.notifications?.enable_clock_out}
                />
                <Label htmlFor="enable_clock_out">
                  Enable Clock-out Notification Reminders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_imei"
                  name="enable_imei"
                  defaultChecked={initialData?.notifications?.enable_imei}
                />
                <Label htmlFor="enable_imei">
                  Enable IMEI Number Restriction
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Daily Rate Settings</Label>
            <RadioGroup
              name="daily_rate"
              defaultValue={initialData?.daily_rate || "calendar"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="working" id="working" />
                <Label htmlFor="working">Working Days in a Month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="calendar" id="calendar" />
                <Label htmlFor="calendar">Calendar Days in a Month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization">Organization Working days</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>EPF</Label>
            <div className="space-y-4">
              <Input
                name="epf_number"
                placeholder="EPF Number"
                defaultValue={initialData?.epf?.number}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Employee Contribution</Label>
                  <Select
                    name="epf_employee"
                    defaultValue={
                      initialData?.epf?.employee_contribution || "12"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12% of Actual PF Wage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employer Contribution</Label>
                  <Select
                    name="epf_employer"
                    defaultValue={
                      initialData?.epf?.employer_contribution || "12"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12% of Actual PF Wage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="epf_include_ctc"
                    name="epf_include_ctc"
                    defaultChecked={initialData?.epf?.include_in_ctc}
                  />
                  <Label htmlFor="epf_include_ctc">
                    Include employer's contribution in the CTC
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="epf_include_admin"
                    name="epf_include_admin"
                    defaultChecked={initialData?.epf?.include_admin}
                  />
                  <Label htmlFor="epf_include_admin">
                    Include admin charges in the CTC
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="epf_include_edu"
                    name="epf_include_edu"
                    defaultChecked={initialData?.epf?.include_edu}
                  />
                  <Label htmlFor="epf_include_edu">
                    Include employer's EDLI contribution in the CTC
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>ESI</Label>
            <div className="space-y-4">
              <Input
                name="esi_number"
                placeholder="ESI Number"
                defaultValue={initialData?.esi?.number}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Employee Contribution</Label>
                  <Input
                    name="esi_employee"
                    defaultValue={
                      initialData?.esi?.employee_contribution || "0.75"
                    }
                    placeholder="0.75%"
                  />
                </div>
                <div>
                  <Label>Employer Contribution</Label>
                  <Input
                    name="esi_employer"
                    defaultValue={
                      initialData?.esi?.employer_contribution || "3.25"
                    }
                    placeholder="3.25%"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="esi_include_ctc"
                  name="esi_include_ctc"
                  defaultChecked={initialData?.esi?.include_in_ctc}
                />
                <Label htmlFor="esi_include_ctc">
                  Include employer's contribution in the CTC
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Professional Tax</Label>
            <div className="space-y-4">
              <Input
                name="pt_number"
                placeholder="PT Number"
                defaultValue={initialData?.professional_tax?.number}
              />
              <div className="space-y-2">
                <Label>Professional Tax Slab</Label>
                <RadioGroup
                  value={taxSlabType}
                  onValueChange={setTaxSlabType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half_yearly" id="half_yearly" />
                    <Label htmlFor="half_yearly">Half Yearly</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-4">
                {taxSlabs.map((slab, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Start Range"
                      value={slab.startRange}
                      onChange={(e) => {
                        const newSlabs = [...taxSlabs];
                        newSlabs[index].startRange = e.target.value;
                        setTaxSlabs(newSlabs);
                      }}
                    />
                    <Input
                      placeholder="End Range"
                      value={slab.endRange}
                      onChange={(e) => {
                        const newSlabs = [...taxSlabs];
                        newSlabs[index].endRange = e.target.value;
                        setTaxSlabs(newSlabs);
                      }}
                    />
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Amount"
                        value={slab.amount}
                        onChange={(e) => {
                          const newSlabs = [...taxSlabs];
                          newSlabs[index].amount = e.target.value;
                          setTaxSlabs(newSlabs);
                        }}
                      />
                      {index === taxSlabs.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setTaxSlabs([
                              ...taxSlabs,
                              { startRange: "", endRange: "", amount: "" },
                            ]);
                          }}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          CANCEL
        </Button>
        <Button type="submit" disabled={isLoading}>
          SAVE
        </Button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-sm">Fields marked with * are mandatory</p>
        <p className="text-sm">
          When a Company logo is uploaded,a copy of it will be uploaded to the
          Mobile App.
        </p>
      </div>
    </form>
  );
}
