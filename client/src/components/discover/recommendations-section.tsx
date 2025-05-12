import { 
  useUserRecommendations, 
  getMatchPercentage, 
  type UserRecommendation 
} from "@/hooks/use-recommendations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MessageSquare, UserPlus, Percent, Users } from "lucide-react";

interface RecommendationsSectionProps {
  userId: number;
  onConnect: (userId: number) => void;
  onMessage: (userId: number) => void;
}

export default function RecommendationsSection({ 
  userId, 
  onConnect, 
  onMessage 
}: RecommendationsSectionProps) {
  const { data: recommendations, isLoading } = useUserRecommendations(userId);
  
  // Get user initials for avatar fallback
  const getInitials = (firstName: string | null, lastName: string | null, username: string) => {
    if (firstName) {
      return firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
    }
    return username.charAt(0).toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-xl font-semibold gradient-text mb-4">Finding matches for you...</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hidden">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-[300px] min-w-[300px] flex-shrink-0 animate-pulse glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mr-3"></div>
                  <div>
                    <div className="h-4 bg-primary/20 rounded w-[120px] mb-2"></div>
                    <div className="h-3 bg-primary/10 rounded w-[80px]"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-[80%] mb-2"></div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-gray-100 rounded-full w-16"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="py-6 text-center glass-card p-8">
        <div className="bg-primary bg-opacity-10 p-4 rounded-full inline-block mb-3 pulse">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-1 gradient-text">No matches found yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add more interests to your profile to help us find people with similar interests. 
          The more interests you add, the better our matching algorithm works!
        </p>
        <Button variant="outline" className="mt-4">
          <span className="mr-2">+</span> Add Interests
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold gradient-text">
          <Percent className="inline-block h-5 w-5 mr-2" />
          People with similar interests
        </h2>
        <Tabs defaultValue="best" className="w-[200px]">
          <TabsList>
            <TabsTrigger value="best">Best Match</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hidden" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {recommendations.map((recommendation: UserRecommendation) => (
          <RecommendationCard 
            key={recommendation.user.id}
            recommendation={recommendation}
            onConnect={() => onConnect(recommendation.user.id)}
            onMessage={() => onMessage(recommendation.user.id)}
            getInitials={getInitials}
          />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: UserRecommendation;
  onConnect: () => void;
  onMessage: () => void;
  getInitials: (firstName: string | null, lastName: string | null, username: string) => string;
}

function RecommendationCard({ 
  recommendation, 
  onConnect, 
  onMessage,
  getInitials
}: RecommendationCardProps) {
  const { user, similarityScore, sharedInterests } = recommendation;
  const matchPercent = getMatchPercentage(similarityScore);
  
  return (
    <Card className="w-[300px] min-w-[300px] flex-shrink-0 glass-card hover:shadow-md transition-all recommendation-card">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={user.profileImageUrl || ''} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
              {getInitials(user.firstName, user.lastName, user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {user.firstName || user.username}
            </CardTitle>
            <Badge variant="secondary" className="mt-1 match-badge">
              {matchPercent} match
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.bio && (
          <CardDescription className="line-clamp-2 mb-2">
            {user.bio}
          </CardDescription>
        )}
        
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1">
            Shared interests:
          </p>
          <div className="flex flex-wrap gap-1">
            {sharedInterests.map(interest => (
              <Badge key={interest.id} variant="outline" className="text-xs">
                {interest.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={onMessage}>
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
        <Button size="sm" className="flex-1" onClick={onConnect}>
          <UserPlus className="h-4 w-4 mr-1" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}