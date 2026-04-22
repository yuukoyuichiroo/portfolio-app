import PortfolioClient from '@/components/PortfolioClient';
import { getPortfolioData } from '@/lib/data';

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <PortfolioClient 
      home={data.home} 
      about={data.about} 
      experience={data.experience}
      projects={data.projects} 
      contact={data.contact} 
    />
  );
}
