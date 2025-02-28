"use client";
import moment from "moment";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Building2, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ExpiredDebateWarning } from "./expired-debate-warning";
import Image from "next/image";
import sanitizeHtmlContent from "@/utils/sanitize";
type AdoptionOption = {
  nonAdoptedClubs: {
    clubId: string;
    role: string;
    name: string;
    image: string;
  }[];
  nonAdoptedNodes: {
    nodeId: string;
    role: string;
    name: string;
    image: string;
  }[];
};

// Dummy data for clubs and nodes

function DebateInfo() {
  const { postId } = useParams<{ postId: string }>();
  const [view, setView] = useState();
  const [adoptionOption, setAdoptionOption] = useState<AdoptionOption>();
  const clubs =
    (adoptionOption &&
      adoptionOption?.nonAdoptedClubs?.map((club) => ({
        clubId: club.clubId, // Map `clubId` to `id`
        type: "club",
        name: club.name,
        role: club.role,
        image: club.image,
      }))) ||
    [];
  const nodes =
    (adoptionOption &&
      adoptionOption?.nonAdoptedNodes?.map((node) => ({
        nodeId: node.nodeId, // Map `nodeId` to `id`
        type: "node",
        name: node.name,
        role: node.role,
        image: node.image,
      }))) ||
    [];
  const adoptionOptions = [...clubs, ...nodes];

  const [debate, setDebate] = useState<any>();
  useEffect(() => {
    Endpoints.viewDebate(postId).then((res) => {
      setDebate(res);
    });

    Endpoints.notAdoptedClubs(postId).then((res) => {
      setAdoptionOption(res);
    });

    Endpoints.createDebtaView(postId).then((res) => {
      console.log({ view: res });

      setView(res.debate.views.length);
    });
  }, []);

  const isExpired = debate?.closingDate
    ? new Date(debate?.closingDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0)
    : false;

  return (
    <Card className="mx-auto border">
      <CardHeader>
        <div className="flex items-start justify-between ">
          <div>
            <CardTitle className="text-xl font-bold">
              {debate?.topic}
              {/* <Badge className="ml-2">BG3035</Badge> */}
            </CardTitle>
            <CardDescription className="mt-2">
              {debate?.significance}
            </CardDescription>
            {isExpired && <ExpiredDebateWarning />}
          </div>
          <div className="text-sm text-muted-foreground">
            {debate?.isPublic ? "Public" : "Private"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage src={debate?.createdBy?.profileImage} alt="Author" />
            <AvatarFallback>{debate?.createdBy?.firstName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{debate?.createdBy?.firstName}</div>
            <div className="text-xs text-muted-foreground">
              {moment(debate?.createdAt).fromNow()}{" "}
            </div>
          </div>
          {/* <Badge variant="outline">Environmental Advocacy Group</Badge> */}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-white">
          {debate &&
            debate?.tags?.map((tag: any, index: number) => (
              <Badge key={index}>{tag}</Badge>
            ))}
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Starting Comment</h3>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Network className="mr-2 size-4" />
                Initial Debate Point
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debate?.startingComment ? (
                <p
                  className="whitespace-pre-wrap text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtmlContent(debate.startingComment),
                  }}
                ></p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No starting comment provided
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <div className="text-muted-foreground">Date Started</div>
            <div>{moment(debate?.createdAt).format("DD/MM/YYYY")}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Closing date</div>
            {debate?.closingDate ? (
              <div>{moment(debate?.closingDate).format("DD/MM/YYYY")}</div>
            ) : (
              "NILL"
            )}
          </div>
          <div>
            <div className="text-muted-foreground">Points</div>
            <div>457</div>
          </div>
          <div>
            <div className="text-muted-foreground">Views</div>
            <div>{view}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Contributors</div>
            <div>2.3k</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          {debate?.isPublic ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-500 text-white hover:bg-green-600">
                  Adopt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader className="sticky top-0 z-10 mt-4 bg-white">
                  <DialogTitle>Choose adoption type</DialogTitle>
                  <DialogDescription className="text-sm">
                    Select a club or node to adopt this debate
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
                  {adoptionOptions && adoptionOptions.length > 0 ? (
                    adoptionOptions.map((option: any, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          {option.type === "club" ? (
                            <Image
                              className="rounded-md"
                              width={30}
                              height={30}
                              src={option?.image}
                              alt={option.name}
                            />
                          ) : (
                            <Image
                              className="rounded-md"
                              width={30}
                              height={30}
                              src={option?.image}
                              alt={option.name}
                            />
                          )}
                          <div className="text-sm font-medium">
                            {option.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {option.type}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            onClick={() => {
                              Endpoints.adoptDebate(
                                postId,
                                option.type as "node" | "club",
                                option.type === "club"
                                  ? option.clubId
                                  : undefined,
                                option.type === "node"
                                  ? option.nodeId
                                  : undefined
                              )
                                .then((response) => {
                                  toast.success(response.message);
                                  Endpoints.notAdoptedClubs(postId).then(
                                    (res) => {
                                      setAdoptionOption(res);
                                    }
                                  );
                                })
                                .catch((error) => {
                                  console.error("Adoption failed", error);
                                });
                            }}
                          >
                            <Check className="mr-1 size-3" />
                            <span className="text-xs">
                              {["admin", "moderator", "owner"].includes(
                                option.role
                              )
                                ? "Adopt"
                                : "Propose"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No clubs or nodes available for adoption.
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <></>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DebateInfo;
