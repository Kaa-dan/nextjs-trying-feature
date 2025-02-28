"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import IssueTable from "./issues-table";
import useIssues from "./use-issues";
import { usePermission } from "@/lib/use-permission";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface TabData {
  label: TIssuesLabel;
  count: number;
}

const IssuesLayout = ({
  plugin,
  forum,
  forumId,
}: {
  plugin: TPlugins;
  forum: TForum;
  forumId: string;
}) => {
  const {
    liveIssues,
    allIssues,
    globalIssues,
    myIssues,
    setClickTrigger,
    proposedIssues,
    clickTrigger,
    loading,
    currentPages,
    setCurrentPages,
    totalPages,
    issueCount,
  } = useIssues(forum, forumId);

  const { hasPermission } = usePermission();

  const tabs: TabData[] = [
    {
      label: "Live Issues",
      count: issueCount.liveIssues || 0,
    },
    {
      label: "All Issues",
      count: issueCount.allIssues || 0,
    },
    {
      label: "Global Library",
      count: issueCount.globalIssues || 0,
    },
    {
      label: "My Issues",
      count: issueCount.myIssues || 0,
    },
  ];

  const getFilteredTabs = (): TabData[] => {
    const _tabs = tabs;
    if (hasPermission("view:proposedAsset")) {
      _tabs.push({
        label: "Proposed Issues",
        count: proposedIssues.length || 0,
      });
    }
    return _tabs;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };

  function getData(tab: TabData): any[] {
    let data: any[] = [];
    switch (tab.label) {
      case "Live Issues":
        data = liveIssues;
        break;
      case "All Issues":
        data = allIssues;
        break;
      case "Global Library":
        data = globalIssues;
        break;
      case "My Issues":
        data = myIssues;
        break;
      case "Proposed Issues":
        data = proposedIssues;
        break;
      default:
        data = [];
    }

    return data;
  }

  return (
    <div>
      {hasPermission("view:assets") ? (
        <div className="w-full space-y-4   p-4 ">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Community Issues
            </h2>
            <p className="text-muted-foreground">
              {`Lorem ipsum dolor sit amet consectetur. Congue varius lorem et
      egestas. Iaculis semper risus sit egestas.`}
            </p>
          </div>

          <Tabs defaultValue="Live Issues" className="w-full space-y-4 ">
            <TabsList className="flex h-auto flex-wrap gap-1 bg-background p-1">
              {getFilteredTabs()?.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.label}
                  className="shrink-0 rounded-md border-b-4 border-white px-3 py-1.5 text-sm data-[state=active]:border-primary  data-[state=active]:text-primary"
                >
                  {tab.label} ({formatCount(tab.count)})
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
                  <Link href="issues/create">
                    <Button className="bg-primary text-white hover:bg-emerald-600">
                      Add a new issue
                    </Button>
                  </Link>
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
                <IssueTable
                  forumId={forumId}
                  plugin={plugin}
                  forum={forum}
                  data={getData(tab)}
                  tab={tab.label}
                  clickTrigger={clickTrigger}
                  setClickTrigger={setClickTrigger}
                  loading={loading}
                  currentPages={currentPages}
                  setCurrentPages={setCurrentPages}
                  totalPages={totalPages}
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
                You need to be a member to view the Issues.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default IssuesLayout;
