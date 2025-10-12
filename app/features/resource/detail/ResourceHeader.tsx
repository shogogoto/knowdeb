// import { Badge } from "lucide-react";
// import UserAvatar from "~/features/user/UserAvatar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "~/shared/components/ui/card";
// import type { ResourceInfo } from "~/shared/generated/fastAPI.schemas";
//
// type Props = { info: ResourceInfo };
//
// export default function ResourceHeader({ info }: Props) {
//   const { resource, user, resource_stats } = info;
//
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{resource.name}</CardTitle>
//         <CardDescription className="flex gap-2">
//           <span>by</span>
//           <UserAvatar user={user} />
//           <span>{user.display_name}</span>
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-wrap gap-2">
//         {Object.entries(resource_stats).map(([key, value]) => (
//           <Badge key={key} variant="secondary">
//             {key}: {typeof value === "number" ? value.toFixed(2) : value}
//           </Badge>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }
