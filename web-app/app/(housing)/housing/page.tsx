import { House } from './_components/house-card';
import { HousingList } from './_components/housing-list';

const mockHouses: House[] = [
  { id: 1, address: '123 College Ave, Townsville', price: '$1,200/mo', img: '/demo/house1.jpg', bedrooms: 2, bathrooms: 1, sector: 'north' },
  { id: 2, address: '45 Main St, Downtown', price: '$900/mo', img: '/demo/house2.jpg', bedrooms: 1, bathrooms: 1, sector: 'east' },
  { id: 3, address: '789 Oak Dr, Suburbia', price: '$1,800/mo', img: '/demo/house3.jpg', bedrooms: 3, bathrooms: 2, sector: 'west' },
  { id: 4, address: '12 Pine Ln, Northside', price: '$1,000/mo', img: '/demo/house4.jpg', bedrooms: 2, bathrooms: 1, sector: 'north' },
  { id: 5, address: '88 Maple St, Southpark', price: '$1,300/mo', img: '/demo/house5.jpg', bedrooms: 2, bathrooms: 2, sector: 'south' },
  { id: 6, address: '200 Birch Rd, East Village', price: '$850/mo', img: '/demo/house6.jpg', bedrooms: 1, bathrooms: 1, sector: 'east' },
  { id: 7, address: '37 Cedar Ave, West End', price: '$1,400/mo', img: '/demo/house7.jpg', bedrooms: 3, bathrooms: 2, sector: 'west' },
  { id: 8, address: '5 Walnut Ct, Midtown', price: '$950/mo', img: '/demo/house8.jpg', bedrooms: 1, bathrooms: 1, sector: 'south' },
  { id: 9, address: '66 Spruce Blvd, Lakeview', price: '$1,600/mo', img: '/demo/house9.jpg', bedrooms: 3, bathrooms: 2, sector: 'north' },
  { id: 10, address: '14 Cherry Way, Old Town', price: '$1,100/mo', img: '/demo/house10.jpg', bedrooms: 2, bathrooms: 1, sector: 'west' },
];

export default function Housing() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>

        <HousingList houses={mockHouses} pageSize={9} />
      </div>
    </div>
  );
}
