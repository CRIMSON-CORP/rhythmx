"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useNewReleaseStore from "@/store/new-release-store";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { goeyToast } from "goey-toast";

function SplitRoyalty() {
  const { form, setForm, next } = useNewReleaseStore();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [collabName, setCollabName] = useState("");
  const [collabPercent, setCollabPercent] = useState<number | "">("");

  const artworkUrl = useMemo(() => {
    if (!form.artwork) return "/images/release-2.png";
    return URL.createObjectURL(form.artwork);
  }, [form.artwork]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(artworkUrl);
    };
  }, [artworkUrl]);

  const tracks = useMemo(() => form.tracks || [], [form.tracks]);

  const ownFullRoyalty = form.own_full_royalty ?? false;

  const selectedTrack = useMemo(() => {
    return tracks.find((t) => t.id === selectedTrackId) || null;
  }, [tracks, selectedTrackId]);

  const collaborators = useMemo(() => {
    return selectedTrack?.royalty_splits || [];
  }, [selectedTrack]);

  const totalCollabPercent = useMemo(() => {
    return collaborators.reduce((sum, c) => sum + c.percentage, 0);
  }, [collaborators]);

  const remainingPercent = 100 - totalCollabPercent;

  const mainArtistName = form.main_artists?.[0]?.name || "Main Artist";

  const handleAddCollaborator = () => {
    if (!selectedTrack) return;
    if (!collabName.trim()) {
      goeyToast.error("Name Required", {
        description: "Please enter a valid collaborator name.",
      });
      return;
    }
    const percent = Number(collabPercent) || 0;
    if (percent <= 0) {
      goeyToast.error("Percentage Required", {
        description: "Please enter a percentage greater than 0%.",
      });
      return;
    }
    if (percent > remainingPercent) {
      goeyToast.error("Limit Exceeded", {
        description: `You cannot allocate more than the remaining ${remainingPercent}%.`,
      });
      return;
    }

    const newCollaborator = {
      name: collabName.trim(),
      percentage: percent,
    };

    const updatedSplits = [...collaborators, newCollaborator];
    const updatedTracks = tracks.map((t) =>
      t.id === selectedTrack.id ? { ...t, royalty_splits: updatedSplits } : t,
    );

    setForm({ tracks: updatedTracks });
    setCollabName("");
    setCollabPercent("");
    goeyToast.success("Collaborator added successfully");
  };

  const handleRemoveCollaborator = (index: number) => {
    if (!selectedTrack) return;
    const updatedSplits = collaborators.filter((_, i) => i !== index);
    const updatedTracks = tracks.map((t) =>
      t.id === selectedTrack.id ? { ...t, royalty_splits: updatedSplits } : t,
    );
    setForm({ tracks: updatedTracks });
    goeyToast.success("Collaborator removed");
  };

  const isStepValid = tracks.length > 0;

  const handleContinue = () => {
    if (isStepValid) {
      next();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-8 items-stretch pb-10">
      {/* Left Column: Form Fields Card */}
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-white rounded-2xl flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-default font-medium">
              Own full royalty payment to this release tracks?
            </p>
            <Switch
              checked={ownFullRoyalty}
              onCheckedChange={(checked) => {
                setForm({ own_full_royalty: checked });
                if (checked) {
                  setSelectedTrackId(null);
                }
              }}
            />
          </div>
          <p className="text-border-default-secondary text-xs font-medium">
            All release royalty payment will be 100% yours.
          </p>
        </div>
        <div className="bg-white rounded-30 p-6 flex items-center flex-wrap gap-8">
          <Image
            src={artworkUrl}
            width={124}
            height={124}
            alt="Release Artwork"
            className="rounded-4xl"
          />
          <table>
            <tbody>
              <tr>
                <td className="py-3.5 text-xs text-border-default-secondary">Release Title</td>
                <td className="py-3.5 text-sm font-medium text-default">{form.release_title}</td>
              </tr>
              <tr>
                <td className="py-3.5 text-xs text-border-default-secondary">Artist Name</td>
                <td className="py-3.5 text-sm font-medium text-default">
                  {form.main_artists[0]?.name}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 text-xs text-border-default-secondary">Genre</td>
                <td className="py-3.5 text-sm font-medium text-default">
                  {form.primary_genre} {form.secondary_genre}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col gap-4">
          <p className="font-medium text-border-default-secondary">Tracks</p>
          <div className="flex flex-col bg-white rounded-30 overflow-hidden divide-y divide-default-default">
            {tracks.length === 0 ? (
              <div className="p-8 text-center text-border-default-secondary font-medium text-sm">
                No tracks uploaded yet.
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-default-default">
                {tracks.map((track, index) => {
                  const isSelected = selectedTrackId === track.id;
                  return (
                    <li
                      key={track.id}
                      className={cn(
                        "relative flex items-center gap-4 px-6 py-4.5 transition-colors",
                        isSelected && !ownFullRoyalty
                          ? "bg-[#EAF5FF]"
                          : "bg-white hover:bg-page-background/30",
                      )}
                    >
                      <div className="relative z-10 flex items-center gap-4 w-full">
                        <div className="size-10 rounded-full bg-page-background flex items-center justify-center font-medium text-default flex-none">
                          {index + 1}
                        </div>
                        <div className="size-10.5 rounded-full bg-brand-purple/12 flex items-center justify-center flex-none">
                          <Icon name="music" size={24} className="text-brand-purple" />
                        </div>
                        <div className="flex flex-col grow break-all min-w-0">
                          <span className="font-medium text-sm text-default truncate">
                            {track.track_title}
                          </span>
                          <span className="text-[11px] text-border-default-secondary font-medium leading-none mt-1">
                            Uploaded
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-none">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTrackId(track.id)}
                            disabled={ownFullRoyalty}
                            className={cn(
                              "rounded-full px-4 py-3 h-auto transition-colors",
                              isSelected && !ownFullRoyalty
                                ? "bg-default text-white border-transparent hover:bg-default/80"
                                : "bg-transparent text-default border-default-default/20 hover:bg-default-default/5",
                            )}
                            size="sm"
                          >
                            Split Pay
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-8 bg-white rounded-30">
          <p className="font-medium text-default text-sm">
            Do review your release details before clicking “continue”
          </p>
          <Button
            variant="orange"
            onClick={handleContinue}
            disabled={!isStepValid}
            className="w-fit"
          >
            <span>Continue</span>
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>

      {/* Right Column: Track Edit Panel or Placeholder */}
      <div className="relative isolate bg-white rounded-30 min-h-125 overflow-hidden flex flex-col">
        <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#9747FF]/50 to-[#0066FF]/50 -z-10 opacity-25 blur-3xl"></div>
        {ownFullRoyalty ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 min-h-100 my-auto">
            <div className="size-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
              <Icon name="dollar" size={32} className="text-brand-purple" />
            </div>
            <h3 className="text-lg font-medium text-default mb-2">Own Full Royalty Enabled</h3>
            <p className="text-xs text-border-default-secondary max-w-xs leading-normal">
              All release royalty payments will be 100% yours. Split royalty for tracks is disabled.
            </p>
          </div>
        ) : !selectedTrack ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 min-h-100 my-auto">
            <div className="size-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
              <Icon name="music" size={32} className="text-brand-purple" />
            </div>
            <h3 className="text-xl font-heading font-medium mb-2">
              Select a Track to Split Royalty
            </h3>
            <p className="text-xs text-border-default-secondary max-w-xs leading-normal">
              Select a track from the left panel and click &quot;Split Pay&quot; to configure
              collaborator splits.
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 flex flex-col gap-8 max-h-[85vh] overflow-y-auto no-scrollbar">
            <span className="text-xl font-medium font-heading">Split Track Royalty</span>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold font-heading">{selectedTrack.track_title}</h2>
              <p className="text-border-default-secondary font-medium truncate">
                {selectedTrack.track_file?.name || `${selectedTrack.track_title}.mp3`}
              </p>
              <p className="text-border-default-secondary font-medium flex items-baseline gap-3">
                <span>Writer:</span>
                <span className="text-default">
                  {selectedTrack.writers?.map((w) => w.name).join(", ") ||
                    selectedTrack.main_artists?.map((a) => a.name).join(", ") ||
                    mainArtistName}
                </span>
              </p>
            </div>

            <div className="p-6 bg-page-background rounded-20 flex items-center justify-between">
              <span className="font-medium text-border-default-secondary">Total Split</span>
              <span className="font-medium text-default">{remainingPercent}%</span>
            </div>

            <div className="flex flex-col gap-4 px-6 py-4">
              <h4 className="font-medium text-border-default-secondary">Collaborators</h4>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={collabName}
                  onChange={(e) => setCollabName(e.target.value)}
                  placeholder="Enter collaborator Legal Name"
                  className="flex-1 rounded-10 border border-default-default px-4 py-6 text-xs font-medium outline-none focus:border-brand-orange transition-colors"
                />
                <input
                  type="number"
                  value={collabPercent}
                  onChange={(e) => {
                    const valStr = e.target.value;
                    if (valStr === "") {
                      setCollabPercent("");
                      return;
                    }
                    const val = parseInt(valStr) || 0;
                    if (val < 0) {
                      setCollabPercent(0);
                    } else if (val > remainingPercent) {
                      setCollabPercent(remainingPercent);
                    } else {
                      setCollabPercent(val);
                    }
                  }}
                  placeholder="0"
                  className="w-30 shrink-0 rounded-10 border border-default-default pl-4 pr-8 py-3 text-sm font-medium outline-none focus:border-brand-orange transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <Button
                variant="outline"
                onClick={handleAddCollaborator}
                className="px-5 py-2.5 rounded-full w-fit bg-transparent border-default-default/20 hover:bg-default-default/5 flex items-center gap-2"
              >
                <span className="font-medium text-xs text-default">Add Collaborator</span>
                <Icon name="plus" size={24} className="text-default" />
              </Button>
              {collaborators.length > 0 && (
                <div className="bg-white rounded-20 p-6 border border-default-default flex flex-col divide-y divide-default-default">
                  {collaborators.map((collab, index) => (
                    <div key={index} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand-purple/12 flex items-center justify-center shrink-0">
                          <Icon name="user" className="text-brand-purple" size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-default">{collab.name}</span>
                          <span className="text-xs text-default mt-0.5">
                            Split Percentage:{" "}
                            <span className="text-[#009951] font-medium">{collab.percentage}%</span>
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveCollaborator(index)}
                        className="rounded-full w-fit px-4 py-2.5 text-xs hover:bg-default-default/5"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SplitRoyalty;
