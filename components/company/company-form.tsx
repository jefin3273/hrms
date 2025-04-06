"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [taxSlabType, setTaxSlabType] = useState(
    initialData?.professional_tax?.slab_type || "monthly"
  );
  const [taxSlabs, setTaxSlabs] = useState<
    Array<{
      startRange: string;
      endRange: string;
      amount: string;
    }>
  >(
    initialData?.professional_tax?.slabs || [
      { startRange: "", endRange: "", amount: "" },
    ]
  );
  const [dailyRateType, setDailyRateType] = useState(
    initialData?.daily_rate || "calendar"
  );
  const [orgWorkingDays, setOrgWorkingDays] = useState(
    initialData?.organization_working_days || ""
  );
  const { toast } = useToast();

  useEffect(() => {
    if (initialData?.logo_url) {
      setLogoPreview(initialData.logo_url);
    }
  }, [initialData]);

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
      daily_rate: dailyRateType,
      organization_working_days:
        dailyRateType === "organization" ? orgWorkingDays : null,
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
      logo_url: logoPreview,
    };

    try {
      // Handle logo upload if there's a new logo
      if (logo) {
        // Upload to API endpoint that handles Supabase storage
        const uploadFormData = new FormData();
        uploadFormData.append("file", logo);
        uploadFormData.append("companyCode", data.code as string);

        const uploadResponse = await fetch("/api/upload-logo", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload logo");
        }

        const uploadResult = await uploadResponse.json();
        data.logo_url = uploadResult.url;
      }

      // Create or update company using Prisma API route
      const endpoint = initialData?.id
        ? `/api/companies/${initialData.id}`
        : "/api/companies";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save company");
      }

      toast({
        title: "Success",
        description: `Company ${
          initialData ? "updated" : "created"
        } successfully`,
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleRemoveTaxSlab = (index: number) => {
    setTaxSlabs(taxSlabs.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Company</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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
                    src={URL.createObjectURL(logo)}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
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
                {(logo || logoPreview) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteLogo}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Logo</span>
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Company logo supported: jpg,jpeg,png,gif
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2">
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
            <RadioGroup value={dailyRateType} onValueChange={setDailyRateType}>
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
                {dailyRateType === "organization" && (
                  <div className="ml-2">
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={orgWorkingDays}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value <= 31) {
                          setOrgWorkingDays(e.target.value);
                        }
                      }}
                      className="w-20"
                      placeholder="Days"
                    />
                  </div>
                )}
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
              <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
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
              <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
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
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
                  >
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
                    <Input
                      placeholder="Amount"
                      value={slab.amount}
                      onChange={(e) => {
                        const newSlabs = [...taxSlabs];
                        newSlabs[index].amount = e.target.value;
                        setTaxSlabs(newSlabs);
                      }}
                    />
                    <div className="flex space-x-1">
                      {taxSlabs.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveTaxSlab(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {index === taxSlabs.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
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
          <ul className="text-sm list-disc list-inside">
            <li>Company logo supported: jpg, jpeg, png, bmp, gif</li>
            <li>
              When a Company logo is uploaded, a copy of it will be uploaded to
              the Mobile App.
            </li>
          </ul>
        </p>
      </div>
    </form>
  );
}
