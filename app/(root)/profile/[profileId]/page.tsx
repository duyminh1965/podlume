"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodlumeCard from "@/components/PodlumeCard";
import { api } from "@/convex/_generated/api";
import ProfileCard from "@/components/ProfileCard";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const params = useParams();
  const profileId = params.profileId  as string;
  const user = useQuery(api.users.getUserById, {
    clerkId: profileId,
  });
  const podlumesData = useQuery(api.podlume.getPodlumeByAuthorId, {
    authorId: profileId,
  });

  if (!user || !podlumesData) return <LoaderSpinner />;  

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podlume Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podlumeData={podlumesData}
          imageUrl={user?.imageUrl}
          userFirstName={user?.name}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podlume</h1>
        {podlumesData && podlumesData.podlume.length > 0 ? (
          <div className="podcast_grid">
            {podlumesData?.podlume
              ?.slice(0, 4)
              .map((podlume) => (
                <PodlumeCard
                  key={podlume._id}
                  imgUrl={podlume.imageUrl!}
                  title={podlume.podlumeTitle!}
                  description={podlume.podlumeDescription}
                  podcastId={podlume._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
