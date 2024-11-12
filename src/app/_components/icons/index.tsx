"use client";

import { 
  ForwardIcon, 
  EyeIcon, 
  SpeakerWaveIcon, 
  BookOpenIcon, 
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

export const FastSpeedIcon = () => (
  <ForwardIcon className="h-6 w-6" />
);

export const RealTimeIcon = () => (
  <EyeIcon className="h-6 w-6" />
);

export const AccessibilityIcon = () => (
  <SpeakerWaveIcon className="h-6 w-6" />
);

export const EducationIcon = () => (
  <BookOpenIcon className="h-6 w-6" />
);

export const BlockchainIcon = () => (
  <ShieldCheckIcon className="h-6 w-6" />
);

export const MailIcon = () => (
  <EnvelopeIcon className="h-6 w-6" />
);

export const PhoneContactIcon = () => (
  <PhoneIcon className="h-6 w-6" />
);

export const ChatIcon = () => (
  <ChatBubbleLeftRightIcon className="h-6 w-6" />
);

export { ProtectionIcon, BusinessGrowthIcon, LegalIcon } from './BenefitsIcons';