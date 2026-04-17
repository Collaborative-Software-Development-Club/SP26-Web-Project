import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import hobbiesData from "@/mock/hobbies.json";

export function HobbyDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" variant="outline">Add Hobbies</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Hobbies</DialogTitle>
        </DialogHeader>
        {hobbiesData.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold capitalize">{section.category}</h2>
            {section.hobbies.map((h) => (
              <Button key={h.hobby_id} type="button" variant="outline" size="sm" className="mr-2 mt-2 capitalize">
                {h.name}
              </Button>
            ))}
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
