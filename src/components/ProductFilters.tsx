
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from './ui/button';

const materials = ['Wood', 'Glass', 'Clay', 'Metal', 'Fabric', 'Paper'];
const styles = ['Modern', 'Rustic', 'Minimalist', 'Traditional', 'Boho'];
const locations = ['Oaxaca, Mexico', 'Kyoto, Japan', 'Marrakech, Morocco', 'Waterford, Ireland'];

export default function ProductFilters() {
  const [price, setPrice] = useState(50);

  return (
    <Card className="p-4 lg:p-0 lg:border-none lg:shadow-none">
        <h2 className="font-headline text-xl font-bold mb-4 hidden lg:block">Filters</h2>
        <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        
        <AccordionItem value="category">
            <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
            <AccordionContent>
                <RadioGroup defaultValue="all" className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="r-all" />
                        <Label htmlFor="r-all">All</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home-decor" id="r-home" />
                        <Label htmlFor="r-home">Home Decor</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wearables" id="r-wear" />
                        <Label htmlFor="r-wear">Wearables</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gifts" id="r-gifts" />
                        <Label htmlFor="r-gifts">Gifts</Label>
                    </div>
                </RadioGroup>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
            <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <Slider 
                  value={[price]} 
                  onValueChange={(value) => setPrice(value[0])}
                  max={500} 
                  step={10} 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Rs.0</span>
                    <span>Rs.{price}</span>
                </div>
            </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="style">
            <AccordionTrigger className="font-semibold">Style</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
                 {styles.map(style => (
                    <div key={style} className="flex items-center space-x-2">
                        <Checkbox id={`style-${style}`} />
                        <Label htmlFor={`style-${style}`} className="font-normal">{style}</Label>
                    </div>
                 ))}
            </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="material">
            <AccordionTrigger className="font-semibold">Material</AccordionTrigger>
            <AccordionContent className="pt-2">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a material" />
                    </SelectTrigger>
                    <SelectContent>
                        {materials.map(material => (
                             <SelectItem key={material} value={material.toLowerCase()}>{material}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
            <AccordionTrigger className="font-semibold">Artisan Location</AccordionTrigger>
            <AccordionContent className="pt-2">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map(location => (
                             <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other" className="border-b-0">
            <AccordionTrigger className="font-semibold">Other</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="new-arrivals" className="font-normal">New Arrivals</Label>
                    <Switch id="new-arrivals" />
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>

    <div className="mt-6 flex flex-col gap-2">
        <Button>Apply Filters</Button>
        <Button variant="ghost">Clear Filters</Button>
    </div>
    </Card>
  );
}
