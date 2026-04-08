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
              <li>No shoes are allowed inside the house or on the carpets.</li>
              <li className="italic">Note: We have zero tolerance for violence or disruptive behavior - Please report any concerns or incidents to us immediately.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitchen and Fridge</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please organize your belongings in the food cabinets and fridges accordingly. Storage is limited to one shelf per room (shared by two people). With two fridge/freezers available, there is ample space for everyone if kept organized.</li>
              <li>Do not overcrowd the fridge or freezer. Please remove spoiled food promptly and keep your designated storage space clean.</li>
              <li>All kitchen appliances must be cleaned and returned to the cupboard immediately after use. Please wipe down common surfaces and tidy the area after cooking.</li>
              <li>Cooktops and ovens must be used safely. Ensure all knobs and switches are turned off and the units are left clean for the next person.</li>
              <li>Dispose of all food scraps in the bin; do not leave them in the sink. All rubbish must be wrapped before being placed in the kitchen bin.</li>
              <li>Please wash, dry, and put away your dishes immediately after you finish your meals. Do not leave them in the sink.</li>
              <li>DO NOT pour cooking oil, fats or grease into the sink, as this will cause blockages. Contain these liquids in a sealed container and dispose of them into the main rubbish bin outside.</li>
              <li className="italic">Note: If a professional plumber is required to clear blockages in the sink, the cost of the plumbing service will be shared equally by all current occupants.</li>
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
              <li>Do not park on the grass (specifically the area near the main tree next to the bedroom), as this will damage the lawn.</li>
              <li>Please register your vehicle’s license plate number with us. Any unregistered vehicle found on the property will be towed away at the owner's expense.</li>
              <li>Parking spaces are available on a first-come, first-served basis.</li>
              <li>On-site parking is strictly for residents. Please ensure that all visitors park their vehicles on the street and not within the property compound.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest and Visitors</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>No visitors/guests are allowed between 11:00 PM and 06:00 AM.</li>
              <li>All visitors/guests must leave the property by 11:00 PM.</li>
              <li>Visitors or guests are not permitted to stay overnight under any circumstances.</li>
              <li>You must ensure that all common areas are left clean and tidy after your visitors/guests depart.</li>
              <li>Parties are strictly prohibited. You are responsible for your guests' behavior and must ensure their conduct does not disturb other flatmates or neighbors.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-Out and vacating the room</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please make sure you wash & dry the bed sheets / pillow cases / duvets cover (do not remove mattress protector and electric blanket) before you leave.</li>
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
