"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TIssue } from "@/types";
import { Search, Shield } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import DebateTable from "./debate-table";
import useDebates from "./use-debate";
import { useClubStore } from "@/store/clubs-store";
import { useNodeStore } from "@/store/nodes-store";
import { usePermission } from "@/lib/use-permission";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface TabData {
  label: string;
  count: number;
}

const DebateLayout = ({
  plugin,
  forum,
  forumId,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
}) => {
  const { hasPermission } = usePermission();
  const { currentUserRole: currentUserClubRole, clubJoinStatus } = useClubStore(
    (state) => state
  );

  const { currentUserRole: currentUserNodeRole, nodeJoinStatus } = useNodeStore(
    (state) => state
  );

  const {
    allDebates,
    ongoingDebates,
    myDebates,
    globalDebates,
    proposed,

    setClickTrigger,
    clickTrigger,
    loading,
    currentPages,
    totalPages,
    setCurrentPages,
  } = useDebates(forum, forumId);

  const tabs: TabData[] = [
    {
      label: "Ongoing Debates",
      count: ongoingDebates?.length || 0,
    },
    {
      label: "All Debates",
      count: allDebates?.length || 0,
    },
    {
      label: "Global Debates",
      count: globalDebates?.length || 0,
    },
    {
      label: "My Debates",
      count: myDebates?.length || 0,
    },
    ...(hasPermission("view:proposedAsset")
      ? [
          {
            label: "Proposed Debates",
            count: proposed?.length || 0,
          },
        ]
      : []),
  ];

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count?.toString();
  };
  function getData(tab: TabData): any[] {
    let data: any[] = [];
    switch (tab.label) {
      case "Ongoing Debates":
        data = ongoingDebates;
        break;
      case "All Debates":
        data = allDebates;
        break;
      case "Global Debates":
        data = globalDebates;
        break;
      case "My Debates":
        data = myDebates;
        break;
      case "Proposed Debates":
        data = proposed;
        break;

      default:
        data = [];
    }
    return data;
  }
  return (
    <div>
      {hasPermission("view:assets") ? (
        <div className="w-full space-y-4  p-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Community Debate
            </h2>
            <p className="text-muted-foreground">
              {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
            egestas. Iaculis semper risus sit egestas.`}
            </p>
          </div>

          <Tabs defaultValue="My Debates" className="w-full space-y-4 ">
            <TabsList className="flex h-auto flex-wrap gap-1 bg-background p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.label}
                  className="shrink-0 rounded-md border-b-4 border-white px-3 py-1.5 text-sm data-[state=active]:border-primary  data-[state=active]:text-primary"
                >
                  {tab?.label} ({formatCount(tab?.count)})
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent
                key={tab.label}
                value={tab.label}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  {(clubJoinStatus === "MEMBER" ||
                    nodeJoinStatus === "MEMBER") && (
                    <Link href="debate/create">
                      <Button className="bg-primary text-white  hover:bg-emerald-600">
                        Add a new Debate
                      </Button>
                    </Link>
                  )}

                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input placeholder="Search for rules..." className="pl-8" />
                  </div>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Filter</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">View options</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </Button>
                </div>
                <DebateTable
                  clickTrigger={clickTrigger}
                  setClickTrigger={setClickTrigger}
                  forumId={forumId}
                  data={getData(tab)}
                  tab={tab.label}
                  forum={forum}
                  plugin={plugin}
                  currentPage={currentPages}
                  setCurrentPages={setCurrentPages}
                  totalPage={totalPages}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="p-4">
          <Alert variant="default" className="flex items-center space-x-4">
            <Shield className="h-5 w-5" />
            <div>
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You need to be a member to view the debate section.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default DebateLayout;
