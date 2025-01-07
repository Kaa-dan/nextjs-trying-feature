"use client";

import React, { useEffect, useState } from "react";
import {
  Check,
  Eye,
  Filter,
  Search,
  ThumbsDown,
  ThumbsUp,
  User,
  Users,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateChapterModal from "./create-chapter-modal";
import Image from "next/image";
import { withTokenAxios } from "@/lib/mainAxios";
import { useParams } from "next/navigation";
import { TChapter, TChapterVote } from "@/types";
import { useChapterStore } from "@/store/chapters-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChapters from "./use-chapters";
import { toast } from "sonner";
import { usePermission } from "@/lib/use-permission";
import Link from "next/link";
import { format } from "date-fns";
import { useTokenStore } from "@/store/store";
import { useChapterCalls } from "@/hooks/apis/use-chapter-calls";
import { cn } from "@/lib/utils";

export function ChaptersList() {
  const { hasPermission } = usePermission();
  const { nodeId } = useParams<{ nodeId: string }>();
  const { globalUser } = useTokenStore((state) => state);
  const { fetchPublishedChapters, fetchProposedChapters } = useChapters();
  const { publishedChapters, proposedChapters } = useChapterStore(
    (state) => state
  );
  const { joinChapter, downvoteChapter, upvoteChapter } = useChapterCalls();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPublishedChapters, setFilteredPublishedChapters] =
    useState<TChapter[]>(publishedChapters);
  const [filteredProposedChapters, setFilteredProposedChapters] =
    useState<TChapter[]>(proposedChapters);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    const filteredPublished = publishedChapters.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredProposed = proposedChapters.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPublishedChapters(filteredPublished);
    setFilteredProposedChapters(filteredProposed);
  }, [searchQuery, publishedChapters, proposedChapters]);

  const handleChapterApproval = async (
    chapterId: string,
    status: "publish" | "reject"
  ) => {
    try {
      await withTokenAxios.put("/chapters/publish-or-reject", {
        chapterId,
        status,
        node: nodeId,
      });
      if (status === "publish") toast.success("Chapter published successfully");
      if (status === "reject") toast.success("Chapter rejected successfully");

      fetchPublishedChapters();
      fetchProposedChapters();
    } catch (error: any) {
      const message =
        status === "publish"
          ? "something went wrong when publishing chapter"
          : "something went wrong when rejecting chapter";
      toast.error(error.response.data.message || message);
      console.log(error.message);
    }
  };

  const isUserMember = (chapter: TChapter) => {
    return chapter.members?.some((member) => member._id === globalUser?._id);
  };

  const hasUserVoted = (votes: TChapterVote[], userId: string) => {
    return votes.some((vote) => vote.user === userId);
  };

  console.log({ proposedChapters });

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Filter by Date</DropdownMenuItem>
            <DropdownMenuItem>Filter by Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => setOpenCreateModal(true)}
          variant="default"
          size="default"
        >
          {hasPermission("create:chapter")
            ? "Create Chapter"
            : hasPermission("propose:chapter")
              ? "Propose Chapter"
              : null}
        </Button>

        {openCreateModal && (
          <CreateChapterModal
            open={openCreateModal}
            onOpenChange={setOpenCreateModal}
          />
        )}
      </div>

      <Tabs defaultValue="published" className="grid-cols-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published">Published Chapters</TabsTrigger>
          <TabsTrigger value="proposed">Proposed Chapters</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          {filteredPublishedChapters?.length === 0 ? (
            <Card className="mt-6 h-72 py-8 text-center text-muted-foreground">
              No published chapters found
            </Card>
          ) : (
            <Card className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPublishedChapters?.map((chapter) => (
                <Card className="h-full" key={chapter._id}>
                  <Link
                    href={`/node/${nodeId}/chapters/${chapter?._id}`}
                    key={chapter._id}
                  >
                    <div className="relative h-40 w-full cursor-pointer">
                      <Image
                        src={
                          chapter?.coverImage?.url || "/api/placeholder/400/320"
                        }
                        width={400}
                        height={320}
                        alt={chapter.name}
                        className="size-full rounded-t-lg object-cover"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="border-2 border-white">
                            <AvatarImage
                              src={chapter?.profileImage?.url}
                              alt={chapter.name}
                            />
                            <AvatarFallback>
                              {chapter?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="truncate font-semibold text-white">
                            {chapter?.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <CardContent className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {chapter?.members?.length === 1 ? (
                          <User size={16} />
                        ) : (
                          <Users size={16} />
                        )}
                        <span>
                          {`${chapter?.members?.length || 0} ${chapter?.members?.length === 1 ? "member" : "members"}`}
                        </span>
                      </div>
                      {!isUserMember(chapter) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            joinChapter(chapter._id, nodeId);
                            fetchPublishedChapters();
                          }}
                        >
                          Join
                        </Button>
                      )}
                    </div>

                    <p className="line-clamp-2 text-sm text-gray-600">
                      {chapter.about}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </Card>
          )}
        </TabsContent>
        <TabsContent value="proposed">
          <Card>
            <CardContent className="h-72 space-y-2 overflow-y-scroll">
              <div className="h-72 space-y-2 overflow-y-scroll p-4">
                {filteredProposedChapters.map((chapter) => (
                  <div
                    key={chapter?._id}
                    className="mt-4 flex flex-col rounded-lg p-4 shadow-md"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div>
                          <Avatar>
                            <AvatarImage
                              src={chapter?.profileImage?.url}
                              alt="profile"
                            />
                            <AvatarFallback>
                              {chapter?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{chapter?.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Proposed by: {chapter?.proposedBy?.firstName}{" "}
                            {chapter?.proposedBy?.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(chapter?.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Vote Section */}
                        <div className="flex items-center gap-4 border-r pr-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 hover:bg-green-50 hover:text-green-600"
                              onClick={() => upvoteChapter(chapter._id)}
                            >
                              <ThumbsUp
                                size={18}
                                className={cn(
                                  "text-muted-foreground",
                                  hasUserVoted(
                                    chapter.upvotes,
                                    globalUser?._id!
                                  ) && "fill-green-600 text-green-600"
                                )}
                              />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {chapter.upvotes.length}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 hover:bg-red-50 hover:text-red-600"
                              onClick={() => downvoteChapter(chapter._id)}
                            >
                              <ThumbsDown
                                size={18}
                                className={cn(
                                  "text-muted-foreground",
                                  hasUserVoted(
                                    chapter.downvotes,
                                    globalUser?._id!
                                  ) && "fill-red-600 text-red-600"
                                )}
                              />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {chapter.downvotes.length}
                            </span>
                          </div>
                        </div>

                        {/* Approval Buttons */}
                        {hasPermission("publish:chapter") && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() =>
                                handleChapterApproval(chapter._id, "publish")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() =>
                                handleChapterApproval(chapter._id, "reject")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProposedChapters.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No proposed chapters found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
