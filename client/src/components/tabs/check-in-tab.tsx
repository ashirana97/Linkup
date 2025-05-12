import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TabContent } from "@/components/ui/tab";
import { useCreateCheckin } from "@/hooks/use-checkins";
import { useLocations, useActivities, useInterests } from "@/hooks/use-locations";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location, Activity, Interest } from "@shared/schema";
import { Search } from "lucide-react";

interface CheckInTabProps {
  active: boolean;
}

// Form schema
const checkInSchema = z.object({
  locationId: z.number({
    required_error: "Please select a location",
  }),
  activityId: z.number({
    required_error: "Please select what you're doing",
  }),
  note: z.string().optional(),
  duration: z.string().default("1"),
  interestIds: z.array(z.number()).optional(),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

const CheckInTab = ({ active }: CheckInTabProps) => {
  const [, setLocation] = useLocation();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const { data: allInterests, isLoading: interestsLoading } = useInterests();
  
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const createCheckin = useCreateCheckin();
  
  // Create form
  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      note: "",
      duration: "1",
      interestIds: [],
    },
  });
  
  // Handle form submission
  const onSubmit = (values: CheckInFormValues) => {
    // Add the interest IDs
    values.interestIds = selectedInterests.map(interest => interest.id);
    
    // Use the first user ID for now (in a real app this would come from auth)
    createCheckin.mutate({
      userId: 1,
      ...values,
    }, {
      onSuccess: () => {
        // Navigate to discover tab
        setLocation("/");
      }
    });
  };
  
  // Add interest to selection
  const addInterest = (interest: Interest) => {
    if (!selectedInterests.some(i => i.id === interest.id)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setSearchTerm("");
  };
  
  // Remove interest from selection
  const removeInterest = (interestId: number) => {
    setSelectedInterests(selectedInterests.filter(i => i.id !== interestId));
  };
  
  // Filter interests based on search term
  const filteredInterests = allInterests?.filter(interest => 
    interest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedInterests.some(i => i.id === interest.id)
  ).slice(0, 5);
  
  return (
    <TabContent id="checkin" active={active}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Check In</h1>
          <p className="text-sm text-gray-500">Let others know you're here</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold text-lg mb-3">Where are you?</h2>
            
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search locations..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <h3 className="font-medium mb-2 text-gray-700">Nearby Locations</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {locationsLoading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-14 bg-gray-200 rounded-lg"></div>
                        <div className="h-14 bg-gray-200 rounded-lg"></div>
                      </div>
                    ) : locations && locations.length > 0 ? (
                      locations.map(loc => (
                        <div 
                          key={loc.id}
                          className={`flex items-center p-3 border ${field.value === loc.id ? 'border-primary' : 'border-gray-200'} rounded-lg cursor-pointer hover:bg-gray-50`}
                          onClick={() => form.setValue('locationId', loc.id)}
                        >
                          <i className={`${loc.icon} text-xl text-primary mr-3`}></i>
                          <div>
                            <p className="font-medium">{loc.name}</p>
                            <p className="text-xs text-gray-500">{loc.address}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No locations found</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold text-lg mb-3">What are you doing?</h2>
            
            <FormField
              control={form.control}
              name="activityId"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {activitiesLoading ? (
                      <>
                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      </>
                    ) : activities && activities.length > 0 ? (
                      activities.map(activity => (
                        <button
                          key={activity.id}
                          type="button"
                          className={`py-3 px-4 border ${field.value === activity.id ? 'border-primary text-primary' : 'border-gray-200 text-gray-700'} font-medium rounded-lg hover:bg-gray-50`}
                          onClick={() => form.setValue('activityId', activity.id)}
                        >
                          <i className={`${activity.icon} mr-2`}></i>
                          {activity.name}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-gray-500 py-4">No activities found</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Add a note (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share what you're working on or what kind of people you'd like to meet..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="font-medium my-3 text-gray-700">Relevant interests</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedInterests.map(interest => (
                <span key={interest.id} className="bg-primary bg-opacity-10 text-primary rounded-full px-3 py-1.5 text-sm flex items-center">
                  {interest.name}
                  <button 
                    type="button"
                    className="ml-1 text-xs"
                    onClick={() => removeInterest(interest.id)}
                  >
                    ✕
                  </button>
                </span>
              ))}
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="+ Add interest"
                  className="border border-dashed border-gray-300 text-gray-500 rounded-full px-3 py-1.5 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {searchTerm && filteredInterests && filteredInterests.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md z-10">
                    {filteredInterests.map(interest => (
                      <div
                        key={interest.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addInterest(interest)}
                      >
                        {interest.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Check-in duration</FormLabel>
                  <div className="flex justify-between items-center border border-gray-200 rounded-lg p-3 mb-6">
                    <div>
                      <p className="font-medium">How long will you be here?</p>
                      <p className="text-xs text-gray-500">Your check-in will expire after this time</p>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="1 hour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-6"
              disabled={createCheckin.isPending}
            >
              {createCheckin.isPending ? "Checking in..." : "Check In Now"}
            </Button>
          </div>
        </form>
      </Form>
    </TabContent>
  );
};

export default CheckInTab;
