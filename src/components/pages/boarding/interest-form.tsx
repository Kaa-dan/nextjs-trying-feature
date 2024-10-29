"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const interests = [
  "UI designs",
  "User interfaces",
  "UI/UX",
  "User interface designs",
  "UX design",
  "Graphic designs",
  "User interfaces design",
  "Users interface",
  "Graphics design",
  "UX designs",
  "UI/UX designs",
  "UI & UX",
  "User Interface",
  "UI Design",
  "UI UX",
  "User interface",
  "UX Design",
  "Graphic design",
  "User interface design",
  "UI design",
];

const stepTwoSchema = z.object({
  search: z.string().optional(),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions",
  }),
});

type StepTwoType = z.infer<typeof stepTwoSchema>;

type Step = "details" | "image" | "interest" | "node";

interface InterestFormProps {
  setStep: (step: Step) => void;
}

const InterestForm: React.FC<InterestFormProps> = ({ setStep }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<StepTwoType>>({});
  const [filteredInterests, setFilteredInterests] = useState(interests);

  const form = useForm<StepTwoType>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const onSubmit: SubmitHandler<StepTwoType> = (data) => {
    const newFormData = { terms: data.terms, selectedInterests };
    setFormData(newFormData);

    console.log("Data for Picture step:", data);
    console.log("Cumulative form data:", newFormData);

    setStep("node");
  };

  const handleInterestClick = (interest: string) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    }
  };

  const handleSearch = (query: string) => {
    form.setValue("search", query);
    if (query.trim()) {
      setFilteredInterests(
        interests.filter((interest) =>
          interest.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredInterests(interests);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((item) => item !== interest));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-medium text-gray-900">
                  Choose your Interest
                </FormLabel>
                <FormControl>
                  <div className="flex w-full items-center rounded-lg border-2 border-gray-300 bg-gray-100 pl-3">
                    <Search className="size-4 text-gray-600" />
                    <Input
                      className="border-none bg-gray-100"
                      placeholder="Search for tags etc..."
                      {...field}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mb-4 flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-2 rounded-lg border px-2 py-1 text-sm font-medium text-gray-900 md:text-xs"
              >
                <span>{interest}</span>
                <X
                  className="size-4"
                  onClick={() => handleRemoveInterest(interest)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredInterests.map((interest) => (
              <div
                key={interest}
                className={`cursor-pointer rounded-lg border px-2 py-1 text-sm font-medium md:text-xs ${
                  selectedInterests.includes(interest)
                    ? "border-none bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleInterestClick(interest)}
              >
                {interest}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className=" flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      I agree to the{" "}
                      <Link href="#" className="text-primary">
                        Terms of Services
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary">
                        Privacy Policy
                      </Link>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Back
            </Button>
            <Button type="submit" className="text-white">
              Next
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default InterestForm;
