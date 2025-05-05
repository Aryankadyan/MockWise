import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItems?: { link: string; label: string }[];
  className?: string;
}

export const CustomBreadCrumb = ({
  breadCrumbPage,
  breadCrumbItems,
  className,
}: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb
      className={`max-w-3xl mx-auto px-4 py-2 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      <BreadcrumbList className="flex items-center gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="flex items-center justify-center text-gray-600 hover:text-emerald-500 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2 text-emerald-500" />
            <span className="font-medium">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItems &&
          breadCrumbItems.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.link}
                  className="text-gray-600 hover:text-emerald-500 transition-colors duration-200 font-medium"
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-indigo-600 font-semibold">
            {breadCrumbPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

