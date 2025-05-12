import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendConnectionRequest } from "@/hooks/use-connection-requests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

interface ConnectionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
  targetUser: User;
  onSuccess?: () => void;
}

const ConnectionRequestDialog = ({
  open,
  onOpenChange,
  currentUser,
  targetUser,
  onSuccess,
}: ConnectionRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const sendRequest = useSendConnectionRequest();

  const getInitials = (firstName: string | null, lastName: string | null, username: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      return firstName.charAt(0);
    }
    return username.substring(0, 2).toUpperCase();
  };

  const handleSendRequest = async () => {
    try {
      await sendRequest.mutateAsync({
        senderId: currentUser.id,
        receiverId: targetUser.id,
        message: message.trim() || undefined,
      });
      
      toast({
        title: "Request sent!",
        description: message.trim() 
          ? "Your message has been sent to the user."
          : "Wave sent! The user will be notified of your interest.",
      });
      
      onOpenChange(false);
      setMessage("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to send connection request:", error);
      toast({
        title: "Failed to send request",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const targetUserInitials = getInitials(
    targetUser.firstName,
    targetUser.lastName,
    targetUser.username
  );

  const targetUserFullName = 
    targetUser.firstName && targetUser.lastName
      ? `${targetUser.firstName} ${targetUser.lastName}`
      : targetUser.username;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Connect with {targetUserFullName}
          </DialogTitle>
          <DialogDescription>
            Send a message or just wave to initiate a connection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 my-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={targetUser.profileImageUrl || undefined} 
              alt={targetUserFullName} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {targetUserInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{targetUserFullName}</p>
            <p className="text-sm text-gray-500">{targetUser.bio || "No bio"}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Textarea
            placeholder="Write a message or leave blank to just wave..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 text-right">
            {message.length}/200 characters
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            disabled={sendRequest.isPending}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            {message.trim() ? "Send Message" : "Wave 👋"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionRequestDialog;