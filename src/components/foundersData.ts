import TeamFlipCard from '@/components/TeamFlipCard';

interface Founder {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: Array<{ icon: string; text: string }>;
  roleDescription: string;
}

const founders: Founder[] = [];

export default founders;
