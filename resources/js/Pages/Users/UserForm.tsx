import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleX, Save } from "lucide-react";

interface UserFormDialogProps {
    visible: boolean;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function UserFormDialog({ visible, title, onConfirm, onCancel }: UserFormDialogProps) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        alert('Form submitted');
        onConfirm();
    }

    return (
        <Dialog open={visible} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Make sure you fill all the required fields
                    </DialogDescription>
                </DialogHeader>
                <form id="form" className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" name="name" placeholder="Your Name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" name="email" placeholder="user@mail.com" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input type="password" id="password" name="password" placeholder="Enter your password" className="col-span-3" />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        <CircleX /> Cancel
                    </Button>
                    <Button type="submit" form="form">
                        <Save /> Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
