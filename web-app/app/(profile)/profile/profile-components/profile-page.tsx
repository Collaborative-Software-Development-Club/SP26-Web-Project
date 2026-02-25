import { Card } from "@/components/ui/card"
import EditName from "./modals/edit-name"
import profiles from "mock/profiles.json"
export default function ProfilePage() {
  const user = profiles[0];
  
  return (
    <div className="flex-1 mr-20 my-20">
      <Card className="h-full w-full p-4 rounded-l-none">
        <h2 className="text-2xl font-bold">Account</h2>
        <hr className="bg-gray-200 h-0.5"/>
        <Card className="border-none flex-row max-h-1/2 w-full items-center p-4">
          <img src={user.avatar_url} className="max-w-20 h-20 rounded-full flex-1 border-2"/>
          <Card className="border-none flex-1 p-4 shadow-none gap-1">
            <h3 className="text-lg">Name</h3>
            <p className="text-sm">{user.fname+" "+user.lname}</p>
            <EditName fname={user.fname} lname={user.lname} id={user.user_id}/>
          </Card>
          
        </Card>

        <Card className="p-4 gap-1">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <hr className="bg-gray-200 h-0.5"/>
          <h3 className="text-lg ml-4 mt-4">Bio</h3>
          <p className="ml-4 text-sm">{user.bio}</p>
        </Card>
        
        
      </Card>
      
    </div>
  )
}
