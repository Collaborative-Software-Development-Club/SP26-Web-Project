import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import hobbies from "@/mock/hobbies.json";

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
        {Object.entries(hobbies).map(([category, list]) => (
  <section key={category}>
    <h2>{category}</h2>
    {list.map((name) => (
      <span key={name}>{name}</span>
    ))}
  </section>
))}
      </DialogContent>
    </Dialog>
  );
}
