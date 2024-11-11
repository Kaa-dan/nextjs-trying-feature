import React from "react";
import CreateRules from "@/components/plugins/rules-regulations/create.rules";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
const Page = () => {
  return (
    <div className=" min-w-[100%]">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl">Rules & Regulations</h1>
        </div>
        <div>
          <p className="text-xs">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia
          </p>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-xs" href="/">
                Rules & Regulations
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs">
                Create new rule
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="w-[100%]">
          <CreateRules />
        </div>
      </div>
    </div>
  );
};

export default Page;
