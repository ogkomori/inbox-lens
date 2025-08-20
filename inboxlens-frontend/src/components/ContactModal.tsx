import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
            <Input placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input type="email" placeholder="your.email@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
            <Textarea placeholder="Your message..." className="min-h-[120px]" />
          </div>
          <Button variant="hero" className="w-full" type="submit">Send Message</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
