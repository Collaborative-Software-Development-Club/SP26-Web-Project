import { Card } from "@/components/ui/card"
import EditBio from "./modals/edit-bio";
import profiles from "mock/profiles.json"
import SelectHobbies from "./modals/hobby-select";
export default function ProfilePage() {
  const user = profiles[0];
  const images = ["demo/room1.png","demo/room2.png","add-img.webp"];
  return (
    <>
      <Card className="h-full w-full overflow-auto rounded-none border-none p-6 shadow-none min-h-0">
        
        {/* Header */}
        <Card className="flex items-start gap-4 border-none bg-transparent p-0 shadow-none">
          <img
            src="demo/selfie.png"
            className="h-30 w-30 rounded-full border-2 border-gray-200 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.fname + " " + user.lname}
            </h2>
          </div>
        </Card>
        <Card className="flex flex-row border-none rounded-none shadow-none">
          {/* About Section */}
          <Card className="flex-1 mt-6 rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">About You</h2>
            <hr className="my-1 h-px border-0 bg-gray-200" />

            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Bio</h3>
                <EditBio bio={user.bio}/>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800">Hobbies</h3>
                <div className="mt-1 flex flex-row">
                  <Card className="flex-1 flex flex-wrap flex-row gap-1 rounded-xl border-none bg-gray-100 p-2 shadow-none">
                    {user.hobbies.map((hobby) => (
                      <Card
                        key={hobby}
                        className="rounded-md border border-gray-200 bg-white px-3 p-3 text-sm text-gray-700 shadow-none"
                      >
                        {hobby}
                      </Card>
                    ))}
                  </Card>
                  <SelectHobbies />
                </div>
              </div>
            </div>
          </Card>

          {/* Room Images */}
          <Card className="mt-6 flex-1 flex flex-row flex-wrap gap-4 border-gray-200 bg-transparent p-6">
            {images.map((image)=>
             (
              <img
              src={image} key={image} 
              className="w-full max-w-45 max-h-45 rounded-xl border border-gray-200 object-cover"
            />
            ))}
          </Card>
        </Card>
        
      </Card>
    </>
  )
}
