"use client";

import { 
  UserPlusIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  CheckBadgeIcon 
} from "@heroicons/react/24/solid";

export const AccountIcon = () => (
  <UserPlusIcon className="h-6 w-6" />
);

export const SubmitIcon = () => (
  <DocumentTextIcon className="h-6 w-6" />
);

export const TrackIcon = () => (
  <ClipboardDocumentCheckIcon className="h-6 w-6" />
);

export const CertificateIcon = () => (
  <CheckBadgeIcon className="h-6 w-6" />
);

export async function getStaticProps() {
  // ... existing code ...

  const AllData = AllCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgUrl,
    }
  });

  return {
    props: {
      AllData,
    },
    revalidate: 10
  }
}