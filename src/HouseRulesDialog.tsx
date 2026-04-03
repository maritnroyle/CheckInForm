import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

export function HouseRulesDialog() {
  return (
    <Dialog>
      <DialogTrigger render={
        <button type="button" className="text-blue-600 hover:underline inline-flex items-center mt-1 cursor-pointer bg-transparent border-none p-0" />
      }>
        View Complete House Rules <FileText className="w-3 h-3 ml-1" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">House Rules</DialogTitle>
          <DialogDescription>
            Please read the following house rules carefully.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-gray-700 mt-4">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">General Conduct</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please be kind and respectful to all flatmates.</li>
              <li>Do not use or take the belongings of others without explicit permission.</li>
              <li>No smoking or vaping inside the house.</li>
              <li>No pets are permitted.</li>
              <li>Use of drugs or any form of illegal substances are strictly prohibited.</li>
              <li>We have zero tolerance for violence or disruptive behavior - Please report any concerns or incidents to us immediately.</li>
              <li>No shoes are allowed inside the house or on the carpets.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitchen and Fridge</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please kindly make sure you organize your belongings in the food cabinet and fridge accordingly. Keep it organized within 1 shelf per room (1 shelf shared by 2 pax). There are 2 fridge/freezers so there is enough space for everyone.</li>
              <li>Do not overcrowd the fridge or freezer. Remove spoiled food promptly and keep your designated space clean.</li>
              <li>All kitchen appliances must be cleaned after use and returned to the cupboard. Tidy and wipe down common kitchen areas after use.</li>
              <li>Cooktops and ovens must be used safely. Ensure all knobs and switches are turned off and the units are left clean for the next person.</li>
              <li>Dispose off and do not leave any food scraps in the sink. All rubbish must be wrapped and placed in the bin.</li>
              <li>Please clean your dishes immediately once you finish your meals.</li>
              <li>DO NOT pour cooking oil, fats or grease into the sink, as this will cause blockages. Contain these liquids in a sealed container and dispose of them into the main rubbish bin outside.</li>
              <li><strong>Note:</strong> If a professional plumber is required to clear blockages in the sink, the cost of the plumbing service will be shared equally by all current occupants.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Living and Dining room</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not leave any personal items in the common area.</li>
              <li>Make sure you clean and wipe off the dining table after meals.</li>
              <li>Do not leave the window open at night or when leaving the house.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Laundry</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use of the washing machine and dryer is limited to once per week per person.</li>
              <li>Please schedule your laundry so it is completed before 10:00 PM.</li>
              <li>Remove your laundry from the machines promptly once the cycle is finished.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bedrooms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>A healthy room starts from good sunlight and lots of ventilation. Please open up the curtains and air up your room on a regular basis to prevent build up of mold and mildew - this is for your own benefits!</li>
              <li>Keep your room clean and tidy and vacuum it regularly.</li>
              <li>Do not use any personal heating appliances in your room (i.e. electric heater etc), as this may cause overload on the main circuit breaker and pose fire risk.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bathrooms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep the bathroom clean and ensure all hair is removed from the shower drain after use.</li>
              <li>Ensure the toilet is flushed and left clean after use.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Parking</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not park it on the grass area (the grass area near to the main tree/next to the bedroom) as this will damage the lawn.</li>
              <li>Please make sure you register the car plate number with us. Any unregistered car within the house’s compound will be towed away.</li>
              <li>Parking space is based on a first come first served basis.</li>
              <li>Kindly note that onsite parking is strictly for flatmates only. Please make sure all visitors’ cars are parked outside the house or on the street.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest and Visitors</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>No visitors or guests are allowed between 11:00 PM and 06:00 AM.</li>
              <li>Visitors or guests are not permitted to stay overnight.</li>
              <li>All visitors/guests must leave the property by 11:00 PM, ensuring that the common areas are left tidy.</li>
              <li>No party with guests or visitors in the house. Flamate and their visitors must ensure orderly conduct with no disturbance to other flatmates or neighbors.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-Out and vacating the room</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please make sure you wash & dry the bed sheets / pillow cases / duvets cover (do not remove bed protector) before you leave.</li>
              <li>Kindly put it back as its original set up and send a photo before checking out.</li>
              <li>The key card must be left inside the room upon vacating.</li>
              <li>If you are the last person or there are no other flatmates in the room, kindly ensure the windows are closed before you leave.</li>
            </ul>
          </section>
        </div>
        
        <DialogFooter className="mt-6 sm:justify-center">
          <DialogClose render={
            <Button type="button" className="w-full sm:w-auto">
              I understand, Back to Form
            </Button>
          } />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
