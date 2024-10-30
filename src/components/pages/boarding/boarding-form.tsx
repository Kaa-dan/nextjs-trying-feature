"use client";

import { useState } from "react";
import ProgressIndicator from "./progress-bar";
import PictureForm from "./picture-form";

import DetailsForm from "./details-form";
import { NodeSearchForm } from "./node-search-form";
import InterestForm from "./interest-form";

type Step = "Details" | "Picture" | "Interest" | "Node";

export function BoardingForm() {
  const [step, setStep] = useState<Step>("Details"); //.remove

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl px-2">
        <h2 className="mb-2 text-center text-2xl font-bold">
          Hey, Welcome to Clubwize 👋
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Welcome to the team, rookie! Get ready to crush it with Clubwize!
        </p>

        <div className="flex justify-center p-6">
          <ProgressIndicator
            steps={["Details", "Picture", "Interest", "Node"]}
            currentStep={step}
          />
        </div>

        {step === "Details" && <DetailsForm setStep={setStep} />}

        {step === "Picture" && <PictureForm setStep={setStep} />}

        {step === "Interest" && <InterestForm setStep={setStep} />}

        {step === "Node" && <NodeSearchForm />}
      </div>
    </div>
  );
}
