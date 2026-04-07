import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Globe, MessageCircle, FileText, Eraser, Instagram, Facebook } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { HouseRulesDialog } from './HouseRulesDialog';
import { Logo } from './components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { isValidPhoneNumber } from 'react-phone-number-input';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  gender: z.enum(['Male', 'Female'], { message: 'Gender is required.' }),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.').refine((val) => val ? isValidPhoneNumber(val) : false, 'Please enter a valid phone number.'),
  nationality: z.string().min(2, 'Nationality is required.'),
  passportNumber: z.string().min(6, 'Passport number must be at least 6 characters.').max(20, 'Passport number must be at most 20 characters.').regex(/^[a-zA-Z0-9]+$/, 'Passport number must contain only letters and numbers.'),
  checkInDate: z.date({
    message: 'A check-in date is required.',
  }),
  checkOutDate: z.date({
    message: 'A check-out date is required.',
  }),
  estimatedArrivalTime: z.string().min(1, 'Estimated arrival time is required.'),
  parkingRequired: z.boolean(),
  carPlate: z.string().optional(),
  agreeToRules: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the house rules.',
  }),
  signature: z.string().min(1, 'Signature is required.'),
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
}).refine((data) => !data.parkingRequired || (data.parkingRequired && data.carPlate && data.carPlate.trim().length > 0), {
  message: "Car plate is required if parking is needed",
  path: ["carPlate"],
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckInForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormValues | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      gender: undefined,
      email: '',
      phone: '',
      nationality: '',
      passportNumber: '',
      estimatedArrivalTime: '',
      parkingRequired: false,
      carPlate: '',
      agreeToRules: false,
      signature: '',
    },
  });

  const parkingRequired = watch('parkingRequired');
  const signatureValue = watch('signature');

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setValue('signature', '', { shouldValidate: true });
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setValue('signature', signatureRef.current.toDataURL(), { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormValues) => {
    // Ensure signature is captured before submission
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      setValue('signature', '', { shouldValidate: true });
      return;
    }

    setFormDataToSubmit(data);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;
    
    setIsConfirmDialogOpen(false);
    setIsSubmitting(true);
    console.log(formDataToSubmit);
    
    try {
      await fetch('https://petrelplace.duckdns.org/api/webhook/qE8aw6ulXihOVnfrvpOVTAYk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });
    } catch (error) {
      console.error('Webhook submission failed:', error);
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Logo className="w-48 h-auto mb-8" />
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Processing your check-in...</h2>
            <p className="text-gray-500 mt-2 text-center">Please wait while we securely submit your information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center">
            <Logo className="w-48 h-auto mb-4" />
            <CardTitle className="text-2xl text-center text-primary">Check-in Complete!</CardTitle>
            <CardDescription className="text-center">
              Thank you for completing your check-in. We look forward to hosting you at WhiteCloud Homestay.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsSubmitted(false)}>Submit Another</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="w-64 h-auto" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to WhiteCloud Homestay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a homely environment to stay while taking a break from travelling. 
            You will be sharing with like-minded travellers in a shared house situation with 5 bedrooms.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            We are within short walking distance to Bishopdale Village Mall where there is a library, PostShop, ATMs, New World supermarket, cafes and etc.
            We are also close to the bus stop and only 8 minutes drive from Christchurch airport.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="https://maps.app.goo.gl/Uvtcyke22f8rbdhX7" target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              <MapPin className="w-4 h-4 mr-1" /> Google Map Location
            </a>
            <a href="https://whitecloudhomes.netlify.app/" target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              <Globe className="w-4 h-4 mr-1" /> Visit our website
            </a>
            <a href="https://wa.me/message/QKHUHJ5Y273HL1" target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              <MessageCircle className="w-4 h-4 mr-1" /> Contact Us on WhatsApp
            </a>
            <a href="https://www.instagram.com/whitecloud_homes" target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              <Instagram className="w-4 h-4 mr-1" /> Instagram
            </a>
            <a href="https://www.facebook.com/profile.php?id=61551048270198" target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              <Facebook className="w-4 h-4 mr-1" /> Facebook
            </a>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-2xl">Check-in Form</CardTitle>
            <CardDescription>Please fill out this form prior to your arrival.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number / WhatsApp</Label>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          id="phone"
                          placeholder="+1 234 567 8900"
                          defaultCountry="NZ"
                          international
                          inputComponent={Input}
                          className="flex gap-2"
                        />
                      )}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="e.g. Australian" {...register('nationality')} />
                    {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input id="passportNumber" placeholder="Enter your passport number" {...register('passportNumber')} />
                    {errors.passportNumber && <p className="text-sm text-red-500">{errors.passportNumber.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Stay Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-2 flex flex-col">
                    <Label>Check-in Date</Label>
                    <Controller
                      control={control}
                      name="checkInDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger render={
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            />
                          }>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.checkInDate && <p className="text-sm text-red-500">{errors.checkInDate.message}</p>}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label>Check-out Date</Label>
                    <Controller
                      control={control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger render={
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            />
                          }>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.checkOutDate && <p className="text-sm text-red-500">{errors.checkOutDate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedArrivalTime">Estimated Arrival Time</Label>
                    <Input id="estimatedArrivalTime" type="time" {...register('estimatedArrivalTime')} />
                    {errors.estimatedArrivalTime && <p className="text-sm text-red-500">{errors.estimatedArrivalTime.message}</p>}
                  </div>

                  <div className="space-y-2 flex flex-col justify-end">
                    <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-10">
                      <Controller
                        control={control}
                        name="parkingRequired"
                        render={({ field }) => (
                          <Checkbox
                            id="parkingRequired"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="parkingRequired" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        Parking Required
                      </Label>
                    </div>
                  </div>

                  {parkingRequired && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="carPlate">Car Plate Number</Label>
                      <Input 
                        id="carPlate" 
                        placeholder="Enter your car plate number" 
                        {...register('carPlate')} 
                      />
                      {errors.carPlate && <p className="text-sm text-red-500">{errors.carPlate.message}</p>}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Agreements</h3>
                
                <div className="bg-white border rounded-md p-4 text-sm text-gray-700 space-y-4 h-64 overflow-y-auto">
                  <div>
                    <h4 className="font-semibold text-gray-900">1. Term of Agreement</h4>
                    <p>This agreement shall commence on [Check-in Date] and continue on a week-to-week basis. You may terminate this agreement by providing 14 days’ notice.<br/>
Notwithstanding the above, this agreement may be terminated immediately and without notice if you engage in illegal activity, physical violence, or behavior that seriously threatens the safety or well-being of other occupants.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">2. Rent</h4>
                    <p>You agree to pay the designated share of the weekly rent. The rent includes electricity, water, and internet. You are not permitted to sublet the room or allow other individuals to move into the property.<br/>
In any instance where a full seven-day weekly cycle is not completed, a pro-rata rate of $35.00 per day shall be applied for each day of occupancy.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">3. Bond</h4>
                    <p>At the end of this agreement, the bond will be refunded within 7 days. However, the bond may be withheld or subject to deductions if you:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Leave without providing the required 14 days' notice;</li>
                      <li>Owe outstanding rent;</li>
                      <li>Cause damage to the property;</li>
                      <li>Fail to clean and return the bedding to a tidy condition upon check-out.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">4. House Rules</h4>
                    <p>You agree to abide by all established house rules, maintain cleanliness in common areas, and respect the quiet enjoyment of all other occupants.</p>
                    <HouseRulesDialog />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">5. Liability</h4>
                    <p>You are responsible for the cost of repairing any damage caused to the premises or furnishings by yourself or your guests.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">6. Disputes</h4>
                    <p>If a disagreement arises that cannot be resolved through discussion, you agree to refer the matter to the Disputes Tribunal.</p>
                  </div>
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Controller
                    control={control}
                    name="agreeToRules"
                    render={({ field }) => (
                      <Checkbox
                        id="agreeToRules"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="agreeToRules" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree with the Flatting Agreement and House Rules
                    </Label>
                    {errors.agreeToRules && <p className="text-sm text-red-500 mt-2">{errors.agreeToRules.message}</p>}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Signature</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearSignature}
                      className="h-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  <div className={cn(
                    "border rounded-md bg-white overflow-hidden relative",
                    errors.signature ? "border-red-500" : "border-input"
                  )}>
                    {!signatureValue && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-300 text-2xl font-medium select-none">Sign here</span>
                      </div>
                    )}
                    <SignatureCanvas 
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{
                        className: "signature-canvas w-full h-40 cursor-crosshair relative z-10"
                      }}
                      onEnd={handleSignatureEnd}
                    />
                  </div>
                  {errors.signature && <p className="text-sm text-red-500">{errors.signature.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full text-lg py-6">Submit Check-in Form</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Details</DialogTitle>
            <DialogDescription>
              Please review your details before submitting.
            </DialogDescription>
          </DialogHeader>
          {formDataToSubmit && (
            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold text-gray-500">Full Name:</div>
                <div>{formDataToSubmit.fullName}</div>
                
                <div className="font-semibold text-gray-500">Gender:</div>
                <div>{formDataToSubmit.gender}</div>

                <div className="font-semibold text-gray-500">Email:</div>
                <div className="break-all">{formDataToSubmit.email}</div>

                <div className="font-semibold text-gray-500">Phone:</div>
                <div>{formDataToSubmit.phone}</div>

                <div className="font-semibold text-gray-500">Nationality:</div>
                <div>{formDataToSubmit.nationality}</div>

                <div className="font-semibold text-gray-500">Passport Number:</div>
                <div>{formDataToSubmit.passportNumber}</div>

                <div className="font-semibold text-gray-500">Check-in Date:</div>
                <div>{format(formDataToSubmit.checkInDate, 'dd MMM yyyy')}</div>

                <div className="font-semibold text-gray-500">Check-out Date:</div>
                <div>{format(formDataToSubmit.checkOutDate, 'dd MMM yyyy')}</div>
              </div>
            </div>
          )}
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit}>
              Confirm and Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
