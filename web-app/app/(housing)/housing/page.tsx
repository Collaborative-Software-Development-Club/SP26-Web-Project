import { House, HouseCard } from './_components/house-card';

const mockHouses: House[] = [
  {
    id: 1,
    address: '123 College Ave, Townsville',
    price: '$1,200/mo',
    img: '/demo/house1.jpg',
    bedrooms: 2,
    bathrooms: 1,
    sector: 'north',
  },
  {
    id: 2,
    address: '45 Main St, Downtown',
    price: '$900/mo',
    img: '/demo/house2.jpg',
    bedrooms: 1,
    bathrooms: 1,
    sector: 'east',
  },
  {
    id: 3,
    address: '789 Oak Dr, Suburbia',
    price: '$1,800/mo',
    img: '/demo/house3.jpg',
    bedrooms: 3,
    bathrooms: 2,
    sector: 'west',
  },
];

export default function Housing() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Housing Listings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHouses.map((h) => (
            <HouseCard key={h.id} house={h} />
          ))}
        </div>
      </div>
    </div>
  );
}
