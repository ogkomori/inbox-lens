import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; message?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) newErrors.name = "Name can't be empty.";
    if (!email.trim()) {
      newErrors.email = "Email can't be empty.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) newErrors.message = "Message can't be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(false);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || "";
      const res = await fetch(`${backendUrl}/api/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 200) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
        toast({
          title: "Message sent!",
          description: "Your message was sent successfully.",
          className: "bg-green-500 text-white"
        });
      } else {
        setSuccess(false);
        toast({ title: "Message not sent", description: "There was a problem sending your message. Please try again.", variant: "destructive" });
      }
    } catch {
      setSuccess(false);
      toast({ title: "Message not sent", description: "There was a problem sending your message. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form and errors when modal is closed
  React.useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
            {errors.name && <div className="text-red-600 text-xs mb-1">{errors.name}</div>}
            <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            {errors.email && <div className="text-red-600 text-xs mb-1">{errors.email}</div>}
            <Input type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
            {errors.message && <div className="text-red-600 text-xs mb-1">{errors.message}</div>}
            <Textarea placeholder="Your message..." className="min-h-[120px]" value={message} onChange={e => setMessage(e.target.value)} />
          </div>
          <Button variant="hero" className="w-full" type="submit" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid mr-2"></span>
                Sending...
              </span>
            ) : "Send Message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
